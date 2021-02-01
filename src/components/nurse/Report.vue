<template>
  <v-container>
    <v-card>
      <v-toolbar row wrap>
        <v-btn color="red" @click="$router.go(-1)"
          ><v-icon white-text>keyboard_arrow_left</v-icon
          ><span>Back</span></v-btn
        >
        <v-toolbar-title>Reports</v-toolbar-title>
        <v-spacer />
        <v-btn class="primary" :disabled="!patients" @click="download"
          ><v-icon>cloud_download</v-icon>Download</v-btn
        >
        <v-btn class="red" :disabled="!patients" @click="printpage"
          ><v-icon>print</v-icon>Print</v-btn
        >
      </v-toolbar>
      <v-container grid-list-sm class="pa-4">
        <v-layout>
          <v-flex xs12 row>
            <v-flex xs3>
              <label>Between</label>
              <v-menu
                ref="menu"
                v-model="modaldate"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <input
                    type="text"
                    class="form-control"
                    v-model="dateRangeText"
                    placeholder="Date range"
                    v-on="on"
                    readonly
                  />
                </template>
                <v-date-picker
                  v-model="dates"
                  :landscape="true"
                  :relative="true"
                  range
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modaldate = false"
                    >Cancel</v-btn
                  >
                  <v-btn text color="primary" @click="$refs.menu.save(dates)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs2>
              <label>Visited Dept</label>
              <v-select
              v-model="search.dept"
              :items="depts"
              item-text="name"
              item-value="id"
              label="---"
              @change="changeDept"
              dense
              solo
              />
            </v-flex>
            <v-flex xs3>
              <label>By</label>
              <v-select
              v-model="search.user"
              :items="getUsers"
              item-text="name"
              item-value="id"
              label="---"
              dense
              solo
              />
            </v-flex>
            <v-flex xs2>
              <label>Type</label>
              <v-select
              v-model="search.type"
              :items="['Old Patient','New Patient', 'Transfered Patient']"
              label="---"
              dense
              solo
              />
            </v-flex>
            <v-flex xs2 style="margin-top:32px;">
              <v-btn color="info" @click="searchRecord"
                ><v-icon white-text>search</v-icon><span>Search</span></v-btn
              >
            </v-flex>
          </v-flex>
          <v-divider></v-divider>
        </v-layout>
      </v-container>
      <v-container grid-list-sm class="pa-4" ref="printarea">
        <v-layout row>
          <v-flex xs12>
            <table class="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pat.Code</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Date of visit</th>
                  <th>Dept</th>
                  <th>Paid</th>
                  <th>Treated</th>
                  <th>Date</th>
                </tr>
              </thead>
              <template v-if="loading">
                <v-progress-circular
                  :size="30"
                  color="primary"
                  indeterminate
                ></v-progress-circular
                >Loading pls...
              </template>
              <template v-else>
                <tbody v-if="checkItems.length>0">
                  <tr v-for="(pat, index) in checkItems" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ pat.code }}</td>
                    <td>{{ pat.name }}</td>
                    <td>{{ pat.gender }}</td>
                    <td>{{ pat.dob }}</td>
                    <td>{{ pat.date }}</td>
                    <td>{{ pat.dept }}</td>
                    <td>
                      <span v-if="pat.paid == 0">No</span>
                      <span v-else>Yes</span>
                    </td>
                    <td>
                      <span v-if="pat.status == 0">Yes</span>
                      <span v-else>No</span>
                    </td>
                    <td>{{ pat.date }}</td>
                  </tr>
                </tbody>
                <tr v-else>
                  <td colspan="10">
                    <v-flex xs12 justify="left" style="text-align:center;">
                      <img src="../../assets/addnewitem.svg" />
                    </v-flex>
                  </td>
                </tr>
              </template>
            </table>
            
          </v-flex>
        </v-layout>
        <base-pagination :total="patients.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import { URL, LS, SHA256, DownloadCSV, PrintPage } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Home",
  data: () => ({
    dates: ["2019-09-10", "2019-09-20"],
    patients: [],
    page: 1,
    pageSize: 50,
    platform: [],
    group:[],
    user:[],
    depts: [],
    users: [],
    modaldate: false,
    loading: true,
    message: "",
    search: {
      date: "",
      user: "",
      dept: "",
      type: ""
    }
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "departments"]),
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
    checkItems() {
      return (this.patients.result)?this.patients.result:[];
    },
    getUsers(){
      return this.users.result
    },
    isDeptCollapsed(){
      return this.settings && this.settings.general && this.settings.general.central_nurses_station 
    },
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    changeDept: function(){
      this.users=[];
      this.loadUsers(this.search.dept);
    },
    loadUsers: function(dept) {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        group: this.group.structure,
        dept: dept,
        pageSize:0,
        sdept: true,
        action: 'loads'
      }
      this.post(`/users`, payload)
      .then(resp => {
        if(resp.status>0){
          this.users = resp.response;
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },
    loadDepts: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        has_clinic: 1,
        action: 'loads'
      }
      this.post("/dept", payload)
        .then(resp => {
          if(resp.status>0){
            this.depts = resp.response;
          }
        })
        .finally(() => {
          if(!this.isDeptCollapsed){
            let filter=this.depts.filter(x=>x.id=this.departments.id);
            if(filter){
              this.depts=filter;
            }
          }
          this.$Progress.finish();
        });
    },

    searchRecord: function() {
      
      this.$Progress.start();
      this.loading = true;
      this.search.page=this.page;
      this.search.pageSize=this.pageSize;
      this.search.date = this.dateRangeText;
      this.search.outlet = this.outlet.id;
      this.search.status=1;
      this.post("/report/record", this.search)
      .then(resp => {
        if (resp.status > 0) {
          this.patients = resp.response;
        } else {
          this.patients=[];
          this.$toastr.error(resp.message);
        }
      })
      .finally(() => {
        this.loading = false;
        this.$Progress.start();
      });
    },
    download: function() {
      DownloadCSV({ data: this.patients });
    },
    printpage: function() {
      PrintPage('printarea');
    },
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search=pageItems.search;
      this.loadDrugs();
    },
  },
  mounted() {
    this.group=LS.get('group');
    this.user=LS.get('user');
    this.checkStorage();
    
    //this.platform = LS.get("platform");
    var today = new Date();
    var date =
      String(today.getFullYear()).padStart(2, "0") +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");
    var yesterday =
      String(today.getFullYear()).padStart(2, "0") +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate() - 1).padStart(2, "0");
    this.dates = [yesterday, date];
    setTimeout(this.loadDepts, 100);
    this.loadUsers(this.user.department);
    setTimeout(this.searchRecord, 100);
  }
};
</script>
<style scoped></style>
