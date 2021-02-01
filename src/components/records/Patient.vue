<template>
  <v-container>
    <v-card>
      <v-card-title class="grey lighten-4 py-4 title">
        <v-btn color="red" @click="$router.go(-1)" white-text
          ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
        >
        <v-toolbar-title
          >{{ patient.basic.name }}--<span style="color:blue;">{{
            patient.basic.code
          }}</span></v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn
          class="primary"
          :disabled="saved"
          @click="saveSchedule"
          v-if="!processing"
          >Schedule Patient</v-btn
        >
        <v-btn :disabled="saved" v-else>
          <v-progress-circular
            class="pa-4"
            :size="30"
            color="white"
            indeterminate
          ></v-progress-circular>
        </v-btn>
      </v-card-title>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex row>
            <v-flex xs3 class="grey lighten-4 ">
              <base-profile-panel :patient="patient" />
            </v-flex>

            <v-flex xs9 row>
              <v-flex xs11 row class="ml-10">
                <v-flex xs12>
                  <table class="table table-bordered ">
                    <tr>
                      <td>
                        <label>Height</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="patient.medical.height"
                          readonly
                        />
                      </td>
                      <td>
                        <label>Blood Group</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="patient.medical.blood_group"
                          readonly
                        />
                      </td>
                      <td>
                        <label>Genotype</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="patient.medical.genotype"
                          readonly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <label>Allergies</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="patient.medical.allergy"
                          readonly
                        />
                      </td>
                    </tr>
                  </table>
                </v-flex>
                <v-flex xs12 v-if="message.error">
                  <div class="alert alert-success" v-if="message.status == 1">
                    {{ message.desc }}
                  </div>
                  <div class="alert alert-danger" v-else>
                    {{ message.desc }}
                  </div>
                </v-flex>
                <v-flex xs12>
                  <label>Appointment Date</label>
                  <v-menu
                    v-model="modalApp"
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
                        v-model="appointment.date"
                        placeholder="Date of appointment"
                        v-on="on"
                        readonly
                      />
                    </template>
                    <v-date-picker
                      v-model="appointment.date"
                      @input="modalApp = false"
                      :landscape="true"
                      :relative="true"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>

                <v-flex xs6>
                  <label>Old Patient?</label>
                  <select
                    class="form-control select2me"
                    v-model="appointment.oldPatient"
                  >
                    <option value="false">New Patient</option>
                    <option value="true">Old Patient</option>
                  </select>
                </v-flex>
                <v-flex xs6>
                  <label>Patient type</label>
                  <select
                    class="form-control select2me"
                    v-model="appointment.patientType"
                  >
                    <option value="">..select</option>
                    <option value="false">Walk in</option>
                    <option value="true">Transfered</option>
                  </select>
                </v-flex>

                <v-flex xs6>
                  <label>Consulting Dept</label>
                  <v-select
                    v-model="appointment.dept"
                    :items="departments"
                    item-text="name"
                    item-value="id"
                    label="Select department"
                    dense
                    outlined
                    @change="selectConsultingDeptEvent"
                  ></v-select>
                  
                </v-flex>
                <v-flex xs6>
                  <label>Consulting Doctor</label>
                  <v-select
                    v-model="appointment.doctor"
                    :items="doctors"
                    item-text="name"
                    item-value="id"
                    label="Select doctor"
                    :disabled="!doctors"
                    dense
                    outlined
                  ></v-select>
                  
                </v-flex>

                <v-flex xs12>
                  <label width="100%">Charges(<small style="color:red; cursor: pointer;" @click="loadCharges(users.department)">Load bills from Records</small>)</label>
                  <base-mict-combo-box :items="getCharges" @select="selectCharge" />
                </v-flex>
                <v-flex xs12>
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Desc</th>
                        <th>Qty</th>
                        <th>Amount</th>
                        <th>Total</th>
                        <th width="2%"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(b, index) in getBillsItems" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ b.name }}</td>
                        <td>1</td>
                        <td>{{ b.amount }}</td>
                        <td>{{ b.amount * 1 | toDecimal}}</td>
                        <td class="red"><v-icon class="white--text" @click="removeItem(b)">delete</v-icon></td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colspan="4" style="text-align: right;">Payable</th>
                        <th>{{ getChargeTotal | toDecimal }}</th>
                        <th></th>
                      </tr>
                    </tfoot>
                  </table>
                </v-flex>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { STATE, LGAS } from "../../shared/state.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
  name: "Patient",

  data: () => ({
    processing: false,
    addPrescription: false,
    payments: [],
    component: "",
    message: {
      status:0,
      error: false,
      status: 0,
      desc: ""
    },
    appointment: {
      outlet: "",
      patient: 0,
      date: "",
      oldPatient: false,
      patientType: "",
      dept: "",
      doctor: "",
      payments: []
    },
    allDept: [],
    departments: [],
    filterdoctors: [],
    doctors: [],
    charge: "",
    charges: [],
    filtercharges: [],
    modalApp: false,
    saved: false,
    patient: {
      basic: [],
      contact: [],
      nextOfKin: [],
      identity: [],
      medical: [],
      insurance: []
    },
    bill: []
  }),
  components: {},
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet", "users", "search", "patients", "group", "users"]),
    getChargeTotal() {
      return this.appointment.payments.reduce(function(sum, b) {
        //console.log(sum + (1 * b.amount))
        return (sum + (1 * b.amount));
      }, 0);
    },
    getBillsItems(){
      return this.appointment.payments
    },
    getCharges(){
      return this.charges;
    }
  },
  methods: {
    ...mapActions(["setSearch", "checkStorage"]),
    innitialize: function() {
      this.$Progress.start();
      var pat = LS.get("searched");
      this.get(`/patients/search/${pat}`)
      .then(resp => {
        this.patient = resp.response;
      })
      .finally(()=>{
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        this.appointment.date=`${yyyy}-${mm}-${dd}`;
        this.$Progress.finish();
      });
    },
    innerNavigate: function(title, uri) {
      // console.log(uri)
      // console.log(`path:patient/${uri}`);
      this.component = title;
      this.$router.push({ path: `/patient/${uri}` });
    },
    loadDept: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        has_clinic: 1,
        action: 'loads'
      }
      this.post("/dept", payload)
      .then(response => {
        if (response.status > 0) {
          this.departments = response.response;
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    selectConsultingDeptEvent: function() {
      this.loadDoctors();
      this.loadCharges(this.appointment.dept);
    },
    loadDoctors: function() {
      this.$Progress.start();
      let payload={
        page:0,
        outlet: this.outlet.id,
        group: this.group.structure,
        dept: this.appointment.dept,
        action:'loads'
      }
      this.post('users', payload)
      .then(response => {
        if (response.status > 0) {
          this.doctors = response.response.result;
        }
      })
      .finally(()=>{
        console.log(this.doctors)
        this.$Progress.finish();
      });
    },
    loadCharges: function(dept) {
      this.$Progress.start();
      let payload={
        page:0,
        dept: dept,
        outlet: this.outlet.id,
        action:'loads'
      }
      this.post(`/charges`, payload)
      .then(response => {
        
        if (response.status > 0) {
          console.log(response.response)
          this.charges=response.response.result;
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    selectCharge: function(charge){
      this.appointment.payments.push(charge.item);
      //console.log(this.appointment.payments)
    },
    checkCharge: function() {
      this.appointment.payments = this.charge;
    },
    saveSchedule: function() {
      this.$Progress.start();
      this.processing = true;
      this.appointment.patient = this.patient.id;
      this.appointment.outlet = this.outlet.id;
      this.appointment.user = this.users.id;
      //this.appointment.bill = this.bill;
      this.post("/schedule", this.appointment)
      .then(response => {
        this.message.status = response.status;
        if (response.status > 0) {
          this.message.desc = `Patient ${this.patient.basic.name} has been schedule for treatment`;
          this.message.error=true
          this.$toastr.success(this.message.desc)
          this.saved = true;
        } else {
          this.$toastr.error(response.message)
          this.message.error=true
          this.message.desc = response.message; //"Sorry, error occured while scheduling patient for treatment.";
        }
      })
      .finally(() => {
        this.processing = false;
        this.$Progress.finish();
      });
    },
    cancelSchedule: function() {
      this.$router.push("/home");
    },
    addToBill: function(charge) {
      if (!charge) {
        return;
      }
      let index = this.bill.findIndex(x => x.id == charge.id);
      if (index > -1) {
        this.bill[index]["qty"] += 1;
        this.bill[index]["total"] =
          this.bill[index]["qty"] + this.bill[index]["amount"];
      } else {
        this.bill.push(charge);
      }
    },
    removeItem: function(item){
      let index=this.appointment.payments.findIndex(x=>x.id=item.id);
      if(index>-1){
        this.appointment.payments.splice(index,1);
      }
    }
  },
  mounted() {
    this.checkStorage();
    this.innitialize();
    this.loadDept();
    //this.loadDoctors();
    let vm=this;
    setTimeout(function(){
      let user=LS.get('user');
      vm.loadCharges(user.department);
    }, 200)
    
  }
};
</script>
<style scoped>
.child-container {
  width: 100% !important;
  margin: 5px 0px 0px -20px;
  padding: 0px !important;
  background-color: #fff;
}
.right {
  color: blue;
  text-align: right;
}
.header-text {
  font-size: 20px;
  font-weight: bold;
  color: grey;
}
</style>
