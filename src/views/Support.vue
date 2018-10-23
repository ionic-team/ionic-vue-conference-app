<template>
  <div class="ion-page">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Support</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="support-logo">
        <img src="/assets/img/appicon.svg" alt="Ionic Logo">
      </div>
      <form novalidate @submit="submit(submitForm)">
        <ion-list lines="none">
          <ion-item>
            <ion-label position="stacked" color="primary">Enter your support message below</ion-label>
            <ion-textarea v-model="supportMessage" name="supportQuestion" rows="6" required></ion-textarea>
          </ion-item>
        </ion-list>
        <ion-text color="danger">
          <p v-show="!questionValid || submitted === true" padding-left>
            Support message is required
          </p>
        </ion-text>
        <div padding>
          <ion-button expand="block" type="submit">Submit</ion-button>
        </div>
      </form>
    </ion-content>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class Login extends Vue {
    supportMessage = '';
    submitted = false;

    get questionValid() {
      return true;
    }
  }
</script>
