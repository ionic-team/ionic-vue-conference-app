<template>
  <div>
    <ion-tabs ref="tabs">
      <ion-tab tab="schedule" :routes="'tabs.schedule'">
        <SessionList></SessionList>
        <!-- <SessionDetail></SessionDetail> -->
      </ion-tab>

      <!-- <ion-tab tab="speakers">
      <SpeakerList />-->
      <!-- <SpeakerDetail :speakerId="1"/> -->
      <!-- </ion-tab>
    <ion-tab tab="map">
      <Map />
    </ion-tab>
    <ion-tab tab="about">
      <About />
      </ion-tab>-->

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="schedule">
          <ion-label>Schedule</ion-label>
          <ion-icon name="calendar"/>
        </ion-tab-button>
      </ion-tab-bar>
      <!-- <ion-tab-button tab="speakers">
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
      </ion-tab-button>-->
    </ion-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>
