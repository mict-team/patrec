<template>
  <v-container>
    <v-card>
      <v-toolbar row wrap>
        <v-btn color="red" @click="$router.go(-1)" white-text
          ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
        >
        <v-toolbar-title>Price book</v-toolbar-title>
        <v-spacer />
        <v-text-field
            append-icon="search"
            class="mt-8"
            flat
            label="Search"
            prepend-inner-icon="search"
            solo-inverted
            @input="searchProduct"
            v-model="productSearchInput"
            ></v-text-field>
        <v-spacer />
        <v-btn class="danger" @click="printReceipt"
          ><v-icon>mdi-printer</v-icon>Print</v-btn
        >
      </v-toolbar>

      <v-container grid-list-sm class="pa-4">
        <v-layout>
          <table class="table table-hover table-border">
            <thead>
              <tr>
              <th>SN</th>
              <th>Dept</th>
              <th>SKU</th>
              <th>Tag</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(li, index) in list" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ li.dept }}</td>
                <td>{{ li.sku }}</td>
                <td>{{ li.tag | toTitleCase }}</td>
                <td>{{ li.name }}</td>
                <td>{{ li.qty_available }}</td>
                <td>{{ li.amount | toDecimal }}</td>
                <td>{{ fixTarrifDuration(li.duration) }}</td>
              </tr>
            </tbody>
          </table>
        </v-layout>
        <base-pagination :total="products.total" :initialPage="page" :pageSize="50" :callback="changePage" />
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { URL, LS } from "../../../shared/config.js";
import { mapState, mapActions } from "vuex";
import JQuery from "jquery";
export default {
  data() {
    return {
      page: 1,
      filterForm: false,
      products:[],
      list: [],
      date: new Date().toISOString().substr(0, 10),
      parameters: { from: "", to: "", code: "" },
      modalFrom: false,
      modalTo: false,
      loadingDialog: false,
      viewReceipt:false,
      productSearchInput:''
    };
  },
  computed: {
    ...mapState(["outlet", "settings"]),
    getProducts(){
      return this.products.result;
    }
  },
  props: {
    source: String
  },
  methods: {
    ...mapActions(["checkStorage", "saveStorage"]),
    innitialize: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        page: this.page,
        search: this.productSearchInput,
        perPage: 50,
        action: 'loads'
      }
      this.post(`/charges`, payload)
        .then(resp => {
          //console.log(resp.response)
          if (resp.status > 0) {
            this.products = resp.response;
            this.getList();
          } else {
            this.$toastr.error(resp.message);
          }
        })
        .finally(() => {
          //this.list=[];
          this.$Progress.finish();
        });
    },
    getList: function(){
      this.list=[];
      for (var key in this.getProducts){
          //alert(key)
          if(this.getProducts[key]){
              this.list.push(this.getProducts[key]);
          }
      }
      this.list=[].concat.apply([], this.list);
      //console.log(this.list)
    },
    searchProduct() {
      var list=[];
      for (var key in this.getProducts){
        if(this.getProducts[key]){
          list.push(this.products[key]);
        }
      }
      
      list=[].concat.apply([], list);
      this.list=list.filter(item => {
        return item.name.toLowerCase().includes(this.productSearchInput.toLowerCase())
      })
    },
    printReceipt: function() {
      
    },
    fixTarrifDuration: function(duration){
      if(duration==0){
        return 'One time payment';
      }
      if(duration==1){
        return 'Daily payment';
      }
      if(duration==2){
        return 'Weekly payment';
      }
      if(duration==3){
        return 'Monthly payment';
      }
      if(duration==4){
        return 'Yearly payment';
      }
    },
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.productSearchInput=pageItems.search;
      this.innitialize();
    },
  },
  mounted() {
    this.checkStorage();
    setTimeout(this.innitialize, 200);
    //this.list=this.products;
    //console.log(this.list)
  }
};
</script>

<style>
.page-header {
  width: 100%;
  height: 70px;
  padding: 10px 20px 10px 20px;
  font-size: 2em;
}
</style>
