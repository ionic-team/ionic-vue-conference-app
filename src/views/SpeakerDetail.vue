<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="Speakers"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ speaker ? speaker.name : '' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding class="speaker-detail">
      <div text-center v-if="speaker">
        <img :src="speaker.profilePic" :alt="speaker.name">
        <br>
        <ion-button fill="clear" size="small" color="twitter">
          <ion-icon :icon="logoTwitter" slot="icon-only"></ion-icon>
        </ion-button>
        <ion-button fill="clear" size="small" color="github">
          <ion-icon :icon="logoGithub" slot="icon-only"></ion-icon>
        </ion-button>
        <ion-button fill="clear" size="small" color="instagram">
          <ion-icon :icon="logoInstagram" slot="icon-only"></ion-icon>
        </ion-button>
      </div>

      <p>{{ speaker ? speaker.about : '' }}</p>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.speaker-detail img {
  max-width: 140px;
  border-radius: 50%;
}

.speaker-detail p {
  color: #60646b;
}
</style>

<script lang="ts" setup>
import { computed } from 'vue';
import { Speaker } from '@/store/modules/speakers';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonTitle,
  IonBackButton,
} from '@ionic/vue';
import {
  logoTwitter,
  logoGithub,
  logoInstagram
} from "ionicons/icons";
import { useRoute } from 'vue-router';
import { useStore } from '@/store';

const speaker = computed(() => {
  return store.state.speakers.speakers.find((s: Speaker) => s.id === parseInt(route.params.speakerId.toString()));
});

const store = useStore();
const route = useRoute();
</script>
