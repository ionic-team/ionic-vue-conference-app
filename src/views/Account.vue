<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Account</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="outer-content page-account">
      <div>
        <img src="http://www.gravatar.com/avatar?d=mm&s=140" alt="avatar" />
        <h2>{{ username }}</h2>
        <ion-list inset>
          <ion-item @click="updatePicture">Update Picture</ion-item>
          <ion-item @click="changeUsername">Change Username</ion-item>
          <ion-item @click="changePassword">Change Password</ion-item>
          <ion-item @click="support">Support</ion-item>
          <ion-item @click="logOutUser">Logout</ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonList,
  IonItem,
  IonTitle,
} from '@ionic/vue';

const store = useStore();

const updatePicture = () => {};
const changeUsername = () => {};
const changePassword = () => {};
const support = () => {};
const logOutUser = () => {};

const username = ref(store.state.user.username);
</script>

<style scoped>
img {
  max-width: 140px;
  border-radius: 50%;
}
</style>