<template>
  <div class="ion-page">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Map</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div ref="map" class="map-canvas"></div>
    </ion-content>
  </div>
</template>

<style scoped>
  .map-canvas {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: transparent;
    opacity: 0;
    transition: opacity 150ms ease-in
  }

  .show-map {
    opacity: 1;
  }
</style>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { mapGetters } from 'vuex';

  @Component({
    computed: mapGetters(['mapCenter', 'allLocations'])
  })
  export default class Login extends Vue {
    mounted() {
      this.$store.dispatch('loadLocationData');

      const mapEle = this.$refs.map;

      /*
      const map = new google.maps.Map(mapEle, {
        center: this.$store.getters.mapCenter,
        zoom: 16
      });

      mapData.forEach((markerData: any) => {
        const infoWindow = new google.maps.InfoWindow({
          content: `<h5>${markerData.name}</h5>`
        });

        const marker = new google.maps.Marker({
          position: markerData,
          map,
          title: markerData.name
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      google.maps.event.addListenerOnce(map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
      */
    }
  }
</script>
