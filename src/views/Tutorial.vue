<template>
  <ion-page v-if="ionDidTutorial">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button color="primary" @click="navigateToSchedule">Skip</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="slider">
        <section>
          <img
            src="/assets/img/ica-slidebox-img-1.png"
            alt=""
            class="slide-image"
          />
          <h2 class="slide-title">
            Welcome to <b>ICA</b>
          </h2>
          <p>
            The <b>ionic conference app</b> is a practical preview of the ionic
            framework in action, and a demonstration of proper code use.
          </p>
        </section>

        <section>
          <img
            src="/assets/img/ica-slidebox-img-2.png"
            alt=""
            class="slide-image"
          />
          <h2 class="slide-title">What is Ionic?</h2>
          <p>
            <b>Ionic Framework</b> is an open source SDK that enables developers
            to build high quality mobile apps with web technologies like HTML,
            CSS, and JavaScript.
          </p>
        </section>

        <section>
          <img
            src="/assets/img/ica-slidebox-img-3.png"
            alt=""
            class="slide-image"
          />
          <h2 class="slide-title">What is Ionic Appflow?</h2>
          <p>
            <b>Ionic Appflow</b> is a powerful set of services and features built
            on top of Ionic Framework that brings a totally new level of app
            development agility to mobile dev teams.
          </p>
        </section>

        <section>
          <img
            src="/assets/img/ica-slidebox-img-4.png"
            alt=""
            class="slide-image"
          />
          <h2 class="slide-title">Ready to Play?</h2>
          <ion-button fill="clear" @click="navigateToSchedule">
            Continue
            <ion-icon slot="end" :icon="arrowForward"></ion-icon>
          </ion-button>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-toolbar {
  --background: transparent;
  --border-color: transparent;
}

.slide-title {
  margin-top: 2.8rem;
}

.slider {
  display: grid;
  grid-template-columns: repeat(4, 100%);
  grid-template-rows: 1fr;
  height: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x pan-y pinch-zoom;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.slider::-webkit-scrollbar {
  display: none;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.slide-image {
  max-height: 50%;
  max-width: 60%;
  margin: -5vh 0 0;
  pointer-events: none;
}

b {
  font-weight: 500;
}

p {
  padding: 0 40px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ion-color-step-600, #60646b);
}

p b {
  color: var(--ion-text-color, #000000);
}
</style>

<script setup lang="ts">
import { onMounted, ref, onActivated } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonIcon,
  IonButton,
  menuController,
  useIonRouter,
} from '@ionic/vue';
import { arrowForward } from 'ionicons/icons';
import router from '@/router';
import { Storage } from '@ionic/storage';

const ionRouter = useIonRouter();
const ionDidTutorial = ref(false);
const storage = new Storage();

const navigateToSchedule = async () => {
  ionDidTutorial.value = false;
  await storage.set('ion_did_tutorial', true);
  await menuController.enable(true);
  ionRouter.navigate('/tabs/schedule', 'root', 'replace');
};

const checkTutorialStatus = async () => {
  await storage.create();
  const result = await storage.get('ion_did_tutorial');
  if (result === true) {
    ionRouter.navigate('/tabs/schedule', 'root', 'replace');
  } else {
    ionDidTutorial.value = true;
  }
};

const resetScroll = () => {
  const slider = document.querySelector('.slider') as HTMLElement;
  if (slider) {
    slider.scrollLeft = 0;
  }
};

onMounted(async () => {
  await menuController.enable(false);
  await checkTutorialStatus();
  resetScroll();
});

onActivated(() => {
  resetScroll();
});
</script>
