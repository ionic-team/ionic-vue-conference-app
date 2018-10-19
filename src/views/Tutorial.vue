<template>
  <div class=" ion-page page-tutorial">
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button color='primary' v-on:click="endTutorial()" v-show="!showSkip">Skip</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-slides v-on:ionSlideDidChange="onSlideChangeStart($event)" pager="false">
        <ion-slide>
          <img src="../assets/img/ica-slidebox-img-1.png" class="slide-image" />
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
          <img src="../assets/img/ica-slidebox-img-2.png" class="slide-image" />
          <h2 class="slide-title">What is Ionic?</h2>
          <p>
            <b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies
            like HTML, CSS, and JavaScript.</p>
        </ion-slide>

        <ion-slide>
          <img src="../assets/img/ica-slidebox-img-3.png" class="slide-image" />
          <h2 class="slide-title">What is Ionic Pro?</h2>
          <p>
            <b>Ionic Pro</b> is a powerful set of services and features built on top of Ionic Framework that brings a totally new
            level of app development agility to mobile dev teams.</p>
        </ion-slide>

        <ion-slide>
          <img src="../assets/img/ica-slidebox-img-4.png" class="slide-image" />
          <h2 class="slide-title">Ready to Play?</h2>
          <ion-button fill="clear" v-on:click="endTutorial()">
            Continue
            <ion-icon slot="end" name="arrow-forward"></ion-icon>
          </ion-button>
        </ion-slide>
      </ion-slides>
    </ion-content>
  </div>
</template>

<style>
  .page-tutorial ion-toolbar {
    --background: transparent;
    --border-color: transparent;
  }

  .page-tutorial .swiper-slide {
    display: block;
  }

  .page-tutorial .slide-title {
    margin-top: 2.8rem;
  }

  .page-tutorial .slide-image {
    max-height: 50%;
    max-width: 60%;
    margin: 36px 0;
  }

  .page-tutorial b {
    font-weight: 500;
  }

  .page-tutorial p {
    padding: 0 40px;
    font-size: 14px;
    line-height: 1.5;
    color: #60646B;
  }

  .page-tutorial p b {
    color: #000000;
  }

  .ion-page {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    position: absolute;
    flex-direction: column;
    justify-content: space-between;
    contain: layout size style;
    overflow: hidden;
    z-index: 0;
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
    this.$router.push({ name: 'speaker-list' })
  }
}
</script>
