<template>
  <v-container>
    <v-card>
      <v-toolbar row wrap>
        <v-btn color="red" @click="$router.go(-1)" white-text
          ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
        >
        <v-toolbar-title>Supply history</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          class="primary"
          @click.stop="showSearchDialog = !showSearchDialog"
          ><v-icon>search</v-icon>Search</v-btn
        >
        <v-btn class="primary" @click="addSupply"
          ><v-icon>near_me</v-icon>New supply</v-btn
        >
      </v-toolbar>

      <v-container grid-list-sm class="pa-4">
        <v-layout row>
          <v-flex xs12>
            <table class="table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Qty purchased</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody v-if="supplies && supplies.length > 0">
                <tr v-for="(item, index) in checkItems" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.date }}</td>
                  <td>{{ item.reference }}</td>
                  <td>{{ item.qty }}</td>
                  <td>{{ item.cost_price }}</td>
                  <td>
                    <v-btn icon small @click="viewProducts(index)"
                      ><v-icon color="blue">remove_red_eye</v-icon></v-btn
                    >
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
        <base-pagination :total="supplies.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
      </v-container>
    </v-card>
    <v-dialog v-model="transferDialog" persistent left top width="800px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          New supply
          <v-spacer></v-spacer>
          <v-btn @click="transferDialog = false">Close</v-btn>
          <v-btn class="primary" @click="transferItems">Add supply</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <template v-if="isProcessing">
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular
            >Processing supply...
          </template>
          <v-layout row>
            <v-flex xs3>
              <label class="control-label">Date of supply</label>
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
                    v-model="supply.date"
                    placeholder="Expiry date"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="supply.date"
                  @input="transmodalDate = false"
                  :landscape="true"
                  :relative="true"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs3>
              <label class="control-label">supply reference</label>
              <input
                type="text"
                v-model="supply.reference"
                class="form-control"
                placeholder="Supply reference number"
              />
            </v-flex>
            <v-flex xs4>
              <label class="control-label">Supplier</label>
              <select
                class="form-control select2me"
                placeholder="select"
                v-model="supply.supplier"
                required
              >
                <option value="0" selected>Selected supplier</option>
                <option
                  v-for="(store, index) in stores"
                  :key="index"
                  :value="store.id"
                  >{{ store.name }}</option
                >
              </select>
            </v-flex>
            <v-flex xs2>
              <br />
              <v-btn
                icon
                large
                class="red lighten-4"
                @click="$router.push('supplier')"
                ><v-icon>mdi-bottle-tonic-plus-outline</v-icon></v-btn
              >
            </v-flex>

            <v-flex x11>
              <base-mict-comboBox :items="drugs" v-on:select="selectItems" />
            </v-flex>
            <v-flex xs1>
              <v-btn
                icon
                large
                class="blue lighten-4"
                @click="$router.push('add-drugs')"
                ><v-icon>mdi-view-grid-plus-outline</v-icon></v-btn
              >
            </v-flex>
            <v-flex xs12>
              <table class="table table-stripped">
                <thead>
                  <th>#</th>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Qty(in stock)</th>
                  <th>Qty(supply)</th>
                  <th>Cost price</th>
                  <th>Total</th>
                  <th></th>
                </thead>
                <tbody>
                  <tr v-for="(prod, index) in supply.items" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ prod.sku }}</td>
                    <td>{{ prod.name }}</td>
                    <td>{{ prod.available_qty }}</td>
                    <td>
                      <input
                        type="text"
                        v-model="prod.qty"
                        class="form-control"
                        style="width:70px;"
                        @keyup="calculateSummary(index)"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        v-model="prod.cost"
                        class="form-control"
                        style="width:70px;"
                        @keyup="calculateSummary(index)"
                      />
                    </td>
                    <td>{{ prod.total | toDecimal }}</td>
                    <td>
                      <v-icon @click="removeFromTransfer(index)"
                        >delete_forever</v-icon
                      >
                    </td>
                  </tr>
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
          Supply detail
          <v-spacer></v-spacer>
          <v-btn @click="viewTransferDialog = false" class="no-print"
            >Close</v-btn
          >
          <v-btn @click="printPage" class="red no-print"
            ><v-icon>mdi-printer</v-icon></v-btn
          >
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row>
            <v-flex xs4>
              <label class="control-label">Date of Supply</label>
              <input
                type="text"
                class="form-control"
                v-model="supplyDetails.date"
                readonly
              />
            </v-flex>
            <v-flex xs4>
              <label class="control-label">Reference</label>
              <input
                type="text"
                :value="supplyDetails.reference"
                class="form-control"
                readonly
              />
            </v-flex>
            <v-flex xs4>
              <label class="control-label">By</label>
              <input
                type="text"
                :value="supplyDetails.supplier"
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
                  <th>Qty(in stock)</th>
                  <th>Qty(supplied)</th>
                  <th>Cost price</th>
                  <th>Total</th>
                  <th></th>
                </thead>
                <tbody>
                  <tr
                    v-for="(prod, index) in supplyDetails.products"
                    :key="index"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ prod.sku }}</td>
                    <td>{{ prod.name }}</td>
                    <td>{{ prod.available_qty }}</td>
                    <td>{{ prod.qty }}</td>
                    <td>{{ prod.cost | toDecimal }}</td>
                    <td>{{ prod.total | toDecimal }}</td>
                    <td><v-icon color="green">check</v-icon></td>
                  </tr>
                </tbody>
                <tfoot>
                  <th colspan="7" style="text-align:right;">
                    Supply registered by: {{ supplyDetails.user }}
                  </th>
                </tfoot>
              </table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showSearchDialog" persistent left top width="800px">
      <v-card id="printMe">
        <v-card-title class="grey lighten-4 py-4 title">
          Search supply
          <v-spacer></v-spacer>
          <v-btn @click="showSearchDialog = false" class="no-print"
            >Close</v-btn
          >
          <v-btn @click="searchTransfer" class="red no-print"
            ><v-icon>search</v-icon>Search supply</v-btn
          >
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row>
            <v-flex xs4 align-center justify-space-between>
              <label class="control-label">Supply date</label>
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
            <v-flex xs4>
              <label class="control-label">Reference no</label>
              <input
                type="text"
                class="form-control"
                placeholder="Reference no."
              />
            </v-flex>
            <v-flex xs4>
              <label class="control-label">Supplier</label>
              <select
                class="form-control select2me"
                placeholder="Supplier:"
                v-model="search.supplier"
              >
                <option value="" selected>Select supplier</option>
                <option
                  v-for="(store, index) in stores"
                  :key="index"
                  :value="store"
                  >{{ store.name }}</option
                >
              </select>
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
    loading: false,
    store: [],
    error: "",
    stores: [],
    modalDate: false,
    transmodalDate: false,
    loadingDialog: false,
    productSearchInput: "",
    activeStore: 0,
    showSearchDialog: false,
    transferDialog: false,
    viewTransferDialog: false,
    isProcessing: false,
    paginate: [],
    supplies: [],
    supplyDetails: [],
    page:1,
    pageSize: 50,
    search:'',
    search: {
      date: new Date().toISOString().substr(0, 10),
      reference: "",
      supplier: ""
    },
    supply: {
      date: new Date().toISOString().substr(0, 10),
      reference: IDGenerator(10),
      supplier: 0,
      qty: 0,
      cost: 0,
      remark: "",
      user: 0,
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
      return (this.supplies.result)?this.supplies.result:[];
    },
    dateRangeText() {
      return this.search.dates.join(" ~ ");
    },
  },
  methods: {
    ...mapActions(["setDomain", "checkStorage"]),
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search.reference=pageItems.search;
      this.loadSupply();
    },
    loadSupply: function() {
      let payload={
        outlet: this.outlet.id,
        refence: this.search.reference,
        date: this.dateRangeText,
        supplier: this.search.supplier,
        page: this.page,
        pageSize: this.pageSize,
        action:'loads'
      }
      this.loading = true;
      this.post("/supply", this.search)
        .then(resp => {
          if (resp.status > 0) {
            this.supplies = resp.response;
            this.loading = false;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
          this.loading = false;
        });
    },
    
    addSupply: function() {
      this.loadSupplier();
      this.loadItemsFromMainstore();
      this.transferDialog = true;
    },
    loadSupplier: function() {
      this.$Progress.start();
      this.post("/supplier", {outlet:this.outlet.id, action:'loads'})
      .then(resp => {
        if (resp.status > 0) {
          this.stores = resp.response.result;
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },
    loadItemsFromMainstore: function() {
      this.$Progress.start();
      this.get("/drugs")
      .then(response => {
        if (response.status > 0) {
          this.drugs = response.response;
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },

    searchTransfer: function() {
      this.post("/pharmacy/getAStore", this.search)
        .then(response => {
          if (response.status > 0) {
            var categories = [];
            this.drugs = response.response.drugs;
            for (var key in this.drugs) {
              this.categories.push(key);
            }
            var list = [];
            for (var key in this.drugs) {
              if (this.drugs[key]) {
                list.push(this.drugs[key]);
              }
            }
            this.filterDrugs = [].concat.apply([], list);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    selectItems: function(product) {
      product.item.qty = 0;
      product.item.cost = 0;
      product.item.total = 0;
      this.supply.items.push(product.item);
    },
    removeFromTransfer: function(index) {
      this.supply.items.splice(index, 1);
      this.updateTotal();
    },
    calculateSummary: function(index) {
      this.supply.items[index].qty =
        this.supply.items[index].qty == "" ? 0 : this.supply.items[index].qty;
      this.supply.items[index].total =
        parseFloat(this.supply.items[index].cost) *
        parseFloat(this.supply.items[index].qty);
      this.updateTotal();
    },
    updateTotal: function() {
      this.total = {
        qty: 0,
        amount: 0.0
      };
      var vm = this;
      this.supply.items.forEach(function(item) {
        vm.total.qty = parseInt(vm.total.qty) + parseInt(item.qty);
        vm.total.amount = parseFloat(vm.total.amount) + parseFloat(item.total);
      });
    },
    transferItems: function() {
      if (this.supply.date == "") {
        this.$toastr.error("Supply date cannot be emptied");
        return false;
      }
      if (this.supply.reference == "") {
        this.$toastr.error("Supply reference cannot be emptied");
        return false;
      }
      if (this.supply.supplier == "") {
        this.$toastr.error("Supply must be selected.");
        return false;
      }
      if (this.supply.items.length == 0) {
        this.$toastr.error("You havent added items tobe transfered.");
        return false;
      }
      this.isProcessing = true;
      this.supply.qty = this.total.qty;
      this.supply.total = this.total.amount;
      this.supply.outlet = this.outlet.id;
      this.supply.user_id = this.user.id;
      this.post("/supply", this.supply)
        .then(resp => {
          if (resp.status > 0) {
            this.loadSupply();
            this.isProcessing = false;
          } else {
            this.$toastr.error(resp.message);
            this.isProcessing = false;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
          this.isProcessing = false;
        });
    },
    viewProducts: function(index) {
      this.supplyDetails = this.supplies[index];
      this.viewTransferDialog = true;
    },
    printPage: function() {
      this.$htmlToPaper("printMe");
    }
  },
  mounted() {
    this.checkStorage();
    this.user = LS.get("user");
    setTimeout(this.loadSupply, 200);
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
