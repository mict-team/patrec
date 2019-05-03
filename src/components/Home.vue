<template>
  <v-app id="inspire">
    <v-layout>
      <v-layout row wrap v-if="!isPaid">
        <v-flex xs8>
          <v-toolbar row>
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
          </v-toolbar>
          <v-layout row wrap style="text-align:center">
            <v-flex xs12>
              <v-btn flat v-for="(head, index) in tab" :key="index" @click="pushRightItem(head)">{{head}}</v-btn>
            </v-flex>
          </v-layout>
          <div class="portlet light">
            <div class="portlet-body">
              <div class="panel light" style="height:580px">
                <div class="cart-panel list-group scroller" style="height:590px !important;" :visible="1">
                  <v-layout row wrap>
                    <v-flex
                      v-for="(product, index) in productsFilter" 
                      :key="index"
                      @click="addProduct(product)"
                      :class="{ disable: !isSalesOpen }"
                      
                      >
                      <v-card class="thumbnail" style="">
                        <v-flex xs12 align-end flexbox>
                          <div class="titles">
                            {{product.name}}<br>{{product.revType}}({{product.amount | toDecimal}})
                          </div>
                        </v-flex>
                        <div class="highlight" :class="product.color"></div>
                      </v-card>
                      
                    </v-flex>
                  </v-layout>
                </div>
              </div>
            </div>
          </div>
        </v-flex>
        <v-flex xs4>
          <v-card>
            <span right v-if="!carts.billed">
              <v-btn class="blue" flat @click="addBill(carts.id)" :disabled='!carts.items.length>0'>Attach billing</v-btn>
            </span>
            <span right v-if="carts.billed">
              <v-btn class="red" flat @click="removeBill(carts.id)">Remove billing</v-btn>
            </span>
            <span right v-if="!carts.customer.name" style="display:none;">
              <v-btn class="blue" flat @click="addCustomer(carts.id)">Add Customer</v-btn>
            </span>
            <v-toolbar>
              <v-toolbar-title>CHECKOUT</v-toolbar-title>

              <v-spacer></v-spacer>
              
              <span right v-if="carts.customer.name">
                <v-btn flat @click="addCustomer(carts.id)">{{
                  carts.customer.name
                }}</v-btn>
              </span>
              
            </v-toolbar>
          </v-card>
          <div class="portlet light">
            <div class="portlet-body">
              <div class="panel light">
                <div class="cart-panel list-group scroller" :visible="1">
                  <carts
                    v-for="(item, index) in cartItem"
                    :key="item.id"
                    :cartIndex="index"
                    :cart="item"
                    v-on:updateCartQty="updateQty"
                    v-on:deleteCartItem="deleteItem"
                    v-on:updateCartDiscount="updateDiscount"
                  ></carts>
                </div>
                <div class="panel-footer">
                  <table
                    class="table table-hover"
                    cellpadding="5px"
                    cellspacing="5px"
                  >
                    <tbody>
                      <tr>
                        <td colspan="2">
                          <input
                            type="text"
                            class="form-control"
                            name="remarks"
                            v-model="carts.remark"
                            placeholder="Add your remark"
                          />
                        </td>
                      </tr>

                      <tr>
                        <td style="width:90%;"><span>Sub-Total</span></td>
                        <td style="text-align:right">
                          &#8358;{{ carts.subtotal | toDecimal }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <v-flex xs12 row>
                            <v-flex xs3>Type</v-flex>
                            <v-flex xs5>
                              <select name="type" v-model="carts.type" class="form-control" @change="changeType">
                                <option v-for="option in types" :key="option.name" v-bind:value="option.name" :selected="option.selected">{{ option.name }}</option>
                              </select>
                            </v-flex>
                            <v-flex xs4 class="align-right">
                              <input
                              type="text"
                              class="form-control"
                              name="percentage"
                              v-model="carts.percentage"
                              placeholder="100%"
                              @input="updateTotPercentage"
                              :disabled='!disable_option'
                            />
                            </v-flex>
                          </v-flex>
                        </td>
                      </tr>
                      <tr>
                        <td style="width:90%;">
                          <v-flex xs12 row>
                            <v-flex xs3>Discount</v-flex>
                            <v-flex xs7>
                              <input
                              type="text"
                              class="form-control"
                              name="discount"
                              v-model="carts.overallDiscount"
                              placeholder="Discount"
                              @input="updateTotDiscount"
                              :disabled='!waver_lock && outlet.waver_lock==1'
                            />
                            </v-flex>
                            <v-flex xs2 v-if="!waver_lock && outlet.waver_lock==1"><v-icon @click="openWaver" color="red">lock</v-icon></v-flex>
                            <v-flex xs2 v-if="waver_lock"><v-icon @click="openWaver" color="blue">lock_open</v-icon></v-flex>
                          </v-flex>
                          
                        </td>
                        <td style="text-align:right">
                          &#8358;{{ carts.discount | toDecimal }}
                        </td>
                      </tr>
                      <tr>
                        <td style="width:90%;"><span>VAT</span></td>
                        <td style="text-align:right">
                          &#8358;{{ carts.vat | toDecimal }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="row" v-if="!isPaid">
                <!-- /btn-group -->
                <div
                  class="col-md-9 btn-group pull-left"
                  data-disabled-element="!carts.code"
                  >
                  <button
                    type="button"
                    class="btn blue btn-lg col-md-12 pay-button"
                    @click="makePayment"
                    :disabled='!isCartNotEmpty'
                    style="font-size:18px;"
                  >
                    <span class="col-md-3" style="text-align:left !important;">Paynow&nbsp;</span
                    ><span class="col-md-9 amount" style="text-align:right !important;">&#8358; {{ carts.total | toDecimal }}
                    </span>
                  </button>
                </div>
                <div class="col-md-3 btn-group ">
                  <button type="button" class="btn red btn-lg col-md-12 pay-button" @click="emptyCart">Empty </button>
                </div>
              </div>
              <div class="row" v-if="isPaid">
                <div
                  class="col-md-10 btn-group pull-left"
                  :disabled="!carts.code"
                  id="print-receipt"
                >
                  <button
                    type="button"
                    class="btn blue col-md-12"
                    @click="prints()"
                    style="width:80%; height:50px; font-weight:bold; text-align:left;"
                  >
                    Print Receipt&nbsp;<span class="icon-print"></span>
                  </button>
                </div>
                <div class="col-md-2" data-disabled-element="!carts.code">
                  <button
                    type="button"
                    class="btn red pull-right"
                    @click="clear()"
                    style="height:50px;"
                  >
                    Clear Cart <span class="icon-cancel"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-else>
        <receipt style="width:100%;" v-on:closePrinter="closeReceipt"></receipt>
      </v-layout>
    </v-layout>
    <v-dialog v-model="customer_dialog" width="600px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Add new customer
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs8>
              <v-layout align-center>
                <v-text-field
                  prepend-icon="person"
                  placeholder="Name"
                  v-model="carts.customer.name"
                ></v-text-field>
              </v-layout>
            </v-flex>
            <v-flex xs4>
              <v-layout align-center>
                <v-text-field
                  prepend-icon="book"
                  placeholder="File no"
                  v-model="carts.customer.file"
                ></v-text-field>
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
                  v-model="carts.customer.sex"
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
                  v-model="carts.customer.mstatus"
                ></v-select>
              </v-layout>
            </v-flex>
            <v-flex xs6 align-center justify-space-between>
              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="date"
                persistent
                lazy
                full-width
                width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="date"
                    label="DOB"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="carts.customer.dob" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="modal = false"
                    >Cancel</v-btn
                  >
                  <v-btn flat color="primary" @click="$refs.dialog.save(date)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-dialog>
            </v-flex>

            <v-flex xs6 align-center justify-space-between>
              <v-layout align-center>
                <v-text-field
                  prepend-icon="telephone"
                  placeholder="Phone"
                  v-model="carts.customer.phone"
                ></v-text-field>
              </v-layout>
            </v-flex>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-text-field
                  prepend-icon="email"
                  placeholder="Email"
                  v-model="carts.customer.email"
                ></v-text-field>
              </v-layout>
            </v-flex>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-text-field
                  prepend-icon="location_on"
                  placeholder="Address"
                  v-model="carts.customer.address"
                ></v-text-field>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="customer_dialog = false"
            >Cancel</v-btn
          >
          <v-btn flat @click="saveCusttomer">Save</v-btn>
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
    <v-dialog v-model="billing_dialog" width="1060px">
      <v-card align-center>
        <v-card-title class="grey lighten-4 py-4 title">
          Select patient bill
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap style="text-align:center">
            <v-card xs12>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-data-table
                    :headers="bHeaders"
                    :items="billings"
                    item-key="name"
                    class="elevation-1"
                    >
                    <template v-slot:items="props">
                        <tr>
                            <td>{{ props.index + 1 }}</td>
                            <td>{{ props.item.code }}</td>
                            <td>{{ props.item.name }}</td>
                            <td>{{ props.item.file }}</td>
                            <td>{{ props.item.dateOfAdmission }}</td>
                            <td>{{ props.item.total | toDecimal }}</td>
                            <td>{{ props.item.date }}</td>
                            <td>{{ props.item.collector }}</td>
                            <td>
                                <v-btn @click="attachCustomerBill(props.item)">attach bills</v-btn>
                            </td>
                        </tr>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-card>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="billing_dialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="billing_pay_dialog" width="510px">
      <v-card align-center>
        <v-card-title class="grey lighten-4 py-4 title">
          Are you clearing the patient bills or its still part payment?
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-flex xs12>
            <div class="divcheck">
		          <label>
                  <input type="radio" @click="payBillNow(0)" checked/>
                  <div class=" box">
                    <h3>Final payment</h3>
                    <hr>
                    <span>This will clear the bill.</span>
                  </div>
              </label>
              
              <label>
                  <input type="radio"  @click="payBillNow(1)" checked/>
                  <div class=" box">
                    <h3>Part payment</h3>
                    <hr>
                    <span>The bill will still be opened.</span>
                  </div>
              </label>
            </div>
            
          </v-flex>
          <v-flex xs12 v-if="this.carts.part">
            <input type="text" class="form-control" v-model="billAmount" />
          </v-flex>
          
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="red" @click="billing_pay_dialog = false"
            >Close</v-btn
          >
          <v-btn flat color="primary" @click="continueWithBilling"
              >Continue</v-btn
            >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    <v-dialog v-model="waver_dialog" width="400px">
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
          <v-btn flat color="primary" @click="unlockWaver"
            >Unlock</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { URL, LS, IDGenerator } from "../shared/config.js";
