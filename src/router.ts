import Vue from 'vue'
import Router from 'vue-router'
import Tutorial from './views/Tutorial.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/tutorial',
    },
    {
      path: '/account',
      name: 'account',
      component: () => import(/* webpackChunkName: "about" */ './views/Account.vue')
    },
    {
      path: '/support',
      name: 'support',
      component: () => import(/* webpackChunkName: "about" */ './views/Support.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ './views/Login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import(/* webpackChunkName: "about" */ './views/Signup.vue')
    },
    {
      path: '/app',
      name: 'app',
      component: () => import(/* webpackChunkName: "about" */ './views/Tabs-page.vue')
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: Tutorial
    }
  ]
})
