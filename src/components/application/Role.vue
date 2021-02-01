<template>
  <v-container>
    <v-toolbar row wrap>
      <button type="button" class="btn btn-danger btn-back btn-small">
        <v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span>
      </button>
      <v-toolbar-title>Searching for {{ search }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="searchdialog = false">Close</v-btn>
    </v-toolbar>
    <v-card v-if="searchdialog">
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex xs12 v-if="stillSearching">
            <img src="../../assets/loading.gif" alt="loading" />
            {{ message }}
          </v-flex>
          <v-flex xs12 v-else>
            <table class="table table-hover" v-if="filterPtients.length > 0">
              <tr v-for="(pat, index) in filterPtients" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ pat.pat_code }}</td>
                <td>{{ pat.basic.name }}</td>
                <td>{{ pat.basic.gender }}</td>
                <td>{{ pat.basic.dob }}</td>
                <td>{{ pat.basic.marital_status }}</td>
                <td>
                  <v-icon style="cursor:pointer" @click="selectPatient(pat)"
                    >toc</v-icon
                  >
                </td>
              </tr>
            </table>

            <v-flex xs12 v-else>
              {{ message }}
            </v-flex>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "Search",
  data: () => ({
    store: [],
    error: "",
    currentSession: [],
    loadingDialog: false,
    Newdialog: false,
    section: "basic",
    searchdialog: false,
    stillSearching: false,
    fingerdialog: false,
    filterPtients: [],
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
  watch: {
    search(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);
      this.searchdialog = true;
      this.searchNow(newValue);
    }
  },
  methods: {
    ...mapActions([
      "setDomain",
      "setSearch",
      "checkStorage",
      "addPatients",
      "setCode",
      "setToday"
    ]),
    startSearch: function() {
      this.searchdialog = true;
      this.searchNow(this.search);
    },
    searchNow: function(text) {
      this.stillSearching = true;
      this.message = `Seaching for ${text}`;
      this.filterPtients = [];
      //console.log(this.patients)
      if (this.patients.length > 0) {
        this.filterPtients = this.patients.filter(item => {
          return (
            item.pat_code.toLowerCase().includes(text.toLowerCase()) ||
            item.basic.name.toLowerCase().includes(text.toLowerCase()) ||
            item.basic.dob.includes(text)
          );
        });
      }

      if (this.filterPtients.length < 1) {
        var postData = {
          outlet: this.outlet.id,
          search: text.toLowerCase()
        };
        //console.log(postData)
        this.post("/patients/search", postData)
          .then(response => {
            if (response.status > 0) {
              if (response.response.length > 0) {
                //console.log(response.response)
                var resp = response.response;
                for (var i = 0; i < resp.length; i++) {
                  //console.log(resp[i]);
                  this.addPatients(resp[i]);
                }
                this.filterPtients = resp;
              }
            } else {
              this.$toastr.error(response.message);
              this.message = "Search completed. No match found.";
            }
          })
          .catch(e => {
            this.$toastr.error(e.message);
            this.message = "Search completed. No match found.";
          });
      }
      this.stillSearching = false;
    },
    selectPatient: function(patient) {
      //console.log(patient);
      LS.set("patient", patient);
      var platform = LS.get("platform");
      //console.log(platform)
      switch (platform.type) {
        case 1:
          this.$router.push({ name: "rpatient" });
          break;
        case 2:
          this.$router.push({ name: "patient" });
          break;
        case 3:
          this.$router.push({ name: "patient" });
          break;
        case 4:
          this.$router.push({ name: "lpatient" });
          break;
        case 5:
          this.$router.push({ name: "ppatient" });
          break;
        case 6:
          this.$router.push({ name: "apatient" });
          break;
        default:
          this.$router.push({ name: "patient-all" });
          break;
      }
    }
  },
  mounted() {
    this.setDomain();
    this.startSearch();
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
