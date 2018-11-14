<template>
  <div class="ion-page">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss()">Cancel</ion-button>
        </ion-buttons>
        <ion-title>
          Filter Sessions
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="applyFilters()" strong>Done</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="outer-content">
      <ion-list>
        <ion-list-header>Tracks</ion-list-header>
        <ion-item v-for="track in allTracks" :key="track">
          <span slot="start" class="dot"></span>
          <ion-label>{{track}}</ion-label>
          <ion-toggle @ionChange="updateTrackFilter(track)" checked="excludedTracks.indexOf(track) !== -1" color="success"></ion-toggle>
        </ion-item>
      </ion-list>
      <ion-list>
        <ion-item @click="resetFilters()" detail="false" class="reset-filters">
          Reset All Filters
        </ion-item>
      </ion-list>
    </ion-content>
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
  import { Component, Prop, Vue, Inject } from 'vue-property-decorator';

  @Component
  export default class SessionListFilter extends Vue {
    @Prop() excludedTracks: string[] = [];
    @Prop() allTracks: string[] = [];

    updateTrackFilter(track: string) {
      console.log(track);
    }
    dismiss() {
      this.$ionic.modalController.dismiss();
    }
    resetFilters() {
      // this.$store.dispatch('updateTrackFilters', []);
    }
    applyFilters() {
      // this.$store.dispatch('updateTrackFilters', []);
      this.$ionic.modalController.dismiss();
    }
  }
</script>
