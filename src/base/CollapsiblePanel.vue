<template>
  <div>
    <v-layout row wrap class="list-group-item">
      <v-flex xs12 row wrap>
        <v-flex xs11 row wrap @click="toggle($event)">
          <v-flex xs3
            ><v-icon>keyboard_arrow_right</v-icon
            >{{ ItemWatcher.qty_sold }}</v-flex
          >
          <v-flex xs6
            >{{ ItemWatcher.name | truncate }}<br />{{
              ItemWatcher.detail
            }}</v-flex
          >
          <v-flex xs3>&#8358;{{ ItemWatcher.total | toDecimal }}</v-flex>
        </v-flex>
        <v-flex xs1><v-icon>expand_more</v-icon></v-flex>
      </v-flex>

      <div class="accordion-toggle collapse" :id="itemIndex">
        <div class="row col-md-12 col-sm-12">
          <div class="col-md-3"></div>
          <div class="col-md-4"></div>
          <div class="col-md-5"></div>
        </div>
      </div>
    </v-layout>
  </div>
</template>
<script>
export default {
  name: "CollapsiblePanel",
  data() {
    return {};
  },
  props: {
    itemIndex: Number,
    header: Object,
    item: Object
  },
  computed: {
    ItemWatcher: function() {
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
      };
    }
  },
  mounted() {
    //this.cart.qty_sold=1;
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
