<template>
  <v-container>
    <v-card>
      <v-toolbar row wrap>
        <v-btn color="red" @click="$router.go(-1)" white-text
          ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
        >
        <v-toolbar-title>Requisitions</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn class="primary" @click.stop="showSearch = !showSearch"
          ><v-icon>search</v-icon>Search</v-btn
        >
        
        <v-btn class="danger" @click="printPage"
          ><v-icon>mdi-printer</v-icon>Print</v-btn
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
            <v-flex xs4 align-center justify-space-between>
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
                placeholder="Req. reference no."
              />
            </v-flex>
            <v-flex xs3>
              <label class="control-label">Sales location</label>
              <select
                class="form-control select2me"
                placeholder="Transfer from:"
                v-model="search.fStore"
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
            <v-flex xs2 style="padding-top:3.57%;">
              <button
                type="button"
                class="btn btn-danger"
                @click="loadRequisition"
              >
                Search req.
              </button>
            </v-flex>
          </v-flex>
          <v-divider />
          <v-flex xs12>
            <table class="table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Reference</th>
                  <th>From</th>
                  <th>Send By</th>
                  <th>Send Date</th>
                  <th>Approved by</th>
                  <th>Apprved on</th>
                  <th>Picked by</th>
                  <th></th>
                </tr>
              </thead>
              <tbody v-if="checkItems && checkItems.length > 0">
                <tr v-for="(item, index) in checkItems" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.reference }}</td>
                  <td>{{ item.sendby }}</td>
                  <td>{{ item.date }}</td>
                  <td>{{ item.approved_by }}</td>
                  <td>{{ item.approval_date }}</td>
                  <td>{{ item.items_picked_by }}</td>
                  <td>
                    <v-chip class="ma-2" color="blue" text-color="white" @click="viewProducts(index)">
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
        <base-pagination :total="requisition.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
      </v-container>
    </v-card>

    <v-dialog v-model="viewTransferDialog" persistent left top width="800px">
      <v-card id="printMe">
        <v-card-title class="grey lighten-4 py-4 title">
          Requisition detail
          <v-spacer></v-spacer>
          <v-btn @click="viewTransferDialog = false" class="no-print"
            >Close</v-btn
          >
          <v-btn @click="printPage" class="red no-print"
            ><v-icon>print</v-icon></v-btn
          >
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row>
            <v-flex xs4>
              <label class="control-label">Date of requisition</label>
              <input
                type="text"
                class="form-control"
                v-model="transDetails.date"
                readonly
              />
            </v-flex>
            <v-flex xs4>
              <label class="control-label">requisition reference</label>
              <input
                type="text"
                :value="transDetails.reference"
                class="form-control"
                readonly
              />
            </v-flex>
            <v-flex xs4>
              <label class="control-label">requisition to</label>
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
                    requisition done by: {{ transDetails.user }}
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
import { mapState, mapActions } from "vuex";
export default {
  name: "requisition",
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
    page: 1,
    pageSize: 50,
    showSearch: false,
    transferDialog: false,
    viewTransferDialog: false,
    processing: false,
    user: [],
    drugs: [],
    paginate: [],
    requisition: [],
    transDetails: [],
    search: {
      date: new Date().toISOString().substr(0, 10),
      reference: "",
      fStore: "",
      items: []
    },
    requisition: {
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
      return this.requisition.result;
    },
    isRequestFromReport(){
      return this.$route.path.toLowerCase().includes('report', 0)
    }
  },
  methods: {
    ...mapActions(["setDomain", "checkStorage"]),
    
    loadRequisition: function() {
      this.$Progress.start();
      this.loading = true;
      let payload={
        outlet: this.outlet.id,
        location: this.search.fStore,
        reference: this.search.reference,
        date: this.search.date,
        action:'loads'
      }
      this.post("/requisition", payload)
      .then(resp => {
        if (resp.status > 0) {
          this.requisition = resp.response;
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
    calculateSummary: function(index) {
      this.requisition.items[index].qty =
        this.requisition.items[index].qty == ""
          ? 0
          : this.requisition.items[index].qty;
      this.requisition.items[index].subtotal =
        parseFloat(this.requisition.items[index].selling_price) *
        parseFloat(this.requisition.items[index].qty);
      this.updateTotal();
    },
    updateTotal: function() {
      this.total = {
        qty: 0,
        amount: 0.0
      };
      var vm = this;
      this.requisition.items.forEach(function(item) {
        vm.total.qty = parseInt(vm.total.qty) + parseInt(item.qty);
        vm.total.amount =
          parseFloat(vm.total.amount) + parseFloat(item.subtotal);
      });
    },

    viewProducts: function(index) {
      this.transDetails = this.requisition[index];
      this.viewTransferDialog = true;
    },
    printPage: function() {
      this.$htmlToPaper("printMe");
    }
  },
  mounted() {
    this.checkStorage();
    this.loadRequisition();
    this.user = LS.get("user");
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
