<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="login-logo">
        <img src="/assets/img/appicon.svg" alt="Ionic logo" />
      </div>

      <div class="login-form">
        <form @submit.prevent="onLogin" novalidate>
          <ion-input
            label="Username"
            labelPlacement="stacked"
            fill="solid"
            v-model="login.username"
            name="username"
            type="text"
            :spellcheck="false"
            autocapitalize="off"
            error-text="Username is required"
            :class="{ 'ion-touched': touched.username || submitted, 'ion-invalid': !login.username }"
            @ionBlur="touched.username = true"
            required
          ></ion-input>

          <ion-input
            label="Password"
            labelPlacement="stacked"
            fill="solid"
            v-model="login.password"
            name="password"
            type="password"
            error-text="Password is required"
            :class="{ 'ion-touched': touched.password || submitted, 'ion-invalid': !login.password }"
            @ionBlur="touched.password = true"
            required
          ></ion-input>

          <ion-row>
            <ion-col>
              <ion-button type="submit" expand="block">Login</ion-button>
            </ion-col>
            <ion-col>
              <ion-button @click="onSignup" color="light" expand="block">Signup</ion-button>
            </ion-col>
          </ion-row>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.login-logo {
  min-height: 200px;
  padding: 20px 0;
  text-align: center;
}

.login-logo img {
  max-width: 150px;
}

.login-form {
  padding: 16px;
}

ion-input {
  margin-bottom: 10px;
}
</style>

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
  IonRow,
  IonCol,
  IonInput,
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
const login = ref<UserOptions>({ username: '', password: '' });
const submitted = ref(false);
// Like the Angular app, a required field shows its error once it has been touched (or submitted).
const touched = ref({ username: false, password: false });

const onLogin = async () => {
  submitted.value = true;

  if (login.value.username && login.value.password) {
    await store.dispatch('logIn', login.value.username);
    router.push('/tabs/schedule');
  }
};

const onSignup = () => {
  router.push('/signup');
};
</script>
