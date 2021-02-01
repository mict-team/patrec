<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)" white-text
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>{{ storeName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="primary" @click="$router.push('add-drugs')"
        ><v-icon>create_new_folder</v-icon>New item</v-btn
      >
      <v-btn class="primary" @click="$router.push('upload-drug')"
        ><v-icon>cloud_upload</v-icon>Upload</v-btn
      >
      <v-btn class="primary" @click="transfer"
        ><v-icon>near_me</v-icon>Transfer</v-btn
      >
      <v-btn class="primary" @click="download"
        ><v-icon>cloud_download</v-icon>Download</v-btn
      >
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
                  <th>Available</th>
                  <th>Cost</th>
                  <th>Selling</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <template v-if="loading">
                <v-progress-circular
                  :size="30"
                  color="primary"
                  indeterminate
                ></v-progress-circular
                >Loading pls...
              </template>
              <template v-else>
                <tbody v-if="getItems && getItems.length > 0">
                  <template v-for="(drug, index) in getItems">
                    <tr :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ drug.sku }}</td>
                      <td>{{ drug.name }}</td>
                      <td>{{ drug.category }}</td>
                      <td>{{ drug.brand }}</td>
                      <td>{{ drug.available_qty }}</td>
                      <td>{{ drug.cost_price }}</td>
                      <td>{{ drug.selling_price }}</td>
                      <td>
                        <v-chip class="ma-2" color="green" outlined v-if="drug.status == 1" >Active</v-chip>
                        <v-chip class="ma-2" color="pink" outlined v-else >Disabled</v-chip>
                      </td>
                      <th class="no-print">
                        <v-chip class="ma-2" color="blue" text-color="white" @click="editItem(drug)">
                          <v-icon left>edit</v-icon>Edit
                        </v-chip>
                        <v-chip class="ma-2" color="red" text-color="white" @click="disableItem(drug, 0)" v-if="drug.status == 1">
                          <v-icon left>cancel</v-icon>Disable
                        </v-chip>
                        <v-chip class="ma-2" color="green" text-color="white" @click="disableItem(drug, 1)" v-if="drug.status == 0">
                          <v-icon left>ok</v-icon>Enable
                        </v-chip>
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
    <v-dialog v-model="uploadDrugDialog" a left top width="400px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          New drugs
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12>
              <label>Upload .csv file</label>
              <input
                class="form-control"
                type="file"
                ref="type"
                accept=".csv"
                @change="loadCSV"
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="uploadDrugDialog = false"
            >Cancel</v-btn
          >
          <v-btn @click="uploadDrug">Upload drugs</v-btn>
        </v-card-actions>
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
import { URL, LS, SHA256, DownloadCSV } from "../../shared/config.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "Mainstore",
  data: () => ({
    loading: false,
    uploadDrugDialog: false,
    authDialog: false,
    store: [],
    error: "",
    storeName: "Main store",
    page: 1,
    pageSize:50,
    group:[],
    drugs: [],
    categories: [],
    brands: [],
    stores: [],
    loadingDialog: false,
    storeDialog: false,
    paginate: [],
    productSearchInput: "",
    activeStore: 0,
    updateDrug: [],
    search: {
      category: "",
      brand: "",
      supplier: ""
    }
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet"]),
    
    getItems(){
      //console.log(this.drugs)
      return this.drugs.result;
    }
  },
  methods: {
    ...mapActions(["setDomain", "setDrugs", "addDrugs", "checkStorage"]),
    loadDrugs: function() {
      this.$Progress.start();
      this.loading = true;
      var postData = {
        search: this.search,
        page:this.page,
        perPage: this.pageSize,
        outlet: this.outlet.id,
        group: this.group.structure,
        action:'loads'
      };
      this.post("/drugs", postData)
      .then(resp=>{
        if(resp.status>0){
          this.drugs = resp.response
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
    
    loadCSV: function() {},
    uploadDrug: function() {},
    selectStore: function(index) {
      this.activeStore = index.id;
    },
    
    transfer: function() {
      this.$router.push("/pharmacy/stock-transfer");
    },
    authUser: function(auth) {
      if (auth) {
        this.$router.push(`edit-drugs/${this.updateDrug.sku}`);
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
    download: function() {
      DownloadCSV({ data: this.drugs });
    }
  },
  mounted() {
    this.checkStorage();
    this.group=LS.get('group');
    setTimeout(this.loadDrugs, 200);
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
