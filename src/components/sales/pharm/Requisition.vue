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
        <v-btn class="primary" @click.stop="makeRequisition"
          ><v-icon>add_shopping_cart</v-icon>Make requisition</v-btn
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
              <input
                type="text"
                class="form-control"
                v-model="location.name"
                readonly
              />
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
                    <img src="../../../assets/addnewitem.svg" />
                  </v-flex>
                </td>
              </tr>
            </table>
          </v-flex>
        </v-layout>
        <base-pagination :total="requisitions.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
      </v-container>
    </v-card>

    <v-dialog v-model="requisitionDialog" persistent left top width="800px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Make requisition
          <v-spacer></v-spacer>
          <v-btn @click="requisitionDialog = false">Close</v-btn>
          <v-btn class="primary" @click="requestItems" :disabled="isNotItemsTransferrable">Send request</v-btn>
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
              <label class="control-label">Request date</label>
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
                    v-model="requisition.date"
                    placeholder="Expiry date"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="requisition.date"
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
                v-model="requisition.reference"
                class="form-control"
                placeholder="Transfer reference number"
                readonly
              />
            </v-flex>
            <v-flex xs4>
              <label class="control-label">Request location</label>
              <input
                type="text"
                class="form-control"
                placeholder="select"
                v-model="location.name"
                readonly
              />
            </v-flex>
            
            <v-flex x12>
                <v-divider />
                <base-mict-comboBox :items="drugs" v-on:select="selectItems" />
            </v-flex>
            
            <v-flex xs12>
              <table class="table table-stripped">
                <thead>
                  <th>#</th>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Qty in store</th>
                  <th>Unit Price</th>
                  <th>Qty needed</th>
                  <th>Subtotal</th>
                  <th></th>
                </thead>
                <tbody>
                  <template  v-for="(prod, index) in requisition.items">
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
            <v-flex xs12>
                <label>Remark:</label>
                <textarea class="form-control" cols="100%" rows="2" v-model="requisition.remark"></textarea>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    

    <v-dialog v-model="viewRequisitionDialog" persistent left top width="800px">
      <v-card id="printMe">
        <v-card-title class="grey lighten-4 py-4 title">
          Requisition detail
          <v-spacer></v-spacer>
          <v-btn @click="viewRequisitionDialog = false" class="no-print"
            >Close</v-btn
          >
          <v-btn @click="printPage" class="red no-print"
            >Print</v-btn>
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
                :value="location.name"
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
                    v-for="(prod, index) in transDetails.products"
                    :key="index"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ prod.sku }}</td>
                    <td>{{ prod.name }}</td>
                    <td>{{ prod.qty }}</td>
                    <td>{{ prod.price | toDecimal }}</td>
                    <td>{{ (prod.price * prod.qty) | toDecimal }}</td>
                    <td>
                        <v-icon color="green" v-if="prod.status && prod.status==1">check</v-icon>
                        <v-icon color="pink" v-else>donut_large</v-icon>
                    </td>
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
import { URL, LS, SHA256, IDGenerator } from "../../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "requisition",
    data: () => ({
        error: "",
        location:[],
        loading: false,
        modalDate: false,
        transmodalDate: false,
        processing: false,
        page: 1,
        pageSize: 50,
        showSearch: false,
        requisitionDialog: false,
        viewRequisitionDialog: false,
        user: [],
        drugs: [],
        paginate: [],
        requisitions: [],
        transDetails: [],
        search: {
        date: new Date().toISOString().substr(0, 10),
        reference: "",
        fStore: "",
        items: []
        },
        requisition: {
            location:0,
            outlet:'',
            date: new Date().toISOString().substr(0, 10),
            reference: IDGenerator(10),
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
            return this.requisitions.result;
        },
        isRequestFromReport(){
            return this.$route.path.toLowerCase().includes('report', 0)
        },
        isNotItemsTransferrable(){
            let index=this.requisition.items.findIndex(x=>x.qty == 0);
            return index > -1;
        },
    },
    methods: {
        ...mapActions(["setDomain", "checkStorage"]),
        
        loadRequisition: function() {
            this.$Progress.start();
            this.loading = true;
            let payload={
                outlet: this.outlet.id,
                location: this.location.id,
                reference: this.search.reference,
                date: this.search.date,
                action:'loads'
            }
            this.post("/requisition", payload)
            .then(resp => {
                if (resp.status > 0) {
                    this.requisitions = resp.response;
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
        
        makeRequisition: function() {
            //this.loadStore();
            this.loadItemsFromMainstore();
            this.requisitionDialog = true;
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
            this.requisition.items.push(product.item);
        },
        removeFromTransfer: function(index) {
            this.requisition.items.splice(index, 1);
            this.updateTotal();
        },
        calculateSummary: function(index, qty) {
            this.requisition.items[index].qty =
                this.requisition.items[index].qty == ""
                ? 0
                : this.requisition.items[index].qty;
            if(this.requisition.items[index].qty>qty){
                this.requisition.items[index].qty=0;
            }
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
            this.$forceUpdate();
        },

        viewProducts: function(index) {
            this.transDetails = this.checkItems[index];
            this.viewRequisitionDialog = true;
        },
        printPage: function() {
            this.$htmlToPaper("printMe");
        },
        requestItems: function() {
            if (this.requisition.date == "") {
                this.$toastr.error("Transfer date cannot be emptied");
                return false;
            }
            if (this.requisition.reference == "") {
                this.$toastr.error("Transfer reference cannot be emptied");
                return false;
            }
            if (this.requisition.store == "") {
                this.$toastr.error("Recieving location cannot be emptied");
                return false;
            }
            if (this.requisition.items.length == 0) {
                this.$toastr.error("You havent added items tobe transfered.");
                return false;
            }
            this.$Progress.start();
            this.processing = true;
            this.requisition.location=this.location.id;
            this.requisition.outlet = this.outlet.id;
            this.requisition.user_id = this.user.id;
            this.requisition.action=""
            this.post("/requisition", this.requisition)
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
    },
    mounted() {
        this.location=LS.get('location');
        this.user = LS.get("user");
        this.checkStorage();
        setTimeout(this.loadRequisition,200);
        
    }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
