<template>
  <div class="ion-page">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Signup</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="signup-logo">
        <img src="/assets/img/appicon.svg" alt="Ionic Logo">
      </div>
      <form>
        <ion-list lines="none">
          <ion-item>
            <ion-label position="stacked" color="primary">Username</ion-label>
            <ion-input v-model="username" name="username" type="text" required>
            </ion-input>
          </ion-item>
          <ion-text color="danger">
            <p v-show="!usernameValid || submitted == true" padding-left>
              Username is required
            </p>
          </ion-text>
          <ion-item>
            <ion-label position="stacked" color="primary">Password</ion-label>
            <ion-input v-model="password" name="password" type="password" required>
            </ion-input>
          </ion-item>
          <ion-text color="danger">
            <p v-show="!passwordValid || submitted == true" padding-left>
              Password is required
            </p>
          </ion-text>
        </ion-list>
        <div padding>
          <ion-button @click="onSignup(signupForm)" type="submit" expand="block">Create</ion-button>
        </div>
      </form>
    </ion-content>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class Signup extends Vue {
    username = '';
    password = '';
    submitted = false;

    get usernameValid() {
      return true;
    }
    get passwordValid() {
      return true;
    }
  }
</script>
