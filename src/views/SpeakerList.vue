<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Speakers</ion-title>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Speakers</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        <ion-grid fixed>
          <ion-row align-items-stretch>
            <ion-col
              size="12"
              size-md="6"
              v-for="speaker in speakers"
              :key="speaker.id"
            >
              <ion-card class="speaker-card">
                <ion-card-header>
                  <ion-item
                    :detail="false"
                    lines="none"
                    button
                    @click="goToSpeakerDetail(speaker)"
                  >
                    <ion-avatar slot="start">
                      <img
                        :src="speaker.profilePic"
                        alt="Speaker profile pic"
                      />
                    </ion-avatar>
                    <ion-label>
                      <h2>{{ speaker.name }}</h2>
                      <p>{{ speaker.title }}</p>
                    </ion-label>
                  </ion-item>
                </ion-card-header>

                <ion-card-content>
                  <ion-list lines="none">
                    <ion-item
                      v-for="session in sessionsBySpeaker(speaker.id)"
                      button
                      @click="goToSessionDetail(session)"
                      :key="session.id"
                    >
                      <h3>{{ session.name }}</h3>
                    </ion-item>

                    <ion-item button @click="goToSpeakerDetail(speaker)">
                      <h3>About {{ speaker.name }}</h3>
                    </ion-item>
                  </ion-list>
                </ion-card-content>

                <ion-row no-padding justify-content-center>
                  <ion-col text-left size="4">
                    <ion-button
                      fill="clear"
                      size="small"
                      color="primary"
                      @click="gotToOffsite('Tweet')"
                    >
                      <ion-icon :icon="logoTwitter" slot="start"></ion-icon
                      >Tweet
                    </ion-button>
                  </ion-col>
                  <ion-col text-center size="4">
                    <ion-button
                      fill="clear"
                      size="small"
                      color="primary"
                      @click="gotToOffsite('Share')"
                    >
                      <ion-icon :icon="share" slot="start"></ion-icon>Share
                    </ion-button>
                  </ion-col>
                  <ion-col text-right size="4">
                    <ion-button
                      fill="clear"
                      size="small"
                      color="primary"
                      @click="gotToOffsite('Contact')"
                    >
                      <ion-icon :icon="chatbubbles" slot="start"></ion-icon
                      >Contact
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Speaker } from "@/store/modules/speakers";
import { Session } from "@/store/modules/sessions";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonAvatar,
  loadingController,
} from "@ionic/vue";
import { share, logoTwitter, chatbubbles } from "ionicons/icons";

const store = useStore();
const router = useRouter();
const speakers = computed(() => store.state.speakers.speakers.concat().sort());

const sessionsBySpeaker = (speakerId: number) => {
  return store.state.sessions.sessions.filter((s: Session) =>
    s.speakerIds.includes(speakerId)
  );
};

const goToSessionDetail = (session: Session) => {
  router.push({
    name: "speaker-session-detail",
    params: { sessionId: session.id.toString() },
  });
};

const goToSpeakerDetail = (speaker: Speaker) => {
  router.push({
    name: "speaker-detail",
    params: { speakerId: speaker.id.toString() },
  });
};

const gotToOffsite = async (msg: string) => {
  const loading = await loadingController.create({
    message: msg,
    duration: Math.random() * 1000 + 500,
  });
  await loading.present();
  await loading.onWillDismiss();
};
</script>
