<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)" white-text
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>List of selling locations</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-btn class=" primary" @click="addPointDialog = true">Add point</v-btn>
      <v-btn class=" primary" @click="transfer">Transfer</v-btn>
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout row>
          <v-flex xs12>
            <template v-if="loading">
              <v-progress-circular
                  :size="30"
                  color="primary"
                  indeterminate
                ></v-progress-circular
                >Loading pls...
            </template>
            <template v-else>
              <table class="table">
                <thead>
                  <tr>
                    <th>SN</th>
                    <th>Name</th>
                    <th>Contact No</th>
                    <th>Contact Address</th>
                    <th>Pharmacist incharge</th>
                    <th>Contact Number</th>
                    <th>Number of products</th>
                    <th></th>
                  </tr>
                </thead>
                <template v-if="stores.length>0">
                  <tbody>
                    <template v-for="(location, index) in stores">
                      <tr :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ location.sku }}</td>
                        <td>{{ location.name }}</td>
                        <td>{{ location.contact_address }}</td>
                        <td>{{ location.user?location.user.name:''}}<br><small class="rowClick" @click="assignUser(location.id)">Assign pharmacist</small></td>
                        <td>{{ location.user?location.user.phone:'' }}</td>
                        <td>{{ location.total }}</td>
                        <td>
                          <v-chip class="ma-2" color="blue" text-color="white" @click="viewLocation(location)">
                            <v-icon>remove_red_eye</v-icon>View drugs
                          </v-chip>
                        </td>
                        <td>
                          <v-chip class="ma-2" color="blue" text-color="white" @click="editItem(location)">
                            <v-icon>edit</v-icon>Edit
                          </v-chip>
                          <v-chip class="ma-2" color="pink" text-color="white" v-if="location.status == 1" @click="disableItem(location, 0)">
                            <v-icon>highlight_off</v-icon>Disable
                          </v-chip>
                          <v-chip class="ma-2" color="green" text-color="white" v-if="location.status == 0" @click="disableItem(location, 1)">
                            <v-icon>offline_pin</v-icon>Enable
                          </v-chip>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="7">
                      <v-flex xs12 style="text-align:center;">
                        <img src="../../assets/addnewitem.svg" />
                      </v-flex>
                    </td>
                  </tr>
                </template>
              </table>
            </template>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-dialog v-model="addPointDialog" left top persistent width="500px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          New selling point
          <v-spacer></v-spacer>
          <v-btn @click="addPointDialog = false">Close</v-btn>
          <v-btn class="primary" @click="addPoint">Add point</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row>
            <v-flex xs12>
              <label>Location name</label>
              <input
                type="text"
                class="form-control"
                v-model="newDepartment.name"
              />
            </v-flex>
            <v-flex xs6>
              <label>Contact address</label>
              <input
                type="text"
                class="form-control"
                v-model="newDepartment.address"
              />
            </v-flex>
            <v-flex xs6>
              <label>Contact Phone</label>
              <input
                type="text"
                class="form-control"
                v-model="newDepartment.phone"
              />
            </v-flex>
            <v-flex xs12>
              <label>User</label>
              <v-select
                  v-model="newDepartment.user"
                  :items="users"
                  label="Attach user to location"
                  item-text="name"
                  item-value="id"
                  dense
                  solo
                  ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addUserToPointDialog" left top persistent width="500px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Assing user to {{editLocation.name}}
          <v-spacer></v-spacer>
          <v-btn @click="addUserToPointDialog = false">Close</v-btn>
          <v-btn class="primary" @click="reassignUserToPoint">Assign selected user</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row>
            <v-flex xs12>
              <label>Location name</label>
              <input
                type="text"
                class="form-control"
                v-model="editLocation.name"
                readonly
              />
            </v-flex>
            
            <v-flex xs12>
              <label>User</label>
              <v-select
                  v-model="editLocation.user"
                  :items="users"
                  label="Attach user to location"
                  item-text="name"
                  item-value="id"
                  dense
                  solo
                  ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="authDialog" persistent left top width="400px">
      <v-card>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap align-center>
            <base-authorization @authUser="authUser" @closeAuth="closeAuth" />
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Mainstore",
  data: () => ({
    loading: false,
    authDialog: false,
    addPointDialog: false,
    addUserToPointDialog: false,
    activeStore: 0,
    pageSize: 50,
    location:0,
    page:1,
    group:[],
    stores: [],
    users:[],
    editLocation:{
      name: "",
      user: ""
    },
    newDepartment: {
      name: "",
      address: "",
      phone: "",
      user: ""
    }
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet", "departments"]),
  },
  methods: {
    ...mapActions(["checkStorage"]),
    loadLocation: function(){
      this.$Progress.start();
      this.loading=true;
      let payload={
        outlet: this.outlet.id
      }
      this.post("locations", payload)
      .then(resp=>{
        this.stores=resp.response;
      })
      .finally(()=>{
        this.$Progress.finish();
        this.loading=false;
      })
    },
    loadUsers: function(){
      this.$Progress.start();
      let payload={
        group: this.group.structure,
        dept: this.departments.id,
        outlet: this.outlet.id,
        action:'loads'
      }
      this.post("/users", payload)
      .then(resp=>{
        if(resp.status>0){
          this.users=resp.response.result;
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      })
    },
    viewLocation: function(location){
      this.$router.push("locations/detail/"+location.id);
    },
    transfer: function() {
      this.$router.push("/pharmacy/stock-transfer");
    },
    authUser: function(auth) {
      if (auth) {}
    },
    closeAuth: function() {
      this.authDialog = false;
    },
    editItem: function(item) {
      this.updateDrug = item;
      this.updateDrug.action = "edit";
      this.authDialog = true;
    },
    disableItem: function(item, status) {
      this.updateDrug = item;
      this.updateDrug.action = "disable";
      this.authDialog = true;
    },
    addPoint: function() {
      this.$Progress.start();
      this.newDepartment.outlet = this.outlet.id;
      this.newDepartment.action = "save";
      this.post("/locations", this.newDepartment)
      .then(response => {
        if (response.status > 0) {
          this.loadDrugs();
          this.$toastr.success("Selling point registered successfully");
          this.newDepartment = {
            name: "",
            address: "",
            phone: "",
            user: ""
          };
          this.addPointDialog=false;
        } else {
          this.$toastr.error(response.message);
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    reassignUserToPoint:function(){
      this.$Progress.start();
      let payload={
        id: this.location,
        user: this.editLocation.user,
        action: 'assignUser'
      }
      this.post("/locations", payload)
      .then(resp => {
        if (resp.status > 0) {
          //alert(resp.status)
          this.$toastr.success(resp.message);
          this.addUserToPointDialog=false;
          this.loadDrugs();
        } else {
          this.$toastr.error(resp.message);
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    assignUser: function(location){
      this.location=location;
      let index=this.stores.findIndex(x=>x.id==location);
      if(index>-1){
        this.editLocation=this.stores[index];
      }
      this.addUserToPointDialog=true;
    }
  },
  created() {
    this.checkStorage();
  },
  mounted() {
    this.group=LS.get('group')
    setTimeout(this.loadLocation, 200);
    setTimeout(this.loadUsers, 200);
  }
};
</script>

<style scoped>
.rowClick{
  cursor: pointer;
  color: red;
}
</style>
