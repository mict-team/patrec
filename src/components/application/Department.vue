<template>
  <v-container>
    <v-card>
      <v-toolbar class="grey lighten-4 title">
        <v-btn color="red" white-text @click="$router.go(-1)"
          ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
        >
        <v-toolbar-title>Departments</v-toolbar-title>

        <div class="flex-grow-1"></div>

        <v-btn class="primary" @click="addDept"><v-icon>add</v-icon>Add</v-btn>
      </v-toolbar>

      <v-container grid-list-sm class="pa-4">
        <v-layout row>
          <v-flex
            xs12
            v-infinite-scroll="scroll"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="10"
          >
            <table class="table">
              <thead>
                <tr>
                  <th width="10%">SN</th>
                  <th>Parent</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Has clinic</th>
                  <th>Has payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody v-if="departments">
                <tr v-for="(dept, index) in departments" :key="index">
                  <td width="10%">{{ index + 1 }}</td>
                  <td>{{ dept.parent }}</td>
                  <td>{{ dept.name }}</td>
                  <td>
                    <v-chip class="ma-2" color="red" text-color="white">{{dept.access_group}}</v-chip>
                  </td>
                  <td>
                    <v-chip class="ma-2" color="grey" text-color="white" v-if="dept.hasClinic == 0">No</v-chip>
                    <v-chip class="ma-2" color="green" text-color="white" v-if="dept.hasClinic == 1">Yes</v-chip>
                  </td>
                  <td>
                    <v-chip class="ma-2" color="grey" text-color="white" v-if="dept.hasPayment == 0">No</v-chip>
                    <v-chip class="ma-2" color="green" text-color="white" v-if="dept.hasPayment == 1">Yes</v-chip>
                  </td>
                  <td>
                    <v-chip class="ma-2" color="blue" text-color="white" @click="attemptUpdate(dept)"><v-icon>edit</v-icon>Edit</v-chip>
                    <v-chip class="ma-2" color="green" text-color="white" v-if="dept.status == 1" @click="updateStatus(dept, 0)"><v-icon>highlight_off</v-icon>Disable</v-chip>
                    <v-chip class="ma-2" color="red" text-color="white" v-if="dept.status == 0" @click="updateStatus(dept, 1)"><v-icon>offline_pin</v-icon>Activate</v-chip>
                    
                  </td>
                </tr>
              </tbody>
              <tr v-if="!departments || departments.length < 1">
                <td colspan="4">
                  <v-flex xs12 style="text-align:center;">
                    <img src="../../assets/addnewitem.svg" />
                  </v-flex>
                </td>
              </tr>
            </table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-dialog v-model="departmentDialog" persistent left top width="530px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          {{title}}
          <v-spacer></v-spacer>
          <v-btn @click="departmentDialog = false"
            >Cancel</v-btn
          >
          <v-btn color="primary" :disabled="newDepartment.name == '' || newDepartment.platform == ''" @click="saveRegistration"
            >Save</v-btn
          >
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row style="text-align: left !important;">
            <v-flex xs12>
              <label>Department name</label>
              <input
                type="text"
                class="form-control"
                v-model="newDepartment.name"
              />
            </v-flex>
            
            <v-flex xs6>
              <label>Has clinic</label>
              <v-select
                  v-model="newDepartment.hasClinic"
                  :items="hasClinic"
                  label="Does dept have clinic?"
                  dense
                  solo
              ></v-select>
              
            </v-flex>
            <v-flex xs6>
              <label>Payment</label>
              <v-select
                  v-model="newDepartment.hasPayment"
                  :items="hasClinic"
                  label="Does dept have tarrif?"
                  dense
                  solo
              ></v-select>
              
            </v-flex>
            <v-flex xs6>
              <label>Main Dept</label>
              <v-select
                  v-model="newDepartment.parent"
                  :items="getParentDepts"
                  item-text="name"
                  item-value="id"
                  label="Select parent dept"
                  dense
                  solo
              ></v-select>
            </v-flex>
            <v-flex xs6>
              <label>Access roles</label>
              <v-select
                  v-model="newDepartment.platform"
                  :items="roles"
                  item-text="name"
                  item-value="id"
                  label="Select access roles"
                  dense
                  solo
              ></v-select>
              
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
var fs = require("fs");
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
const image2base64 = require("image-to-base64");
var child_process = require("child_process");

