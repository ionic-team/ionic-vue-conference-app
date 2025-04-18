<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="defaultHref"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="toggleFavorite">
            <ion-icon v-if="!isFavorite" slot="icon-only" :icon="starOutline"></ion-icon>
            <ion-icon v-if="isFavorite" slot="icon-only" :icon="star"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon slot="icon-only" :icon="share"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding" v-if="session">
        <h1>{{ session.name }}</h1>
        <span
          v-for="track in session.tracks"
          :key="track"
          :class="'session-track-' + track.toLowerCase()"
        >{{ track }}</span>
        <p>{{ session.description }}</p>
        <ion-text color="medium">
          {{ session.timeStart }} &ndash; {{ session.timeEnd }}
          <br />
          {{ session.location }}
        </ion-text>
      </div>

      <ion-list>
        <ion-item button>
          <ion-label color="primary">Watch</ion-label>
        </ion-item>
        <ion-item button>
          <ion-label color="primary">Add to Calendar</ion-label>
        </ion-item>
        <ion-item button>
          <ion-label color="primary">Mark as Unwatched</ion-label>
        </ion-item>
        <ion-item button>
          <ion-label color="primary">Download Video</ion-label>
          <ion-icon
            slot="end"
            color="primary"
            size="small"
            :icon="cloudDownload"
          ></ion-icon>
        </ion-item>
        <ion-item button>
          <ion-label color="primary">Leave Feedback</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.session-track-ionic {
  color: var(--ion-color-primary);
}

.session-track-vue {
  color: var(--ion-color-vue);
}

.session-track-communication {
  color: var(--ion-color-communication);
}

.session-track-tooling {
  color: var(--ion-color-tooling);
}

.session-track-services {
  color: var(--ion-color-services);
}

.session-track-design {
  color: var(--ion-color-design);
}

.session-track-workshop {
  color: var(--ion-color-workshop);
}

.session-track-food {
  color: var(--ion-color-food);
}

.session-track-documentation {
  color: var(--ion-color-documentation);
}

.session-track-navigation {
  color: var(--ion-color-navigation);
}

/* Favorite Icon
 * --------------------------------------------------------
 */

.show-favorite {
  position: relative;
}

.icon-heart-empty,
.icon-heart {
  --border-radius: 50%;
  --padding-start: 0;
  --padding-end: 0;

  position: absolute;

  top: 5px;
  right: 5px;

  width: 48px;
  height: 48px;

  transition: transform 300ms ease;

  font-size: 16px;
}

.icon-heart-empty {
  transform: scale(1);
}

.icon-heart {
  transform: scale(0);
}

.show-favorite .icon-heart {
  transform: scale(1);
}

.show-favorite .icon-heart-empty {
  transform: scale(0);
}

h1 {
  margin: 0;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonLabel,
  IonItem,
  alertController,
  IonBackButton,
  IonText,
} from '@ionic/vue';
import {
  star,
  starOutline,
  share,
  cloudDownload
} from "ionicons/icons";
import { Session } from '@/store/modules/sessions';

const route = useRoute();
const store = useStore();
const defaultHref = "/tabs/schedule";

const session = ref<Session>();
const isFavorite = computed(() => {
  if (!session.value) return false;
  return store.state.sessions.favoriteSessions.includes(session.value.id);
});

const toggleFavorite = () => {
  if (!session.value) return;

  if (isFavorite.value) {
    store.dispatch("removeFavorite", session.value.id);
  } else {
    store.dispatch("addFavorite", session.value.id);
  }
};

onMounted(async () => {
  // Check if sessions are loaded, if not load them
  if (store.state.sessions.sessions.length === 0) {
    await store.dispatch("loadSessionData");
  }

  session.value = store.state.sessions.sessions.find(
    (s) => s.id === parseInt(route.params.sessionId.toString())
  );
});
</script>
