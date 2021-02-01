<template>
  <v-app id="inspire">
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="primary"
      blue
      app
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon
          @click.stop="drawer = !drawer"
        ></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">Patrec</span>
      </v-toolbar-title>
      <v-text-field
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search for patient"
        class="hidden-sm-and-down"
        style="width: 500px"
        v-model="searchStr"
        @keyup="putSearch"
      ></v-text-field>

      <v-spacer></v-spacer>
      <v-btn icon class="white" @click="$router.push('/home')">
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon class="white">
        <v-icon>email</v-icon>
      </v-btn>
      <v-btn icon class="white">
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-btn icon large class="white">
        <v-avatar size="32px" tile>
          <img src="../assets/user.png" alt="User passport" />
        </v-avatar>
      </v-btn>
      <v-btn icon class="white" @click="requestCloseRegister">
        <v-icon>logout</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height grid-list-md class="main-body">
        <router-view
          dense
          class="inner-container scroller"
          style="height:580px;"
        ></router-view>
      </v-container>
    </v-content>

    <v-dialog v-model="registerDialog" hide-overlay persistent width="350">
      <v-card color="primary" dark>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Close register</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          Would you love to close your register aswell?
        </v-card-text>
        <v-card-actions>
          <v-btn danger align="left" @click="logout">No! Just logout</v-btn>
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="closeRegister">Close register</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialog" hide-overlay persistent width="350">
      <v-card color="primary" dark>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Warning!</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          Are you sure you want to close your sale register for the day? If yes,
          click yes, otherwise, click no.
        </v-card-text>
        <v-card-actions>
          <v-btn
            danger
            align="left"
            @click="
              confirmDialog = false;
              registerDialog = true;
            "
            >No! Continue</v-btn
          >
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="proceedToCloseRegister"
            >Yes! Close register</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="summaryDialog" hide-overlay persistent width="800px">
      <v-card id="print">
        <v-card-title class="grey lighten-4 py-4 title">
          Sales register summary
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex
              xs12
              v-if="
                this.settings &&
                  this.settings.show_sales_summary &&
                  this.settings.show_sales_summary == 1
              "
            >
              <table class="table table-border table-stripped">
                <tbody>
                  <tr>
                    <th>Cash in hand:</th>
                    <td>{{ registerDetail.stock | toDecimal }}</td>
                  </tr>
                  <tr>
                    <th>Subtotal:</th>
                    <td>{{ registerDetail.subtotal | toDecimal }}</td>
                  </tr>
                  <tr>
                    <th>Discount:</th>
                    <td>{{ registerDetail.discount | toDecimal }}</td>
                  </tr>
                  <tr>
                    <th>No of Sales:</th>
                    <td>{{ registerDetail.sales }}</td>
                  </tr>
                  <tr>
                    <th>Total Refund/Expense:</th>
                    <td>{{ registerDetail.expense | toDecimal }}</td>
                  </tr>
                  <tr>
                    <th>Total Cash:</th>
                    <td>
                      {{
                        (registerDetail.total +
                          registerDetail.stock -
                          registerDetail.expense)
                          | toDecimal
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-flex>
            <v-flex
              xs12
              v-if="
                this.settings &&
                  this.settings.show_sales_summary &&
                  this.settings.show_sales_summary == 1
              "
            >
              <h3>Register detail</h3>
              <table class="table table-hover" v-if="list">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Subtotal</th>
                    <th>Discount</th>
                    <th>VAT</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in list" :key="index">
                    <td class="disable">{{ index + 1 }}</td>
                    <td class="disable">{{ item.code }}</td>
                    <td class="disable">{{ item.customer.name }}</td>
                    <td class="disable">{{ description(item.items) }}</td>
                    <td class="disable">{{ item.subtotal | toDecimal }}</td>
                    <td class="disable">{{ item.discount | toDecimal }}</td>
                    <td class="disable">{{ item.vat | toDecimal }}</td>
                    <td class="disable">{{ item.total | toDecimal }}</td>
                    <td class="disable">{{ item.date }}</td>
                  </tr>
                </tbody>
              </table>
            </v-flex>
            <v-divider></v-divider>
            <v-flex xs12 row wrap>
              <v-flex xs4 align-center justify-space-between>
                <div clas="form-group">
                  <label class="control-label">Total Cash:*</label>
                  <input
                    type="text"
                    name="cash"
                    class="form-control"
                    v-model="summaryDetail.cash"
                  />
                </div>
              </v-flex>
              <v-flex xs4 align-center justify-space-between>
                <div clas="form-group">
                  <label class="control-label">Total Card Slips:*</label>
                  <input
                    type="text"
                    name="card"
                    class="form-control"
                    v-model="summaryDetail.card"
                  />
                </div>
              </v-flex>
              <v-flex xs4 align-center justify-space-between>
                <div clas="form-group">
                  <label class="control-label">Total cheques:*</label>
                  <input
                    type="text"
                    name="cheques"
                    class="form-control"
                    v-model="summaryDetail.cheques"
                  />
                </div>
              </v-flex>
            </v-flex>
            <v-flex xs12 align-center justify-space-between>
              <div clas="form-group">
                <label class="control-label">Closing Note:</label>
                <textarea
                  col="100%"
                  rows="3"
                  class="form-control"
                  v-model="summaryDetail.remarks"
                ></textarea>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions class="no-print">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="summaryDialog = false">Cancel</v-btn>
          <v-btn @click="finallyCloseRegister">Close register</v-btn>
          <v-btn @click="printRegister"><v-icon>printer</v-icon>Printer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { URL, LS, APP, SHA256 } from "../shared/config.js";
export default {
  data: () => ({
    drawer: null,
    drawer_top: null,
    items: [],
    settings: [],
    searchStr: "",
    searchdialog: false,
    stillSearching: false,
    fingerdialog: false,
    registerDialog: false,
    confirmDialog: false,
    summaryDialog: false,
    waver_dialog: false,
    registerDetail: [],
    filterPtients: [],
    list: [],
    expList: [],
    sensor: [],
    message: "",
    labs: [],
    summaryDetail: []
  }),
  props: {
    source: String
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
      "register"
    ])
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "addPatients", "checkStorage"]),
    description(item) {
      var desc = "";
      for (var i = 0; i < item.length; i++) {
        desc +=
          item[i]["name"] +
          "(" +
          item[i]["code"] +
          ")=" +
          item[i]["amount"] +
          ";";
      }
      return desc;
    },
    putSearch: function(e) {
      if (e.keyCode === 13 && this.searchStr != "") {
        this.setSearch(this.searchStr);
        this.$router.push("/search");
      }
    },
    logout: function() {
      LS.remove("patient");
      LS.remove("department");
      LS.remove("dept");
      LS.remove("platform");
      LS.remove("user");
      LS.remove("medical");
      LS.remove("schedule");
      LS.remove("settings");
      LS.remove("searched");
      LS.remove("currentCart");
      this.$router.push("/");
    },
    autoSync: function() {
      var vm = this;
      var interval = setInterval(function() {
        vm.syncData();
      }, 100000);
    },
    syncData: function() {},
    requestCloseRegister: function() {
      if (this.register && this.register.code != undefined) {
        this.registerDialog = true;
      } else {
        this.logout();
      }
    },
    closeRegister: function() {
      this.confirmDialog = true;
      this.registerDialog = false;
    },
    proceedToCloseRegister: function() {
      var parameters = {
        outlet: this.outlet.id,
        register: this.register,
        user: this.users.id,
        isClose: 1
      };
      var url = "/close-register";
      //Promise.all([axios.post(this.domain + "/summary-report", parameters)])
      this.post("/summary-report", parameters)
        .then(response => {
          if (response.status > 0) {
            this.registerDetail = response.response.summary;
            this.list = response.response.detail;
            this.expList = response.response.expense;
          }
          this.confirmDialog = false;
          this.summaryDialog = true;
        })
        .catch(e => {
          this.$toastr.error(e.message);
          this.confirmDialog = false;
          this.summaryDialog = true;
        })
        .then(() => {});
    },
    finallyCloseRegister: function() {
      if (this.summaryDetail.cash == "") {
        alert("Sorry, you must provide the cash summary of today collection.");
        return false;
      }
      this.summaryDetail.register = this.register;
      var sum =
        parseFloat(this.registerDetail.total) +
        parseFloat(this.registerDetail.stock) -
        parseFloat(this.registerDetail.expense);
      var current =
        parseFloat(this.summaryDetail.cash) +
        parseFloat(this.summaryDetail.card) +
        parseFloat(this.summaryDetail.cheques);
      //console.log(`sum:${sum} current:${current}`);
      if (
        parseFloat(sum) != parseFloat(current) &&
        this.this.settings &&
        this.this.settings.show_sales_summary &&
        this.this.settings.show_sales_summary == 1
      ) {
        alert("Entered amount must equal to the expect total cash.");
        return false;
      }
      this.getToday();
      this.summaryDetail.date = this.today;
      var postData = {
        outlet: this.outlet,
        params: this.summaryDetail
      };

      this.post("/close-register", postData)
        .then(response => {
          if (response.status > 0) {
            LS.remove("patient");
            LS.remove("department");
            LS.remove("dept");
            LS.remove("platform");
            LS.remove("user");
            LS.remove("medical");
            LS.remove("schedule");
            LS.remove("settings");
            LS.remove("searched");
            LS.remove("currentCart");
            LS.remove("justLogin");
            this.setRegister(response.response);
            this.$router.push("/");
          } else {
            this.$toastr.error(
              "Sorry, error occured from the server while closing your register."
            );
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    printRegister: function() {
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
    }
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.autoSync();
  }
};
</script>
<style scoped>
.main-body {
  display: block;
  position: relative;
  background: url(../assets/bg1.png) center no-repeat;
  opacity: 1;
  content: "";
}
.inner-container {
  width: 100% !important;
}
.main-body::after {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
}
.search-container {
  width: 400px !important;
  position: absolute;
  top: 10px;
}
</style>
