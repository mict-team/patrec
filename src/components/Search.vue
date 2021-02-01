<template>
  <div>
    <v-toolbar row wrap>
      <v-btn color="red" @click="goBack"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title>Searching for {{ search }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card v-if="searchdialog">
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex xs12 v-if="stillSearching">
            <v-progress-circular
                class="pa-4"
                :size="50"
                color="blue"
                indeterminate
              ></v-progress-circular>
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
  </div>
</template>

<script>
import { URL, LS, SHA256 } from "../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Search",
  data: () => ({
    searchdialog: false,
    stillSearching: false,
    fingerdialog: false,
    filterPtients: [],
    message: "",
    patients: []
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState([
      "outlet",
      "search",
      "transCode",
      "group",
      "today",
      "platforms",
      "departments"
    ])
  },
  watch: {
    search(newValue, oldValue) {
      //console.log(`Updating from ${oldValue} to ${newValue}`);
      this.searchdialog = true;
      this.searchNow(newValue);
    }
  },
  methods: {
    ...mapActions([
      "setSearch",
      "checkStorage",
      "addPatients",
      "setCode",
      "setToday"
    ]),
    goBack: function() {
      this.$router.go(-1);
    },
    startSearch: function() {
      this.searchdialog = true;
      this.searchNow(this.search);
    },
    searchNow: function(text) {
      this.$Progress.start();
      this.stillSearching = true;
      this.message = `Seaching for ${text}`;
      this.filterPtients = [];
      var postData = {
        outlet: this.outlet.id,
        search: text.toLowerCase()
      };
      
      this.post("/patients/search", postData)
      .then(resp => {
        if (resp.status > 0) {
          var response = resp.response;
          //console.log(resp)
          for (var i = 0; i < response.length; i++) {
            this.addPatients(response[i]);
          }
          this.filterPtients = response;
          
        } else {
          this.$toastr.error("Search completed with no record found.");
          this.message = "Search completed. No match found.";
        }
      })
      .finally(() => {
        this.stillSearching = false;
        this.$Progress.finish();
      });
      
    },
    selectPatient: function(patient) {
      LS.set("searched", patient.id);
      let group=LS.get("group");
      let searchPath=LS.get('searchPath');
      LS.remove("schedule");
      //alert(group.structure)
      switch(group.structure){
        case 'default':
          this.$router.push(`/patient/${patient.id}`);
        break;
        default:
          if(searchPath=='doctors'){
            this.$router.push("/patient/"+patient.id)
          }else{
            //alert(`${searchPath.toLowerCase()}/patient/${patient.id }`)
            this.$router.push(`${searchPath.toLowerCase()}/patient/${patient.id }`);
          }
          
      }
      //let searchPath=`${searchPath.toLowerCase()}/patient/${patient.id }`;
      //alert(searchPath)
      //console.log(this.group)
      //this.$router.push(searchPath);
    }
  },
  mounted() {
    this.checkStorage();
    setTimeout(this.startSearch, 400);
    //console.log(this.group)
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
