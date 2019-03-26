<template>
  <div class="ion-page">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{session ? session.name : ''}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div padding v-if="session">
        <ion-grid no-padding>
          <ion-row>
            <ion-col size="6">
              <span
                v-for="track in session.tracks"
                :class="'session-track-'+track.toLowerCase()"
                :key="track | lowercase"
              >{{track}}</span>
            </ion-col>
            <ion-col
              size="6"
              text-right
              :class="favorites.indexOf(session.id) !== -1 ? 'show-favorite': ''"
            >
              <ion-icon
                name="heart-empty"
                size="large"
                class="icon-heart-empty"
                @click="addFavorite()"
              ></ion-icon>
              <ion-icon
                name="heart"
                color="danger"
                size="large"
                class="icon-heart"
                @click="removeFavorite()"
              ></ion-icon>
            </ion-col>
          </ion-row>
        </ion-grid>
        <h1>{{session.name}}</h1>
        <p>{{session.description}}</p>
        <ion-text color="medium">
          {{session.dateTimeStart | dateFormat("h:mm a")}} &mdash; {{session.dateTimeEnd | dateFormat("h:mm a")}}
          <br>
          {{session.location}}
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

<style scoped>
.session-track-ionic {
  color: var(--ion-color-primary);
}

.session-track-angular {
  color: var(--ion-color-angular);
}

.session-track-communication {
  color: var(--ion-color-communication);
}

.session-track-tooling {
  color: var(--ion-color-tooling);
}

.session-track-services {
  color: var(--ion-color-services);
}

.session-track-design {
  color: var(--ion-color-design);
}

.session-track-workshop {
  color: var(--ion-color-workshop);
}

.session-track-food {
  color: var(--ion-color-food);
}

.session-track-documentation {
  color: var(--ion-color-documentation);
}

.session-track-navigation {
  color: var(--ion-color-navigation);
}

.show-favorite {
  position: relative;
}

.icon-heart-empty {
  position: absolute;
  top: 5px;
  right: 5px;
  transform: scale(1);
  transition: transform 0.3s ease;
}

.icon-heart {
  position: absolute;
  top: 5px;
  right: 5px;
  transform: scale(0);
  transition: transform 0.3s ease;
}

.show-favorite .icon-heart {
  transform: scale(1);
}

.show-favorite .icon-heart-empty {
  transform: scale(0);
}
</style>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Session } from "@/store/modules/sessions";

@Component
export default class SessionDetail extends Vue {
  session: Session | null = null;

  mounted() {
    this.session = this.$store.state.sessions.sessions.find(
      (s: Session) => s.id === parseInt(this.$route.params.sessionId)
    );
  }

  get favorites(): number[] {
    return this.$store.state.sessions.favoriteSessions;
  }

  addFavorite() {
    if (this.session) {
      this.$store.dispatch("addFavorite", this.session.id);
    }
  }

  removeFavorite() {
    if (this.session) {
      this.$store.dispatch("removeFavorite", this.session.id);
    }
  }

  async sessionClick(message: string) {
    const alert = await this.$ionic.alertController.create({
      message: `${message}`
    });
    await alert.present();
  }
}
</script>
