<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="goBack"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title
        >{{ searched.basic.name }}({{ searched.basic.code }})
        bill</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn class="primary" @click="addCharges">Add charges</v-btn>
      <v-btn class="primary" @click="createMedicalBill">Save bill</v-btn>
      <v-btn class="primary" @click="paynowHandler">Pay now</v-btn>
      <v-btn class="danger" @click="printBill">Print</v-btn>
    </v-toolbar>
    <v-card row wrap>
      <v-container grid-list-sm class="pa-4">
        <v-layout row>
          <div class="alert alert-info">
            <v-flex xs12>
              <pre>
Date of Admission: {{ admission.date_of_admission }}     Date of discharge: {{
                  admission.date_of_discharge
                }}     Days: {{ bill_days }}</pre
              >
            </v-flex>
          </div>
          <v-flex xs12>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Item desc</th>
                  <th width="10%">Qty</th>
                  <th>Amount</th>
                  <th>Total</th>
                  <th width="5%"></th>
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
                      @keyup="updateQty(index, bill)"
                    />
                  </td>
                  <td>{{ bill.amount | toDecimal }}</td>
                  <td>{{ bill.total | toDecimal }}</td>
                  <td width="5%">
                    <v-icon v-if="bill.remove" @click="removeCharge(index)"
                      >delete_forever</v-icon
                    >
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="4" style="text-align:right">Subtotal</th>
                  <th>{{ billSummary.subtotal | toDecimal }}</th>
                  <th></th>
                </tr>
                <tr>
                  <th colspan="4" style="text-align:right">VAT</th>
                  <th>{{ billSummary.vat | toDecimal }}</th>
                  <th></th>
                </tr>

                <tr style="font-size:30px;">
                  <th colspan="4" style="text-align:right;">Total</th>
                  <th>{{ billSummary.total | toDecimal }}</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
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
        <v-toolbar row wrap class="grey lighten-4 py-4 title">
          Charges
          <v-spacer></v-spacer>
          <v-text-field
            solo-inverted
            hide-details
            prepend-inner-icon="search"
            label="Search for charge"
            class="hidden-sm-and-down"
            style="width: 200px; margin-top:-20px;"
            v-model="searchStr"
            @keyup="putSearch"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="danger" @click="bill_dialog = false">Add</v-btn>
        </v-toolbar>

        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap style="text-align:center">
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
    <v-dialog v-model="print_preview" hide-overlay width="830px">
      <v-card align-center ref="printPage">
        <v-toolbar row wrap class="grey lighten-4 py-4 title">
          {{ searched.basic.name }}({{ searched.basic.code }}) bill
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap style="text-align:center">
            <v-flex xs12>
              <pre>
