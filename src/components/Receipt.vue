<template>
  <div>
    <v-layout align-center justify-center id="print">
        <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary" class="no-print">
                <v-toolbar-title>Receipt</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="printReceipt" class="btn">
                  <v-icon>local_printshop</v-icon> Print now
                </v-btn>
                <v-btn @click="closePrinter" class="btn">
                  <v-icon>close</v-icon> Close
                </v-btn>
              </v-toolbar>
              <v-card-text class="shadow">
                <div class="portlet light" style="padding:0px;">
                  <div class="portlet-body ">
                    <div class="receipt ">
                      <v-flex xs12 row wrap style="padding-left:10px;">
                        <v-flex xs3 align-right style="text-align:center" >
                          <v-btn icon large>
                            <v-avatar size="82px" tile>
                              <img :src="logo" alt="Rev logo" class="logo" />
                            </v-avatar>
                          </v-btn>
                        </v-flex>
                        <v-flex xs9 align-left class="header" style="text-align:left;">
                          <v-flex xs12 class="title">{{outlet.outlet}}</v-flex>
                          <v-flex xs12 class="address" style="padding-left:20px;" v-if="outlet.location !=''">{{outlet.location}}</v-flex>
                          <v-flex xs12 class="contact" v-if="outlet.phone !=''">{{outlet.phone}}</v-flex>
                          
                          <v-flex xs12 class="subtitle" style="padding-left:35px;">Payment Receipt</v-flex>
                        </v-flex>
                      </v-flex>
                      <v-flex xs12 class="tag " style="text-align:right;">
                        <v-flex xs12 cals="number right">Date: {{ carts.date }}</v-flex>
                        <v-flex xs12 cals="number right">No: {{ carts.code }}</v-flex>
                      </v-flex>
                      
                      <v-spacer></v-spacer>
                      <v-flex xs12>
                        <v-layout xs12 row wrap style="padding-left:18px; padding-right:-20px">
                          <v-flex xs12>Name: {{ carts.customer.name }}</v-flex>
                          <v-flex xs6>Card No: {{ carts.customer.file }}</v-flex>
                          <v-flex xs3>DOB: {{ carts.customer.dob }}</v-flex>
                          <v-flex xs3>Sex: {{ carts.customer.gender }}</v-flex>
                        </v-layout>  
                      </v-flex>
                      
                      <v-divider></v-divider>
                      <v-flex xs12>
                        <div
                          class="list-group-item"
                          v-for="(cart, index) in carts.items"
                          :key="index"  style="padding-top:0px;padding-right: 0px; padding-bottom: 0px; ">
                          <v-flex xs12 row >
                            <v-flex xs1>{{ index + 1 }}</v-flex>
                            <v-flex xs1>{{ cart.qty_sold }}</v-flex>
                            <v-flex xs8>{{ cart.name }}({{ cart.revType | toTitleCase }})</v-flex>
                            <v-flex xs2>&#8358;{{ cart.total | toDecimal }}</v-flex>
                          </v-flex>
                        </div>
                      </v-flex>
                      
                      <div class="panel-footer">
                        <table class="table table-hover" cellpadding="5px" cellspacing="5px" >
                          <tbody>
                            <tr>
                              <td style="width:90%;"><span>Sub-Total</span></td>
                              <td style="text-align:right">
                                &#8358;{{ carts.subtotal | toDecimal }}
                              </td>
                            </tr>
                            <tr>
                              <td style="width:90%;">
                                <a class="js-tooltip button">Discount</a>
                              </td>
                              <td style="text-align:right">
                                &#8358;{{ carts.discount | toDecimal }}
                              </td>
                            </tr>
                            <tr>
                              <td style="width:90%;"><span>VAT</span></td>
                              <td style="text-align:right">
                                &#8358;{{ carts.vat | toDecimal }}
                              </td>
                            </tr>
                            <tr>
                              <th style="width:90%;">
                                <strong><span>Total Payable</span></strong>
                                
                              </th>
                              <th style="text-align:right">
                              
                                <strong
                                  >&#8358;{{ carts.total | toDecimal }}</strong
                                >
                              </th>
                            </tr>
                            <tr>
                              <td colspan="2">{{ carts.remark }}</td>
                            </tr>
                          </tbody>
                        </table>
                        <v-flex xs12 class="stamp">
                        <v-btn icon large>
                          <v-avatar size="100px" tile style="opacity:0.7">
                            <img :src="stamp" alt="paid stamp" class="rstamp" />
                          </v-avatar>
                        </v-btn>
                      </v-flex>
                      </div>
                    </div>
                  </div>
                  <v-flex xs12 justify-left style="text-align:left" v-if="carts.user">Printed by: {{carts.user.name}}</v-flex>
                  <v-flex
                    xs12
                    align-center
                    justify-center
                    style="text-align:center"
                  >&copy; MiCT Explorers
                  </v-flex>
                </div>
              </v-card-text>
            </v-card>
          </v-flex>
        
    </v-layout>
  </div>
