<template>
  <ion-page>
    <ion-content class="speaker-detail">
      <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/tabs/speakers"></ion-back-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button @click="openContact">
              <ion-icon :ios="callOutline" :md="callSharp" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button @click="openSpeakerShare">
              <ion-icon :ios="shareOutline" :md="shareSharp" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <div class="speaker-background">
        <img
          :src="speaker?.profilePic"
          :alt="speaker?.name"
        />
        <h2>{{ speaker?.name || 'Loading...' }}</h2>
      </div>

      <div class="ion-padding speaker-detail">
        <p>{{ speaker?.about || 'Loading biography...' }} Say hello on social media!</p>

        <hr />

        <ion-chip
          color="twitter"
          button
          @click="openExternalUrl('https://twitter.com/' + speaker?.twitter)"
          aria-label="Visit Twitter profile"
        >
          <ion-icon :icon="logoTwitter"></ion-icon>
          <ion-label>Twitter</ion-label>
        </ion-chip>

        <ion-chip
          color="dark"
          button
          @click="openExternalUrl('https://github.com/' + speaker?.github)"
          aria-label="Visit GitHub profile"
        >
          <ion-icon :icon="logoGithub"></ion-icon>
          <ion-label>GitHub</ion-label>
        </ion-chip>

        <ion-chip
          color="instagram"
          button
          @click="openExternalUrl('https://instagram.com/' + speaker?.instagram)"
          aria-label="Visit Instagram profile"
        >
          <ion-icon :icon="logoInstagram"></ion-icon>
          <ion-label>Instagram</ion-label>
        </ion-chip>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
/*
 * Speaker Background
 */

ion-toolbar {
  --background: transparent;
  --color: white;

  position: absolute;

  top: 0;
  right: 0;
  left: 0;
}

ion-toolbar ion-button,
ion-toolbar ion-back-button,
ion-toolbar ion-menu-button {
  --color: white;
}

.speaker-background {
  display: flex;
  position: relative;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  height: calc(250px + var(--ion-safe-area-top));

  padding-top: var(--ion-safe-area-top);

  background: center / cover url('/assets/img/speaker-background.png') no-repeat;
}

.speaker-background img {
  width: 70px;
  height: 70px;

  margin-top: calc(-1 * var(--ion-safe-area-top));

  border-radius: 50%;
}

.speaker-background h2 {
  position: absolute;

  bottom: 10px;

  color: white;
}

.md .speaker-background {
  box-shadow: rgb(0 0 0 / 20%) 0 3px 1px -2px, rgb(0 0 0 / 14%) 0 2px 2px 0,
    rgb(0 0 0 / 12%) 0 1px 5px 0;
}

.ios .speaker-background {
  box-shadow: rgb(0 0 0 / 12%) 0 4px 16px;
}

/*
 * Speaker Details
 */

.speaker-detail p {
  margin-right: 6px;
  margin-left: 6px;
}

.speaker-detail hr {
  margin-top: 20px;
  margin-bottom: 20px;

  background: var(--ion-color-step-150, #d7d8da);
}

ion-chip[color="twitter"] {
  --background: #1da1f2;
  --color: white;
}

ion-chip[color="instagram"] {
  --background: #e1306c;
  --color: white;
}
</style>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { Speaker } from '@/store/modules/speakers';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonBackButton,
  IonChip,
  IonLabel,
  actionSheetController
} from '@ionic/vue';
import {
  logoTwitter,
  logoGithub,
  logoInstagram,
  callOutline,
  callSharp,
  shareOutline,
  shareSharp,
  mailOutline,
  phonePortraitOutline
} from "ionicons/icons";
import { useRoute } from 'vue-router';
import { useStore } from '@/store';

declare global {
  interface Window {
    cordova?: {
      plugins: {
        clipboard: {
          copy: (text: string) => void;
        };
      };
    };
  }
}

const store = useStore();
const route = useRoute();

const currentSpeaker = ref<Speaker | null>(null);

// Ensure data is loaded before mounting
onBeforeMount(async () => {
  if (store.state.speakers.speakers.length === 0) {
    await store.dispatch('loadSpeakerData');
  }
  // Set the initial speaker data
  const speakerId = route.params.speakerId;
  if (speakerId) {
    currentSpeaker.value = store.state.speakers.speakers.find(
      (s: Speaker) => s.id === parseInt(speakerId.toString())
    ) || null;
  }
});

// Use currentSpeaker instead of the computed property
const speaker = computed(() => currentSpeaker.value);

// Watch for route changes to update the speaker data
watch(() => route.params.speakerId, (newId) => {
  if (newId) {
    currentSpeaker.value = store.state.speakers.speakers.find(
      (s: Speaker) => s.id === parseInt(newId.toString())
    ) || null;
  }
});

const openContact = async () => {
  if (!speaker.value) return;

  const actionSheet = await actionSheetController.create({
    header: 'Contact ' + speaker.value.name,
    buttons: [
      {
        text: `Email ( ${speaker.value.email} )`,
        icon: mailOutline,
        handler: () => {
          if (speaker.value?.email) {
            window.open('mailto:' + speaker.value.email);
          }
        }
      },
      {
        text: `Call ( ${speaker.value.phone} )`,
        icon: phonePortraitOutline,
        handler: () => {
          if (speaker.value?.phone) {
            window.open('tel:' + speaker.value.phone);
          }
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
    ]
  });

  await actionSheet.present();
};

const openSpeakerShare = async () => {
  if (!speaker.value) return;

  const actionSheet = await actionSheetController.create({
    header: 'Share ' + speaker.value.name,
    buttons: [
      {
        text: 'Copy Link',
        handler: () => {
          if (speaker.value?.twitter) {
            const twitterUrl = 'https://twitter.com/' + speaker.value.twitter;
            console.log('Copy link clicked on ' + twitterUrl);
            if (window.cordova?.plugins?.clipboard) {
              window.cordova.plugins.clipboard.copy(twitterUrl);
            }
          }
        }
      },
      {
        text: 'Share via ...'
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
    ]
  });

  await actionSheet.present();
};

const openExternalUrl = (url: string) => {
  window.open(url, '_blank');
};
</script>
