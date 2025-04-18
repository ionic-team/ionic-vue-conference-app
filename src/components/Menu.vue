<template>
  <ion-menu content-id="main-content">
    <ion-content>
      <ion-list lines="none">
        <ion-list-header>
          Conference
        </ion-list-header>
        <ion-menu-toggle :auto-hide="false" v-for="p in appPages" :key="p.title">
          <ion-item
            button
            :detail="false"
            router-direction="root"
            :router-link="p.url"
            :class="{ 'selected': isSelected(p.url) }"
          >
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
        <ion-menu-toggle :auto-hide="false">
          <ion-item
            button
            :detail="false"
            router-direction="root"
            router-link="/account"
            :class="{ 'selected': isSelected('/account') }"
          >
            <ion-icon slot="start" :icon="ionIcons.person"></ion-icon>
            <ion-label>
              Account
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-menu-toggle :auto-hide="false">
          <ion-item
            button
            :detail="false"
            router-direction="root"
            router-link="/support"
            :class="{ 'selected': isSelected('/support') }"
          >
            <ion-icon slot="start" :icon="ionIcons.help"></ion-icon>
            <ion-label>
              Support
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-menu-toggle :auto-hide="false">
          <ion-item button :detail="false" @click="logout()">
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
        <ion-menu-toggle :auto-hide="false">
          <ion-item
            button
            :detail="false"
            router-direction="root"
            router-link="/login"
            :class="{ 'selected': isSelected('/login') }"
          >
            <ion-icon slot="start" :icon="ionIcons.logIn"></ion-icon>
            <ion-label>
              Login
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-menu-toggle :auto-hide="false">
          <ion-item
            button
            :detail="false"
            router-direction="root"
            router-link="/support"
            :class="{ 'selected': isSelected('/support') }"
          >
            <ion-icon slot="start" :icon="ionIcons.help"></ion-icon>
            <ion-label>
              Support
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-menu-toggle :auto-hide="false">
          <ion-item
            button
            :detail="false"
            router-direction="root"
            router-link="/signup"
            :class="{ 'selected': isSelected('/signup') }"
          >
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
        <ion-menu-toggle :auto-hide="false">
          <ion-item button :detail="false" @click="openTutorial()">
            <ion-icon slot="start" :icon="ionIcons.hammer"></ion-icon>
            <ion-label>Show Tutorial</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useStore } from '@/store';
import { useRoute } from 'vue-router';
import router from '@/router';
import { Storage } from '@ionic/storage';
import { menuController } from '@ionic/vue';

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
  calendarOutline,
  peopleOutline,
  mapOutline,
  informationCircleOutline
} from "ionicons/icons";

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
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const localDark = ref(false);
    const loggedIn = ref(false);
    const storage = new Storage();

    const isSelected = (path: string) => {
      return route.path.startsWith(path);
    };

    watch(localDark, (newVal) => {
      updateDarkMode(newVal);
    });

    const updateDarkMode = (newDarkValue: boolean) => {
      emit('dark-mode-changed', newDarkValue);
    }

    const isDarkMode = computed(() => store.getters.isDarkMode);

    const setLocalDarkMode = (newDarkValue: boolean) => {
      localDark.value = newDarkValue;
      updateDarkMode(newDarkValue);
    }

    const openTutorial = async () => {
      await storage.create();
      await storage.set('ion_did_tutorial', false);
      await menuController.enable(false);
      await router.push('/tutorial');
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
      logout,
      loggedIn,
      updateDarkMode,
      isSelected
    };
  },
  data() {
    return {
      ionIcons,
      calendarOutline,
      peopleOutline,
      mapOutline,
      informationCircleOutline,
      appPages: [
        {
          title: 'Schedule',
          url: '/tabs/schedule',
          name: 'tabs.schedule',
          icon: calendarOutline
        },
        {
          title: 'Speakers',
          url: '/tabs/speakers',
          icon: peopleOutline
        },
        {
          title: 'Map',
          url: '/tabs/map',
          icon: mapOutline
        },
        {
          title: 'About',
          url: '/tabs/about',
          icon: informationCircleOutline
        }
      ]
    };
  }
});
</script>

<style scoped>
ion-menu ion-content {
  --padding-top: 20px;
  --padding-bottom: 20px;
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

/* Remove background transitions for switching themes */
ion-menu ion-item {
  --transition: none;
}

ion-item.selected {
  --color: var(--ion-color-primary);
}

/*
 * Material Design Menu
*/
ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-list-header {
  padding-left: 18px;
  padding-right: 18px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: min(0.875rem, 32px);
  font-weight: 450;
}

ion-menu.md ion-item {
  --padding-start: 18px;
  margin-right: 10px;
  border-radius: 0 50px 50px 0;
  font-weight: 500;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-list-header,
ion-menu.md ion-item ion-icon {
  color: var(--ion-color-step-650, #5f6368);
}

ion-menu.md ion-list:not(:last-of-type) {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

/*
 * iOS Menu
*/
ion-menu.ios ion-list-header {
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 8px;
  font-size: clamp(22px, 1.375rem, 40px);
}

ion-menu.ios ion-list {
  padding: 20px 0 0;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}
</style>
