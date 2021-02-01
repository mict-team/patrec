<template>
  <v-container>
    <v-toolbar row wrap>
      <button type="button" class="btn btn-danger btn-back btn-small">
        <v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span>
      </button>
      <v-toolbar-title>{{ component }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs3 class="grey lighten-4">
            <v-flex style="text-align:center;">
              <v-avatar size="200px" circle>
                <img src="../assets/no_image.png" :alt="patient.basic.name" />
              </v-avatar>
            </v-flex>

            <v-flex style="text-align:center;"
              ><h3>{{ patient.basic.name }}</h3></v-flex
            >
            <v-flex>
              <table class="table">
                <tr>
                  <td>Patient ID</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.pat_code }}
                  </td>
                </tr>
                <tr>
                  <td>Age</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.basic.dob }}
                  </td>
                </tr>
                <tr>
                  <td>Gender</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.basic.gender }}
                  </td>
                </tr>
                <tr>
                  <td>Marital Status</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.basic.marital_status }}
                  </td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.contact ? patient.contact.phone : "" }}
                  </td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.contact ? patient.contact.email : "" }}
                  </td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.contact ? patient.contact.address : "" }}
                  </td>
                </tr>
                <tr>
                  <td>Guardian Name</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.nextOfKin ? patient.nextOfKin.name : "" }}
                  </td>
                </tr>
                <tr>
                  <td>Guardian Contact</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.nextOfKin ? patient.nextOfKin.phone : "" }}
                  </td>
                </tr>
              </table>
            </v-flex>
          </v-flex>
          <v-flex xs9>
            <v-flex xs12>
              <v-toolbar row wrap>
                <v-btn
                  style="font-size:12px !important;"
                  color="blue"
                  @click="innerNavigate('Visits timelines', 'timeline')"
                  ><v-icon style="font-size:12px !important;">map</v-icon
                  >Doctor's note</v-btn
                >

                <v-btn
                  style="font-size:12px !important;"
                  color="blue"
                  @click="innerNavigate('Appointment details', 'appointment')"
                  ><v-icon style="font-size:12px !important;"
                    >calendar_today</v-icon
                  >Schedule appointment</v-btn
                >

                <v-btn
                  style="font-size:12px !important;"
                  color="blue"
                  @click="innerNavigate('Patient Diagnosis', 'diagnosis')"
                  ><v-icon style="font-size:12px !important;"
                    >add_shopping_cart</v-icon
                  >Diagnosis</v-btn
                >

                <v-btn
                  style="font-size:12px !important;"
                  color="blue"
                  @click="innerNavigate('Patient precription', 'prescription')"
                  ><v-icon style="font-size:12px !important;"
                    >local_pharmacy</v-icon
                  >Prescription</v-btn
                >
              </v-toolbar>
            </v-flex>
            <v-flex xs12>
              <router-view />
            </v-flex>
          </v-flex>
        </v-layout>
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
    innerNavigate: function(title, uri) {
      this.component = title;
    }
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
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
