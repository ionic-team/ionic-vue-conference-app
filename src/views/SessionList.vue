<template>
  <div class="ion-page">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-segment @ionChange="updateSegment">
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
        <ion-searchbar v-model="queryText" @ionChange="updateSearchTerm" placeholder="Search">
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list v-show="allGrouped.length > 0">
        <ion-item-group v-for="group in allGrouped" :key="group.id">
          <ion-item-divider sticky>
            <ion-label>
              {{group.startTime | dateFormat("h:MM a")}}
            </ion-label>
          </ion-item-divider>

          <ion-item-sliding v-for="session in group.sessions" :key="session.id">
            <ion-item button @click="goToSessionDetail(session)">
              <ion-label>
                <h3>{{session.name}}</h3>
                <p>
                  {{session.dateTimeStart | dateFormat("h:MM a")}} &mdash; {{session.dateTimeEnd | dateFormat("h:MM a")}}: {{session.location}}
                </p>
              </ion-label>
            </ion-item>
            <ion-item-options>
              <ion-item-option color="favorite" @click="addFavorite($event, session)" v-if="segment === 'all'">
                Favorite
              </ion-item-option>
              <ion-item-option color="danger" @click="removeFavorite($event, session, 'Remove Favorite')" v-if="segment === 'favorites'">
                Remove
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-item-group>
      </ion-list>

      <ion-list-header v-show="allGrouped.length === 0">
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
  import { Session, SessionGroup } from '../store/modules/sessions';
  import { parse as parseDate } from 'date-fns';



  @Component
  export default class SessionList extends Vue {
    segment = 'all';

    mounted() {
      this.$store.dispatch('loadSessionData');
      this.$store.dispatch('loadSpeakerData');
    }
    groupedByStartTime(sessions: Session[]) {
      return sessions
        .sort((a, b) => (
          parseDate(a.dateTimeStart).valueOf() - parseDate(b.dateTimeStart).valueOf()
        ))
        .reduce((groups, session) => {
          let starterHour = parseDate(session.dateTimeStart);
          starterHour.setMinutes(0);
          starterHour.setSeconds(0);
          const starterHourStr = starterHour.toJSON();

          const foundGroup = groups.find(group => group.startTime === starterHourStr);
          if (foundGroup) {
            foundGroup.sessions.push(session);
          } else {
            groups.push({
              startTime: starterHourStr,
              sessions: [session]
            });
          }
          return groups;
      }, [] as SessionGroup[]);
    }

    get allGrouped() {
      if (this.segment === 'all') {
        return this.groupedByStartTime(this.$store.getters.allFiltered);
      } else {
        return this.groupedByStartTime(this.$store.getters.favoritesFiltered);
      }
    }

    get queryText() {
      return this.$store.state.sessions.searchText;
    }

    async addFavorite(event: MouseEvent, session: Session) {
      if (this.$store.state.sessions.favoriteSessions.indexOf(session.id) !== - 1) {
        // woops, they already favorited it! What shall we do!?
        // prompt them to remove it
        this.removeFavorite(event, session, 'Favorite already added');
      } else {
        // remember this session as a user favorite
        this.$store.dispatch('addFavorite', session.id);

        // create an alert instance
        const alert = await this.$ionic.alertController.create({
          header: 'Favorite Added',
          buttons: [{
            text: 'OK',
            handler: () => {
              // close the sliding item
              const slidingItem = (event.target as HTMLElement).closest('ion-item-sliding');
              (<any>slidingItem).close();
            }
          }]
        });
        // now present the alert on top of all other content
        await alert.present();
      }
    }

    async removeFavorite(event: MouseEvent, session: Session, title: string) {
      const alert = await this.$ionic.alertController.create({
        header: title,
        message: 'Would you like to remove this session from your favorites?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              // they clicked the cancel button, do not remove the session
              // close the sliding item and hide the option buttons
              const slidingItem = (event.target as HTMLElement).closest('ion-item-sliding');
              (<any>slidingItem).close();
            }
          },
          {
            text: 'Remove',
            handler: () => {
              // they want to remove this session from their favorites
              this.$store.dispatch('removeFavorite', session.id);

              // close the sliding item and hide the option buttons
              const slidingItem = (event.target as HTMLElement).closest('ion-item-sliding');
              (<any>slidingItem).close();
            }
          }
        ]
      });
      // now present the alert on top of all other content
      await alert.present();
    }

    goToSessionDetail(session: Session) {
    }
    presentFilter() {
    }
    updateSegment(e: CustomEvent) {
      this.segment = e.detail.value;
    }
    updateSearchTerm(e: CustomEvent) {
      this.$store.dispatch('setSearchText', e.detail.value);
    }
    openSocial() {

    }
  }
</script>