Date of Admission: {{ admission.date_of_admission }}     Date of discharge: {{
                  admission.date_of_discharge
                }}     Days: {{ bill_days }}</pre
              >
            </v-flex>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Item desc</th>
                  <th width="10%">Qty</th>
                  <th>Amount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(bill, index) in bills" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ bill.name }}</td>
                  <td width="10%">{{ bill.qty }}</td>
                  <td>{{ bill.amount | toDecimal }}</td>
                  <td>{{ bill.total | toDecimal }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="4" style="text-align:right">Subtotal</th>
                  <th>{{ billSummary.subtotal | toDecimal }}</th>
                </tr>
                <tr>
                  <th colspan="4" style="text-align:right">VAT</th>
                  <th>{{ billSummary.vat | toDecimal }}</th>
                </tr>

                <tr style="font-size:30px;">
                  <th colspan="4" style="text-align:right;">Total</th>
                  <th>{{ billSummary.total | toDecimal }}</th>
                </tr>
              </tfoot>
            </table>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { URL, LS, APP, SHA256, IDGenerator } from "../../shared/config.js";
export default {
  data: () => ({
    searched: [],
    bills: [],
    bill_days: 0,
    paynow_dialog: false,
    bill_dialog: false,
    print_preview: false,
    searchStr: "",
    charges: [],
    carts: [],
    admission: [],
    filterCharges: [],
    billSummary: {
      subtotal: 0.0,
      vat: 0.0,
      discount: 0.0,
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
    admissionDetail: function() {
      var schedule = LS.get("pat_medical");
      this.get(`/patient/admission/${schedule}`).then(resp => {
        if (resp.status > 0) {
          this.admission = resp.response;
          let process = new Promise((resolve, reject) => {
            if (this.admission.date_of_discharge == null) {
              var today = new Date();
              // var date = String(today.getFullYear()).padStart(2, "0")+'-'+String((today.getMonth()+1)).padStart(2, "0")+'-'+String(today.getDate()).padStart(2, "0");
              // var time = String(today.getHours()).padStart(2, "0") + ":" + String(today.getMinutes()).padStart(2, "0") + ":" + String(today.getSeconds()).padStart(2, "0");
              //today = date + " " + time;
              resolve(today);
            } else {
              reject(false);
            }
          });
          process.then(today => {
            if (today) {
              var date =
                String(today.getFullYear()).padStart(2, "0") +
                "-" +
                String(today.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(today.getDate()).padStart(2, "0");
              var time =
                String(today.getHours()).padStart(2, "0") +
                ":" +
                String(today.getMinutes()).padStart(2, "0") +
                ":" +
                String(today.getSeconds()).padStart(2, "0");

              this.admission.date_of_discharge = date + " " + time;
              var date1 = new Date(this.admission.date_of_admission);
              var Difference_In_Time = today.getTime() - date1.getTime();
              console.log(Difference_In_Time);
              this.bill_days = parseInt(
                Difference_In_Time / (1000 * 3600 * 24)
              );
            }
          });
        }
      });
    },
    loadBills: function() {
      this.get(`/bills/create/${this.searched.id}`)
        .then(resp => {
          if (resp.status > 0) {
            if (resp.response.length > 0) {
              resp.response.forEach(x => {
                x.qty = parseInt(1);
                x.total = parseInt(x.qty) * parseFloat(x.amount);
                x.remove = false;
                this.bills.push(x);
              });
              this.calculate();
            }
          } else {
            this.$toastr.error("Search completed. No match found.");
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    addCharges: function() {
      this.get("/charges")
        .then(resp => {
          if (resp.status > 0) {
            this.charges = resp.response;
            this.filterCharges = this.charges;
            this.bill_dialog = true;
          } else {
            this.$toastr.error("Sorry, couldnt load charges");
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    removeCharge: function(index) {
      this.bills.splice(index, 1);
      this.calculate();
    },
    printBill: function() {
      this.print_preview = true;
      this.$print(this.$refs["printPage"]);
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
      this.filterCharges = this.charges.filter(item => {
        return (
          item.name.toLowerCase().includes(this.searchStr.toLowerCase()) ||
          item.dept.toLowerCase().includes(this.searchStr.toLowerCase())
        );
      });
    },
    calculate: function() {
      var sumup = new Promise(resolve => {
        var subtotal = 0;
        this.bills.forEach(w => {
          subtotal += w["total"];
        });
        resolve(subtotal);
      });
      sumup.then(response => {
        this.billSummary.subtotal = response;
        this.billSummary.total =
          this.billSummary.subtotal + this.billSummary.vat;
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
        type: this.transactions[0],
        items: this.bills,
        payment: []
      };
      LS.set("carts", this.carts);
      //console.log(this.carts);
      this.$router.push("/almona");
    },
    createMedicalBill: function() {
      var user = LS.get("user");
      var payload = {
        patient: this.searched.id,
        medical: LS.get("pat_medical"),
        admission: this.admission.date_of_admission,
        discharge: this.admission.date_of_discharge,
        days: this.bill_days,
        subtotal: this.billSummary.subtotal,
        total: this.billSummary.total,
        vat: this.billSummary.vat,
        bills: this.bills,
        user: user.code
      };
      console.log(payload);
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
    this.searched = LS.get("searched");
  },
  mounted() {
    this.admissionDetail();
    this.loadBills();
  }
};
</script>
