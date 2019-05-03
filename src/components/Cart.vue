<template>
  <div>
    <v-layout row wrap class="list-group-item">
      <v-flex xs12 row wrap >
        <v-flex xs11  row wrap @click="toggle($event)" >
          <v-flex xs3><v-icon>keyboard_arrow_right</v-icon>{{ CartWatcher.qty_sold }}</v-flex>
          <v-flex xs6>{{ CartWatcher.name | truncate }}<br />{{ CartWatcher.detail }}</v-flex>
          <v-flex xs3>&#8358;{{ CartWatcher.total | toDecimal }}</v-flex>
        </v-flex>
        <v-flex xs1
          ><v-btn class="remove" flat @click="deleteCartItem"
            ><v-icon>delete_sweep</v-icon></v-btn
          ></v-flex
        >
      </v-flex>

      <div class="accordion-toggle collapse" :id="cartIndex">
        <div class="row col-md-12 col-sm-12">
          <div class="col-md-3">
            <label class="control-label">Quantity</label>
            <input
              type="text"
              class="form-control"
              name="qty"
              v-model="cart.qty_sold"
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
              v-model="cart.amount" readonly
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
        <br />
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
    </v-layout>
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
    cart: Object
  },
  computed: {
    CartWatcher: function(){
      return this.cart
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
    resetCartQty: function(){
      //console.log(this.cart)
      if(this.cart.qty_sold==0 || this.cart.qty_sold==''){
        this.cart.qty_sold=1
      }
      this.cart.qty_sold=parseInt(this.cart.qty_sold);
      //alert(this.cart.qty)
      this.cart.total = this.cart.qty_sold * this.cart.price;
      this.$emit('updateCartQty',{ index: this.cartIndex});
    },
    updateCartQty() {
      //console.log(this.cart)
      if(this.cart.qty_sold==''){
        this.cart.qty_sold=0
      }
      this.cart.qty_sold=parseInt(this.cart.qty_sold);
      //alert(this.cart.qty)
      this.cart.total = this.cart.qty_sold * this.cart.price;
      this.$emit('updateCartQty',{ index: this.cartIndex});
    },
    updateCartDiscount() {
      if(this.cart.discount==''){
        this.cart.discount=0
      }
      this.cart.total = this.cart.total - this.cart.discount;
      this.$emit('updateCartDiscount',{ index: this.cartIndex });
    },
    deleteCartItem(){
      this.$emit('deleteCartItem', {index:this.cartIndex});
    }
  },
  mounted(){
    this.cart.qty_sold=1;
  }
};
</script>
<style>
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}
.collapse {
  transition: all 0.1s ease-out;
}
.list-group-item {
  paddig-top: 10px;
  padding-bottom: 10px;
  padding-left: 1em;
  cursor: pointer;
}
</style>
