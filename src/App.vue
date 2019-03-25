<template>
  <div id="app">
    <ion-app>
      <ion-split-pane>
        <Menu/>
        <ion-vue-router main :animated="false" id="menu-content" />
      </ion-split-pane>
    </ion-app>
  </div>
</template>

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
    this.$store.dispatch("loadSessionData");
    this.$store.dispatch("loadSpeakerData");
  }
}
</script>
