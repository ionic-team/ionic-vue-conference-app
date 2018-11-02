<template>
  <div main class="ion-page">
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button color='primary' @click="endTutorial()" v-show="!showSkip">Skip</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-slides @ionSlideDidChange="onSlideChangeStart($event)" pager="false">
        <ion-slide>
          <img src="/assets/img/ica-slidebox-img-1.png" class="slide-image" />
          <h2 class="slide-title">
            Welcome to
            <b>ICA</b>
          </h2>
          <p>
            The
            <b>ionic conference app</b> is a practical preview of the ionic framework in action, and a demonstration of proper code
            use.
          </p>
        </ion-slide>

        <ion-slide>
          <img src="/assets/img/ica-slidebox-img-2.png" class="slide-image" />
          <h2 class="slide-title">What is Ionic?</h2>
          <p>
            <b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies
            like HTML, CSS, and JavaScript.</p>
        </ion-slide>

        <ion-slide>
          <img src="/assets/img/ica-slidebox-img-3.png" class="slide-image" />
          <h2 class="slide-title">What is Ionic Pro?</h2>
          <p>
            <b>Ionic Pro</b> is a powerful set of services and features built on top of Ionic Framework that brings a totally new
            level of app development agility to mobile dev teams.</p>
        </ion-slide>

        <ion-slide>
          <img src="/assets/img/ica-slidebox-img-4.png" class="slide-image" />
          <h2 class="slide-title">Ready to Play?</h2>
          <ion-button fill="clear" @click="endTutorial()">
            Continue
            <ion-icon slot="end" name="arrow-forward"></ion-icon>
          </ion-button>
        </ion-slide>
      </ion-slides>
    </ion-content>
  </div>
</template>

<style scoped>
  ion-toolbar {
    --background: transparent;
    --border-color: transparent;
  }

  .swiper-slide {
    display: block;
  }

  .slide-title {
    margin-top: 2.8rem;
  }

  .slide-image {
    max-height: 50%;
    max-width: 60%;
    margin: 36px 0;
  }

  b {
    font-weight: 500;
  }

  p {
    padding: 0 40px;
    font-size: 14px;
    line-height: 1.5;
    color: #60646B;
  }

  p b {
    color: #000000;
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Tutorial extends Vue {
  showSkip = false;

  onSlideChangeStart() {
    this.showSkip = true;
  }

  endTutorial() {
    this.$store.dispatch('sawTutorial');
    this.$router.push('/speakers');
  }
}
</script>
