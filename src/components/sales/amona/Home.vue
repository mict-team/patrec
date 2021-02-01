<template>
  <v-container>
    
  </v-container>
</template>

<script>
import { URL, LS, IDGenerator, SHA256 } from "../../../shared/config.js";
import Carts from "../Cart";
import Receipt from "../Receipt";
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
      newPayee: false,
      isSearching: false,
      isPosting: false,
      products: [],
      query: [],
      label: "Discount",
      head: "",
      message: "",
      productSearchInput: "",
      productsFilter: [],
      paymentmethod: [],
      registerDetail: {
        amount: ""
      },
      searchPatient: "",
      patients: [],
      selectedPatient: [],
      tab: [],
      carts: [],

      calcs: [
        { selected: "selected", name: "Percent" },
        { selected: "", name: "Fixed" }
      ],
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
    Carts,
    Receipt
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
      this.get(`/charges`)
        .then(resp => {
          if (resp.status > 0) {
            this.products = resp.response;
            this.loadProduct();
          } else {
            this.$toastr.error(resp.message);
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    addNewPayee: function() {
      //alert(this.users.id.toString() + IDGenerator())
      this.carts.customer.code = this.users.id.toString() + IDGenerator();
      this.newPayee = true;
    },

    selectStore: function(e, index) {
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
      //console.log(this.productsFilter)
      this.loading = false;
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
      this.productsFilter = list.filter(item => {
        return (
          item.name
            .toLowerCase()
            .includes(this.productSearchInput.toLowerCase()) ||
          item.tag.toLowerCase().includes(this.productSearchInput.toLowerCase())
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
      if (!this.carts.type || this.carts.type.length < 1) {
        this.carts.type = this.transactions[0];
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
      var user = LS.get("user");
      this.carts.user = { ...user };
      this.carts.register = { ...this.register };
      if (this.carts.total == undefined || this.carts.total == "NaN") {
        alert("Please select transaction type");
        return false;
      }
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
            LS.set("receipt", this.carts);
            this.paynow_dialog = false;
            this.isPaid = true;
            this.waver_lock = false;
            this.isPosting = false;
            LS.remove("carts");
            this.$router.push({ name: "receipt" });
          } else {
            this.isPosting = false;
            this.$toastr.error(resp.message);
          }
        })
        .catch(e => {
          LS.remove("carts");
          this.isPosting = false;
          this.$toastr.error("Unable to post transaction. Pls try again later");
        });
    },
    openWaver: function() {
      //console.log(this.settings.waver_lock);
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
      //console.log(this.carts.type)
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

    updateTotPercentage: function() {
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
      //console.log(this.carts)
    },

    closeReceipt: function(status) {
      //alert(status)
      LS.remove("receipt");
      this.isPaid = false;
      this.emptyCart();
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

      this.post("/open-register", this.registerDetail)
        .then(resp => {
          if (resp.status > 0) {
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
      //console.log(this.register)
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
    this.loading = true;
    this.innitialize();
    this.loadMethod();
    this.checkIfJustLogin();
    this.checkIfItemExist();
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
