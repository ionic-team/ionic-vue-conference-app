import Vue from 'vue';
import Router, { NavigationGuard } from 'vue-router';
import store from './store';
import Tutorial from '@/views/Tutorial.vue';
import Home from '@/views/Home.vue';

Vue.use(Router);

const privateRoute: NavigationGuard = function (to, from, next) {

  if (!store.state.user.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
}

const requiresTutorialRoute: NavigationGuard = function (to, from, next) {
  if (!store.state.user.hasSeenTutorial) {
    next({ name: 'tutorial' });
  } else {
    next();
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/tutorial',
      name: 'tutorial',
      component: Tutorial
    },
    {
      path: '/account',
      name: 'account',
      component: () => import(/* webpackChunkName: "account" */ '@/views/Account.vue'),
      beforeEnter: privateRoute
    },
    {
      path: '/support',
      name: 'support',
      component: () => import(/* webpackChunkName: "support" */ '@/views/Support.vue'),
      beforeEnter: requiresTutorialRoute
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
      beforeEnter: requiresTutorialRoute
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import(/* webpackChunkName: "signup" */ '@/views/Signup.vue'),
      beforeEnter: requiresTutorialRoute
    },
    {
      path: '/:tabs*',
      name: 'home',
      component: Home,
      beforeEnter: requiresTutorialRoute
    },
  ]
});
