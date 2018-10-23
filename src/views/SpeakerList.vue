<template>
  <div class="ion-page">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Speakers</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="outer-content">
      <ion-list>
        <ion-grid fixed>
          <ion-row align-items-stretch>
            <ion-col size="12" size-md="6" v-for="speaker in allSpeakers" :key="speaker.id">
              <ion-card class="speaker-card">
                <ion-card-header>
                  <ion-item detail="false" lines="none" button :href="'app/tabs/(speakers:speaker-details/'+ speaker.id">
                    <ion-avatar slot="start">
                      <img :src="speaker.profilePic" alt="Speaker profile pic">
                    </ion-avatar>
                    {{speaker.name}}
                  </ion-item>
                </ion-card-header>

                <ion-card-content>
                  <ion-list>
                    <ion-item v-for="session in speaker.sessions" button :href="'app/tabs/(speakers:session/'+session.id" :key="session.id">
                      <h3>{{session.name}}</h3>
                    </ion-item>

                    <ion-item button @click="goToSpeakerDetail(speaker)" :href="'app/tabs/(speakers:speaker-details/'+ speaker.id">
                      <h3>About {{speaker.name}}</h3>
                    </ion-item>
                  </ion-list>
                </ion-card-content>

                <ion-row no-padding justify-content-center>
                  <ion-col text-left size="4">
                    <ion-button fill="clear" size="small" color="primary" @click="goToSpeakerTwitter(speaker)">
                      <ion-icon name="logo-twitter" slot="start"></ion-icon>
                      Tweet
                    </ion-button>
                  </ion-col>
                  <ion-col text-center size="4">
                    <ion-button fill="clear" size="small" color="primary" @click="openSpeakerShare(speaker)">
                      <ion-icon name='share-alt' slot="start"></ion-icon>
                      Share
                    </ion-button>
                  </ion-col>
                  <ion-col text-right size="4">
                    <ion-button fill="clear" size="small" color="primary" @click="openContact(speaker)">
                      <ion-icon name='chatboxes' slot="start"></ion-icon>
                      Contact
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-list>
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
  import { Speaker } from '../store/modules/speakers';

  @Component({
    computed: mapGetters(['allSpeakers'])
  })
  export default class SpeakerList extends Vue {
    mounted() {
      this.$store.dispatch('loadSessionData');
      this.$store.dispatch('loadSpeakerData');
    }
    goToSpeakerDetail(speaker: Speaker) {

    }
    gotToSpeakerTwitter(speaker: Speaker) {

    }
    openSpeakerShare(speaker: Speaker) {

    }
    openConnect(speaker: Speaker) {

    }
  }
</script>
