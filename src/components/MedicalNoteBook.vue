<template>
    <v-container grid-list-sm>
        <v-card>
            <v-container>
                <v-layout>
                    <base-book :enableSelectPage="false" :displayButton="false" :displayPageNumber="true">
                        <div class="page cover">
                            <article class="content" style="text-align: center;">
                                <h1>{{ outlet.name }}</h1>
                                <v-avatar
                                    size="300"
                                    class="mx-auto v-card--material__avatar elevation-6"
                                    color="grey"
                                    style="margin-top:80px;">
                                    <v-img :src="getPassport" />
                                </v-avatar>
                                <br><br>
                                <h1>{{ patient.basic.name }}</h1>
                                <div>
                                    <v-flex xs12>Gender: {{ patient.basic.gender }}</v-flex>
                                    <v-flex xs12>Age: {{ patient.basic.dob|toAge }}yrs</v-flex>
                                    <v-flex xs12 v-if="isPatientOnAdmission" color="red">Currently on admission for {{admission.days}} days</v-flex>
                                </div>
                            </article>
                            <article class="content" style="text-align: center; padding-top:65%">
                                <v-btn class="primary" @click="takeNote" v-if="isPatientOnAdmission">Update note</v-btn>
                                <v-btn class="success" @click="closeNote">Close note</v-btn>
                            </article>
                        </div>
                        
                        <div class="page" v-for="(page, n) in pageCounter" :key="`page${n}`">
                            
                            <article class="content" v-for="(article, ind) in page" :key="`artic${ind}`">
                                
                                <template v-if="article.medical">
                                    <v-sheet class="pa-4 text-center" tile>
                                        <h3>
                                            Date: {{dates[n]}}
                                        </h3>
                                        <v-divider />
                                        <v-row class="text-left">
                                            <v-col cols="12" md="12" class="grey--text text--darken">
                                                <label>Nurse: </label>
                                                {{ article.medical.nurse }}
                                            </v-col>
                                        </v-row>
                                        <v-row class="mb-2 grey lighten-4">
                                            
                                            <v-col class="grey--text text--darken">
                                                <label>Body emperature</label><br />
                                                {{article.medical.vital.temperature}}
                                            </v-col>
                                            <v-col class="grey--text text--darken">
                                                <label>Pulse rate</label><br />
                                                {{ article.medical.vital.pulserate }}
                                            </v-col>
                                            <v-col class="grey--text text--darken">
                                                <label>Respiratory rate</label><br />
                                                {{
                                                article.medical.vital.respiratory
                                                }}
                                            </v-col>
                                            <v-col class="grey--text text--darken">
                                                <label>Blood pressure</label><br />
                                                {{
                                                article.medical.vital.bloodpressure
                                                }}
                                            </v-col>
                                        </v-row>
                                        <v-row class="mb-4 text-left">
                                        
                                            <v-col cols="12" md="12" class="grey--text text--darken">
                                                <label>Comment: </label>
                                                {{ article.medical.remark }}
                                            </v-col>
                                        </v-row>
                                    </v-sheet>
                                </template>
                                <template>
                                    <v-sheet class="pa-4 text-left" tile v-if="article.administer">
                                        <h5>
                                            Doctor: {{article.administer.doctor}}
                                        </h5>
                                        <v-row class="mb-2 grey lighten-4">
                                            <v-col cols="12" md="3">Symptons: </v-col>
                                            <v-col cols="12" md="9">{{
                                                article.administer.complains
                                            }}</v-col>
                                        </v-row>
                                        <v-row class="mb-2 grey lighten-4">
                                            <v-col cols="12" md="3">Clinical: </v-col>
                                            <v-col cols="12" md="9">{{
                                                article.administer.clinical
                                            }}</v-col>
                                        </v-row>

                                        <v-row class="mb-2 grey lighten-4">
                                            <v-col cols="12" md="3">Diagnosis: </v-col>
                                            <v-col cols="12" md="9">{{
                                                article.administer.observation
                                            }}</v-col>
                                        </v-row>
                                        <v-row class="mb-2 grey lighten-4">
                                            <v-col cols="12" md="3" style="vertical-align: top;">Doctor's Note: </v-col>
                                            <v-col cols="12" md="9">{{
                                                article.administer.remark
                                            }}</v-col>
                                        </v-row>
                                    </v-sheet>

                                    <v-flex xs12 v-if="article.tests">
                                        <v-flex><h4>Lab test requests</h4></v-flex>
                                        <table class="table table-stripped">
                                        <thead>
                                            <tr>
                                            <th>SN</th>
                                            <th>Date</th>
                                            <th width="20%">Lab.</th>
                                            <th width="20%">Name</th>
                                            
                                            <th>Result</th>
                                            <th>Done by</th>
                                            <th>On</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                            v-for="(item, index) in article
                                                .tests"
                                            :key="index"
                                            >
                                            <td>{{ index + 1 }}</td>
                                            <td>{{ item.date_of_request }}</td>
                                            <td>{{ item.dept }}</td>
                                            <td>{{ item.test }}</td>
                                            
                                            <td>
                                                <span
                                                v-if="item.test_result == null"
                                                class="red"
                                                >No result</span
                                                >
                                                <span v-else class="successs">{{
                                                item.test_result
                                                }}</span>
                                            </td>
                                            <td>{{ item.technician }}</td>
                                            <td>{{ item.date_of_result }}</td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </v-flex>

                                    <v-flex xs12 v-if="article.drugs">
                                        <v-flex><h4>Precriptions</h4></v-flex>
                                        <table class="table table-stripped">
                                        <thead>
                                            <tr class="grey lighten-4">
                                                <th>SN</th>
                                                <th width="10%">By</th>
                                                <th width="50%">Name</th>
                                                <th width="50%">Note</th>
                                                <th width="10%">Pharmacist</th>
                                                <th width="10%">Bought?</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in article.drugs" :key="index">
                                                <td>{{ index + 1 }}</td>
                                                <td>{{ item.doctor }}</td>
                                                <td>{{ item.drug }}</td>
                                                <td>
                                                    {{ item.remark == null ? "" : item.remark }}
                                                </td>
                                                <td>{{ item.pharmacist }}</td>
                                                <td>
                                                    <span v-if="item.status == 0" class="red"
                                                    >No info</span
                                                    >
                                                    <span v-else>Bought</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </v-flex>
                                </template>
                            </article>
                        </div>
                        <div class="page back">
                            <article class="content" style="text-align: center; padding-top:65%">
                                <v-btn class="primary" @click="takeNote" v-if="isPatientOnAdmission">Update note</v-btn>
                                <v-btn class="success" @click="closeNote">Close note</v-btn>
                            </article>
                        </div>
                    </base-book>   
                </v-layout>
            </v-container>
        </v-card>
        
    </v-container>
