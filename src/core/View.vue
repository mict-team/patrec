<template>
  <v-content>
    <router-view class="app-content" />

    <dashboard-core-footer />
  </v-content>
</template>

<script>
export default {
  name: "DashboardCoreView",

  components: {
    DashboardCoreFooter: () => import("./Footer")
  }
};
</script>