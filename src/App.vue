<template>
  <div id="app">
    <ion-app>
      <ion-split-pane>
        <Menu/>
        <ion-vue-router main id="menu-content" />
      </ion-split-pane>
    </ion-app>
  </div>
</template>

<style src='@ionic/core/css/ionic.bundle.css'></style>
<style src='./theme.css'></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Menu from "./components/Menu.vue";

@Component({
  components: {
    Menu
  }
})
export default class App extends Vue {
  mounted() {
    console.log("tes");
  }
}
</script>
