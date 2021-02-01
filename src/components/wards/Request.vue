<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red"><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn>
      <v-toolbar-title>Admission requests</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title>{{ getRequests.length > 0 ? getRequests.length : 0 }} waiting request</v-toolbar-title>
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
    <v-dialog v-model="requestDialog" left top persistent width="600px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Assign space for {{ getSelectedRequests.patient }}
          <v-spacer></v-spacer>
          <v-btn @click="requestDialog = false">Cancel</v-btn>
          <v-btn class="primary" @click="assignSpace">Assign space</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12>Patient Detail</v-flex>
            <v-flex xs12>{{getSelectedRequests.patient }} <v-chip class="ma-2" color="blue" text-color="white">{{getSelectedRequests.pat_code}}</v-chip>{{getSelectedRequests.dob | toAge}}yrs {{getSelectedRequests.gender}}</v-flex>
            
            <v-flex xs12>
              <table class="table">
                <tr>
                  <th width="40%">Ward name</th>
                  <th>Capacity</th>
                  <th>Free space</th>
                  <th><v-chip class="ma-2" color="blue" text-color="white" @click="changeWardButton=!changeWardButton">Assign another ward</v-chip></th>
                </tr>
                <tr>
                  <td>{{getSelectedRequests.ward}}</td>
                  <td>{{getSelectedRequests.capacity}}</td>
                  <td>{{getSelectedRequests.available}}</td>
                  <td>
                    <v-select
                      v-if="changeWardButton"
                      v-model="changedWard"
                      :items="wards"
                      item-text="name"
                      item-value="id"
                      :item-disabled="[0]"
                      label="Select admission ward"
                      :return-object="true"
                      @change="updateWard"
                      dense
                      solo
                    />
                  </td>
                </tr>
              </table>
            </v-flex>
            <v-divider />
            <template v-if="changeWardButton">
              <v-flex xs12>
                <label>Reason for declinig request</label>
                <textarea
                  class="form-control medical-note"
                  cols="100%"
                  rows="3%"
                  v-model="selectedRequest.remark"
                ></textarea>
              </v-flex>
            </template>
            <template v-if="attachBillButton">
              <v-flex xs12>
                  <base-mict-combo-box :items="getCharges" @select="selectCharge" />
                </v-flex>
                <v-flex xs12>
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Desc</th>
                        <th>Qty</th>
                        <th>Amount</th>
                        <th>Total</th>
                        <th width="2%"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(b, index) in getBillsItems" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ b.name }}</td>
                        <td>1</td>
                        <td>{{ b.amount }}</td>
                        <td>{{ b.amount * 1 | toDecimal}}</td>
                        <td class="red"><v-icon class="white--text" @click="removeItem(b)">delete</v-icon></td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colspan="4" style="text-align: right;">Payable</th>
                        <th>{{ getChargeTotal | toDecimal }}</th>
                        <th></th>
                      </tr>
                    </tfoot>
                  </table>
                </v-flex>
            </template>
          </v-layout>
        </v-container>
        <v-card-title class="grey lighten-4 py-4 title">
          Request by: {{ selectedRequest.doctor }}
          <v-spacer></v-spacer>
          <v-btn class="danger" @click="showCharges">{{showChargesLable}}</v-btn>
        </v-card-title>
      </v-card>
    </v-dialog>
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
    showChargesLable: "Attach bill items",
    charges:[],
    user: [],
    dept: [],
    departments: [],
    selectedRequest:[],
    selectedCharges:[],
    wards:[],
    changedWard: '',
    loading: true,
    requestDialog: false,
    changeWardButton: false,
    attachBillButton: false
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
    getChargeTotal() {
      return this.selectedCharges.reduce(function(sum, b) {
        //console.log(sum + (1 * b.amount))
        return (sum + (1 * b.amount));
      }, 0);
    },
    getBillsItems(){
      return this.selectedCharges
    },
    getCharges(){
      return this.charges;
    }
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      this.departments = LS.get("department");
      this.settings = LS.get("settings");
      setTimeout(this.loadRequests, 200);
      setTimeout(this.loadWards, 200);
      setTimeout(this.loadCharges, 200);
    },
    loadRequests: function() {
        this.$Progress.start();
        
        let payload={
          outlet: this.outlet.id,
          dept: (this.settings && this.settings.general && this.settings.general.central_nurses_station)?'':this.departments.id,
          search:'',
          request: true,
          action:'request'
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
    loadWards: function() {
      this.$Progress.start();
      this.get("/wards")
        .then(resp => {
          if (resp.status > 0) {
            this.wards = resp.response
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    loadCharges: function(dept) {
      this.$Progress.start();
      let payload={
        page:0,
        dept: this.selectedRequest.admission_ward,
        outlet: this.outlet.id,
        action:'loads'
      }
      this.post(`/charges`, payload)
      .then(response => {
        if (response.status > 0) {
          this.charges=response.response.result;
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    showCharges: function(){
      if(!this.attachBillButton){
        this.showChargesLable="Remove charges";
        this.attachBillButton=true
      }else{
        this.showChargesLable="Attach bill items";
        this.attachBillButton=false
        this.selectedCharges=[];
      }
    },
    selectCharge: function(charge){
      this.selectedCharges.push(charge.item);
      //console.log(this.selectedCharges)
    },
    openRequest: function(request) {
        this.selectedRequest=request;
        this.selectedCharges=[];
        this.requestDialog=true;
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
