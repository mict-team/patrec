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
            <v-flex xs2>
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
            <v-flex xs2 v-if="platforms.id == 7">
              <label>Dept</label>
              <select class="form-control" v-model="search.dept">
                <option selected>Select requesting dept</option>
                <option
                  v-for="(dept, index) in depts"
                  :key="index"
                  :value="dept.id"
                  >{{ dept.name }}</option
                >
              </select>
            </v-flex>
            <v-flex xs2>
              <label>Technician</label>
              <select
                class="form-control"
                v-model="search.user"
                :readonly="!users"
              >
                <option>Test conducted by...</option>
                <option
                  v-for="(user, index) in users"
                  :key="index"
                  :value="user.id"
                  >{{ user.name }}</option
                >
              </select>
            </v-flex>
            <v-flex xs2>
              <label>Ready</label>
              <select class="form-control" v-model="search.status">
                <option>Is test result ready?</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </v-flex>
            <v-flex xs2 style="margin-top:32px;">
              <v-btn color="info" @click="searchReport"
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
              <tbody v-if="reports">
                <template v-if="loading">
                  <tr>
                    <td colspan="8">
                      <template v-if="loading">
                        <v-progress-circular
                          :size="50"
                          color="primary"
                          indeterminate
                        ></v-progress-circular
                        >Loading requests...
                      </template>
                    </td>
                  </tr>
                </template>
                <template v-else v-for="(pat, index) in reports">
                  <tr :class="pat.status == 0 ? 'red' : ''" :key="index">
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
                <td colspan="4">
                  <v-flex xs12 justify="left" style="text-align:center;">
                    <img src="../../assets/addnewitem.svg" />
                  </v-flex>
                </td>
              </tr>
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
    dates: ["2020-01-01"],
    reports: [],
    user: [],
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
    }
  },
  methods: {
    ...mapActions(["setSearch", "checkStorage"]),
    innitialize: function() {
      this.platforms = LS.get("platform");
      this.departments = LS.get("department");
      this.user = LS.get("user");
    },
    loadDepts: function() {
      this.get(`/dept/platform/3`)
        .then(response => {
          if (response.status > 0) {
            this.depts = response.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    loadUsers: function() {
      this.get(`/users/${this.departments.id}`)
        .then(response => {
          if (response.status > 0) {
            this.users = response.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    loadReport: function() {
      this.loading = true;
      var today = new Date();
      var date =
        String(today.getFullYear()).padStart(2, "0") +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");
      this.search.date = date;
      this.search.outlet = this.outlet.id;
      this.search.user = this.user.id;
      this.post(`/report/lab`, this.search)
        .then(response => {
          if (response.status > 0) {
            this.reports = response.response;
            this.$toastr.success(
              `Search completed with ${this.reports.length} records`
            );
          } else {
            this.$toastr.error(response.message);
          }
          this.loading = false;
        })
        .catch(e => {
          this.$toastr.error(e.message);
          this.loading = false;
        });
    },
    searchReport: function() {
      this.loading = true;
      this.search.outlet = this.outlet.id;
      this.search.user = this.user.id;
      this.post(`/report/lab/search`, this.search)
        .then(response => {
          if (response.status > 0) {
            this.reports = response.response;
            this.$toastr.success(
              `Search completed with ${this.reports.length} records`
            );
          } else {
            this.$toastr.error(response.message);
          }
          this.loading = false;
        })
        .catch(e => {
          this.$toastr.error(e.message);
          this.loading = false;
        });
    }
  },
  created() {
    this.checkStorage();
    this.innitialize();
  },
  mounted() {
    this.loadDepts();
    this.loadUsers();
    this.loadReport();
  }
};
</script>
<style scoped></style>