</template>
<script>
import { URL, LS, SHA256, toCurrency } from "../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
    name: "MedicalNote",

    data: () => ({
        user: [],
        history: [],
        admission:[],
        medical:[],
        passport:'',
        patient: {
            basic:[]
        },
        pages:[],
        dates: [],
        dept: [],
        platform: [],
        steps: 0,
        altLabels: false,
        editable: true,
        viewTestResult: false,
        test: [],
    }),
    props: {
        source: String,
        id: String
    },
    watch: {},
    components: {},
    computed: {
        ...mapState(["domain", "outlet", "settings"]),
        pageCounter(){
            return this.pages;
        },
        isPatientOnAdmission(){
            return this.admission.discharge==0
        },
        getPassport(){
            if(this.patient && this.patient.identification && this.patient.identification.passport != ''){
                return `${this.outlet.resourceDomain}/${this.patient.identification.passport}`;
            }else{
                return "../assets/user.png";
            }
        }
    },
    methods: {
        ...mapActions(["setDomain", "setSearch", "checkStorage"]),
        innitialize: function() {
            //this.patient = LS.get("patient");
            this.user = LS.get("user");
            this.dept = LS.get("department");
            this.platform = LS.get("platform");
            setTimeout(this.loadMedical, 100);
        },
        cancelNote: function() {
            this.$router.go(-1);
        },
        takeNote: function() {
            LS.remove("saved");
            LS.set('schedule', this.patient.id)
            LS.set('admission', this.id)
            //this.$router.push({ name: uri, id: this.patientID });
            this.$router.push({ name: 'doctors-note', admission: this.id, update: true });
        },
        closeNote: function(){
            this.$router.go(-1);
        },
        loadMedical: function() {
            this.$Progress.start();
            this.get(`/patient-med/history/detail/${this.id}`)
            .then(resp => {
                //console.log(resp.response)
                if (resp.status > 0) {
                    //this.medical=resp.response.mega[0];
                    this.history = resp.response.mega;
                    this.patient = resp.response.patient;
                    this.steps = resp.response.count;
                    this.dates = resp.response.dates;
                    this.admission=resp.response.admission;
                    this.medical=resp.response.medical;
                    console.log(this.patient)
                }
            })
            .finally(() => {
                if(this.dates.length>0){
                    let articles=[];
                    for(let i in this.dates){
                        articles.push(this.history[this.dates[i]]);
                        if(articles.length >=2){
                            this.pages.push(articles);
                            articles=[];
                        }
                        if(articles.length>=this.dates.length){
                            this.pages.push(articles);
                        }
                    }
                    this.loadPassport();
                    this.$forceUpdate();
                    //this.pages=Object.assign({},this.pages);
                }
                this.$Progress.finish();
            });
        },
        viewTest: function(test) {
            this.test = test;
            this.viewTestResult = true;
        }
    },
    mounted() {
        this.checkStorage();
        this.setDomain();
        this.innitialize();
        //setTimeout(this.innitialize, 200);
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
