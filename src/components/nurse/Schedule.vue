<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title>Your daily schedules</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title
        >{{ schedules.total }} waiting
        patients</v-toolbar-title
      >
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex row>
            <template v-if="loading">
              <v-progress-circular
                :size="40"
                color="primary"
                indeterminate
              ></v-progress-circular
              >Loading pls...
            </template>
            <template else>
              <v-layout row wrap v-if="getItems.length>0">
                <template v-for="(schedule, index) in getItems">
                  <v-flex
                    xs3
                    v-if="
                      settings &&
                        settings.general &&
                        settings.general.pay_before_service 
                    "
                    :key="index"
                    @click="openPatient(schedule)"
                  >
                    <base-button-card :avatar="schedule.passport" :name="schedule.basic.name" :code="schedule.basic.code" :gender="schedule.basic.gender" :disable="schedule.paid == 1" />
                    
                  </v-flex>
                  
                </template>
              </v-layout>
              <v-layout row wrap v-else>
                <v-flex xs12 style="text-align:center;">
                  <img src="../../assets/addnewitem.svg" />
                </v-flex>
              </v-layout>
            </template>
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
    settings: [],
    patient: [],
    schedules: [],
    user: [],
    dept: [],
    departments: [],
    platforms: [],
    loading: true
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "search", "users", "group"]),
    getItems(){
      return this.schedules.result?this.schedules.result:[];
    }
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      this.departments = LS.get("department");
      this.platforms = LS.get("platform");
      this.settings = LS.get("settings");
      //console.log(this.settings);
      
    },
    getPicture: function(item){
      return(item.passport)?`${this.outlet.resourceDomain}/${item.passport}`:'../../assets/user.png';
    },
    loadSchedules: function() {
      this.loading=true;
      this.$Progress.start();
      //let url = ;
      /*if (this.group.structure =='facility') {
        if(this.settings && this.settings.general && this.settings.general.central_nurses_station){
          url = `${url}`;
        }else{
          url = `${url}/${this.departments.id}`;
        }
      } else {
        url = `${url}/${this.group.structure}`;
      }*/
      let payload={
        outlet: this.outlet.id,
        action: 'loads',
        paid: (this.settings && this.settings.general && this.settings.general.pay_before_service)?true:false,
        dept: (this.settings && this.settings.general && this.settings.general.central_nurses_station)?'':this.departments.id,
        search:''
      }
      this.post("/schedule", payload)
        .then(resp => {
          if (resp.status > 0) {
            this.schedules = resp.response;
          }else{
            this.schedules=[];
            this.$toastr.error(e.message);
          }
        })
        .finally(() => {
          //console.log(this.schedules)
          this.loading=false;
          this.$Progress.start();
        });
    },
    openPatient: function(schedule) {
      LS.remove("saved");
      LS.set("schedule", schedule);
      this.$router.push("/nurse/preschedule");
    }
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    LS.remove("schedule");
    //console.log(this.group)
    this.innitialize();
    setTimeout(this.loadSchedules, 100);
  }
};
</script>
<style scoped></style>
