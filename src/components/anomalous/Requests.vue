<template>
  <v-container>
    <v-card>
      <v-toolbar row wrap>
        <v-btn color="red" @click="$router.go(-1)" white-text
          ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
        >
        <v-toolbar-title>Transfer requests</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="primary" @click.stop="searchDialog = true"
          ><v-icon>search</v-icon>Search</v-btn
        >
        <v-btn class="danger" @click="printPage"
          ><v-icon>mdi-printer</v-icon>Print</v-btn
        >
      </v-toolbar>

      <v-container grid-list-sm class="pa-4">
        <v-layout row>
          <v-flex xs12>
            <table class="table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>Transfer to</th>
                  <th>Approved by</th>
                  <th>Approval status</th>
                  <th>User</th>
                  <th></th>
                </tr>
              </thead>
              <tbody v-if="checkItems && checkItems.length > 0">
                <tr v-for="(item, index) in checkItems" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.date }}</td>
                  <td>{{ item.patient }}</td>
                  <td>{{ item.transfer_to }}</td>
                  <td>{{ item.approved_by }}</td>
                  <td>{{ item.approved_status }}</td>
                  <td>{{ item.user }}</td>
                  <td></td>
                </tr>
              </tbody>
              <tr v-else>
                <td colspan="8">
                  <v-flex xs12 style="text-align:center;">
                    <img src="../../assets/addnewitem.svg" />
                  </v-flex>
                </td>
              </tr>
            </table>
          </v-flex>
        </v-layout>
        <base-pagination :total="patients.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
      </v-container>
    </v-card>
    <v-dialog v-model="searchDialog" persistent left top width="600px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Search
          <v-spacer></v-spacer>
          <v-btn @click="searchDialog = false">Close</v-btn>
          <v-btn class="primary" @click="loadReport">Search</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row>
            <v-flex xs12>
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
            <v-flex xs12>
              <label>To?</label>
              <v-select
                v-model="search.to_"
                :items="outlets"
                item-text="name"
                item-value="id"
                label="Select dept"
                :disabled="!outlets"
                dense
                outlined
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { URL, LS, SHA256, IDGenerator } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "General",
  data: () => ({
    loading: false,
    searchDialog: false,
    modaldate: false,
    page:1,
    pageSize:50,
    dates: [new Date().toISOString().substr(0, 10)],
    search: {
      date: "",
      to_:"",
      status: ""
    },
    users: [],
    outlets: [],
    patients: []
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet"]),
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
    checkItems() {
      return this.patients.result;
    }
  },
  methods: {
    ...mapActions(["checkStorage"]),
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search=pageItems.search;
      this.loadReport();
    },
    printPage: function() {
      this.$htmlToPaper("printMe");
    },
    loadDepts: function(){
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        has_clinic: 1,
        action: 'general'
      }
      this.post("/dept", payload)
      .then(resp => {
        if (resp.status > 0) {
          this.depts = resp.response;
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    loadReport: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        from:this.search.to_,
        date: this.dateRangeText,
        dept: this.search.dept,
        status: this.search.status,
        action:"transfer"
      }
      this.post("/transfer", payload)
      .then(resp=>{
        if(resp.status>0){
          this.patients=resp.response;
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      })
    }
  },
  mounted() {
    this.checkStorage();
    this.user = LS.get("user");
    setTimeout(this.loadDepts, 200);
    setTimeout(this.loadReport, 200);
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
