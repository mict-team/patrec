<template>
  <v-card>
    <v-card-title class="grey lighten-4 py-4 card-title">
      <v-btn color="red" @click="$router.go(-1)"><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn>
      <v-toolbar-title>Transfer req. form</v-toolbar-title>
      
      <v-spacer />
      <v-btn color="primary" v-if="!processing" @click="referPatient">Transfer patient</v-btn>
      <v-btn v-else>
        <v-progress-circular
          class="pa-4"
          :size="30"
          indeterminate
        ></v-progress-circular>
      </v-btn>
      <v-btn v-if="!searchPatientBox" @click="searchPatientBox=true">Search patient</v-btn>
      
    </v-card-title>
    <v-container grid-list-sm class="pa-4 ">
      <v-row>
        <v-spacer />
        <v-col cols="12" md="9">
          <h5>Patient detail</h5>
          <hr />
          <div class="alert alert-success" v-if="message !=''">{{message}}</div>
          <v-card class="px-5 py-4">
            <v-row>
              
              <v-col cols="12" md="12">
                <label for="brandWebsite"> Name</label>
                <input
                  type="text"
                  class="form-control"
                  readonly
                  v-model="searchedPatient.basic.name"
                  placeholder="e.g Adewumi Adedeji."
                />
              </v-col>
              <v-col cols="12" md="7">
                <label for="brandWebsite"> Gender</label>
                <input
                  type="text"
                  class="form-control"
                  readonly
                  v-model="searchedPatient.basic.gender"
                  placeholder="e.g firstname.lastname@metroverts.com."
                />
              </v-col>
              <v-col cols="12" md="5">
                <label for="brandWebsite"> Marital status</label>
                <input
                  type="text"
                  class="form-control"
                  readonly
                  v-model="searchedPatient.basic.mstatus"
                  placeholder="e.g 08010000001"
                />
              </v-col>
              <v-col cols="12" md="7">
                <label for="brandWebsite"> Email</label>
                <input
                  type="text"
                  class="form-control"
                  readonly
                  v-model="searchedPatient.contact.email"
                  placeholder="e.g firstname.lastname@metroverts.com."
                />
              </v-col>
              <v-col cols="12" md="5">
                <label for="brandWebsite"> Phone number</label>
                <input
                  type="text"
                  class="form-control"
                  readonly
                  v-model="searchedPatient.contact.phone"
                  placeholder="e.g 08010000001"
                />
              </v-col>
              
            </v-row>
          </v-card>
          <h5>Next of kin</h5>
          <hr />
          <v-card class="px-5 py-4">
            <v-row>
                <v-col cols="12" md="6">
                <label for="brandWebsite"> Name</label>
                <input
                  type="text"
                  class="form-control"
                  readonly
                  v-model="searchedPatient.nextOfKin.name"
                  placeholder="e.g 08010000001"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label for="brandWebsite"> Relationship</label>
                <input
                  type="text"
                  class="form-control"
                  readonly
                  v-model="searchedPatient.nextOfKin.relationship"
                  placeholder="e.g 08010000001"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label for="brandWebsite"> Phone number</label>
                <input
                  type="text"
                  class="form-control"
                  readonly
                  v-model="searchedPatient.nextOfKin.phone"
                  placeholder="e.g 08010000001"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label for="brandWebsite"> Address</label>
                <input
                  type="text"
                  class="form-control"
                  readonly
                  v-model="searchedPatient.nextOfKin.address"
                  placeholder="e.g 08010000001"
                />
              </v-col>
              
            </v-row>
          </v-card>
          <h5>Transfer detail</h5>
          <hr />
          <v-card class="px-5 py-4">
            <v-row>
                <v-col cols="12" md="6">
                <label for="brandName"> Transfer to</label>
                <v-select
                v-model="user.facility"
                :items="facilities"
                item-text="name"
                item-value="id"
                label="Select facility"
                dense
                solo
                @change="loadFacilityDepartment"
              ></v-select>
                <small>Attach user to a department or unit.</small>
              </v-col>
              <v-col cols="12" md="6">
                <label for="brandName"> Accepting dept?</label>
                <v-select
                v-model="user.dept"
                :items="department"
                item-text="name"
                item-value="id"
                label="Select department/unit"
                dense
                solo
                ></v-select>
                <small>Attach user to a department or unit.</small>
              </v-col>
              <v-col cols="12" md="12">
                <label for="brandName"> Remark</label>
                <v-textarea
                v-model="user.detail"
                background-color="amber lighten-4"
                color="orange orange-darken-4"
                class="pl-5"
                row-height="5"
                ></v-textarea>
                <small>Few description about the patient case.</small>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-spacer />
      </v-row>
    </v-container>
    <v-dialog v-model="searchPatientBox" top left persistent width="700px">
        <v-card>
            <v-card-title class="grey lighten-4 py-4 title">
                Search for Patient
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="searchPatientBox = false">Close</v-btn>
            </v-card-title>
            <v-container grid-list-sm class="pa-4">
                <v-row>
                  <v-col cols="12" md="12">
                    <div class="input-group">
                      <v-text-field
                        solo-inverted
                        hide-details
                        prepend-inner-icon="search"
                        label="Search for patient"
                        class="hidden-sm-and-down"
                        v-model="searchStr"
                        ></v-text-field>
                      <span class="input-group-addon addon-right">
                        <v-icon @click="searchPatients">search</v-icon>
                      </span>
                    </div>
                      
                  </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <table class="table table-hover">
                            <tbody>
                                <tr v-for="(pat, index) in patients" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ pat.pat_code }}</td>
                                    <td>{{ pat.basic.name }}</td>
                                    <td>{{ pat.basic.gender }}</td>
                                    <td>{{ pat.basic.dob }}</td>
                                    <td>{{ pat.basic.marital_status }}</td>
                                    <td>
                                    <v-icon style="cursor:pointer" @click="selectPatient(pat)"
                                        >toc</v-icon
                                    >
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                  <td colspan="6" class="text-right">Total match found:</td>
                                  <td>{{patients.length}}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { URL, LS, SHA256, ALPHASTR, IDGenerator } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      processing: false,
      searching: false,
      searchPatientBox: true,
      facilities:[],
      department: [],
      message: '',
      searchStr:'',
      patients:[],
      searchedPatient:{
          basic:[],
          contact:[],
          nextOfKin:[]
      },
      user: {
        outlet: "",
        patient: "",
        facility: "",
        dept: "",
        detail: "",
        user:'',
        severity:''
      }
    };
  },
  computed: {
    ...mapState(["outlet", "transCode", "today", "users"]),
    checkItems() {
      return this.paginate;
    }
  },
  methods: {
    ...mapActions(["setSearch", "checkStorage", "setCode", "setToday"]),

    searchPatients: function(){
        this.searching=true;
        this.$Progress.start();
        var postData = {
          search: this.searchStr.toLowerCase()
        };
        //console.log(postData)
        this.post("/patients/search", postData)
        .then(response => {
            if (response.status > 0) {
              if (response.response.length > 0) {
                this.patients = response.response;
              }
            } else {
              this.$toastr.error("Search completed with no record found.");
            }
        })
        .finally(() => {
          this.searching=false;
          this.$Progress.finish();
        });
    },
    selectPatient: function(patient) {
      this.$Progress.start();
      this.get(`/patients/search/${patient.id}`)
      .then(resp => {
          if(resp.status>0){
              this.searchedPatient = resp.response;
              this.user.patient=patient.id;
              this.loadFacilities();
              this.searchPatientBox=false;
          }
      })
      .finally(()=>{
        this.$Progress.finish();
        //console.log(this.searchedPatient)
      });
    },
    loadFacilities: function() {
      this.$Progress.start();
      this.get("/outlets/"+this.users.id)
        .then(response => {
          if (response.status > 0) {
            this.facilities = response.response;
          }
        })
        .finally(() => {
          //console.log(this.department)
          this.$Progress.finish();
        });
    },
    loadFacilityDepartment: function() {
      this.$Progress.start();
      this.get("/dept/hospital/"+this.user.facility)
        .then(response => {
          if (response.status > 0) {
            this.department = response.response;
          }
        })
        .finally(() => {
          //console.log(this.department)
          this.$Progress.finish();
        });
    },
    referPatient: function(){
      this.user.outlet=this.outlet.id;
      this.user.user=this.users.id;
      this.user.severity="high"
      this.user.action="transfer_patient"
      console.log(this.user);
      this.processing=true;
      this.$Progress.start();
      this.post("/transfer", this.user)
      .then(resp=>{
        if(resp.status>0){
          this.message=resp.message;
          this.$toastr.success(resp.message);
        }else{
          this.$toastr.error(resp.message);
        }
      })
      .finally(()=>{
        this.processing=false;
        this.$Progress.finish();
      })
    }
  },
  mounted() {
    this.loadFacilities();
  }
};
</script>

<style></style>
