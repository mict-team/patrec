<template>
  <v-container>
    <v-card>
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
    patient: [],
    appointments: [],
    hide: true,
    toEdit: [],
    newAppointment: false
  }),
  props: {
    source: String,
    id: String
  },
  computed: {
    ...mapState(["domain", "outlet", "platforms"])
  },
  components: {
    Appointment
  },
  methods: {
    ...mapActions(["setDomain", "checkStorage"]),
    innitialize: function() {
      this.patient = this.id;//LS.get("patient");
    },
    loadAppointments: function() {
      this.$Progress.start();
      this.get("/patient/appointment/" + this.patient)
        .then(response => {
          if (response.status > 0) {
            this.appointments = response.response;
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
    reschedule: function(visit) {
      this.toEdit = visit;
      this.newAppointment = true;
    },
    closePage: function(status) {
      this.newAppointment = false;
    },
    bookAppointment: function(appointment) {
      appointment.id = this.toEdit.id;

      this.post("/patient/appointment/reschedule", appointment)
      .then(response => {
        if (response.status > 0) {
          this.$toastr.success(
            `Appointment has been booked for ${this.patient.basic.name}`
          );
          this.newAppointment = false;
          this.loadAppointments();
        } else {
          this.$toastr.error(response.message);
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    }
  },
  beforeMount() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
  },
  mounted() {
    this.loadAppointments();
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
