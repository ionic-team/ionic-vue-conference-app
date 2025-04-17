<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button v-if="isIos" @click="dismiss">Cancel</ion-button>
          <ion-button v-else @click="selectAll(false)">Reset</ion-button>
        </ion-buttons>

        <ion-title>Filter Sessions</ion-title>

        <ion-buttons slot="end">
          <ion-button @click="applyFilters" strong>Done</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list :lines="isIos ? 'inset' : 'full'">
        <ion-list-header>Tracks</ion-list-header>

        <ion-item v-for="track in tracks" :key="track.name" :data-track="track.name.toLowerCase()">
          <ion-icon v-if="isIos" slot="start" :icon="track.icon" color="medium"></ion-icon>

          <ion-checkbox
            v-model="track.isChecked"
          >
            {{ track.name }}
          </ion-checkbox>
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
/*
 * Material Design
 */
.md ion-toolbar ion-button {
  letter-spacing: 0;
  text-transform: capitalize;
}

.md ion-checkbox {
  --checkbox-background-checked: transparent;
  --border-color: transparent;
  --border-color-checked: transparent;
  --checkmark-color: var(--ion-color-primary);
}

.md ion-list {
  background: inherit;
}

/*
 * iOS
 */
.ios ion-list-header {
  margin-top: 10px;
}

.ios ion-checkbox {
  color: var(--ion-color-primary);
}
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
  IonCheckbox,
  IonFooter,
  modalController
} from '@ionic/vue';
import { getMode } from '@ionic/core/components';
import {
  logoIonic,
  logoVue,
  peopleCircle,
  hammer,
  build,
  colorPalette,
  construct,
  restaurant,
  documents,
  compass
} from 'ionicons/icons';
import store from '@/store';

const isIos = getMode() === 'ios';

const iconMap: { [key: string]: string } = {
  'Ionic': logoIonic,
  'Vue': logoVue,
  'Communication': peopleCircle,
  'Tooling': hammer,
  'Services': build,
  'Design': colorPalette,
  'Workshop': construct,
  'Food': restaurant,
  'Documentation': documents,
  'Navigation': compass
};

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

const tracks = ref<{ name: string; icon: string; isChecked: boolean }[]>([]);
const isFirstLoad = store.state.sessions.isFirstLoad;

onMounted(() => {
  const availableTracks = props.allTracks.length ? props.allTracks : [];
  const trackFilters = store.state.sessions.trackFilters;

  tracks.value = availableTracks.map((track: any) => ({
    name: track.name,
    icon: iconMap[track.name] || '',
    isChecked: isFirstLoad ? true : trackFilters.includes(track.name),
  }));

  if(isFirstLoad) store.commit('setFirstLoad', false);
});

const dismiss = () => modalController.dismiss();

const applyFilters = () => {
  const newSelectedTrackNames = tracks.value
    .filter((t) => t.isChecked)
    .map((t) => t.name);

  modalController.dismiss(newSelectedTrackNames);
};

const selectAll = (check: boolean) => {
  tracks.value.forEach((track) => (track.isChecked = check));
};
</script>
