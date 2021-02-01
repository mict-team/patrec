<template>
  <v-app id="inspire">
    <v-layout v-if="isRegister">
      <template v-if="loading">
        <div class="loader">
          <div class="loader-outter"></div>
          <div class="loader-inner"></div>
          <div class="caption">Loading...</div>
        </div>
      </template>
      <template v-else>
        <v-layout row wrap>
          <v-flex xs8>
            <v-toolbar row wrap>
              <v-flex xs8>
                <v-text-field
                  append-icon="search"
                  class="mx-3"
                  label="Search"
                  prepend-inner-icon="search"
                  solo-inverted
                  @input="searchProduct"
                  v-model="productSearchInput"
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <select
                  class="form-control cat"
                  v-model="head"
                  @change="pushCategory"
                >
                  <option value="">All Categories</option>
                  <option
                    v-for="(head, index) in tab"
                    :key="index"
                    :value="head"
                    >{{ head }}</option
                  >
                </select>
              </v-flex>
            </v-toolbar>
            <div class="portlet light">
              <div class="portlet-body">
                <div class="panel light">
                  <div
                    class="cart-panel list-group scroller"
                    style="height:700px !important;"
                    :visible="1"
                  >
                    <v-layout row wrap>
                      <v-flex
                        v-for="(product, index) in productsFilter"
                        :key="index"
                        @click="addProductToCart(product)"
                      >
                        <v-card class="thumbnail" style="">
                          <v-flex xs12 align-end flexbox>
                            <div class="titles">
                              {{ product.name }}<br />({{
                                product.amount | toDecimal
                              }})<br />
                              <span style="font-size:12px;"
                                >Qty:{{ product.qty }}</span
                              >
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
              <v-btn
                icon
                class="blue"
                style="color:white;"
                @click="addCustomer(carts.id)"
                title="Add customer"
                v-if="!carts.customer.name"
                ><v-icon>group_add</v-icon></v-btn
              >

              <v-toolbar>
                <v-toolbar-title>CHECKOUT</v-toolbar-title>

                <v-spacer></v-spacer>

                <span right v-if="carts.customer.name">
                  <v-btn @click="addCustomer(carts.id)">{{
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
                        <tr v-if="settings && settings.allow_type == 1">
                          <td colspan="2">
                            <v-flex xs12 row>
                              <v-flex xs3>Type</v-flex>
                              <v-flex xs3>
                                <select
                                  name="type"
                                  v-model="carts.type"
                                  class="form-control"
                                  @change="changeType"
                                >
                                  <option
                                    v-for="(option, index) in transactions"
                                    :key="index"
                                    :value="option"
                                    :selected="index === 0 ? 'selected' : ''"
                                    >{{ option.name }}</option
                                  >
                                </select>
                              </v-flex>
                              <v-flex xs3>
                                <select
                                  name="type"
                                  v-model="carts.calc"
                                  class="form-control"
                                  @change="changeType"
                                  :disabled="!disable_option"
                                >
                                  <option
                                    v-for="(option, index) in calcs"
                                    :key="index"
                                    :value="option.name"
                                    :selected="index === 0 ? 'selected' : ''"
                                    >{{ option.name }}</option
                                  >
                                </select>
                              </v-flex>
                              <v-flex xs3 class="align-right">
                                <input
                                  type="text"
                                  class="form-control"
                                  name="percentage"
                                  v-model="carts.percentage"
                                  placeholder="100%"
                                  @input="updateTotPercentage"
                                  :disabled="!disable_option"
                                />
                              </v-flex>
                            </v-flex>
                          </td>
                        </tr>
                        <tr v-if="settings && settings.allow_discount == 1">
                          <td style="width:90%;">
                            <v-flex xs12 row>
                              <v-flex xs3>{{ label }}</v-flex>
                              <v-flex xs7>
                                <input
                                  type="text"
                                  class="form-control"
                                  name="discount"
                                  v-model="carts.discount"
                                  placeholder="Discount"
                                  @input="updateTotDiscount"
                                  @focus="openWaver"
                                />
                              </v-flex>
                              <v-flex
                                xs2
                                v-if="
                                  !waver_lock && this.settings.waver_lock == 1
                                "
                                ><v-icon @click="openWaver" color="red"
                                  >lock</v-icon
                                ></v-flex
                              >
                              <v-flex xs2 v-if="waver_lock"
                                ><v-icon @click="openWaver" color="blue"
                                  >lock_open</v-icon
                                ></v-flex
                              >
                            </v-flex>
                          </td>
                          <td style="text-align:right">
                            &#8358;{{
                              carts.type.credit == 1 || carts.type.credit == 3
                                ? carts.balance
                                : carts.discount | toDecimal
                            }}
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
                <div class="row">
                  <!-- /btn-group -->
                  <div class="col-md-9 pull-left" :disabled="!carts.code">
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
                        class="col-md-9 amount"
                        style="text-align:right !important;"
                        >&#8358; {{ carts.total | toDecimal }}
                      </span>
                    </button>
                  </div>
                  <div class="col-md-3">
                    <button
                      type="button"
                      class="btn red btn-lg col-md-12 pay-button"
                      @click="emptyCart"
                      style="font-size:18px;"
                    >
                      Empty <v-icon>delete_sweep</v-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </template>
    </v-layout>
    <v-layout v-else>
      <v-layout align-center justify-center>
        <v-flex xs12 sm4 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Open sales register</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <label class="control-label">What is your opening balance</label>
              <input
                type="text"
                class="form-control"
                name="openingBalance"
                v-model="registerDetail.amount"
                placeholder="What is your opening balance"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="openRegister">Open register</v-btn>
            </v-card-actions>
            <hr />
            <v-card-actions v-if="isRegisterOpened">
              Do you still want to continue with {{ register.user.name }} sales
              register opened on {{ register.date }}<br />
              <v-btn danger @click="continueWithRegister">Yes! Continue</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
    <v-dialog v-model="customer_dialog" hide-overlay persistent width="600px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Add new customer
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
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
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="customer_dialog = false">Cancel</v-btn>
          <v-btn @click="saveCusttomer">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="paynow_dialog" hide-overlay persistent width="800px">
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
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="paynow_dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="waver_dialog" hide-overlay persistent width="400px">
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
                      prepend-icon="lock"
                      placeholder="User Access Pin"
                      type="password"
                      v-model="waver.password"
                    ></v-text-field>
                  </v-layout>
                </v-flex>
              </v-form>
            </v-flex>
            <v-flex xs3 style="padding-top:20px !important;"
              ><v-icon color="blue" size="112px">lock</v-icon></v-flex
            >
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="waver_dialog = false">Close</v-btn>
          <v-btn color="primary" @click="unlockWaver">Unlock</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { URL, LS, IDGenerator, SHA256 } from "../../../shared/config.js";
