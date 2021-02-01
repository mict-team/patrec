<template>
    <v-container>
        <v-toolbar row wrap>
            <v-toolbar-title>
                <v-row>
                    <v-col md="4">
                        Expenses
                    </v-col>
                    <v-col md="5" style="color:red">
                        Total: &#8358;{{getTotalSum | toDecimal}}
                    </v-col>
                    <v-col md="3" style="color:green">
                        Records: {{getTotalRecord}}
                    </v-col>
                </v-row>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="primary" white-text @click="search_dialog = true"><v-icon>search</v-icon>Search</v-btn>     
            <v-btn class="primary" @click="printReceipt"><v-icon>local_printshop</v-icon>Print tellers</v-btn>
        </v-toolbar>
        <v-card row wrap>
            <v-container grid-list-sm class="pa-4">
                <v-layout row>
                    <v-flex  xs8>
                        <div class="portlet light">
                            <div class="portlet-body">
                                <div class="panel light panel-accent-blue">
                                    <table class="table" cellpadding="5px" cellspacing="5px" >
                                        <thead>
                                            <tr>
                                                <th style="text-align:center">SN</th>
                                                <th style="text-align:center">Collector</th>
                                                <th style="text-align:center">Code</th>
                                                <th style="text-align:center">Amount</th>
                                                <th style="text-align:center">Description</th>
                                                <th style="text-align:center">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in lists" :key="index">
                                                <td style="width:1%;">{{index + 1}}</td>
                                                <td style="text-align:center; width:20%">{{item.collector.name}}</td>
                                                <td style="text-align:center">{{item.code}}</td>
                                                <td style="text-align:center">{{item.amount | toDecimal}}</td>
                                                <td style="text-align:center">{{item.description}}</td>
                                                <td style="text-align:center">{{item.date}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </v-flex>
                    <v-flex xs4 class="primary">
                        <v-layout row wrap style="color:white">
                            <v-flex xs7 >
                                <h5>Add Expense</h5>
                            </v-flex>
                        </v-layout>
                        <div class="portlet light">
                            <div class="portlet-body">
                                <div class="panel light panel-accent-blue">
                                    <v-flex xs12 class="form-group">
                                        <label for="Receipt no">How much?</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="How much?"
                                            v-model="list.amount"
                                        />
                                    </v-flex>
                                    <v-flex xs12 class="form-group">
                                        <label for="Receipt no">What for?</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="What for?"
                                            v-model="list.description"
                                        />
                                    </v-flex>
                                    <v-flex xs12 class="form-group">
                                        <label for="Receipt no">By who?</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="By who?"
                                            v-model="list.description"
                                        />
                                    </v-flex>
                                </div>
                            </div>
                            <div class="portlet-footer">
                                <v-btn  class="primary" white-text @click="showLock">Save expense</v-btn>
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    
        <v-dialog v-model="error_dialog" hide-overlay persistent width="400px">
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
        
        <v-dialog v-model="search_dialog" width="400px">
            <v-card>
                <v-card-title class="grey lighten-4 py-4 title">
                    Search cash teller
                </v-card-title>
                <v-container grid-list-sm class="pa-4">
                    <v-layout row wrap>
                        <v-flex xs6 align-center>
                            <v-menu
                                v-model="modalDateFrom"
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
                                    v-model="search.dateFrom"
                                    label="From"
                                    prepend-icon="event"
                                    readonly
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker v-model="search.dateFrom" @input="modalDateFrom = false" :landscape="true" :relative="true"></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex xs6 align-center>
                            <v-menu
                                v-model="modalDateTo"
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
                                    v-model="search.dateTo"
                                    label="From"
                                    prepend-icon="event"
                                    readonly
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker v-model="search.dateTo" @input="modalDateTo = false" :landscape="true" :relative="true"></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex xs12 align-center  v-if="user.acct_type==1">
                            <v-layout align-center>
                                <v-select
                                v-model="search.user"
                                :items="users"
                                item-text="name"
                                item-value="id"
                                prepend-icon="person"
                                label="Collector"
                                ></v-select>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="search_dialog = false"
                        >Cancel</v-btn
                    >
                    <v-btn flat @click="searchChange"><v-icon>search</v-icon>Search</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="loadingDialog" hide-overlay persistent width="300">
        <v-card color="primary" dark>
            <v-card-text>
            Processing. Please hold on.
            <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
            ></v-progress-linear>
            </v-card-text>
        </v-card>
        </v-dialog>
        <v-dialog v-model="waver_dialog" hide-overlay persistent  width="400px">
        <v-card align-center>
            <v-card-title class="grey lighten-4 py-4 title">
            Waver lock
            </v-card-title>
            <v-container grid-list-sm class="pa-4">
            <v-layout xs12 row>
                <v-flex xs8>
                <v-form>
                    <v-flex xs12>
                    <v-layout align-center>
                        <v-text-field
                        prepend-icon="person"
                        placeholder="Username"
                        type="text"
                        v-model="waver.username"
                        ></v-text-field>
                    </v-layout>
                    </v-flex>
                    <v-flex xs12>
                    <v-layout align-center>
                        <v-text-field
                        prepend-icon="lock"
                        placeholder="Password"
                        type="password"
                        v-model="waver.password"
                        ></v-text-field>
                    </v-layout>
                    </v-flex>
                </v-form>
                </v-flex>
                <v-flex xs3 style="padding-top:20px !important;"><v-icon color="blue" size="112px">lock</v-icon></v-flex>
            </v-layout>
            
            </v-container>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="red" @click="waver_dialog = false"
                >Close</v-btn
            >
            <v-btn flat color="primary" @click="postTeller"
                >Continue</v-btn
            >
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
                loadingDialog: false,
                productSearchInput:'',
                showButton:false,
                change_dialog: false,
                search_dialog: false,
                error_dialog:false,
                waver_dialog: false,
                modalDateFrom:false,
                modalDateTo:false,
                total:0.0,
                numRec:0,
                message:'',
                user: LS.get('user'),
                waver: {'username':'', 'password':''},
                size:'xs12',
                list:{
                    amount:0.0,
                    description:'',
                    date: '',
                    collector:[],
                    code: '',
                    register:[]
                },
                search: {
                    user: [],
                    dateFrom: '',
                    dateTo:''
                },
                toView:[],
                lists:[]
            };
        },
        computed: {
            ...mapState(["domain", "today","transCode","outlet",  "users", "expenses","register"]),
            checkStatus: function(status){
                return (parseInt(status)==0)?false:true;
            },
            getTotalSum: function(){
                var sum=0;
                for(var i=0; i<this.lists.length; i++){
                    sum+=this.lists[i]['amount'];
                }
                return sum;
            },
            getTotalRecord: function(){
                return this.lists.length;
            },
        },
        props: {
            source: String
        },
        methods: {
            ...mapActions(["getToday","getCode", "addExpense"]),

            getList:function(){
                this.loadingDialog=true;
                var params={
                    outlet:this.outlet,
                    user: this.user
                }
                //console.log(JSON.stringify(params))
                this.post(this.domain + "/get-expense", params)
                .then(response => {
                    if(response.data.status>0){
                        this.lists=response.data.response.report;
                    }
                    this.loadingDialog=false;
                })
                .catch(e => {
                    this.loadingDialog=false;
                });
                this.lists.push(this.expenses);
            },

            printReceipt: function() {
                
            },

            searchChange: function(){
                this.search_dialog=false;
                this.loadingDialog=true;
                var params={
                    outlet:this.outlet,
                    user: (this.user.acct_type==1)?this.search.user:this.user,
                    date: this.search.date
                }
                //console.log(JSON.stringify(params))
                this.post(this.domain + "/get-expense", params)
                .then(response => {
                    if(response.data.status>0){
                        this.lists=response.data.response;
                    }
                    this.loadingDialog=false;
                })
                .catch(e => {
                    //
                    this.loadingDialog=false;
                });
            },
            addNew: function(){
                this.change_dialog=true;
            },
            showLock: function(){
                if(this.list.amount ==0 || this.list.description==''){
                    this.message="All fields must be filled."
                    this.error_dialog=true;
                    this.waver_dialog=false;
                }else{
                    this.waver_dialog=true;
                }
            },
            postTeller: function(){
                //this.loadingDialog=true;
                if(this.waver.username =='' || this.waver.password==''){
                    return false;
                }
                this.list.date=this.today;
                this.list.code=this.transCode;
                this.list.collector=this.user;
                this.list.register=this.register;
                var params={
                    outlet:this.outlet,
                    item:this.list
                }
                this.addExpense(this.list);
                //console.log(JSON.stringify(params))
                this.post(this.domain + "/put-expense", params)
                .then(response => {
                    if(response.data.status>0){
                        this.lists.push(this.item);
                        this.change_dialog=false;
                    }
                    //this.loadingDialog=false;
                })
                .catch(e => {
                    //;
                    //this.loadingDialog=false
                });
                this.waver_dialog=false;
                this.lists.push(this.list);
            },
            
            trashItem: function(item){
                this.loadingDialog=true;
                var index=this.lists.findIndex(x=>x.code==item.code);
                var params={
                    outlet:this.outlet,
                    item:item
                }
                //console.log(JSON.stringify(params))
                this.post(this.domain + "/delete-teller", params)
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
        },
        mounted() {
            this.getToday();
            this.getCode();
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