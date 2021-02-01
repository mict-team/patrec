<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title>Onbed Patients</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title red
        >{{
          schedules.length > 0 ? this.schedules.length : 0
        }}
        patients</v-toolbar-title
      >
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex row>
            <v-layout row wrap v-if="patients.length > 0">
              <v-flex
                xs3
                v-for="(patient, index) in patients"
                :key="index"
                @click="openPatient(patient)"
                >
                <v-card class="thumbnail">
                  <v-flex xs12 flexbox row wrap class="pt-4">
                    <v-flex xs4>
                      <v-avatar
                        size="70px"
                        style="position:relative; top:-15px;"
                      >
                        <img src="../../assets/user.png" :alt="patient.name" />
                      </v-avatar>
                    </v-flex>
                    <div xs8 style="text-align:left;">
                      Patrec Code:{{ patient.code }}<br />
                      Name:{{ patient.name }}<br />Gender: {{ patient.gender
                      }}<br />
                      Ward:{{ patient.ward }}
                    </div>
                  </v-flex>
                </v-card>
              </v-flex>
            </v-layout>
            <v-layout v-else>
              <v-flex xs12 style="text-align:center;">
                <img src="../../assets/addnewitem.svg" />
              </v-flex>
            </v-layout>
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
  name: "NewPatient",
  data: () => ({
    loading: false,
    patients: [],
    schedules: [],
    user: [],
    dept: []
  }),
  components: {},
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "search"])
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      this.user = LS.get("user");
      this.dept = LS.get("department");
      console.log(this.dept);
    },
    loadSchedules: function() {
      this.loading=true;
      this.$Progress.start();
      let payload={
          outlet: this.outlet.id,
          date: this.dateRangeText,
          dept: (this.settings && this.settings.general && this.settings.general.central_nurses_station)?'':this.dept.id,
          user: (this.settings && this.settings.general && this.settings.general.allow_cross_case_treatment)?'':this.user.id,
          search:'',
          action:'on-bed',
      }
      this.post("/wards", payload)
      .then(resp=>{
          if(resp.status>0){
              this.patients=resp.response;
          }
      })
      .finally(()=>{
          this.loading=false;
          this.$Progress.finish();
      })
    },
    openPatient: function(schedule) {
      LS.set("schedule", schedule);
      this.$router.push("/patient");
    }
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
    this.loadSchedules();
  }
};
</script>
<style scoped></style>
