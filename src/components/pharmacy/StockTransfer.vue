<template> </template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "Pharmacy",
  data: () => ({
    store: [],
    error: "",
    currentSession: [],
    loadingDialog: false
  }),
  props: {
    source: String
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped></style>
