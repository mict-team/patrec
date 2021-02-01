<template>
    <v-container>
        <v-toolbar row wrap>
            <v-toolbar-title >Customer change book</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="primary" white-text @click="search_dialog = true"><v-icon>search</v-icon>Search</v-btn>
            <v-btn class="info" white-text @click="change_dialog = true"><v-icon>assignment</v-icon>Register change</v-btn>
            <v-btn class="primary" @click="printReceipt"><v-icon>local_printshop</v-icon>Print list</v-btn >
        </v-toolbar>
        <v-card row wrap>
            <v-container grid-list-sm class="pa-4">
                <v-layout row>
                    <v-flex xs12>
                        <div class="portlet light">
                            <div class="portlet-body">
                                <div class="panel light panel-accent-blue">
                                    <table class="table" cellpadding="5px" cellspacing="5px" >
                                        <thead>
                                            <tr>
                                                <th style="text-align:center">SN</th>
                                                <th style="text-align:center">Customer</th>
                                                <th style="text-align:center">Receipt no</th>
                                                <th style="text-align:center">Amount</th>
                                                <th style="text-align:center">Status</th>
                                                <th style="text-align:center">By</th>
                                                <th style="text-align:center">Date</th>
                                                <th style="text-align:center">Giver</th>
                                                <th style="text-align:center">Date</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in lists" :key="index">
                                                <td style="width:1%;">{{index + 1}}</td>
                                                <td style="text-align:center; width:20%">{{item.customer}}</td>
                                                <td style="text-align:center">{{item.invoice_no}}</td>
                                                <td style="text-align:center">{{item.amount | toDecimal}}</td>
                                                <td style="text-align:center">
                                                    <v-flex red v-if="parseInt(item.status)==0">Waiting</v-flex>
                                                    <v-flex green v-else>Given</v-flex>
                                                </td>
                                                <td style="text-align:center">{{item.collector}}</td>
                                                <td style="text-align:center">{{item.date}}</td>
                                                <td style="text-align:center">{{item.giver}}</td>
                                                <td style="text-align:center">{{item.give_date}}</td>
                                                <td style="text-align:left">
                                                    <v-flex v-if="parseInt(item.status)==0">
                                                        <v-btn primary @click="giveChange(item)">Give change</v-btn>
                                                    </v-flex>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    
    
        <v-dialog v-model="change_dialog" width="400px">
            <v-card>
                <v-card-title class="grey lighten-4 py-4 title">
                    Add new customer change
                </v-card-title>
                <v-container grid-list-sm class="pa-4">
                    <v-layout row wrap>
                        <v-flex xs12 class="form-group" >
                            <label for="Name">Name</label>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Name"
                                v-model="item.customer"
                            />
                        </v-flex>
                        <v-flex xs12 class="form-group">
                            <label for="Receipt no">Receipt number</label>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Receipt no"
                                v-model="item.invoice"
                            />
                        </v-flex>
                        <v-flex xs12 class="form-group">
                            <label for="Amount">Amount</label>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Amount"
                                v-model="item.amount"
                            />
                        </v-flex>
                        
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="change_dialog = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="postChange">Register</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="search_dialog" width="400px">
            <v-card>
                <v-card-title class="grey lighten-4 py-4 title">
                    Search customer change
                </v-card-title>
                <v-container grid-list-sm class="pa-4">
                    <v-layout row wrap>
                        <v-flex xs12 class="form-group">
                            <label for="Receipt no">Name</label>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Name"
                                v-model="search.name"
                            />
                        </v-flex>
                        <v-flex xs12 class="form-group">
                            <label for="Receipt no">Receipt number</label>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Receipt no"
                                v-model="search.code"
                            />
                        </v-flex>
                        
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="search_dialog = false"
                        >Cancel</v-btn
                    >
                    <v-btn flat color="primary" @click="searchChange"><v-icon>search</v-icon>Search</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import { URL, LS } from "../../../shared/config.js";
    import { mapState, mapActions } from "vuex";
    export default {
        data() {
            return {
                headers: [
                    { text: "SN", align: "left", sortable: false, value: "index" },
                    { text: "Customer", align: "left", sortable: true, value: "code" },
                    { text: "Amount", align: "left", sortable: true, value: "desc" },
                    { text: "Collector", value: "amount", sortable: false, align: "left" },
                    { text: "Date", value: "date", sortable: false, align: "left" },
                    { text: "Status", value: "status", sortable: false, align: "left" },
                    { text: "Giver", value: "collector", sortable: false, align: "left" },
                    { text: "Date", value: "date_2", sortable: false, align: "left" },
                    { text: "", value: "action", sortable: false, align: "left" }
                ],
                
                loadingDialog: false,
                productSearchInput:'',
                showButton:false,
                change_dialog: false,
                search_dialog: false,
                error_dialog:false,
                message:'',
                item: {
                    customer:'',
                    invoice:'',
                    amount:0,
                    collector:LS.get('user').name,
                    date: '',
                    status:0,
                    giver:'',
                    gdate:''
                },
                search: {
                    key: 'search',
                    name: '',
                    code: ''
                },
                lists:[]
            };
        },
        computed: {
            ...mapState(["domain", "today", "outlet"]),
            checkStatus: function(status){
                return (parseInt(status)==0)?false:true;
            }
        },
        props: {
            source: String
        },
        methods: {
            ...mapActions(["getToday"]),

            getList:function(){
                this.loadingDialog=true
                var params={
                    outlet:this.outlet
                }
                //console.log(JSON.stringify(params))
                this.post(this.domain + "/customer-change", params)
                .then(response => {
                    if(response.data.status>0){
                        this.lists=response.data.response;
                    }
                    this.loadingDialog=false
                })
                .catch(e => {
                    //
                    this.loadingDialog=false
                });
            },

            printReceipt: function() {
                
            },

            viewItems: function(item){
                this.item=item;
            },
            searchChange: function(){
                this.search_dialog=false;
                this.loadingDialog=true;
                var params={
                    outlet:this.outlet,
                    item:this.search
                }
                //console.log(JSON.stringify(params))
                this.post(this.domain + "/customer-change", params)
                .then(response => {
                    if(response.data.status>0){
                        this.lists=response.data.response;
                    }
                    this.loadingDialog=false;
                })
            },
            addNew: function(){
                this.change_dialog=true;
            },
            postChange: function(){
                this.loadingDialog=true;
                this.item.date=this.today;
                var params={
                    outlet:this.outlet.id,
                    item:this.item
                }
                
                this.post(this.domain + "/put-change", params)
                .then(response => {
                    if(response.data.status>0){
                        this.lists.push(this.item);
                    }
                    this.loadingDialog=false;
                })
                .catch(e => {
                    //
                    this.loadingDialog=false;
                });
            },
            giveChange: function(item){
                this.loadingDialog=true
                var params={
                    customer:item.customer,
                    invoice: item.invoice_no,
                    amount:item.amount,
                    collector:item.collector,
                    date: item.date,
                    status:1,
                    giver:LS.get('user').name,
                    gdate:this.today
                };
                var index=this.lists.findIndex(x=>x.id==item.id);
                //console.log(JSON.stringify(params))
                this.post(this.domain + "/put-change", params)
                .then(response => {
                    if(response.data.status>0){
                        this.lists.splice(index, 1);
                    }
                    this.loadingDialog=false;
                })
                .catch(e => {
                    //
                    this.loadingDialog=false;
                });
            },
            cancelBilling: function(){
                
            }
        },
        mounted() {
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