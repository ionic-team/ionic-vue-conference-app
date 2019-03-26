import Vue from 'vue';
import { NavigationGuard } from 'vue-router';
import { IonicVueRouter } from '@ionic/vue';
import store from './store';

Vue.use(IonicVueRouter);

const privateRoute: NavigationGuard = function(to, from, next) {
  if (!store.state.user.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
};

// const requiresTutorialRoute: NavigationGuard = function(to, from, next) {
//   // if (!store.state.user.hasSeenTutorial) {
//   // next({ name: 'tutorial' });
//   // } else {
//   next();
//   // }
// };

// base: process.env.BASE_URL,
export default new IonicVueRouter({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/tutorial',
      name: 'tutorial',
      component: () => import('@/views/Tutorial.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/Account.vue'),
      beforeEnter: privateRoute
    },
    {
      path: '/support',
      name: 'support',
      component: () => import('@/views/Support.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
      // beforeEnter: requiresTutorialRoute
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/Signup.vue')
      // beforeEnter: requiresTutorialRoute
    },

    {
      path: '/tabs',
      component: () => import('@/views/Tabs.vue'),
      children: [
        {
          path: 'schedule',
          name: 'schedule',
          components: { session: () => import('@/views/SessionList.vue') }
        },
        {
          name: 'session-detail',
          path: 'schedule/session/:sessionId',
          components: { session: () => import('@/views/SessionDetail.vue') }
        },

        {
          path: 'speakers',
          name: 'speakers',
          components: {
            speaker: () => import('@/views/SpeakerList.vue')
          }
        },
        {
          path: 'speakers/speaker/:speakerId',
          name: 'speaker-detail',
          components: {
            speaker: () => import('@/views/SpeakerDetail.vue')
          }
        },
        {
          path: 'speakers/session/:sessionId',
          name: 'speaker-session-detail',
          components: { speaker: () => import('@/views/SessionDetail.vue') }
        },
        {
          path: 'map',
          name: 'map',
          components: { map: () => import('@/views/Map.vue') }
        },
        {
          path: 'about',
          name: 'about',
          components: { about: () => import('@/views/About.vue') }
        }
      ]
    },
    { path: '/', redirect: 'tabs/schedule' }

    // beforeEnter: requiresTutorialRoute
  ]
});
