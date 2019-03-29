<template>
<div class="ion-page">
  <ion-header>
    <ion-navbar>
      <ion-buttons slot="start">
        <ion-menu-button></ion-menu-button>
      </ion-buttons>
      <ion-title>Account</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content key={2} class="outer-content page-account">
    <div>
      <img src="http://www.gravatar.com/avatar?d=mm&s=140" alt="avatar" />
      <h2>{{username}}</h2>
      <ion-list inset>
        <ion-item href="#" @click="updatePicture()">Update Picture</ion-item>
        <ion-item href="#" @click="changeUsername()">Change Username</ion-item>
        <ion-item href="#" @click="changePassword()">Change Password</ion-item>
        <ion-item href="#" @click="support()">Support</ion-item>
        <ion-item href="#" @click="logOutUser(logOutUser)">Logout</ion-item>
      </ion-list>
    </div>
  </ion-content>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
})
export default class Home extends Vue {
  updatePicture() {}
  changeUsername() {}
  support() {}
  logOutUser() {}

  get username() {

    return this.$store.state.user.username;
  }
}
</script>

<style scoped>
img {
  max-width: 140px;
  border-radius: 50%;
}
</style>
