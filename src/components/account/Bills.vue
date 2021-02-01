<template>
   <v-container>
        <v-toolbar row wrap>
        <v-btn color="red" @click="goBack"
            ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
        >
        <v-toolbar-title>Active bills</v-toolbar-title>
        <v-spacer></v-spacer>
        </v-toolbar>
        <v-card>
        <v-container grid-list-sm class="pa-4">
            <v-layout row wrap>
            <v-flex xs12 v-if="isLoading">
                <v-progress-circular
                    class="pa-4"
                    :size="30"
                    color="blue"
                    indeterminate
                ></v-progress-circular>
                {{ message }}
            </v-flex>
            <v-flex xs12 v-else>
                <v-layout row wrap v-if="getItems.length > 0">
                    <table class="table table-hover">
                        <tr v-for="(pat, index) in getItems" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ pat.pat_code }}</td>
                            <td>{{ pat.name }}</td>
                            <td>{{ pat.gender }}</td>
                            <td>{{ pat.dob | toAge }}</td>
                            <td>{{ pat.amount }}</td>
                            <td><v-icon style="cursor:pointer" @click="selectPatient(pat)">toc</v-icon></td>
                        </tr>
                    </table>
                </v-layout>
                <v-layout v-else>
                <v-flex xs12 style="text-align:center;">
                    <img src="../../assets/addnewitem.svg" />
                </v-flex>
                </v-layout>
            </v-flex>
            </v-layout>
            <base-pagination :total="patients.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
        </v-container>
        </v-card>
    </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Search",
  data: () => ({
    patients: [],
    page:1,
    pageSize:50,
    search:'',
    isLoading: false
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
    ]),
    getItems(){
      return this.patients.result;
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
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search=pageItems.search;
      this.loadActiveBills();
    },
    loadActiveBills: function(text) {
      this.$Progress.start();
      this.isLoading=true;
      let payload={
        page:this.page,
        pageSize: this.pageSize,
        outlet:this.outlet.id,
        search: this.search,
        action:'loads'
      }
      this.post(`/bills/patient/account`, payload)
      .then(resp => {
        if (resp.status > 0) {
          //console.log(resp.response.result)
          this.patients=resp.response;
        } else {
          this.$toastr.error("Search completed with no record found.");
        }
      })
      .finally(() => {
        this.isLoading = false;
        this.$Progress.finish();
      });
      
    },
    selectPatient: function(patient) {
      LS.set("searched", patient.id);
      let group=LS.get("group");
      let searchPath=LS.get('searchPath');
      this.$router.push(`/account/patient/${patient.id }`);
    }
  },
  mounted() {
    this.checkStorage();
    setTimeout(this.loadActiveBills, 200);
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
