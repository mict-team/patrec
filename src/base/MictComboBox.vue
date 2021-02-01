<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 class="combobox">
        <v-text-field
          class="mx-3"
          label="Please select an item"
          prepend-inner-icon="search"
          solo-inverted
          v-model="productSearchInput"
          v-on:keyup="searchText"
          v-on:keydown.down.prevent="selectNext()"
          v-on:keydown.up.prevent="selectPrev()"
          v-on:keyup.8="handleBackspace()"
          v-on:blur="blurEvent"
        ></v-text-field>

        <ul class="data-list" v-if="hasElement">
          <li
            class="data-list__item"
            v-for="(item, index) in productsFilter" :key="index" v-on:click="select(item)">
            <div>SKU: {{ item.sku }}</div>
            <div>
              <strong>
                <template v-if="!item.dept">{{ `${item.name}` }}</template>
                <template v-else>{{ `${item.dept}: ${item.name}` }}</template>
              </strong>
            </div>
            <div>Desc.: {{ item.remark }}</div>
          </li>
        </ul>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "MictComboBox",
  data() {
    return {
      showAutocompleteDropdown: false,
      productSearchInput: "",
      productsFilter: [],
      selectedIndex: 0,
    };
  },
  props: {
    items: {
      type:[Array, Object]
    }
  },
  computed: {
    hasElement: function() {
      return this.productsFilter.length > 0;
    }
  },
  methods: {
    handleBackspace: function() {
      this.showAutocompleteDropdown = true;
    },
    select: function(item) {
      this.$emit("select", { item });
      this.showAutocompleteDropdown = false;
      this.productsFilter = [];
    },
    selectNext: function() {
      if (this.showAutocompleteDropdown) {
        if (this.selectedIndex < this.productsFilter.length - 1) {
          this.selectedIndex++;
        } else {
          this.selectedIndex = 0;
        }
      } else {
        this.showAutocompleteDropdown = true;
      }
    },
    selectPrev: function() {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      } else {
        this.selectedIndex = this.productsFilter.length - 1;
      }
    },
    searchText: function() {
      //alert('deji')
      this.showAutocompleteDropdown = true;
      this.productsFilter = this.items.filter(item => {
        return (
          item.name
            .toLowerCase()
            .includes(this.productSearchInput.toLowerCase()) ||
          (item.remark != null &&
            item.remark
              .toLowerCase()
              .includes(this.productSearchInput.toLowerCase())) ||
          (item.dept && 
            item.dept
              .toLowerCase()
              .includes(this.productSearchInput.toLowerCase()))
        );
      });
      //console.log(this.productsFilter)
    },
    blurEvent: function() {
      if (!this.productSearchInput) {
        this.productsFilter = [];
      }
    }
  },
  mounted() {
    console.log(this.items)
  }
};
</script>

<style scoped>
.combobox {
  max-width: 100%;
}
.combobox__input {
  padding: 0.5rem;
  width: 100%;
  font-size: 15px;
  -webkit-appearance: none;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 3px;
  text-align: left;
  background: white;
}

.combobox__input:focus {
  box-shadow: none;
  -webkit-appearance: none;
  outline: 0;
}
.data-item_container {
  position: absolute;
  top: 65%;
  background-color: white !important;
}
.combobox .data-list {
  position: absolute;
  left:28.5%;
  width: 63% !important;
  max-height: 220px;
  overflow-y: scroll;
  margin-top: -0.9rem;
  background-color: red !important;
  border: 0px solid rgba(0, 0, 0, 0.08);
  padding: 0;
  -webkit-overflow-scrolling: touch;
  z-index:99999999;
}

.data-list .data-list__item {
  margin: 0;
  list-style-type: none;
  padding: 0.5rem;
  font-size: 14px;
  display: block;

  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.data-list .data-list__item:hover {
  opacity: 0.5;
  background-color: #ccc;
  color: black;
}

.data-list.data-list__item:selected {
  background: rgba(0, 0, 0, 0.1);
}
</style>
