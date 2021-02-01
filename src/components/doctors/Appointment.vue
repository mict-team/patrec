<template>
  <v-container>
    <v-card>
      <v-toolbar row wrap>
        <v-toolbar-title>My appointments</v-toolbar-title>
        <v-spacer></v-spacer>
        
      </v-toolbar>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Consultant</th>
            <th>Dept</th>
            <th>Reason</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody v-if="appointments.length > 0">
          <tr v-for="(visit, index) in appointments" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ visit.date_of_appointment }}</td>
            <td>{{ visit.name }}</td>
            <td>{{ visit.dept }}</td>
            <td>{{ visit.purpose_of_appointment }}</td>
            <td>
              <v-badge color="orange" overlap bordered v-if="visit.status == 0">
                <template v-slot:badge>
                  <span>Pending</span>
                </template>
              </v-badge>
              <v-badge color="green" overlap bordered v-if="visit.status == 1">
                <template v-slot:badge>
                  <v-icon>check</v-icon>
                </template>
              </v-badge>
              <v-badge color="red" overlap bordered v-if="visit.status == 2">
                <template v-slot:badge>
                  <v-icon>cancel</v-icon>
                </template>
              </v-badge>
            </td>
            <td>
              <v-chip class="ma-2" color="blue" text-color="white" @click="reschedule(visit)" v-if="visit.status == 0">
                <v-icon left>edit</v-icon>Edit
              </v-chip>
              <v-chip class="ma-2" color="red" text-color="white" @click="cancelAppointment(visit)" v-if="visit.status == 0">
                <v-icon left>cancel</v-icon>Cancel
              </v-chip>
              
            </td>
          </tr>
        </tbody>
        <tr v-if="!appointments.length > 0">
          <td colspan="6">
            <v-flex xs12 style="text-align:center;">
              <img src="../../assets/addnewitem.svg" />
            </v-flex>
          </td>
        </tr>
      </table>
    </v-card>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
import Appointment from "../shared/Appointment";
export default {
  name: "Appointments",
  data: () => ({
    dates: ["2019-09-10", "2019-09-20"],
    appointments: [],
    user:[],
    dept:[]
  }),
  props: {
    source: String,
    id: String
  },
  computed: {
    ...mapState(["domain", "outlet", "platforms"]),
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
  components: {
    Appointment
  },
  methods: {
    ...mapActions(["setDomain", "checkStorage"]),
    innitialize: function() {
      this.user=LS.get('user');
      this.dept=LS.get('department');
    },
    loadAppointments: function() {
      this.$Progress.start();
      let payload={
        date: this.dateRangeText,
        dept: (this.settings && this.settings.general && this.settings.general.central_nurses_station)?'':this.dept.id,
        user: (this.settings && this.settings.general && this.settings.general.allow_cross_case_treatment)?'':this.user.id,
        paid: (this.settings && this.settings.general && this.settings.general.pay_before_service)?1:0,
        outlet: this.outlet.id,
        action: 'loads'
      }
      this.post("/patient/appointment", payload)
      .then(resp => {
        if (response.status > 0) {
          this.appointments = resp.response;
        }else{
          this.appointments=[];
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },
    cancelAppointment: function(visit) {
      this.$Progress.start();
      this.get(`/patient/appointment/cancel/${visit.id}`)
      .then(response => {
        if (response.status > 0) {
          this.$toastr.success("Appointment cancelled for patient");
          this.loadAppointments();
        } else {
          this.$toastr.error(response.message);
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },
  },
  beforeMount() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
  },
  mounted() {
    setTimeout(this.loadAppointments, 200);
  }
};
</script>

<style scoped>
.header-text {
  font-size: 20px;
  font-weight: bold;
  color: grey;
}
</style>
