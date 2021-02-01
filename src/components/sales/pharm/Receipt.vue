<template>
  <div>
    <v-layout align-center justify-center id="print">
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary" class="no-print">
            <v-toolbar-title>Receipt</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="printReceipt" class="danger">
              <v-icon>local_printshop</v-icon> Print now
            </v-btn>
            <v-btn @click="closePrinter">
              <v-icon>close</v-icon> Close
            </v-btn>
          </v-toolbar>
          <v-card-text class="shadow" ref="printMe" id="printMe">
            <div class="portlet light" style="padding:0px;">
              <div class="portlet-body ">
                <div class="receipt ">
                  <table>
                    <tr>
                      <td style="width:25%; vertical_align: top;">
                        <img
                          src="../../../assets/logo.png"
                          alt="Rev logo"
                          class="logo"
                          style="width:82px; height:82px;"
                        />
                      </td>
                      <td style="text-align: left;">
                        <v-flex
                          xs12
                          class="title"
                          style="font-size:20px !important; font-weight:bold; padding-left: 10%;"
                          >{{ outlet.name }}</v-flex
                        >
                        <v-flex
                          xs12
                          class="address"
                          style="text-align: center;font-size:14px !important;"
                          v-if="outlet.location != ''"
                          >{{ outlet.address }}</v-flex
                        >
                        <v-flex
                          xs12
                          class="contact"
                          style="text-align: center;font-size:14px !important; font-weight: bold;"
                          v-if="outlet.phone != ''"
                          >{{ outlet.phone }}</v-flex
                        >
                        <v-flex
                          xs12
                          class="subtitle"
                          style="padding-left:15%;font-size:18px !important; font-weight: bold;"
                          >Payment Receipt</v-flex
                        >
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <v-flex
                          xs12
                          class="tag "
                          style="text-align:right; font-weight:bold; font-size: 15px;"
                        >
                          <v-flex
                            xs12
                            cals="number right"
                            style="font-size: 15px;"
                            >Date: {{ carts.date }}</v-flex
                          >
                          <v-flex
                            xs12
                            cals="number right"
                            style="font-size: 15px;"
                            >No: {{ carts.receipt_no }}</v-flex
                          >
                        </v-flex>
                      </td>
                    </tr>
                  </table>

                  <table>
                    <tr>
                      <th style="width:10% !important;">
                        <v-icon>person</v-icon>
                      </th>
                      <td colspan="5" style="font-size: 14px;">
                        {{ carts.customer.name }}
                      </td>
                    </tr>
                    <tr>
                      <th
                        v-if="settings.receipt && settings.receipt.allow_card_no"
                        style="width:5%;"
                      >
                        <v-icon>notes</v-icon>
                      </th>
                      <td
                        v-if="settings.receipt && settings.receipt.allow_card_no"
                        style="font-size: 18px; width:42%;"
                        colspan="2"
                      >
                        {{ carts.customer.code }}
                      </td>

                      <th
                        v-if="settings.receipt && settings.receipt.allow_phone"
                        style="width:5%;"
                      >
                        <v-icon>phone</v-icon>
                      </th>
                      <td
                        v-if="settings.receipt && settings.receipt.allow_phone"
                        colspan="2"
                        style="font-size: 18px;  width:35%;"
                      >
                        {{ carts.customer.phone }}
                      </td>
                    </tr>
                    <tr>
                      <th v-if="settings.receipt && settings.receipt.allow_dob" style="width:5%;">
                        <v-icon>event</v-icon>
                      </th>
                      <td
                        v-if="settings.receipt && settings.receipt.allow_dob"
                        style="font-size: 18px;  width:42%;"
                        colspan="2"
                      >
                        {{ carts.customer.dob }}
                      </td>

                      <th v-if="settings.receipt && settings.receipt.allow_sex" style="width:5%;">
                        <v-icon>person</v-icon>
                      </th>
                      <td
                        v-if="settings.receipt && settings.receipt.allow_sex"
                        style="font-size: 18px;  width:35%;"
                        colspan="2"
                      >
                        {{ carts.customer.sex }}
                      </td>
                    </tr>
                  </table>

                  <v-spacer></v-spacer>

                  <v-divider></v-divider>
                  <table
                    class="table table-hover"
                    cellpadding="5px"
                    cellspacing="5px"
                  >
                    <tr
                      class="list-group-item"
                      v-for="(cart, index) in carts.items"
                      :key="index"
                      style="padding-top:0px;padding-right: 0px; padding-bottom: 0px; background-color: transparent;"
                    >
                      <td style="font-size: 14px;">{{ cart.qty }}</td>
                      <td width="55%" style="font-size: 14px;">
                        {{ cart.name | toTitleCase }}
                      </td>
                      <td
                        width="40%"
                        style="font-size: 14px; text-align:right !important;"
                      >
                        &#8358;{{ cart.total | toDecimal }}
                      </td>
                    </tr>
                  </table>

                  <div class="panel-footer">
                    <table
                      class="table table-hover"
                      cellpadding="5px"
                      cellspacing="5px"
                    >
                      <tbody>
                        <tr>
                          <td style="width:90%; font-size: 14px;">
                            <a class="js-tooltip button">Sub-Total</a>
                          </td>
                          <td style="text-align:right; font-size: 14px;">
                            &#8358;{{ carts.subtotal | toDecimal }}
                          </td>
                        </tr>
                        <tr>
                          <td style="width:90%; font-size: 14px;">
                            <a class="js-tooltip button">Discount</a>
                          </td>
                          <td style="text-align:right; font-size: 14px;">
                            &#8358;{{ carts.discount | toDecimal }}
                          </td>
                        </tr>
                        <tr>
                          <td style="width:90%; font-size: 14px;">
                            <a class="js-tooltip button">Balance</a>
                          </td>
                          <td style="text-align:right; font-size: 14px;">
                            &#8358;{{ carts.balance | toDecimal }}
                          </td>
                        </tr>
                        <tr>
                          <td style="width:90%;; font-size: 14px;">
                            <a class="js-tooltip button">VAT</a>
                          </td>
                          <td style="text-align:right; font-size: 14px;">
                            &#8358;{{ carts.vat | toDecimal }}
                          </td>
                        </tr>
                        <tr>
                          <th colspan="2" style="text-align:center">
                            <span
                              style="font-size:20px; border-bottom:1px solid #ccc;"
                              >&#8358;{{ carts.total | toDecimal }}</span
                            ><br />
                            <span style="font-size:12">Total Payable</span>
                          </th>
                        </tr>
                        <tr>
                          <td colspan="2" style="font-size:14px;">
                            {{ carts.remark }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <v-flex
                      xs12
                      class="stamp"
                      style="position: relative; float:right; right: 35% !important; top: -275px !important;"
                    >
                      <v-avatar size="100px" tile style="opacity:0.7">
                        <img
                          src="../../../assets/pharm.jpg"
                          alt="paid stamp"
                          class="rstamp"
                          style="width:100px; height:100px; z-index:-99999;"
                        />
                      </v-avatar>
                    </v-flex>
                    
                  </div>
                </div>
              </div>
              <div class="col-md-12" style="font-size:14px;">
                Printed by: {{ carts.user }}
              </div>
              <v-flex xs12 style="padding-left:20%; text-align:center;">
                <v-flex xs12 style="font-size:14px !important;"
                  >Payments not refundable
                </v-flex>
                <v-flex xs12 style="font-size:15px !important;"
                  >&copy; Mict Explorers Ltd</v-flex
                >
              </v-flex>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import { URL, LS, APP } from "../../../shared/config.js";
import { mapState, mapActions } from "vuex";
const image2base64 = require("image-to-base64");
export default {
  name: "PrintReceipt",
  data() {
    return {
      outfile: "",
      carts: [],
      output: null,
      receipt:'',
      logo: "",
      _default: "",
      stamp: "",
      pharm: "",
      approve: "Default print.",
      settings: [],
      departments: [],
      platforms: []
    };
  },

  computed: {
    ...mapState(["outlet", "cart", "paymentMethods", "users"])
  },

  methods: {
    ...mapActions(["unSyncCart", "updateStorage"]),
    loadDefault: function() {
      this.settings = LS.get("settings");
      this.platforms = LS.get("platform");
      this.departments = LS.get("department");
      this.receipt=this.$route.params.id;
      this.loadReceipt()
      //this.carts = LS.get("receipt");

      //let date=this.carts.date.split(' ');

      //this.carts.date=date[0];
      //console.log(this.carts)
    },
    loadReceipt: function(){
      this.$Progress.start();
      this.get("/bills/pharm/receipt/"+ this.receipt)
      .then(resp=>{
        if(resp.status>0){
          this.carts=resp.response;
        }else{
          this.$toastr.error(resp.message)
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      })
    },
    clearCarts: function() {
      LS.remove("receipt");
    },

    printReceipt: function() {
      //this.$htmlToPaper('printMe');
      this.$print(this.$refs["printMe"]);
    },

    closePrinter: function() {
      this.clearCarts();
      this.$router.push('/sales/pharmacy');
    }
  },
  beforeMount() {
    this.loadDefault();
  },
  mounted() {

    var lg = LS.get("logo");
    if (lg) {
      this.logo = lg;
    } else {
      image2base64(require("../../../assets/logo.png")) // you can also to use url
      .then(response => {
        this.logo = "data:image/jpeg;base64," + response;
      })
    }

    console.log(this.logo)

    /*
    image2base64(require("../../assets/stamp.png")) // you can also to use url
    .then(response => {
      this.stamp = "data:image/jpeg;base64," + response;
    })
    .catch(e => {
      this.$toastr.error(e.message); //Exepection error....
    });*/
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
    font-size: 14px !important;
    font-weight: bold;
  }
  .header .address {
    font-size: 10px;
  }
  .header .contact {
    font-size: 10px;
  }
  .header .subtitle {
    padding-top: 14px !important;
    font-size: 14px;
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
    float: right;
    right: 10% !important;
    top: 0px !important;
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
