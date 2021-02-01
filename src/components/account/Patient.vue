<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title
        >{{ searched.basic.name }}({{ searched.basic.code }})
        bill</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <button class="btn btn-success" @click="editBill" v-if="!isBillOnEdit">Edit bill</button>
      <button class="btn btn-danger" @click="editBill" v-if="isBillOnEdit">Cancel</button>
      &nbsp;&nbsp;&nbsp;
      <button class="btn btn-success" @click="updateBill" v-if="isBillOnEdit">Update bill</button>
      &nbsp;&nbsp;&nbsp;
      <button class="btn btn-danger" @click="printBill">Print bill</button>
    </v-toolbar>
    <v-card row wrap id="printMe">
      <v-container grid-list-sm class="pa-4">
        <v-layout row>
            <v-flex xs3>
                <base-patient :patient="searched" />
                
              </v-flex>

              <v-flex xs9>
                  <v-card grid-list-sm class="pa-4">
                  <v-layout row wrap>
                      <v-flex xs12 id="print-bill-area">
                      <table class="table table-hover">
                          <thead>
                          <tr>
                              <th>SN</th>
                              <th>Dept</th>
                              <th>Item desc</th>
                              <th width="10%">Qty</th>
                              <th>Amount</th>
                              <th>Discount</th>
                              <th>Total</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(bill, index) in bills" :key="index">
                              <td>{{ index + 1 }}</td>
                              <td>{{ bill.dept }}</td>
                              <td>{{ bill.charge }}</td>
                              <td width="10%" v-if="isBillOnEdit">
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="bill.qty"
                                    @keyup="updateQty(index, bill)"
                                />
                              </td>
                              <td width="10%" v-else>{{bill.qty}}</td>
                              <td>{{ bill.amount | toDecimal }}</td>
                              <td width="10%" v-if="isBillOnEdit">
                                <input
                                  type="text"
                                  class="form-control"
                                  v-model="bill.discount"
                                  @keyup="updateDiscount(index, bill)"
                                />
                              </td>
                              <td width="10%" v-else>{{bill.discount}}</td>
                              <td>{{ bill.total | toDecimal }}</td>
                              
                          </tr>
                          </tbody>
                          <tfoot>
                          <tr>
                              <th colspan="6" style="text-align:right">Subtotal</th>
                              <th>{{ billSummary.subtotal | toDecimal }}</th>
                          </tr>
                          <tr>
                              <th colspan="6" style="text-align:right">Discount</th>
                              <th>{{ billSummary.discount | toDecimal }}</th>
                          </tr>
                          <tr>
                              <th colspan="6" style="text-align:right">VAT</th>
                              <th>{{ billSummary.vat | toDecimal }}</th>
                          </tr>

                          <tr style="font-size:30px;">
                              <th colspan="6" style="text-align:right;">Total</th>
                              <th>{{ billSummary.total | toDecimal }}</th>
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
    
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { URL, LS, APP, SHA256, IDGenerator } from "../../shared/config.js";
export default {
  data: () => ({
    patientId:'',
    searched: [],
    bills: [],
    depts: [],
    dept: "",
    edit_bill: false,
    bill_dialog: false,
    searchStr: "",
    charges: [],
    carts: [],
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
    ]),
    isBillOnEdit(){
      return this.edit_bill;
    }
  },
  methods: {
    ...mapActions(["getToday", "setDomain", "checkStorage"]),
    goBack: function() {
      this.$router.go(-1);
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
      let payload={
        patient:this.patientId,
        outlet: this.outlet.id,
        action:'loadInd'
      }
      this.post(`/bills/patient/account`, payload)
      .then(resp => {
        if (resp.status > 0) {
          resp.response.forEach(x => {
            x.qty = parseInt(1);
            x.total = (parseInt(x.qty) * parseFloat(x.amount))-parseFloat(x.discount);
            x.remove = false;
            this.bills.push(x);
          });
          this.calculate();
        } else {
          this.$toastr.error(resp.message);
        }
      });
    },

    editBill: function(){
      this.edit_bill=!this.edit_bill;
    },
    
    printBill: function() {
      //window.print("printMe");
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"],link[rel="preload"], style')
      ]) {
        stylesHtml += node.outerHTML;
      }

      const prtHtml = document.getElementById('printMe').innerHTML;
      var content = `<!DOCTYPE html>
                <html>
                <head>
                    ${stylesHtml}
                </head>
                <body>
                    ${prtHtml}
                </body>
                </html>`;
      document.write(content)
      print();
      document.close();
    },
  
    calculate: function() {
      var sumup = new Promise(resolve => {
        var subtotal = 0;
        var discount = 0;
        this.bills.forEach(w => {
          subtotal += w["total"];
          discount += w["discount"];
        });
        resolve({subtotal, discount});
      });
      sumup.then(response => {
        console.log(response)
        this.billSummary.subtotal = response.subtotal;
        this.billSummary.discount = response.discount;
        this.billSummary.total = this.billSummary.subtotal + this.billSummary.vat;
      });
    },
    updateQty: function(index, bill) {
      //console.log(bill)
      bill.total = parseInt(bill.qty) * parseFloat(bill.amount);
      this.bills[index] = bill;
      this.calculate();
    },
    updateDiscount: function(index, bill){
      bill.total = (parseInt(bill.qty) * parseFloat(bill.amount))-parseFloat(bill.discount);
      this.bills[index] = bill;
      this.calculate();
    },
    updateBill: function(){
      this.$Progress.start();
      let payload={
        bills: this.bills,
        patient: this.patientId,
        action: "update"
      }
      this.post(`/bills/patient/account`, payload)
      .then(resp => {
        if (resp.status > 0) {
          this.editBill();
          this.$toastr.success(resp.message);
        } else {
          this.$toastr.error(resp.message);
        }
      })
      .finish(()=>{
        this.$Progress.finish();
      });
    }
  },
  beforeMount() {
    this.checkStorage();
    this.setDomain();
  },
  mounted() {
    this.patientId =this.$route.params.patient;// LS.get("searched");
    setTimeout(this.loadPatient, 200);
    setTimeout(this.loadBills, 200);
  }
};
</script>
