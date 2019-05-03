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
              <div class="panel light" style="height:540px">
                <div class="cart-panel list-group scroller" style="height:540px !important;" :visible="1">
                  <v-layout row wrap>
                    
                  </v-layout>
                </div>
              </div>
            </div>
          </div>
        </v-flex>
        <v-flex xs4>
          <v-card>
            <span right v-if="!carts.billed">
              <v-btn class="blue" flat @click="addBill(carts.id)">Attach billing</v-btn>
            </span>
            <span right v-if="carts.billed">
              <v-btn class="red" flat @click="removeBill(carts.id)">Remove billing</v-btn>
            </span>
            <span right v-if="!carts.customer.name">
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
              <div class="panel light panel-accent-blue">
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
                        <td style="width:90%;">
                          <v-flex xs12 row>
                            <v-flex xs3>Discount</v-flex>
                            <v-flex xs9>
                              <input
                              type="text"
                              class="form-control"
                              name="discount"
                              v-model="carts.overallDiscount"
                              placeholder="Discount"
                              @input="updateTotDiscount"
                            />
                            </v-flex>
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
                <div class="col-md-3 btn-group pull-right">
                  <button
                    type="button"
                    class="btn red btn-lg col-md-12 pay-button"
                    @click="emptyCart"
                    :disabled='!isCartNotEmpty'
                  >
                    <v-icon>delete_sweep</v-icon>
                  </button>
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
    <v-dialog v-model="billing_dialog" width="860px">
      <v-card align-center>
        <v-card-title class="grey lighten-4 py-4 title">
          Select patient bill
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap style="text-align:center">
            <v-card>
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
                            <td>{{ props.item.total | toDecimal }}</td>
                            <td>{{ props.item.date }}</td>
                            <td>{{ props.item.user.name }}</td>
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
  </v-app>
</template>

<script>
import { URL, LS } from "../shared/config.js";
import Carts from "./Cart";
import axios from "axios";
import Receipt from "./Receipt";
import { mapState, mapActions } from "vuex";

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
      billing_dialog:false,
      message: "",
      paymentmethod: [],
      date: new Date().toISOString().substr(0, 10),
      modal: false,
      tab:[],
      bHeaders: [
        { text: "SN", align: "left", sortable: false, value: "index" },
        { text: "Code", align: "left", sortable: false, value: "code" },
        { text: "Name", align: "left", sortable: true, value: "name" },
        { text: "Card no", align: "left", sortable: true, value: "card" },
        { text: "Amount", value: "amount", sortable: false, align: "left" },
        { text: "Date", value: "date", sortable: false, align: "left" },
        { text: "Collector", value: "collector", sortable: false, align: "left" },
        { text: "", value: "action", sortable: false, align: "left" },
      ],
      carts: {
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
    }
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
    pushRightItem: function(index){
      //alert(index)
      this.productsFilter = this.products[index];
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
      this.productsFilter=list.filter(item => {
        return item.name.toLowerCase().includes(this.productSearchInput.toLowerCase())
      })
    },
    addProduct(index) {
      if (this.carts.items.length > 0) {
        let outletIndex = this.carts.items.findIndex(
          x => x.revenue == index["revenue"]
        );
        if (outletIndex > -1) {
          
          this.carts.items[outletIndex]["qty"] += 1;
          this.carts.items[outletIndex]["total"] = this.carts.items[outletIndex]["amount"] * this.carts.items[outletIndex]["qty"];
          //console.log(this.carts.items[outletIndex])
        } else {
          index["qty"] = 1;
          index["total"] = index["amount"] * index["qty"];
          index["discount"] = 0.0;
          this.carts.items.push(index);
        }
      } else {
        //this.carts["code"] = Math.floor(Math.random() * 1000000000 + 1);
        index["qty"] = 1;
        index["total"] = index["amount"] * index["qty"];
        index["discount"] = 0.0;
        this.carts.items.push(index);
      }
      //console.log(this.carts.items)
      this.calculateSummary();
    },
    SaveItems() {
      let formData = new FormData();
      formData.append("carts", JSON.stringify(this.carts));
    },

    makePayment: function() {
      var user=LS.get('user');
      this.carts.user=user;
      //console.log(this.carts.items)
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
    paynowHandler: function(index) {
      this.getCode();
      this.getToday();
      this.carts.code=this.transCode;
      this.carts.payment = index;
      this.carts.date = this.today;
      
      LS.set("cart", this.carts);
      //if (this.isOnline) {
        let postData = {
          outlet: this.outlet,
          carts: this.carts
        };
        //console.log(JSON.stringify(postData))
        axios.post(this.domain + "/postBookingCart", postData)
        .then(response => {
          console.log(response.data)
          if(response.data.status>0){
            this.carts.sync=true;
          }
        })
        .catch(e => {
          //alert('error')
          console.log(e)
          
        });
      //}
      if(this.carts.billed){
        this.deleteBilling(this.carts.bill)
      }
      this.paynow_dialog = false;
      this.isPaid = true;
      this.addCart(this.carts);
      
      //ipcRenderer.send("print", content);
      //this.$router.push('/receipt');
      
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
      this.carts.customer.file=bill.file;
      this.carts.customer.name=bill.name;
      this.carts.remark=`Discount of # ${this.$options.filters.toDecimal(bill.total)} being part payments from billing`
      this.carts.billed=true;
      this.carts.overallDiscount=bill.total;
      this.billing_dialog=false;
      this.calculateSummary();
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
      this.carts.items[value.index]["total"] = this.carts.items[value.index]["amount"] * this.carts.items[value.index]["qty"];
      this.calculateSummary();
    },
    updateTotDiscount(){
      this.calculateSummary();
      //this.carts.total=this.
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
      this.carts = {
        id: 0,
        code: "",
        subtotal: 0.0,
        overallDiscount: 0.0,
        discount: 0.0,
        vat: 0.0,
        total: 0.0,
        remark: "",
        customer: {
          id: 0,
          name: "",
          email: "",
          phone: "",
          type: 0
        },
        items: []
      };
    },
    calculateSummary() {
      //console.log(this.carts.items)
      let qty = 0,
        discount = 0,
        subtotal = 0;
      for (let i = 0; i < this.carts.items.length; i++) {
        qty += parseInt(this.carts.items[i].qty);
        subtotal += parseFloat(this.carts.items[i].total);
        discount += parseFloat(this.carts.items[i].discount);
      }
      //console.log(discount)
      this.carts.subtotal = subtotal;
      this.carts.discount = this.carts.overallDiscount + discount;
      this.carts.qty = qty;
      this.carts.total = subtotal - this.carts.overallDiscount;
      //console.log(this.carts)
      LS.remove("currentCart");
      LS.set("currentCart", JSON.stringify(this.carts));
      this.SaveItems();
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
    //this.padBills();
    this.getDomain();
    this.loadProduct();
    this.loadMethod();
    let items = LS.get("cart");
    if (items) {
      this.paynow_dialog = false;
      this.isPaid = true;
    }
    
    //console.log(this.unsyncCart);
  }
};
</script>

<style>

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
  paddig-top: 10px;
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
.triangle-border.right {
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
</style>
