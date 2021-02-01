<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)" white-text
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>{{ storeName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class=" primary" @click="$router.push('/pharmacist/requisition')">Requisition</v-btn>
      <v-btn class=" danger" @click="printPage">Print</v-btn>
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4" id="printMe">
        <v-layout row>
          <v-flex xs12>
            <table class="table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Opening</th>
                  <th>Available</th>
                  <th>Selling</th>
                  <th>Qty Sold</th>
                </tr>
              </thead>
              <template v-if="loading">
                <div class="loader">
                  <div class="loader-outter"></div>
                  <div class="loader-inner"></div>
                  <div class="caption">Loading...</div>
                </div>
              </template>
              <template v-else>
                <tbody v-if="checkItems && checkItems.length > 0">
                  <template v-for="(location, index) in checkItems">
                    <tr :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ location.sku }}</td>
                      <td>{{ location.name }}</td>
                      <td>{{ location.category }}</td>
                      <td>{{ location.brand }}</td>
                      <td>{{ location.opening_stock }}</td>
                      <td>{{ location.qty }}</td>
                      <td>{{ location.amount }}</td>
                      <td>{{ location.qty_sold }}</td>
                    </tr>
                  </template>
                </tbody>

                <tr v-else>
                  <td colspan="9">
                    <v-flex xs12 style="text-align:center;">
                      <img src="../../../assets/addnewitem.svg" />
                    </v-flex>
                  </td>
                </tr>
              </template>
            </table>
          </v-flex>
          <base-pagination :total="drugs.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
        </v-layout>
      </v-container>
    </v-card>
    
    <v-dialog v-model="authDialog" persistent left top width="400px">
      <v-card>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap align-center>
            <base-authorization @authUser="authUser" @closeAuth="closeAuth" />
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { URL, LS, SHA256, PrintPage } from "../../../shared/config.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "Mainstore",
  data: () => ({
    loading: false,
    authDialog: false,
    location: 0,
    changeColor: "",
    storeName: "Selling point",
    loadingDialog: false,
    storeDialog: false,
    addPointDialog: false,
    productSearchInput: "",
    activeStore: 0,
    pageSize: 50,
    page:1,
    group:[],
    stores: [],
    drugs:[],
    search: {
      category: "",
      brand: "",
      supplier: ""
    },
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet"]),
    checkItems() {
      return this.drugs.result;
    }
  },
  methods: {
    ...mapActions(["checkStorage"]),
    
    loadDrugs: function() {
      this.$Progress.start();
      this.loading = true;
      var postData = {
        search: this.search,
        location: this.location.id,
        page:this.page,
        perPage: this.pageSize,
        outlet: this.outlet.id,
        group: this.group.structure,
        action:'loads'
      };
      this.post("/locations", postData)
      .then(resp=>{
        if(resp.status>0){
          this.drugs = resp.response
        }else{
          this.drugs=[]
        }
      })
      .finally(()=>{
        this.loading=false
        this.$Progress.finish();
      })
    },
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search=pageItems.search;
      this.loadDrugs();
    },
    authUser: function(auth) {
      if (auth) {}
    },
    closeAuth: function(cancel) {
      this.authDialog = cancel;
    },
    editItem: function(item) {
      this.updateDrug = item;
      this.updateDrug.action = "edit";
      this.authDialog = true;
    },
    disableItem: function(item, status) {
      this.updateDrug = item;
      this.updateDrug.action = "disable";
      this.authDialog = true;
    },
    printPage: function() {
        //window.print();
        PrintPage('printMe');
        
    },
  },
  created() {
    this.checkStorage();
  },
  mounted() {
    this.group=LS.get('group')
    this.location=LS.get('location');
    //setTimeout(this.loadDrugs, 200);
    setTimeout(this.loadLocation, 200);
    setTimeout(this.loadDrugs, 200);
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
.change {
  background-color: green;
  color: #fff;
}
</style>
