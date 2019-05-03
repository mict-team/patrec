<template>
  <v-app id="inspire">
    <v-layout>
      <v-layout row wrap v-if="!viewReceipt">
        <v-flex xs12 id="print">
          <v-flex xs12>
            <div class="page-header">
              <v-layout row wrap>
                <v-flex xs9 row wrap>
                  <v-flex xs3>Price List</v-flex>
                  <v-flex>
                      <v-flex xs12 align-center justify-space-between>
                        <v-text-field
                            append-icon="search"
                            class="mx-3"
                            flat
                            label="Search"
                            prepend-inner-icon="search"
                            solo-inverted
                            @input="searchProduct"
                            v-model="productSearchInput"
                            ></v-text-field>
                        </v-flex>
                  </v-flex>
                </v-flex>
                <v-flex xs3 justify-right align-right class="no-print">
                  
                  <v-btn primary
                     @click="printReceipt"><v-icon>local_printshop</v-icon>Print price list</v-btn
                  >
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
          <v-divider></v-divider>

          <v-flex xs12>
            <v-data-table
              :headers="headers"
              :items="list"
              item-key="name"
              class="elevation-1"
            >
              <template v-slot:items="props">
                <tr>
                  <td>{{ props.index + 1 }}</td>
                  <td>{{ props.item.code }}</td>
                  <td>{{ props.item.tag | toTitleCase }}</td>
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.amount | toDecimal }}</td>
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
        { text: "Tag", align: "left", sortable: true, value: "tag" },
        { text: "Name", align: "left", sortable: true, value: "name" },
        { text: "Price", value: "desc", sortable: false, align: "left" },
      ],
      filterForm: false,
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
    ...mapState(["outlet", "products"]),
    
  },
  components: {
    Receipt
  },
  props: {
    source: String
  },
  methods: {
    ...mapActions(["checkStorage", "saveStorage"]),
    getList: function(){
        for (var key in this.products){
            //alert(key)
            if(this.products[key]){
                this.list.push(this.products[key]);
            }
        }
        this.list=[].concat.apply([], this.list);
        //console.log(this.list)
    },
    searchProduct() {
      var list=[];
      for (var key in this.products){
        if(this.products[key]){
          list.push(this.products[key]);
        }
      }
      
      list=[].concat.apply([], list);
      this.list=list.filter(item => {
        return item.name.toLowerCase().includes(this.productSearchInput.toLowerCase())
      })
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
    
  },
  mounted() {
    this.checkStorage();
    this.getList();
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
