import Vue from "vue";
import axios from "axios";
import { URL, LS } from "./config.js";
import { MENUS } from "./menus.js";
import { mapActions, mapState } from "vuex";
const token = Buffer.from("mictexplorers Adedeji27@", "utf8").toString(
  "base64"
);

let url=window.location.protocol+'//'+window.location.hostname;
url=process.env.NODE_ENV === 'production'
  ? url+"/backend/api"
  : 'http://mict.local/patrec/api';
axios.defaults.baseURL = 'http://mict.local/patrec/api';
//this.$store.dispatch('checkStorage');
Vue.mixin({
  computed: {
    ...mapState([
      "outlet",
    ]),
    getItems(){
      return this.patients.result;
    }
  },
  methods: {
    ...mapActions([
      "checkStorage",
    ]),
    get: function(urls) {
      //alert(this.$store.state.outlet.code)
      return new Promise((resolve, reject) => {
        axios
          .get(urls, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "text/json"
            }
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(e => {
            //console.log(e)
            this.$toastr.error(e.message);
            reject(false);
          });
      });
    },

    getMultiple: function(urls) {
      return new Promise((resolve, reject) => {
        axios
          .all(urls, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "text/json"
            }
          })
          .then(
            axios.spread((...responses) => {
              console.log(responses[0]);
              resolve(responses);
            })
          )
          .catch(e => {
            //console.log(e)
            this.$toastr.error(e.message);
            reject(false);
          });
      });
    },

    download: function(urls) {
      return new Promise((resolve, reject) => {
        axios({
          url: URL + urls,
          method: "GET",
          responseType: "blob"
        })
          .then(response => {
            var fileURL = window.URL.createObjectURL(new Blob([response.data]));
            var fileLink = document.createElement("a");
            fileLink.href = fileURL;
            fileLink.setAttribute("download", "file.pdf");
            document.body.appendChild(fileLink);
            fileLink.click();
            return resolve(true);
          })
          .catch(e => {
            return reject(false);
          });
      });
    },

    post: function(urls, data) {
      return new Promise((resolve, reject) => {
        axios
          .post(urls, data, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "text/json"
            }
          })
          .then(response => {
            //console.log(response.data)
            resolve(response.data);
          })
          .catch(e => {
            //console.log(urls, JSON.stringify(e))
            this.$toastr.error(e.message);
            reject(false);
          });
      });
    },

    postOnline: function(urls, data) {
      return new Promise((resolve, reject) => {
        axios({
          baseURL: "",
          url: urls,
          method: "POST",
          data: data,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "text/json"
          }
        })
          .then(response => {
            resolve(response.data);
          })
          .catch(e => {
            this.$toastr.error(e.message);
            reject(false);
          });
      });
    },

    assignMenus: function() {
      return new Promise((resolve, reject) => {
        let menu = [];
        MENUS.forEach(element => {
          if (!element.isAdmin || element.none) {
            menu.push(element);
          }
        });
        Promise.all(menu).then(resp => {
          resolve(resp);
        });
      });
    },
    assignAutoMenus: function(menus) {
      return new Promise((resolve, reject) => {
        menus=menus.sort((a, b) => (a.id > b.id) ? 1 : -1);
        //alert(JSON.stringify(menus))
        let menu = [];
        let divider='';
        let homeFixed=false;
        let searchFixed=false;
        menus.forEach(element => {
          /*if (element.hasOwnProperty("home") && !homeFixed) {
            console.log(element.home)
            LS.set("home", element.home);
            this.$route.meta.page=element.home;
            homeFixed=true;
          }
          if (element.hasOwnProperty("searchPath") && !searchFixed) {
            LS.set("searchPath", element.searchPath);
            searchFixed=true;
          }*/
          if(element.parent !=divider){
            menu.push({ divider: 'divider', text: element.parent });
            divider=element.parent;
            //continue forEach;
          }
          menu.push(element);
        });
        Promise.all(menu).then(resp => {
          resolve(resp);
        });
      });
    }
  },
  mounted() {
    this.checkStorage();
  }
});
