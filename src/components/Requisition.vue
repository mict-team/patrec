<template>
  <v-app id="inspire">
    <v-layout>
      <v-layout row wrap v-if="!viewReceipt">
        <v-flex xs12 id="print">
          <v-flex xs12 style="background-color: #F0F8FF">
            <div class="page-header">
              <v-layout row wrap>
                <v-flex xs8 row wrap>
                  <v-flex xs9>
                    Requisition
                  </v-flex>
                </v-flex>
                <v-flex xs4 justify-right align-right class="no-print">
                  <v-btn primary @click="showFilterForm"
                    ><v-icon>bar_chart</v-icon>Filter report</v-btn
                  >
                  <v-btn primary
                     @click="printReceipt"><v-icon>local_printshop</v-icon>Print report</v-btn
                  >
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
          <v-divider></v-divider>
          <v-flex xs12 v-if="filterForm">
            <div class="page-header">
              <v-layout row wrap>
                <v-flex xs2 align-center justify-space-between>
                  <v-menu
                    v-model="modalFrom"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                    >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="parameters.from"
                        label="From"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="parameters.from" @input="modalFrom = false" :landscape="true" :relative="true"></v-date-picker>
                  </v-menu>
                  
                </v-flex>

                <v-flex xs2 align-center justify-space-between>
                  <v-menu
                    v-model="modalTo"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                    >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="parameters.to"
                        label="To"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="parameters.to" @input="modalTo = false" :landscape="true" :relative="true"></v-date-picker>
                  </v-menu>
                  
                </v-flex>
                <v-flex xs4 align-center justify-space-between>
                  <v-layout align-center>
                    <v-text-field
                      prepend-icon="code"
                      placeholder="Payment code or Card no"
                      v-model="parameters.code"
                    ></v-text-field>
                  </v-layout>
                </v-flex>
                <v-flex xs2 align-center justify-space-between v-if="me.acct_type==1">
                  <v-layout align-center>
                    <v-select
                      v-model="parameters.collector"
                      :items="users"
                      item-text="name"
                      item-value="id"
                      prepend-icon="person"
                      label="Collector"
                    ></v-select>
                  </v-layout>
                </v-flex>
                <v-flex xs2 align-center justify-space-between>
                  <v-layout align-center>
                    <v-btn @click="loadReport" class="btn">
                      <v-icon>search</v-icon> Search
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </div>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12>
            <v-data-table
              :headers="headers"
              :items="list"
              item-key="name"
              class="elevation-1"
              v-if="list">
              <template v-slot:items="props">
                <tr>
                  <td>{{ props.index + 1 }}</td>
                  <td>{{ props.item.code }}</td>
                  <td>{{props.item.customer.name}}</td>
                  <td>{{ props.item.customer.file }}</td>
                  <td>{{description(props.item.items)}}</td>
                  <td>{{ props.item.subtotal | toDecimal}}</td>
                  <td>{{ props.item.discount | toDecimal }}</td>
                  <td>{{ props.item.vat | toDecimal }}</td>
                  <td>{{ props.item.total | toDecimal }}</td>
                  <td>{{ props.item.date }}</td>
                  <td class="text-xs-left no-print">
                    <v-btn primary @click="reprint(props.item)"
                      ><v-icon>local_printshop</v-icon>Print receipt</v-btn
                    >
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-else>
        <receipt style="width:100%;" v-on:closePrinter="closeReceipt"></receipt>
      </v-layout>
    </v-layout>
    <v-dialog v-model="loadingDialog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Processing... pls wait.
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { URL, LS } from "../shared/config.js";
import axios from "axios";
import Receipt from "./Receipt";
import { mapState, mapActions } from "vuex";
const { remote } = window.require("electron");
const { BrowserWindow } = remote;
import JQuery from "jquery";
const image2base64 = require("image-to-base64");
const ipcRenderer = window.require("electron").ipcRenderer;
export default {
  data() {
    return {
      headers: [
        { text: "SN", align: "left", sortable: false, value: "index" },
        { text: "Code", align: "left", sortable: false, value: "code" },
        { text: "No of items", align: "left", sortable: true, value: "no_of_items" },
        { text: "Request By", value: "request_by", sortable: false, align: "left" },
        { text: "Date", value: "date", sortable: true, align: "left" },
        { text: "", value: "action", sortable: false, align: "left" }
      ],
      filterForm: false,
      list: [],
      date: new Date().toISOString().substr(0, 10),
      parameters: { from: "", to: "", code: "", collector: "", user:[] },
      modalFrom: false,
      modalTo: false,
      loadingDialog: false,
      viewReceipt:false,
      me: [],
      numOfRec: 0
    };
  },
  computed: {
    ...mapState(["outlet", "service", "drugs","domain",  "cart", "users", "todaySales"]),
    getTotalSum: function(){
      var sum=0;
      for(var i=0; i<this.list.length; i++){
        sum+=this.list[i]['total'];
      }
      return sum;
    },
    getTotalRecord: function(){
      return this.list.length;
    }
  },
  components: {
    Receipt
  },
  props: {
    source: String
  },
  methods: {
    ...mapActions(["filterSales", "checkStorage", "getDomain",  "saveStorage"]),
    description(item){
      //console.log(item)
      var desc='';
      for(var i=0; i<item.length; i++){
        desc += item[i]['name'] +"("+ item[i]['code'] +")="+ item[i]['amount'] +";";
      }
      return desc;
    },

    showFilterForm: function() {
      if (this.filterForm) {
        this.filterForm = false;
      } else {
        this.filterForm = true;
      }
    },
    filter: function() {
      //console.log(this.cart);
      
      if (parameters.from != "" && parameters.to != ""){
        this.list = this.cart.find(
          x => x.date >= parameters.from && x <= parameters.to
        );
      }
      if (parameters.from != "" && parameters.to == "") {
        this.list = this.cart.find(x => x.date === parameters.from);
      }
      if (parameters.from == "" && parameters.to != "") {
        this.list = this.cart.find(x => x.date === parameters.to);
      }
      if (parameters.from == "" && parameters.to == "") {
        this.list = this.cart;
      }
      if(parameters.code !=''){
        this.list=this.cart.find(x => x.code === parameters.code || c.customer.file===parameters.code);
      }
      
      this.loadReport();
    },
    printReceipt: function() {
      //window.print();
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style')
      ]) {
        stylesHtml += node.outerHTML;
      }

      const prtHtml = this.jQuery("#print").html();
      var content = `<!DOCTYPE html>
                <html>
                <head>
                    ${stylesHtml}
                </head>
                <body>
                    ${prtHtml}
                </body>
                </html>`;
      ipcRenderer.send("readyToPrint");
    },
    reprint: function(item){
      //console.log(item)
      LS.set("cart",item);
      this.viewReceipt=true
    },
    closeReceipt: function(status) {
      LS.remove("cart");
      this.viewReceipt=false
    },
    loadToady: function(){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = yyyy + "-" + mm + "-" + dd;
      this.parameters={from:today, to:today};
      this.loadReport();
    },
    loadReport: function(){
      this.loadingDialog = true;
      this.parameters['outlet']=this.outlet;
      this.parameters['user']=LS.get("user");
      //console.log(JSON.stringify(this.parameters))
      axios.post(this.domain + "/requision", this.parameters)
      .then(response => {

          if(response.data.status>0){
            if(response.data.response.report.length>0){
              this.list=response.data.response.report;
            }else{
              this.list=[];
            }
          }
          this.loadingDialog = false;
      })
      .catch(e => {
        console.log(e)
        this.loadingDialog = false;
      });
      
    }
  },
  mounted() {
    this.checkStorage();
    //this.filterSales();
    //this.loadToady();
    this.list=this.todaySales;
    this.me=LS.get("user");
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
