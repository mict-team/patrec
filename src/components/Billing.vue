<template>
  <v-app id="inspire">
    <v-layout row wrap v-if="!isPaid">
        <v-flex xs8>
            <v-layout row wrap v-if="!viewReceipt">
                <v-flex xs12 id="print">
                    <v-flex xs12>
                        <div class="page-header">
                        <v-layout row wrap>
                            <v-flex xs9 row wrap>
                            <v-flex xs3>Billing List</v-flex>
                            <v-flex>
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
                            <v-flex xs3 justify-right align-right class="no-print">
                            
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
                        item-key="name"
                        class="elevation-1"
                        >
                        <template v-slot:items="props">
                            <tr>
                                <td>{{ props.index + 1 }}</td>
                                <td>{{ props.item.code }}</td>
                                <td>{{ props.item.customer.name }}</td>
                                <td>{{ props.item.customer.file }}</td>
                                <td>{{ props.item.total | toDecimal }}</td>
                                <td>{{ props.item.date }}</td>
                                <td>{{ props.item.user.name }}</td>
                                <td>
                                    <v-btn @click="attachCustomer(props.item)" v-if="attachBTN">Add bills</v-btn>
                                </td>
                            </tr>
                        </template>
                        </v-data-table>
                    </v-flex>
                </v-flex>
            </v-layout>
            <v-layout row wrap v-else>
                <receipt style="width:100%;" v-on:closePrinter="closeReceipt"></receipt>
            </v-layout>
        </v-flex>
        <v-flex xs4>
            <v-card>
                <v-toolbar>
                    <v-toolbar-title>BILLING</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <span right v-if="!attachBTN">
                        <a href="#" @click="addCustomer(true)">Attach bill to customer</a>
                    </span>
                    <span right v-else>
                        <a href="#" @click="addCustomer(false)">Unattach bill from customer</a>
                    </span>
                </v-toolbar>
            </v-card>
            <div class="portlet light">
                <div class="portlet-body">
                    <div class="panel light panel-accent-blue">
                        <table class="table" cellpadding="5px" cellspacing="5px" >
                            <tbody>
                                <tr>
                                    <td style="width:20%;"><span>Name:</span></td>
                                    <td style="text-align:right">
                                        <input type="text" class="form-control" name="name" v-model="item.name" placeholder="Patient name"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width:20%;"><span>Card no:</span></td>
                                    <td style="text-align:right">
                                        <input type="text" class="form-control" name="card_no" v-model="item.card_no" placeholder="Card number"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width:20%;"><span>Amount:</span></td>
                                    <td style="text-align:right">
                                        <input type="text" class="form-control" name="amount" v-model="item.total" @input="putTotal" placeholder="Amount"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width:20%;"><span>Remark:</span></td>
                                    <td style="width:80%; text-align:right">
                                        <input type="text" class="form-control" name="remark" v-model="item.remark" placeholder="Add your remark"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <v-divider></v-divider>
                        
                    </div>
                    <div class="row">
                        <!-- /btn-group -->
                        <div class="col-md-9 btn-group pull-left" >
                            <button
                                type="button"
                                class="btn blue btn-lg col-md-12 pay-button"
                                @click="makePayment" 
                                style="font-size:18px;"
                            >
                                <span class="col-md-3" style="text-align:left !important;">Paynow&nbsp;</span
                                ><span class="col-md-9 amount" style="text-align:right !important;">&#8358; {{ carts.total | toDecimal }}
                                </span>
                            </button>
                        </div>
                        <div class="col-md-3 btn-group pull-right">
                        <button
                            type="button"
                            class="btn red btn-lg col-md-12 pay-button"
                            @click="emptyCart"
                        >
                            <v-icon>delete_sweep</v-icon>
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </v-flex>
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
                        v-for="(method, index) in paymentmethod"
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
    </v-layout>
    <v-layout row wrap v-else>
    <receipt style="width:100%;" v-on:closePrinter="closeReceipt"></receipt>
    </v-layout>
  </v-app>
</template>

