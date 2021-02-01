<template>
  <v-container>
    <v-card>
      <v-toolbar row wrap>
        <v-btn color="red" @click="$router.go(-1)">
          <v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span>
        </v-btn>
        <v-toolbar-title>Reports</v-toolbar-title>
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
            
            <v-flex xs2 v-if="group.structure=='default'">
              <label>Visited Dept</label>
              <v-select
              v-model="search.dept"
              :items="depts"
              item-text="name"
              item-value="id"
              label="---"
              dense
              solo
              />
            </v-flex>
            <v-flex xs2>
              <label>Technician</label>
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
              <label>Ready</label>
              <v-select
              v-model="search.status"
              :items="['Yes','No']"
              label="Is test result ready?"
              dense
              solo
              />
            </v-flex>
            <v-flex xs2 style="margin-top:32px;">
              <v-btn color="info" @click="loadReport"
                ><v-icon white-text>search</v-icon><span>Search</span></v-btn
              >
            </v-flex>
          </v-flex>
          <v-divider></v-divider>
        </v-layout>
      </v-container>
      <v-container grid-list-sm class="pa-4">
        <v-layout row>
          <v-flex xs12>
            <table class="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pat.Code</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Test</th>
                  <th>Result</th>
                  <th>Technician</th>
                  <th>Req. on</th>
                  <th>Avail. on</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <template v-if="loading">
                <v-progress-circular
                  :size="40"
                  color="primary"
                  indeterminate
                ></v-progress-circular
                >Loading pls...
              </template>
              <template v-else>
                <tbody v-if="checkItems.length>0">
                  <template v-for="(pat, index) in checkItems">
                    <tr class="rowClick" :class="pat.status == 0 ? 'pink' : ''" :key="index" @click="vieResult(pat)">
                      <td>{{ index + 1 }}</td>
                      <td>{{ pat.code }}</td>
                      <td>{{ pat.name }}</td>
                      <td>{{ pat.gender }}</td>
                      <td>{{ pat.test }}</td>
                      <td>{{ pat.result }}</td>
                      <td>{{ pat.technician }}</td>
                      <td>{{ pat.dateR }}</td>
                      <td>{{ pat.date }}</td>
                      <td>
                        <span v-if="pat.paid == 1">Paid</span>
                        <span v-else>Not paid</span>
                      </td>
                      <td>
                        <span v-if="pat.status == 1">Ready</span>
                        <span v-else>Not ready</span>
                      </td>
                      <td><v-icon>menu</v-icon></td>
                    </tr>
                  </template>
                </tbody>
                <tr v-else>
                  <td colspan="12">
                    <v-flex xs12 justify="left" style="text-align:center;">
                      <img src="../../assets/addnewitem.svg" />
                    </v-flex>
                  </td>
                </tr>
              </template>
              
            </table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Home",
  data: () => ({
    dates: ["2021-01-01"],
    reports: [],
    user: [],
    group:[],
    search: {
      date: "",
      user: "",
      dept: "",
      status: ""
    },
    departments: [],
    platforms: [],
    depts: [],
    users: [],
    modaldate: false,
    loading: false,
    message: ""
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "settings"]),
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
    checkItems() {
      return (this.reports.result)?this.reports.result:[];
    },
    getUsers(){
      return (this.users.result)?this.users.result:[];
    },
    isLabSpecific(){
      return this.settings && this.settings.general && this.settings.general.collapse_all_laboratory
    }
  },
  methods: {
    ...mapActions(["setSearch", "checkStorage"]),
    innitialize: function() {
      this.platforms = LS.get("platform");
      this.departments = LS.get("department");
      this.user = LS.get("user");
      this.group=LS.get('group');
      var today = new Date();
      var date =
        String(today.getFullYear()).padStart(2, "0") +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");
      this.search.user=this.user.department
      this.dates=[date]
    },
    changeDept: function(){
      this.users=[];
      this.loadUsers(this.search.dept);
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
          this.$Progress.finish();
        });
    },
    loadUsers: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        dept: (this.isLabSpecific)?'':this.user.department,
        has_lab: true,
        pageSize:0,
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
    loadReport: function() {
      this.$Progress.start();
      this.loading = true;
      
      this.search.date = this.dateRangeText,
      this.search.outlet = this.outlet.id;
      this.search.user = this.search.user;
      this.post(`/report/lab`, this.search)
      .then(resp => {
        if (resp.status > 0) {
          this.reports = resp.response;
        } else {
          this.$toastr.error(resp.message);
        }
      })
      .finally(() => {
        this.loading = false;
        this.$Progress.finish();
      });
    },
    vieResult: function(test){
      this.$router.push("/laboratory/patient/"+test.id)
    }
  },
  created() {
    this.checkStorage();
    this.innitialize();
  },
  mounted() {
    setTimeout(this.loadDepts, 100);
    setTimeout(this.loadUsers, 100);
    setTimeout(this.loadReport, 100);
  }
};
</script>
<style scoped></style>
