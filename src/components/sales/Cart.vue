<template>
  <div>
    <div class="list-group-item cart" style="">
      <div class="row">
        <div class="col-md-9" @click="toggle($event)">
          <div class="row">
            <div class="col-md-2">{{ CartWatcher.qty }}</div>
            <div class="col-md-7">
              {{ CartWatcher.name | truncate }}<br />{{ CartWatcher.detail }}
            </div>
            <div class="col-md-3">
              &#8358;{{ CartWatcher.total | toDecimal }}
            </div>
          </div>
        </div>
        <div class="col-md-3 pull-right">
          <button type="button" class="btn">
            <v-icon @click="deleteCartItem">delete_sweep</v-icon>
          </button>
        </div>
      </div>
      <div class="accordion-toggle collapse" :id="cartIndex">
        <div class="row">
          <div class="col-md-3">
            <label class="control-label">Quantity</label>
            <input
              type="text"
              class="form-control"
              name="qty"
              v-model="cart.qty"
              @input="updateCartQty"
              @blur="resetCartQty"
            />
          </div>
          <div class="col-md-4">
            <label class="control-label">Price</label>
            <input
              type="text"
              class="form-control"
              name="price"
              v-model="cart.amount"
              readonly
            />
          </div>
          <div class="col-md-5">
            <label class="control-label">Discount</label>
            <input
              type="text"
              class="form-control"
              name="discount"
              v-model="cart.discount"
              @input="updateCartDiscount"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <input
              type="text"
              class="form-control"
              name="remark"
              v-model="cart.remark"
              placeholder="Add your remark"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CartComponent",
  data() {
    return {};
  },
  props: {
    cartIndex: Number,
    cart: Object,
  },
  computed: {
    CartWatcher: function() {
      this.cart.total = this.cart.amount * this.cart.qty;
      //console.log(this.cart)
      return this.cart;
    }
  },
  methods: {
    hasClass(element, cls) {
      return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
    },
    toggle(e) {
      //let parent=$(e.currentTarget);this.$el
      //console.log(parent)
      let els = document.getElementById(this.cartIndex);
      //console.log(els)
      this.$el.onclick = e => {
        if (e.target.tagName !== "INPUT") {
          let index = this.hasClass(els, "collapse");
          //alert(index)
          if (!index) {
            els.classList.add("collapse");
          } else {
            els.classList.remove("collapse");
          }
        }
        //console.log(e.target);
        //console.log(e.target.tagName);
      };
    },
    resetCartQty: function() {
      //console.log(this.cart)
      if (this.cart.qty == 0 || this.cart.qty == "") {
        this.cart.qty = 1;
      }
      this.cart.qty = parseInt(this.cart.qty);
      //alert(this.cart.qty)
      this.cart.total = parseInt(this.cart.qty) * parseFloat(this.cart.amount);
      this.$emit("updateCartQty", { index: this.cartIndex });
    },

    updateCartQty() {
      //console.log(this.cart)
      if (this.cart.qty == "") {
        this.cart.qty = 0;
      }
      this.cart.qty = parseInt(this.cart.qty);
      //alert(this.cart.qty)
      this.cart.total = parseInt(this.cart.qty) * parseFloat(this.cart.amount);
      this.$emit("updateCartQty", { index: this.cartIndex });
    },
    updateCartDiscount() {
      if (this.cart.discount == "") {
        this.cart.discount = 0;
      }

      this.cart.total =
        parseInt(this.cart.qty) * parseFloat(this.cart.amount) -
        parseFloat(this.cart.discount);
      this.$emit("updateCartDiscount", { index: this.cartIndex });
    },
    deleteCartItem() {
      this.$emit("deleteCartItem", { index: this.cartIndex });
    }
  },
  mounted() {
    //this.cart.qty=1;
  }
};
</script>
<style scoped>
.collapse {
  transition: all 0.1s ease-out;
}
.list-group-item {
  padding-top: 1px;
  padding-bottom: 1px;
  cursor: pointer;
  font-size: 12px;
}
.accordion-toggle {
  background-color: #f7f7f7;
  width: 100% !important;
}
</style>
