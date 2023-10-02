<style scoped>
.signup-logo {
  min-height: 200px;

  padding: 20px 0;

  text-align: center;
}

.signup-logo img {
  max-width: 150px;
}
</style>

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

    <ion-content class="ion-padding">
      <div class="signup-logo">
        <img src="./../../public/assets/img/appicon.svg" alt="Ionic Logo" />
      </div>
      <form @submit.prevent="onSignup">
        <ion-list>
          <ion-item>
            <ion-input
              labelPlacement="stacked"
              label="Username"
              v-model="username"
              name="username"
              type="text"
              required
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-input
              labelPlacement="stacked"
              label="Password"
              v-model="password"
              name="password"
              type="password"
              required
            ></ion-input>
          </ion-item>
        </ion-list>
        <div class="ion-padding">
          <ion-button type="submit" expand="block">Create</ion-button>
        </div>
      </form>
      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :duration="2000"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonTitle,
  IonInput,
  IonToast,
} from "@ionic/vue";

const username = ref("");
const password = ref("");
const submitted = ref(false);

const showToast = ref(false);
const toastMessage = ref("");

const usernameValid = computed(() => {
  return true;
});

const passwordValid = computed(() => {
  return true;
});

const onSignup = () => {
  submitted.value = true;

  if (usernameValid.value && passwordValid.value) {
    toastMessage.value = "Successfully signed up!";

    showToast.value = true;

    username.value = "";
    password.value = "";
  }
};
</script>
