import Vue from "vue";
import JQuery from "jquery";
import CKEditor from "@ckeditor/ckeditor5-vue";
import FormBuilder from "v-form-builder";
import infiniteScroll from "vue-infinite-scroll";

Vue.prototype.jQuery = JQuery;

Vue.use(CKEditor);

Vue.use(infiniteScroll);

Vue.component("FormBuilder", FormBuilder);

import Print from "vue-print-plugin";
Vue.use(Print);

import VueBarcode from "vue-barcode";
Vue.component("barcode", VueBarcode);

import Clipboard from "v-clipboard";
Vue.use(Clipboard);

import VueProgressBar from "vue-progressbar";
Vue.use(VueProgressBar, {
  color: "rgb(24, 102, 191)",
  failedColor: "red",
  height: "2px"
});

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
 
Vue.component('DateTimePicker', VueCtkDateTimePicker);
