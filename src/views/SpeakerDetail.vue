<template>
  <div class="ion-page">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="Speakers"></ion-back-button>
        </ion-buttons>
        <ion-title>{{speaker ? speaker.name : ''}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding class="speaker-detail">
      <div text-center v-if="speaker">
        <img :src="speaker.profilePic" :alt="speaker.name">
        <br>
        <ion-button fill="clear" size="small" color="twitter">
          <ion-icon name="logo-twitter" slot="icon-only"></ion-icon>
        </ion-button>
        <ion-button fill="clear" size="small" color="github">
          <ion-icon name="logo-github" slot="icon-only"></ion-icon>
        </ion-button>
        <ion-button fill="clear" size="small" color="instagram">
          <ion-icon name="logo-instagram" slot="icon-only"></ion-icon>
        </ion-button>
      </div>

      <p>{{speaker ? speaker.about : ''}}</p>
    </ion-content>
  </div>
</template>

<style scoped>
.speaker-detail img {
  max-width: 140px;
  border-radius: 50%;
}

.speaker-detail p {
  color: #60646b;
}
</style>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Speaker } from "@/store/modules/speakers";

@Component
export default class SpeakerDetail extends Vue {

  get speaker() {
    return this.$store.state.speakers.speakers.find(
      (s: Speaker) => s.id === parseInt(this.$route.params.speakerId)
    );
  }
}
</script>
