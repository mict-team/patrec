<template>
  <v-container>
    <v-card>
      <v-toolbar row wrap>
        <v-btn color="red" @click="$router.go(-1)" white-text
          ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
        >
        <v-toolbar-title>Transfer history</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="primary" @click.stop="showSearch = !showSearch"
          ><v-icon>search</v-icon>Search</v-btn
        >
        <v-btn class="primary" @click="addTransfer" v-if="!isRequestFromReport"
          ><v-icon>near_me</v-icon>Transfer</v-btn
        >
      </v-toolbar>

      <v-container grid-list-sm class="pa-4">
        <v-layout row>
          <v-flex xs12 row v-show="showSearch">
            <v-flex xs12>
              <legend>Search</legend>
              <hr />
            </v-flex>
            <br /><br />
            <v-flex xs3 align-center justify-space-between>
              <label class="control-label">Transfer date</label>
              <v-menu
                v-model="modalDate"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <input
                    type="text"
                    class="form-control"
                    v-model="search.date"
                    placeholder="Expiry date"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="search.date"
                  @input="modalDate = false"
                  :landscape="true"
                  :relative="true"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs3>
              <label class="control-label">Reference no</label>
              <input
                type="text"
                class="form-control"
                v-model="search.reference"
                placeholder="Transfer reference no."
              />
            </v-flex>
            <v-flex xs3>
              <label class="control-label">Sales location</label>
              <select
                class="form-control select2me"
                placeholder="Transfer from:"
                v-model="search.toStore"
              >
                <option value="" selected>Select selling location</option>
                <option
                  v-for="(store, index) in stores"
                  :key="index"
                  :value="store.id"
                  >{{ store.name }}</option
                >
              </select>
            </v-flex>
            <v-flex xs3 style="padding-top:3.57%;">
              <button
                type="button"
                class="btn btn-danger"
                @click="loadTransfers"
              >
                Search transfers
              </button>
            </v-flex>
          </v-flex>
          <v-divider />
          <v-flex xs12>
            <table class="table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>To</th>
                  <th>By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody v-if="checkItems && checkItems.length > 0">
                <tr v-for="(item, index) in checkItems" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.date }}</td>
                  <td>{{ item.reference }}</td>
                  <td>{{ item.dept }}</td>
                  <td>{{ item.user }}</td>
                  <td>
                    <v-chip class="ma-2" color="green" text-color="white" @click="viewProducts(index)">
                      <v-icon>remove_red_eye</v-icon>View items
                    </v-chip>
                  </td>
                </tr>
              </tbody>
              <tr v-else>
                <td colspan="9">
                  <v-flex xs12 style="text-align:center;">
                    <img src="../../assets/addnewitem.svg" />
                  </v-flex>
                </td>
              </tr>
            </table>
          </v-flex>
        </v-layout>
        <base-pagination :total="transfers.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
      </v-container>
    </v-card>
    <v-dialog v-model="transferDialog" persistent left top width="800px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Transfer items
          <v-spacer></v-spacer>
          <v-btn @click="transferDialog = false">Close</v-btn>
          <v-btn class="primary" @click="transferItems" :disabled="isNotItemsTransferrable">Transfer</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <template v-if="processing">
            <v-progress-circular
              :size="30"
              color="primary"
              indeterminate
            ></v-progress-circular
            >Processing transfer...
          </template>
          <v-layout row>
            <v-flex xs4>
              <label class="control-label">Date of transfer</label>
              <v-menu
                v-model="transmodalDate"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <input
                    type="text"
                    class="form-control"
                    v-model="transfer.date"
                    placeholder="Expiry date"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="transfer.date"
                  @input="transmodalDate = false"
                  :landscape="true"
                  :relative="true"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4>
              <label class="control-label">Transfer reference</label>
              <input
                type="text"
                v-model="transfer.reference"
                class="form-control"
                placeholder="Transfer reference number"
              />
            </v-flex>
            <v-flex xs4>
              <label class="control-label">Transfer to</label>
              <select
                class="form-control select2me"
                placeholder="select"
                v-model="transfer.store"
                required
              >
                <option value="0" selected>Selected store</option>
                <option
                  v-for="(store, index) in stores"
                  :key="index"
                  :value="store.id"
                  >{{ store.name }}</option
                >
              </select>
            </v-flex>

            <v-flex x12>
              <base-mict-comboBox :items="drugs" v-on:select="selectItems" />
            </v-flex>
            <v-flex xs12>
              <table class="table table-stripped">
                <thead>
                  <th>#</th>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Available qty</th>
                  <th>Unit Price</th>
                  <th>Qty to transfer</th>
                  <th>Subtotal</th>
                  <th></th>
                </thead>
                <tbody>
                  <template  v-for="(prod, index) in transfer.items">
                    <tr :key="index" :style="prod.available_qty<1?'color: pink':''">
                      <td>{{ index + 1 }}</td>
                      <td>{{ prod.sku }}</td>
                      <td>{{ prod.name }}</td>
                      <td>{{ prod.available_qty }}</td>
                      <td>{{ prod.selling_price | toDecimal }}</td>
                      <td>
                        <input
                          type="text"
                          v-model="prod.qty"
                          class="form-control"
                          style="width:70px;"
                          :readonly="prod.available_qty<1"
                          @keyup="calculateSummary(index, prod.available_qty)"
                        />
                      </td>
                      <td>{{ prod.subtotal | toDecimal }}</td>
                      <td>
                        <v-icon @click="removeFromTransfer(index)"
                          >delete_forever</v-icon
                        >
                      </td>
                    </tr>
                  </template>
                </tbody>
                <tfoot>
                  <th colspan="5" style="text-align:right;">Total</th>
                  <th>{{ total.qty }}</th>
                  <th>{{ total.amount | toDecimal }}</th>
                  <th></th>
                </tfoot>
              </table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="viewTransferDialog" persistent left top width="800px">
      <v-card id="printMe">
        <v-card-title class="grey lighten-4 py-4 title">
          Transfer detail
          <v-spacer></v-spacer>
          <v-btn @click="viewTransferDialog = false" class="no-print"
            >Close</v-btn
          >
          <v-btn @click="printPage" class="red no-print"
            >Print
          </v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row>
            <v-flex xs4>
              <label class="control-label">Date of transfer</label>
              <input
                type="text"
                class="form-control"
                v-model="transDetails.date"
                readonly
              />
            </v-flex>
            <v-flex xs4>
              <label class="control-label">Transfer reference</label>
              <input
                type="text"
                :value="transDetails.reference"
                class="form-control"
                readonly
              />
            </v-flex>
            <v-flex xs4>
              <label class="control-label">Transfer to</label>
              <input
                type="text"
                :value="transDetails.dept"
                class="form-control"
                readonly
              />
            </v-flex>

            <v-flex xs12>
              <table class="table table-stripped">
                <thead>
                  <th>#</th>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                  <th></th>
                </thead>
                <tbody>
                  <tr
                    v-for="(prod, index) in transDetails.product"
                    :key="index"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ prod.sku }}</td>
                    <td>{{ prod.name }}</td>
                    <td>{{ prod.qty }}</td>
                    <td>{{ prod.price | toDecimal }}</td>
                    <td>{{ (prod.price * prod.qty) | toDecimal }}</td>
                    <td><v-icon color="green">check</v-icon></td>
                  </tr>
                </tbody>
                <tfoot>
                  <th colspan="7" style="text-align:right;">
                    Transfer done by: {{ transDetails.user }}
                  </th>
                </tfoot>
              </table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { URL, LS, SHA256, IDGenerator } from "../../shared/config.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "Transfer",
  data: () => ({
    store: [],
    error: "",
    stores: [],
    loading: false,
    modalDate: false,
    transmodalDate: false,
    loadingDialog: false,
    storeDialog: false,
    filterDrugs: [],
    productSearchInput: "",
    activeStore: 0,
    showSearch: false,
    transferDialog: false,
    viewTransferDialog: false,
    processing: false,
    page: 1,
    pageSize: 50,
    dates:'',
    user: [],
    drugs: [],
    paginate: [],
    transfers: [],
    transDetails: [],
    search: {
      date: new Date().toISOString().substr(0, 10),
      reference: "",
      toStore: "",
      items: []
    },
    transfer: {
      outlet:'',
      date: new Date().toISOString().substr(0, 10),
      reference: IDGenerator(10),
      store: "",
      remark: "",
      items: []
    },
    total: {
      qty: 0,
      amount: 0.0
    }
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet"]),
    checkItems() {
      return this.transfers.result;
    },
    isNotItemsTransferrable(){
      let index=this.transfer.items.findIndex(x=>x.qty == 0);
      return index > -1;
    },
    isRequestFromReport(){
      return this.$route.path.toLowerCase().includes('report', 0)
    }
  },
  methods: {
    ...mapActions(["setDomain", "checkStorage"]),
    
    loadTransfers: function() {
      this.$Progress.start();
      this.loading = true;
      let payload={
        date: this.search.dates,
        location: this.search.toStore,
        reference: this.search.reference,
        page:this.page,
        perPage: this.pageSize,
        outlet: this.outlet.id,
        action:'loadTransfer'
      }
      this.post("/locations", payload)
      .then(resp => {
        if (resp.status > 0) {
          this.transfers = resp.response;
        }else{
          this.$toastr.error(resp.message)
        }
      })
      .finally(() => {
        this.$Progress.finish();
        this.loading = false;
      });
    },
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search.reference=pageItems.search;
      this.loadTransfers();
    },
    loadStore: function() {
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
        this.$Progress.finish();
        this.loading=false;
      })
    },
    addTransfer: function() {
      //this.loadStore();
      this.loadItemsFromMainstore();
      this.transferDialog = true;
    },
    loadItemsFromMainstore: function() {
      this.$Progress.start();
      this.get("/drugs")
      .then(resp => {
        console.log(resp.response)
        if (resp.status > 0) {
          this.drugs = resp.response;
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },
    
    selectItems: function(product) {
      product.item.qty = 0;
      product.item.subtotal = 0;
      this.transfer.items.push(product.item);
    },
    removeFromTransfer: function(index) {
      this.transfer.items.splice(index, 1);
      this.updateTotal();
    },
    calculateSummary: function(index, qty) {
      this.transfer.items[index].qty =
        this.transfer.items[index].qty == ""
          ? 0
          : this.transfer.items[index].qty;
      if(this.transfer.items[index].qty>qty){
        this.transfer.items[index].qty=0;
      }
      this.transfer.items[index].subtotal =
        parseFloat(this.transfer.items[index].selling_price) *
        parseFloat(this.transfer.items[index].qty);
      this.updateTotal();
    },
    updateTotal: function() {
      this.total = {
        qty: 0,
        amount: 0.0
      };
      var vm = this;
      this.transfer.items.forEach(function(item) {
        vm.total.qty = parseInt(vm.total.qty) + parseInt(item.qty);
        vm.total.amount =
          parseFloat(vm.total.amount) + parseFloat(item.subtotal);
      });
      this.$forceUpdate();
    },
    transferItems: function() {
      if (this.transfer.date == "") {
        this.$toastr.error("Transfer date cannot be emptied");
        return false;
      }
      if (this.transfer.reference == "") {
        this.$toastr.error("Transfer reference cannot be emptied");
        return false;
      }
      if (this.transfer.store == "") {
        this.$toastr.error("Recieving location cannot be emptied");
        return false;
      }
      if (this.transfer.items.length == 0) {
        this.$toastr.error("You havent added items tobe transfered.");
        return false;
      }
      this.$Progress.start();
      this.processing = true;
      this.transfer.outlet = this.outlet.id;
      this.transfer.user_id = this.user.id;
      this.transfer.action="transfer"
      this.post("/locations", this.transfer)
        .then(resp => {
          if (resp.status > 0) {
            this.loadTransfers();
          } else {
            this.$toastr.error(resp.message);
          }
        })
        .finally(() => {
          this.processing = false;
          this.$Progress.finish();
        });
    },
    viewProducts: function(index) {
      //console.log(this.checkItems[index])
      this.transDetails = this.checkItems[index];
      this.viewTransferDialog = true;
    },
    printPage: function() {
      this.$htmlToPaper("printMe");
    }
  },
  mounted() {
    this.checkStorage();
    this.user = LS.get("user");
    setTimeout(this.loadStore, 200);
    setTimeout(this.loadTransfers, 200);
    
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
