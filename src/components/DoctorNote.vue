<template>
  <div>
    <v-toolbar row wrap>
      <v-toolbar-title> Doctor's chat</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="!saved">
        <v-btn class="primary" @click="saveNote(1)" v-if="!isPatientOnAdmission"
          ><v-icon>save</v-icon>Save & Discharge</v-btn
        >
        <v-btn class="primary" @click="saveNote(1)" v-if="isPatientOnAdmission"
          ><v-icon>save</v-icon>Update note</v-btn
        >
        <v-btn class="primary" @click="saveNote(0)" v-if="isPatientOnAdmission"
          ><v-icon>save</v-icon>Request Discharge</v-btn
        >
        <v-btn class="danger" @click="saveNote(3)" v-if="getChatConclusiveness && !isPatientOnAdmission"
          ><v-icon>hotel</v-icon>Admit patient</v-btn
        >

        <v-btn class="success" @click="saveNote(2)" v-if="getChatConclusiveness"
          ><v-icon>accessible</v-icon>Refer patient</v-btn
        >
        
        <v-btn class="danger" @click="saveNote(4)" v-if="getChatConclusiveness"
          ><v-icon>local_car_wash</v-icon>Request transfer</v-btn
        >
      </template>
      <template v-else>
        <v-btn class="success" @click="$router.push(`/medical-history/${admission}`)"
          ><v-icon>accessible</v-icon>View casenote</v-btn
        >
      </template>
    </v-toolbar>
    <v-card tile>
      <v-container grid-list-sm>
        <v-layout row wrap style="margin-right:-20px;">
          <v-flex row>
            <v-flex xs3 class="grey lighten-4 scroller">
              <base-profile-panel :patient="patient" />
            </v-flex>
            <v-flex xs9>
              <v-flex xs12 row class="grey lighten-4">
                <v-flex xs1></v-flex>
                <v-flex xs9 row v-if="schedule.vital">
                  <v-flex xs3>
                    <label>Body emperature</label>
                    <input
                      type="text"
                      class="form-control"
                      readonly
                      v-model="schedule.vital.temperature"
                    />
                  </v-flex>
                  <v-flex xs3>
                    <label>Pulse rate</label>
                    <input
                      type="text"
                      readonly
                      class="form-control"
                      v-model="schedule.vital.pulserate"
                    />
                  </v-flex>
                  <v-flex xs3>
                    <label>Respiratory rate</label>
                    <input
                      type="text"
                      readonly
                      class="form-control"
                      v-model="schedule.vital.respiratory"
                    />
                  </v-flex>
                  <v-flex xs3>
                    <label>Blood pressure</label>
                    <input
                      type="text"
                      readonly
                      class="form-control"
                      v-model="schedule.vital.bloodpressure"
                    />
                  </v-flex>
                </v-flex>
                <v-flex xs2></v-flex>
              </v-flex>

              <v-flex xs12 class="scroller">
                <v-flex xs12>
                  <base-tag-selector
                    name="tags"
                    v-model="diagnosis.symptons"
                    label="Symptons/complain"
                    :items="symptons"
                  />
                </v-flex>
                <v-flex xs12>
                  <base-tag-selector
                    name="tags"
                    v-model="diagnosis.clinical"
                    label="Clinical examination"
                  />
                </v-flex>

                <v-flex cols="12">
                  <label>Sickness/Diagnosis</label>
                  <v-combobox
                    v-model="diagnosis.diseases"
                    :items="diseases"
                    label="Diseases/Diagnosis"
                    multiple
                    chips
                    solo
                    dense
                    item-text="name"
                    item-value="name"
                  >
                  </v-combobox>
                </v-flex>

                <v-flex xs12>
                  <label>Short summary</label>
                  <textarea
                    class="form-control medical-note"
                    cols="100%"
                    rows="10%"
                    v-model="diagnosis.remark"
                  ></textarea>
                </v-flex>

                <v-flex xs12>
                  <v-switch
                    v-model="diagnosis.requestForTest"
                    :label="
                      `Request for test for ${patient.basic.name}?`
                    "
                  ></v-switch>
                </v-flex>
                <v-flex xs12 v-if="diagnosis.requestForTest">
                  <label>Suggest test</label>
                  <base-mict-comboBox
                    :items="payments"
                    v-on:select="selectItems"
                  />
                </v-flex>
                <v-flex
                  xs12
                  v-if="diagnosis.tests.length > 0 && diagnosis.requestForTest"
                >
                  <table class="table table-stripped">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th width="10%">SKU</th>
                        <th width="30%">Lab.</th>
                        <th width="30%">Name</th>
                        <th width="10%">Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in diagnosis.tests" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.sku }}</td>
                        <td>{{ item.lName }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.amount | toDecimal }}</td>
                        <td>
                          <v-btn
                            icon
                            @click="removeFromTests(index)"
                            v-if="!item.result || item.result == ''"
                            ><v-icon>delete</v-icon></v-btn
                          >
                          <v-btn
                            icon
                            @click="viewFile(item.file)"
                            v-if="item.file && item.file != ''"
                            ><v-icon>library_books</v-icon></v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <th colspan="4" style="text-align:right;">Total</th>
                      <td>{{ calculateTestSum }}</td>
                      <td></td>
                    </tfoot>
                  </table>
                </v-flex>

                <v-flex xs12>
                  <v-switch
                    v-model="diagnosis.requestForPrivateTest"
                    :label="`I want this/these test(s) to be protected`"
                  ></v-switch>
                </v-flex>

                <v-flex xs12 v-if="diagnosis.requestForPrivateTest">
                  <label>Private test</label>
                  <base-mict-comboBox
                    :items="payments"
                    v-on:select="selectItemsPrivate"
                  />
                </v-flex>
                <v-flex
                  xs12
                  v-if="
                    diagnosis.privateTest.length > 0 &&
                      diagnosis.requestForPrivateTest
                  "
                >
                  <table class="table table-stripped">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th width="10%">SKU</th>
                        <th width="30%">Lab.</th>
                        <th width="30%">Name</th>
                        <th width="10%">Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in diagnosis.privateTest"
                        :key="index"
                      >
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.sku }}</td>
                        <td>{{ item.lName }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.amount | toDecimal }}</td>
                        <td>
                          <v-btn
                            icon
                            @click="removeFromTests(index)"
                            v-if="!item.result || item.result == ''"
                            ><v-icon>delete</v-icon></v-btn
                          >
                          <v-btn
                            icon
                            @click="viewFile(item.file)"
                            v-if="item.file && item.file != ''"
                            ><v-icon>library_books</v-icon></v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <th colspan="4" style="text-align:right;">Total</th>
                      <td>{{ calculatePrivateTestSum }}</td>
                      <td></td>
                    </tfoot>
                  </table>
                </v-flex>

                <v-flex xs12>
                  <v-switch
                    v-model="diagnosis.prescribeDrugs"
                    :label="`Prescribe drugs for ${patient.basic.name}?`"
                  ></v-switch>
                </v-flex>
                <v-flex xs12 v-if="diagnosis.prescribeDrugs">
                  <label>Prescribe drugs</label>
                  <base-mict-comboBox
                    :items="drugs"
                    v-on:select="selectDrugs"
                  />
                </v-flex>
                <v-flex
                  xs12
                  v-if="diagnosis.drugs.length > 0 && diagnosis.prescribeDrugs"
                >
                  <table class="table table-stripped">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th width="10%">SKU</th>
                        <th width="50%">Name</th>
                        <th width="50%">Note</th>
                        <th width="10%">Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in diagnosis.drugs" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.sku }}</td>
                        <td>{{ item.name }}</td>
                        <td>
                          <input
                            type="text"
                            class="form-control input-small"
                            v-model="item.note"
                          />
                        </td>
                        <td>{{ item.selling_price | toDecimal }}</td>
                        <td>
                          <v-btn icon @click="removeFromDrugs(index)"
                            ><v-icon>delete</v-icon></v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <th colspan="4" style="text-align:right;">Total</th>
                      <td>{{ calculateDrugSum | toDecimal }}</td>
                      <td></td>
                    </tfoot>
                  </table>
                </v-flex>
                <v-flex xs12>
                  <v-switch
                    v-model="diagnosis.conclusive"
                    :label="
                      `Is diagnosis conclusive for ${patient.basic.name}?`
                    "
                  ></v-switch>
                </v-flex>
                <v-flex xs12 v-if="!isPatientOnAdmission">
                  <div class=" divcheck">
                    <label>
                        <input type="radio" name="radio" v-model="diagnosis.conclusive" :value="false" />
                        <div class=" box">
                            <h3>Inconclusive</h3><hr>
                            <span>Patient can go for test and come back to complete session..</span>
                        </div>
                    </label>

                    <label>
                        <input type="radio" name="radio" v-model="diagnosis.conclusive" :value="true" />
                        <div class=" box">
                            <h3>Conclusive</h3><hr>
                            <span>Patient will have to book another session to see any doctor.</span>
                        </div>
                    </label>
                  </div>
                </v-flex>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-dialog v-model="referDialog" left top persistent width="500px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Transfer {{ patient.basic.name }} to a specialist
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs6>
              <label>Consulting Dept</label>
              <select
                class="form-control select2me"
                placeholder="Consulting doctor"
                v-model="diagdept"
                @change="checkUsers"
              >
                <option
                  v-for="(st, index) in departments"
                  :key="index"
                  :value="st.id"
                  >{{ st.name }}</option
                >
              </select>
            </v-flex>
            <v-flex xs6>
              <label>Consulting Doctor</label>
              <select
                class="form-control select2me"
                placeholder="Consulting doctor"
                v-model="diagdoctor"
              >
                <option
                  v-for="(st, index) in filterdoctors"
                  :key="index"
                  :value="st.id"
                  >{{ st.name }}</option
                >
              </select>
            </v-flex>
            <v-flex xs12>
              <label>Priority</label>
              <select
                class="form-control select2me"
                placeholder="Consulting doctor"
                v-model="diagnosis.priority"
              >
                <option value="High">High</option>
                <option value="Mild">Mild</option>
                <option value="Low">Low</option>
              </select>
            </v-flex>
            <v-flex xs12>
              <label>Short note</label>
              <textarea
                class="form-control"
                cols="100%"
                rows="3%"
                v-model="remark"
              ></textarea>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="referDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="referPatient">Refer patient</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="admissionDialog" left top persistent width="500px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Place {{ patient.basic.name }} on admission
          <v-spacer></v-spacer>
          <v-btn @click="admissionDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveAdmission">Admit {{ patient.basic.name }}</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12>
              <label>Assign ward for patient</label>
              <v-select
                v-model="diagdept"
                :items="wards"
                item-text="name"
                item-value="id"
                :item-disabled="[0]"
                label="Select admission ward"
                :return-object="true"
                dense
                solo
              />
            </v-flex>
            <v-flex xs12>
              <label>Short note</label>
              <textarea
                class="form-control"
                cols="100%"
                rows="3%"
                v-model="remark"
              ></textarea>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="transferDialog" left top persistent width="640px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Transfer {{ patient.basic.name }} to another hospital
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs6>
              <label>Receiving hospital</label>
              <select
                class="form-control select2me"
                placeholder="Consulting doctor"
                v-model="diaghosp"
                @change="loadHDepts"
              >
                <option
                  v-for="(st, index) in hospitals"
                  :key="index"
                  :value="st.id"
                  >{{ st.name }}</option
                >
              </select>
            </v-flex>
            <v-flex xs6>
              <label>Receiving department</label>
              <select
                class="form-control select2me"
                placeholder="Consulting doctor"
              >
                <option
                  v-for="(st, index) in departments"
                  :key="index"
                  :value="st.id"
                  >{{ st.name }}</option
                >
              </select>
            </v-flex>
            <v-flex xs12>
              <label>Priority</label>
              <select
                class="form-control select2me"
                placeholder="Consulting doctor"
                v-model="diagnosis.priority"
              >
                <option value="High">High</option>
                <option value="Mild">Mild</option>
                <option value="Low">Low</option>
              </select>
            </v-flex>
            <v-flex xs12>
              <label>Short note</label>
              <textarea
                class="form-control"
                cols="100%"
                rows="5%"
                v-model="remark"
              ></textarea>
            </v-flex>
            <v-flex xs12 class="red"><i>Note: Generate patient medical report if receing hospitaldoesnt exist on patrec</i></v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn @click="transferPatient" class="btn red"
            >Generate report</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="transferDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="transferPatient"
            >Transfer patient</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="fileDialog" left top persistent width="1050px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Test file
          <v-spacer></v-spacer>
          <v-btn @click="fileDialog = false">Close</v-btn>
          <v-btn color="danger" @click="printArea('print')"
            ><v-icon>print</v-icon>Print</v-btn
          >
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap refs="print">
            <div v-ripple v-if="avatar" class="mb-3">
              <img :src="avatar" alt="avatar" style="width:1024px;" />
            </div>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    
  </div>
