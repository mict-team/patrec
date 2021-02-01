<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" white-text
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>User manager</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn color="primary" @click="$router.push('new-users')">Add user</v-btn>
      <v-btn color="danger" @click="printPage">Print</v-btn>
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4" ref="printMe">
        <table class="table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Code</th>
              <th>Dept</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Last login</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-if="getUsers && getUsers.length > 0">
            <tr v-for="(user, index) in getUsers" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ user.code }}</td>
              <td>{{ user.dept }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.lastLogin }}</td>
              <td>
                <v-chip class="ma-2" color="grey" text-color="white" v-if="user.status == 0">Disabled</v-chip>
                <v-chip class="ma-2" color="green" text-color="white" v-if="user.status == 1">Active</v-chip>
              </td>
              <td>
                <v-chip class="ma-2 no-print" color="blue" text-color="white" @click="resetPassword(user)"><v-icon>mdi-arrow-horizontal-lock</v-icon>Reset pwd</v-chip>
                <v-chip class="ma-2 no-print" color="blue" text-color="white" @click="resetPin(user)"><v-icon>mdi-alphabet-aurebesh</v-icon>Reset Pin</v-chip>
                <template v-if="getUserPrivilege">
                  <v-chip class="ma-2" color="red" text-color="white" @click="disableItem(user, 0)" v-if="user.status == 1">
                    <v-icon left>cancel</v-icon>Disable
                  </v-chip>
                  <v-chip class="ma-2" color="green" text-color="white" @click="disableItem(user, 1)" v-if="user.status == 0">
                    <v-icon left>check</v-icon>Enable
                  </v-chip>
                </template>
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
        </table>
      </v-container>
    </v-card>
    <base-pagination v-if="!loading" :total="userLists.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
  </v-container>
</template>

<script>
import { URL, LS, SHA256, ALPHASTR, IDGenerator } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Search",
  data: () => ({
    loading: false,
    Newdialog: false,
    password: "",
    paginate: [],
    userLists: [],
    department: [],
    page:1,
    group:[],
    //roles:[],
    users:[],
    pageSize:50,
    search: '',
    user: {
      name: "",
      email: "",
      mobile: "",
      username: "",
      password: "",
      dept: ""
    },
    message: ""
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet", "roles"]),//, "group", "roles", "users"
    checkItems() {
      return this.paginate;
    },
    getUsers(){
      return this.userLists.result;
    },
    getUserPrivilege(){
      if(this.group.structure=='facility'){
        return this.roles && this.roles.operational && this.roles.operational.user_can_create_user
      }else{
        return true
      }
    }
  },
  methods: {
    ...mapActions(["setSearch", "checkStorage", "setCode"]),
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search=pageItems.search;
      this.loadUsers();
    },
    printPage: function() {
      this.$print(this.$refs.printMe);
    },
    loadUsers: function() {
      this.$Progress.start();
      this.searchdialog = true;
      let payload={
        search: this.search,
        page:this.page,
        perPage: this.pageSize,
        outlet: this.outlet.id,
        group: this.group.structure,
        dept: this.users.department,
        action:'loads'
      }
      //console.log(payload)
      this.post('users', payload)
      .then(response => {
        if (response.status > 0) {
          this.userLists = response.response;
          //console.log(this.userLists)
        } else {
          this.$toastr.error(response.message);
        }
        this.stillSearching = false;
      })
      .finally(() => {
        //console.log(this.users)
        this.$Progress.finish();
        this.stillSearching = false;
      });
    },
    resetPassword: function(user){

    },
    resetPin: function(user){

    },
    disableItem: function(item, status) {
      this.$Progress.start();
      let payload={
        id: item.id,
        status: status,
        user: this.users.id,
        action: 'status'
      }
      let index=this.userLists.result.findIndex(x=>x.id==item.id);
      if(index>-1){
        this.userLists.result[index].status=status;
      }
      this.post("/users", payload)
      .then(response => {
        if (response.status > 0) {
          this.$toastr.success(response.message)
        }else{
          this.$toastr.error(response.message)
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },
  },
  mounted() {
    this.group=LS.get('group');
    //console.log('Group:', this.group);
    //this.roles=LS.get('roles');
    console.log('Roles: ', this.roles);
    this.users=LS.get('user');
    setTimeout(this.loadUsers, 200);
  }
};
</script>

<style scoped>
  .home-body {
    opacity: 1;
    content: "";
  }
</style>

