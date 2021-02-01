<template>
  <div>
    <router-view />
  </div>
</template>
<script>
import { URL, LS, SHA256 } from "../shared/config.js";
import { STATE, LGAS } from "../shared/state.js";
import { mapState, mapActions } from "vuex";
export default {
    props: {
        source: String
    },
    computed: {
        ...mapState(["domain", "outlet", "search", "patients", "patCode", "today"])
    },
    methods: {
        ...mapActions(["setDomain", "setSearch", "checkStorage"]);
    }
}