<template>
  <div>
    <v-toolbar row wrap>
      <button
        type="button"
        class="btn btn-danger btn-back btn-small"
        @click="cancelNote"
      >
        <v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span>
      </button>
      <v-toolbar-title
        >Medical report for {{ patient.basic.name }}</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn class="danger"><v-icon>mdi-printer</v-icon> Print</v-btn>
      <v-btn class="danger"><v-icon>mdi-note</v-icon>PDF</v-btn>
    </v-toolbar>
    <v-card>
      <v-row>
        <v-col cols="12" md="12" class="grey lighten-4">
          
        </v-col>
        <v-col cols="12" md="11" class="ml-10">
          <v-stepper v-model="e1" :alt-labels="altLabels">
            <template>
              <v-stepper-header>
                <template v-for="n in steps">
                  <v-stepper-step
                    :key="`${n}-step`"
                    :complete="e1 > n"
                    :step="n"
                    :editable="editable"
                  >
                    Day {{ n }}
                  </v-stepper-step>

                  <v-divider v-if="n !== steps" :key="n"></v-divider>
                </template>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content
                  v-for="n in steps"
                  :key="`${n}-content`"
                  :step="n"
                >
                  <v-flex xs12>
                    <template v-if="medical[dates[n - 1]].medical">
                      <v-sheet
                        class="pa-4 text-center"
                        tile
                        v-if="medical[dates[n - 1]].medical"
                        >
                        <v-row class="mb-2 grey lighten-4">
                          <v-col class="grey--text text--darken">
                            <label>Body emperature</label><br />
                            {{
                              medical[dates[n - 1]].medical.vital.temperature
                            }}
                          </v-col>
                          <v-col class="grey--text text--darken">
                            <label>Pulse rate</label><br />
                            {{ medical[dates[n - 1]].medical.vital.pulserate }}
                          </v-col>
                          <v-col class="grey--text text--darken">
                            <label>Respiratory rate</label><br />
                            {{
                              medical[dates[n - 1]].medical.vital.respiratory
                            }}
                          </v-col>
                          <v-col class="grey--text text--darken">
                            <label>Blood pressure</label><br />
                            {{
                              medical[dates[n - 1]].medical.vital.bloodpressure
                            }}
                          </v-col>
                        </v-row>
                        <v-row class="mb-4 text-left">
                          <v-col cols="12" md="12" class="grey--text text--darken">
                            <label>Nurse: </label>
                            {{ medical[dates[n - 1]].medical.nurse }}
                          </v-col>
                          <v-col cols="12" md="12" class="grey--text text--darken">
                            <label>Comment: </label>
                            {{ medical[dates[n - 1]].medical.remark }}
                          </v-col>
                        </v-row>
                      </v-sheet>
                    </template>
                    <template>
                      <v-sheet
                        class="pa-4 text-left"
                        tile
                        v-if="medical[dates[n - 1]].administer"
                        >
              
                        <v-row class="mb-2 grey lighten-4">
                          <v-col cols="12" md="2">Symptons: </v-col>
                          <v-col cols="12" md="10">{{
                            medical[dates[n - 1]].administer.complains
                          }}</v-col>
                        </v-row>
                        <v-row class="mb-2 grey lighten-4">
                          <v-col cols="12" md="2">Clinical: </v-col>
                          <v-col cols="12" md="10">{{
                            medical[dates[n - 1]].administer.clinical
                          }}</v-col>
                        </v-row>

                        <v-row class="mb-2 grey lighten-4">
                          <v-col cols="12" md="2">Diagnosis: </v-col>
                          <v-col cols="12" md="10">{{
                            medical[dates[n - 1]].administer.observation
                          }}</v-col>
                        </v-row>
                        <v-row class="mb-2 grey lighten-4">
                          <v-col cols="12" md="2">Short summary: </v-col>
                          <v-col cols="12" md="10">{{
                            medical[dates[n - 1]].administer.remark
                          }}</v-col>
                        </v-row>
                      </v-sheet>

                      <v-flex xs12 v-if="medical[dates[n - 1]].tests">
                        <v-flex><h4>Lab test requests</h4></v-flex>
                        <table class="table table-stripped">
                          <thead>
                            <tr>
                              <th>SN</th>
                              <th width="20%">Lab.</th>
                              <th width="20%">Name</th>
                              <th width="20%">Doctor</th>
                              <th>Date</th>
                              <th>Result</th>
                              <th>Done by</th>
                              <th>On</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(item, index) in medical[dates[n - 1]]
                                .tests"
                              :key="index"
                            >
                              <td>{{ index + 1 }}</td>
                              <td>{{ item.dept }}</td>
                              <td>{{ item.test }}</td>
                              <td>{{ item.doctor }}</td>
                              <td>{{ item.date_of_request }}</td>
                              <td>
                                <span
                                  v-if="item.test_result == null"
                                  class="red"
                                  >Not available</span
                                >
                                <span v-else class="successs">{{
                                  item.test_result
                                }}</span>
                              </td>
                              <td>{{ item.technician }}</td>
                              <td>{{ item.date_of_result }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </v-flex>
                      <v-flex xs12 v-else>
                        <div class="alert alert-danger">
                          No test recommended for patient on this date
                        </div>
                      </v-flex>

                      <v-flex xs12 v-if="medical[dates[n - 1]].drugs">
                        <v-flex><h4>Precriptions</h4></v-flex>
                        <table class="table table-stripped">
                          <thead>
                            <tr class="grey lighten-4">
                              <th>SN</th>
                              <th width="10%">By</th>
                              <th width="50%">Name</th>
                              <th width="50%">Note</th>
                              <th width="10%">Pharmacist</th>
                              <th width="10%">Bought?</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(item, index) in medical[dates[n - 1]]
                                .drugs"
                              :key="index"
                            >
                              <td>{{ index + 1 }}</td>
                              <td>{{ item.doctor }}</td>
                              <td>{{ item.drug }}</td>
                              <td>
                                {{ item.remark == null ? "" : item.remark }}
                              </td>
                              <td>{{ item.pharmacist }}</td>
                              <td>
                                <span v-if="item.status == 0" class="red"
                                  >Not used</span
                                >
                                <span v-else>Bought</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </v-flex>
                      <v-flex xs12 v-else>
                        <div class="alert alert-danger">
                          No drug prescribed for patient on this date
                        </div>
                      </v-flex>
                    </template>
                  </v-flex>

                  <v-btn color="primary" @click="nextStep(n)">
                    {{ dates[n - 1] }}<v-icon>double_arrow</v-icon>
                  </v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </template>
          </v-stepper>
        </v-col>
      </v-row>
    </v-card>
    <v-btn
      fab
      bottom
      right
      color="blue"
      dark
      fixed
      @click="takeNote"
      style=""
      title="Register patient"
      ><v-icon>notes</v-icon></v-btn
    >
  </div>
</template>
<script>
import { URL, LS, SHA256, toCurrency } from "../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "MedicalNote",

  data: () => ({
    user: [],
    medical: [],
    patient: [],
    dates: [],
    dept: [],
    platform: [],
    e1: 1,
    steps: 4,
    altLabels: false,
    editable: true,
    viewTestResult: false,
    test: []
  }),

  props: {
    source: String,
    id: String
  },
  components: {},
  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    }
  },
  computed: {
    ...mapState(["domain", "outlet", "settings"])
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      this.patient = LS.get("patient");
      this.user = LS.get("user");
      this.dept = LS.get("department");
      this.platform = LS.get("platform");
    },
    onInput(val) {
      this.steps = parseInt(val);
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
    cancelNote: function() {
      this.$router.go(-1);
    },
    takeNote: function() {
      this.$router.push({ path: `/doctors-note` });
    },
    loadMedical: function() {
      this.$Progress.start();
      this.get(`/patient-med/history/detail/${this.id}`)
        .then(resp => {
          if (resp.status > 0) {
            this.medical = resp.response.mega;
            this.patient = resp.response.patient;
            this.steps = resp.response.count;
            this.dates = resp.response.dates;
          }
        })
        .finish(() => {
          this.$Progress.finish();
        });
    },
    viewTest: function(test) {
      this.test = test;
      this.viewTestResult = true;
    }
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
    this.loadMedical();
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
