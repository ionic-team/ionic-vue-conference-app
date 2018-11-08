<template>
  <ion-tabs>
    <ion-tab tab="schedule">
      <SessionList />
    </ion-tab>
    <ion-tab tab="speakers">
      <SpeakerList />
    </ion-tab>
    <ion-tab tab="map">
      <Map />
    </ion-tab>
    <ion-tab tab="about">
      <About />
    </ion-tab>

    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="schedule">
        <ion-label>Schedule</ion-label>
        <ion-icon name="calendar" />
      </ion-tab-button>
      <ion-tab-button tab="speakers">
        <ion-icon name="contacts" />
        <ion-label>Speakers</ion-label>
      </ion-tab-button>
      <ion-tab-button tab="map">
        <ion-icon name="map" />
        <ion-label>Map</ion-label>
      </ion-tab-button>
      <ion-tab-button tab="about">
        <ion-icon name="information-circle" />
        <ion-label>About</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SessionList from '@/views/SessionList.vue';
import SpeakerList from '@/views/SpeakerList.vue';
import Map from '@/views/Map.vue';
import About from '@/views/About.vue';

@Component({
  components: {
    SessionList,
    SpeakerList,
    Map,
    About
  }
})
export default class Home extends Vue {
  get tabname() {
    return this.$route.params.tabs;
  }
}
</script>
