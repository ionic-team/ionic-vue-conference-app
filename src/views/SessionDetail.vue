<template>
  <div class="ion-page">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="Schedule" defaultHref="/app/tabs/(schedule:schedule)"></ion-back-button>
        </ion-buttons>
        <ion-title>{{session.name}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div padding *ngIf="session">
        <ion-grid no-padding>
          <ion-row>
            <ion-col size="6">
              <span v-for="track in session.tracks" :class="'session-track-'+track.toLowerCase()" :key="track | lowercase">{{track}}</span>
            </ion-col>
            <ion-col size="6" text-right :class]="isFavorite ? 'show-favorite': ''">
              <ion-icon name="heart-empty" size="large" class="icon-heart-empty" @click="toggleFavorite(true)"></ion-icon>
              <ion-icon name="heart" color="danger" size="large" class="icon-heart" @click="toggleFavorite(false)"></ion-icon>
            </ion-col>
          </ion-row>
        </ion-grid>
        <h1>{{session.name}}</h1>
        <p>{{session.description}}</p>
        <ion-text color="medium">
          {{session.timeStart}} &ndash; {{session.timeEnd}}
          <br /> {{session.location}}
        </ion-text>
      </div>

      <ion-list>
        <ion-item @click="sessionClick('Watched')" button>
          <ion-label color="primary">Watch</ion-label>
        </ion-item>
        <ion-item @click="sessionClick('Added to Calendar')" button>
          <ion-label color="primary">Add to Calendar</ion-label>
        </ion-item>
        <ion-item @click="sessionClick('Marked as Unwatched')" button>
          <ion-label color="primary">Mark as Unwatched</ion-label>
        </ion-item>
        <ion-item @click="sessionClick('Downloaded Video')" button>
          <ion-label color="primary">Download Video</ion-label>
          <ion-icon slot="end" color="primary" size="small" name="cloud-download"></ion-icon>
        </ion-item>
        <ion-item @click="sessionClick('Left Feedback')" button>
          <ion-label color="primary">Leave Feedback</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Session } from '@/store/modules/sessions';

  @Component
  export default class SessionDetail extends Vue {
    get session(): Session {
      const sessionId = parseInt(this.$route.params.sessionId);
      return this.$store.state.speakers.speakers.find((s: Session) => s.id === sessionId);
    }

    toggleFavorite(addFavorite: boolean) {
      this.$store.dispatch(addFavorite ? 'addFavorite' : 'removeFavorite', this.session.id);
    }

    async openSocial(message: string) {
      const alert = await this.$ionic.alertController.create({
        message: `${message}`,
      });
      await alert.present();
    }
  }
</script>
