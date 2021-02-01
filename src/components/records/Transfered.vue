<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)"
        ><v-icon white-text>keyboard_arrow_left</v-icon
        ><span>Back</span></v-btn
      >
      <v-toolbar-title>Transfered patients</v-toolbar-title>
      <v-spacer />
      <v-btn class="primary" @click="$router.push('/record/transfer-patient')"
        ><v-icon>assignment_ind</v-icon>Transfer req. Form</v-btn
      >
      <v-btn class="red" :disabled="!patients" @click="printpage"
        ><v-icon>print</v-icon>Print</v-btn
      >
    </v-toolbar>
    <v-card>
      
      <v-container grid-list-sm class="pa-4">
        <v-layout>
          <v-flex xs12 row>
            <v-flex xs4>
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
            <v-flex xs4>
              <label>Transfer to</label>
              <v-select
                v-model="search.from_"
                :items="facilities"
                item-text="name"
                item-value="id"
                label="Select facility"
                dense
                solo
              ></v-select>
              
            </v-flex>

            <v-flex xs2>
              <label>Type</label>
              <v-select
                v-model="search.type"
                :items="[{id:0, name:'Transfered Patient'}]"
                item-text="name"
                item-value="id"
                label="Select facility"
                dense
                solo
              ></v-select>
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
                  <th>Facility</th>
                  <th>Dept</th>
                  <th>Severity</th>
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
                  <tr
                    v-for="(pat, index) in checkItems"
                    :key="index"
                    @click="viewPatient(pat)"
                    >
                    <td>{{ index + 1 }}</td>
                    <td>{{ pat.code }}</td>
                    <td>{{ pat.name }}</td>
                    <td>{{ pat.gender }}</td>
                    <td>{{ pat.dob }}</td>
                    <td>{{ pat.facility }}</td>
                    <td>{{ pat.dept }}</td>
                    <td>{{ pat.severe }}</td>
                    <td>{{ pat.date }}</td>
                  </tr>
                </tbody>
                <tr v-else>
                  <td colspan="9">
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
    <base-pagination :total="patients.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
  </v-container>
</template>
<script>
import { URL, LS, SHA256, DownloadCSV, PrintDoc } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Home",
  data: () => ({
    dates: ["2019-09-10", "2019-09-20"],
    patients: [],
    page:1,
    pageSize:50,
    facilities: [],
    modaldate: false,
    loading: true,
    isSearchInnitiated: false,
    message: "",
    search: {
      date: "",
      user: "",
      to_: "",
      type: "",
      page:1,
      pageSize:50
    }
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "users"]),
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
    checkItems() {
      return this.patients;//.result;
    }
  },
  methods: {
    loadDepts: function() {
      //this.postOnline("http://mict.local/revenue/licenses/confirm", payload)
      this.$Progress.start()
      this.get("/outlets/"+this.users.id)
      .then(resp => {
        this.facilities = resp.response;
      })
      .finally(() => {
        this.$Progress.finish();
        this.searchRecord();
      });
    },

    searchRecord: function() {
      this.$Progress.start();
      this.loading = true;
      this.search.date = this.dateRangeText;
      this.search.outlet = this.outlet.id;
      this.search.page=this.page;
      this.search.pageSize=this.pageSize;
      this.search.action='transfer'
      this.post("/transfer", this.search)
      .then(resp => {
        if (resp.status > 0) {
          this.patients = resp.response;
        } else {
          this.$toastr.error(resp.message);
        }
      })
      .finally(() => {
        this.isSearchInnitiated=true;
        this.loading = false;
        this.$Progress.finish();
      });
    },
    download: function() {
      DownloadCSV({ data: this.patients });
    },
    printpage: function() {
      PrintDoc(this.$el);
    },
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search=pageItems.search;
      this.loadDrugs();
    },
    viewPatient: function(patient) {
      LS.set("searched", patient);
      this.$router.push("view-patient");
    }
  },
  mounted() {
    this.loadDepts();
    this.platform = LS.get("platform");
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
    setTImeout(this.searchRecord, 200);
  }
};
</script>
<style scoped></style>
