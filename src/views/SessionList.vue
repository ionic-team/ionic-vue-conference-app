<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-segment :value="segment" @ionChange="updateSegment">
          <ion-segment-button value="all">All</ion-segment-button>
          <ion-segment-button value="favorites">Favorites</ion-segment-button>
        </ion-segment>

        <ion-buttons slot="end">
          <ion-button @click="presentFilter">
            <ion-icon slot="icon-only" :icon="options"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Schedule</ion-title>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar
            v-model="queryText"
            :debounce="500"
            @ionInput="updateSearchTerm($event)"
            placeholder="Search"
          ></ion-searchbar>
        </ion-toolbar>
      </ion-header>
      <ion-list v-show="allGroupedComputed?.length > 0">
        <ion-item-group v-for="group in allGroupedComputed" :key="group.id">
          <ion-item-divider sticky>
            <ion-label>{{ dateFormat(group.startTime, "h:mm a") }}</ion-label>
          </ion-item-divider>

          <ion-item-sliding
            v-for="session in group.sessions"
            :key="session.id"
            :data-track="session.tracks[0].toLowerCase()"
          >
            <ion-item button @click="goToSessionDetail(session)">
              <ion-label :style="getLabelStyle(session.tracks[0])">
                <h3>{{ session.tracks[0] }} - {{ session.name }}</h3>
                <p>
                  {{ dateFormat(session.dateTimeStart, "h:mm a") }} &mdash;
                  {{ dateFormat(session.dateTimeEnd, "h:mm a") }}:
                  {{ session.location }}
                </p>
              </ion-label>
            </ion-item>
            <ion-item-options>
              <ion-item-option
                color="favorite"
                @click="addFavorite($event, session)"
                v-if="segment === 'all'"
                >Favorite</ion-item-option
              >
              <ion-item-option
                color="danger"
                @click="removeFavorite($event, session, 'Remove Favorite')"
                v-if="segment === 'favorites'"
                >Remove</ion-item-option
              >
            </ion-item-options>
          </ion-item-sliding>
        </ion-item-group>
      </ion-list>

      <ion-list-header v-show="allGroupedComputed?.length === 0"
        >No Sessions Found</ion-list-header
      >
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" ref="fab">
        <ion-fab-button ref="fabButton">
          <ion-icon :icon="shareSocial"></ion-icon>
        </ion-fab-button>
        <ion-fab-list ref="fabList" side="top">
          <ion-fab-button color="vimeo" @click="openSocial('Vimeo')">
            <ion-icon :icon="logoVenmo"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="google" @click="openSocial('Google+')">
            <ion-icon :icon="logoGoogle"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="twitter" @click="openSocial('Twitter')">
            <ion-icon :icon="logoTwitter"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="facebook" @click="openSocial('Facebook')">
            <ion-icon :icon="logoFacebook"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<style scoped></style>

<script setup lang="ts">
import { ref, onMounted, watch, ComputedRef } from "vue";
import { dateFormat } from "@/filters/dateFormat";
import { useStore } from "vuex";
import SessionListFilter from "./SessionListFilter.vue";

import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonContent,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonListHeader,
  IonFab,
  IonFabButton,
  IonFabList,
  alertController,
  modalController,
  loadingController,
  menuController,
  IonRouterOutlet,
} from "@ionic/vue";
import {
  shareSocial,
  logoVenmo,
  logoGoogle,
  logoTwitter,
  logoFacebook,
  options,
} from "ionicons/icons";
import { useIonRouter } from "@ionic/vue";
import { computed } from "vue";

type GroupedSession = {
  id: string;
  startTime: string;
  sessions: Session[];
};

type Session = {
  id: number;
  dateTimeStart: string;
  dateTimeEnd: string;
  name: string;
  location: string;
  description: string;
  speakerIds: number[];
  tracks: string[];
};

const segment = ref("all");
const queryText = ref("");
const fab = ref<HTMLIonFabElement | null>(null);
const fabButton = ref(null);
const fabList = ref(null);
const store = useStore();
const ionRouter = useIonRouter();
const allGroupedRef = ref<GroupedSession[]>([]);
const allGroupedComputed = computed(() => {
  return allGroupedRef.value;
});

