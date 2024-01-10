<template>
  <ion-page>
    <ion-content>
      <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button id="popover-button">
              <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <div class="about-header">
        <!-- Instead of loading an image each time the select changes, use opacity to transition them -->
        <div class="about-image madison" :style="{ 'opacity': location === 'madison' ? '1' : '0' }"></div>
        <div class="about-image austin" :style="{ 'opacity': location === 'austin' ? '1' : '0' }"></div>
        <div class="about-image chicago" :style="{ 'opacity': location === 'chicago' ? '1' : '0' }"></div>
        <div class="about-image seattle" :style="{ 'opacity': location === 'seattle' ? '1' : '0' }"></div>
      </div>

      <div class="about-info">
        <h3 class="ion-padding-top ion-padding-start">About</h3>

        <p class="ion-padding-start ion-padding-end">
          The Ionic Conference is a one-day conference on
          {{ dateFormat(conferenceDate, "MMM dd, yyyy") }}
          featuring talks from the Ionic team. It is focused on Ionic applications being built with Ionic Framework. This includes migrating apps to the latest version of the framework, Angular concepts, Webpack, Sass, and many other technologies used in Ionic 7. Tickets are completely sold out, and we’re expecting more than 1000 developers – making this the largest Ionic conference ever!
        </p>

        <h3 class="ion-padding-top ion-padding-start">Details</h3>

        <ion-list lines="none">
          <ion-item>
            <ion-select label="Location" v-model="location" :interfaceOptions="selectOptions">
              <ion-select-option value="madison">Madison, WI</ion-select-option>
              <ion-select-option value="austin">Austin, TX</ion-select-option>
              <ion-select-option value="chicago">Chicago, IL</ion-select-option>
              <ion-select-option value="seattle">Seattle, WA</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item :button="true" id="open-date-input">
            <ion-label>
              Date
            </ion-label>
            <ion-text slot="end">{{ dateFormat(conferenceDate, "MMM dd, yyyy") }}</ion-text>
            <ion-popover id="date-input-popover" trigger="open-date-input" :showBackdrop="false" side="top" alignment="end">
              <ion-datetime max="2056" v-model="conferenceDate" presentation="date"></ion-datetime>
            </ion-popover>
          </ion-item>
        </ion-list>

        <h3 class="ion-padding-top ion-padding-start">Internet</h3>

        <ion-list lines="none">
          <ion-item>
            <ion-label>
              Wifi network
            </ion-label>
            <ion-label class="ion-text-end">
              ica{{ dateFormat(conferenceDate, "y") }}
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              Password
            </ion-label>
            <ion-label class="ion-text-end">
              makegoodthings
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
      <ion-popover trigger="popover-button" :dismiss-on-select="true">
        <ion-content>
          <ion-list>
            <ion-item button @click="close('https://ionicframework.com/getting-started')">
              <ion-label>Learn Ionic</ion-label>
            </ion-item>
            <ion-item button @click="close('https://ionicframework.com/docs/')">
              <ion-label>Documentation</ion-label>
            </ion-item>
            <ion-item button @click="close('https://showcase.ionicframework.com')">
              <ion-label>Showcase</ion-label>
            </ion-item>
            <ion-item button @click="close('https://github.com/ionic-team/ionic')">
              <ion-label>GitHub Repo</ion-label>
            </ion-item>
            <ion-item button @click="support()">
              <ion-label>Support</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-popover>
    </ion-content>
  </ion-page>
</template>

<style scoped>
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

.about-header {
  position: relative;

  width: 100%;
  height: 30%;
}

.about-header .about-image {
  position: absolute;
  inset: 0;
  transition: opacity 500ms ease-in-out;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  opacity: 0;
}

.about-header .madison {
  background-image: url("../../public/assets/img/about/madison.jpg");
}

.about-header .austin {
  background-image: url("../../public/assets/img/about/austin.jpg");
}

.about-header .chicago {
  background-image: url("../../public/assets/img/about/chicago.jpg");
}

.about-header .seattle {
  background-image: url("../../public/assets/img/about/seattle.jpg");
}

.about-info {
  position: absolute;
  margin-top: -10px;
  border-radius: 10px;
  background: var(--ion-background-color, #ffffff);
  width: 100%;
}

.about-info h3 {
  margin-top: 0;
}

.about-info ion-list {
  padding-top: 0;
}

.about-info p {
  color: var(--ion-color-dark);

  line-height: 130%;
}

.about-info ion-icon {
  margin-inline-end: 32px;
}

#date-input-popover {
  --offset-y: -var(--ion-safe-area-bottom);
  --max-width: 90%;
  --width: 336px;
}

/*
 * iOS Only
 */

.ios .about-info {
  --ion-padding: 19px;
}

.ios .about-info h3 {
  font-weight: 700;
}

</style>


<script setup lang="ts">
import {
  IonPage,
  IonButton,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPopover,
  IonToolbar,
  IonIcon,
  IonButtons,
  IonList,
  IonLabel,
  IonDatetime,
  IonItem,
  IonText,
  IonSelect,
  IonSelectOption,
  popoverController,
} from '@ionic/vue';
import {
  ellipsisHorizontal,
} from "ionicons/icons";
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { dateFormat } from "@/filters/dateFormat";
import router from '@/router';

const store = useStore();
const location = ref('madison');
const conferenceDate = ref('2047-05-17');

const selectOptions = {
  header: 'Select a Location'
};

const close = async (url: string) => {
  const popover = await popoverController.getTop();
    if (popover) {
      window.open(url, '_blank');
      await popover.dismiss();
    }
}

const support = async () => {
    const popover = await popoverController.getTop();
    if (popover) {
      router.push('/support')
      await popover.dismiss();
    }
};

watch(location, (newLocation: string, oldLocation: string) => {
  const aboutImages = document.querySelectorAll<HTMLElement>('.about-image');
  aboutImages.forEach((image) => {
    const city = image.classList[1];
    image.style.opacity = newLocation === city ? '1' : '0';
  });
});

</script>
