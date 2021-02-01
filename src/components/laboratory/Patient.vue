<template>
  <v-container>
    <v-card>
      <v-container grid-list-sm id="printArea">
        <v-layout row wrap>
          <v-flex row>
            <v-flex xs3 class="grey lighten-4">
              <base-profile-panel :patient="patient" />
            </v-flex>
            <v-flex xs9>
              <v-toolbar row wrap>
                
                <v-toolbar-title>{{patient.basic.name}}</v-toolbar-title>
                <v-spacer />
                <v-btn class="red" @click="printpage"
                  ><v-icon>print</v-icon>Print</v-btn
                >
              </v-toolbar>
              <v-flex xs12>
                <v-layout>
                  <v-flex xs12>
                    <table class="table table-hover">
                      <tbody>
                        <tr>
                          <td>Request date: </td>
                          <td>{{tests.date}}</td>
                        </tr>
                        <tr>
                          <td>Request by: </td>
                          <td>{{tests.doctor}}</td>
                        </tr>
                        
                        <tr>
                          <td colspan="2">{{tests.test}}</td>
                        </tr>
                      </tbody>
                    </table>
                    <h3>Result status</h3>
                    <table class="table table-hover">
                      <tbody>
                        <tr>
                          <td>Result: </td>
                          <td>{{tests.result}}</td>
                        </tr>
                        <tr>
                          <td>Result date: </td>
                          <td>{{tests.dateR}}</td>
                        </tr>
                        <tr>
                          <td>Technician: </td>
                          <td>{{tests.technician}}</td>
                        </tr>
                        <tr>
                          <td>Status </td>
                          <td>
                            <v-chip class="ma-2" color="pink" outlined v-if="tests.status == 0" >NOT READY</v-chip>
                            <v-chip class="ma-2" color="green" outlined v-if="tests.status == 1" >AVAILABLE</v-chip>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <h3>Payment status</h3>
                    <table class="table table-hover">
                      <tbody>
                        <tr>
                          <td>Status </td>
                          <td>
                            <v-chip class="ma-2" color="pink" outlined v-if="tests.paid == 0" >UNPAID</v-chip>
                            <v-chip class="ma-2" color="green" outlined v-if="tests.paid == 1" >PAID</v-chip>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                  </v-flex>
                  <v-flex xs12>
                    <v-img :src="getImage" />
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import { LS, PrintPage } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";

export default {
  name: "Patient",

  data: () => ({
    addPrescription: false,
    payments: [],
    tests: "",
    testId:'',
    patientId:'',
    patient: []
  }),
  components: {},
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet", "search", "patients", "patCode", "today"]),
    getImage(){
      return `${this.outlet.resourceDomain}/${this.tests.file}`;
    },
  },
  methods: {
    ...mapActions(["checkStorage"]),
    innitialize: function() {
      console.log(this.outlet)
      this.testId = this.$route.params.patient;;
    },
    loadPatient: function(){
      this.$Progress.start();
      this.get("/patients/search/"+ this.patientId)
      .then(response => {
          if (response.status > 0) {
            this.patient=response.response;
          }
      })
      .finally(() => {
          this.$Progress.finish();
      });
    },
    loadPatientTest: function(){
      let payload= {
        test: this.testId,
        action:'byTest'
      }
      this.post("/patient/lab-request", payload)
      .then(resp=>{
        if(resp.status>0){
          this.tests=resp.response
        }else{
          this.$toastr.error(resp.message);
        }
      })
      .finally(()=>{
        this.$Progress.finish();
        if(this.tests){
          this.patientId=this.tests.patient_id;
          this.loadPatient();
        }
      })
    },
    printpage: function(){
      PrintPage('printArea')
    }
  },
  mounted() {
    this.checkStorage();
    this.innitialize();
    setTimeout(this.loadPatientTest, 200);
  }
};
</script>
<style scoped>
.child-container {
  width: 100% !important;
  margin: 5px 0px 0px -20px;
  padding: 0px !important;
  background-color: #fff;
}
.right {
  color: blue;
  text-align: right;
}
.header-text {
  font-size: 20px;
  font-weight: bold;
  color: grey;
}
</style>
