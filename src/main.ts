import Vue from 'vue';
import { Ionic, IonicAPI } from '@ionic/vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/ion-\w*/];

Ionic.init();
Vue.use(IonicAPI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
