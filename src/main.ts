import Vue from 'vue'
import { defineCustomElements } from '@ionic/core/loader';
import App from './App.vue'
import router from './router'
import store from './store'


Vue.config.productionTip = false;
Vue.config.ignoredElements = [/ion-\w*/];

defineCustomElements(window);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
