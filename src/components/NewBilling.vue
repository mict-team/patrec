<template>
  <v-app id="inspire">
    <v-layout row wrap>
        <v-flex xs12>
            <v-layout row wrap>
                <v-flex xs12 id="print">
                    <v-flex xs12>
                        <div class="page-header">
                            <v-layout row wrap>
                                <v-flex xs7 row wrap>
                                    <v-flex xs3>Billing List</v-flex>
                                    <v-flex xs9>
                                        <v-flex xs12 align-center justify-space-between>
                                            <v-text-field
                                            append-icon="search"
                                            class="mx-3"
                                            flat
                                            label="Search"
                                            prepend-inner-icon="search"
                                            solo-inverted
                                            @input="searchProduct"
                                            v-model="productSearchInput"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-flex>
                                </v-flex>
                                <v-flex xs5 justify-right align-right class="no-print">
                                    <v-btn primary
                                        @click="createNewBilling"><v-icon>person</v-icon>Create new bill</v-btn
                                    >
                                    <v-btn primary
                                        @click="printReceipt"><v-icon>local_printshop</v-icon>Print biiling list</v-btn
                                    >
                                </v-flex>
                            </v-layout>
                        </div>
                    </v-flex>
                    <v-divider></v-divider>

                    <v-flex xs12>
                        
                        <v-data-table
                        :headers="headers"
                        :items="list"
                        item-key="index"
                        class="elevation-1"
                        >
                        <template v-slot:items="props">
                            <tr>
                                <td>{{ props.index + 1 }}</td>
                                <td>{{ props.item.name }}</td>
                                <td>{{ props.item.file }}</td>
                                <td>{{ props.item.total | toDecimal }}</td>
                                <td>{{ props.item.date }}</td>
                                <td>{{ props.item.collector }}</td>
                                <td>
                                    <v-btn @click="addPayment(props.item)">View payment</v-btn>
                                </td>
                            </tr>
                        </template>
                        </v-data-table>
                    </v-flex>
                </v-flex>
            </v-layout>
        </v-flex>
        
        
    </v-layout>
    <v-dialog v-model="error_dialog" width="400px">
        <v-card align-center>
            <v-card-title class="grey lighten-4 py-4 title">
            Error message
            </v-card-title>
            <v-container grid-list-sm class="pa-4">
            {{ message }}
            </v-container>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="error_dialog = false"
                >Close</v-btn
            >
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="billing_dialog" width="800px">
        <v-card>
            <v-card-title class="grey lighten-4 py-4 title">
                Add new customer
            </v-card-title>
            <v-container grid-list-sm class="pa-4">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-layout align-center>
                            <v-text-field
                            prepend-icon="person"
                            placeholder="Name"
                            v-model="patients.name"
                            ></v-text-field>
                        </v-layout>
                    </v-flex>
                    <v-flex xs6>
                        <v-layout align-center>
                            <v-text-field
                            prepend-icon="book"
                            placeholder="File no"
                            v-model="patients.file"
                            ></v-text-field>
                        </v-layout>
                    </v-flex>
                    <v-flex xs6>
                        <v-layout align-center>
                            <v-menu
                                v-model="admissionModal"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on }">
                                <v-text-field
                                    v-model="patients.dateOfAdmission"
                                    label="Date of admission"
                                    prepend-icon="event"
                                    readonly
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker v-model="patients.dateOfAdmission" @input="admissionModal = false" :landscape="true" :relative="true"></v-date-picker>
                            </v-menu>
                            
                        </v-layout>
                    </v-flex>
                    <v-flex xs6 align-center justify-space-between>
                        <v-layout align-center>
                            <v-avatar size="40px" class="mr-3">
                            <v-icon>person</v-icon>
                            </v-avatar>
                            <v-select
                            :items="['Male', 'Female']"
                            label="Gender"
                            v-model="patients.sex"
                            ></v-select>
                        </v-layout>
                    </v-flex>

                    <v-flex xs6 align-center justify-space-between>
                        <v-layout align-center>
                            <v-avatar size="40px" class="mr-3">
                            <v-icon>person</v-icon>
                            </v-avatar>
                            <v-select
                            :items="['Single', 'Married', 'Widow', 'Widower']"
                            label="Marital status"
                            v-model="patients.mstatus"
                            ></v-select>
                        </v-layout>
                    </v-flex>
                    <v-flex xs6 align-center justify-space-between>
                        <v-menu
                            v-model="dobModal"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            lazy
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                            >
                            <template v-slot:activator="{ on }">
                            <v-text-field
                                v-model="patients.dob"
                                label="Date of birth"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker v-model="patients.dob" @input="dobModal = false" :landscape="true" :relative="true"></v-date-picker>
                        </v-menu>
                        
                    </v-flex>

                    <v-flex xs6 align-center justify-space-between>
                        <v-layout align-center>
                            <v-text-field
                            prepend-icon="telephone"
                            placeholder="Phone"
                            v-model="patients.phone"
                            ></v-text-field>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 align-center justify-space-between>
                        <v-layout align-center>
                            <v-text-field
                            prepend-icon="email"
                            placeholder="Email"
                            v-model="patients.email"
                            ></v-text-field>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 align-center justify-space-between>
                        <v-layout align-center>
                            <v-text-field
                            prepend-icon="location_on"
                            placeholder="Address"
                            v-model="patients.address"
                            ></v-text-field>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="billing_dialog = false"
                    >Cancel</v-btn
                >
                <v-btn flat @click="saveBilling">Open account</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
    import { URL, LS } from "../shared/config.js";
    import axios from "axios";
    import { mapState, mapActions } from "vuex";
    const { remote } = window.require("electron");
    const { BrowserWindow } = remote;
    const ipcRenderer = window.require("electron").ipcRenderer;
    export default {
        data: function() {
            return {
                headers: [
                    { text: "SN", align: "left", sortable: false, value: "index" },
                    { text: "Name", align: "left", sortable: true, value: "name" },
                    { text: "Card no", align: "left", sortable: true, value: "card" },
                    { text: "Total", value: "amount", sortable: false, align: "left" },
                    { text: "Date", value: "date", sortable: false, align: "left" },
                    { text: "Staff", value: "staff", sortable: false, align: "left" },
                    { text: "", value: "action", sortable: false, align: "left" },
                ],
                dobModal:false,
                admissionModal:false,
                filterForm: false,
                list: [],
                date: new Date().toISOString().substr(0, 10),
                loadingDialog: false,
                productSearchInput:'',
                error_dialog:false,
                paynow_dialog:false,
                billing_dialog:false,
                message:'',
                patients: {
                    code:"",
                    name: "",
                    file: '',
                    dateOfAdmission:'',
                    sex: "",
                    dob: "",
                    mstatus: "",
                    email: "",
                    phone: "",
                    address: "",
                    total: 0.0,
                    sync: false,
                    date:'',
                    user:[],
                    items: {
                        date:'',
                        amount: 0.0,
                        code: '',
                        discount: 0,
                        inventory: 0,
                        name: "",
                        qty: 1,
                        revenue: '',
                        total: 0.0,
                        unit: '',
                        user:[],
                        payment:[]
                    }
                }
            };
        },
        computed: {
            ...mapState(["domain", "outlet", "today", "transCode", "billings", "paymentMethods"]),
        },
        
        props: {
            source: String
        },
        methods: {
            ...mapActions(["addBilling", "getCode", "getToday", "checkStorage", "saveStorage"]),

            getList:function(){
                this.list= this.list || [];
                var postData={
                    outlet: this.outlet
                };
                //console.log(JSON.stringify(postData));
                axios.post(this.domain + "/getBilling", postData)
                .then(response => {
                    if(response.data.status>0){
                        if(response.data.response !=null){
                            this.list=response.data.response;
                        }
                    }
                })
                .catch(e => {
                    //
                });
                if(this.billings.length>0){
                    this.list.push(...this.billings)
                }
                //console.log(this.list)
            },

            searchProduct() {
                this.list=this.billings.filter(item => {
                    return item.name.toLowerCase().includes(this.productSearchInput.toLowerCase())
                })
            },
            printReceipt: function() {
                //window.print();
                let stylesHtml = "";
                for (const node of [
                    ...document.querySelectorAll('link[rel="stylesheet"], style')
                ]) {
                    stylesHtml += node.outerHTML;
                }

                const prtHtml = this.jQuery("#print").html();
                var content = `<!DOCTYPE html>
                            <html>
                            <head>
                                ${stylesHtml}
                            </head>
                            <body>
                                ${prtHtml}
                            </body>
                            </html>`;
                ipcRenderer.send("readyToPrint");
            },
            createNewBilling: function(){
                this.billing_dialog=true;
            },
            saveBilling: function(){
                if(this.patients.name.length<1 || this.patients.dateOfAdmission.length<1){
                    this.message="Name, file number and date of admission must be filled.";
                    this.error_dialog=true;
                }else{
                    this.patients.code=this.transCode;
                    this.patients.date=this.today;
                    this.patients.user=LS.get('user');
                    this.billing_dialog=false;
                    
                    let postData = {
                        outlet: this.outlet,
                        patient: this.patients
                    };
                    axios.post(this.domain + "/postBilling", postData)
                    .then(response => {
                        if(response.data.status>0){
                            this.patients.sync=true;
                            //inserted=true;
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    });
                    //console.log(this.patients)
                    this.list.push(this.patients);
                    this.addBilling(this.patients);
                    this.initPatient()
                }
                
            },
            addPayment: function(payee){
                LS.set('bill', payee)
                this.$router.push('/billing-list');
            },
            
            initPatient: function(){
                this.patients= {
                    code:"",
                    name: "",
                    file:"",
                    dateOfAdmission:'',
                    sex: "",
                    dob: "",
                    mstatus: "",
                    email: "",
                    phone: "",
                    address: "",
                    total: 0.0,
                    sync: false,
                    user:[],
                    items: {},
                    
                }
            }
        },
        mounted() {
            //this.checkStorage();
            this.getCode();
            this.getToday();
            this.getList();
        }
        };
</script>

<style>
    .page-header {
        width: 100%;
        height: 70px;
        padding: 10px 20px 10px 20px;
        font-size: 2em;
    }
</style>
</script>
<style></style>