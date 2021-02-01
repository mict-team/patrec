<template>
    <v-container>
        <v-card>
        <v-toolbar>
            <v-btn color="red" @click="$router.go(-1)"><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn>
            <v-toolbar-title> HMOs</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn class="primary" @click="departmentDialog = true">
            <v-icon>add</v-icon> Add HMO</v-btn>
        </v-toolbar>

        <v-container grid-list-sm class="pa-4">
            <v-layout row>
                <v-flex xs12>
                    <table class="table">
                    <thead>
                        <tr>
                        <th width="10%">SN</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    
                    <tbody v-if="schemes">
                        <tr v-for="(scheme, index) in schemes" :key="index">
                            <td width="10%">{{ index + 1 }}</td>
                            <td>{{ scheme.name }}</td>
                            <td>
                            <v-chip class="ma-2" color="grey" text-color="white" >{{ scheme.mobile }}</v-chip></td>
                            <td>
                            {{scheme.address}}
                            </td>
                            <td>
                                <v-chip class="ma-2" color="green" text-color="white" v-if="scheme.status == 1" >Active</v-chip>
                                <v-chip class="ma-2" color="pink" text-color="white" v-if="scheme.status == 0">Disabled</v-chip>
                            </td>
                            <td>
                            <v-chip class="ma-2" color="blue" text-color="white" @click="editWard(scheme)"><v-icon>edit</v-icon>Edit</v-chip>
                            <v-chip class="ma-2" color="green" text-color="white" v-if="scheme.status == 1" @click="deactivate(scheme, 0)"><v-icon>highlight_off</v-icon>Disable</v-chip>
                            <v-chip class="ma-2" color="pink" text-color="white" v-if="scheme.status == 0" @click="deactivate(scheme, 1)"><v-icon>offline_pin</v-icon>Activate</v-chip>
                            
                            
                            </td>
                        </tr>
                        </tbody>
                        <tfoot v-if="!schemes || schemes.length < 1">
                            <tr>
                            <td colspan="4">
                                <v-flex xs12 style="text-align:center;">
                                <img src="../../assets/addnewitem.svg" />
                                </v-flex>
                            </td>
                            </tr>
                        </tfoot>
                    </table>
                </v-flex>
            </v-layout>
        </v-container>
        </v-card>
        <v-dialog v-model="departmentDialog" left top width="430px">
            <v-card>
                <v-card-title class="grey lighten-4 py-4 title">
                    New Scheme.
                <v-spacer></v-spacer>
                <v-btn @click="departmentDialog = false">Cancel</v-btn>
                <v-btn class="primary" @click="saveRegistration">Save</v-btn>
                </v-card-title>
                <v-container grid-list-sm class="pa-4">
                <v-layout row style="text-align: left !important;">
                    <v-flex xs12>
                        <label>Name</label>
                        <input type="text" class="form-control" v-model="newDepartment.name" />
                    </v-flex>
                    <v-flex xs12>
                        <label>Address</label>
                        <input type="text" class="form-control" v-model="newDepartment.address" />
                    </v-flex>
                    <v-flex xs12>
                        <label>Mobile</label>
                        <input type="text" class="form-control" v-model="newDepartment.mobile" />
                    </v-flex>
                </v-layout>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDialog" left top width="430px">
            <v-card>
                <v-card-title class="grey lighten-4 py-4 title">
                Edit {{ toEdit.name }}.
                <v-spacer></v-spacer>
                <v-btn @click="editDialog = false">Cancel</v-btn>
                <v-btn class="primary" @click="updateWard">Save</v-btn>
                </v-card-title>
                <v-container grid-list-sm class="pa-4">
                <v-layout row style="text-align: center !important;">
                    <v-flex xs12>
                        <label>Name</label>
                        <input type="text" class="form-control" v-model="toEdit.name" />
                    </v-flex>
                    <v-flex xs12>
                        <label>Address</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="toEdit.discount"
                        />
                    </v-flex>
                    <v-flex xs12>
                        <label>Mobile</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="toEdit.mobile"
                        />
                    </v-flex>
                </v-layout>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog v-model="authDialog" persistent left top width="400px">
            <v-card>
                <v-container grid-list-sm class="pa-4">
                <base-authorization @authUser="authUser" @closeAuth="closeAuth" />
                </v-container>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
var fs = require("fs");
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Department",
  data: () => ({
    store: [],
    error: "",
    departmentDialog: false,
    editDialog: false,
    his:'',
    schemes: [],
    toEdit: [],
    authDialog: false,
    newDepartment: { name: "", address: "", mobile:"" },
    search: "",
    paths: "",
    message: ""
  }),
  components: {},
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "settings"])
  },

  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    loadWards: function() {
        this.$Progress.start();
        this.get("/scheme/hmo/"+this.his)
        .then(resp => {
            if(resp.status>0){
                this.schemes = resp.response;
            }else{
                this.$toastr.error(resp.message)
            }
        })
        .finally(() => {
            this.$Progress.finish();
        });
    },
    saveRegistration: function() {
        this.$Progress.start();
        this.newDepartment.scheme=this.his;
        this.newDepartment.action="save"
        this.post("/scheme/hmo/"+this.his, this.newDepartment)
        .then(response => {
          if (response.status > 0) {
            this.$toastr.success(response.message);
            this.loadWards();
          } else {
            this.$toastr.error(response.message);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    updateWard: function() {
        this.$Progress.start();
        this.toEdit.scheme=this.his;
        this.toEdit.action="update";
        this.post("/scheme/hmo/"+this.his, this.toEdit)
        .then(response => {
          if (response.status > 0) {
            this.editDialog = false;
            this.$toastr.success(response.message);
            this.loadWards();
          } else {
            this.$toastr.error(response.message);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    deactivate: function(ward, status) {
      this.$Progress.start();
      this.get(`/scheme/hmo/status/${status}`)
        .then(response => {
            if (response.status > 0) {
                this.loadWards();
                this.$toastr.success(response.message);
          } else {
                this.$toastr.error(response.message);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    authUser: function(auth) {
        if (auth) {
            this.authDialog = false;
            this.editDialog = true;
        }
    },
    closeAuth: function(cancel) {
        this.authDialog = cancel;
    },
    editWard: function(dept) {
        this.toEdit = dept;
        //console.log(this.settings);
        if (
            this.settings.general &&
            this.settings.general.auth_before_edit &&
            this.settings.general.auth_before_edit == 1
        ) {
            this.authDialog = true;
        } else {
            this.authDialog = false;
            this.editDialog = true;
        }
    }
  },
  beforeMount() {
    this.setDomain();
    this.checkStorage();
  },
  mounted() {
        this.his=this.$route.params.scheme;
        this.loadWards();
  }
};
</script>
<style scoped></style>