</template>

<script>
  import { URL, LS, APP } from "../shared/config.js";
  import axios from "axios";
  const { remote } = window.require("electron");
  //import JQuery from "jquery";
  const image2base64 = require("image-to-base64");
  import { mapState, mapActions } from "vuex";
  const ipcRenderer = window.require("electron").ipcRenderer;
  import PHE from "print-html-element";
  const fs=window.require('fs')
  const path=require('path')
  //import Printd from 'printd';
  export default {
    name: "PrintReceipt",
    data() {
      return {
        carts: {
          id: 0,
          code: "",
          subtotal: 0.0,
          overallDiscount: 0.0,
          discount: 0.0,
          vat: 0.0,
          total: 0.0,
          remark: "",
          paid: false,
          date: "",
          customer: {
            id: 0,
            name: "",
            sex: "",
            dob: "",
            mstatus: "",
            email: "",
            phone: "",
            type: 0,
            address: ""
          },
          items: [],
          payment: []
        },
        output: null,
        logo: "",
        _default:"",
        stamp: ""
      };
    },
    
    computed: {
      ...mapState([
        "outlet",
        "cart",
        "paymentMethods",
        "users"
      ]),
    },
    methods: {
      ...mapActions([
        "unSyncCart",
        "updateStorage"
      ]),
      loadDefault: function() {
        this.carts = LS.get("cart");
        //console.log(this.carts);
      },
      closePrint: function() {
        this.clearCarts();
        this.$router.push({ name: "home" });
      },
      clearCarts: function() {
        LS.remove("cart");
        this.resetCart();
      },
      resetCart: function() {
        this.carts = {
          id: 0,
          code: "",
          subtotal: 0.0,
          overallDiscount: 0.0,
          discount: 0.0,
          vat: 0.0,
          total: 0.0,
          remark: "",
          paid: false,
          customer: {
            id: 0,
            name: "",
            sex: "",
            dob: "",
            mstatus: "",
            email: "",
            phone: "",
            type: 0,
            address: ""
          },
          items: [],
          payment: []
        };
      },

      printReceipt: function() {
        //window.print();
        let stylesHtml = "";
        for (const node of [
          ...document.querySelectorAll('link[rel="stylesheet"],link[rel="preload"], style')
        ]) {
          stylesHtml += node.outerHTML;
        }

        const prtHtml = document.getElementById('print').innerHTML;//this.jQuery("#print").html();
        var content = `<!DOCTYPE html>
                  <html>
                  <head>
                      ${stylesHtml}
                  </head>
                  <body>
                      ${prtHtml}
                  </body>
                  </html>`;
        
        //ipcRenderer.send("readyToPrint");
        ipcRenderer.send("print-to-pdf");
      },
      
      closePrinter: function() {
        //this.clearCarts();
        this.$emit("closePrinter", false);
      }
    },
    mounted() {
      this.loadDefault();
      image2base64(require("../assets/unimedth.png")) // you can also to use url
        .then(response => {
          this.logo = "data:image/jpeg;base64," + response;
        })
        .catch(error => {
          console.log(error); //Exepection error....
        });
      
      image2base64(require("../assets/stamp.png")) // you can also to use url
        .then(response => {
          this.stamp = "data:image/jpeg;base64," + response;
        })
        .catch(error => {
          console.log(error); //Exepection error....
        });
    }
  };
</script>
<style>
@media print {

  @page {
    size: 2.84in 11.7in portrait !important;
  }

}
.header {
  /*text-align: center !important;*/
  width: 100% !important;
}
.header .title {
  font-size: 16px !important;
  font-weight: bold;
}
.header .address {
  font-size: 12px;
}
.header .contact {
  font-size: 12px;
}
.header .subtitle {
  padding-top:12px !important;
  font-size: 16px;
  font-weight: bold;
}
.receipt .tag {
  text-align: right !important;
  font-style: italic;
}
.header .tag .date {
  text-align: right !important;
  padding-left: 10px;
}
.header .tag .number {
  text-align: right !important;
}
.receipt .stamp {
  position: relative;
  float:right;
  right: 10% !important;
  top: -165px !important;
}
.collapse {
  transition: all 0.1s ease-out;
}
.list-group-item {
  padding-top: 10px;
  padding-bottom: 10px;
}

/* Portlet */
.portlet {
  background: #fff;
  padding: 20px;
  width: 100%;
}

.portlet.portlet-gray {
  background: #f7f7f7;
}

.portlet.portlet-bordered {
  border: 1px solid #eee;
}

/* Portlet Title */
.portlet-title {
  padding: 0;
  min-height: 40px;
  border-bottom: 1px solid #eee;
  margin-bottom: 18px;
}

.receipt {
  width: 100%;
}

.cart-panel {
  height: 270px !important;
}
.scroller {
  overflow-y: scroll;
}

</style>
