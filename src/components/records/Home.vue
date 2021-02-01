<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" v-if="isLoading">
        <v-progress-circular
          class="pa-4"
          :size="30"
          color="blue"
          indeterminate
        ></v-progress-circular
        >Loading...
      </v-col>
      <v-col
        cols="12"
        sm="6"
        lg="4"
        v-for="(dept, index) in bookSummary"
        :key="index"
      >
        <base-material-stats-card
          color="info"
          icon="mdi-bus-stop-uncovered"
          :title="dept.name"
          :value="dept.nos"
          sub-icon="mdi-clock"
          sub-text="Just Updated"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Home",
  data: () => ({
    store: [],
    error: "",
    isLoading: false,
    patientByDept: [],
    patientSummary: [],
    searchdialog: false,
    stillSearching: false,
    fingerdialog: false,
    filterPtients: [],
    bookSummary: [],
    datacollection: null,
    polareaction: null,
    options: [],
    message: ""
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState([
      "domain",
      "outlet",
      "search",
      "patients",
      "transCode",
      "today"
    ])
  },
  components: {},
  methods: {
    ...mapActions([
      "setDomain",
      "setSearch",
      "checkStorage",
      "addPatients",
      "setCode",
      "setToday"
    ]),
    innitialize: function() {},
    loadSummary: function() {
      this.isLoading = true;
      this.get(`/record/summary`)
        .then(resp => {
          if (resp.status > 0) {
            this.bookSummary = resp.response;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.loadSummary();
    this.innitialize();
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
