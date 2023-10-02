<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="schedule" href="/tabs/schedule">
          <ion-icon :icon="calendar" />
          <ion-label>Schedule</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="speakers" href="/tabs/speakers">
          <ion-icon :icon="people" />
          <ion-label>Speakers</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="map" href="/tabs/map">
          <ion-icon :icon="location" />
          <ion-label>Map</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="about" href="/tabs/about">
          <ion-icon :icon="informationCircle" />
          <ion-label>About</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon
} from '@ionic/vue';
import {
  calendar,
  people,
  location,
  informationCircle
} from 'ionicons/icons';

export default {
  components: {
    IonPage,
    IonTabs,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonIcon
  },
  data() {
    return {
      calendar,
      people,
      location,
      informationCircle,
    };
  },
};
</script>