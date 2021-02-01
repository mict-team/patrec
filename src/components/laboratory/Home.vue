<template>
  <v-container> </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
import Polararea from "../charts/Polararea";
export default {
  name: "Lab",
  data: () => ({
    store: [],
    error: "",
    platform: "",
    testSearchInput: "",
    currentSession: [],
    schedules: [],
    loadingDialog: false,
    type: "line",
    series: [
      {
        values: [43, 23, 54, 54, 39, 47, 38, 59, 39, 49]
      }
    ]
  }),
  props: {
    source: String
  },
  components: {
    Polararea
  },
  computed: {
    ...mapState(["domain", "outlet", "search", "today", "settings"])
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      this.schedules = [];
      this.platform = LS.get("platform");
    },
    searchHandler: function() {}
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
  }
};
</script>

<style scoped></style>
