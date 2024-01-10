<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ session ? session.name : '' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div padding v-if="session">
        <h1>{{ session.name }}</h1>
        <ion-grid no-padding>
          <ion-row>
            <ion-col size="6">
              <span
                v-for="track in session.tracks"
                :class="'session-track-' + track.toLowerCase()"
                :key="track.toLowerCase()"
              >{{ track }}</span>
            </ion-col>
            <ion-col
              size="6"
              text-right
              :class="favorites.indexOf(session.id) !== -1 ? 'show-favorite' : ''"
            >
            </ion-col>
          </ion-row>
        </ion-grid>
        <p>{{ session.description }}</p>
        <ion-text color="medium">
          {{ dateFormat(session.dateTimeStart, "h:mm a") }} &mdash; {{ dateFormat(session.dateTimeEnd, "h:mm a") }}
          <br>
          {{ session.location }}
        </ion-text>
      </div>

      <ion-list>
        <ion-item @click="sessionClick('Watched')" button>
          <ion-label color="primary">Watch</ion-label>
        </ion-item>
        <ion-item @click="sessionClick('Added to Calendar')" button>
          <ion-label color="primary">Add to Calendar</ion-label>
        </ion-item>
        <ion-item @click="sessionClick('Marked as Unwatched')" button>
          <ion-label color="primary">Mark as Unwatched</ion-label>
        </ion-item>
        <ion-item @click="sessionClick('Downloaded Video')" button>
          <ion-label color="primary">Download Video</ion-label>
          <ion-icon slot="end" color="primary" size="small" :icon="cloudDownload"></ion-icon>
        </ion-item>
        <ion-item @click="sessionClick('Left Feedback')" button>
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

.session-track-angular {
  color: var(--ion-color-angular);
}

.show-favorite {
  position: relative;
}

.icon-heart-empty {
  position: absolute;
  top: 5px;
  right: 5px;
  transform: scale(1);
  transition: transform 0.3s ease;
}

.icon-heart {
  position: absolute;
  top: 5px;
  right: 5px;
  transform: scale(0);
  transition: transform 0.3s ease;
}

.show-favorite .icon-heart {
  transform: scale(1);
}

.show-favorite .icon-heart-empty {
  transform: scale(0);
}
</style>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store";
import { dateFormat } from "@/filters/dateFormat";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonContent,
  IonList,
  IonLabel,
  IonItem,
  alertController,
  IonBackButton,
  IonTitle,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/vue';
import {
  heart,
  heartOutline,
  cloudDownload
} from "ionicons/icons";
import { Session } from '@/store/modules/sessions';

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonContent,
    IonList,
    IonLabel,
    IonItem,
    IonBackButton,
    IonTitle,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
   },
  setup() {
    const route = useRoute();
    const store = useStore();

    const session = ref<Session>();
    const favorites = ref<number[]>([]);

    const sessionClick = async (message: any) => {
      const alert = await alertController.create({
        message: `${message}`,
      });
      await alert.present();
    };

    onMounted(() => {
      session.value = store.state.sessions.sessions.find(
        (s) => s.id === parseInt(route.params.sessionId.toString())
      );
      favorites.value = store.state.sessions.favoriteSessions;
    });

    return {
      heart,
      heartOutline,
      cloudDownload,
      session,
      favorites,
      sessionClick,
      dateFormat,
    };
  },
};
</script>