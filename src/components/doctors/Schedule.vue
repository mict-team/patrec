<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title>Your daily schedules</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title red
        >{{ patients.total }} waiting
        patients</v-toolbar-title
      >
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap v-if="getSchedules.length > 0">
          <v-flex
            xs3
            v-for="(patient, index) in getSchedules"
            :key="index"
            @click="openPatient(patient)"
          >
            <base-button-card :avatar="patient.passport" :name="patient.name" :code="patient.code" :gender="patient.gender" />
            
          </v-flex>
        </v-layout>
        <v-layout row wrap v-else>
          <v-flex xs12>No schedules/appointment waiting.</v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-card v-if="getInconclusives.length>0">
      <v-toolbar row wrap>
        <v-toolbar-title>Unconcluded diagnosis</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title red>{{ inconclusives.total }} case(s)</v-toolbar-title>
      </v-toolbar>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <table class="table table-hover">
            <tbody>
              <tr v-for="(patient, index) in getInconclusives" :key="index" @click="openPatientInc(patient)" class="rowClick">
                <td>{{index + 1}}</td>
                <td>
                  <v-avatar size="70px" style="position:relative; top:-15px;">
                    <img src="../../assets/user.png" :alt="patient.name" />
                  </v-avatar>
                </td>
                <td>{{patient.code}}</td>
                <td>{{patient.name}}</td>
                <td>{{patient.gender}}</td>
                <td>Age</td>
              </tr>
            </tbody>
          </table>
          
        </v-layout>
      </v-container>
    </v-card>
    <v-card v-if="admissions.length>0">
      <v-toolbar row wrap>
        <v-toolbar-title>Pending admission requests</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title red>{{ admissions.length > 0 ? admissions.length : 0 }} pending requests</v-toolbar-title>
      </v-toolbar>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <template v-for="(request, index) in admissions">
            <v-flex xs3 :key="index">
                <v-card class="thumbnail">
                    <v-flex xs12 flexbox row wrap>
                        <v-flex xs5>
                            <v-avatar size="70px">
                            <img
                                :src="request.passport"
                                :alt="request.patient"
                            />
                            </v-avatar>
                            <br />
                            {{request.dob | toAge}}yrs {{ request.gender }}
                        </v-flex>
                        <div xs7 class="titles " style="text-align:left;">
                            
                            {{ request.patient }}<br />
                            <v-chip class="ma-2" color="blue" text-color="white">{{request.pat_code}}</v-chip>
                        </div>
                    </v-flex>
                    <v-flex xs12>{{ request.ward }}</v-flex>
                    <v-chip class="topBadge" color="transparent" text-color="white" v-if="request.available<1"><v-icon :color="request.available<1?'pink':''">cancel</v-icon></v-chip>
                </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "NewPatient",
  data: () => ({
    patients: [],
    inconclusives: [],
    admissions: [],
    schedules: [],
    user: [],
    dept: [],
    message: ""
  }),
  components: {},
  props: {
    source: String
  },
  computed: {
    ...mapState(["departments", "outlet", "search"]),
    getSchedules(){
      return this.patients.result?this.patients.result:[];
    },
    getInconclusives(){
      return this.inconclusives.result?this.inconclusives.result:[];
    }
  },
  methods: {
    ...mapActions(["setSearch", "checkStorage"]),
    innitialize: function() {
      this.user = LS.get("user");
      this.dept = LS.get("department");
      LS.remove("inconclusive");
      setTimeout(this.loadSchedules, 200);
      setTimeout(this.loadInconclusives, 200);
      setTimeout(this.loadAdmissonRequests, 200);
    },
    loadSchedules: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        action: 'loads',
        dept: (this.settings && this.settings.general && this.settings.general.central_nurses_station)?'':this.dept.id,
        search:'',
      }
      this.post(`/patient-med`, payload)
      .then(resp => {
        if (resp.status > 0) {
          this.patients = resp.response;
        }else{
          this.patients=[];
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      })
    },
    loadInconclusives: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        action: 'loads',
        dept: (this.settings && this.settings.general && this.settings.general.central_nurses_station)?'':this.dept.id,
        user: (this.settings && this.settings.general && this.settings.general.allow_cross_case_treatment)?'':this.user.id,
        search:'',
        inconclusive: 0,
      }
      this.post(`/patient-med`, payload)
      .then(resp => {
        if (resp.status > 0) {
          this.inconclusives = resp.response;
        }else{
          this.inconclusives=[];
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      })
    },
    loadAdmissonRequests: function() {
      this.$Progress.start();
        
      let payload={
        outlet: this.outlet.id,
        dept: this.dept.id,
        search:'',
        request: true,
        action:'request'
      }
      this.post("/wards", payload)
      .then(response => {
        if (response.status > 0) {
          this.admissions = response.response;
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },
    openPatient: function(schedule) {
      LS.set("admission", schedule.id);
      this.$router.push("/patient/"+ schedule.patient_id);
    },
    openPatientInc: function(schedule) {
      LS.set("inconclusive", true);
      LS.set("schedule", schedule);
      this.$router.push("/patient/"+ schedule.patient_id);
    }
  },
  beforeMount() {
    this.checkStorage();
  },
  mounted() {
    this.innitialize();
  }
};
</script>
<style scoped></style>
