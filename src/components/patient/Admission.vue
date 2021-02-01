<template>
  <v-container>
    <v-card>
      <table class="table">
        <thead>
          <tr>
            <th>Date of Admission</th>
            <th>Ward Admitted</th>
            <th>Bed</th>
            <th>No of Days Used</th>
            <th>Date Discharge</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody v-if="admission">
          <tr v-for="(drug, index) in admission" :key="index">
            <td>{{ drug.date_of_admission }}</td>
            <td>{{ drug.admission_ward }}</td>
            <td>{{ drug.admission_bed }}</td>
            <td>{{ calculateDays }}</td>
            <td>{{ drug.date_of_discharge }}</td>
            <td>{{ drug.remark }}</td>
          </tr>
        </tbody>
        <tr v-else>
          <td colspan="4">
            <v-flex xs12 style="text-align:center;">
              <img src="../../assets/addnewitem.svg" />
            </v-flex>
          </td>
        </tr>
      </table>
    </v-card>
    <v-btn
      fab
      bottom
      right
      color="green"
      dark
      fixed
      style="padding-top:15px; margin-right:60px;"
      title="Update patient case note"
      @click="updateNote"
      ><v-icon>file_copy</v-icon></v-btn
    >
    <v-btn
      fab
      bottom
      right
      color="red"
      dark
      fixed
      style="padding-top:15px;"
      title="Discharge patient"
      @click="discharge"
      ><v-icon>how_to_reg</v-icon></v-btn
    >
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "Admission",
  data: () => ({
    patient: [],
    schedule: [],
    admission: []
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet"]),
    calculateDays() {
      return (
        this.admission.date_of_discharge - this.admission.date_of_admission
      );
    }
  },

  methods: {
    ...mapActions(["setDomain", "checkStorage"]),
    innitialize: function() {
      this.schedule = LS.get("schedule");
      this.patent = LS.get("patient");
    },
    loadAdmission: function() {
      this.get(`/patient/admission/${this.schedule.id}`)
        .then(response => {
          if (response.status > 0) {
            this.admission = response.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },

    updateNote: function() {},
    discharge: function() {}
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
    this.loadAdmission();
  }
};
</script>

<style scoped></style>
