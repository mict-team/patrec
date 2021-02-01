<template>
    <v-container>
        <v-toolbar row wrap>
        <v-btn color="red"><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn>
        <v-toolbar-title>Discharge requests</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title>{{ getRequests.length > 0 ? getRequests.length : 0 }} pending request</v-toolbar-title>
        </v-toolbar>
        <v-card>
            <v-container grid-list-sm class="pa-4">
                <v-layout row wrap>
                    <v-flex row>
                        <v-layout row wrap v-if="getRequests.length>0">
                            <template v-for="(request, index) in getRequests">
                                <v-flex xs3 :key="index" @click="openRequest(request)">
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
                        <v-layout row wrap v-else>
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
  name: "WardRequest",
  data: () => ({
    settings: [],
    requests: [],
    charges:[],
    user: [],
    dept: [],
    departments:[],
    selectedRequest:[],
    selectedCharges:[],
    loading: true,
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "search", "users"]),
    getRequests(){
        return this.requests;
    },
    getSelectedRequests(){
        return this.selectedRequest;
    },
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      this.departments = LS.get("department");
      this.settings = LS.get("settings");
      setTimeout(this.loadRequests, 200);
    },
    loadRequests: function() {
        this.$Progress.start();
        let payload={
          outlet: this.outlet.id,
          dept: (this.settings && this.settings.general && this.settings.general.central_nurses_station)?'':this.departments.id,
          search:'',
          request: true,
          action:'discharge'
        }
        this.post("/wards", payload)
        .then(response => {
          if (response.status > 0) {
            this.requests = response.response;
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    
    openRequest: function(request) {
        //this.selectedRequest=request;
        //console.log(request)
        this.$router.push(`/wards/discharge/${request.medical}`)
    },
    updateWard: function(){
      let index=this.wards.findIndex(x=>x.id==this.changedWard.id);
      if(index>-1){
        this.selectedRequest.admission_ward=this.wards[index].id;
        this.selectedRequest.ward=this.wards[index].name;
        this.selectedRequest.capacity=this.wards[index].capacity;
      }
    },
    assignSpace: function(){
      this.$Progress.start();
      this.selectedRequest.action='assign';
      this.selectedRequest.charges=this.selectedCharges;
      let payload=this.selectedRequest;
      payload.outlet=this.outlet.id;
      payload.user=this.users.id;
      payload.passport='';
      this.post('/wards', payload)
      .then(resp=>{
        if (resp.status > 0) {
          let index=this.requests.findIndex(x=>x.id=this.selectedRequest.id);
          if(index>-1){
            this.requests.splice(index, 1)
          }
          this.requestDialog=false;
          this.$toastr.success(resp.message);
        }else{
          this.$toastr.error(resp.message);
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      })
    },
    removeItem: function(item){
      let index=this.selectedCharges.findIndex(x=>x.id=item.id);
      if(index>-1){
        this.selectedCharges.splice(index,1);
      }
    }
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
  }
};
</script>
<style scoped></style>
