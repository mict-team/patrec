<template>
  <v-container id="print-bill-area">
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title
        >{{ searched.basic.name }}({{ searched.basic.code }})
        bill</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <button class="btn btn-info no-print" @click="addCharges">Add charges</button>
      &nbsp;&nbsp;&nbsp;
      <button class="btn btn-danger no-print" @click="printBill">Print bill</button>
      &nbsp;&nbsp;&nbsp;
      <button class="btn btn-success no-print" @click="paynowHandler">Pay bill</button>
    </v-toolbar>
    <v-card row wrap>
      <v-container grid-list-sm class="pa-4">
        <v-layout row >
          <v-flex xs3>
            <base-profile-panel :patient="searched" />
          </v-flex>

          <v-flex xs9>
              <v-card grid-list-sm class="pa-4">
              <v-layout row wrap>
                <v-flex xs12>
                  <table class="table table-hover">
                      <thead>
                      <tr>
                          <th>SN</th>
                          <th>Item desc</th>
                          <th width="10%">Qty</th>
                          <th>Amount</th>
                          <th>Total</th>
                          <th width="3%"></th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(bill, index) in bills" :key="index">
                          <td>{{ index + 1 }}</td>
                          <td>{{ bill.name }}</td>
                          <td width="10%">
                          <input
                              type="text"
                              class="form-control"
                              v-model="bill.qty"
                              :disabled="bill.duration>0"
                              @keyup="updateQty(index, bill)"
                          />
                          </td>
                          <td>{{ bill.amount | toDecimal }}</td>
                          <td>{{ bill.total | toDecimal }}</td>
                          <td width="5%">
                            <v-icon
                                v-if="bill.remove"
                                @click="removeCharge(index)"
                                >delete_forever</v-icon
                            >
                          </td>
                      </tr>
                      </tbody>
                      <tfoot>
                      <tr>
                          <th colspan="4" style="text-align:right; border-right: 1px solid #ccc;">Subtotal</th>
                          <th>{{ billSummary.subtotal | toDecimal }}</th>
                          <th></th>
                      </tr>
                      <tr>
                          <th colspan="4" style="text-align:right; border-right: 1px solid #ccc;">VAT</th>
                          <th>{{ billSummary.vat | toDecimal }}</th>
                          <th></th>
                      </tr>
                      <tr>
                          <th colspan="4" style="text-align:right; border-right: 1px solid #ccc;">Paid</th>
                          <th>{{ billSummary.paid | toDecimal }}</th>
                          <th></th>
                      </tr>

                      <tr style="font-size:30px;">
                          <th colspan="4" style="text-align:right; border-right: 1px solid #ccc;">Total</th>
                          <th>{{ billSummary.total | toDecimal }}</th>
                          <th></th>
                      </tr>
                      </tfoot>
                  </table>
                </v-flex>
              </v-layout>
              </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      
    </v-card>
    <v-dialog v-model="paynow_dialog" hide-overlay persistent width="500px">
      <v-card align-center>
        <v-card-title class="grey lighten-4 py-4 title">
          Select payment method
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap style="text-align:center">
            <v-card>
              <v-layout row wrap>
                <v-flex
                  v-for="(method, index) in paymentMethods"
                  :key="index"
                  @click="paynowHandler(method)"
                >
                  <v-card
                    class="blue thumbnail"
                    style="min-height:80px; min-width:100px;"
                  >
                    <v-container fill-height fluid pa-2>
                      <v-layout fill-height>
                        <v-flex
                          xs12
                          align-end
                          flexbox
                          style="padding-top:12px;"
                        >
                          <span
                            class="headline white--text"
                            v-text="method.name"
                          ></span>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="paynow_dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="bill_dialog" hide-overlay persistent width="700px">
      <v-card align-center>
        <v-toolbar row wrap class="grey lighten-4 py-1">
          <v-flex xs4>
            <select
              class="form-control select2me"
              placeholder="Consulting dept"
              v-model="dept"
              @change="loadCharges"
            >
              <option value="">..select dept</option>
              <option v-for="(st, index) in depts" :key="index" :value="st">{{
                st
              }}</option>
            </select>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              solo-inverted
              hide-details
              prepend-inner-icon="search"
              label="Search for charge"
              class="hidden-sm-and-down"
              v-model="searchStr"
              @keyup="putSearch"
            ></v-text-field>
          </v-flex>
          <v-flex xs2>
            <v-btn color="primary" @click="bill_dialog = false">Close</v-btn>
          </v-flex>
        </v-toolbar>

        <v-container grid-list-sm>
          <v-layout>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Dept</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(bill, index) in filterCharges">
                  <tr @click="addBillNow(bill)" :key="index" class="rowClick">
                    <td>{{ index + 1 }}</td>
                    <td>{{ bill.dept }}</td>
                    <td>{{ bill.name }}</td>
                    <td>{{ bill.amount | toDecimal }}</td>
                    <td style="cursor:pointer;"><v-icon>add</v-icon></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { URL, LS, APP, SHA256, IDGenerator } from "../../../shared/config.js";
