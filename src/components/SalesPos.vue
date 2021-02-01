<template>
  <v-app class="main-container pl-4 pr-4 pb-1">
    <v-row>
      <v-col cols="12" md="7">
        <v-row class="m-0" style="margin-top:-15px !important;">
          <v-col cols="12" md="6"
            ><span class="title"><b>{{outlet.name}}</b></span></v-col
          >
          <v-col cols="12" md="6">

            <v-flex xs12 row>
              <input
                type="text"
                class="form-control col-md-10"
                v-model="searchStr"
                placeholder="Search with patient code"
                @keyup="putSearch"
              />
              <v-btn icon medium class="grey lighten-4" @click="putSearch"
                ><v-icon>search</v-icon></v-btn
              >
            </v-flex>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn small title="Go back" class="danger" @click="$router.push('/home')"><v-icon>backspace</v-icon></v-btn>

        <v-btn small title="Register details" class="primary" @click="$router.push(getRegisterDetailUrl)">
          <strong><v-icon>bookmark</v-icon></strong>
        </v-btn>

        <v-btn small title="Bills" class="success" @click="$router.push(isRequestFromAlmona)">
          <strong><v-icon>how_to_vote</v-icon></strong>
        </v-btn>

        <v-btn small title="Close register" class="danger" @click="overlay!=overlay">
          <strong><v-icon>ballot</v-icon></strong>
        </v-btn>

        <v-btn small title="Packed sales" class="info" @click="packdialog=true">
          <strong><v-icon>dynamic_feed</v-icon></strong>
        </v-btn>
      </v-col>
      <v-col cols="12" md="1" right--text>{{ currentDate }}</v-col>
    </v-row>
    <v-row class="">
      <router-view class="main-centent" />
    </v-row>
    <v-overlay
      :absolute="true"
      :opacity="1"
      :value="overlay"
    >
      <v-btn
        color="orange lighten-2"
        @click="overlay = false"
      >
        Hide Overlay
      </v-btn>
    </v-overlay>
    <v-row>
      <v-col cols="12" md="12" class="footer-note"
        >VidePOS - V2.13 | Copyright © 2020 All rights reserved.</v-col
      >
    </v-row>
    <v-dialog v-model="packdialog" hide-overlay persistent  width="500px">
      <v-card align-center>
        <v-card-title class="grey lighten-4 py-4 title">
          Packed items
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="packdialog = false">Close</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row style="text-align:center">
            <v-flex xs12>
              <v-text-field
                append-icon="search"
                class="mx-3"
                label="Search"
                prepend-inner-icon="search"
                solo-inverted
                @input="searchPatient"
                v-model="packSearchInput"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12>
                <table class="table table-stripped">
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>NAME</th>
                      <th>TOTAL</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(items, index) in packeditems" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ items.customer.name }}</td>
                      <td>{{ items.total }}</td>
                      <td>
                        <button class="btn blue" @click="addPackToCart(items)">Pay now</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { URL, LS, APP, SHA256 } from "../shared/config.js";
export default {
  data: () => {
    return {
      overlay: false,
      parameter: "",
      currentDate: "",
      locations: [],
      items: [],
      default_location: "Main account",
      searchStr: "",
      searchdialog: false,
      stillSearching: false,
      packdialog: false,
      filterPtients: [],
      message: "",
      labs: [],
      packeditems:[],
      packSearchInput:"",
    };
  },
  computed: {
    ...mapState([
      "outlet",
      "domain",
      "search",
      "patients",
      "newpatients",
      "platforms",
      "departments",
      "users",
      "register",
      "drawer",
      "settings"
    ]),
    getDefaultSellingLocation() {
      return this.default_location;
    },
    isRequestFromAlmona(){
      return (this.$route.path.toLowerCase().includes('almona', 0) || this.$route.path.toLowerCase().includes('account', 0))?"/almona/billings":"/pharmacy/billings"
    },
    backRequestFromAlmona(){
      return (this.$route.path.toLowerCase().includes('almona', 0) || this.$route.path.toLowerCase().includes('account', 0))?"sales-home":"pharm-home"
    },
    loadRegisterFromAlmona(){
      return (this.$route.path.toLowerCase().includes('almona', 0) || this.$route.path.toLowerCase().includes('account', 0))?"/summary-report":"/pharm-summary-report"
    },
    closeRegisterFromAlmona(){
      return (this.$route.path.toLowerCase().includes('almona', 0) || this.$route.path.toLowerCase().includes('account', 0))?"/close-register":"/pharm-close-register"
    },
    getRegisterDetailUrl(){
      return (this.$route.path.toLowerCase().includes('almona', 0) || this.$route.path.toLowerCase().includes('account', 0))?"/almona/register-details":"/pharmacy/register-details";
    }
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "addPatients", "checkStorage"]),
    pushCategory: function() {},
    autoSync: function() {
      var vm = this;
      var interval = setInterval(function() {
        vm.syncData();
      }, 100000);
    },
    syncData: function() {},
    putSearch: function(e) {
      console.log(e.keyCode)
      if (e.keyCode === 13 && this.searchStr != "") {
        this.setSearch(this.searchStr);
        this.$router.push("/search");
      }
      //this.setSearch(this.searchStr)
    },
    calculator: function(){

    },
    searchPatient: function(){

    }
  },
  mounted() {
    this.parameter = this.$route.params.type;
    //alert(this.parameter)
    this.parameter = this.parameter == "account" ? "sales-home" : "pharm-home";
    
    this.checkStorage();
    this.setDomain();
    this.autoSync();
    var today = new Date();
    this.currentDate =
      String(today.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(today.getDate()).padStart(2, "0") +
      "/" +
      String(today.getFullYear()).padStart(2, "0");
  }
};
</script>

<style scoped>
.main-container {
  background-color: #bcc8d1 !important;
}
.main-container .title {
  font-size: 25px;
}
.main-container .footer-note {
  font-size: 10px;
  height: 20px;
  text-align: center;
}
.main-container .main-centent {
  height: 100%;
  width: 100% !important;
  margin-top: -15px !important;
  margin-left: 3px;
  margin-right: -2px;
}
</style>