import Carts from "../Cart";
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      tabs: null,
      loading: false,
      registerOpen: false,
      showAutocompleteDropdown: true,
      isPaid: false,
      isSalesOpen: true,
      modal: false,
      printer_off: true,
      disable_option: false,
      customer_dialog: false,
      paynow_dialog: false,
      waver_dialog: false,
      waver_lock: false,
      products: [],
      query: [],
      label: "",
      head: "",
      message: "",
      productSearchInput: "",
      productsFilter: [],
      paymentmethod: [],
      registerDetail: {
        amount: ""
      },
      calcs: [
        { selected: "selected", name: "Percent" },
        { selected: "", name: "Fixed" }
      ],
      tab: [],
      carts: [],
      waver: ""
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
      return this.carts.items.length > 0 ? true : false;
    },
    isRegister: function() {
      this.checkIfJustLogin();
      return this.registerOpen;
    },
    isRegisterOpened: function() {
      return this.register && this.register.code != undefined ? true : false;
    }
  },

  components: {
    Carts
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
      this.departments = LS.get("department");
      var load = new Promise((resolve, reject) => {
        axios
          .get(`${this.domain}/drugs/sell/${this.departments.id}`, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "text/json"
            }
          })
          .then(response => {
            if (response.data.status > 0) {
              resolve(response.data.response);
            } else {
              reject(false);
            }
          })
          .catch(e => {
            console.log(e);
            reject(false);
          });
      });
      load.then(response => {
        if (response != false) {
          this.products = response;
          this.loadProduct();
        }
      });
    },

    loadProduct: function() {
      this.tab = [];
      for (var key in this.products) {
        this.tab.push(key);
      }

      this.pushRightItem(this.tab[0]);

      var list = [];
      for (var key in this.products) {
        if (this.products[key]) {
          list.push(this.products[key]);
        }
      }

      this.query = [].concat.apply([], list);
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

      if (this.productsFilter) {
        var colored = [];
        for (var item of this.productsFilter) {
          item["color"] = this.colorAsign();
          colored.push(item);
        }
        this.productsFilter = colored;
      }
      //alert(this.productsFilter)
      this.productSearchInput = "";
    },
    searchProduct() {
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
      this.productsFilter = list.filter(item => {
        return item.name
          .toLowerCase()
          .includes(this.productSearchInput.toLowerCase());
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
      if (!this.carts.type || this.carts.type.length < 1) {
        this.carts.type = this.transactions[0];
      }
      this.changeType();
    },
    saveCusttomer: function() {
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
      var user = LS.get("user");
      this.carts.user = { ...user };
      this.carts.register = { ...this.register };
      if (this.carts.total == undefined || this.carts.total == "NaN") {
        alert("Please select transaction type");
        return false;
      }
      this.settings = LS.get("settings");
      //alert(JSON.stringify(this.settings.auto_generate_file_no));
      if (this.settings && this.settings.auto_generate_file_no == 1) {
        this.getCode();
        this.carts.customer.code = this.users.id.toString() + IDGenerator();
      }

      if (!this.carts.customer.name || !this.carts.customer.code) {
        this.customer_dialog = true;
      } else {
        if (
          this.settings &&
          this.settings.allow_operator_edit_total_amount &&
          this.settings.allow_operator_edit_total_amount == 1
        ) {
          this.alter_dialog = true;
        } else {
          this.paynow_dialog = true;
        }
      }
    },
    paynowHandler: function(index) {
      this.getCode();
      this.getToday();
      this.carts.outlet = this.outlet.id;
      this.carts.dept = this.departments.id;
      this.carts.code = this.users.id.toString() + IDGenerator();
      this.carts.payment = index;
      this.carts.date = this.today;
      this.carts.system = LS.get("system");
      let success = false;

      this.addCart(this.carts);

      //console.log(this.carts);
      var postCart = new Promise((resolve, reject) => {
        axios
          .post(`${this.domain}/drugs/sell`, this.carts, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "text/json"
            }
          })
          .then(response => {
            if (response.data.status > 0) {
              resolve(true);
            } else {
              reject(false);
            }
          })
          .catch(e => {
            console.log(e);
            reject(false);
          });
      });
      postCart.then(response => {
        if (!response) {
          LS.remove("carts");
          alert("Unable to post transaction. Pls try again later");
        }
      });
      LS.set("receipt", this.carts);
      this.paynow_dialog = false;
      this.isPaid = true;
      this.waver_lock = false;
      this.$router.push({ name: "receipt" });
    },
    openWaver: function() {
      if (this.settings && this.settings.waver_lock == 1) {
        if (!this.waver_lock) {
          this.waver_lock = false;
          this.waver_dialog = true;
        }
      }
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
    updateTotDiscount() {
      this.carts.remark = `Discount of # ${this.$options.filters.toDecimal(
        this.carts.discount
      )} for discount.`;
      this.calculateSummary();
    },

    changeType() {
      var tag = "%";
      if (!this.carts.calc || this.carts.calc == "") {
        this.carts.calc = "Percent";
      }
      if (this.carts.calc == "Percent") {
        tag = "%";
      } else {
        tag = "";
      }
      this.carts.discount = 0;
      this.carts.percentage = this.carts.type.discount;
      this.disable_option = false;
      if (this.carts.type.type == 0) {
        this.disable_option = true;
      }

      this.carts.remark = `${this.carts.percentage}${tag} ${this.carts.type.remark} for ${this.carts.type.name} account.`;

      this.calculateSummary();
    },

    updateTotPercentage() {
      var tag = "%";
      if (this.carts.calc == "Percent") {
        tag = "%";
      } else {
        tag = "";
      }
      this.carts.discount = 0.0;
      this.carts.remark = `${this.carts.percentage}${tag} ${this.carts.type.remark} for ${this.carts.type.name} account.`;

      this.calculateSummary();
    },
    updateDiscount(value) {
      //let index = event.index;
      this.carts.items[value.index]["total"] =
        this.carts.items[value.index]["total"] -
        this.carts.items[value.index]["discount"];
      this.calculateSummary();
    },

    emptyCart() {
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

    calculateSummary() {
      console.log(this.carts);
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
      if (this.disable_option) {
        if (this.carts.calc == "Percent") {
          discount =
            (parseInt(this.carts.percentage) / 100) *
              parseFloat(this.carts.subtotal) +
            parseFloat(discount);
        } else {
          discount = parseFloat(this.carts.percentage);
        }
      }

      if (this.carts.type.type == 1) {
        this.carts.discount = 0;
        this.carts.balance = parseFloat(discount) + parseFloat(idiscount);
        this.label = "Balance";
      } else {
        this.carts.balance = 0;
        this.carts.discount = parseFloat(discount) + parseFloat(idiscount);
        this.label = "Discount";
      }

      this.carts.qty = qty;

      this.carts.total =
        parseFloat(subtotal) -
        parseFloat(this.carts.discount) -
        parseFloat(this.carts.balance) +
        parseFloat(this.carts.vat);
      LS.set("currentCart", this.carts);
      console.log(this.carts);
    },

    openRegister: function() {
      this.getCode();
      this.getToday();
      this.registerDetail.outlet = this.outlet.id;
      this.registerDetail.code = this.users.id.toString() + IDGenerator();
      this.registerDetail.user = this.users.id;
      this.registerDetail.date = this.today;
      //console.log(this.registerDetail); return false;
      this.setRegister(this.registerDetail);

      axios
        .post(this.domain + "/open-register", this.registerDetail, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "text/json"
          }
        })
        .then(response => {
          if (response.data.status > 0) {
            this.setRegister(this.register);
          } else {
            alert(
              "Unable to save your sales registered on the cloud. Dont worry, it will synchronice."
            );
          }
        })
        .catch(e => {
          console.log(e);
        });
      LS.set("justLogin", false);
      this.registerOpen = true;
    },
    continueWithRegister: function() {
      LS.set("justLogin", false);
      this.registerOpen = true;
    },
    checkIfJustLogin: function() {
      let justLogin = LS.get("justLogin");
      if (justLogin && justLogin == true) {
        this.registerOpen = false;
      } else {
        this.registerOpen = true;
      }
      return false;
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
      if (receipt) {
        this.$router.push("receipt");
      }
      let cart = LS.get("carts");
      if (cart) {
        this.carts = cart;
      } else {
        this.emptyCart();
      }
    }
  },
  mounted() {
    this.loading = true;
    var start = new Promise(resolve => {
      this.checkStorage();
      this.setDomain();
      resolve(true);
    });
    start.then(resp => {
      this.innitialize();
      this.loadMethod();
      this.checkIfJustLogin();
      this.checkIfItemExist();
      this.loading = false;
    });
  }
};
</script>

<style scoped>
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
</style>
