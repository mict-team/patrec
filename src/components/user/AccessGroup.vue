<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" white-text
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>Access group manager</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn color="primary" @click="Newdialog = true">Add access</v-btn>
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex xs12 ref="printMe">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Group name</th>
                  <th>Mani unit</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <template v-if="loading">
                <v-progress-circular
                  :size="30"
                  color="primary"
                  indeterminate
                ></v-progress-circular
                >Loading pls...
              </template>
              <template v-else>
                <tbody v-if="depts && depts.length > 0">
                  <tr v-for="(dept, index) in depts" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ dept.name }}</td>
                    <td>{{ dept.parent }}</td>
                    <td>
                      <v-chip
                        class="ma-2"
                        color="green"
                        outlined
                        @click="$router.push(`/users/access-roles/${dept.id}`)"
                        >view roles</v-chip
                      >
                    </td>
                    <td>
                      <v-chip
                        class="ma-2"
                        color="red"
                        outlined
                        v-if="user.status == 0"
                        >Disabled</v-chip
                      >
                      <v-chip class="ma-2" color="green" outlined v-else
                        >Enabled</v-chip
                      >
                    </td>
                    <td>
                      <v-chip
                        class="ma-2"
                        color="red"
                        text-color="white"
                        @click="editItem(user)"
                      >
                        <v-icon left>radio_button_checked</v-icon>Edit
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
                <tr v-else>
                  <td colspan="9">
                    <v-flex xs12 style="text-align:center;">
                      <img src="../../assets/addnewitem.svg" />
                    </v-flex>
                  </td>
                </tr>
              </template>
              
            </table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-dialog v-model="Newdialog" left top persistent width="600px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          New group account
          <v-spacer></v-spacer>
          <v-btn @click="Newdialog = false">Cancel</v-btn>
          <v-btn class="primary" @click="createAccess">Create</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 row wrap>
              <v-flex xs12>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Access Name"
                  v-model="user.name"
                />
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-if="group.structure=='default'"
                    v-model="user.parent"
                    :items="depts"
                    item-text="name"
                    item-value="id"
                    label="Select parent dept"
                    dense
                    outlined
                ></v-select>
                <input
                  v-else
                  type="text"
                  class="form-control"
                  placeholder="Access Name"
                  v-model="group.name"
                  readonly
                />
              </v-flex>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { URL, LS, ALPHASTR, IDGenerator } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Search",
  data: () => ({
    loading: true,
    Newdialog: false,
    paginate: [],
    depts:[],
    user: {
      name: "",
      menus: "",
      parent: "",
      user: ""
    },
    menus: []
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet", "group", "users"]),
    checkItems() {
      return this.paginate;
    }
  },
  methods: {
    ...mapActions(["checkStorage"]),
    changePage: function(pageItems) {
      this.paginate = pageItems;
    },

    loadUsers: function() {
      this.loading=true
      this.$Progress.start();
      this.searchdialog = true;
      let url=(this.group.structure=='default')?`users-access`:`users-access/${this.group.id}`;
      
      this.post('users-access', {action:'loads', parent: this.group.id})
      .then(response => {
        if (response.status > 0) {
          this.depts = response.response;
        } else {
          this.$toastr.error(response.message);
        }
      })
      .finally(() => {
        this.loading=false;
        this.stillSearching = false;
        this.$Progress.finish();
      });
    },
    editItem: function(item) {},
    createAccess: function() {
      if (this.user.name == "") {
        this.$toastr.error("Access group name cannot be emptied.");
        return false;
      }
      if(this.group.structure=='facility'){
        this.user.parent=this.group.id;
        this.user.createDept=true;
      }
      this.user.user=this.users.id;
      //console.log(this.user); return;
      this.$Progress.start();
      
      this.user.outlet = this.outlet.id;
      this.post("/users-access", this.user)
        .then(resp => {
          if (resp.status > 0) {
            this.$toastr.success(resp.message);
            this.loadUsers();
          } else {
            this.$toastr.error(resp.message);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    }
  },
  mounted() {
    this.checkStorage();
    setTimeout(this.loadUsers, 100);
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
