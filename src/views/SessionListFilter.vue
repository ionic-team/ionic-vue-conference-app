<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="dismiss">Cancel</ion-button>
        </ion-buttons>
        <ion-title>
          Filter Sessions
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="applyFilters" strong>Done</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="outer-content">
      <ion-list>
        <ion-list-header>Tracks</ion-list-header>
        <ion-item v-for="track in tracks" :key="track.name">
          <ion-icon slot="start" :icon="track.icon" color="primary"></ion-icon>
          <ion-toggle @ionChange="track.isChecked = !track.isChecked" :checked="track.isChecked" color="success">
            {{ track.name }}
          </ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="selectAll(false)">Deselect All</ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="selectAll(true)">Select All</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<style scoped>
</style>

<script lang="ts" setup>
import { ref, onMounted, defineProps } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonIcon,
  IonItem,
  IonTitle,
  IonListHeader,
  IonToggle,
  IonFooter,
  modalController
} from '@ionic/vue';
import * as ionIcons from "ionicons/icons";
import store from '@/store';

const props = defineProps({
  excludedTracks: {
    type: Array,
    default: () => []
  },
  allTracks: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits();
const tracks = ref<{ name: string; icon: string; isChecked: boolean }[]>([]);
const selectedTrackNames = ref<string[]>(props.allTracks.map((track: any) => track.name));
const isFirstLoad = store.state.sessions.isFirstLoad;

onMounted(() => {
  const availableTracks = props.allTracks.length ? props.allTracks : [];
  const selectedTrackFilters = store.state.sessions.selectedTrackFilters;

  tracks.value = availableTracks.map((track: any) => ({
    name: track.name,
    icon: (ionIcons as any)[track.icon],
    isChecked: isFirstLoad ? true : selectedTrackFilters.includes(track.name),
  }));

  if(isFirstLoad) store.commit('setFirstLoad', false);
});

const dismiss = () => modalController.dismiss();

const applyFilters = () => {
  const newSelectedTrackNames = tracks.value
    .filter((t) => t.isChecked)
    .map((t) => t.name);

  store.dispatch('setSelectedTrackFilters', newSelectedTrackNames);

  emit('filtersSelected', newSelectedTrackNames);
  dismiss();
};

const selectAll = (check: boolean) => {
  tracks.value.forEach((track) => (track.isChecked = check));
};

</script>
