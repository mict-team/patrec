import Vue from "vue";
require("./toastr/animate.css");
import VueToastr from "./toastr/index";

Vue.use(VueToastr, {
  defaultTimeout: 3000,
  //defaultProgressBar: true,
  //defaultProgressBarValue: 100,
  defaultType: "error",
  //defaultPosition: "toast-top-full-width",
  //defaultCloseOnHover: false,
  defaultStyle: { "background-color": "red" },
  defaultClassNames: ["animated", "zoomInUp"]
});