export default {
  data: () => ({
    patientId:'',
    searched: [],
    bills: [],
    depts: [],
    dept: "",
    paynow_dialog: false,
    bill_dialog: false,
    searchStr: "",
    charges: [],
    carts: [],
    filterCharges: [],
    billSummary: {
      subtotal: 0.0,
      vat: 0.0,
      discount: 0.0,
      paid:0.0,
      total: 0.0
    }
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState([
      "outlet",
      "domain",
      "search",
      "today",
      "platforms",
      "departments",
      "paymentMethods",
      "transactions",
      "users",
      "settings"
    ])
  },
  methods: {
    ...mapActions(["getToday", "setDomain", "checkStorage"]),
    goBack: function() {
      this.$router.go(-1);
    },
    loadCharges: function() {
      this.filterCharges = this.charges[this.dept];
    },
    loadPatient: function(){
      this.$Progress.start();
      this.get("/patients/search/"+ this.patientId)
      .then(response => {
          if (response.status > 0) {
            this.searched=response.response;
          }
      })
      .finally(() => {
          this.$Progress.finish();
      });
    },
    loadBills: function() {
      this.$Progress.start();
      let payload={
        patient: this.patientId,
        outlet: this.outlet.id,
        action:'loadInd'
      }
      this.post(`bills/patient/account`, payload)
      .then(resp => {
        if (resp.status > 0) {
          resp.response.forEach(x => {
            let days=this.$options.filters.toDays(x.date_of_admission);
            x.qty = parseInt(x.qty);
            x.total = parseInt(x.qty) * parseFloat(x.amount);
            x.remove = false;
            this.bills.push(x);
          });
          this.calculate();
        } else {
          this.$toastr.error("Search completed. No match found.");
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    addCharges: function() {
      this.get("/charges")
        .then(resp => {
          if (resp.status > 0) {
            this.charges = resp.response;
          } else {
            this.$toastr.error("Sorry, couldnt load charges");
          }
        })
        .finally(() => {
          this.depts = [];
          for (var key in this.charges) {
            this.depts.push(key);
          }

          if (this.depts.length > 0) {
            this.filterCharges = this.charges[this.depts[0]];
            this.bill_dialog = true;
          }
        });
    },
    removeCharge: function(index) {
      this.bills.splice(index, 1);
      this.calculate();
    },
    printBill: function() {
      window.print();
    },
    addBillNow: function(bill) {
      var index = this.bills.findIndex(x => x.id == bill.id);
      if (index > -1) {
        this.bills[index].qty = this.bills[index].qty + 1;
        this.bills[index].total =
          parseInt(this.bills[index].qty) *
          parseFloat(this.bills[index].amount);
      } else {
        bill.qty = 1;
        bill.total = parseInt(bill.qty) * parseFloat(bill.amount);
        bill.remove = true;
        this.bills.push(bill);
      }
      this.calculate();
    },
    putSearch: function() {
      var list = [];
      for (var key in this.charges) {
        if (this.charges[key]) {
          list.push(this.charges[key]);
        }
      }

      let query = [].concat.apply([], list);
      this.filterCharges = query.filter(item => {
        return (
          item.name.toLowerCase().includes(this.searchStr.toLowerCase()) ||
          item.dept.toLowerCase().includes(this.searchStr.toLowerCase())
        );
      });
    },
    calculate: function() {
      var sumup = new Promise(resolve => {
        var subtotal = 0;
        var paid=0;
        this.bills.forEach(w => {
          subtotal += w["total"];
          paid +=w['paid'];
        });
        resolve({subtotal, paid});
      });
      sumup.then(response => {
        this.billSummary.subtotal = response.subtotal;
        this.billSummary.paid = response.paid;
        this.billSummary.total = (this.billSummary.subtotal - this.billSummary.paid)+ this.billSummary.vat;
      });
    },
    paynowHandler: function(method) {
      this.getToday();
      this.carts = {
        outlet: this.outlet.id,
        bill: true,
        code: IDGenerator(8),
        subtotal: this.billSummary.subtotal,
        calc: "Percent",
        percentage: 100,
        discount: 0.0,
        balance: 0.0,
        vat: this.billSummary.vat,
        total: this.billSummary.total,
        remark: "",
        date: this.today,
        part: true,
        system: LS.get("system"),
        customer: {
          code: this.searched.basic.code,
          name: this.searched.basic.name,
          gender: this.searched.basic.gender,
          dob: this.searched.basic.dob,
          mstatus: this.searched.basic.marital_status,
          email: this.searched.contact.email,
          phone: this.searched.contact.phone,
          address: this.searched.contact.address
        },
        type: this.transactions[0].id,
        items: this.bills,
        payment: []
      };
      LS.set("carts", this.carts);
      LS.set('pathUrl', 'account');
      //console.log(this.carts);
      this.$router.push("/sales/account");
    },
    updateQty: function(index, bill) {
      //console.log(bill)
      bill.total = parseInt(bill.qty) * parseFloat(bill.amount);
      this.bills[index] = bill;
      this.calculate();
    }
  },
  beforeMount() {
    this.checkStorage();
    this.setDomain();
    
    
  },
  mounted() {
    this.patientId =this.$route.params.patient;// LS.get("searched");
    setTimeout(this.loadPatient, 100);
    setTimeout(this.loadBills, 100);
  }
};
</script>
