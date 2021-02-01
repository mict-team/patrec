<template>
  <div class="pa-4">
    <v-flex>
      <v-card tile style="width:100% !important">
        <v-card-text>
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Doctor</th>
                <th>Drug</th>
                <th>Instruction</th>
                <th>Pharmacist</th>
                <th>isBought</th>
              </tr>
            </thead>
            <tbody v-if="prescription">
              <tr v-for="(drug, index) in prescription" :key="index">
                <td>{{ drug.date }}</td>
                <td>{{ drug.name }}</td>
                <td>{{ drug.drug }}</td>
                <td>{{ drug.remark }}</td>
                <td>{{ drug.pharmacist }}</td>
                <td>{{ drug.status == 0 ? "Not bought" : "Bought" }}</td>
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
        </v-card-text>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "Prescription",
  data: () => ({
    schedule: [],
    patient: [],
    prescription: [],
    message: "Loading drugs and categories. Please wait"
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet"])
  },

  methods: {
    ...mapActions(["setDomain", "checkStorage"]),
    innitialize: function() {
      this.schedule = LS.get("medical");
      this.patient = LS.get("patient");
    },
    loadDrugs: function() {
      this.get(`/patient/prescription/${this.schedule.id}`)
        .then(response => {
          //console.log(response)
          this.prescription = response.response;
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
    this.loadDrugs();
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
