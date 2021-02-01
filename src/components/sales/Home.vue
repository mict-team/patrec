<template> </template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "home",
  data: () => ({
    store: [],
    error: "",
    currentSession: [],
    loadingDialog: false,
    elevations: [6, 12, 18],
    departments: []
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet"])
  },
  methods: {
    ...mapActions(["setDomain", "checkStorage"])
  },
  mounted() {
    this.checkStorage();
    this.departments = LS.get("department");
    //alert(JSON.stringify(this.departments));
    switch (this.departments.type) {
      case 2:
        this.$router.push({ name: "pharmacist" });
        break;
      default:
        this.$router.push({ name: "amona" });
        break;
    }
  }
};
</script>

<style scoped></style>
