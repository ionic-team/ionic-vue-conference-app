<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Map</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="map-page">
      <div ref="mapCanvas" class="map-canvas"></div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.map-page {
  position: relative;
  height: 100%;
  width: 100%;
}

.map-canvas {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #f4f4f4;
  opacity: 0;
  transition: opacity 250ms ease-in;
}

.show-map {
  opacity: 1;
}

:deep(.leaflet-popup-content) {
  margin: 13px 24px 13px 20px !important;
}
</style>

<script lang="ts">
import { defineComponent, computed, onMounted, onActivated, ref, watch } from 'vue';
import { useStore } from '@/store';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import L from 'leaflet';
import { Location } from '@/store/modules/locations';

export default defineComponent({
  name: 'MapView',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
  },
  setup() {
    const store = useStore();
    const mapCanvas = ref<HTMLElement | null>(null);
    const map = ref<L.Map | null>(null);
    const markers = ref<L.Marker[]>([]);

    const locations = computed(() => store.state.locations.locations);
    const mapCenter = computed(() => {
      return store.state.locations.locations.find(
        (location: Location) => location.center
      );
    });

    const initializeMap = () => {

      if (!mapCanvas.value || !mapCenter.value) {
        return;
      }

      // Remove existing map if it exists
      if (map.value) {
        map.value.remove();
        markers.value.forEach(marker => marker.remove());
        markers.value = [];
      }

      // Initialize map
      const mapInstance = L.map(mapCanvas.value);
      mapInstance.setView([mapCenter.value.lat, mapCenter.value.lng], 16);
      map.value = mapInstance;

      // Add tile layer
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      });
      tileLayer.addTo(mapInstance);

      // Add markers for all locations
      locations.value.forEach((location: Location) => {
        const marker = L.marker([location.lat, location.lng])
          .addTo(mapInstance)
          .bindPopup(`${location.name}`);
        markers.value.push(marker);
      });

      // Show map
      mapCanvas.value.classList.add("show-map");

      // Force a resize after a short delay to ensure proper rendering
      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 100);
    };

    onMounted(async () => {
      if (store.state.locations.locations.length === 0) {
        await store.dispatch('locations/loadLocations');
      }
      initializeMap();
    });

    onActivated(() => {
      if (map.value) {
        map.value.invalidateSize();
      } else if (store.state.locations.locations.length > 0) {
        initializeMap();
      }
    });

    watch(() => locations.value, (newLocations) => {
      if (map.value) {
        initializeMap();
      }
    });

    return {
      mapCanvas
    };
  }
});
</script>
