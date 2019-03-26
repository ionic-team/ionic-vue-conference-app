<template>
  <div class="ion-page">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="login-logo">
        <img src="/assets/img/appicon.svg" alt="Ionic logo">
      </div>

      <form novalidate>
        <ion-list>
          <ion-item>
            <ion-label position="stacked" color="primary">Username</ion-label>
            <ion-input
              v-model="username"
              name="username"
              type="text"
              spellcheck="false"
              autocapitalize="off"
              required
            ></ion-input>
          </ion-item>

          <ion-text color="danger">
            <p v-show="!usernameValid || submitted == true" padding-left>Username is required</p>
          </ion-text>

          <ion-item>
            <ion-label position="stacked" color="primary">Password</ion-label>
            <ion-input v-model="password" name="password" type="password" required></ion-input>
          </ion-item>

          <ion-text color="danger">
            <p v-show="!passwordValid || submitted == true" padding-left>Password is required</p>
          </ion-text>
        </ion-list>

        <ion-row responsive-sm>
          <ion-col>
            <ion-button @click="onLogin(loginForm)" type="submit" expand="block">Login</ion-button>
          </ion-col>
          <ion-col>
            <ion-button @click="onSignup()" color="light" expand="block">Signup</ion-button>
          </ion-col>
        </ion-row>
      </form>
    </ion-content>
  </div>
</template>

<style scoped>
.login-logo {
  padding: 20px 0;
  min-height: 200px;
  text-align: center;
}

.login-logo img {
  max-width: 150px;
}

.list {
  margin-bottom: 0;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  username = "";
  password = "";
  submitted = false;

  get usernameValid() {
    return true;
  }
  get passwordValid() {
    return true;
  }
  onLogin(ev: any) {
    ev.preventDefault();
  }
}
</script>
