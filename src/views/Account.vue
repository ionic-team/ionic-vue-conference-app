<template>
  <div>
    <ion-header key={1}>
      <ion-navbar>
        <ion-buttons slot="start">
          <ion-button menuToggle>
              <ion-icon slot="icon-only" name="menu"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Account</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content key={2} class="outer-content page-account">
      <div>
        <img src="http://www.gravatar.com/avatar?d=mm&s=140" alt="avatar"/>
        <h2>{user.userName}</h2>
        <ion-list inset>
          <ion-item href="#" v-on:click="updatePicture">Update Picture</ion-item>
          <ion-item href="#" v-on:click="changeUsername">Change Username</ion-item>
          <ion-item href="#" v-on:click="changePassword">Change Password</ion-item>
          <ion-item href="#" v-on:click="support">Support</ion-item>
          <ion-item href="#" v-on:click="logOutUser(logOutUser)">Logout</ion-item>
        </ion-list>
      </div>
    </ion-content>
  </div>
</template>

<style>
  page-account img {
    max-width: 140px;
    border-radius: 50%;
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
})
export default class Home extends Vue {
  updatePicture() {}
  logOutUser() {}
}
</script>
