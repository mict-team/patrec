<template>
  <div>
    <template v-if="isLoading">
      <Loading caption="Please holdon while Patrec configures your platform specifics."
      ></Loading>
    </template>
    <template  v-if="error">
      <v-row>
        <v-col cols="12" md="3"></v-col>
        <v-col cols="12" md="6" class="text-center">
          <v-card>
            <v-toolbar class="red" style="background-color:red; color:#fff; font-size: 25px;">
              Error
            </v-toolbar>
            <v-container grid-list-sm class="pa-4">
              <v-layout row style="text-align: left !important;">
                <v-flex xs12 center>
                  {{ message }}
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" @click="closeSetup">Close</v-btn>
            </v-card-actions>
          </v-card>
          <img src="../assets/patrec.png" alt="Patrec" width="50%" />
        </v-col>
        <v-col cols="12" md="3"></v-col>
      </v-row>
    </template>
    <template v-if="selectoutlet">
      <v-card>
        <v-toolbar class="display-4 flex-grow-1">
          Select your working facility
        </v-toolbar>
        <v-container grid-list-sm class="pa-4">
          <v-row justify="space-around">
            <v-col v-for="(outlet, ind) in outlets" :key="ind" cols="12" md="3">
              <v-item v-slot:default="{ active, toggle }">
                <v-card
                  :color="active ? 'primary' : ''"
                  class="d-flex align-center"
                  dark
                  height="200"
                  @click="pickOutlet(outlet); toggle "
                >
                  <v-scroll-y-transition>
                    <div v-if="active" class="display-4 flex-grow-1 text-center blue">
                      {{outlet.name}}
                    </div>
                    <div v-else class="text-center pt-5" style="font-size:30px">
                      {{outlet.name}}
                    </div>
                  </v-scroll-y-transition>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="closeSetup">Close</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import { URL, LS, SHA256 } from "../shared/config.js";
import { DATA, PAYMENTMETHOD } from "../shared/data.js";
import { mapState, mapActions } from "vuex";
import Loading from "./shared/Loading";
import * as fs from "fs-web";
export default {
  data: () => ({
    drawer: null,
    message: "",
    error: false,
    selectoutlet: false,
    isLoading: true,
    outlets:[],
    user:[]
  }),
  props: {
    source: String
  },
  components: {
    Loading
  },
  computed: {
    ...mapState(["outlet"]),
    outletExists: () => {
      return this.outlet.length > 0;
    }
  },
  methods: {
    ...mapActions([
      "setOutlet",
      "setUser",
      "setRoles",
      "setGroup",
      "setChats",
      "setDepartment",
      "setDrugs",
      "setPaymentMethods",
      "setPlatform",
      "setTransactions",
      "setSchemes",
      "setSettings",
      "setDomain",
      "checkStorage",
      "saveStorage"
    ]),
    closeSetup: function() {
      this.$router.push("/");
    },
    setupPlatform: function() {
      this.$Progress.start();
      let user = LS.get("user");
      var postData = {
        user: user.id
      };
      var check = LS.get("checkLogin");
      LS.remove("checkLogin");
      if (check) {
        //console.log(JSON.stringify(postData))
        this.post("/configure", postData)
        .then(response => {
          if (response.status > 0) {
            if (!response.response.group) {
              this.message = "Sorry, your roles are yet to be defined. Contact admin.";
              this.error = true;
              this.isLoading=false;
              return;
            }
            //alert(`${response.response.roles} ${response.response.group.structure}`)
            if ( !response.response.roles && response.response.group.structure == "facility") {
              this.message = "Sorry, your roles are yet to be defined. Contact admin.";
              this.error = true;
              return;
            }
            this.setPaymentMethods(response.response.method);
            this.setSettings(response.response.settings);
            this.setPlatform(response.response.platform);
            this.setDepartment(response.response.department);
            this.setUser(response.response.user);
            this.user=response.response.user;
            this.setTransactions(response.response.transaction);
            this.setSchemes(response.response.schemes);
            this.setRoles(response.response.roles);
            this.setGroup(response.response.group);
            this.setChats(response.response.chats);
            if (response.response.logo != "") {
              LS.set("logo", response.response.logo);
            }
            LS.set("menus", response.response.roles.menus);
            LS.set("user", response.response.user);
            LS.set("group", response.response.group);
            LS.set("settings", response.response.settings);
            LS.set("platform", response.response.platform);
            LS.set("department", response.response.department);
            LS.set("location", response.response.location);
            LS.set("chat_setting", response.response.chat_settng);

            LS.set("justLogin", true);
            let cart = LS.get("carts");
            if (cart) {
              LS.remove("carts");
            }
            if(this.user.outlet_id<1){
              this.loadOutlets(this.user.id)
            }else{
              this.message = response.message;
            
              this.updatePin(response.response.user);
            }
          } else {
            this.message = response.message;
            this.error = true;
          }
        })
        .finally(()=>{
          this.isLoading=false;
          this.$Progress.finish();
        })
      } else {
        this.message = "User must login first before configuration";
        this.error = true;
        this.isLoading=false;
        this.$Progress.finish();
      }
    },

    updatePin: function(user) {
      this.post("setLastLogin", {id: user.id})
      .then(resp=>{
        if(resp.status>0){
          var auth = SHA256("000000");

          if (!user.user_pin || user.user_pin == auth) {
            this.$router.push("/user-pin");
          } else {
            let menus=LS.get('menus');
            let homeFixed=false;
            let searchFixed=false;
            if(menus){
              menus.forEach(element => {
                //alert(element.title)
                if (element.hasOwnProperty("searchPath") && !searchFixed) {
                  LS.set("searchPath", element.searchPath);
                  searchFixed=true;
                }
                if (element.hasOwnProperty("title") && element.title=='Overview' && !homeFixed) {
                  LS.set("home", element.home);
                  this.$route.meta.page=element.home;
                  homeFixed=true;
                  this.$router.push(element.url);
                } 
                
              });
            }else{
              this.$router.push('/app');
            }
            //this.directuser();
          } 
        }else{
          this.message ="Unable to register login details. Pls try again later.";
          this.error = true;
          this.isLoading=false;
        }
      })
    },
    directuser: function() {
      let platform = LS.get("platform");
      //alert(platform.type)
      switch (platform.type) {
        case 1:
          this.$router.push({ name: "rhome" });
          break;
        case 2:
          this.$router.push({ name: "dhome" });
          break;
        case 3:
          this.$router.push({ name: "lab-home" });
          break;
        case 5:
          this.$router.push({ name: "pharm-home" });
          break;
        case 6:
          this.$router.push({ name: "account-home" });
          break;
        case 7:
          this.$router.push({ name: "nurse" });
          break;
        case 8:
          this.$router.push({ name: "almona" });
          break;
        default:
          this.$router.push({ name: "app" });
          break;
      }
    },
    loadOutlets: function(user){
      this.get('/outlets/'+user)
      .then(resp=>{
        if(resp.status>0 && resp.response){
          this.outlets=resp.response;
          this.selectoutlet=true;
        }else{
          this.message = "Sorry. No facility has been registered yet.";
          this.error = true;
        }
      })
      .finally(()=>{
        this.isLoading=false;
      })
    },
    pickOutlet: function(outlet){
      this.setOutlet(outlet);
      this.updatePin(this.user);
    }
  },
  beforeMount() {
    this.checkStorage();
    this.setDomain();
  },
  mounted() {
    this.setupPlatform();
  }
};
</script>
<style scoped></style>
