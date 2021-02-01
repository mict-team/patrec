<template>
  <v-container>
    <v-card>
      <v-card-title class="grey lighten-4 py-4 title">
        {{ patient.basic.code }}({{ patient.basic.name }})
      </v-card-title>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex row>
            <v-flex xs7>
              <table class="table table-bordered ">
                <tr>
                  <td colspan="3">{{ patient.basic.name }}</td>
                </tr>
                <tr>
                  <td>{{ patient.contact.phone }}</td>
                  <td colspan="2">{{ patient.contact.address }}</td>
                </tr>
                <tr>
                  <td>{{ patient.nextOfKin.name }}</td>
                  <td>{{ patient.nextOfKin.address }}</td>
                  <td>{{ patient.nextOfKin.phone }}</td>
                </tr>
              </table>

              <table class="table table-bordered ">
                <tr>
                  <td>
                    <label>Height</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="patient.medical.height"
                    />
                  </td>
                  <td>
                    <label>Blood Group</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="patient.medical.blood_group"
                    />
                  </td>
                  <td>
                    <label>Genotype</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="patient.medical.genotype"
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
                    />
                  </td>
                </tr>
              </table>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex row xs4 class="grey lighten-4">
              <v-flex>
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
              <v-flex>
                <label>Case</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="appointment.case"
                />
              </v-flex>
              <v-flex xs6>
                <label>Casualty</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="appointment.casualty"
                />
              </v-flex>
              <v-flex xs6>
                <label>Old Patient?</label>
                <select
                  class="form-control select2me"
                  placeholder="Next of kin gender"
                  v-model="appointment.oldPatient"
                >
                  <option value="false">New Patient</option>
                  <option value="true">Old Patient</option>
                </select>
              </v-flex>
              <v-flex xs6>
                <label>TPA</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="appointment.tpa"
                />
              </v-flex>
              <v-flex xs6>
                <label>Reference No</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="appointment.referenceNo"
                />
              </v-flex>
              <v-flex xs6>
                <label>Consulting Dept</label>
                <select
                  class="form-control select2me"
                  placeholder="Consulting doctor"
                  v-model="appointment.dept"
                  @change="checkUsers"
                >
                  <option
                    v-for="(st, index) in departments"
                    :key="index"
                    :value="st.id"
                    >{{ st.name }}</option
                  >
                </select>
              </v-flex>
              <v-flex xs6>
                <label>Consulting Doctor</label>
                <select
                  class="form-control select2me"
                  placeholder="Consulting doctor"
                  v-model="appointment.doctor"
                >
                  <option
                    v-for="(st, index) in filterdoctors"
                    :key="index"
                    :value="st.id"
                    >{{ st.name }}</option
                  >
                </select>
              </v-flex>
              <v-flex xs6>
                <label>Pay for</label>
                <select
                  class="form-control select2me"
                  placeholder="Next of kin gender"
                  v-model="appointment.payment"
                >
                  <option
                    v-for="(st, index) in charges"
                    :key="index"
                    :value="st"
                    >{{ st.name }}({{ st.amount }})</option
                  >
                </select>
              </v-flex>
              <v-flex xs6>
                <label>Charge</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="appointment.payment.amount"
                  readonly
                />
              </v-flex>
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
  </v-container>
</template>
<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { STATE, LGAS } from "../../shared/state.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "NewPatient",
  data: () => ({
    patient: [],
    payments: [],
    appointment: {
      action:"",
      date: "",
      case: "",
      casualty: "",
      oldPatient: false,
      tpa: "",
      referenceNo: "",
      dept: "",
      doctor: "",
      payment: ""
    },
    departments: [],
    filterdoctors: [],
    doctors: [],
    charge: "",
    charges: [],
    filtercharges: [],
    modalApp: false
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
    loadDept: function() {
      var dept = LS.get("dept");
      this.get("/department")
        .then(resp => {
          if (resp.status > 0) {
            this.departments = resp.response.filter(item => {
              return (
                item.platform_id == 2 ||
                item.platform_id == 4 ||
                item.platform_id == 8
              );
            });
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    loadDoctors: function() {
      var platform = LS.get("platform");
      this.get("/users")
        .then(resp => {
          if (resp.status > 0) {
            this.doctors = resp.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    loadCharges: function() {
      var dept = LS.get("dept");
      this.get("/charges/" + dept.id)
        .then(resp => {
          if (resp.status > 0) {
            this.charges = resp.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    cancelSchedule: function() {
      this.$router.push("/home");
    },
    checkUsers: function() {
      if (this.departments.length > 0) {
        var select = new Promise(resolve => {
          var items = [];
          this.doctors.forEach(w => {
            if (w["department"] == this.appointment.dept) {
              items.push(w);
            }
          });
          resolve(items);
        });
        select.then(response => {
          this.filterdoctors = response;
        });
      }
    },
    checkCharge: function() {
      this.appointment.payment = this.charge;
    },
    saveSchedule: function() {
      var user = LS.get("user");
      this.appointment.user = user.id;
      this.post("/schedule", this.appointment)
        .then(resp => {
          if (resp.status > 0) {
            this.departments = resp.response;
            this.$toastr.success(resp.message);
          } else {
            this.$toastr.error(resp.message);
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    }
  },
  beforeMount() {
    this.checkStorage();
    this.setDomain();
  },
  mounted() {
    this.innitialize();
    this.loadDept();
    this.loadDoctors();
    this.loadCharges();
  }
};
</script>
<style scoped></style>
