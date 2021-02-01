<template>
  <v-container>
    <v-toolbar row wrap>
      <v-toolbar-title>Bills</v-toolbar-title>
      <v-spacer></v-spacer>
      <button class="btn btn-info">Create bill</button>
      &nbsp;&nbsp;&nbsp;
    </v-toolbar>
    <v-card row wrap>
      <v-container grid-list-sm class="pa-4">
        <v-layout row>
          <table class="table table-hover">
            <thead>
              <tr>
                <th>SN</th>
                <th>Pat. No</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Ward</th>
                <th>Least amount</th>
                <th>Date of Admission</th>
                <th>Days spent</th>
                <th></th>
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
              <tbody v-if="getItems.length>0">
                <tr v-for="(pat, index) in getItems" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ pat.pat_code }}</td>
                  <td>{{ pat.name }}</td>
                  <td>{{ pat.gender }}</td>
                  <td>{{ pat.dob|toAge }}</td>
                  <td>{{pat.ward}}</td>
                  <td>{{pat.amount | toDecimal}}</td>
                  <td>{{pat.date_of_admission}}</td>
                  <td>{{pat.date_of_admission | toDays}}</td>
                  <td>
                    <v-chip class="ma-2" color="blue" text-color="white" @click="$router.push(`/almona/patient/${pat.id}`)">
                      Generate bill
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            <tr v-else>
            <td colspan="7">
              <v-flex xs12 style="text-align:center;">
                <img src="../../../assets/addnewitem.svg" />
              </v-flex>
            </td>
          </tr>
          </template>
          </table>
          <base-pagination :total="bills.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
        </v-layout>
      </v-container>
      
    </v-card>
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { URL, LS, APP, SHA256, IDGenerator } from "../../../shared/config.js";
export default {
  data: () => ({
    loading: false,
    page:1,
    pageSize:50,
    search:'',
    dept:'',
    depts:[],
    searched: [],
    bills: [],
    bill_dialog: false,
    searchStr: "",
    charges: [],
    filterCharges: [],
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState([
      "outlet",
      "today",
      "platforms",
      "departments",
      "paymentMethods",
      "transactions",
      "users",
      "settings"
    ]),
    getItems(){
      return (this.bills.result)?this.bills.result:[];
    }
  },
  methods: {
    ...mapActions(["getToday","checkStorage"]),
    loadPatientsOnAdmission:function(){
      this.$Progress.start();
      this.loading=true;
      let payload={
        outlet: this.outlet.id,
        page: this.page,
        pageSize: this.pageSize,
        search: this.search,
        dept: this.dept,
        action: 'loads'
      }
      this.post("/bills/patient/account", payload)
      .then(resp=>{
        if(resp.status>0){
          this.bills=resp.response;
        }else{
          this.$toastr.error(resp.message);
        }
      })
      .finally(()=>{
        this.loading=false;
        this.$Progress.finish();
      })
    },
    getPatientAga: function(dob){
      return 0;
    },
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search=pageItems.search;
      this.loadPatientsOnAdmission();
    },
  },
  beforeMount() {
    this.checkStorage();
  },
  mounted() {
    this.searched =this.$route.params.patient;// LS.get("searched");
    setTimeout(this.loadPatientsOnAdmission, 200);
  }
};
</script>
