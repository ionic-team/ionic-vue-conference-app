import Vue from 'vue';
import { IonicVueRouter } from '@ionic/vue';
import store from './store';

Vue.use(IonicVueRouter);

// const privateRoute: NavigationGuard = function(to, from, next) {
//   if (!store.state.user.isAuthenticated) {
//     next({ name: 'login' });
//   } else {
//     next();
//   }
// };

// const requiresTutorialRoute: NavigationGuard = function(to, from, next) {
//   // if (!store.state.user.hasSeenTutorial) {
//   // next({ name: 'tutorial' });
//   // } else {
//   next();
//   // }
// };

export default new IonicVueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/tutorial',
    //   name: 'tutorial',
    //   component: Tutorial
    // },
    // {
    //   path: '/account',
    //   name: 'account',
    //   component: () => import('@/views/Account.vue')
    //   // beforeEnter: privateRoute
    // },
    {
      path: '/support',
      name: 'support',
      component: () => import('@/views/Support.vue')
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () =>
    //     import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    //   beforeEnter: requiresTutorialRoute
    // },
    // {
    //   path: '/signup',
    //   name: 'signup',
    //   component: () =>
    //     import(/* webpackChunkName: "signup" */ '@/views/Signup.vue'),
    //   beforeEnter: requiresTutorialRoute
    // },

    {
      path: '/tabs',
      component: () => import('@/views/Tabs.vue'),
      children: [
        {
          path: 'schedule',
          components: { session: () => import('@/views/SessionList.vue') }
        },
        {
          name: 'session-detail',
          path: 'schedule/session/:sessionId',
          components: { session: () => import('@/views/SessionDetail.vue') }
        }

        // { path: 'speakers', name: 'tabs.speakers', children: [] },
        // { path: 'map', name: 'tabs.map', children: [] },
        // { path: 'about', name: 'tabs.about', children: [] }
      ]
    },
    {
      path: '/',
      redirect: '/support'
    }

    // beforeEnter: requiresTutorialRoute
  ]
});