</template>
<script>
import { URL, LS, SHA256, toCurrency } from "../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Patient",

  data: () => ({
    billwarning: false,
    addPrescription: false,
    fileDialog: false,
    caseConclusionDialog: false,
    payments: [],
    patient: [],
    symptons: [],
    diseases: [],
    loading: false,
    drugs: [],
    schedule: '',
    admission:'',
    dept: [],
    platform: [],
    wards:[],
    departments: [],
    doctors: [],
    filterdoctors: [],
    filtercharges: [],
    hospitals: [],
    referDialog: false,
    transferDialog: false,
    admissionDialog: false,
    dischargeDialog: false,
    modalApp: false,
    diaghosp: "",
    diagdept: "",
    diagdoctor: "",
    discharge: "",
    saved: false,
    user: [],
    diagnosis: {
      update: false,
      adm: 0,
      outlet: 0,
      patient: 0,
      type: 0,
      medical: "",
      priority: "",
      remark: "",
      symptons: [],
      clinical: [],
      diseases: [],
      dama: false,
      requestForPrivateTest: false,
      privateTest: [],
      requestForTest: false,
      tests: [],
      prescribeDrugs: false,
      drugs: [],
      doctor: [],
      conclusive: true
    },
    total: 0,
    searchDisease: null,
    searchSympton: null,
    remark: "",
    avatar: null
  }),
  watch: {
    searchDisease(val) {
      val && val !== this.select && this.querySelections(val, this.diseases);
    },
    searchSympton(val) {
      val && val !== this.select && this.querySelections(val, this.symptons);
    }
  },

  props: {
    source: String,
  },
  computed: {
    ...mapState(["domain", "outlet", "settings"]),
    calculateTestSum() {
      var total = 0;
      this.diagnosis.tests.forEach(w => {
        total = parseFloat(total) + parseFloat(w.amount);
      });
      return toCurrency(total);
    },
    calculatePrivateTestSum() {
      var total = 0;
      this.diagnosis.privateTest.forEach(w => {
        total = parseFloat(total) + parseFloat(w.amount);
      });
      return total;
    },
    calculateDrugSum() {
      var total = 0;
      this.diagnosis.drugs.forEach(w => {
        total = parseFloat(total) + parseFloat(w.selling_price);
      });
      return total;
    },
    getChatConclusiveness(){
      return this.diagnosis.conclusive;
    },
    isPatientOnAdmission(){
      return this.diagnosis.update;
    }
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      //this.patient = LS.get("patient");
      this.user = LS.get("user");
      this.dept = LS.get("department");
      this.platform = LS.get("platform");
      this.schedule = LS.get("schedule");
      this.admission=LS.get('admission');
      //alert(this.admission)
      this.saved = LS.get("saved") || false;
      setTimeout(this.loadPatient, 100);
      setTimeout(this.loadDiseases, 100);
      setTimeout(this.loadSymptons, 100);
      setTimeout(this.getAllLabPayments, 100);
      setTimeout(this.getAllDrugs, 100);
      setTimeout(this.loadAdmissionWards, 100);
      setTimeout(this.checkIfAdmitted, 100);
      //this.diagnosis.update = this.update
      if (this.inconclusive) {
        //this.loadPatientMed();
      }
    },
    loadAdmissionWards: function(){
      this.post("/wards", {action:'available'})
      .then(response => {
        this.wards = response.response;
        console.log(this.wards)
      })
    },
    loadDiseases: function() {
      this.$Progress.start();
      this.get("/disease")
        .then(resp => {
          if (resp.status > 0) {
            this.diseases = resp.response;
          } else {
            this.$toastr.warning(resp.message);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    loadSymptons: function() {
      this.$Progress.start();
      this.get("/symptons")
        .then(resp => {
          if (resp.status > 0) {
            this.symptons = resp.response;
          } else {
            this.$toastr.warning(resp.message);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    loadPatient: function() {
      this.$Progress.start();
      this.get(`/patients/search/${this.schedule}`)
        .then(resp => {
          if (resp.status > 0) {
            this.patient = resp.response;
            //LS.set("patient", this.patient);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    getAllLabPayments: function() {
      this.$Progress.start();
      let payload={
        page:0,
        dept: 0,
        outlet: this.outlet.id,
        action:'loads'
      }
      this.post(`/charges`, payload)
      .then(response => {
        if (response.status > 0) {
          this.payments=response.response.result;
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    getAllDrugs: function() {
      this.$Progress.start();
      var postData = {
        page:0,
        perPage: 100,
        outlet: this.outlet.id,
        action:'loads'
      };
      this.post("/drugs", postData)
      .then(resp=>{
        if(resp.status>0){
          this.drugs = resp.response.result
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      })
    },
    loadDept: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        has_clinic: 1,
        action: 'loads'
      }
      this.post("/dept", payload)
      .then(resp => {
        if(resp.status>0){
          this.departments = resp.response;
        }else{
          this.departments=[];
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
          this.wards=resp.response
        }else{
          this.wards=[];
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },
    loadDoctors: function() {
      
        this.$Progress.start();
        let payload={
          outlet: this.outlet.id,
          group: this.group.structure,
          dept: dept,
          pageSize:0,
          sdept: true,
          action: 'loads'
        }
        this.post(`/users`, payload)
        .then(resp => {
          if(resp.status>0){
            this.doctors = resp.response.result;
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    loadHDepts: function() {
      this.$Progress.start();
      this.get(`/dept/hospital/${this.diaghosp}`)
        .then(resp => {
          if (resp.status > 0) {
            this.departments = resp.response;
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    loadHospitals: function() {
      this.$Progress.start();
      this.get("/hospitals")
        .then(resp => {
          if (resp.status > 0) {
            this.hospitals = resp.response;
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    checkIfAdmitted: function() {
      this.get(`/patients/isAdmitted/${this.schedule}`)
      .then(
        resp => {
          if (resp.status > 0) {
            this.diagnosis.update = resp.response.admitted;
          }
        }
      );
    },
    loadPatientMedics: function(){
      //alert(this.admission)
      this.get(`/patient-med/med/${this.admission}`)
      .then(resp=>{
        if(resp.status>0){
          if(resp.response.med.onAdmission){
            this.diagnosis.update=true
          }
        }
      })
    },
    loadPatientMeds: function() {
      this.$Progress.start();
      this.get(`/patient-med/med/${this.admission}`)
        .then(resp => {
          if (resp.status > 0) {
            if (resp.response.tests) {
              this.diagnosis.requestForTest = true;
              this.diagnosis.tests = resp.response.tests;
            }
            if (resp.response.private) {
              this.diagnosis.requestForTest = true;
              this.diagnosis.privateTest = resp.response.private;
            }
            if (resp.response.drug) {
              this.diagnosis.prescribeDrugs = true;
              this.diagnosis.drugs = resp.response.drug;
            }
            //console.log(resp.response)
            this.diagnosis.outlet = this.outlet.id;
            this.diagnosis.patient = resp.response.med.patient_id;
            this.diagnosis.medical = resp.response.med.schedule_id;
            this.diagnosis.adm = resp.response.adm.id;
            this.diagnosis.remark = resp.response.adm.remark;
            this.diagnosis.symptons = resp.response.adm.complains;
            this.diagnosis.clinical = resp.response.adm.clinical_examination;
            this.diagnosis.diseases = resp.response.adm.observation;

            this.diagnosis.conclusive = false;
            
          } else {
            this.$toastr.warning(resp.message);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    printArea: function(area) {
      this.$print(this.$refs["print"]);
    },
    viewFile: function(url) {
      if (url != "") {
        this.$Progress.start();
        this.post(`/read-file`, { url: url })
          .then(resp => {
            this.avatar = resp.response;
            this.fileDialog = true;
          })
          .finally(() => {
            this.$Progress.finish();
          });
      }
    },
    
    querySelections(v, object) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = object.filter(e => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },
    selectItemsPrivate: function(index) {
      var items = {
        id: index.item.id,
        sku: index.item.sku,
        lab: index.item.dept_id,
        lName: index.item.dept,
        name: index.item.name,
        amount: index.item.amount
      };
      this.diagnosis.privateTest.push(items);
    },
    selectItems: function(index) {
      var items = {
        id: index.item.id,
        sku: index.item.sku,
        lab: index.item.dept_id,
        lName: index.item.dept,
        name: index.item.name,
        amount: index.item.amount
      };
      this.diagnosis.tests.push(items);
    },
    selectDrugs: function(index) {
      var items = {
        id: index.item.id,
        sku: index.item.sku,
        name: index.item.name,
        note: "",
        selling_price: index.item.selling_price,
        alert_qty: index.alert_qty
      };
      //console.log(items);
      this.diagnosis.drugs.push(items);
    },
    remove: function(item) {
      const index = this.diseases.indexOf(item.name);
      if (index >= 0) this.diseases.splice(index, 1);
    },
    removeFromPrivateTests: function(index) {
      this.diagnosis.privateTest.splice(index, 1);
    },
    removeFromTests: function(index) {
      this.diagnosis.tests.splice(index, 1);
    },
    removeFromDrugs: function(index) {
      this.diagnosis.drugs.splice(index, 1);
    },
    diagonisePatient: function() {
      this.getAllLabPayments();
      this.diagnosis.outlet = this.outlet.id;
      this.newDiagnosis = true;
    },
    checkUsers: function() {
      if (this.departments.length > 0) {
        var select = new Promise(resolve => {
          var items = [];
          this.doctors.forEach(w => {
            if (w["department"] == this.diagdept) {
              items.push(w);
            }
          });
          resolve(items);
        });
        select.then(response => {
          this.filterdoctors = response;
        });
      }
    },
    saveNote: function(type) {
      if(this.diagnosis.remark==''){
        this.$toastr.error("Please Doctor's remark cannot be emptied.")
        return;
      }
      /*
      if(this.diagnosis.symptons.length<1){
        this.$toastr.error("Please patient's symptons not yet captured.")
        return;
      }
      if(this.diagnosis.clinical.length<1){
        this.$toastr.error("Please Doctor's clinical exermination yet to be filled.")
        return;
      }
      if(this.diagnosis.diseases.length<1){
        this.$toastr.error("Please Doctor's remark cannot be emptied.")
        return;
      }*/
      this.diagnosis.outlet = this.outlet.id;
      this.diagnosis.doctor = this.user.id;
      this.diagnosis.type = type;
      this.diagnosis.patient = this.patient.id;
      this.diagnosis.medical = this.admission;
      //console.log(this.diagnosis); return false;
      switch (type) {
        case 0:
          this.$Progress.start();
          this.diagnosis.requestDischarge = true;
          this.diagnosis.discharge = "Kindly prepare this patient for discharge.";
          this.post("/patient-med/history", this.diagnosis)
          .then(response => {
            if (response.status > 0) {
              this.$toastr.success(`${this.patient.basic.name} has been discharged successfully.`);
              this.saved = true;
              LS.set("saved", true);
              LS.remove("admission");
            } else {
              this.$toastr.error(response.message);
            }
          })
          .finally(() => {
            this.$Progress.finish();
          });
        break;
        case 1:
          this.$Progress.start();
          this.diagnosis.releasePatient = true;
          this.post("/patient-med/history", this.diagnosis)
            .then(response => {
              if (response.status > 0) {
                this.$toastr.success(
                  `${this.patient.basic.name} diagnosis has been saved successfully.`
                );
                this.saved = true;
                LS.set("saved", true);
                LS.remove("admission");
              } else {
                this.$toastr.error(response.error);
              }
            })
            .finally(() => {
              this.$Progress.finish();
            });
          break;
        case 2:
          this.loadDept();
          this.loadDoctors();
          this.referDialog = true;
          break;
        case 3:
          this.loadWards();
          this.admissionDialog = true;
          break;
        case 4:
          this.loadHospitals();
          this.transferDialog = true;
          break;
      }
    },
    referPatient: function() {
      if (
        this.diagnosis.symptons == "" &&
        this.diagnosis.observation.length < 1
      ) {
        this.$toastr.error("Expected department must be field.");
        return false;
      }
      this.$Progress.start();
      this.diagnosis.requestRefer = true;
      this.diagnosis.refer = {
        dept: this.diagdept,
        doctor: this.diagdoctor
      };

      this.post("/patient-med/history", this.diagnosis)
        .then(response => {
          if (response.status > 0) {
            var dept = this.departments.filter(x => (x.id = this.diagdept));
            this.$toastr.success(
              `${this.patient.basic.name} has been refrered to special clinic.`
            );
            this.saved = true;
            LS.set("saved", true);
            LS.remove("admission");
            this.referDialog = false;
          } else {
            this.$toastr.error(response.error);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    transferPatient: function() {
      if (
        this.diagnosis.symptons == "" &&
        this.diagnosis.observation.length < 1
      ) {
        this.$toastr.error("Expected department must be field.");
        return false;
      }
      this.$Progress.start();
      this.diagnosis.transfer = {
        requestTransfer: true,
        hospital: this.diaghosp,
        dept: this.diagdept
      };

      this.post("/patient-med/history", this.diagnosis)
        .then(response => {
          if (response.status > 0) {
            var dept = this.departments.filter(x => (x.id = this.diagdept));
            this.$toastr.success(
              `${this.patient.basic.name} has been transfered to ${dept.name}.`
            );
            this.saved = true;
            LS.set("saved", true);
            LS.remove("admission");
            this.transferDialog = false;
          } else {
            this.$toastr.error(response.error);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    saveAdmission: function() {
      this.diagnosis.requestForAdmission = true;
      this.diagnosis.admission = {
        ward: this.diagdept,
        remark: this.remark
      };
      this.$Progress.start();
      this.post("/patient-med/history", this.diagnosis)
        .then(response => {
          if (response.status > 0) {
            var dept = this.departments.filter(x => (x.id = this.diagdept));
            this.$toastr.success(
              `${this.patient.basic.name} has been admitted to ${dept.name}.`
            );
            this.saved = true;
            LS.set("saved", true);
            LS.remove("admission");
            this.admissionDialog = false;
          } else {
            this.$toastr.error(response.error);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    cancelNote: function() {
      this.$router.go(-1);
    },
    createPayment: function() {},

    saveMedicalHistoryFirst: function() {
      return new Promise((resolve, reject) => {
        this.post("/patient-med/history", this.diagnosis)
          .then(response => {
            if (resp.status > 0) {
              return resolve(true);
            } else {
              return reject(false);
            }
          })
          .catch(e => {
            return reject(false);
          });
      });
    }
  },
  beforeMount() {
    this.checkStorage();
  },
  mounted() {
    //console.log(this.$route)
    //alert(this.admission)
    this.innitialize();
  }
};
</script>
<style scoped>
.child-container {
  width: 100% !important;
  margin: 5px 0px 0px -20px;
  padding: 0px !important;
  background-color: #fff;
}
.right {
  color: blue;
  text-align: right;
}
.header-text {
  font-size: 20px;
  font-weight: bold;
  color: grey;
}
</style>
