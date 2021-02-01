<template>
  <div>
    <router-view />
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Laboratory",
  data: () => ({}),
  components: {},
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "search", "patients", "patCode", "today"])
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {}
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
  }
};
</script>
<style scoped>
.child-container {
  width: 100% !important;
  margin: 5px 0px 0px 0px;
  padding: 0px !important;
  background-color: #fff;
}
.right {
  color: blue;
  text-align: right;
}
.header-text {
  font-size: 20px;
  font-weight: bold;
  color: grey;
}
</style>