import Carts from "./Cart";
import axios from "axios";
import Receipt from "./Receipt";
import { mapState, mapActions } from "vuex";
const ipcRenderer = window.require("electron").ipcRenderer;
export default {
  data() {
    return {
      tabs: null,
      customer_dialog: false,
      productSearchInput: "",
      productsFilter: [],
      isPaid: false,
      isSalesOpen: true,
      paynow_dialog: false,
      error_dialog: false,
      service_dialog: false,
      waver_dialog:false,
      disable_option:false,
      message: "",
      waver_lock: false,
      paymentmethod: [],
      date: new Date().toISOString().substr(0, 10),
      modal: false,
      tab:[],
      bill:[],
      billing_dialog:false,
      billing_pay_dialog:false,
      billAmount:0.0,
      billingAccount:[],
      waver: {'username':'', 'password':''},
      types: [{'selected':'selected','name':'Normal'}, 
              {'selected':'','name':'NHIS'},
              {'selected':'','name':'DAMA'}
            ],
      bHeaders: [
        { text: "SN", align: "left", sortable: false, value: "index" },
        { text: "Code", align: "left", sortable: false, value: "code" },
        { text: "Name", align: "left", sortable: true, value: "name" },
        { text: "Card no", align: "left", sortable: true, value: "card" },
        { text: "Admission Date", align: "left", sortable: true, value: "dateOfAdmission" },
        { text: "Amount", value: "amount", sortable: false, align: "left" },
        { text: "Date", value: "date", sortable: false, align: "left" },
        { text: "Collector", value: "collector", sortable: false, align: "left" },
        { text: "", value: "action", sortable: false, align: "left" },
      ],
      carts: {
        code: "",
        subtotal: 0.0,
        type:'Normal',
        percentage:100,
        overallDiscount: 0.0,
        discount: 0.0,
        vat: 0.0,
        total: 0.0,
        remark: "",
        paid: false,
        sync: false,
        date: "",
        billed:false,
        part:true,
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
    ...mapState([
      "outlet",
      "domain",
      "billings",
      "products",
      "today", 
      "transCode",
      "paymentMethods",
      "unsyncCart",
      "cart",
      "users"
    ]),
    cartItem: function(){
      return this.carts.items;
    },
    isCartNotEmpty: function(){
      return (this.carts.items.length>0)?true:false;
    },
    
  },
  components: {
    Carts,
    Receipt
  },
  props: {
    source: String
  },
  methods: {
    ...mapActions([
      "addProduct",
      "addBilling",
      "getDomain",
      "addCart",
      "padBills",
      "deleteCart",
      "getCode", 
      "getToday", 
      "addpaymentMethods",
      "checkStorage",
      "deleteBilling",
      "saveStorage"
    ]),
    colorAsign: function(){
      var colors=['bg-color-gold', 'bg-color-green', 'bg-color-red', 'bg-color-blue', 'bg-color-orange', 'bg-color-pink', 'bg-color-purple', 'bg-color-lime', 'bg-color-magenta', 'bg-color-teal', 'bg-color-turquoise', 'bg-color-amethyst', 'bg-color-wet-asphalt', 'bg-color-midnight-blue', 'bg-color-sun-flower', 'bg-color-pomegranate', 'bg-color-silver', 'bg-color-asbestos'];
      var pos = Math.floor(Math.random() * colors.length);
      return colors[pos];
    },
    loadProduct: function() {
      //console.log(this.products)
      for (var key in this.products){
        this.tab.push(key);
      }
      this.pushRightItem(this.tab[0])
    },
    loadMethod: function() {
      this.paymentmethod = this.paymentMethods;
    },
    loadBillingAccount: function(){
      this.billingAccount= this.billingAccount || [];
      var postData={
          outlet: this.outlet
      };
      //console.log(JSON.stringify(postData));
      axios.post(this.domain + "/getBilling", postData)
      .then(response => {
          if(response.data.status>0){
              if(response.data.response !=null){
                this.addBilling(response.data.response);
              }
          }
      })
      .catch(e => {
          //
      });
      //console.log(this.billings)
    },
    pushRightItem: function(index){
      this.productsFilter = this.products[index];
      if(this.productsFilter){
        var colored=[];
        for(var item of this.productsFilter){
          item['color']=this.colorAsign();
          colored.push(item);
        }
        this.productsFilter=colored;
      }
      this.productSearchInput='';
    },
    searchProduct() {
      var list=[];
      for (var key in this.products){
        if(this.products[key]){
          list.push(this.products[key]);
        }
      }
      
      list=[].concat.apply([], list);
      if(list){
        var colored=[];
        for(var item of list){
          item['color']=this.colorAsign();
          colored.push(item);
        }
        list=colored;
      }
      this.productsFilter=list.filter(item => {
        return (item.name.toLowerCase().includes(this.productSearchInput.toLowerCase()) || item.tag.toLowerCase().includes(this.productSearchInput.toLowerCase()))
      })
    },
    addProduct(index) {
      //console.log(this.outlet)
      if (this.carts.items.length > 0) {
        let outletIndex = this.carts.items.findIndex(
          x => x.id == index["id"]
        );
        if (outletIndex > -1) {
          
          this.carts.items[outletIndex]["qty_sold"] += 1;
          this.carts.items[outletIndex]["total"] = this.carts.items[outletIndex]["amount"] * this.carts.items[outletIndex]["qty_sold"];
          //console.log(this.carts.items[outletIndex])
        } else {
          index["qty_sold"] = 1;
          index["total"] = index["amount"] * index["qty_sold"];
          index["discount"] = 0.0;
          this.carts.items.push(index);
        }
      } else {
        //this.carts["code"] = Math.floor(Math.random() * 1000000000 + 1);
        index["qty_sold"] = 1;
        index["total"] = index["amount"] * index["qty_sold"];
        index["discount"] = 0.0;
        this.carts.items.push(index);
      }
      //console.log(this.carts.items)
      this.changeType();
    },
    
    makePayment: function() {
      var user=LS.get('user');
      this.carts.user={...user};
      //console.log(this.carts.items)
      if(this.carts.total==undefined || this.carts.total=='NaN'){
        alert("Please select transaction type")
        return false;
      }
      if(!this.carts.customer.file){
        this.getCode();
        this.carts.customer.file=this.transCode;
      }
      if (!this.carts.customer.name || !this.carts.customer.file) {
        this.message = "Kindly register payee details and attach to this payment";
        this.error_dialog = true;
        this.customer_dialog = true;
      } else {
        this.paynow_dialog = true;
        this.isPaid = false;
      } 
    },
    openWaver: function(){
      if(this.waver_lock){
        this.waver_lock=false;
        this.waver_dialog=false;
      }else{
        this.waver_lock=false;
        this.waver_dialog=true;
      }
    },
    unlockWaver: function(){
      if(this.waver.username.length>0 && this.waver.password.length>0){
        this.waver_lock=true;
        this.waver_dialog=false;
        if(this.waver.username==this.outlet.waver_username && this.waver.password==this.outlet.waver_password){
          this.waver_lock=true;
          this.waver_dialog=false;
          this.waver= {'username':'', 'password':''};
        }
      }
      
    },
    paynowHandler: function(index) {
      this.getCode();
      this.getToday();
      this.carts.code=this.outlet.paypoint.toString() + IDGenerator();
      //console.log(this.carts.code);
      this.carts.payment = index;
      this.carts.date = this.today;
      this.carts.system= LS.get('system')
      let success=false;
      
      LS.set("cart", this.carts);
      //if (this.isOnline) {
      let postData = {
        outlet: this.outlet,
        carts: this.carts
      };
      //console.log(JSON.stringify(postData))
      axios.post(this.domain + "/postBookingCart", postData)
      .then(response => {
        //console.log(response.data)
        if(response.data.status >0 ){
          this.carts.sync=true;
          success=true;
        }
        if(success==false){
          //this.addCart(this.carts);
        }
        this.addCart(this.carts);
        //}
        if(this.carts.billed){
          this.deleteBilling(this.carts.bill)
        }
      })
      .catch(e => {
        //alert('error')
        console.log(e)
        
      });
      
      this.paynow_dialog = false;
      this.isPaid = true;
      
      //ipcRenderer.send("print", content);
      //this.$router.push('/receipt');
      //ipcRenderer.send("print-to-pdf");
    },
    payBillNow: function(value){
      //alert(value)
      if(value==0){
        this.carts.part=false;
      }else{
        this.carts.part=true;
      }
    },
    continueWithBilling: function(){
      this.carts.customer.id=this.bill.id;
      this.carts.customer.file=this.bill.file.toString();
      this.carts.customer.name=this.bill.name;
      this.carts.overallDiscount=this.bill.total;
      
      if(this.carts.part){
        this.carts.total=this.billAmount;
        this.carts.remark=`Payment of #${this.$options.filters.toDecimal(this.billAmount)} being part payment of #${this.$options.filters.toDecimal(this.carts.subtotal)} for billing`
        //console.log(this.carts.items)
        // if(this.carts.items.length>0){
        //   for(var i=0; i<this.carts.items.length; i++){
        //     var total=((parseFloat(this.billAmount) / parseFloat(this.carts.subtotal)) * parseFloat(this.carts.items[i].total));
        //     this.carts.items[i].total=total
        //   }
        // }
      }else{
        this.carts.remark=`Balance of # ${this.$options.filters.toDecimal(this.bill.total)} being payments from billing`;
        
      }
      this.calculateSummary();
      this.carts.billed=true;
      this.billing_pay_dialog=false;
    },
    addCustomer: function() {
      this.customer_dialog = true;
    },
    addBill: function(){
      this.billing_dialog=true;
    },
    removeBill: function(){
      this.carts.customer.file='';
      this.carts.customer.name='';
      this.carts.billed=false;
      this.carts.discount='';
    },
    attachCustomerBill: function(bill){
      this.bill=bill;
      this.billing_dialog=false;
      this.billing_pay_dialog=true;
    },
    saveCusttomer: function() {
      if (this.carts.customer.name && this.carts.customer.file) {
        this.customer_dialog = false;
        if (this.carts.items) {
          this.paynow_dialog = true;
          this.isPaid = false;
        }
      }
      
    },
    editDiscountModalModal: function() {},
    deleteItem(value) {
      this.carts.items.splice(value.index, 1);
      this.calculateSummary();
    },
    updateQty(value) {
      //let index = event.index;
      this.carts.items[value.index]["total"] = this.carts.items[value.index]["amount"] * this.carts.items[value.index]["qty_sold"];
      this.calculateSummary();
    },
    updateTotDiscount(){
      this.carts.remark=`Discount of # ${this.$options.filters.toDecimal(this.carts.overallDiscount)} for waver.`;
      this.calculateSummary();
    },
    changeType(){
      this.carts.overallDiscount=0;
      if(this.carts.type=='Normal'){
        this.disable_option=false;
        this.carts.percentage=100;
      }else if(this.carts.type=='NHIS'){
        this.disable_option=true;
        this.carts.percentage=10;
      }else if(this.carts.type=='DAMA'){
        this.disable_option=true;
        this.carts.percentage=10;
      }
      
      this.carts.remark=`Payment of ${this.carts.percentage}% for ${this.carts.type} account.`
      this.calculateSummary();
    },
    updateTotPercentage(){
      this.carts.remark=`Payment of # ${this.carts.percentage}% for ${this.carts.type} account.`
      this.calculateSummary();
    },
    updateDiscount(value) {
      //let index = event.index;
      this.carts.items[value.index]["total"] = this.carts.items[value.index]["total"] - this.carts.items[value.index]["discount"];
      this.calculateSummary();
    },
    parkSales() {
      var items = LS.get("packedsales");
      if (!items) {
        LS.set("packedsales", this.carts);
      } else {
        items.push(this.carts);
        LS.set("packedsales", this.carts);
      }
      this.emptyCart();
    },
    emptyCart() {
      this.carts={
        code: "",
        subtotal: 0.0,
        type:'Normal',
        percentage:100,
        overallDiscount: 0.0,
        discount: 0.0,
        vat: 0.0,
        total: 0.0,
        remark: "",
        paid: false,
        sync: false,
        date: "",
        billed:false,
        part:true,
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
    },
    calculateSummary() {
      //console.log(this.carts.items)
      let qty = 0,
        discount = 0,
        subtotal = 0;
        
      if(this.carts.overallDiscount==''){
        this.carts.overallDiscount=0;
      }
      
      for (let i = 0; i < this.carts.items.length; i++) {
        qty += parseInt(this.carts.items[i].qty_sold);
        
        subtotal += parseFloat(this.carts.items[i].total);
        discount += parseFloat(this.carts.items[i].discount);
      }

      this.carts.subtotal = subtotal;
      
      this.carts.overallDiscount=parseFloat(this.carts.subtotal) - ((parseInt(this.carts.percentage)/100) * parseFloat(this.carts.subtotal)) + parseFloat(this.carts.overallDiscount);
      this.carts.discount = parseFloat(this.carts.overallDiscount) + parseFloat(discount);
      this.carts.qty = qty;
      this.carts.total = (parseFloat(subtotal) - parseFloat(this.carts.overallDiscount)) + parseFloat(this.carts.vat);
      //console.log("discount: %s subtotal:%s",this.carts.total,subtotal )
      //this.carts.total=parseFloat((parseInt(this.carts.percentage)/100) * this.carts.total);
      LS.set("currentCart", this.carts);
      
    },
    
    closeReceipt: function(status) {
      //alert(status)
      LS.remove("cart");
      this.isPaid = status;
      this.emptyCart();
    }
  },
  mounted() {
    this.checkStorage();
    this.getDomain();
    this.loadProduct();
    this.loadMethod();
    this.loadBillingAccount();
    //this.padBills();
    let items = LS.get("cart");
    if (items) {
      this.paynow_dialog = false;
      this.isPaid = true;
    }
    
    console.log(this.billings);
  }
};
</script>

<style>
  /*background-color:#7CB9E8;*/
  .inner-container {
    width: 100%;
  }
  .fab-container {
    position: fixed;
    bottom: 0;
    right: 0;
  }
  .collapse {
    transition: all 0.1s ease-out;
  }
  .list-group-item {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .pay-button {
    width: 100%;
    height: 70px;
    font-weight: bold;
    text-align: left;
    font-size: 5em;
  }
  .pay-button .amount {
    text-align: right;
  }
  .triangle-border {
    position: relative;
    border: 5px solid #f3f5f9;
    color: #333;
    background: #fff;
    /* css3 */
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
  }
  .triangle-border:before {
    content: "";
    position: absolute;
    bottom: -20px; /* value = - border-top-width - border-bottom-width */
    left: 40px; /* controls horizontal position */
    border-width: 10px 10px 0;
    border-style: solid;
    border-color: #f3f5f9 transparent;
    /* reduce the damage in FF3.0 */
    display: block;
    width: 0;
  }

  /* creates the smaller  triangle */
  .triangle-border:after {
    content: "";
    position: absolute;
    bottom: -13px; /* value = - border-top-width - border-bottom-width */
    left: 47px; /* value = (:before left) + (:before border-left) - (:after border-left) */
    border-width: 13px 13px 0;
    border-style: solid;
    border-color: #fff transparent;
    /* reduce the damage in FF3.0 */
    display: block;
    width: 0;
  }
  /* creates the larger triangle */
  .triangle-border.right:before {
    top: auto; /* controls vertical position */
    bottom: 10px;
    left: auto;
    right: -30px; /* value = - border-left-width - border-right-width */
    border-width: 15px 0 15px 30px;
    border-color: transparent #f3f5f9;
  }

  /* creates the smaller  triangle */
  .triangle-border.right:after {
    top: auto; /* value = (:before top) + (:before border-top) - (:after border-top) */
    bottom: 16px;
    left: auto;
    right: -21px; /* value = - border-left-width - border-right-width */
    border-width: 9px 0 9px 21px;
    border-color: transparent #fff;
  }
  /* Portlet */
  .portlet {
    background: #fff;
    padding: 20px;
  }

  .portlet.portlet-gray {
    background: #f7f7f7;
  }

  .portlet.portlet-bordered {
    border: 1px solid #eee;
  }

  /* Portlet Title */
  .portlet-title {
    padding: 0;
    min-height: 40px;
    border-bottom: 1px solid #eee;
    margin-bottom: 18px;
  }

  .caption {
    float: left;
    display: inline-block;
    font-size: 18px;
    line-height: 18px;
  }

  .caption.caption-green .caption-subject,
  .caption.caption-green i {
    color: #4db3a2;
    font-weight: 200;
  }

  .caption.caption-red .caption-subject,
  .caption.caption-red i {
    color: #e26a6a;
    font-weight: 200;
  }

  .caption.caption-purple .caption-subject,
  .caption.caption-purple i {
    color: #8775a7;
    font-weight: 400;
  }

  .caption i {
    color: #777;
    font-size: 15px;
    font-weight: 300;
    margin-top: 3px;
  }

  .caption-subject {
    color: #666;
    font-size: 16px;
    font-weight: 600;
  }

  .caption-helper {
    padding: 0;
    margin: 0;
    line-height: 13px;
    color: #9eacb4;
    font-size: 13px;
    font-weight: 400;
  }

  /* Actions */
  .actions {
    float: right;
    display: inline-block;
  }

  .actions a {
    margin-left: 3px;
  }

  .actions .btn {
    color: #666;
    padding: 3px 9px;
    font-size: 13px;
    line-height: 1.5;
    background-color: #fff;
    border-color: #ccc;
    border-radius: 50px;
  }

  .actions .btn i {
    font-size: 12px;
  }

  .actions .btn:hover {
    background: #f2f2f2;
  }
  .thumbnail {
    min-width: 100px;
    min-height: 100px;
    text-align: center;
    color: white;
    padding-top: 2em;
    cursor: pointer;
  }
  .cart-panel {
    height: 270px !important;
  }
  .scroller {
    overflow-y: scroll;
  }
  .floatedContent {
    position: absolute;
    left: 30%;
    top: 20px;
  }


  .divcheck {
    width: 100%;
    text-align: center;
    /* Made by */
  }

  .divcheck h1 {
    font-family: 'Dax', sans-serif;
    color: #fff;
  }
  .divcheck input[type="radio"] {
    display: none;
  }
  .divcheck input[type="radio"]:checked + .box {
    border: 1px solid red;
  }
  .divcheck input[type="radio"]:checked + .box span {
    transform: translateY(0px);
  }
  .divcheck input[type="radio"]:checked + .box span:before {
    transform: translateY(0px);
    opacity: 1;
  }
  .divcheck .box {
    width: 200px;
    height: 100px;
    background-color: #fff;
    transition: all 250ms ease;
    will-change: transition;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    position: relative;
    font-family: 'Dax', sans-serif;
    font-weight: normal;
    padding: 3px;
    border: 1px solid #eee !important;
  }
  .divcheck .box.small {
    width: 50px;
    height: 50px;
  }
  .divcheck .box:active {
    transform: translateY(10px);
    border: 1px solid blue;
  }

  .divcheck .box.small h3 {
    margin-top: 6px;
  }
  .divcheck .box span {
    position: absolute;
    transform: translate(0, 0px);
    left: 0;
    right: 0;
    transition: all 300ms ease;
    font-size: 0.9em;
    user-select: none;
    color: #000;
  }
  .divcheck .box span:before {
    font-size: 1.2em;
    font-family: FontAwesome;
    display: block;
    transform: translateY(-80px);
    opacity: 0;
    transition: all 300ms ease-in-out;
    font-weight: normal;
    color: white;
  }

  .divcheck p {
    color: #fff;
    font-family: 'Dax', sans-serif;
    font-weight: 400;
  }
  .divcheck p span:after {
    content: '\f0e7';
    font-family: FontAwesome;
    color: yellow;
  }
</style>
