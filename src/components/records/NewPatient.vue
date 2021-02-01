<template>
  <v-container>
    <v-card>
      <v-toolbar row wrap>
        <v-flex x5 row>
          <v-btn color="red"
            ><v-icon white-text>keyboard_arrow_left</v-icon
            ><span>Back</span></v-btn
          >
          <v-toolbar-title>Register patient</v-toolbar-title>
        </v-flex>
        <v-flex x4>{{
          loadingDialog == false && message != "" ? message : ""
        }}</v-flex>
        <v-spacer></v-spacer>
        <v-flex xs3 row
          ><v-toolbar-title>{{ page_title }}</v-toolbar-title>
        </v-flex>
      </v-toolbar>
      <v-container grid-list-sm class="pa-4">
        <v-row>
          <v-col cols="12" md="3">
            <v-card
              class="mx-auto"
              max-width="300"
              tile
            >
              <v-list dense>
                <v-subheader>MENUS</v-subheader>
                <v-list-item-group
                  v-model="section"
                  color="primary"
                >
                  <v-list-item
                    v-for="(item, i) in pages"
                    :key="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item.title"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
            
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="8">
            <v-row v-if="section == 0" class="navigation_container">
              <v-row>
                <v-col cols="12" md="12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="newPatient.basic.code"
                    placeholder="Patient ID No"
                    readonly
                  />
                </v-col>
                <v-col cols="12" md="12">
                  <label>Name</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="newPatient.basic.name"
                    placeholder="Name"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-menu
                    v-model="modaldob"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <label>Date of Birth</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="newPatient.basic.dob"
                        placeholder="Date of birth"
                        v-on="on"
                        readonly
                      />
                    </template>
                    <v-date-picker
                      v-model="newPatient.basic.dob"
                      @input="modaldob = false"
                      :landscape="true"
                      :relative="true"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="4">
                  <label>Gender</label>
                  <select
                    class="form-control select-drop"
                    placeholder="Gender"
                    v-model="newPatient.basic.gender"
                  >
                    <option value="">..Select gender..</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </v-col>

                <v-col cols="12" md="4">
                  <label>Marital status</label>
                  <select
                    class="form-control select2me"
                    placeholder="Marital status"
                    v-model="newPatient.basic.marital_status"
                  >
                    <option value="">..Select marital status..</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widow">Widow</option>
                    <option value="Widower">Widower</option>
                  </select>
                </v-col>
                <v-col cols="12" md="12">
                  <label>Litle detail</label>
                  <textarea
                    cols="20%"
                    rows="4"
                    class="form-control"
                    placeholder="Notes"
                    v-model="newPatient.basic.remark"
                  ></textarea>
                </v-col>
              </v-row>
            </v-row>
            <v-row v-if="section == 1" class="navigation_container">
              <v-row>
                <v-col cols="12" md="6">
                  <label>Email address</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="newPatient.contact.email"
                    placeholder="Email"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <label>Phone number</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="newPatient.contact.phone"
                    placeholder="Mobile number"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <label>Nationality</label>
                  <v-select
                    v-model="newPatient.contact.country"
                    @change="loadState"
                    :items="['Nigeria', 'Others']"
                    label="Country"
                    solo
                  ></v-select>
                  
                </v-col>
                <v-col cols="12" md="4">
                  <label>State/Region</label>
                  <v-select
                    v-model="newPatient.contact.state"
                    :items="state"
                    label="State of Origin"
                    item-text="name"
                    item-value="id"
                    @change="loadLga"
                    solo
                  ></v-select>
                  
                </v-col>
                <v-col cols="12" md="4" v-if="newPatient.contact.country == 'Nigeria'">
                  <label>LG Area</label>
                  <v-select
                    v-model="newPatient.contact.lga"
                    :items="lga"
                    label="Local govt of origin"
                    item-text="lga_name"
                    item-value="id"
                    solo
                  ></v-select>
                  
                </v-col>
                <v-col cols="12" md="4" v-else>
                  <label>Region area</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="newPatient.contact.region"
                    placeholder="Region/Local Govt"
                  />
                </v-col>

                <v-col cols="12" md="12">
                  <label>Address</label>
                  <textarea
                    cols="20%"
                    rows="4"
                    class="form-control"
                    placeholder="Address"
                    v-model="newPatient.contact.address"
                  ></textarea>
                </v-col>
              </v-row>
            </v-row>
            <v-row v-if="section == 2" class="navigation_container">
              <v-col cols="12" md="12">
                <div class="input-group mt-5">
                    
                    <input type="text" class="form-control" v-model="newPatient.nextOfKin.name" placeholder="Next of kin name" /><span class="input-group-addon addon-right"><v-icon>search</v-icon></span>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <label>Gender</label>
                <v-select
                  v-model="newPatient.nextOfKin.gender"
                  :items="['Male', 'Female']"
                  label="Next of kin gender"
                  solo
                ></v-select>
              </v-col>
            
              <v-col cols="12" md="6">
                <label>Relationship with patient</label>
                <v-select
                  v-model="newPatient.nextOfKin.relationship"
                  :items="['Mother', 'Father', 'Brother', 'Sister', 'Cousin', 'Nephew', 'Niece', 'Uncle', 'Aunt', 'Others']"
                  label="Relationship with you"
                  solo
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <label>Email</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newPatient.nextOfKin.email"
                  placeholder="Email"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label>Mobile number</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newPatient.nextOfKin.phone"
                  placeholder="Mobile number"
                />
              </v-col>
              <v-col cols="12" md="12">
                <label>Address</label>
                <textarea
                  cols="20%"
                  rows="4"
                  class="form-control"
                  placeholder="Address"
                  v-model="newPatient.nextOfKin.address"
                ></textarea>
              </v-col>
            </v-row>
            <v-row v-if="section == 3" class="navigation_container">
              <v-spacer></v-spacer>
              <v-col cols="12" md="4" align-center>
                <v-layout row>
                  <v-col cols="12" md="12" align-center style="text-align:center">
                    <v-avatar
                      size="200px"
                      circle
                      v-if="newPatient.identity.passport == ''"
                    >
                      <img
                        src="../../assets/no_image.png"
                        alt="Passport photograph"
                        @click="startFoto"
                      />
                    </v-avatar>
                    <v-avatar
                      size="200px"
                      circle
                      v-if="newPatient.identity.passport != ''"
                    >
                      <img
                        :src="newPatient.identity.passport"
                        alt="Passport photograph"
                      />
                    </v-avatar>
                  </v-col>
                  <v-col cols="12" md="12" align-center style="text-align:center">
                    <v-btn class="blue" white-text center @click="startFoto"
                      >Capture photo</v-btn
                    >
                  </v-col>
                </v-layout>
              </v-col>
              <v-spacer></v-spacer>
              <v-divider inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-col cols="12" md="4" style="text-align: center !important;">
                <v-layout row>
                  <v-col cols="12" md="12" center>
                    <v-avatar size="200px" tile>
                      <img
                        src="../../assets/fingerprint.png"
                        alt="fingerprint"
                        @click="startFinger"
                      />
                    </v-avatar>
                  </v-col>
                  <v-col cols="12" md="12" align-center>
                    <v-btn class="blue" white-text @click="startFinger"
                      >Capture fingerprint</v-btn
                    >
                  </v-col>
                </v-layout>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row v-if="section == 4" class="navigation_container">
              <v-col cols="12" md="12">
                <label>Employer</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newPatient.work.name"
                  placeholder="Employer"
                />
              </v-col>

              <v-col cols="12" md="6">
                <label>Designation</label>
                <input
                  type="text"
                  class=" form-control"
                  v-model="newPatient.work.designation"
                  placeholder="Patient designation"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label>Contact mobile number</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newPatient.work.phone"
                  placeholder="Employer contact phone number"
                />
              </v-col>
              <v-col cols="12" md="12">
                <label>Address</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newPatient.work.address"
                  placeholder="Employer address"
                />
              </v-col>
            </v-row>
            <v-row v-if="section == 5" class="navigation_container">
              <v-col cols="12" md="6">
                <label>Blood group</label>
                <select
                  class="form-control select2me"
                  placeholder=""
                  v-model="newPatient.medical.blood_group"
                >
                  <option value="">..Select blood group..</option>
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                </select>
              </v-col>
              <v-col cols="12" md="6">
                <label>Genotype</label>
                <input
                  type="text"
                  class=" form-control"
                  v-model="newPatient.medical.genotype"
                  placeholder="Genotype"
                />
              </v-col>
              <v-col cols="12" md="4">
                <label>Height</label>
                <input
                  type="text"
                  class=" form-control"
                  v-model="newPatient.medical.height"
                  placeholder="Patient Height"
                />
              </v-col>

              <v-col cols="12" md="4">
                <label>Skin color</label>
                <input
                  type="text"
                  class=" form-control"
                  v-model="newPatient.medical.skin_color"
                  placeholder="Skin color"
                />
              </v-col>
              <v-col cols="12" md="4">
                <label>Eye color</label>
                <input
                  type="text"
                  class=" form-control"
                  v-model="newPatient.medical.eye_color"
                  placeholder="Eye color"
                />
              </v-col>
              <v-col cols="12" md="12">
                <label>Alergy</label>
                <input
                  type="text"
                  class=" form-control"
                  v-model="newPatient.medical.allergy"
                  placeholder="Any Known Allergies"
                />
              </v-col>
            </v-row>
            <v-row v-if="section == 6" class="navigation_container">
              <v-col cols="12" md="12">
                <label>Insurance no</label>
                <input
                  type="text"
                  class=" form-control"
                  v-model="newPatient.insurance.no"
                  placeholder="Insurance No"
                />
              </v-col>

              <v-col cols="12" md="6">
                <label>Insurance scheme</label>
                <select
                  class="form-control select2me"
                  placeholder="Insurance scheme"
                  v-model="newPatient.insurance.name"
                  @change="loadHMO"
                >
                  <option value="">..Select insurance scheme..</option>
                  <option
                    v-for="(sh, index) in scheme"
                    :key="index"
                    :value="sh.id"
                    >{{ sh.name }}</option
                  >
                </select>
              </v-col>
              <v-col cols="12" md="6">
                <label>Type of insurance</label>
                <input
                  type="text"
                  class=" form-control"
                  v-model="newPatient.insurance.type"
                  placeholder="Type of insurance"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label>HMOS</label>
                <select
                  class="form-control select2me"
                  placeholder="HMO"
                  v-model="newPatient.insurance.hmo"
                >
                  <option value="">..Select HMO..</option>
                  <option
                    v-for="(sh, index) in hmos"
                    :key="index"
                    :value="sh.id"
                    >{{ sh.name }}</option
                  >
                </select>
              </v-col>
              <v-col cols="12" md="6">
                <label>Date of registration</label>
                <v-menu
                  v-model="modalinsure"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <input
                      type="text"
                      class="form-control"
                      v-model="newPatient.insurance.date_started"
                      placeholder="Date registered"
                      v-on="on"
                      readonly
                    />
                  </template>
                  <v-date-picker
                    v-model="newPatient.insurance.date_started"
                    @input="modalinsure = false"
                    :landscape="true"
                    :relative="true"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
      <v-card-actions class="grey lighten-4">
        <v-btn @click="resetRegistration">Reset</v-btn>
        <v-spacer></v-spacer>
        <v-btn class="danger" @click="previousPage" :disabled="isFirstPage">Previous</v-btn>
        <v-btn class="primary" @click="nextPage" :disabled="isLastPage">Next</v-btn>
        <v-btn class="primary" @click="saveRegistration" v-if="isLastPage">Save patient detail</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="fotodialog" left top width="510px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Kindly focus camera on patient.
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row style="text-align: center !important;">
            <v-col cols="12" md="12" center class="player">
              <video autoplay ref="video" id="video"></video>
              <canvas ref="canvas" id="canvas" v-if="isCaptured"></canvas>
            </v-col>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn @click="stopFoto">Cancel</v-btn>
          <v-spacer></v-spacer>
          <base-image-input v-model="avatar">
            <div slot="activator">
              <v-btn class="danger">...select photo</v-btn>
            </div>
          </base-image-input>

          <v-btn class="primary" @click="capture">Capture</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="fingerdialog" left top width="400px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Place patient finger on sensor.
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row style="text-align: center !important;">
            <v-col cols="12" md="12" center>
              <v-avatar size="150px" tile>
                <img src="../../assets/fingerprint.png" alt="fingerprint" />
              </v-avatar>
            </v-col>
            <br />
            <v-col cols="12" md="12" center>Detected sesnsor: None</v-col>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="fingerdialog = false">Cancel</v-btn>
          <v-btn @click="fingerdialog = false">Search</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="loadingDialog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Processing patient registration. Please wait.
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script src="../../shared/adapter.js"></script>
<script>
var fs = require("fs");
import { URL, LS, SHA256 } from "../../shared/config.js";
import { STATE, LGAS } from "../../shared/state.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
const image2base64 = require("image-to-base64");
var child_process = require("child_process");
export default {
  name: "NewPatient",
  data: () => ({
    error: "",
    pages:[
      {key:"basic", title:'Basic Information'}, {key:"contact", title:'Contact Information'}, {key:"next", title:'Next of Kin Information'}, {key:"identify", title:'Identification Detail'}, {key:"employment", title:'Employment Detail'}, {key:"medical", title:'Medical Information'}, {key:"insurance", title:'Insurance Detail'}],
    loadingDialog: false,
    fotodialog: false,
    fingerdialog: false,
    isCamera: false,
    isCaptured: false,
    modaldob: false,
    modalnxdob: false,
    modalinsure: false,
    currentForm:0,
    localStream: [],
    video: {},
    canvas: {},
    captures: "",
    fingers: [],
    avatar: null,
    section: -1,
    page_title: "Basic Information",
    newPatient: {
      outlet:'',
      basic: {
        code: "",
        name: "",
        dob: "",
        gender: "",
        marital_status: "",
        remark: ""
      },
      contact: {
        phone: "",
        email: "",
        address: "",
        region: "",
        state: "",
        country: ""
      },
      nextOfKin: {
        name: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        relationship: ""
      },
      identity: {
        passport: "",
        fingerprint: ""
      },
      medical: {
        height: "",
        skin_color: "",
        eye_color: "",
        blood_group: "",
        genotype: "",
        allergy: ""
      },
      insurance: {
        no: "",
        name: "",
        type: "",
        duration: "",
        date_started: ""
      },
      work: {
        name: "",
        address: "",
        phone: "",
        designation: ""
      }
    },
    message: "",
    state: [],
    states: [],
    lgas: [],
    lga: [],
    scheme: [],
    hmos: [],
    e1: 1,
    steps: 2,
    altLabels: false,
    editable: true
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
      "settings",
      "newpatients",
      "patCode",
      "today"
    ]),
    isLastPage(){
      return this.section>=this.pages.length-1;
    },
    isFirstPage(){
      return this.section==0;
    }
  },
  watch: {
    avatar: {
      handler: function() {
        this.newPatient.identity.passport = this.avatar.base64;
        this.fotodialog = false;
      },
      deep: true
    },
    
    search(newValue, oldValue) {
      //console.log(`Updating from ${oldValue} to ${newValue}`);
      this.searchdialog = true;
      this.searchNow(newValue);
    },
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    }
  },
  methods: {
    ...mapActions([
      "setDomain",
      "setSearch",
      "checkStorage",
      "addNewPatients",
      "setCode",
      "setToday"
    ]),
    onInput(val) {
      this.steps = parseInt(val);
    },
    nextPage:function(){
      
      if(this.section<this.pages.length-1){
        this.section =parseInt(this.section) +1;
        this.navigate(this.pages[this.section].key, this.pages[this.section].title);
      }
      
    },
    previousPage: function(){
      if(this.section>0){
        this.section =parseInt(this.section) -1;
        this.navigate(this.pages[this.section].key, this.pages[this.section].title);
      }
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
    resetRegistration: function() {
      newPatient= {
        basic: {
          code: "",
          name: "",
          dob: "",
          gender: "",
          marital_status: "",
          remark: ""
        },
        contact: {
          phone: "",
          email: "",
          address: "",
          region: "",
          state: "",
          country: ""
        },
        nextOfKin: {
          name: "",
          dob: "",
          gender: "",
          marital_status: "",
          phone: "",
          email: "",
          address: "",
          relationship: ""
        },
        identity: {
          passport: "",
          fingerprint: ""
        },
        medical: {
          height: "",
          skin_color: "",
          eye_color: "",
          blood_group: "",
          genotype: "",
          allergy: ""
        },
        insurance: {
          no: "",
          name: "",
          type: "",
          duration: "",
          date_started: ""
        },
        work: {
          name: "",
          address: "",
          phone: "",
          designation: ""
        }
      }
    },
    saveRegistration: function() {
      //console.log(JSON.stringify(this.newPatient));
      this.newPatient.outlet=this.outlet.id;
      var message = "";
      if (this.newPatient.basic.name == "") {
        message += "Sorry patient name cannot be emptied\r";
      } else if (this.newPatient.basic.gender == "") {
        message += "Sorry patient gender must be specified\r";
      } else if (this.newPatient.basic.dob == "") {
        message += "Sorry patient date of birth must be specified\r";
      } else if (this.newPatient.basic.marital_status == "") {
        message += "Sorry patient marital status cannot be left unfilled.\r";
      } else if (this.newPatient.nextOfKin.name == "") {
        message += "Sorry next of kin name cannot be emptied\r";
      } else if (this.newPatient.nextOfKin.phone == "") {
        message += "Sorry next of kin contact cannot be emptied\r";
      } else if (this.newPatient.nextOfKin.address == "") {
        message += "Sorry next of kin address cannot be emptied\r";
      }

      if (message !== "") {
        alert(message);
      } else {
        //console.log(this.newPatient);
        this.loadingDialog = true;
        this.post("/patient", this.newPatient)
          .then(response => {
            if (response.status > 0) {
              this.newPatient.id = response.response;
              this.addNewPatients(this.newPatient);
              this.$toastr.success(response.message);
              LS.set("searched", this.newPatient);
              this.$router.push("/record/patient/"+this.newPatient.id);
            } else {
              this.$toastr.error(response.message);
              this.error = response.message;
              this.failed = true;
            }
            this.loadingDialog = false;
          })
          .catch(e => {
            console.log(e);
            this.$toastr.error(e.message);
            this.message =
              "Unable to authenticate user. Kindly contact admin for assistance.";
            this.loadingDialog = false;
            this.failed = true;
          });
      }
    },
    navigate: function(section, title) {
      title = title.toLowerCase();
      title = title.split(" ");
      for (var i = 0; i < title.length; i++) {
        title[i] = title[i].charAt(0).toUpperCase() + title[i].slice(1);
      }
      this.page_title = title.join(" ");
      //this.section = section;
    },
    startFoto: function() {
      //let els = document.getElementById('video');
      //console.log(this.$refs.video);
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          devices = devices.filter(v => v.kind == "videoinput");
          console.log("Found " + devices.length + " video devices");
          let lastDevice = devices[devices.length - 1];
          devices = devices.filter(v => v.label.indexOf("back") > 0);
          let device = null;
          if (devices.length > 0) {
            console.log("Taking a 'back' camera");
            device = devices[devices.length - 1];
          } else {
            console.log("Taking last camera");
            device = lastDevice;
          }

          if (!device) {
            console.log("No devices!");
            this.$toastr.error("No video devices found.");
            return;
          }

          let constraints = {
            audio: false,
            video: {
              deviceId: { ideal: device.deviceId },
              width: { ideal: window.innerWidth },
              height: { ideal: window.innerHeight }
            }
          };
          navigator.mediaDevices
            .getUserMedia(constraints)
            .then(stream => {
              //console.log(stream)
              this.localStream = stream;

              try {
                this.video.srcObject = this.localStream;
              } catch (error) {
                this.video.srcObject = URL.createObjectURL(this.localStream);
              }

              //info.innerHTML+= "<pre>DONE</pre>";
              console.log("DONE");
              this.isCamera = true;
            })
            .catch(err => {
              console.log(err.name + ": " + err.message);
              this.isCamera = false;
            });
          this.isCaptured = false;
        })
        .catch(err => {
          console.log(err.name + ": " + err.message);
          this.isCamera = false;
        });
      this.fotodialog = true;
    },
    capture: function() {
      this.isCaptured = true;
      this.canvas = this.$refs.canvas;

      var videoClWidth = +window
          .getComputedStyle(this.video, null)
          .getPropertyValue("width")
          .replace("px", ""),
        videoClHeight = +window
          .getComputedStyle(this.video, null)
          .getPropertyValue("height")
          .replace("px", "");

      this._resizeCanvas(this.canvas, videoClWidth, videoClHeight);
      var canvasWidth = this.canvas.width,
        canvasHeight = this.canvas.height;
      this.canvas
        .getContext("2d")
        .drawImage(this.video, 0, 0, canvasWidth, canvasHeight);

      this.newPatient.identity.passport = this.canvas.toDataURL("image/png");
      this.fotodiolog = false;
    },
    stopFoto: function() {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream.getVideoTracks().forEach(track => track.stop());

      this.localStream = null;
      this.fotodialog = false;
    },
    selectFoto: function() {
      var dialog = app.dialog;
      dialog.showOpenDialog(fileNames => {
        // fileNames is an array that contains all the selected
        if (fileNames === undefined) {
          console.log("No file selected");
          return;
        }
        var fileName = fileNames[0];

        fs.readFile(fileName, "base64", (err, data) => {
          if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
          }

          this.newPatient.identity.passport = "data:image/jpeg;base64," + data;
          console.log(this.newPatient.identity.passport);
          this.fotodialog = false;
          // Change how to handle the file content
        });
      });
    },
    resetCamera: function() {
      this.isCaptured = false;
    },
    startFinger: function() {
      console.log(child_process);
      child_process.execFile("Patrec.app", function(error, stdout, stderr) {
        console.log(stdout);
      });
      this.fingerdialog = true;
    },
    _resizeCanvas(canvas, width, height) {
      var canvasClWidthBefore = +window
          .getComputedStyle(canvas, null)
          .getPropertyValue("width")
          .replace("px", ""),
        canvasClHeightBefore = +window
          .getComputedStyle(canvas, null)
          .getPropertyValue("height")
          .replace("px", "");
      //alert('canvas cl before: ' + canvasClWidthBefore + 'x' + canvasClHeightBefore);

      canvas.width = width;
      canvas.height = height;

      var canvasClWidthAfter = +window
          .getComputedStyle(canvas, null)
          .getPropertyValue("width")
          .replace("px", ""),
        canvasClHeightAfter = +window
          .getComputedStyle(canvas, null)
          .getPropertyValue("height")
          .replace("px", "");
      //alert('canvas cl after: ' + canvasClWidthAfter + 'x' + canvasClHeightAfter);

      this._redraw(canvas);
    },

    _redraw(canvas) {
      var context = canvas.getContext("2d");
      context.strokeStyle = "blue";
      context.lineWidth = "5";
      context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
    },

    innitialize: function() {
      this.$Progress.start();
      Promise.all([
        axios.get("/state", {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "text/json"
          }
        }),
        axios.get("/lga", {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "text/json"
          }
        }),
        axios.get("/scheme", {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "text/json"
          }
        })
      ])
      .then(response => {
        if (response[0].data.status > 0) {
          this.states = response[0].data.response;
        }
        if (response[1].data.status > 0) {
          this.lgas = response[1].data.response;
        }
        if (response[2].data.status > 0) {
          this.scheme = response[2].data.response;
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },

    loadHMO: function() {
      this.get(`/scheme/hmo/${this.newPatient.insurance.name}`)
        .then(resp => {
          if (resp.status > 0) {
            this.hmos = resp.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },

    loadState: function() {
      if (this.newPatient.contact.country === "Others") {
        this.state = [{ id: 0, name: "Others" }];
      } else {
        this.state = this.states;
      }
    },

    loadLga: function() {
      if (this.newPatient.contact.state === 0) {
        this.lga = [{ id: 0, lga_name: "Others" }];
      } else {
        this.lga = this.lgas.filter(
          x => x.s_id == this.newPatient.contact.state
        );
      }
    },

    getLastCode: function() {
      this.get("/patients/getlastcode")
      .then(resp => {
        var code = resp.response.pat_code.replace("PAT", '');
        code=parseInt(code) + 1;
        this.newPatient.basic.code = 'PAT'+ code;
      })
    }
  },
  beforeMount() {
    this.checkStorage();
    this.setDomain();
    this.setCode();
  },
  mounted() {
    this.innitialize();
    this.nextPage();
    this.video = this.$refs.video;
    //{"id":1,"outlet_id":1,"general":{"follow_sequence":true,"allow_fingerprint":true,"auth_before_edit":true,"pay_before_service":false,"allow_operator_edit_total_amount":false,"allow_transaction_type":false,"waver_lock":false},"receipt":{"show_patient_code":false,"show_phone_no":false,"show_dob":false,"show_gender":0,"show_address":false},"almona":{"allow_discount":false,"show_sales_summary":false},"pharmacy":{"allow_negative_inventory":false,"allow_sales_for_items_lower_alert_qty":false}}
    //alert(this.settings.general.follow_sequence)
    if (
      this.settings &&
      this.settings.general &&
      this.settings.general.follow_sequence
    ) {
      this.getLastCode();
    } else {
      this.newPatient.basic.code = this.patCode;
    }
  }
};
</script>

<style scoped>
.navigation_container {
  transition: all 300ms ease;
}
video {
  border: 1px solid transparent;
  width: 380px;
  height: 250px;
  background: black;
}
canvas {
  width: 380px;
  height: 250px;
  /*display: none;
        visibility: none;*/
}
.player {
  float: left;
  padding: 1em 1em 0.5em;
  border: 2px solid transparent;
  border-radius: 9px;
}

.sidenav ul {
  height: 100%;
  width: 250px;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #eee;
  overflow-x: hidden;
  padding-top: 20px;
}

.sidenav li {
  padding: 6px 6px 6px 32px;
  text-decoration: none;
  font-size: 18px;
  color: #818181;
  display: block;
}

.sidenav li:hover {
  color: #111;
  cursor: pointer;
}
</style>
