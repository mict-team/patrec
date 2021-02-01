<template>
  <div>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title>{{ patient.basic.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="patient.insurance.no" style="color:red;"
        >Insurance No: {{ patient.insurance.no }}</span
      >
      <v-spacer></v-spacer>
      <v-btn class="danger" v-if="isPatientSchedule" @click="takeNote">Take note</v-btn>
      <v-btn class="danger" v-if="onAdmission" @click="dischargeDialog = true"
        >Discharge patient</v-btn
      >
      <v-spacer></v-spacer>
      <v-toolbar-title>{{ component }}</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm>
        <v-row>
          <v-col cols="12" md="3" class="grey lighten-4 scroller">
            <base-profile-panel :patient="patient" />
          </v-col>
          <v-col cols="12" md="9">
            <v-toolbar row wrap>
              <v-btn
                style="font-size:12px !important;"
                class="primary"
                @click="innerNavigate('Patient Overview', 'phome')"
                ><v-icon>home</v-icon>Overview</v-btn
              >
              <v-btn
                style="font-size:12px !important;"
                class="primary"
                @click="innerNavigate('Medical history', 'phistory')"
                ><v-icon>child_friendly</v-icon>History</v-btn
              >
              <v-btn
                style="font-size:12px !important;"
                class="primary"
                @click="innerNavigate('Appointment', 'pappointment')"
                ><v-icon>calendar_today</v-icon>Appointments</v-btn
              >
              <v-spacer></v-spacer>

              <v-btn
                class="danger"
                @click="bookAppointment"
                title="Schedule an appointment"
                ><v-icon>calendar_today</v-icon>Book appointment
              </v-btn>
            </v-toolbar>

            <v-flex xs12>
              <v-layout>
                <router-view />
              </v-layout>
            </v-flex>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-btn fab bottom right color="blue" dark fixed @click="takeNote" style="z-index:9999999;" title="Diagonise patient" v-if="isPatientSchedule">
      <v-icon v-if="updatePatientNote">edit</v-icon>
      <v-icon v-else>notes</v-icon>
    </v-btn>
    <v-dialog v-model="dischargeDialog" left top persistent width="500px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Request discharge
          <v-spacer></v-spacer>
          <v-btn @click="dischargeDialog = false">Cancel</v-btn>
          <v-btn class="primary" @click="dischargePatient">Continue</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12>
              <v-switch
                label="Is patient discharge against medical advice(DAMA)?"
                :value="true"
                :input-value="discharge.dama"
                @change="toggle($event !== null, $event)"
              />
            </v-flex>
            <v-flex xs12>
              Are you sure your patient is ready for discharge? If yes, medical
              bill will be created for patient now.
            </v-flex>
            <v-flex
              xs12
              class="red"
              v-if="settings.general.pay_before_service == 1"
            >
              Untill patient pays, he/she cannot be discharged. Thank you.
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <!--v-dialog v-model="newAppointment" left top width="700px">
      <Appointment
        :patient="patient.basic.name"
        @closePage="closePage"
        @bookAppointment="bookAppointment"
      />
    </v-dialog-->
  </div>
</template>
<script>
import { URL, LS, SHA256 } from "../shared/config.js";
import { STATE, LGAS } from "../shared/state.js";
import { mapState, mapActions } from "vuex";
import Appointment from "./shared/Appointment";
export default {
  name: "Patient",

  data: () => ({
    addPrescription: false,
    dischargeDialog: false,
    isAppointment: true,
    newAppointment: false,
    onAdmission: false,
    dept: [],
    updatePatientNote: false,
    discharge: {
      outlet: "",
      patient: "",
      dama: false,
      remark: ""
    },
    patientID:'',
    payments: [],
    component: "",
    schedule: [],
    patient: {
      basic: [],
      contact: [],
      nextOfKin: [],
      identity: [],
      medical: [],
      insurance: []
    },
    medical: 0
  }),
  components: {
    Appointment
  },
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "search", "settings"]),
    isPatientSearched(){
      return this.schedule.patient_id==this.patientID;
    },
    isPatientSchedule(){
      if(this.schedule.id){
        return true;
      }else if(this.onAdmission){
        return true;
      }else{
        return false;
      }
    }
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      //console.log(this.settings)
      //this.schedule = LS.get("schedule");
      this.dept = LS.get("departments");
      this.updatePatientNote = LS.get("inconclusive") || false;
      setTimeout(this.loadPatient, 100);
      setTimeout(this.checkIfPatientStartMedical, 100);
      setTimeout(this.checkIfAdmitted, 100);
      //alert(JSON.stringify(this.schedule))
    },
    toggle: function(value, event) {
      this.diagnosis.dama = value;
    },
    goBack: function() {
      this.$router.go(-1);
    },
    closePage: function(status) {
      this.newAppointment = false;
    },

    bookAppointment: function(){
      LS.set('bookpatient', this.patient);
      this.$router.push({name:'bookpappointment'});
    },
    checkIfPatientStartMedical: function() {
      this.get(`/patients/isOnMedical/${this.patientID}`).then(
        resp => {
          if (resp.status > 0) {
            this.schedule=resp.response;
            //LS.set('admission', resp.response.id);
          }else{
            this.schedule=[];
          }
        }
      );
    },
    checkIfAdmitted: function() {
      this.get(`/patients/isAdmitted/${this.patientID}`).then(
        resp => {
          if (resp.status > 0) {
            this.onAdmission = resp.response.admitted;
            this.medical = resp.response.medical;
          }
        }
      );
    },
    loadPatient: function() {
      this.$Progress.start();
      this.get(`/patients/search/${this.patientID}`)
      .then(resp => {
        if (resp.status > 0) {
          this.patient = resp.response;
          LS.set("patient", this.patient);
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },
    innerNavigate: function(title, uri) {
      this.component = title;
      this.$router.push({ name: uri, id: this.patientID });
    },
    takeNote: function() {
      LS.remove("saved");
      LS.set('schedule', this.patientID)
      LS.set('admission', this.schedule.id)
      this.$router.push({ path: `/doctors-note` });
    },

    dischargePatient: function() {
      if (
        this.settings.general.pay_before_service &&
        this.settings.general.pay_before_service == 1
      ) {
        this.$Progress.start();
        this.createMedicalBill()
          .then(resp => {
            if (resp) {
              this.$toastr.success(
                `${this.patient.basic.name} has been discharged.`
              );
            } else {
              this.$toastr.error(
                `${this.patient.basic.name} medical detail has been saved but cannot create bill for discharge.`
              );
            }
          })
          .finally(() => {
            this.$Progress.finish();
          });
      } else {
        LS.set("pat_medical", this.medical);

        this.$router.push("/payment-bill");
      }
    }
  },
  beforeMount() {
    this.checkStorage();
  },
  mounted() {
    this.patientID=this.$route.params.id;
    this.innitialize();
    
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
