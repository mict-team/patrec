<template>
  <v-app>
    <dashboard-core-app-bar />

    <dashboard-core-drawer />

    <dashboard-core-view />

    <dashboard-core-chat />
  </v-app>
</template>

<script>
import { LS } from "../shared/config.js";
export default {
  name: "DashboardIndex",

  components: {
    DashboardCoreAppBar: () => import("../core/AppBar"),
    DashboardCoreDrawer: () => import("../core/Drawer"),
    DashboardCoreSettings: () => import("../core/Settings"),
    DashboardCoreChat: () => import("../core/Chat"),
    DashboardCoreView: () => import("../core/View")
  },

  data: () => ({
    expandOnHover: false
  })
};
</script>
