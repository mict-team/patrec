<template>
  <v-container>
    <v-toolbar row wrap>
      <button
        type="button"
        class="btn btn-danger btn-back btn-small"
        @click="cancelNote"
      >
        <v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span>
      </button>
      <v-toolbar-title>Patient diagnosis</v-toolbar-title>
      <v-spacer></v-spacer>
      <button class="btn purple" @click="saveNote(0)">Save & continue</button>
      <button class="btn btn-success" @click="saveNote(2)">
        Refer patient
      </button>
      <button
        class="btn btn-info"
        @click="saveNote(1)"
        v-if="dept.hasClinic == 1"
      >
        Discharge patient
      </button>
      <button
        class="btn btn-danger"
        @click="saveNote(3)"
        v-if="dept.hasClinic == 1"
      >
        Admission patient
      </button>
    </v-toolbar>
    <v-card tile>
      <v-container grid-list-sm>
        <v-layout row wrap style="margin-right:-20px;">
          <v-flex row>
            <v-flex xs3 class="grey lighten-4 scroller">
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
            <v-flex xs9>
              <v-flex xs12 row class="grey lighten-4">
                <v-flex xs2></v-flex>
                <v-flex xs8 row>
                  <v-flex xs3>
                    <label>Body emperature</label>
                    {{ patient.vital.temperature }}
                  </v-flex>
                  <v-flex xs3>
                    <label>Pulse rate</label>
                    {{ patient.vital.pulserate }}
                  </v-flex>
                  <v-flex xs3>
                    <label>Respiratory rate</label>
                    {{ patient.vital.respiratory }}
                  </v-flex>
                  <v-flex xs3>
                    <label>Blood pressure</label>
                    {{ patient.vital.bloodpressure }}
                  </v-flex>
                </v-flex>
                <v-flex xs2></v-flex>
              </v-flex>
              <v-flex xs12><h2>Medical note</h2></v-flex>
              <v-flex xs12 class="scroller">
                <v-flex xs12> </v-flex>
                <v-flex xs12> </v-flex>

                <v-flex xs12> </v-flex>

                <v-flex xs12 v-if="medical.tests.length > 0">
                  <table class="table table-stripped">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th width="10%">SKU</th>
                        <th width="30%">Lab.</th>
                        <th width="30%">Name</th>
                        <th width="10%">Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in medical.tests" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.sku }}</td>
                        <td>{{ item.lName }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.amount }}</td>
                        <td>
                          <v-btn icon @click="removeFromTests(index)"
                            ><v-icon>delete</v-icon></v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </v-flex>

                <v-flex xs12 v-if="medical.drugs.length > 0">
                  <table class="table table-stripped">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th width="10%">SKU</th>
                        <th width="50%">Name</th>
                        <th width="50%">Note</th>
                        <th width="10%">Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in medical.drugs" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.sku }}</td>
                        <td>{{ item.name }}</td>
                        <td>
                          <input
                            type="text"
                            class="form-control input-small"
                            v-model="item.note"
                          />
                        </td>
                        <td>{{ item.selling_price }}</td>
                        <td>
                          <v-btn icon @click="removeFromDrugs(index)"
                            ><v-icon>delete</v-icon></v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
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
import { URL, LS, SHA256, toCurrency } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "MedicalNote",

  data: () => ({
    user: [],
    medical: []
  }),

  props: {
    source: String
  },
  components: {},
  computed: {
    ...mapState(["domain", "outlet", "settings"])
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      this.schedule = LS.get("schedule");
      this.patient = LS.get("patient");
      this.user = LS.get("user");
      this.dept = LS.get("department");
      this.platform = LS.get("platform");
    },
    loadMedical: function() {
      this.get(`/patient-med/history/detail/1`)
        .then(response => {
          if (response.status > 0) {
            this.medical = response.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
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
