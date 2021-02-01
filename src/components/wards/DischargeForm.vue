<template>
    <v-container>
        <v-toolbar row wrap>
            <v-btn color="red"><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn>
            <v-toolbar-title>{{patient.name}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <v-btn class="danger" :disabled="!isPatientCleared"><v-icon>local_car_wash</v-icon>Discharge</v-btn>
            </v-toolbar-title>
        </v-toolbar>
        <v-card>
            <v-container class="pa-4">
                <v-toolbar row wrap class="grey lighten-4">
                    <v-toolbar-title>Gender: {{ patient.gender }}</v-toolbar-title>
                    <v-spacer />
                    <v-toolbar-title>Age: {{ patient.dob|toAge }}yrs</v-toolbar-title>
                    <v-spacer />
                    <v-avatar
                        size="80"
                        class="mx-auto v-card--material__avatar elevation-6"
                        color="grey"
                        style="margin-top:80px;">
                        <v-img :src="patient.passport" />
                    </v-avatar>
                    <v-spacer />
                    <v-toolbar-title>Status: {{ patient.mstatus }}</v-toolbar-title>
                    <v-spacer />
                    <v-toolbar-title>Phone: {{ patient.phone }}</v-toolbar-title>
                    <v-spacer />
                </v-toolbar>
                
            </v-container>
        </v-card>
        <v-card>
            <v-container class="pa-4">
                <v-layout>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>Dept</th>
                                <th>Tarrif</th>
                                <th>Date of request</th>
                                <th>Was test done?</th>
                                <th>Payment status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(test, ind) in medicals.tests" :key="ind" :class="test.status==0? 'pink white--text':''">
                                <td>{{ind+1}}</td>
                                <td>{{test.lName}}</td>
                                <td>{{test.name}}</td>
                                <td>{{test.date_of_request}}</td>
                                <td>{{(test.status==1)?'Done':'No'}}</td>
                                <td>{{(test.paid==1)?'Paid':'No'}}</td>
                                <td>{{test.amount | toDecimal}}</td>
                            </tr>
                        </tbody>
                        <tfoot v-if="medicals.payment">
                            <tr v-for="(pay, ind) in medicals.payment" :key="`pay_${ind}`">
                                <td colspan="4">{{pay.date}}</td>
                                <td>{{pay.receipt_no}}</td>
                                <td>{{pay.total | toDecimal}}</td>
                            </tr>
                        </tfoot>
                        <tfoot>
                            <tr>
                                <th colspan="6" style="text-align:right">Subtotal</th>
                                <th>{{getTotalBill | toDecimal}}</th>
                            </tr>
                            <tr>
                                <th colspan="6"  style="text-align:right">Paid</th>
                                <th>{{getTotalPaid | toDecimal}}</th>
                            </tr>
                            <tr>
                                <th colspan="6"  style="text-align:right">Balance</th>
                                <th>{{(getTotalBill-getTotalPaid) | toDecimal}}</th>
                            </tr>
                        </tfoot>
                    </table>
                </v-layout>
            </v-container>
        </v-card>
        <v-card>
            <v-container class="pa-4">
                <v-layout>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>SKU</th>
                                <th>Name</th>
                                <th>Note</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(test, ind) in medicals.drugs" :key="ind" :class="test.status==0? 'red':''">
                                <td>{{ind+1}}</td>
                                <td>{{test.sku}}</td>
                                <td>{{test.name}}</td>
                                <td>{{test.note}}</td>
                                <td>{{test.selling_price | toDecimal}}</td>
                            </tr>
                        </tbody>
                        
                        <tfoot>
                            <tr>
                                <th colspan="4"  style="text-align:right">Subtotal</th>
                                <th>{{getTotalDrug | toDecimal}}</th>
                            </tr>
                            <tr>
                                <th colspan="4"  style="text-align:right">Paid</th>
                                <th>{{getTotalDrug | toDecimal}}</th>
                            </tr>
                            
                        </tfoot>
                    </table>
                </v-layout>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
    data:()=>{
        return{
            patient:[],
            medicals:[],
            id:'',
        }
    },
    computed: {
        ...mapState(["domain", "outlet", "search", "users"]),
        getRequests(){
            return this.requests;
        },
        getTotalBill(){
            if(this.medicals.tests){
                return this.medicals.tests.reduce(function(sum, b) {
                    //console.log(sum + (1 * b.amount))
                    return (sum + (1 * b.amount));
                }, 0);
            }else{
                return 0;
            }
        },
        getTotalPaid(){
            if(this.medicals.payment){
                return this.medicals.payment.reduce(function(sum, b) {
                    //console.log(sum + (1 * b.amount))
                    return (sum + (1 * b.total));
                }, 0);
            }else{
                return 0;
            }
        },
        getTotalDrug(){
            if(this.medicals.drugs){
                return this.medicals.drugs.reduce(function(sum, b) {
                    //console.log(sum + (1 * b.amount))
                    return (sum + (1 * b.selling_price));
                }, 0);
            }else{
                return 0;
            }
        },
        isPatientCleared(){
            return this.medicals.med.is_patient_cleared==1;
        }
    },
    methods: {
        ...mapActions(["setDomain", "setSearch", "checkStorage"]),
        innitialize: function() {
            this.departments = LS.get("department");
            this.settings = LS.get("settings");
            setTimeout(this.loadPatientMedics, 200);
        },
        loadPatientMedics: function(){
            this.$Progress.start();
            this.get(`/patient-med/med/${this.id}`)
            .then(resp=>{
                if(resp.status>0){
                    //console.log(resp.response);
                    this.patient=resp.response.patient;
                    this.medicals=resp.response;
                }
            })
            .finally(()=>{
                console.log(this.patient)
                this.$Progress.finish();
            })
        },
    },
    mounted(){
        this.id=this.$route.params.id;
        this.innitialize();
    }
}
</script>

<style>

</style>