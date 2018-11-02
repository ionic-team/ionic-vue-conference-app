import Vue from 'vue';
import Ionic, { Controllers } from '@ionic/vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { format, parse } from 'date-fns';


Vue.config.productionTip = false;
Vue.config.ignoredElements = [/ion-\w*/];

declare module 'vue/types/vue' {
  interface Vue {
    $ionic: Controllers;
  }
}

Vue.use(Ionic);

Vue.filter('dateFormat', function (dateString: string, formatString: string) {
  return format(parse(dateString), formatString);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
