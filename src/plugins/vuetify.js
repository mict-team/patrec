import Vue from "vue";
import Vuetify from "vuetify/lib";
import i18n from "@/i18n";
import "@mdi/font/css/materialdesignicons.css";
import "@/sass/overrides.sass";
//import 'vuetify/dist/vuetify.min.css';

// Vue.use(Vuetify, {
//   iconfont: "md"
// });

Vue.use(Vuetify);
var theme = {
  primary: "#1867C0",
  secondary: "#5CBBF6",
  tertiary: "#E57373",
  accent: "#9C27b0",
  info: "#00CAE3",
  danger: "#bb0404"
};

export default new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  },
  theme: {
    themes: {
      dark: theme,
      light: theme
    }
  },
  options: {
    minifyTheme: css => {
      return process.env.NODE_ENV === "production"
        ? css.replace(/[\s|\r\n|\r|\n]/g, "")
        : css;
    }
  },
  icons: {
    iconfont: "mdi"
  }
});
