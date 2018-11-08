<template>
  <div id="app">
    <ion-app>
      <ion-split-pane>
        <Menu />
        <router-view/>
      </ion-split-pane>
    </ion-app>
  </div>
</template>

<style src='@ionic/core/css/core.css'></style>
<style>
  ion-content {
    --ion-color-primary: #488aff;
    --ion-color-angular: #ac282b;
    --ion-color-communication: #8e8d93;
    --ion-color-tooling: #fe4c52;
    --ion-color-services: #fd8b2d;
    --ion-color-design: #fed035;
    --ion-color-workshop: #69bb7b;
    --ion-color-food: #3bc7c4;
    --ion-color-documentation: #b16be3;
    --ion-color-navigation: #6600cc;
  }
</style>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import Menu from './components/Menu.vue';

  @Component({
    components: {
      Menu
    }
  })
  export default class App extends Vue {
  }
</script>
