<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons v-if="!showSearchbar" slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-segment v-if="isIos" :value="segment" @ionChange="updateSegment">
          <ion-segment-button value="all">All</ion-segment-button>
          <ion-segment-button value="favorites">Favorites</ion-segment-button>
        </ion-segment>

        <ion-title v-if="!isIos && !showSearchbar">Schedule</ion-title>

        <ion-searchbar
          v-if="showSearchbar"
          show-cancel-button="always"
          v-model="queryText"
          @ionInput="updateSearchTerm"
          @ionCancel="showSearchbar = false"
          placeholder="Search"
        ></ion-searchbar>

        <ion-buttons slot="end">
          <ion-button v-if="!isIos && !showSearchbar" @click="showSearchbar = true">
            <ion-icon slot="icon-only" :icon="search"></ion-icon>
          </ion-button>
          <ion-button v-if="!showSearchbar" @click="presentFilter">
            <span v-if="isIos">Filter</span>
            <span v-else>
              <ion-icon slot="icon-only" :icon="options"></ion-icon>
            </span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <ion-toolbar v-if="!isIos">
        <ion-segment :value="segment" @ionChange="updateSegment">
          <ion-segment-button value="all">All</ion-segment-button>
          <ion-segment-button value="favorites">Favorites</ion-segment-button>
        </ion-segment>
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
            @ionInput="updateSearchTerm"
            placeholder="Search"
          ></ion-searchbar>
        </ion-toolbar>
      </ion-header>

      <ion-list v-show="allGroupedComputed?.length > 0">
        <ion-item-group v-for="group in allGroupedComputed" :key="group.id" :hidden="group.hide">
          <ion-item-divider sticky>
            <ion-label>{{ group.startTime }}</ion-label>
          </ion-item-divider>

          <ion-item-sliding
            v-for="session in group.sessions"
            :key="session.id"
            :data-track="session.tracks[0].toLowerCase()"
            :hidden="session.hide"
            ref="slidingItem"
          >
            <ion-item :router-link="'/tabs/schedule/session/' + session.id">
              <ion-label>
                <h3>{{ session.name }}</h3>
                <p>
                  {{ session.timeStart }} &mdash; {{ session.timeEnd }}:
                  {{ session.location }}
                </p>
              </ion-label>
            </ion-item>
            <ion-item-options>
              <ion-item-option
                v-if="segment === 'all'"
                color="favorite"
                @click="addFavorite($event, session)"
              >
                Favorite
              </ion-item-option>
              <ion-item-option
                v-if="segment === 'favorites'"
                color="danger"
                @click="removeFavorite($event, session, 'Remove Favorite')"
              >
                Remove
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-item-group>
      </ion-list>

      <ion-list-header v-show="allGroupedComputed?.length === 0">
        No Sessions Found
      </ion-list-header>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end" ref="fab">
        <ion-fab-button>
          <ion-icon :icon="shareSocial"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button color="vimeo" @click="openSocial('Vimeo')">
            <ion-icon :icon="logoVimeo"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="instagram" @click="openSocial('Instagram')">
            <ion-icon :icon="logoInstagram"></ion-icon>
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

<style scoped>
  ion-fab-button {
    --background: var(--ion-color-step-150, #ffffff);
    --background-hover: var(--ion-color-step-200, #f2f2f2);
    --background-focused: var(--ion-color-step-250, #d9d9d9);
    --color: var(--ion-color-primary, #3880ff);
  }

  /*
   * Material Design uses the ripple for activated
   * so only style the iOS activated background
   */
  .ios ion-fab-button {
    --background-activated: var(--ion-color-step-250, #d9d9d9);
  }

  /* Ionic track */
  ion-item-sliding[data-track="ionic"] ion-label {
    padding-left: 10px;
    border-left: 2px solid var(--ion-color-primary);
  }

  /* Angular track */
  ion-item-sliding[data-track="angular"] ion-label {
    padding-left: 10px;
    border-left: 2px solid #ac282b;
  }

  /* Communication track */
  ion-item-sliding[data-track="communication"] ion-label {
    padding-left: 10px;
    border-left: 2px solid #8e8d93;
  }

  /* Tooling track */
  ion-item-sliding[data-track="tooling"] ion-label {
    padding-left: 10px;
    border-left: 2px solid #fe4c52;
  }

  /* Services track */
  ion-item-sliding[data-track="services"] ion-label {
    padding-left: 10px;
    border-left: 2px solid #fd8b2d;
  }

  /* Design track */
  ion-item-sliding[data-track="design"] ion-label {
    padding-left: 10px;
    border-left: 2px solid #fed035;
  }

  /* Workshop track */
  ion-item-sliding[data-track="workshop"] ion-label {
    padding-left: 10px;
    border-left: 2px solid #69bb7b;
  }

  /* Food track */
  ion-item-sliding[data-track="food"] ion-label {
    padding-left: 10px;
    border-left: 2px solid #3bc7c4;
  }

  /* Documentation track */
  ion-item-sliding[data-track="documentation"] ion-label {
    padding-left: 10px;
    border-left: 2px solid #b16be3;
  }

  /* Navigation track */
  ion-item-sliding[data-track="navigation"] ion-label {
    padding-left: 10px;
    border-left: 2px solid #6600cc;
  }
</style>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";
import SessionListFilter from "./SessionListFilter.vue";
import { getMode } from '@ionic/core/components';

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
  logoVimeo,
  logoInstagram,
  logoTwitter,
  logoFacebook,
  options,
  search,
} from "ionicons/icons";
import { useIonRouter } from "@ionic/vue";

type GroupedSession = {
  id: string;
  startTime: string;
  sessions: Session[];
  hide?: boolean;
};

type Session = {
  id: number;
  timeStart: string;
  timeEnd: string;
  name: string;
  location: string;
  description: string;
  speakerIds: number[];
  tracks: string[];
  hide?: boolean;
};

const showSearchbar = ref(false);
const isIos = computed(() => {
  return getMode() === 'ios';
});

const segment = ref("all");
const queryText = ref("");
const fab = ref<HTMLIonFabElement | null>(null);
const store = useStore();
const ionRouter = useIonRouter();
const allGroupedRef = ref<GroupedSession[]>([]);
const allGroupedComputed = computed(() => {
  return allGroupedRef.value;
});

const slidingItem = ref(null);

const groupedByStartTime = (sessions: Session[]): GroupedSession[] => {
  const sortedSessions = [...sessions].sort(
    (a, b) => {
      const timeA = new Date(`1970-01-01 ${a.timeStart}`).getTime();
      const timeB = new Date(`1970-01-01 ${b.timeStart}`).getTime();
      return timeA - timeB;
    }
  );

  const groups: { [key: string]: Session[] } = {};

  // Group sessions by hour blocks but use first session's time as heading
  sortedSessions.forEach(session => {
    const startTime = new Date(`1970-01-01 ${session.timeStart}`);
    const hour = startTime.getHours();

    // Create a key for the hour block (e.g., "8" for 8:00-8:59)
    const hourKey = hour.toString();

    if (!groups[hourKey]) {
      // Use the first session's actual start time as the group heading
      groups[hourKey] = [];
    }
    groups[hourKey].push(session);
  });

  // Convert groups object to array format, using first session's time as display time
  return Object.entries(groups).map(([_, sessions]) => ({
    startTime: sessions[0].timeStart,
    sessions,
    id: sessions[0].timeStart
  }));
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

  modal.onDidDismiss().then(({ data }) => {
    if (data) {
      store.dispatch('updateTrackFilters', data);
    }
  });

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
