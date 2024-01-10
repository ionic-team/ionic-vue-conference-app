<style scoped>
.support-logo {
  min-height: 200px;

  padding: 20px 0;

  text-align: center;
}

.support-logo img {
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
        <ion-title>Support</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="support-logo">
        <img src="../../public/assets/img/appicon.svg" alt="Ionic Logo" />
      </div>
      <form novalidate @submit="submitForm">
        <ion-textarea
          label="Support Message"
          labelPlacement="floating"
          fill="outline"
          placeholder="Message..."
          v-model="supportMessage"
          name="supportQuestion"
          :rows="6"
          required
        ></ion-textarea>
        <div class="ion-padding-top">
          <ion-button expand="block" type="submit">Submit</ion-button>
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
import { computed, ref, onMounted } from "vue";
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
  IonLabel,
  IonTextarea,
  IonToast,
} from "@ionic/vue";

const supportMessage = ref("");
const submitted = ref(false);

const showToast = ref(false);
const toastMessage = ref("");

const canSubmit = computed(() => supportMessage.value.trim() !== "");

const submitForm = (event: any) => {
  event.preventDefault();
  submitted.value = true;

  if (canSubmit) {
    toastMessage.value = "Successfully sent support message!";
    showToast.value = true;
    supportMessage.value = "";
  }
};

onMounted(() => {
  toastMessage.value = "This does not actually send a support request.";
  showToast.value = true;
});
</script>
