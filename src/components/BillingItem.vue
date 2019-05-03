<template>
  <v-app id="inspire">
    <v-layout row wrap>
        <v-flex xs12>
            <v-layout row wrap>
                <v-flex xs8 id="print">
                    <v-flex xs12>
                        <div class="page-header">
                            <v-layout row wrap>
                                <v-flex xs7 row wrap>
                                    <v-flex xs12>{{patients.name}} (File no:{{patients.file}})</v-flex>
                                </v-flex>
                                <v-flex xs5 justify-right align-right class="no-print">
                                    <v-btn class="primary"
                                        @click="printReceipt"><v-icon>local_printshop</v-icon>Print biilings</v-btn
                                    >
                                    <v-btn class="red"
                                        @click="cancelBilling"><v-icon>chevron_left</v-icon>Cancel</v-btn
                                    >
                                </v-flex>
                            </v-layout>
                        </div>
                    </v-flex>
                    <v-divider></v-divider>

                    <v-flex xs12>
                        <v-data-table
                        :headers="headers"
                        :items="items"
                        item-key="customer.name"
                        class="elevation-1"
                        >
                        <template v-slot:items="props">
                            <tr>
                                <td>{{ props.index + 1 }}</td>
                                <td>{{ props.item.code }}</td>
                                <td>{{ props.item.remark }}</td>
                                <td>{{ props.item.total | toDecimal }}</td>
                                <td>{{ props.item.date }}</td>
                                <td>{{ props.item.user.name }}</td>
                                <td>
                                    <v-btn @click="viewItems(props.item)">View added items</v-btn>
                                </td>
                            </tr>
                        </template>
                        </v-data-table>
                    </v-flex>
                </v-flex>
                <v-flex xs4>
                    <v-card>
                        <v-toolbar>
                            <v-toolbar-title>DETAIL BREAKDOWN</v-toolbar-title>
                            <v-spacer></v-spacer>
                            
                        </v-toolbar>
                    </v-card>
                    <div class="portlet light">
                        <div class="portlet-body">
                            <div class="panel light panel-accent-blue">
                                <table class="table" cellpadding="5px" cellspacing="5px" >
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>QTY</th>
                                            <th>Desc</th>
                                            <th>Subtotal</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in oldBilling.items" :key="index">
                                            <td style="width:20%;">{{index + 1}}</td>
                                            <td style="text-align:right">{{item.qty_sold}}</td>
                                            <td style="text-align:right">{{item.name}}<br>{{item.tag}}</td>
                                            <td style="text-align:right">{{item.amount | toDecimal}}</td>
                                            <td style="text-align:right">{{item.total | toDecimal}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <v-divider></v-divider>
                                
                            </div>
                        </div>
                    </div>
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
    <v-dialog v-model="paynow_dialog" width="800px">
        <v-card align-center>
            <v-card-title class="grey lighten-4 py-4 title">
            Select payment method
            </v-card-title>
            <v-container grid-list-sm class="pa-4">
            <v-layout row wrap style="text-align:center">
                <v-card>
                <v-layout row wrap>
                    <v-flex
                    v-for="(method, index) in paymentMethods"
                    :key="index"
                    @click="paynowHandler(method)"
                    >
                    <v-card class="red thumbnail">
                        <v-container fill-height fluid pa-2>
                        <v-layout fill-height>
                            <v-flex xs12 align-end flexbox>
                            <span
                                class="headline white--text"
                                v-text="method.name"
                            ></span>
                            </v-flex>
                        </v-layout>
                        </v-container>
                    </v-card>
                    </v-flex>
                </v-layout>
                </v-card>
            </v-layout>
            </v-container>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="paynow_dialog = false"
                >Cancel</v-btn
            >
            </v-card-actions>
        </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
    import { URL, LS } from "../shared/config.js";
    import axios from "axios";
    import Receipt from "./Receipt";
    import { mapState, mapActions } from "vuex";
    const { remote } = window.require("electron");
    const { BrowserWindow } = remote;
    const ipcRenderer = window.require("electron").ipcRenderer;
    export default {
        data() {
            return {
                headers: [
                    { text: "SN", align: "left", sortable: false, value: "index" },
                    { text: "Code", align: "left", sortable: true, value: "code" },
                    { text: "Description", align: "left", sortable: true, value: "desc" },
                    { text: "Amount", value: "amount", sortable: false, align: "left" },
                    { text: "Date", value: "date", sortable: false, align: "left" },
                    { text: "Collector", value: "collector", sortable: false, align: "left" },
                    { text: "", value: "action", sortable: false, align: "left" },
                ],
                
                loadingDialog: false,
                isPaid:false,
                viewReceipt:false,
                paymentmethod: [],
                productSearchInput:'',
                showButton:false,
                error_dialog:false,
                paynow_dialog:false,
                billing_dialog:false,
                message:'',
                
                items: [],
                list:[],
                patients:[],
                oldBilling: []
            };
        },
        computed: {
            ...mapState(["domain", "today", "transCode", "billings", "outlet", "paymentMethods"])
        },
        components: {
            Receipt
        },
        props: {
            source: String
        },
        methods: {
            ...mapActions(["addBilling", "getCode", "getToday", "checkStorage", "updateBilling"]),

            getList:function(){
                this.patients=LS.get('bill');
                //console.log(JSON.stringify(this.patients))
                axios.post(this.domain + "/getBillingItems", this.patients)
                .then(response => {
                    //console.log(response.data.response)
                    if(response.data.status>0){
                        this.items=response.data.response;
                    }
                })
                .catch(e => {
                    //
                });
                
                //console.log(this.patients);
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

            putTotal: function(){
                this.cartBilling.total=this.cartBilling.amount - this.cartBilling.discount;
            },
            makePayment: function() {
                var user=LS.get('user');
                this.cartBilling.user=user;
                
                if (!this.cartBilling.amount || !this.cartBilling.name) {
                    this.message = "Kindly enter payment details.";
                    this.error_dialog = true;
                } else {
                    this.paynow_dialog = true;
                    this.isPaid = false;
                } 
            },
            viewItems: function(item){
                this.oldBilling=item;
                //console.log(item)
            },
            emptyCart: function(){
                this.cartBilling={
                    date:'',
                    amount: 0.0,
                    code: Math.floor(Math.random() * 1000000000 + 1),
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
            },
            cancelBilling: function(){
                LS.remove('bill');
                this.$router.push("/billing");
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