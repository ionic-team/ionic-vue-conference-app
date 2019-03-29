<template>
<ion-menu contentId="menu-content">
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>Menu</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>

    <ion-list>
      <ion-list-header>
        Navigate
      </ion-list-header>
      <ion-menu-toggle auto-hide="false" v-for="p in appPages" :key="p.title">
        <ion-item button @click="navigate(p.url)">
          <ion-icon slot="start" :name="p.icon"></ion-icon>
          <ion-label>
            {{p.title}}
          </ion-label>
        </ion-item>

      </ion-menu-toggle>
    </ion-list>
    <ion-list v-if="loggedIn">
      <ion-list-header>
        Account
      </ion-list-header>

      <ion-menu-toggle auto-hide="false">
        <ion-item button @click="navigate('/account')">
          <ion-icon slot="start" name="person"></ion-icon>
          <ion-label>
            Account
          </ion-label>
        </ion-item>
      </ion-menu-toggle>

      <ion-menu-toggle auto-hide="false">
        <ion-item button @click="navigate('/support')">
          <ion-icon slot="start" name="help"></ion-icon>
          <ion-label>
            Support
          </ion-label>
        </ion-item>
      </ion-menu-toggle>

      <ion-menu-toggle auto-hide="false">
        <ion-item button @click="logout()">
          <ion-icon slot="start" name="log-out"></ion-icon>
          <ion-label>
            Logout
          </ion-label>
        </ion-item>
      </ion-menu-toggle>

    </ion-list>

    <ion-list v-if="!loggedIn">
      <ion-list-header>
        Account
      </ion-list-header>

      <ion-menu-toggle auto-hide="false">
        <ion-item button @click="navigate('/login')">
          <ion-icon slot="start" name="log-in"></ion-icon>
          <ion-label>
            Login
          </ion-label>
        </ion-item>
      </ion-menu-toggle>

      <ion-menu-toggle auto-hide="false">
        <ion-item button @click="navigate('/support')">
          <ion-icon slot="start" name="help"></ion-icon>
          <ion-label>
            Support
          </ion-label>
        </ion-item>
      </ion-menu-toggle>

      <ion-menu-toggle auto-hide="false">
        <ion-item button @click="navigate('/signup')">
          <ion-icon slot="start" name="person-add"></ion-icon>
          <ion-label>
            Signup
          </ion-label>
        </ion-item>
      </ion-menu-toggle>
    </ion-list>

    <ion-list>
      <ion-list-header>
        Tutorial
      </ion-list-header>
      <ion-menu-toggle auto-hide="false">
        <ion-item button @click="openTutorial()">
          <ion-icon slot="start" name="hammer"></ion-icon>
          <ion-label>Show Tutorial</ion-label>
        </ion-item>
      </ion-menu-toggle>
    </ion-list>
  </ion-content>
</ion-menu>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { mapGetters } from 'vuex';

  @Component({
     computed: {
       loggedIn: function() {
         return this.$store.state.user.isAuthenticated;
       }
     }

  })
  export default class Menu extends Vue {
    appPages = [
      {
        title: 'Schedule',
        url: '/tabs/schedule',
        name: 'tabs.schedule',
        icon: 'calendar'
      },
      {
        title: 'Speakers',
        url: '/tabs/speakers',
        icon: 'contacts'
      },
      {
        title: 'Map',
        url: '/tabs/map',
        icon: 'map'
      },
      {
        title: 'About',
        url: '/tabs/about',
        icon: 'information-circle'
      }
    ];

    navigate(url: string){
      // this.$router.directionOverride = 0;
      this.$router.push(url)
    }
    openTutorial(){
      this.$store.state.user.hasSeenTutorial = false;
      this.$router.push('tutorial')
    }
  }
</script>
