<template>
  <v-container >
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title
        >{{ patient.basic.code }}({{ patient.basic.name }})</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn @click="saveSchedule" class="primary">Book Patient</v-btn>
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <template v-if="loading">
              <v-progress-circular
                :size="40"
                color="primary"
                indeterminate
              ></v-progress-circular
              >Loading pls...
            </template>
          <template v-else>
            <v-row>
              <v-col cols="12" md="8">
                <table class="table table-bordered ">
                  <tr>
                    <td colspan="3">{{ patient.basic.name }}</td>
                  </tr>
                  <tr>
                    <td>{{ patient.contact.phone }}</td>
                    <td colspan="2">{{ patient.contact.address }}</td>
                  </tr>
                  <tr>
                    <td>{{ patient.nextOfKin.name }}</td>
                    <td>{{ patient.nextOfKin.address }}</td>
                    <td>{{ patient.nextOfKin.phone }}</td>
                  </tr>
                </table>

                <table class="table table-bordered ">
                  <tr>
                    <td>
                      <label>Height</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="patient.medical.height"
                      />
                    </td>
                    <td>
                      <label>Blood Group</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="patient.medical.blood_group"
                      />
                    </td>
                    <td>
                      <label>Genotype</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="patient.medical.genotype"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <label>Allergies</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="patient.medical.allergy"
                      />
                    </td>
                    <td>
                      <label>Type</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="schedule.patientType"
                      />
                    </td>
                  </tr>
                </table>
              </v-col>
              <v-col row xs4 class="blue lighten-4">
                <v-row>
                  <v-col cols="12" md="12">
                    <label>Appointment Date</label>
                    <v-menu
                      v-model="modalApp"
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
                          v-model="appointment.date"
                          placeholder="Date of appointment"
                          v-on="on"
                          readonly
                        />
                      </template>
                      <v-date-picker
                        v-model="appointment.date"
                        @input="modalApp = false"
                        :landscape="true"
                        :relative="true"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col  cols="12" md="6">
                    <label>Body temperature</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="appointment.bodytemperature"
                    />
                  </v-col>
                  <v-col  cols="12" md="6">
                    <label>Pulse rate</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="appointment.pulserate"
                    />
                  </v-col>
                  <v-col  cols="12" md="6">
                    <label>Respiratory rate</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="appointment.respiratory"
                    />
                  </v-col>
                  <v-col  cols="12" md="6">
                    <label>Blood pressure</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="appointment.bloodpressure"
                    />
                  </v-col>
                  <v-col cols="12" md="6" v-if="isDeptCollapsed">
                    <label>Consulting Dept</label>
                    <v-select
                    v-model="appointment.dept"
                    :items="depts"
                    item-text="name"
                    item-value="id"
                    label="---"
                    @change="loadUsers"
                    dense
                    solo
                    />
                  </v-col>
                  <v-col  cols="12" :md="!isDeptCollapsed?12:6">
                    <label>Consulting Doctor</label>
                    <v-select
                    v-model="appointment.doctor"
                    :items="getDoctors"
                    item-text="name"
                    item-value="id"
                    label="---"
                    dense
                    solo
                    />
                    
                  </v-col>
                  <v-col  cols="12" md="12">
                    <label>Note</label>
                    <textarea
                      cols="20%"
                      rows="2"
                      class="form-control"
                      placeholder=""
                      v-model="appointment.remark"
                    ></textarea>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
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
  name: "PreSchedule",
  data: () => ({
    loading: false,
    user: [],
    schedule:"",
    patient: {basic:[], nextOfKin:[], contact:[], medical:[]},
    payments: [],
    departments: [],
    depts:[],
    appointment: {
      outlet: "",
      dept: "",
      date: new Date().toISOString().substr(0, 10),
      bodytemperature: "",
      pulserate: "",
      respiratory: "",
      bloodpressure: "",
      referenceNo: "",
      doctor: "",
      remark: ""
    },
    doctors: [],
    modalApp: false
  }),
  components: {},
  props: {
    source: String
  },
  computed: {
    ...mapState([
      "domain",
      "outlet",
      "search",
      "platforms",
      "users",
      "group",
      "today",
      "settings"
    ]),
    isDeptCollapsed(){
      return this.settings && this.settings.general && this.settings.general.central_nurses_station 
    },
    userMustPayBeforeService(){
      return this.settings && this.settings.general && this.settings.general.pay_before_service 
    },
    getDoctors() {
      return (this.doctors.result)?this.doctors.result:[];
    },
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      this.schedule = LS.get("schedule");
      //this.$toastr.error('deji')
      this.departments = LS.get("department");
      this.user = LS.get("user");
      setTimeout(this.loadPatient, 200);
      setTimeout(this.loadDepts, 200);
      //if(!this.isDeptCollapsed){
      //alert(this.schedule.dept_id)
      this.appointment.dept=this.schedule.dept_id;
      setTimeout(this.loadUsers, 200);
      //}
    },

    loadPatient: function() {
      this.loading=true;
      this.$Progress.start();
      this.get("/patients/search/" + this.schedule.patient_id)
        .then(response => {
          if (response.status > 0) {
            this.patient = response.response;
          }else{
            this.$toastr.error(response.message);
          }
        })
        .finally(() => {
          this.loading=false;
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
        }else{
          this.depts=[];
        }
      })
      .finally(() => {
        if(!this.isDeptCollapsed){
          let filter=this.depts.filter(x=>x.id=this.appointment.dept);
          if(filter){
            this.depts=filter;
          }
        }
        this.$Progress.finish();
      });
    },
    loadUsers: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        group: this.group.structure,
        dept: this.appointment.dept,
        pageSize:0,
        action: 'loads'
      }
      this.post(`/users`, payload)
      .then(resp => {
        if(resp.status>0){
          this.doctors = resp.response;
        }else{
          this.doctors=[]
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },

    cancelSchedule: function() {
      this.$router.push("/nurse/schedules");
    },
    saveSchedule: function() {
      this.$Progress.start();
      var postData = {
        schedule: this.schedule.id,
        outlet: this.outlet.id,
        dept: this.appointment.dept,
        patient: this.schedule.patient_id,
        nurse: this.users.id,
        book: this.appointment.date,
        remark: this.appointment.remark,
        user: this.user.id,
        vital: {
          temperature: this.appointment.bodytemperature,
          pulserate: this.appointment.pulserate,
          respiratory: this.appointment.respiratory,
          bloodpressure: this.appointment.bloodpressure
        }
      };
      //console.log(postData); return false;
      this.post("/patient-med", postData)
      .then(response => {
        if (response.status > 0) {
          this.$toastr.success(
            `${this.patient.basic.name} has been booked to see doctor.`
          );
          this.$router.push("/nurse/schedules");
        } else {
          this.$toastr.error(response.message);
        }
      })
      .finally(() => {
        //console.log(e);
        this.$Progress.finish();
      });
    }
  },
  created() {
    this.checkStorage();
    this.setDomain();
  },
  mounted() {
    this.innitialize();
  }
};
</script>
<style scoped></style>
