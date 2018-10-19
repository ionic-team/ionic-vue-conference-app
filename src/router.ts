import Vue from 'vue';
import Router, { NavigationGuard } from 'vue-router';
import store from './store';
import Tutorial from './components/Tutorial.vue';

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
      path: '/',
      name: 'app',
      component: () => import(/* webpackChunkName: "about" */ './components/App.vue'),
      beforeEnter: requiresTutorialRoute
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: Tutorial
    },
    {
      path: '/account',
      name: 'account',
      component: () => import(/* webpackChunkName: "about" */ './components/Account.vue'),
      beforeEnter: privateRoute
    },
    {
      path: '/support',
      name: 'support',
      component: () => import(/* webpackChunkName: "about" */ './components/Support.vue'),
      beforeEnter: requiresTutorialRoute
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ './components/Login.vue'),
      beforeEnter: requiresTutorialRoute
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import(/* webpackChunkName: "about" */ './components/Signup.vue'),
      beforeEnter: requiresTutorialRoute
    }
  ]
});
