<template>
  <div>
    <v-row>
      <v-col cols="12" md="8">
        <v-toolbar row wrap>
          <v-flex xs8>
            <v-text-field
              append-icon="search"
              class="py-6"
              label="Search"
              solo
              @input="searchProduct"
              v-model="productSearchInput"
              style="margin-top:31px !important;"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <label>&nbsp;</label>
            <v-select
              :items="tab"
              label="Outlined style"
              solo
              v-model="head"
              @change="pushCategory"
            ></v-select>

            
          </v-flex>
        </v-toolbar>
        <div class="portlet light">
          <div class="portlet-body">
            <div class="panel light scroller" style="height:935px !important;">
                <v-row style="height:auto !important; padding: 10px 10px;">
                  <v-col md="3" v-for="(product, index) in productsFilter" :key="index" @click="addProductToCart(product)" style="height: 134px;">
                    <v-card class="thumbnail" style="margin-top:-10px;">
                      <v-flex xs12 align-end flexbox>
                        <div class="titles">
                          {{ product.name | truncate(40) }}<br />{{ product.dept }}<br />
                        </div>
                      </v-flex>
                      <div class="highlight" :class="product.color"></div>
                      <div class="amount">NGR{{ product.amount | toDecimal }}</div>
                    </v-card>
                  </v-col>
                </v-row>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <v-toolbar row wrap>
          <v-toolbar-title>CHECKOUT</v-toolbar-title>

          <v-spacer></v-spacer>

          <span right v-if="carts.customer && carts.customer.name">{{
            carts.customer.name
          }}</span>
        </v-toolbar>
        <div class="portlet light" style="background-color:hsl(0, 0%, 91%); !important; color:#000 !important;">
          <div class="portlet-body">
            <div class="row">
              <div class="col-md-12 scroller" style="height:430px !important;">
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
              <div class="row ">
                <div class="col-md-12 ">
                  <table class="table">
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
                        <td style="width:90%; color:#000">
                          <span>Sub-Total</span>
                        </td>
                        <td style="text-align:right;color:#000">
                          &#8358;{{ carts.subtotal | toDecimal }}
                        </td>
                      </tr>
                      <tr v-if="settings.almona && settings.almona.allow_type">
                        <td colspan="2" style="text-align:; color: #000">
                          <v-flex xs12 row>
                            <v-flex xs2 class="pl-4 mt-2">Type: </v-flex>
                            <v-flex xs4>
                              <v-select
                                v-model="carts.type"
                                @change="changeType"
                                :items="transactions"
                                label="..."
                                item-text="name"
                                item-value="id"
                                dense
                                solo
                                />
                              
                            </v-flex>
                            <v-flex xs3>
                              <v-select
                                v-model="carts.calc"
                                @change="changeType"
                                :items="calcs"
                                label="..."
                                item-text="name"
                                item-value="name"
                                dense
                                solo
                                />
                              
                            </v-flex>
                            <v-flex xs3 class="align-right">
                              <input
                                type="text"
                                class="form-control"
                                name="percentage"
                                v-model="carts.percentage"
                                placeholder="100%"
                                @input="updateTotPercentage"
                                :disabled="disable_option"
                              />
                            </v-flex>
                          </v-flex>
                        </td>
                      </tr>
                      <tr v-if="settings.almona && settings.almona.allow_discount">
                        <td style="width:90%;color:#000; text-align: left">
                          <v-flex xs12 row>
                            <v-flex xs4 class="pl-4 mt-2">{{ label }}</v-flex>
                            <v-flex xs8>
                              <div class="input-group">
                                  <input
                                    type="text"
                                    class="form-control"
                                    name="discount"
                                    v-model="carts.discount"
                                    placeholder="Discount"
                                    @input="updateTotDiscount"
                                    @focus="openWaver"
                                  /> 
                                  <span class="input-group-addon addon-right" v-if="!waver_lock"><v-icon @click="openWaver" color="red" >lock</v-icon></span>
                                  <span class="input-group-addon addon-right" v-else><v-icon @click="openWaver" color="blue" >lock_open</v-icon></span>
                                </div>
                            </v-flex>
                            
                          </v-flex>
                        </td>
                        <td style="text-align:right;color:#000" class="pl-4 mt-2">
                          &#8358;{{
                            transType.credit == 1 || transType.credit == 3
                              ? carts.balance
                              : carts.discount | toDecimal
                          }}
                        </td>
                      </tr>
                      <tr v-if="settings && settings.almona && settings.almona.allow_vat">
                        <td style="width:90%;color:#000"><span>VAT</span></td>
                        <td style="text-align:right;color:#000">
                          &#8358;{{ carts.vat | toDecimal }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="row">
              <!-- /btn-group -->
              <div class="col-md-12 pull-left" :disabled="!carts.code">
                <button
                  type="button"
                  class="btn blue btn-lg col-md-12 pay-button"
                  @click="makePayment"
                  :disabled="!isCartNotEmpty"
                  style="font-size:18px;"
                >
                  <span class="col-md-3" style="text-align:left !important;"
                    >Paynow&nbsp;</span
                  ><span
                    class="col-md-9 amount pull-right"
                    style="text-align:right !important;"
                    >&#8358; {{ carts.total | toDecimal }}
                  </span>
                </button>
              </div>
              <div class="col-md-6">
                <button
                  type="button"
                  class="btn red btn-lg col-md-12 pay-button"
                  @click="emptyCart"
                  style="font-size:18px;"
                >
                  <v-icon>delete_sweep</v-icon>Empty
                </button>
              </div>
              <div class="col-md-6">
                <button
                  type="button"
                  class="btn primary btn-lg col-md-12 pay-button"
                  @click="addCustomer(carts.id)"
                  style="font-size:12px;"
                >
                  {{
                    (carts.customer && carts.customer.name) ? carts.customer.name : "Add customer"
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="customer_dialog" hide-overlay persistent width="600px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Add new customer
          <v-spacer></v-spacer>
          <v-btn
            @click="
              customer_dialog = false;
              newPayee = false;
            "
            >Cancel</v-btn
          >
          <v-btn class="primary" @click="saveCusttomer">Continue</v-btn>
        </v-card-title>
        <v-container class="pa-4">
          <template v-if="!newPayee">
            <v-toolbar row wrap>
              <input
                type="text"
                class="form-control col-md-10"
                v-model="searchPatient"
                placeholder="Search with patient code"
                @keyup="searchForPatient"
              />
              <v-spacer></v-spacer>

              <v-btn icon large class="grey lighten-4" @click="searchForPatient"
                ><v-icon>search</v-icon></v-btn
              >
              <v-btn icon large class="grey lighten-4" @click="addNewPayee"
                ><v-icon>mdi-file-edit-outline</v-icon></v-btn
              >
            </v-toolbar>
            <v-flex xs12>
              <table class="table table-hover">
                <thead>
                  <th>#</th>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th></th>
                </thead>
                <template v-if="isSearching">
                  <v-progress-circular
                    :size="50"
                    color="primary"
                    indeterminate
                  ></v-progress-circular
                  >Loading requests...
                </template>
                <template v-else>
                  <tbody>
                    <tr
                      class="rowClick"
                      v-for="(pat, index) in patients"
                      :key="index"
                      @click="selectCustomer($event, index)"
                      :id="'row_' + index"
                    >
                      <td style="color:black !important;">{{ index + 1 }}</td>
                      <td style="color:black !important;">
                        {{ pat.pat_code }}
                      </td>
                      <td style="color:black !important;">
                        {{ pat.basic.name }}
                      </td>
                      <td style="color:black !important;">
                        {{ pat.basic.gender }}
                      </td>
                      <td style="color:black !important;">
                        <small>Click to select</small>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </table>
            </v-flex>
          </template>

          <v-layout row wrap v-if="newPayee" class="pa-4">
            <v-flex xs8>
              <label>Name</label>
              <input
                type="text"
                class="form-control"
                v-model="carts.customer.name"
              />
            </v-flex>
            <v-flex xs4>
              <label>Patient code</label>
              <input
                type="text"
                class="form-control"
                v-model="carts.customer.code"
              />
            </v-flex>
            <v-flex xs6 align-center justify-space-between>
              <label>Gender</label>
              <select
                class="form-control select2me"
                placeholder="Gender"
                v-model="carts.customer.gender"
              >
                <option selected="selected">..Select gender..</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </v-flex>

            <v-flex xs6 align-center justify-space-between>
              <label>Marital Status</label>
              <select
                class="form-control select2me"
                placeholder="Marital status"
                v-model="carts.customer.mstatus"
              >
                <option value="false">..Select marital status..</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widow">Widow</option>
                <option value="Widower">Widower</option>
              </select>
            </v-flex>
            <v-flex xs4 align-center justify-space-between>
              <label>Date of birth</label>
              <v-menu
                v-model="modal"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <input
                    type="text"
                    class="form-control"
                    v-model="carts.customer.dob"
                    placeholder="Date of birth"
                    v-on="on"
                    readonly
                  />
                </template>
                <v-date-picker
                  v-model="carts.customer.dob"
                  @input="modal = false"
                  :landscape="true"
                  :relative="true"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4>
              <label>Email</label>
              <input
                type="text"
                class="form-control"
                v-model="carts.customer.email"
                placeholder="Email"
              />
            </v-flex>
            <v-flex xs4>
              <label>Phone number</label>
              <input
                type="tel"
                class="form-control"
                v-model="carts.customer.phone"
                placeholder="Mobile number"
              />
            </v-flex>
            <v-flex xs12 align-center justify-space-between>
              <label>Address</label>
              <textarea
                cols="20%"
                rows="4"
                class="form-control"
                placeholder="Address"
                v-model="carts.customer.address"
              ></textarea>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="paynow_dialog" hide-overlay persistent width="800px">
      <v-card align-center>
        <v-card-title class="grey lighten-4 py-4 title">
          Select payment method
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="paynow_dialog = false">Cancel</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <template v-if="isPosting">
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular
            >Processing requests...
          </template>
          <v-layout row wrap style="text-align:center">
            <v-card>
              <v-layout row wrap>
                <v-flex
                  v-for="(method, index) in paymentMethods"
                  :key="index"
                  @click="paynowHandler(method)"
                >
                  <v-card
                    class="red thumbnail"
                    style="min-height:80px; min-width:100px;"
                  >
                    <v-container fill-height fluid pa-2>
                      <v-layout fill-height>
                        <v-flex
                          xs12
                          align-end
                          flexbox
                          style="padding-top:12px;"
                        >
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
      </v-card>
    </v-dialog>
    <!--Waver dialog modal -->
    <v-dialog v-model="waver_dialog" hide-overlay persistent width="400px">
      <v-card align-center>
        <v-card-title class="grey lighten-4 py-4 title">
          <v-icon color="blue" size="112px">lock</v-icon>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout xs12>
            <v-flex xs12>
              <v-form>
                <v-flex xs12>
                  <v-layout align-center>
                    <base-authorization @authUser="authUser" @closeAuth="closeAuth" :close="false" :auth="false" :confirm="true" />
                  </v-layout>
                </v-flex>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="waver_dialog = false">Close</v-btn>
          <v-btn color="primary" @click="unlockWaver" :disabled="!isLockDialogButtonEnable">Unlock</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { URL, LS, IDGenerator, SHA256 } from "../../../shared/config.js";
import Carts from "../Cart";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      tabs: null,
      lockDialogButtonEnable: false,
      showAutocompleteDropdown: true,
      isPaid: false,
      modal: false,
      printer_off: true,
      disable_option: true,
      customer_dialog: false,
      paynow_dialog: false,
      waver_dialog: false,
      waver_lock: false,
      newPayee: false,
      isSearching: false,
      isPosting: false,
      products: [],
      query: [],
      label: "Discount",
      head: "",
      message: "",
      productSearchInput: "",
      transType:[],
      productsFilter: [],
      paymentmethod: [],
      searchPatient: "",
      patients: [],
      selectedPatient: [],
      user:[],
      tab: [],
      carts: [],
      calcs: [
        { selected: "selected", name: "Percent" },
        { selected: "", name: "Fixed" }
      ],
      waver: "",
      rows:0,
      columns: 4,
    };
  },

  computed: {
    ...mapState([
      "outlet",
      "domain",
      "billings",
      "today",
      "transCode",
      "transactions",
      "paymentMethods",
      "unsyncCart",
      "cart",
      "users",
      "register",
      "settings",
      "packeditems"
    ]),
    cartItem: function() {
      return this.carts.items;
    },
    isCartNotEmpty: function() {
      return this.carts.items && this.carts.items.length > 0 ? true : false;
    },
    isLockDialogButtonEnable(){
      return this.lockDialogButtonEnable
    }
  },

  components: {
    Carts,
  },
  props: {
    source: String
  },
  methods: {
    ...mapActions([
      "setDomain",
      "setSearch",
      "checkStorage",
      "addBilling",
      "addCart",
      "deleteCart",
      "getCode",
      "getToday",
      "setProducts",
      "addpaymentMethods",
      "setRegister",
      "saveStorage",
      "addReturned",
      "addPacked",
      "setPacked"
    ]),
    colorAsign: function() {
      var colors = [
        "bg-color-gold",
        "bg-color-green",
        "bg-color-red",
        "bg-color-blue",
        "bg-color-orange",
        "bg-color-pink",
        "bg-color-purple",
        "bg-color-lime",
        "bg-color-magenta",
        "bg-color-teal",
        "bg-color-turquoise",
        "bg-color-amethyst",
        "bg-color-wet-asphalt",
        "bg-color-midnight-blue",
        "bg-color-sun-flower",
        "bg-color-pomegranate",
        "bg-color-silver",
        "bg-color-asbestos"
      ];
      var pos = Math.floor(Math.random() * colors.length);
      return colors[pos];
    },
    innitialize: function() {
      this.$Progress.start();
      this.get(`/charges`)
      .then(resp => {
        //console.log(resp.response)
        if (resp.status > 0) {
          this.products = resp.response;
          this.loadProduct();
        } else {
          this.$toastr.error(resp.message);
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },
    addNewPayee: function() {
      //alert(this.users.id.toString() + IDGenerator())
      this.carts.customer.code = this.users.id.toString() + IDGenerator();
      this.newPayee = true;
    },

    selectCustomer: function(e, index) {
      NodeList.prototype.forEach = Array.prototype.forEach;
      this.selectedPatient = this.patients[index];
      var tr = e.target.parentNode;
      var tbody = tr.parentNode;
      var trs = tbody.childNodes;
      trs.forEach(function(item) {
        item.style.backgroundColor = "transparent";
      });
      e.target.parentNode.style.backgroundColor = "green";
    },
    searchForPatient: function() {
      this.isSearching = true;
      this.post("/patients/search", { search: this.searchPatient })
        .then(resp => {
          if (resp.status > 0) {
            this.patients = resp.response;
          }
          this.isSearching = false;
        })
        .catch(e => {
          this.isSearching = false;
          this.$toastr.error(e.message);
        });
    },
    /*selectCustomer: function(e, id){
      if(id>0){
        let customer=this.patients.filter(x=>x.id==id);
        this.carts.customer=customer;
      }
    },*/
    loadProduct: function() {
      this.tab = [];
      this.tab.push("All Categories");
      for (var key in this.products) {
        this.tab.push(key);
      }

      this.pushRightItem('');

      
      //console.log(this.productsFilter)
    },

    loadMethod: function() {
      this.paymentmethod = this.paymentMethods;
    },

    pushCategory: function() {
      if (this.head == "") {
        this.loadProduct();
      } else {
        this.pushRightItem(this.head);
      }
    },
    pushRightItem: function(index) {
      if (!index) {
        this.productsFilter = this.products;
      } else {
        this.productsFilter = this.products[index];
      }

      var list = [];
      for (var key in this.productsFilter) {
        if (this.productsFilter[key]) {
          list.push(this.productsFilter[key]);
        }
      }

      let query = [].concat.apply([], list);
      this.rows=Math.ceil(query/this.columns);
      if (query) {
        var colored = [];
        for (var item of query) {
          item["color"] = this.colorAsign();
          colored.push(item);
        }
        this.productsFilter = colored;
      }
      this.productSearchInput = "";
    },
    searchProduct: function() {
      var list = [];
      for (var key in this.products) {
        if (this.products[key]) {
          list.push(this.products[key]);
        }
      }

      list = [].concat.apply([], list);
      if (list) {
        var colored = [];
        for (var item of list) {
          item["color"] = this.colorAsign();
          colored.push(item);
        }
        list = colored;
      }
      //console.log(list)
      this.productsFilter = list.filter(item => {
        return (
          item.name.toLowerCase().includes(this.productSearchInput.toLowerCase()) ||
          item.dept.toLowerCase().includes(this.productSearchInput.toLowerCase())
        );
      });
    },
    addProductToCart(index) {
      if (this.carts.items.length > 0) {
        let outletIndex = this.carts.items.findIndex(x => x.id == index["id"]);
        if (outletIndex > -1) {
          this.carts.items[outletIndex]["qty"] += 1;
          this.carts.items[outletIndex]["total"] =
            this.carts.items[outletIndex]["amount"] *
            this.carts.items[outletIndex]["qty"];
        } else {
          index["qty"] = 1;
          index["total"] = index["amount"] * index["qty"];
          index["discount"] = 0.0;
          this.carts.items.push(index);
        }
      } else {
        index["qty"] = 1;
        index["total"] = index["amount"] * index["qty"];
        index["discount"] = 0.0;
        this.carts.items.push(index);
      }
      if (!this.transType || this.transType.length < 1) {
        this.transType=this.transactions[0];
        this.carts.type = this.transType.id;
      }
      this.changeType();
    },
    saveCusttomer: function() {
      if (!this.newPayee) {
        this.carts.customer.code = this.selectedPatient.pat_code;
        this.carts.customer.name = this.selectedPatient.basic.name;
        this.carts.customer.gender = this.selectedPatient.basic.gender;
        this.carts.customer.mstatus = this.selectedPatient.basic.marital_status;
        this.carts.customer.email = this.selectedPatient.contact.email;
        this.carts.customer.phone = this.selectedPatient.contact.phone;
        this.carts.customer.address = this.selectedPatient.contact.address;
        this.carts.customer.dob = this.selectedPatient.basic.dob;
      }

      if (this.carts.customer.name && this.carts.customer.code) {
        this.customer_dialog = false;
        this.paynow_dialog = true;
      }
    },
    alterToltal: function() {
      this.alter_dialog = false;
      this.paynow_dialog = true;
      this.isPaid = false;
    },
    makePayment: function() {
      //alert(this.register.id)
      this.carts.user = this.users.id; //{...user};
      this.carts.register = this.register.id; //{...this.register};
      
      if (this.carts.total == undefined || this.carts.total == "NaN") {
        alert("Please select transaction type");
        return false;
      }
      if (this.settings.almona && this.settings.almona.auto_generate_file_no) {
        this.getCode();
        this.carts.customer.code = this.users.id.toString() + IDGenerator();
      }

      if (!this.carts.customer.name || !this.carts.customer.code) {
        this.customer_dialog = true;
      } else {
        if (
          this.settings &&
          this.settings.almona &&
          this.settings.almona.allow_operator_edit_total_amount
        ) {
          this.alter_dialog = true;
        } else {
          this.paynow_dialog = true;
        }
      }
    },
    paynowHandler: function(index) {
      this.$Progress.start();
      this.isPosting = true;
      this.getCode();
      this.getToday();
      this.carts.outlet = this.outlet.id;
      this.carts.code = this.users.id.toString() + IDGenerator();
      this.carts.payment = index;
      this.carts.date = this.today;
      this.carts.system = LS.get("system");
      let success = false;

      this.addCart(this.carts);

      this.post(`/bills/account`, this.carts)
        .then(resp => {
          if (resp.status > 0) {
            this.carts.code = resp.response;
            this.carts.status = "Paid";
            LS.set("receipt", this.carts);
            this.paynow_dialog = false;
            this.isPaid = true;
            this.waver_lock = false;
            LS.remove("carts");
            this.$router.push("/sales/account/almona/receipt/"+resp.response);//{ name: "receipt", id: resp.response });
          } else {
            this.$toastr.error(resp.message);
          }
        })
        .finally(() => {
          this.isPosting = false;
          this.$Progress.finish();
        });
    },
    openWaver: function() {
      //console.log(this.settings.waver_lock);
      if (this.settings.almona && this.settings.almona.waver_lock) {
        if (!this.waver_lock) {
          this.waver_lock = false;
          this.waver_dialog = true;
        }
      }
    },
    authUser: function(resp) {
      if (resp.auth) {
        this.waver=resp.pin;
        this.lockDialogButtonEnable=true;
        this.unlockWaver();
      }
    },
    closeAuth: function(cancel) {
      this.authDialog = cancel;
    },
    unlockWaver: function() {
      if (this.waver != "") {
        //console.log(this.user.user_pin+"=="+SHA256(this.waver.password))
        var found = false;
        var index = this.users.findIndex(x => x.user_pin == SHA256(this.waver));

        if (index > -1) {
          this.waver_lock = true;
          this.waver_dialog = false;
          this.waver = "";
        } else {
          this.waver_lock = false;
        }
      }
    },

    addCustomer: function() {
      this.customer_dialog = true;
    },

    deleteItem(value) {
      this.carts.items.splice(value.index, 1);
      this.calculateSummary();
    },
    updateQty(value) {
      this.carts.items[value.index]["total"] =
        this.carts.items[value.index]["amount"] *
        this.carts.items[value.index]["qty"];
      this.calculateSummary();
    },
    updateTotDiscount: function() {
      this.carts.remark = `Discount of # ${this.$options.filters.toDecimal(
        this.carts.discount
      )} for discount.`;
      this.calculateSummary();
    },
    updateChecks: function(value) {
      this.carts.items[value.index]["total"] =
        this.carts.items[value.index]["amount"] *
        this.carts.items[value.index]["qty"] *
        this.carts.items[value.index]["dayDifference"];
      this.calculateSummary();
    },
    changeType: function() {
      var tag = "%";
      if (!this.carts.calc || this.carts.calc == "") {
        this.carts.calc = "Percent";
      }
      if (this.carts.calc == "Percent") {
        tag = "%";
      } else {
        tag = "";
      }
      let index=this.transactions.findIndex(x=>x.id==this.carts.type);
      if(index>-1){
        this.transType=this.transactions[index];
      }
      //console.log(this.transType)
      this.carts.discount = 0;
      this.carts.percentage = this.transType.discount;
      this.disable_option = false;
      
      if (this.transType.dicount >= 100) {
        this.disable_option = false;
      }  
      this.carts.remark = `${this.carts.percentage}${tag} ${this.transType.name}.`;
      

      this.calculateSummary();
    },

    updateTotPercentage: function() {
      var tag = "%";
      if (this.carts.calc == "Percent") {
        tag = "%";
      } else {
        tag = "";
      }
      this.carts.discount = 0.0;
      
      this.carts.remark = `${this.carts.percentage}${tag} ${this.transType.name}.`; 

      this.calculateSummary();
    },
    updateDiscount: function(value) {
      //let index = event.index;
      this.carts.items[value.index]["total"] =
        this.carts.items[value.index]["total"] -
        this.carts.items[value.index]["discount"];
      this.calculateSummary();
    },

    emptyCart: function() {
      let cart = LS.get("carts");
      if (cart) {
        LS.remove("carts");
      }
      this.carts = {
        outlet: 0,
        code: "",
        subtotal: 0.0,
        calc: "Percent",
        percentage: 100,
        discount: 0.0,
        balance: 0.0,
        vat: 0.0,
        total: 0.0,
        remark: "",
        date: "",
        part: true,
        customer: {
          code: "",
          name: "",
          gender: "",
          dob: "",
          mstatus: "",
          email: "",
          phone: "",
          type: 0,
          address: ""
        },
        type: [],
        items: [],
        payment: []
      };
    },

    calculateSummary: function() {
      //console.log(this.carts)
      let qty = 0,
        idiscount = 0,
        discount = 0,
        subtotal = 0;

      for (let i = 0; i < this.carts.items.length; i++) {
        qty += parseInt(this.carts.items[i].qty);

        subtotal += parseFloat(this.carts.items[i].total);
        idiscount += parseFloat(this.carts.items[i].discount);
      }

      this.carts.subtotal = subtotal;
      if (this.transType.discount<100) {
        if (this.carts.calc == "Percent") {
          discount = (parseInt(this.carts.percentage) / 100) * parseFloat(this.carts.subtotal) + parseFloat(idiscount);// + parseFloat(discount);
        } else {
          discount = parseFloat(this.carts.percentage);
        }
      }
      
      if (this.transType.type == 1) {
        this.carts.discount = 0;
        this.carts.balance = parseFloat(discount);// + parseFloat(idiscount);
        this.label = "Balance";
      } else {
        this.carts.balance = 0;
        this.carts.discount = parseFloat(discount);// + parseFloat(idiscount);
        this.label = "Discount";
      }

      this.carts.qty = qty;

      this.carts.total = (parseFloat(subtotal) - parseFloat(this.carts.discount) - parseFloat(this.carts.balance)) + parseFloat(this.carts.vat);
      LS.set("currentCart", this.carts);
      //alert(this.carts.total)
      console.log("subtotal:"+this.carts.subtotal, "discount:"+this.carts.discount, 'Balance:'+this.carts.balance, 'vat:'+this.carts.vat, 'TOTAL:'+this.carts.total)
    },

    closeReceipt: function(status) {
      //alert(status)
      LS.remove("receipt");
      this.isPaid = false;
      this.emptyCart();
    },

    updateProduct: function() {
      var found = false;
      if (this.carts.type.deduct == 1) {
        for (var i = 0; i < this.carts.items.length; ++i) {
          if (this.carts.items[i]["inventory"] > 0) {
            this.carts.items[i]["qty_available"] -= parseInt(
              this.carts.items[i]["qty"]
            );

            for (var key in this.products) {
              if (this.products[key] == false) continue;
              //console.log(this.products[key])
              var index = this.products[key].findIndex(
                x => x.code == this.carts.items[i]["code"]
              );
              if (index > -1) {
                this.products[key][index]["qty_avalable"] =
                  this.products[key][index]["qty_avalable"] -
                  this.carts.items[i]["qty"];
                found = true;
              }
            }
          }
        }

        if (found) {
          this.addProduct(this.products);
        }
      }
    },

    toObject: function(arr) {
      var rv = {};
      for (var i = 0; i < arr.length; ++i) rv[i] = arr[i];
      return rv;
    },
    checkIfItemExist: function() {
      let receipt = LS.get("receipt");
      LS.remove("receipt");
      if (receipt) {
        this.$router.push("receipt");
      }
      let cart = LS.get("carts");
      if (cart) {
        //console.log(cart)
        this.carts = cart;
      } else {
        this.emptyCart();
      }
    }
  },
  created() {
    this.checkStorage();
    this.setDomain();
    //this.emptyCart()
  },
  mounted() {
    this.user=LS.get('user');
    this.checkStorage();
    //console.log(this.settings.almona)
    setTimeout(this.innitialize, 200);
    setTimeout(this.loadMethod, 200);
    setTimeout(this.checkIfItemExist, 200);
  }
};
</script>

<style scoped>
.collapse {
  transition: all 0.1s ease-out;
}
.list-group-item {
  padding-top: 0px;
  padding-bottom: 0px;
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
td {
  color: #fff;
}
</style>
