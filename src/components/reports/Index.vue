<template>
  <div>
    <router-view />
  </div>
</template>
<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { STATE, LGAS } from "../../shared/state.js";
import { mapState, mapActions } from "vuex";

export default {
  name: "Report",
  data: () => ({}),
  components: {},
  props: {
    source: String
  },
  computed: {
    ...mapState([
      "outlet",
      "search",
      "patients",
      "patCode",
      "today",
      "settings"
    ])
  },
  methods: {
    ...mapActions(["checkStorage"]),
    innitialize: function() {}
  },
  mounted() {
    this.checkStorage();
  }
};
</script>
<style scoped></style>
