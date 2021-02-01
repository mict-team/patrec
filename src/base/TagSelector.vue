<template>
  <div class="theme-material tag-selector" :class="classes">
    <label :for="name">{{ label }}</label>
    <div class="tag-selector--input">
      <div
        class="tag-selector--item"
        v-for="(item, index) in newValue"
        :key="index"
      >
        {{ item }}
        <i class="icon tag-selector--remove" @click="removeTag(index)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
            />
          </svg>
        </i>
      </div>
      <input
        @keyup.enter.prevent="addTag"
        @keyup.188="addTagKey"
        @keyup.8="handleBackspace"
        @:keyup="searchText"
        @:keydown.down.prevent="selectNext()"
        @:keydown.up.prevent="selectPrev()"
        v-model="tag"
        type="text"
        :id="name"
        :name="name"
        class="form-control tag-selector-input"
        :placeholder="placeholder"
      />
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
    </div>
    <p v-if="error" class="validation-message">{{ error }}</p>
  </div>
</template>
<script>
export default {
  name: "vue-tag-selector",
  props: {
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "Kindly type here and press enter"
    },
    name: {
      type: String
    },
    value: {
      type: Array
    },
    classes: {
      type: [String, Array],
      default: ""
    },
    regex: {
      type: RegExp,
      default: () => {
        return /^[\s\S]*$/;
      }
    },
    regexError: {
      type: String,
      default: "Invalid format"
    },
    items: {
      type:[Array, Object],
      default:null
    }
  },
  data() {
    return {
      newValue: Array,
      error: "",
      tag: "",
      backspace_count: 1,
      showAutocompleteDropdown: false,
      searchInput: "",
      itemFilter: [],
      selectedIndex:0
    };
  },
  computed:{
    hasItems: function(){
      return this.items.length>0
    },
    hasElement: function() {
      return this.itemFilter.length > 0;
    }
  },
  methods: {
    handleBackspace() {
      if (this.tag == "") {
        if (this.backspace_count == 0) {
          this.backspace_count++;
        } else {
          this.removeLastTag();
        }
      } else {
        this.backspace_count = 0;
      }
    },
    removeLastTag() {
      let index = this.newValue.length - 1;
      this.removeTag(index);
    },
    removeTag(index) {
      this.newValue.splice(index, 1);
    },
    validate(tag) {
      return this.regex.test(tag);
    },
    addTagKey() {
      let tag = this.tag;
      this.tag = tag.substring(0, tag.length - 1);
      this.addTag();
    },
    addTag() {
      if (this.newValue === undefined) {
        this.newValue = [];
      }
      if (this.tag != "") {
        if (this.validate(this.tag)) {
          this.newValue.push(this.tag);
          this.tag = "";
          this.error = "";
        } else {
          this.error = this.regexError;
          this.tag = "";
        }
      }
    },
    selectNext: function() {
      if (this.showAutocompleteDropdown) {
        if (this.selectedIndex < this.itemFilter.length - 1) {
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
        this.selectedIndex = this.itemFilter.length - 1;
      }
    },
    searchText: function() {
      if(this.hasItems){
        //alert('deji')
        this.showAutocompleteDropdown = true;
        this.itemFilter = this.items.filter(item => {
          return (
            item.name
              .toLowerCase()
              .includes(this.searchInput.toLowerCase())
          );
        });
        //console.log(this.productsFilter)
      }
      
    },
    blurEvent: function() {
      if (!this.searchInput) {
        this.itemFilter = [];
      }
    }
  },
  created() {
    this.newValue = this.value;
  },
  watch: {
    value() {
      this.newValue = this.value;
    },
    newValue() {
      this.$emit("input", this.newValue);
    }
  }
};
</script>
<style lang="scss" scoped>
.theme-material .tag-selector--input {
  border: none;
  border-bottom: 0px dotted #959595;
  margin-bottom: 1.2em;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
}
.theme-material .tag-selector--item {
  background: #e6e6e6;
  color: #434343;
  margin-right: 8px;
  padding-left: 12px;
  border-radius: 32px;
  margin: 0;
  padding: 5;
  user-select: none;
}
.theme-material .tag-selector--item:hover {
  background: #434343;
  color: #fafafa;
}
.theme-material .tag-selector--item:hover .tag-selector--remove {
  color: #fafafa;
}
.theme-material .tag-selector--remove {
  width: 24px;
  height: 24px;
  color: #434343;
  margin: 4px 4px;
}
.theme-material .tag-selector--item,
.theme-material .tag-selector-input {
  height: 32px;
  line-height: 32px;
  margin-bottom: 8px;
  font-size: 14px;
}
.theme-material .validation-message {
  color: #a90014;
}
.data-list {
  position: absolute;
  width: 65% !important;
  max-height: 220px;
  overflow-y: scroll;
  margin-top: -0.8rem;
  background-color: white!important;
  border: 0px solid rgba(0, 0, 0, 0.08);
  padding: 0;
  -webkit-overflow-scrolling: touch;
  z-index:99999999;
}

.data-list__item {
  margin: 0;
  list-style-type: none;
  padding: 0.5rem;
  font-size: 14px;
  display: block;

  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.data-list__item:hover {
  opacity: 0.5;
  background-color: #ccc;
  color: black;
}

.data-list__item:selected {
  background: rgba(0, 0, 0, 0.1);
}
</style>
