<template>
  <v-card>
    <v-card-title class="grey lighten-4 py-4 title">
      Book an appointment for {{ patient.name }}.
      <v-spacer></v-spacer>
      <v-btn @click="closePage">Cancel</v-btn>
      <v-btn color="primary" @click="saveAppointment">Book appointment</v-btn>
    </v-card-title>
    <v-container grid-list-sm class="pa-4">
      <v-layout row wrap>
        <v-flex xs12>
          <DateTimePicker v-model="appointment.date" inline right />
          
        </v-flex>
        <v-flex xs4>
          <label>Department</label>
          <select
            class="form-control select2me"
            placeholder="Consulting doctor"
            v-model="appointment.dept"
            @change="filterUsers"
          >
            <option
              v-for="(st, index) in departments"
              :key="index"
              :value="st.id"
              >{{ st.name }}</option
            >
          </select>
        </v-flex>
        <v-flex xs4>
          <label>Who to see</label>
          <select
            class="form-control select2me"
            placeholder="Consulting doctor"
            v-model="appointment.doctor"
          >
            <option
              v-for="(st, index) in filtereduser"
              :key="index"
              :value="st.id"
              >{{ st.name }}</option
            >
          </select>
        </v-flex>
        <v-flex xs12>
          <label>Purpose of appointment</label>
          <textarea
            class="form-control"
            col="100%"
            row="6"
            v-model="appointment.purpose"
          ></textarea>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>
<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      modalApp: false,
      departments: [],
      doctors: [],
      filtereduser: [],
      appointment: {
        outlet: "",
        patient: "",
        dept: "",
        doctor: "",
        date: "",
        purpose: ""
      }
    };
  },
  props: {
    source: String,
    patient: String
  },
  computed: {
    ...mapState(["domain", "outlet", "platforms", "departments", "users"])
  },
  methods: {
    ...mapActions(["setDomain", "checkStorage"]),
    loadDept: function() {
      this.get(`/dept/platform/${this.platforms.id}`)
        .then(response => {
          if (response.status > 0) {
            this.departments = response.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
          this.message =
            "Unable to load depts. Kindly contact admin for assistance.";
        });
    },
    loadUsers: function() {
      this.get(`/users/platform/${this.platforms.id}`)
        .then(response => {
          if (response.status > 0) {
            this.doctors = response.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    filterUsers: function() {
      this.filtereduser = this.doctors.filter(item => {
        return item.department == this.appointment.dept;
      });
    },
    saveAppointment: function() {
      if (this.appointment.date == "") {
        this.$toastr.error("Date of appointment must be selected");
      } else if (this.appointment.dept == "") {
        this.$toastr.error("Booking department must set");
      } else if (this.appointment.purpose == "") {
        this.$toastr.error("Purpose of appointment cannot be emptied.");
      } else {
        this.$emit("bookAppointment", this.appointment);
      }
    },
    closePage: function() {
      this.$emit("closePage", false);
    }
  },
  beforeMount() {
    this.checkStorage();
    this.setDomain();
  },
  mounted() {
    this.loadDept();
    this.loadUsers();
  }
};
</script>
