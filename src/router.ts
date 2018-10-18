import Vue from 'vue';
import Router, { NavigationGuard } from 'vue-router';
import Tutorial from './views/Tutorial.vue';

Vue.use(Router);

const privateRoute: NavigationGuard = function (to, from, next) {
  if (!User.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
}

const requiresTutorialRoute: NavigationGuard = function (to, from, next) {
  if (!hasSeenTutorial) {
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
      component: () => import(/* webpackChunkName: "about" */ './views/App.vue'),
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
      component: () => import(/* webpackChunkName: "about" */ './views/Account.vue'),
      beforeEnter: privateRoute
    },
    {
      path: '/support',
      name: 'support',
      component: () => import(/* webpackChunkName: "about" */ './views/Support.vue'),
      beforeEnter: requiresTutorialRoute
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ './views/Login.vue'),
      beforeEnter: requiresTutorialRoute
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import(/* webpackChunkName: "about" */ './views/Signup.vue'),
      beforeEnter: requiresTutorialRoute
    }
  ]
});
