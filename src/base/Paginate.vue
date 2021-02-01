<template>
  <div class="text-center">
    <v-row>
      <v-col cols="3">
        <label
          >showing {{ pageSize * pager.currentPage - pageSize + 1 }} to
          {{ pageSize * pager.currentPage }} of
          {{ items.length > 0 ? items.length : 0 }}</label
        >
      </v-col>
      <v-col cols="3">
        <input
          type="text"
          class="form-control"
          v-model="searchString"
          placeholder="Filter item"
          @keyup="searchItem"
        />
      </v-col>
      <v-col cols="1">
        <v-btn class="danger" fab small title="All records" @click="allPage"
          ><v-icon color="white">mdi-cellphone-screenshot</v-icon></v-btn
        >
      </v-col>
      <v-col cols="auto">
        <v-spacer></v-spacer>
        <v-pagination
          v-model="page"
          :circle="circle"
          :disabled="disabled"
          :length="lengths"
          :next-icon="nextIcon"
          :prev-icon="prevIcon"
          :all-icon="allIcon"
          :page="page"
          :total-visible="totalVisible"
          @input="setPage"
        ></v-pagination>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import paginate from "jw-paginate";
export default {
  props: {
    useUrl: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ""
    },
    items: {
      type: Array,
      required: true
    },
    initialPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    maxPages: {
      type: Number,
      default: 10
    },

    searchKey: {
      type: String
    }
  },
  data() {
    return {
      pager: {},
      searchString: "",
      circle: false,
      disabled: false,
      lengths: 10,
      nextIcon: "navigate_next",
      nextIcons: ["mdi-chevron-right", "mdi-arrow-right", "mdi-menu-right"],
      prevIcon: "navigate_before",
      prevIcons: ["mdi-chevron-left", "mdi-arrow-left", "mdi-menu-left"],
      allIcon: "mdi-cellphone-screenshot",
      allIcons: ["mdi-cellphone-screenshot"],
      page: 1,
      totalVisible: 5
    };
  },

  mounted() {
    if (!this.$listeners.changePage) {
      throw 'Missing required event listener: "changePage"';
    }
    //console.log(this.items.length)
    // set page if items array isn't empty

    if (this.items && this.items.length > 0) {
      this.setPage();
    }

    this.lengths = Math.ceil(this.items.length / this.pageSize);
  },
  methods: {
    loadUrl: () => {
      this.post(url, {})
        .then(resp => {
          if (resp.status > 0) {
            this.items = resp.response.items;
          }
        })
        .finally(() => {});
    },
    setPage() {
      const { items, pageSize, maxPages } = this;

      // get new pager object for specified page
      const pager = paginate(items.length, this.page, pageSize, maxPages);

      // get new page of items from items array
      const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

      // update pager
      this.pager = pager;
      //console.log(JSON.stringify(pageOfItems))
      // emit change page event to parent component
      this.$emit("changePage", pageOfItems);
    },
    searchItem() {
      if (this.searchString != "") {
        var filtered = this.items.filter(item => {
          return item.name
            .toLowerCase()
            .includes(this.searchString.toLowerCase());
        });
        console.log(filtered);
        this.$emit("changePage", filtered);
      } else {
        this.setPage();
      }
    },
    allPage() {
      this.$emit("changePage", this.items);
    }
  }
};
</script>
<style>
.pagerbox {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
/* Create two unequal columns that floats next to each other */
.column {
  float: left;
}
.counter {
  width: 20%;
}
.search {
  width: 20%;
}

.labels {
  width: 60%;
  text-align: right !important;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>
