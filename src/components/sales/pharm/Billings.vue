<template>
  <v-container id="print-bill-area">
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title
        >{{ searched.basic.name }}({{ searched.basic.code }})
        prescribtion</v-toolbar-title
      >
      <v-spacer></v-spacer>
      &nbsp;&nbsp;&nbsp;
      <button class="btn btn-success no-print" @click="paynowHandler" :disabled="!isItemsPayable">Pay bill</button>
      &nbsp;&nbsp;&nbsp;
      <button class="btn btn-danger no-print" @click="printBill">Print bill</button>
    </v-toolbar>
    <v-card row wrap id="printDocArea">
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
                        <template v-for="(bill, index) in bills">
                          <tr :key="index" :style="!bill.inLocation? 'color:red':''">
                            <td>{{ index + 1 }}</td>
                            <td>{{ bill.name }}<br><span style="color: red;">({{bill.remark}}) <small v-if="!bill.inLocation">Out of stock</small></span></td>
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
                        </template>
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
    
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { URL, LS, APP, SHA256, IDGenerator, PrintPage } from "../../../shared/config.js";
export default {
  data: () => ({
    patientId:'',
    searched: [],
    location:[],
    bills: [],
    depts: [],
    dept: "",
    medical:"",
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
    source: String,
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
    isItemsPayable(){
      let index=this.bills.findIndex(x=>x.inLocation==true);
      if(index>-1){
        return true;
      }else{
        return false;
      }
    }
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
        medical: this.medical,
        patient: this.patientId,
        location: this.location.id,
        outlet: this.outlet.id,
        action:'loadInd'
      }
      this.post(`bills/patient/pharm`, payload)
      .then(resp => {
        if (resp.status > 0) {
          this.bills=resp.response;
          this.calculate();
        } else {
          this.$toastr.error("Search completed. No match found.");
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },

    calculate: function() {
      var sumup = new Promise(resolve => {
        var subtotal = 0;
        var paid=0;
        this.bills.forEach(w => {
          if(w.inLocation){
            subtotal += w["total"];
          }
          
        });
        resolve({subtotal, paid});
      });
      sumup.then(response => {
        this.billSummary.subtotal = response.subtotal;
        this.billSummary.paid = response.paid;
        this.billSummary.total = this.billSummary.subtotal+ this.billSummary.vat;//( - this.billSummary.paid)
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
        items: this.bills.filter(x=>x.inLocation==true),
        payment: []
      };
      LS.set("carts", this.carts);
      LS.set('pathUrl', 'pharmacy');
      //console.log(this.carts);
      this.$router.push("/sales/pharmacy");
    },
    updateQty: function(index, bill) {
      //console.log(bill)
      bill.total = parseInt(bill.qty) * parseFloat(bill.amount);
      this.bills[index] = bill;
      this.calculate();
    },
    printBill: function(){
      PrintPage('printDocArea')
    }
  },
  beforeMount() {
    this.checkStorage();
    this.setDomain();
    
    
  },
  mounted() {
    this.medical =this.$route.params.medical;// LS.get("searched");
    this.patientId =this.$route.params.patient;// LS.get("searched");
    this.location=LS.get('location')
    //alert(this.medical)
    setTimeout(this.loadPatient, 200);
    setTimeout(this.loadBills, 200);
  }
};
</script>