export default {
  name: "Department",
  data: () => ({
    title: "New department",
    store: [],
    error: "",
    currentSession: [],
    loadingDialog: false,
    departmentDialog: false,
    departments: [],
    platforms: [],
    roles:[],
    newDepartment: {
      name: "",
      parent:"",
      type: "",
      hasClinic: "",
      hasPayment: "",
      platform: ""
    },
    search: "",
    paths: "",
    message: "",
    user: {}
  }),
  components: {},
  props: {
    source: String
  },
  computed: {
    ...mapState(["group", "users", "outlet"]),
    getParentDepts(){
      let depts=this.departments;
      if(this.group.structure=='facility'){
        depts=this.departments.filter(x=>x.id==this.users.department);
      }
      
      return depts;
    },
    hasPayments(){
      return ['Yes', 'No']
    }, 
    hasClinic(){
      return ['Yes', 'No']
    }
  },

  methods: {
    ...mapActions([
      "setSearch",
      "checkStorage",
      "addDepartment",
      "setDepartment"
    ]),
    loadDepartments: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        group: this.group.structure,
        parent: this.users.department,
        action: 'loads'
      }
      this.post("/dept", payload)
      .then(response => {
        if (response.status > 0) {
          this.departments = response.response;
        } else {
          this.$toastr.error(e.message);
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    loadAccessRoles: function() {
      this.$Progress.start();
      let url=(this.group.structure=='default')?`users-access`:`users-access/${this.group.id}`;
      
      this.post('users-access', {action:'loads', parent: this.group.id})
        .then(response => {
          if (response.status > 0) {
            this.roles = response.response;
          } else {
            this.$toastr.error(response.message);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    loadPlatforms: function() {
      this.get("/platforms").then(response => {
        if (response.status > 0) {
          this.platforms = response.response;
        } else {
          this.$toastr.error(e.message);
        }
      });
    },
    
    scroll() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight;

        if (bottomOfWindow) {
          alert("deji");
        }
      };
    },
    addDept: function() {
      this.title= "New department";
      this.loadAccessRoles();
      this.departmentDialog = true;
    },
    saveRegistration: function() {
      this.$Progress.start();
      this.newDepartment.hasClinic=(this.newDepartment.hasClinic=='No')?0:1;
      this.newDepartment.hasPayment=(this.newDepartment.hasPayment=='No')?0:1;
      this.newDepartment.outlet = this.outlet.id;
      this.newDepartment.user = this.user.id;
      this.newDepartment.action='save'
      //console.log(this.newDepartment); return;
      this.post("/dept", this.newDepartment)
      .then(response => {
        if (response.status > 0) {
          this.$toastr.success("Department registered successfully", "Success");
          //this.addDepartment(response.response);
          this.loadDepartments();
        } else {
          this.$toastr.error(response.message);
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    updateStatus: function(item, status) {
      this.$Progress.start();
      this.get(`/dept/update/${item.id}/${status}`)
      .then(response => {
        if (response.status > 0) {
          this.loadDepartments();
        } else {
          this.$toastr.error(e.message);
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    attemptUpdate: function(item) {
      this.title= `Edit ${item.name} department`
      this.newDepartment = item;
      this.loadAccessRoles();
      this.departmentDialog = true;
    },
    updateItem: function() {
      this.$Progress.start();
      this.newDepartment.action='update'
      this.post(`/dept/update`, this.newDepartment)
      .then(response => {
        if (response.status > 0) {
          this.$toastr.success("Update was successful");
        } else {
          this.$toastr.error(response.message);
        }
      })
      .finally(()=>{
        this.loadDepartments();
        this.$Progress.finish();
      });;
    }
  },
  beforeMount() {
    this.checkStorage();
    this.loadDepartments();
    this.user = LS.get("user");
  },

  mounted() {
    //this.scroll();
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
video {
  border: 1px solid transparent;
  width: 380px;
  height: 270px;
  background: black;
}
canvas {
  width: 380px;
  height: 270px;
  visibility: none;
}
.player {
  float: left;
  padding: 1em 1em 0.5em;
  border: 2px solid transparent;
  border-radius: 9px;
}
ul.menu {
  list-style: none;
  display: inset;
  width: 90%;
  height: 100%;
}
ul.menu li {
  min-height: 40px;
  cursor: pointer;
  width: 100%;
  font-style: uppercase;
  font-size: 22px;
  font-family: "Times new romans";
}
ul.menu li[first] {
  margin-top: 30px;
}
ul.menu li:hover {
  background-color: lightblue;
}
</style>
