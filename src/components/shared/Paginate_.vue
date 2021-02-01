<template>
  <div class="row pagerbox">
    <div class="column counter">
      showing {{ pageSize * pager.currentPage - pageSize + 1 }} to
      {{ pageSize * pager.currentPage }} of
      {{ items.length > 0 ? items.length : 0 }} records
    </div>
    <div class="column search">
      <input
        type="text"
        class="form-control"
        v-model="searchString"
        placeholder="Filter item"
        @keyup="searchItem"
      />
    </div>
    <div class="column labels">
      <ul
        v-if="pager.pages && pager.pages.length"
        class="pagination"
        :style="ulStyles"
      >
        <li
          class="page-item first"
          :class="{ disabled: pager.currentPage === 1 }"
          :style="liStyles"
        >
          <a class="page-link" @click="setPage(1)" :style="aStyles">{{
            labels.first
          }}</a>
        </li>
        <li
          class="page-item previous"
          :class="{ disabled: pager.currentPage === 1 }"
          :style="liStyles"
        >
          <a
            class="page-link"
            @click="setPage(pager.currentPage - 1)"
            :style="aStyles"
            >{{ labels.previous }}</a
          >
        </li>
        <li
          v-for="page in pager.pages"
          :key="page"
          class="page-item page-number"
          :class="{ active: pager.currentPage === page }"
          :style="liStyles"
        >
          <a class="page-link" @click="setPage(page)" :style="aStyles">{{
            page
          }}</a>
        </li>
        <li
          class="page-item next"
          :class="{ disabled: pager.currentPage === pager.totalPages }"
          :style="liStyles"
        >
          <a
            class="page-link"
            @click="setPage(pager.currentPage + 1)"
            :style="aStyles"
            >{{ labels.next }}</a
          >
        </li>
        <li
          class="page-item last"
          :class="{ disabled: pager.currentPage === pager.totalPages }"
          :style="liStyles"
        >
          <a
            class="page-link"
            @click="setPage(pager.totalPages)"
            :style="aStyles"
            >{{ labels.last }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import paginate from "jw-paginate";

const defaultLabels = {
  first: "First",
  last: "Last",
  previous: "Previous",
  next: "Next"
};

const defaultStyles = {
  ul: {
    margin: 0,
    padding: 0,
    display: "inline-block"
  },
  li: {
    listStyle: "none",
    display: "inline",
    textAlign: "center"
  },
  a: {
    cursor: "pointer",
    padding: "6px 12px",
    display: "block",
    float: "left"
  }
};

export default {
  props: {
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
    labels: {
      type: Object,
      default: () => defaultLabels
    },
    styles: {
      type: Object
    },
    disableDefaultStyles: {
      type: Boolean,
      default: false
    },
    searchKey: {
      type: String
    }
  },
  data() {
    return {
      pager: {},
      ulStyles: {},
      liStyles: {},
      aStyles: {},
      searchString: ""
    };
  },

  mounted() {
    if (!this.$listeners.changePage) {
      throw 'Missing required event listener: "changePage"';
    }

    // set default styles unless disabled
    if (!this.disableDefaultStyles) {
      this.ulStyles = defaultStyles.ul;
      this.liStyles = defaultStyles.li;
      this.aStyles = defaultStyles.a;
    }

    // merge custom styles with default styles
    if (this.styles) {
      this.ulStyles = { ...this.ulStyles, ...this.styles.ul };
      this.liStyles = { ...this.liStyles, ...this.styles.li };
      this.aStyles = { ...this.aStyles, ...this.styles.a };
    }

    // set page if items array isn't empty

    if (this.items && this.items.length) {
      this.setPage(this.initialPage);
    }
  },
  methods: {
    setPage(page) {
      const { items, pageSize, maxPages } = this;

      // get new pager object for specified page
      const pager = paginate(items.length, page, pageSize, maxPages);

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
        this.$emit("changePage", filtered);
      } else {
        this.setPage(this.initialPage);
      }
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
