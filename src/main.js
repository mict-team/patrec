import Vue from "vue";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./shared/store";
import cors from "cors";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import JQuery from "jquery";

Vue.config.productionTip = false;

Vue.prototype.jQuery = JQuery;

Vue.use(cors)
Vue.filter("truncate", function(string, value) {
  if (string === undefined) return "";
  return string.substring(0, value) + "...";
});

Vue.filter("toDecimal", function(amount) {
  let val = (amount / 1).toFixed(2).replace(",", ".");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

Vue.filter("toTitleCase", function(string) {
  let str = string.toLowerCase();
  str = str.split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
