<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title>Test requests</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search..."
        class="hidden-sm-and-down"
        style="width: 500px"
        v-model="searchStr"
        @keyup="putSearch"
      ></v-text-field>
      <v-toolbar-title red
        >{{ requests.length > 0 ? this.requests.length : 0 }} waiting
        patients</v-toolbar-title
      >
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <template v-if="loading">
            <v-progress-circular
              :size="30"
              color="primary"
              indeterminate
            ></v-progress-circular
            >Loading requests...
          </template>
          <template v-else>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Code</th>
                  <th>Patient</th>
                  <th>Age/Gender</th>
                  <th>Requested Test</th>
                  <th>By</th>
                  <th>Paid</th>
                  <th></th>
                </tr>
              </thead>
              <template v-if="requests.total>0">
                <tbody>
                  <template v-for="(patient, index) in getAllItems">
                    <tr
                      :key="index"
                      v-if="
                        payBeforeService &&
                          patient.paid == 1
                      "
                      @click="openPatient(patient)"
                      class="rowClick"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>{{ patient.code }}</td>
                      <td>{{ patient.name }}</td>
                      <td>{{ patient.dob | toAge }}yrs {{ patient.gender }}</td>
                      <td>{{ patient.test }}</td>
                      <td>{{ patient.doctor }}</td>
                      <td>
                        <span v-if="patient.paid == 1">Yes</span>
                        <span v-else>No</span>
                      </td>
                      <th><v-icon>menu</v-icon></th>
                    </tr>
                    <tr
                      :key="index"
                      v-if="
                        payBeforeService &&
                          patient.paid == 0
                      "
                    >
                      <td>{{ index + 1 }}</td>
                      <td>{{ patient.code }}</td>
                      <td>{{ patient.name }}</td>
                      <td>{{ patient.dob | toAge }}yrs {{ patient.gender }}</td>
                      <td>{{ patient.test }}</td>
                      <td>{{ patient.doctor }}</td>
                      <td>
                        <span v-if="patient.paid == 1">Yes</span>
                        <span v-else>No</span>
                      </td>
                      <th>Patient should pay first</th>
                    </tr>
                    <tr
                      :key="index"
                      v-if="
                        !payBeforeService 
                      "
                      class="rowClick"
                      @click="openPatient(patient)"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>{{ patient.code }}</td>
                      <td>{{ patient.name }}</td>
                      <td>{{ patient.dob | toAge }}yrs {{ patient.gender }}</td>
                      <td>{{ patient.test }}</td>
                      <td>{{ patient.doctor }}</td>
                      <td>
                        <span v-if="patient.paid == 1">Yes</span>
                        <span v-else>No</span>
                      </td>
                      <th><v-icon>menu</v-icon></th>
                    </tr>
                  </template>
                </tbody>
              </template>
              <template v-else>
                  <tfoot>
                    <tr>
                      <td colspan="8">
                        <v-flex xs12 style="text-align:center;">
                          <img src="../../assets/addnewitem.svg" />
                        </v-flex>
                      </td>
                    </tr>
                  </tfoot>
                </template>
            </table>
          </template>
          
        </v-layout>
      </v-container>
    </v-card>
    
  </v-container>
</template>
<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { STATE, LGAS } from "../../shared/state.js";
import { mapState, mapActions } from "vuex";
import UploadFile from "../shared/UploadFile";
export default {
  name: "Request",
  data: () => ({
    requests:[],
    users: [],
    user:[],
    dept: [],
    filtered:[],
    testResult: false,
    tobeFilled: [],
    itemInex: 0,
    searchStr:'',
    
    saving: false,
    saved: false,
    loading: false
  }),
  
  props: {
    source: String
  },
  
  computed: {
    ...mapState([
      "domain",
      "outlet",
      "search",
      "departments",
      "platforms",
      "settings",
      "today"
    ]),
    canAttendToAnyLab(){
      return this.settings && this.settings.general && this.settings.general.collapse_all_laboratory
    },
    payBeforeService(){
      return this.settings && this.settings.general && this.settings.general.pay_before_service
    },
    getAllItems(){
      return (this.requests.result)?this.requests.result:[];
    }
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage", "setToday"]),
    innitialize: function() {},
    
    loadSchedules: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        dept: (this.canAttendToAnyLab)?"":this.departments.id,
        status: 0,
        action: 'loads'
      }
      this.post(`/laboratory`, payload)
      .then(resp => {
        if (resp.status > 0) {
          this.requests=resp.response;
        }else{
          this.request=[]
        }
      })
      .finally(() => {
        this.loading = false;
        this.$Progress.finish();
      });
    },
    loadUsers: function() {
      this.get(`/users/${this.departments.id}`)
      .then(response => {
        if (response.status > 0) {
          this.users = response.response;
        }
      })
      .finally(() => {
        
      });
    },
    putSearch: function(){

    },
    openPatient: function(schedule) {
      //this.loadUsers();
      this.itemInex = this.getAllItems.findIndex(item => item.id == schedule.id);
      LS.set("testR", schedule);
      this.$router.push("/laboratory/result")
      this.tobeFilled = schedule;
      this.testResult = true;
    },
    
    
  },
  beforeMount() {
    this.checkStorage();
    this.setDomain();
    
  },
  mounted() {
    setTimeout(this.innitialize,100);
    setTimeout(this.loadSchedules,100)
  }
};
</script>
<style scoped></style>
