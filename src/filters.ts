import { format, parse } from 'date-fns';
import Vue from 'vue';

Vue.filter('dateFormat', function (dateString: string, formatString: string) {
  return format(parse(dateString), formatString);
});

Vue.filter('lowercase', function (value: string) {
  return value.toLowerCase();
});
