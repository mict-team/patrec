<template>
  <div class="home-body">
    <v-card tile>
      <v-container grid-list-sm>
        <v-layout row wrap style="margin-right:-20px;">
          <v-flex row>
            <v-flex xs3 class="grey lighten-4">
              <v-flex style="text-align:center;">
                <v-avatar size="200px" circle>
                  <img
                    src="../../assets/no_image.png"
                    :alt="patient.basic.name"
                  />
                </v-avatar>
              </v-flex>
              <v-flex style="text-align:center;"
                ><h3>{{ patient.basic.name }}</h3></v-flex
              >
              <table class="table">
                <tr>
                  <td>Patient ID</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.basic.code }}
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
                    {{ patient.contact.phone }}
                  </td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.contact.email }}
                  </td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.contact.address }}
                  </td>
                </tr>
                <tr>
                  <td>Guardian Name</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.nextOfKin.name }}
                  </td>
                </tr>
                <tr>
                  <td>Guardian Contact</td>
                  <td align="right" style="color:#007FFF">
                    {{ patient.nextOfKin.phone }}
                  </td>
                </tr>
              </table>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs8>
              <v-flex xs12
                ><h4 class="header-text">{{ component }}</h4></v-flex
              >
              <v-divider></v-divider>
              <v-flex xs12 class="blue">
                <v-btn
                  style="font-size:12px !important; text-transformation: capitalize"
                  color="blue"
                  @click="innerNavigate('Patient Overview', '')"
                  ><v-icon style="font-size:12px !important;">home</v-icon
                  >Overview</v-btn
                >
                <v-btn
                  style="font-size:12px !important;"
                  color="blue"
                  @click="innerNavigate('Appointment details', 'appointment')"
                  ><v-icon style="font-size:12px !important;"
                    >child_friendly</v-icon
                  >Visits</v-btn
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
                  @click="innerNavigate('Visits timelines', 'timeline')"
                  ><v-icon style="font-size:12px !important;">map</v-icon
                  >Timeline</v-btn
                >
                <v-btn
                  style="font-size:12px !important;"
                  color="blue"
                  @click="innerNavigate('Admission details', 'admission')"
                  ><v-icon style="font-size:12px !important;"
                    >local_hotel</v-icon
                  >Admission</v-btn
                >
                <v-btn
                  style="font-size:12px !important;"
                  color="blue"
                  @click="innerNavigate('Patient precription', 'prescription')"
                  ><v-icon style="font-size:12px !important;"
                    >local_pharmacy</v-icon
                  >Prescription</v-btn
                >
              </v-flex>
              <br /><br />
              <v-flex xs12>
                <v-layout justify-left align-left style="margin-top:-50px;">
                  <router-view class="child-container"></router-view>
                </v-layout>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>
<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { STATE, LGAS } from "../../shared/state.js";
import axios from "axios";
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
      this.patient = LS.get("patient");
    },
    innerNavigate: function(title, uri) {
      // console.log(uri)
      // console.log(`path:patient/${uri}`);
      this.component = title;
      console.log(this.source);
      this.$router.push({ path: `/patient/${uri}` });
    }
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
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
