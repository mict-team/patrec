<template>
  <div class="home-body">
    <v-card class="mfl" width="1160px">
      <v-card-title class="grey lighten-4 py-4 title">
        {{ patient.basic.code }}({{ patient.basic.name }})
      </v-card-title>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
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
            <v-flex row xs8>
              <v-tabs style="width:100%">
                <v-tab style="font-size:12px !important;"
                  ><v-icon style="font-size:12px !important;"
                    >child_friendly</v-icon
                  >Visits</v-tab
                >
                <v-tab style="font-size:12px !important;"
                  ><v-icon style="font-size:12px !important;"
                    >add_shopping_cart</v-icon
                  >Diagnosis</v-tab
                >
                <v-tab style="font-size:12px !important;"
                  ><v-icon style="font-size:12px !important;">map</v-icon
                  >Timeline</v-tab
                >
                <v-tab style="font-size:12px !important;"
                  ><v-icon style="font-size:12px !important;"
                    >local_hotel</v-icon
                  >Admission</v-tab
                >
                <v-tab style="font-size:12px !important;"
                  ><v-icon style="font-size:12px !important;"
                    >local_pharmacy</v-icon
                  >Prescription</v-tab
                >

                <v-tab-item>
                  <v-btn
                    class="blue"
                    style="position:absolute; left:84% !important; top:-50px;"
                    @click="revisit"
                    >Revisit</v-btn
                  >
                  <v-card tile style="width:100%">
                    <v-card-text>
                      <table class="table">
                        <thead>
                          <tr>
                            <th>OPD Number</th>
                            <th>Appointment Date</th>
                            <th>Consultant</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody v-if="patient.visit"></tbody>
                        <tr v-else>
                          <td colspan="4">
                            <v-flex xs12 style="text-align:center;">
                              <img src="../../assets/addnewitem.svg" />
                            </v-flex>
                          </td>
                        </tr>
                      </table>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-btn
                    class="blue"
                    style="position:absolute; left:77% !important; top:-50px;"
                    >Add diagnosis</v-btn
                  >
                  <v-card tile>
                    <v-card-text>
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Report Type</th>
                            <th>Report Date</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody v-if="patient.visit"></tbody>
                        <tr v-else>
                          <td colspan="4">
                            <v-flex xs12 style="text-align:center;">
                              <img src="../../assets/addnewitem.svg" />
                            </v-flex>
                          </td>
                        </tr>
                      </table>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-btn
                    class="blue"
                    style="position:absolute; left:80% !important; top:-50px;"
                    >Add Timeline</v-btn
                  >
                  <v-card tile>
                    <v-card-text>
                      <v-timeline
                        align-top
                        :dense="$vuetify.breakpoint.smAndDown"
                      >
                        <v-timeline-item
                          v-for="(item, i) in items"
                          :key="i"
                          :color="item.color"
                          :icon="item.icon"
                          fill-dot
                        >
                          <v-card :color="item.color" dark>
                            <v-card-title class="title"
                              >Lorem Ipsum Dolor</v-card-title
                            >
                            <v-card-text class="white text--primary">
                              <p>
                                Lorem ipsum dolor sit amet, no nam oblique
                                veritus. Commune scaevola imperdiet nec ut, sed
                                euismod convenire principes at. Est et nobis
                                iisque percipit, an vim zril disputando
                                voluptatibus, vix an salutandi sententiae.
                              </p>
                              <v-btn :color="item.color" class="mx-0" outlined>
                                Button
                              </v-btn>
                            </v-card-text>
                          </v-card>
                        </v-timeline-item>
                      </v-timeline>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-btn
                    class="blue"
                    style="position:absolute; left:80% !important; top:-50px;"
                    >Add Timeline</v-btn
                  >
                  <v-card tile>
                    <v-card-text>
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Date of Adm</th>
                            <th>Ward Admitted</th>
                            <th>No of Days Used</th>
                            <th>Date Discharge</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody v-if="patient.visit"></tbody>
                        <tr v-else>
                          <td colspan="4">
                            <v-flex xs12 style="text-align:center;">
                              <img src="../../assets/addnewitem.svg" />
                            </v-flex>
                          </td>
                        </tr>
                      </table>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-btn
                    class="blue"
                    style="position:absolute; left:80% !important; top:-50px;"
                    @click="prescribe"
                    >Add Prescription</v-btn
                  >
                  <v-card tile>
                    <v-card-text>
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Drug</th>
                            <th>Dosage</th>
                            <th>Instruction</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody v-if="patient.visit"></tbody>
                        <tr v-else>
                          <td colspan="4">
                            <v-flex xs12 style="text-align:center;">
                              <img src="../../assets/addnewitem.svg" />
                            </v-flex>
                          </td>
                        </tr>
                      </table>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="grey lighten-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="cancelSchedule">Cancel</v-btn>
        <v-btn @click="saveSchedule">Schedule Patient</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { STATE, LGAS } from "../../shared/state.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "DiagnosisReport",
  data: () => ({
    patient: [],
    payments: []
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
    cancelSchedule: function() {
      this.$router.push("/home");
    },
    saveSchedule: function() {}
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
  }
};
</script>
<style scoped></style>
