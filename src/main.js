import Vue from "vue";
import "./plugins/base";
import vuetify from "./plugins/vuetify";
import "./plugins/toastr";
import "./plugins/chartist";
import "./plugins/vee-validate";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import App from "./App.vue";
import router from "./router";
import store from "./shared/store";
import cors from "cors";
import "./shared/Component";
import "./shared/mixin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./shared/directives";
import i18n from "./i18n";

//if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.performance = process.env.NODE_ENV === "development";
//Vue.config.devtools = false;
Vue.config.productionTip = false;

const corsOptions = {
  exposedHeaders: "Authorization, Outlet"
};

Vue.use(cors, corsOptions);

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
