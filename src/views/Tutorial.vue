<template>
  <ion-page v-show="ionDidTutorial">
    <ion-header>
      <ion-toolbar color="translucent">
        <ion-buttons slot="end">
          <ion-button color='primary' @click="navigateToSchedule">Skip</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <Swiper :slides-per-view="1" @swiper="onSwiper" @slideChange="onSlideChange">
        <SwiperSlide class="slide">
          <img src="./../../public/assets/img/ica-slidebox-img-1.png" class="slide-image" />
          <h2 class="slide-title">
            Welcome to
            <b>ICA</b>
          </h2>
          <p>
            The
            <b>ionic conference app</b> is a practical preview of the ionic framework in action, and a demonstration of proper code use.
          </p>
        </SwiperSlide>

        <SwiperSlide class="slide">
          <img src="./../../public/assets/img/ica-slidebox-img-1.png" class="slide-image" />
          <h2 class="slide-title">What is Ionic?</h2>
          <p>
            <b>Ionic Framework</b> is an open source SDK that enables developers to build high-quality mobile apps with web technologies
            like HTML, CSS, and JavaScript.
          </p>
        </SwiperSlide>

        <SwiperSlide class="slide">
          <img src="./../../public/assets/img/ica-slidebox-img-3.png" class="slide-image" />
          <h2 class="slide-title">What is Ionic Pro?</h2>
          <p>
            <b>Ionic Pro</b> is a powerful set of services and features built on top of Ionic Framework that brings a totally new
            level of app development agility to mobile dev teams.
          </p>
        </SwiperSlide>

        <SwiperSlide class="slide">
          <img src="./../../public/assets/img/ica-slidebox-img-4.png" class="slide-image" />
          <h2 class="slide-title">Ready to Play?</h2>

          <ion-button fill="clear" @click="navigateToSchedule">
            Continue
            <ion-icon slot="end" :icon="arrowForward"></ion-icon>
          </ion-button>
        </SwiperSlide>
      </Swiper>
    </ion-content>
  </ion-page>
</template>

<style scoped>
  ion-header {
    background-color: var(--ion-background-color, #fff);
  }

  .slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-align: center;
    scroll-snap-align: center;
    scroll-snap-stop: always;
  }

  .swiper {
    width: 100%;
    height: 100%;
  }

  .slide-title {
    margin-top: 2.8rem;
  }

  .slide-image {
    max-height: 100%;
    max-width: 100%;
    margin: 36px 0;
  }

  b {
    font-weight: bold;
  }

  p {
    padding: 0 40px;

    color: var(--ion-color-step-600, #60646b);

    font-size: 14px;

    line-height: 1.5;

    b {
      color: var(--ion-text-color, #000000);
    }
  }
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonIcon,
  IonButton,
  menuController,
} from '@ionic/vue';
import { arrowForward } from "ionicons/icons";
import 'swiper/css';
import router from '@/router';
import { Storage } from '@ionic/storage';

const swiper = ref(null);
const ionDidTutorial = ref(false);
const storage = new Storage();

const onSwiper = (instance: any) => {
  swiper.value = instance;
};

const onSlideChange = () => {
};

const navigateToSchedule = async () => {
  menuController.enable(true);
  await storage.set('ion_did_tutorial', true);
  await router.push({ name: 'schedule' });
};

const checkTutorialStatus = async () => {
  await storage.create().then(async () => {
    await storage.get('ion_did_tutorial').then(async (result: any) => {
      if (result === true) {
        await navigateToSchedule();
      } else {
        ionDidTutorial.value = true;
      }
    });
  });
};

onMounted(async () => {
  await storage.create();
  menuController.enable(false);
  await checkTutorialStatus();
});

</script>