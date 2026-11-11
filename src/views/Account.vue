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
      <div v-if="username">
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
  alertController,
} from '@ionic/vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useStore } from '@/store';

const store = useStore();
const router = useRouter();

const username = computed(() => store.state.user.userName);

const updatePicture = () => {};

// Present an alert with the current username populated: Ok saves the new username, Cancel keeps it.
const changeUsername = async () => {
  const alert = await alertController.create({
    header: 'Change Username',
    buttons: [
      'Cancel',
      {
        text: 'Ok',
        handler: (data: { username: string }) => {
          store.dispatch('setUserName', data.username);
        },
      },
    ],
    inputs: [
      {
        type: 'text',
        name: 'username',
        value: username.value,
        placeholder: 'username',
      },
    ],
  });
  await alert.present();
};

const changePassword = () => {};

const support = () => {
  router.push('/support');
};

const logOutUser = async () => {
  await store.dispatch('logOut');
  router.push('/login');
};
</script>

<style scoped>
img {
  max-width: 140px;
  border-radius: 50%;
}
</style>
