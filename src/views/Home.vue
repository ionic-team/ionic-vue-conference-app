<template>
  <ion-tabs>
    <ion-tab label="Schedule" icon="calendar">
      <SessionList />
    </ion-tab>
    <ion-tab label="Speakers" icon="contacts">
      <SpeakerList />
    </ion-tab>
    <ion-tab label="Map" icon="map">
      <Map />
    </ion-tab>
    <ion-tab label="About" icon="information-circle">
      <About />
    </ion-tab>
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
