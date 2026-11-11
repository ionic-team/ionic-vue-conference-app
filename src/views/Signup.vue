<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Signup</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="signup-logo">
        <img src="/assets/img/appicon.svg" alt="Ionic Logo" />
      </div>

      <div class="signup-form">
        <form @submit.prevent="onSignup" novalidate>
          <ion-input
            label="Username"
            labelPlacement="stacked"
            fill="solid"
            v-model="signup.username"
            name="username"
            type="text"
            error-text="Username is required"
            :class="{ 'ion-touched': touched.username || submitted, 'ion-invalid': !signup.username }"
            @ionBlur="touched.username = true"
            required
          ></ion-input>

          <ion-input
            label="Password"
            labelPlacement="stacked"
            fill="solid"
            v-model="signup.password"
            name="password"
            type="password"
            error-text="Password is required"
            :class="{ 'ion-touched': touched.password || submitted, 'ion-invalid': !signup.password }"
            @ionBlur="touched.password = true"
            required
          ></ion-input>

          <ion-row>
            <ion-col>
              <ion-button type="submit" expand="block">Create</ion-button>
            </ion-col>
          </ion-row>
        </form>
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
  IonMenuButton,
  IonButton,
  IonContent,
  IonTitle,
  IonInput,
  IonRow,
  IonCol,
} from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useStore } from '@/store';

interface UserOptions {
  username: string;
  password: string;
}

const router = useRouter();
const store = useStore();
const signup = ref<UserOptions>({ username: '', password: '' });
const submitted = ref(false);
// Like the Angular app, a required field shows its error once it has been touched (or submitted).
const touched = ref({ username: false, password: false });

const onSignup = async () => {
  submitted.value = true;

  if (signup.value.username && signup.value.password) {
    await store.dispatch('signUp', signup.value.username);
    router.push('/tabs/schedule');
  }
};
</script>

<style scoped>
.signup-logo {
  min-height: 200px;

  padding: 20px 0;

  text-align: center;
}

.signup-logo img {
  max-width: 150px;
}

.signup-form {
  padding: 16px;
}

ion-input {
  margin-bottom: 10px;
}
</style>
