<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" white-text
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>Access roles manager</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-treeview
            selectable
            selected-color="red"
            :items="menus"
            item-text="title"
            item-key="title"
          ></v-treeview>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { URL, LS, ALPHASTR, IDGenerator } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Search",
  data: () => ({
    loading: false,
    Newdialog: false,
    paginate: [],
    roles: [],
    menus: []
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["platforms"]),
    checkItems() {
      return this.paginate;
    }
  },
  methods: {
    ...mapActions(["checkStorage"]),
    changePage: function(pageItems) {
      this.paginate = pageItems;
    },

    loadRoles: function() {
      this.assignMenus().then(menu => {
        this.menus = menu;
      });
    },
    loadUserRoles: function() {
      this.get("users-access").then(response => {
        if (response.status > 0) {
          this.roles = response.response;
        } else {
          this.$toastr.error(response.message);
        }
        this.stillSearching = false;
      });
    },

    createAccess: function() {
      if (this.user.name == "") {
        this.$toastr.error("Access group name cannot be emptied.");
        return false;
      }
      this.post("/users-access", this.user).then(resp => {
        if (resp.status > 0) {
          this.$toastr.success(resp.message);
          this.loadUsers();
        } else {
          this.$toastr.error(resp.message);
        }
      });
    }
  },
  mounted() {
    this.loadRoles();
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
