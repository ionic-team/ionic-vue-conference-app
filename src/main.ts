import Vue from 'vue';
import Ionic from '@ionic/vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './filters';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
Vue.config.productionTip = false;

Vue.use(Ionic);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