<script>
import { URL, LS } from "../shared/config.js";
import axios from "axios";
import Receipt from "./Receipt";
import Carts from "./Cart";
import { mapState, mapActions } from "vuex";
const { remote } = window.require("electron");
const { BrowserWindow } = remote;
const ipcRenderer = window.require("electron").ipcRenderer;
export default {
  data() {
    return {
        headers: [
            { text: "SN", align: "left", sortable: false, value: "index" },
            { text: "Code", align: "left", sortable: false, value: "code" },
            { text: "Name", align: "left", sortable: true, value: "name" },
            { text: "Card no", align: "left", sortable: true, value: "card" },
            { text: "Amount", value: "amount", sortable: false, align: "left" },
            { text: "Date", value: "date", sortable: false, align: "left" },
            { text: "Collector", value: "collector", sortable: false, align: "left" },
            { text: "", value: "action", sortable: false, align: "left" },
        ],
        filterForm: false,
        list: [],
        date: new Date().toISOString().substr(0, 10),
        loadingDialog: false,
        isPaid:false,
        viewReceipt:false,
        paymentmethod: [],
        productSearchInput:'',
        showButton:false,
        error_dialog:false,
        paynow_dialog:false,
        message:'',
        item: {
            name:'',
            total: 0.0,
            remark:'',
            card_no:'',
            qty: 1,
            detail:''
        },
        carts:{
            code: "",
            subtotal: 0.0,
            overallDiscount: 0.0,
            discount: 0.0,
            vat: 0.0,
            total: 0.0,
            remark: "",
            paid: false,
            sync: false,
            date: "",
            billed:false,
            customer: {
                id: 0,
                name: "",
                file:"",
                sex: "",
                dob: "",
                mstatus: "",
                email: "",
                phone: "",
                type: 0,
                address: ""
            },
            bill:[],
            user:[],
            items: [],
            payment: []
        }
    };
  },
  computed: {
    ...mapState(["domain", "outlet", "bills", "paymentMethods"]),
    attachBTN: function(){
        return this.showButton;
    }
  },
  components: {
    Receipt
  },
  props: {
    source: String
  },
  methods: {
    ...mapActions(["addBilling", "padBills", "checkStorage", "saveStorage"]),
    getList:function(){
        this.list=this.bills;
    },
    loadMethod: function() {
      this.paymentmethod = this.paymentMethods;
    },
    searchProduct() {
      this.list=this.bills.filter(item => {
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
    putTotal: function(){
        this.carts.subtotal=this.item.total;
        this.carts.total=(Number(this.carts.subtotal) + Number(this.carts.vat)) - Number(this.carts.discount);
    },
    addCustomer: function(status){
        //console.log(this.list)
        if(this.list.length>0){
            this.showButton=status;
            if(!status){
                this.carts.customer.name="";
                this.carts.customer.card_no='';
            }
        }else{
            this.showButton=false;
            this.message="Billing list is empty. So you cannot attach to customer. Rather, create new list."
            this.error_dialog=true;
        }
        console.log(this.showButton)
    },
    attachCustomer: function(item){
        console.log(item)
        this.item.name=item.name;
        this.item.card_no=item.card_no;
    },
    makePayment: function(){
        
        if(!this.item.name.length>0 || !this.item.card_no.length>0 || !this.item.total>0 || this.item.remark==''){
            this.message = "Kindly register payee details and attach to this payment";
            this.error_dialog = true;
            this.customer_dialog = true;
        } else {
            this.paynow_dialog = true;
            this.isPaid = false;
        }
    },
    paynowHandler: function(index){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        this.carts.date= yyyy + "-" + mm + "-" + dd;

        this.carts.code=Math.floor(Math.random() * 1000000000 + 1);
        this.carts.customer.name=this.item.name;
        this.carts.customer.file=this.item.card_no;

        this.carts.subtotal=this.item.total;

        this.carts.items=[];
        this.item.name=this.item.remark;
        this.carts.items.push(this.item);

        this.carts.payment = index;
        let user=LS.get('user');
        this.carts.user=user;
        this.carts.paid=true;

        LS.set("cart", this.carts);
        let postData = {
            outlet: this.outlet,
            carts: this.carts
        };
        var inserted=false;
        //console.log(JSON.stringify(postData))
        axios.post(this.domain + "/postBilling", postData)
        .then(response => {
            if(response.data.status>0){
                this.carts.sync=true;
                inserted=true;
            }
        })
        .catch(e => {
            console.log(e)
        });
        this.paynow_dialog = false;
        this.isPaid = true;
        this.addBilling(this.carts);
        //this.emptyCart();
    },
    emptyCart: function(){
        this.items={
            code:'',
            name:'',
            card_no:'',
            amount:0.0,
            remark:'',
            date:'',
            sync:false,
            user:[]
        }
    },
    closeReceipt: function(status) {
      LS.remove("cart");
      this.isPaid = status;
      this.emptyCart();
    }
  },
  mounted() {
    this.checkStorage();
    this.padBills();
    this.getList();
    this.loadMethod();
    this.list=this.bills;
    //console.log(LS.get('user'))
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