const groupedByStartTime = (sessions: Session[]): GroupedSession[] => {
  const sortedSessions = [...sessions].sort(
    (a, b) =>
      new Date(a.dateTimeStart).getTime() - new Date(b.dateTimeStart).getTime()
  );

  const groups: GroupedSession[] = sortedSessions.reduce(
    (acc: GroupedSession[], curr: Session) => {
      const sessionDate = new Date(curr.dateTimeStart);
      sessionDate.setMinutes(0, 0, 0);
      const startTime = sessionDate.toISOString();

      const existingGroup = acc.find((group) => group.startTime === startTime);

      if (existingGroup) {
        existingGroup.sessions.push(curr);
      } else {
        acc.push({ startTime, sessions: [curr] } as any);
      }

      return acc;
    },
    []
  );

  return groups;
};

const allGrouped = computed(() => {
  if (segment.value === "all") {
    return groupedByStartTime(store.getters.allFiltered);
  } else {
    return groupedByStartTime(store.getters.favoritesFiltered);
  }
});

watch(allGrouped, (newValue) => {
  allGroupedRef.value = newValue;
});

// Simulate dispatching the action
const addTrackFilter = (trackName: string) => {
  store.dispatch("addTrackFilter", trackName);
};

// Simulate dispatching the action
const removeTrackFilter = (trackName: string) => {
  store.dispatch("removeTrackFilter", trackName);
};

const getLabelStyle = (track: any) => {
  let colorVar = track === "Ionic" ? "primary" : track.toLowerCase();
  return {
    borderLeft: `2px solid var(--ion-color-${colorVar})`,
    paddingLeft: "10px",
  };
};

const addFavorite = async (event: any, session: any) => {
  if (store.state.sessions.favoriteSessions.indexOf(session.id) !== -1) {
    removeFavorite(event, session, "Favorite already added");
  } else {
    store.dispatch("addFavorite", session.id);

    const alert = await alertController.create({
      header: "Favorite Added",
      buttons: [
        {
          text: "OK",
          handler: () => {
            const slidingItem = event.target.closest("ion-item-sliding");
            slidingItem.close();
          },
        },
      ],
    });
    await alert.present();
  }
};

const removeFavorite = async (event: any, session: any, title: any) => {
  const alert = await alertController.create({
    header: title,
    message: "Would you like to remove this session from your favorites?",
    buttons: [
      {
        text: "Cancel",
        handler: () => {
          const slidingItem = event.target.closest("ion-item-sliding");
          slidingItem.close();
        },
      },
      {
        text: "Remove",
        handler: () => {
          store.dispatch("removeFavorite", session.id);

          const slidingItem = event.target.closest("ion-item-sliding");
          slidingItem.close();
        },
      },
    ],
  });
  await alert.present();
};

const goToSessionDetail = (session: any) => {
  ionRouter.push({
    name: "session-detail",
    params: { sessionId: session.id.toString() },
  });
};

const presentFilter = async () => {
  const modal = await modalController.create({
    component: SessionListFilter,
    presentingElement: IonRouterOutlet.nativeEl,
    componentProps: {
      excludedTracks: store.state.sessions.trackFilters,
      allTracks: store.getters.allTracksFilter,
    },
  });

  modal.componentProps!.onFiltersSelected = async (selectedTrackNames: any) => {
    if (selectedTrackNames.length === 0) {
      allGroupedRef.value = [];
    } else {
      await store.dispatch("loadSessionData");
      await store.dispatch("loadSpeakerData");
      await store.dispatch("fetchTracks");
      const previousTrackFilters = store.state.sessions.trackFilters;
      const addedTrackFilters = selectedTrackNames.filter(
        (track: any) => !previousTrackFilters.includes(track)
      );
      const removedTrackFilters = previousTrackFilters.filter(
        (track: any) => !selectedTrackNames.includes(track)
      );

      addedTrackFilters.forEach((track: any) =>
        store.dispatch("addTrackFilter", track)
      );
      removedTrackFilters.forEach((track: any) =>
        store.dispatch("removeTrackFilter", track)
      );
    }
  };

  await modal.present();
};

const updateSegment = (e: any) => {
  segment.value = e.detail.value;
};

const updateSearchTerm = (e: any) => {
  store.dispatch("setSearchText", e.detail.value);
};

const openSocial = async (network: any) => {
  if (fab.value) {
    const loading = await loadingController.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000 + 500) as number,
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.value.close();
  }
};

const checkAndLoadData = async () => {
  if (allGroupedRef.value.length === 0) {
    await store.dispatch("loadSessionData");
    await store.dispatch("loadSpeakerData");
    await store.dispatch("fetchTracks");
  }
};

onMounted(() => {
  menuController.enable(true);
  checkAndLoadData();
  watch(
    () => store.getters.allFiltered,
    (newAllFiltered) => {
      allGroupedRef.value = groupedByStartTime(newAllFiltered);
    }
  );
});
</script>

<style scoped></style>
