<style scoped>
.support-logo {
  min-height: 200px;

  padding: 20px 0;

  text-align: center;
}

.support-logo img {
  max-width: 150px;
}

.list {
  margin-bottom: 0;
}

.support-form {
  padding: 16px;
}
</style>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Support</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="support-logo">
        <img src="/assets/img/appicon.svg" alt="Ionic Logo" />
      </div>

      <div class="support-form">
        <form @submit.prevent="submit" novalidate>
          <ion-textarea
            label="Enter your support message below"
            labelPlacement="stacked"
            fill="solid"
            v-model="supportMessage"
            name="supportQuestion"
            rows="6"
            :error-text="submitted && !supportMessage ? 'Support message is required' : ''"
            required
          ></ion-textarea>

          <ion-row>
            <ion-col>
              <ion-button expand="block" type="submit">Submit</ion-button>
            </ion-col>
          </ion-row>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonContent,
  IonTitle,
  IonTextarea,
  IonRow,
  IonCol,
  toastController,
} from '@ionic/vue';

const supportMessage = ref('');
const submitted = ref(false);

onMounted(async () => {
  const toast = await toastController.create({
    message: 'This does not actually send a support request.',
    duration: 3000,
  });
  await toast.present();
});

const submit = async () => {
  submitted.value = true;

  if (supportMessage.value) {
    supportMessage.value = '';
    submitted.value = false;

    const toast = await toastController.create({
      message: 'Your support request has been sent.',
      duration: 3000,
    });
    await toast.present();
  }
};
</script>
