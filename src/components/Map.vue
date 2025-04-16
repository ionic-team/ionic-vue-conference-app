<template>
  <div ref="mapCanvas" class="map-canvas"></div>
</template>

<style scoped>
.map-canvas {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: transparent;
  opacity: 0;
  transition: opacity 150ms ease-in;
}

.show-map {
  opacity: 1;
}

:deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  background-color: transparent;
}

:deep(.leaflet-popup-content) {
  margin: 8px;
}

:deep(.leaflet-popup-content h5) {
  margin: 0;
  font-size: 14px;
}
</style>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { Location } from '@/store/modules/locations';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default defineComponent({
  name: 'Map',
  props: {
    locations: {
      type: Array as () => Location[],
      required: true
    },
    mapCenter: {
      type: Object as () => Location,
      required: true
    }
  },
  setup(props) {
    const mapCanvas = ref<HTMLElement | null>(null);
    const map = ref<L.Map | null>(null);
    const markers = ref<L.Marker[]>([]);

    const initializeMap = () => {
      if (!mapCanvas.value) return;

      // Remove existing map if it exists
      if (map.value) {
        map.value.remove();
        markers.value.forEach(marker => marker.remove());
        markers.value = [];
      }

      // Initialize map
      const mapInstance = L.map(mapCanvas.value);
      mapInstance.setView([props.mapCenter.lat, props.mapCenter.lng], 16);
      map.value = mapInstance;

      // Add tile layer
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      });
      tileLayer.addTo(mapInstance);

      // Add markers for all locations except the center
      const mapData = props.locations.slice(1);
      mapData.forEach((location: Location) => {
        const marker = L.marker([location.lat, location.lng])
          .addTo(mapInstance)
          .bindPopup(`<h5>${location.name}</h5>`);
        markers.value.push(marker);
      });

      // Show map
      mapCanvas.value.classList.add("show-map");
    };

    onMounted(() => {
      initializeMap();
    });

    watch(() => props.locations, () => {
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
