<template>
  <ion-app>
    <ion-split-pane content-id="main-content" v-if="!isTutorialPage">
      <Menu :dark="dark" @dark-mode-changed="handleDarkModeChanged" />
      <ion-router-outlet id="main-content" />
    </ion-split-pane>
    <ion-router-outlet v-else />
  </ion-app>
</template>

<style src="./theme/variables.css"></style>

<script lang="ts">
import { IonApp, IonSplitPane, IonRouterOutlet } from '@ionic/vue';
import type { Ref } from 'vue';
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import Menu from './components/Menu.vue';

import { useStore } from '@/store';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonSplitPane,
    IonRouterOutlet,
    Menu,
  },
  setup() {
    const dark: Ref<boolean> = ref(false);
    const route = useRoute();
    const store = useStore();

    const isTutorialPage = computed(() => {
      return route.name === 'tutorial';
    });

    const handleDarkModeChanged = (newDarkValue: boolean) => {
      dark.value = newDarkValue;
      document.documentElement.classList.toggle('ion-palette-dark', newDarkValue);
    };

    onMounted(async () => {
      store.dispatch('loadSessionData');
      store.dispatch('loadSpeakerData');
      await store.dispatch('fetchTracks');
    });

    return {
      dark,
      handleDarkModeChanged,
      isTutorialPage,
    };
  },
});
</script>
