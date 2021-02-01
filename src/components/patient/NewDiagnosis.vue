<template>
  <div class="pa-4">
    <v-flex>
      <v-card tile style="width:100% !important">
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex row>
              <v-flex row xs8> </v-flex>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions class="grey lighten-4">
          <v-spacer></v-spacer>
          <v-btn @click="cancelSchedule">Cancel</v-btn>
          <v-btn color="primary" @click="saveSchedule">Save</v-btn>
          <v-btn color="primary" @click="saveSchedule"
            >Save & Send to Lab</v-btn
          >
        </v-card-actions>
      </v-card>
      <v-dialog v-model="loadingDialog" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Loading lab tests. Please wait.
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
  </div>
</template>
<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { STATE, LGAS } from "../../shared/state.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "NewDiagnosis",
  data: () => ({
    patient: [],
    payments: [],
    loadingDialog: false
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
    getAllLabPayments: function() {
      var postData = {
        outlet: this.outlet.id
      };
      this.post(this.domain + "/all-lab-payment", postData)
        .then(response => {
          this.loadingDialog = false;
          //console.log(response)
        })
        .catch(e => {
          this.$toastr.error(e.message);
          this.loadingDialog = false;
        });
    },
    cancelSchedule: function() {
      this.$router.back();
    },
    saveSchedule: function() {}
  },
  mounted() {
    this.loadingDialog = true;
    this.checkStorage();
    this.setDomain();
    this.innitialize();
    this.getAllLabPayments();
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
