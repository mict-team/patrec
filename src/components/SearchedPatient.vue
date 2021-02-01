<template>
  <v-container>
    <v-toolbar row wrap class="grey lighten-4">
        <v-toolbar-title>{{ patient.basic.name }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-title>Gender: {{ patient.basic.gender }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-title>Age: {{ patient.basic.dob|toAge }}yrs</v-toolbar-title>
        <v-spacer />
        <v-avatar
            size="80"
            class="mx-auto v-card--material__avatar elevation-6"
            color="grey"
            style="margin-top:80px;">
            <v-img :src="patient.identification.passport" />
        </v-avatar>
        <v-spacer />
        <v-toolbar-title>Status: {{ patient.basic.marital_status }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-title>Phone: {{ patient.contact.phone }}</v-toolbar-title>
        <v-spacer />
    </v-toolbar>
    <v-card>
        <v-container>
            <v-row>
                <v-col col="12" md="6">
                    <v-toolbar row wrap>
                        <v-toolbar-title>Visitation</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-col>
                <v-col col="12" md="6">
                    <v-toolbar row wrap>
                        <v-toolbar-title>Administration</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-col>
                <v-col col="12" md="6">
                    <v-toolbar row wrap>
                        <v-toolbar-title>Payments</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-col>
                <v-col col="12" md="6">
                    <v-toolbar row wrap>
                        <v-toolbar-title>Diagnosis</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-col>
                <v-col col="12" md="6">
                    <v-toolbar row wrap>
                        <v-toolbar-title>Prescriptions</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-col>
                <v-col col="12" md="6">
                    <v-toolbar row wrap>
                        <v-toolbar-title>Admission</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
  </v-container>
</template>
<script>
import { URL, LS, SHA256 } from "../shared/config.js";
import { STATE, LGAS } from "../shared/state.js";
import { mapState, mapActions } from "vuex";

export default {
  name: "Patient",

  data: () => ({
    addPrescription: false,
    payments: [],
    component: "",
    pat_id:'',
    patient: {
      basic: [],
      contact: [],
      nextOfKin: [],
      identity: [],
      medical: [],
      insurance: []
    }
  }),
  components: {},
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "search", "patients", "patCode", "today"])
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      var patient = LS.get("patient");
      this.patient = { ...patient };
      this.patient.basic = patient.basic || {};
      this.patient.contact = patient.contact || {};
      this.patient.nextOfKin = patient.nextOfKin || {};
      this.patient.identification = patient.identification || {};
      this.patient.medical = patient.medical || {};
      this.patient.insurance = patient.insurance || {};
      //console.log(this.patient)
    },
    loadPatientDetails(){
        this.get(`patients/search/${this.pat_id}`)
        .then(resp=>{
            let patient=resp.response;
            this.patient = { ...patient };
            this.patient.basic = patient.basic || {};
            this.patient.contact = patient.contact || {};
            this.patient.nextOfKin = patient.nextOfKin || {};
            this.patient.identification = patient.identification || {};
            this.patient.medical = patient.medical || {};
            this.patient.insurance = patient.insurance || {};
        })
    },
    loadPatientMedicalHistory(){

    },
    loadPatientPaymentHistory(){

    },
    loadPatientVisitationHistory(){

    },

    innerNavigate: function(title, uri) {
      this.component = title;
    }
  },
  mounted() {
    this.checkStorage();
    this.pat_id=LS.get('searched');
    this.loadPatientDetails();
    this.innerNavigate("Visits timelines", "timeline");
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
