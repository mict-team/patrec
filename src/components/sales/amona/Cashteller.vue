<template>
    <v-container>
        <v-toolbar row wrap>
            <v-btn color="red" @click="goBack"
            ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
            >
            <v-toolbar-title >Cash teller</v-toolbar-title>
            <v-spacer></v-spacer>
            <button class="btn btn-info" @click="addNew">Drop cash</button>
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
                                                <th style="text-align:center">Receipt no</th>
                                                <th style="text-align:center">Amount</th>
                                                <th style="text-align:center">Date</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in lists" :key="index">
                                                <td style="width:1%;">{{index + 1}}</td>
                                                <td style="text-align:center; width:20%">{{item.collector}}</td>
                                                <td style="text-align:center">{{item.code}}</td>
                                                <td style="text-align:center">{{item.total | toDecimal}}</td>
                                                <td style="text-align:center">{{item.date}}</td>
                                                <td style="text-align:left">
                                                    <v-btn primary @click="viewBreak(item)" class="primary no-print">View breakdown</v-btn>

                                                    <v-btn primary @click="trashItem(item)" class="red no-print">Trash</v-btn>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </v-flex>
                    <v-flex xs4>
                        <v-layout row wrap>
                            <v-flex xs7 row wrap>
                                {{toView.code}}
                            </v-flex>
                            <v-flex xs5>
                                {{toView.total | toDecimal}}
                            </v-flex>
                        </v-layout>
                        <div class="portlet light">
                            <div class="portlet-body">
                                <div class="panel light panel-accent-blue">
                                    <table class="table" cellpadding="5px" cellspacing="5px" >
                                        <thead>
                                            <tr>
                                                <th style="text-align:center">SN</th>
                                                <th style="text-align:center">Deno</th>
                                                <th style="text-align:center">Qty</th>
                                                <th style="text-align:center">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in toView.items" :key="index">
                                                <td style="width:1%;">{{index + 1}}</td>
                                                <td style="text-align:center; width:20%">{{item.deno}}</td>
                                                <td style="text-align:center">{{item.qty}}</td>
                                                <td style="text-align:center">{{item.total | toDecimal}}</td>
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
    
       
        <v-dialog v-model="change_dialog" width="500px">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title>New teller</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-title>{{item.total | toDecimal}}</v-toolbar-title>
                </v-toolbar>
                <v-container grid-list-sm class="pa-4">
                    <v-layout row wrap>
                        <v-flex xs4>
                            <v-layout align-center>
                                <v-select
                                    v-model="list.deno"
                                    :items="['1000','500','200','100','50','20', '10','5']"
                                    label="Denomination"
                                    dense
                                    outlined
                                ></v-select>
                                
                            </v-layout>
                        </v-flex>
                        <v-flex xs4>
                            <v-layout align-center>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Qty"
                                    v-model="list.qty"
                                />
                            </v-layout>
                        </v-flex>
                        <v-flex xs1><v-btn class="primary" @click="pushTeller">Add</v-btn></v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <table class="table" cellpadding="5px" cellspacing="5px" >
                                <thead>
                                    <tr>
                                        <th style="text-align:center">SN</th>
                                        <th style="text-align:center">Denomination</th>
                                        <th style="text-align:center">Qty</th>
                                        <th style="text-align:center">Amount</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in item.list" :key="index">
                                        <td style="width:1%;">{{index + 1}}</td>
                                        <td style="text-align:center; width:20%">{{item.deno}}</td>
                                        <td style="text-align:center">{{item.qty}}</td>
                                        <td style="text-align:center">{{item.total | toDecimal}}</td>
                                        <td style="text-align:left">
                                            <v-icon @click="removeItem(item)">delete_forever</v-icon>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="change_dialog = false"
                        >Cancel</v-btn
                    >
                    <v-btn flat color="primary" @click="postTeller">Save</v-btn>
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
                        <v-flex xs12 align-center>
                            <v-menu
                                v-model="modalDate"
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
                                    v-model="search.date"
                                    label="From"
                                    prepend-icon="event"
                                    readonly
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker v-model="search.date" @input="modalDate = false" :landscape="true" :relative="true"></v-date-picker>
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
                loadingDialog: false,
                productSearchInput:'',
                showButton:false,
                change_dialog: false,
                search_dialog: false,
                error_dialog:false,
                modalDate:false,
                message:'',
                user: LS.get('user'),
                size:'xs12',
                item: {
                    collector:this.user,
                    code:'',
                    date: '',
                    total:0.0,
                    list: []
                },
                list:{
                    deno:'',
                    qty:1,
                    total:0.0
                },
                search: {
                    user: [],
                    date: ''
                },
                toView:[],
                lists:[]
            };
        },
        computed: {
            ...mapState(["domain", "today","transCode","outlet",  "users"]),
            checkStatus: function(status){
                return (parseInt(status)==0)?false:true;
            }
        },
        props: {
            source: String
        },
        methods: {
            ...mapActions(["getToday","getCode"]),

            getList:function(){
                this.loadingDialog=true;
                var params={
                    outlet:this.outlet,
                    user: this.user
                }
                console.log(JSON.stringify(params))
                this.post(this.domain + "/get-teller", params)
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

            printReceipt: function() {
                
            },

            pushTeller: function(){
                this.list.total=parseInt(this.list.deno) * parseInt(this.list.qty);
                this.item.list.push(this.list);
                this.item.total +=parseFloat(this.list.total);
                this.list={
                    deno:'',
                    qty:1,
                    total:0.0
                }
            },
            removeItem: function(item){
                var index=this.item.list.findIndex(x=>x.deno==item.deno);
                this.item.list.splice(index, 1);
                this.item.total -=parseFloat(item.total);
            },
            searchChange: function(){
                this.search_dialog=false;
                this.loadingDialog=true;
                var params={
                    outlet:this.outlet,
                    user: (this.user.acct_type==1)?this.search.user:this.user,
                    date: this.search.date
                }
                console.log(JSON.stringify(params))
                this.post(this.domain + "/get-teller", params)
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
            postTeller: function(){
                this.loadingDialog=true;
                this.item.date=this.today;
                this.item.code=this.transCode;
                this.item.collector=this.user;
                var params={
                    outlet:this.outlet,
                    item:this.item
                }
                //console.log(JSON.stringify(params))
                this.post(this.domain + "/put-teller", params)
                .then(response => {
                    if(response.data.status>0){
                        this.lists.push(this.item);
                        this.change_dialog=false;
                    }
                    this.loadingDialog=false;
                })
                .catch(e => {
                    //;
                    this.loadingDialog=false
                });
            },
            viewBreak: function(item){
                this.size="xs8"
                this.toView={
                    code:item.code,
                    total:item.total,
                    items:JSON.parse(item.list)
                };
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
            }
            
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