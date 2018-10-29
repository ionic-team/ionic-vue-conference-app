<template>
  <div class="ion-page">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-segment @ionChange="updateSchedule">
          <ion-segment-button value="all" checked="segment === 'all'">
            All
          </ion-segment-button>
          <ion-segment-button value="favorites" checked="segment === 'favorites'">
            Favorites
          </ion-segment-button>
        </ion-segment>

        <ion-buttons slot="end">
          <ion-button @click="presentFilter">
            <ion-icon slot="icon-only" name="options"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <ion-toolbar color="primary">
        <ion-searchbar v-model="queryText" @ionChange="updateSchedule" placeholder="Search">
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list v-show="groupedByStartTime.length > 0">
        <ion-item-group v-for="group in groupedByStartTime" :key="group.id">
          <ion-item-divider sticky>
            <ion-label>
              {{group.startTime}}
            </ion-label>
          </ion-item-divider>

          <ion-item-sliding v-for="session in group.sessions" :key="session.id">
            <ion-item button @click="goToSessionDetail(session)">
              <ion-label>
                <h3>{{session.name}}</h3>
                <p>
                  {{session.dateTimeStart}} &mdash; {{session.dateTimeEnd}}: {{session.location}}
                </p>
              </ion-label>
            </ion-item>
            <ion-item-options>
              <ion-item-option color="favorite" @click="addFavorite(slidingItem, session)" v-if="segment === 'all'">
                Favorite
              </ion-item-option>
              <ion-item-option color="danger" @click="removeFavorite(slidingItem, session, 'Remove Favorite')" v-if="segment === 'favorites'">
                Remove
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-item-group>
      </ion-list>

      <ion-list-header v-show="groupedByStartTime.length === 0">
        No Sessions Found
      </ion-list-header>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end" ref="fab">
        <ion-fab-button ref="fabButton"><ion-icon name="share"></ion-icon></ion-fab-button>
        <ion-fab-list ref="fabList" side="top">
          <ion-fab-button color="vimeo" @click="openSocial('Vimeo')">
            <ion-icon name="logo-vimeo"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="google" @click="openSocial('Google+')">
            <ion-icon name="logo-googleplus"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="twitter" @click="openSocial('Twitter')">
            <ion-icon name="logo-twitter"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="facebook" @click="openSocial('Facebook')">
            <ion-icon name="logo-facebook"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
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
  import { Session } from '../store/modules/sessions';

  @Component({
    computed: mapGetters(['groupedByStartTime', 'allSpeakers'])
  })
  export default class SessionList extends Vue {
    mounted() {
      this.$store.dispatch('loadSessionData');
      this.$store.dispatch('loadSpeakerData');
    }
    segment = 'all';
    queryText = '';
    goToSessionDetail(session: Session) {
    }
    presentFilter() {
    }
    updateSchedule(e: CustomEvent) {
      this.segment = e.detail.value;
    }
    openSocial() {

    }
  }
</script>
