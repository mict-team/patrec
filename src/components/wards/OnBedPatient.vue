<template>
    <v-container>
        <v-toolbar row wrap>
            <v-btn color="red"><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn>
            <v-toolbar-title>On-Bed Patients</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>{{ getPatients.length > 0 ? getPatients.length : 0 }} onbed patients</v-toolbar-title>
        </v-toolbar>
        <v-card>
            <v-container grid-list-sm class="pa-4">
                <v-layout row>
                    <v-flex xs12>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>Code</th>
                                    <th width="20%">Name</th>
                                    <th width="7%">Age</th>
                                    <th width="20%">Date of admission</th>
                                    <th>Days spent</th>
                                    <th>Bill</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody v-if="getPatients && getPatients.length > 0">
                                <template v-for="(patient, index) in getPatients">
                                    <tr :key="index">
                                        <td rowspan="2">{{ index + 1 }}</td>
                                        <td rowspan="2">
                                            <v-avatar size="70px">
                                                <img
                                                    :src="patient.passport"
                                                    :alt="patient.patient"
                                                />
                                            </v-avatar>
                                        </td>
                                        <td rowspan="2">{{ patient.patient }}<br>{{ patient.pat_code }}</td>
                                        <td>{{ patient.dob | toAge }}yrs</td>
                                        <td>{{ patient.date_of_admission }}</td>
                                        <td>{{ patient.date_of_admission | toDays }}day(s)</td>
                                        <td rowspan="2">
                                            <template v-if="patient.bill">
                                                {{patient.bill | toDecimal}}
                                            </template>
                                            <template v-else>
                                                <v-chip class="ma-2" color="green" text-color="white" @click="loadBill(patient)">
                                                    Get bill
                                                </v-chip>
                                            </template>
                                        </td>
                                        <th class="no-print" rowspan="2">
                                            <v-chip class="ma-2" color="blue" text-color="white" @click="$router.push(`/medical-history/${patient.pat_med_id}`)">
                                                <v-icon left>toggle_off</v-icon>View patient
                                            </v-chip>
                                            
                                            <v-chip class="ma-2" color="red" text-color="white" v-if="patient.request_discharge==1">
                                                <v-icon left>cancel</v-icon>Discharge
                                            </v-chip>
                                        </th>
                                    </tr>
                                    <tr :key="`row_${index}`">
                                        <td colspan="3" align="center">
                                            <v-flex v-if="patient.request_discharge==1" color="red">
                                                Patient schedule for discharge.
                                            </v-flex>
                                            <v-flex v-else>
                                                Patient on admission for {{ patient.date_of_admission | toDays }}day(s).
                                            </v-flex>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>

                            <tr v-else>
                                <td colspan="10">
                                    <v-flex xs12 style="text-align:center;">
                                    <img src="../../assets/addnewitem.svg" />
                                    </v-flex>
                                </td>
                            </tr>
                        </table>
                    </v-flex>
                    <base-pagination :total="patients.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
                </v-layout>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
    data: () => ({
        settings: [],
        dates: ["2019-09-10", "2019-09-20"],
        ward:'',
        search:'',
        patients: [],
        page: 1,
        pageSize: 50,
        search:'',
        user: [],
        dept: [],
        departments: [],
        loading: true,
        billLoading: false
    }),
    props: {
        source: String
    },
    computed: {
        ...mapState(["domain", "outlet", "users"]),
        getPatients(){
            return this.patients;
        },
        dateRangeText() {
            return this.dates.join(" ~ ");
        },
    },
    methods:{
        ...mapActions(["setDomain", "setSearch", "checkStorage"]),
        changePage: function(pageItems) {
            this.page=pageItems.page;
            this.pageSize=pageItems.pageSize;
            this.search=pageItems.search;
            this.loadPatients();
        },
        loadPatients(){
            this.loading=true;
            this.$Progress.start();
            let payload={
                outlet: this.outlet.id,
                date: this.dateRangeText,
                search:'',
                ward: this.ward,
                action:'on-bed',
            }
            this.post("/wards", payload)
            .then(resp=>{
                if(resp.status>0){
                    this.patients=resp.response;
                }
            })
            .finally(()=>{
                this.loading=false;
                this.$Progress.finish();
            })
        },
        loadBill(patient){
            this.$Progress.start();
            this.billLoading=true;
            let payload={
                adm: patient.id,
                patient: patient.patient_id,
                medical: patient.pat_med_id,
                action: 'bill',
                outlet: this.outlet.id
            }
            
            this.post("/patient/admission/"+patient.id, payload)
            .then(resp=>{
                if(resp.status>0){
                    let index=this.patients.findIndex(x=>x.id==patient.id);
                    this.patients[index].bill=resp.response;
                    this.$forceUpdate();
                }
            })
            .finally(()=>{
                this.billLoading=false;
                this.$Progress.finish();
            })
        }
    },
    mounted(){
        this.checkStorage();
        setTimeout(this.loadPatients, 200);
    }
}
</script>

<style>

</style>