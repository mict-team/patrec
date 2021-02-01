<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)" white-text
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>{{ storeName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class=" primary" @click="storeDialog = true" :disabled="stores.length < 1">Switch point</v-btn>
      <v-btn class=" primary">Requisition</v-btn>
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout row>
          <v-flex xs12>
            <h3>List of drugs</h3>
          </v-flex>
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
                  <th>Action</th>
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
                      <th>
                        <v-btn icon small @click="editItem(drug)">
                          <v-icon color="blue">edit</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          small
                          v-if="location.status == 1"
                          @click="disableItem(location, 0)"
                        >
                          <v-icon color="green">highlight_off</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          small
                          v-if="location.status == 0"
                          @click="disableItem(location, 1)"
                        >
                          <v-icon color="red">offline_pin</v-icon>
                        </v-btn>
                      </th>
                    </tr>
                  </template>
                </tbody>

                <tr v-else>
                  <td colspan="9">
                    <v-flex xs12 style="text-align:center;">
                      <img src="../../assets/addnewitem.svg" />
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
    <v-dialog v-model="storeDialog" left top width="700px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Switch store
          <v-spacer></v-spacer>
          <v-btn @click="storeDialog = false">Close</v-btn>
          <v-btn class="primary" @click="switchStore">Switch</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row>
            <v-flex xs12>
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>SN</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody v-if="stores && stores.length > 0">
                  <tr
                    class="rowClick"
                    v-for="(store, index) in stores"
                    :key="index"
                    @click="selectStore($event, index)"
                    :id="'row_' + index"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ store.name }}</td>
                    <td>{{ store.contact_no }}</td>
                    <td>{{ store.contact_address }}</td>
                    <td>
                      <small>Click to select</small>
                    </td>
                  </tr>
                </tbody>
                <tr v-else>
                  <td colspan="5">
                    <v-flex xs12 style="text-align:center; heigth:70%">
                      <img src="../../assets/addnewitem.svg" />
                    </v-flex>
                  </td>
                </tr>
              </table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
   
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
import { URL, LS, SHA256 } from "../../shared/config.js";
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
    newDepartment: {
      name: "",
      type: "Selling point",
      hasClinic: "",
      hasPayment: "",
      platform: "Sales"
    }
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
    loadLocation: function(){
      this.$Progress.start();
      this.loading=true;
      let payload={
        outlet: this.outlet.id
      }
      this.post("locations", payload)
      .then(resp=>{
        this.stores=resp.response;
      })
      .finally(()=>{
        this.getLocation();
        this.$Progress.finish();
        this.loading=false;
      })
    },
    getLocation(){
      let index=this.stores.findIndex(x=>x.id==this.activeStore);
      if(index>-1){
        this.storeName=this.stores[index].name;
      }
    },
    
    loadDrugs: function() {
      this.$Progress.start();
      this.loading = true;
      var postData = {
        search: this.search,
        location: this.location,
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
    selectStore: function(e, index) {
      NodeList.prototype.forEach = Array.prototype.forEach;
      this.activeStore = this.stores[index].id;
      //this.storeName = this.stores[index].name;
      var tr = e.target.parentNode;
      var tbody = tr.parentNode;
      var trs = tbody.childNodes;
      trs.forEach(function(item) {
        item.style.backgroundColor = "transparent";
      });
      e.target.parentNode.style.backgroundColor = "green";
    },
    switchStore: function() {
      this.location=this.activeStore;
      this.loadDrugs();
      this.getLocation();
      this.storeDialog=false;
    },
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search=pageItems.search;
      this.loadDrugs();
    },
    transfer: function() {
      this.$router.push("/pharmacy/stock-transfer");
    },
    authUser: function(auth) {
      if (auth) {
      }
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
    addPoint: function() {
      this.newDepartment.outlet = this.outlet.id;
      this.newDepartment.user = this.user.id;
      this.newDepartment.platform = 9;
      this.newDepartment.type = 2;
      this.post("/department", this.newDepartment).then(response => {
        if (response.status > 0) {
          this.loadDrugs();
          this.$toastr.success("Selling point registered successfully");
          this.newDepartment = {
            name: "",
            type: "Selling point",
            hasClinic: "",
            hasPayment: "",
            platform: "Sales"
          };
        } else {
          this.$toastr.warning(response.message);
        }
      });
    }
  },
  created() {
    this.checkStorage();
  },
  mounted() {
    this.group=LS.get('group')
    this.location=this.$route.params.id;
    this.activeStore=this.location;
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
