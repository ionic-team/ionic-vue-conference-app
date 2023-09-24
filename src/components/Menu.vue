<template>
  <ion-menu content-id="main-content">
    <ion-content class="ion-padding">
      <ion-list lines="none">
        <ion-list-header>
          Navigate
        </ion-list-header>
        <ion-menu-toggle auto-hide="false" v-for="p in appPages" :key="p.title">
          <ion-item button @click="navigate(p.url)">
            <ion-icon slot="start" :icon="p.icon"></ion-icon>
            <ion-label>
              {{p.title}}
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
      <ion-list v-if="loggedIn" lines="none">
        <ion-list-header>
          Account
        </ion-list-header>
        <ion-menu-toggle auto-hide="false">
          <ion-item button @click="navigate('/account')">
            <ion-icon slot="start" :icon="ionIcons.person"></ion-icon>
            <ion-label>
              Account
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-menu-toggle auto-hide="false">
          <ion-item button @click="navigate('/support')">
            <ion-icon slot="start" :icon="ionIcons.help"></ion-icon>
            <ion-label>
              Support
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-menu-toggle auto-hide="false">
          <ion-item button @click="logout()">
            <ion-icon slot="start" :icon="ionIcons.logOut"></ion-icon>
            <ion-label>
              Logout
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
      <ion-list v-if="!loggedIn" lines="none">
        <ion-list-header>
          Account
        </ion-list-header>
        <ion-menu-toggle auto-hide="false">
          <ion-item button @click="navigate('/login')">
            <ion-icon slot="start" :icon="ionIcons.logIn"></ion-icon>
            <ion-label>
              Login
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-menu-toggle auto-hide="false">
          <ion-item button @click="navigate('/support')">
            <ion-icon slot="start" :icon="ionIcons.help"></ion-icon>
            <ion-label>
              Support
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-menu-toggle auto-hide="false">
          <ion-item button @click="navigate('/signup')">
            <ion-icon slot="start" :icon="ionIcons.personAdd"></ion-icon>
            <ion-label>
              Signup
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-item>
          <ion-icon slot="start" :icon="ionIcons.moonOutline"></ion-icon>
            <ion-toggle v-model="localDark" label-placement="start">
              Dark Mode
            </ion-toggle>
          </ion-item>
      </ion-list>
      <ion-list lines="none">
        <ion-list-header>
          Tutorial
        </ion-list-header>
        <ion-menu-toggle auto-hide="false">
          <ion-item button @click="openTutorial()">
            <ion-icon slot="start" :icon="ionIcons.hammer"></ion-icon>
            <ion-label>Show Tutorial</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { useStore } from '@/store';

import {
  IonContent,
  IonMenuButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
  IonToggle,
} from '@ionic/vue';
import * as ionIcons from "ionicons/icons";
import {
  calendar,
  people,
  map,
  informationCircle
} from "ionicons/icons";
import router from '@/router';
import { Storage } from '@ionic/storage';
export default defineComponent({
  name: 'Menu',
  components: {
    IonHeader,
    IonContent,
    IonMenuButton,
    IonButtons,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonTitle,
    IonToolbar,
    IonToggle,
  },
  props: {
    darkMode: Boolean,
  },
  emits: ['dark-mode-changed'],
  setup(props) {
    const instance = getCurrentInstance();
    const store = useStore();
    const localDark = ref(false);
    const loggedIn = ref(false);
    const storage = new Storage();

    watch(localDark, (newVal) => {
      updateDarkMode(newVal);
    });

    const updateDarkMode = (newDarkValue: boolean) => {
      instance?.emit('dark-mode-changed', newDarkValue);
    }

    const isDarkMode = computed(() => store.getters.isDarkMode);

    const setLocalDarkMode = (newDarkValue: boolean) => {
      localDark.value = newDarkValue;
      updateDarkMode(newDarkValue);
    }

    const openTutorial = async () => {
      await storage.set('ion_did_tutorial', false);
      await router.push({ name: 'tutorial' });
    }

    const navigate = (url: string) => {
      router.push(url);
    }

    const logout = () => {
    }

    onMounted(async () => {
      await storage.create();
    });

    return {
    localDark,
    isDarkMode,
    setLocalDarkMode,
    openTutorial,
    navigate,
    logout,
    loggedIn,
    updateDarkMode
  };

  },
  data() {
    return {
      ionIcons,
      calendar,
      people,
      map,
      informationCircle,
      appPages: [
        {
          title: 'Schedule',
          url: '/tabs/schedule',
          name: 'tabs.schedule',
          icon: calendar
        },
        {
          title: 'Speakers',
          url: '/tabs/speakers',
          icon: people
        },
        {
          title: 'Map',
          url: '/tabs/map',
          icon: map
        },
        {
          title: 'About',
          url: '/tabs/about',
          icon: informationCircle
        }
      ]
    };
  }
});
</script>