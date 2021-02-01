<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" white-text @click="$router.go(-1)"
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>{{ group }} access roles</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="authDialog = true">Save roles</v-btn>
    </v-toolbar>
    <v-toolbar row wrap>
      <v-flex xs3
        ><v-switch
          :value="privileges.privilege.allow_select"
          @change="toggle('privilegesprivilege.allow_select', $event !== null, $event)"
          inset
          label="Allow Select Operation"
        ></v-switch
      ></v-flex>
      <v-flex xs3
        ><v-switch
          :value="true"
          @change="toggle('privilege.allow_insert', $event !== null, $event)"
          inset
          label="Allow Insert Operation"
        ></v-switch
      ></v-flex>
      <v-flex xs3
        ><v-switch
          :value="privileges.privilege.allow_update"
          @change="toggle('privilege.allow_update', $event !== null, $event)"
          inset
          label="Allow Update Operation"
        ></v-switch
      ></v-flex>
      <v-flex xs3
        ><v-switch
          :value="privileges.privilege.allow_delete"
          @change="toggle('privilege.allow_delete', $event !== null, $event)"
          inset
          label="Allow Delete Operation"
        ></v-switch
      ></v-flex>
      <v-flex xs3
        ><v-switch
          :value="privileges.privilege.allow_download"
          @change="toggle('privilege.allow_download', $event !== null, $event)"
          inset
          label="Allow Download Operation"
        ></v-switch
      ></v-flex>
    </v-toolbar>
    <v-toolbar row wrap>
      <v-flex xs3
        ><v-switch
          :value="privileges.operational.user_can_sell"
          @change="toggle('operational.user_can_sell', $event !== null, $event)"
          inset
          label="Can user sell?"
        ></v-switch
      ></v-flex>
      <v-flex xs3
        ><v-switch
          :value="privileges.operational.user_can_authorise"
          @change="toggle('operational.user_can_authorise', $event !== null, $event)"
          inset
          label="Can user authorize?"
        ></v-switch
      ></v-flex>
      <v-flex xs3
        ><v-switch
          :value="privileges.operational.user_can_create_user"
          @change="toggle('operational.user_can_create_user', $event !== null, $event)"
          inset
          label="Can user create user?"
        ></v-switch
      ></v-flex>
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-treeview
            selectable
            open-all
            selected-color="red"
            :items="menus"
            item-text="title"
            item-key="id"
            v-model="selected_items"
            return-object
          ></v-treeview>
        </v-layout>
      </v-container>
    </v-card>
    <v-dialog v-model="authDialog" persistent left top width="410px">
      <v-card>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap align-center>
            <base-authorization @authUser="authUser" @closeAuth="closeAuth" :user="user.id" />
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
    loading: false,
    authDialog: false,
    paginate: [],
    group_id: 0,
    group: "",
    roles: [],
    menus: [],
    user:[],
    selected_items: [],
    privileges: {
      privilege: {
        allow_insert: true,
        allow_update: false,
        allow_select: true,
        allow_delete: false,
        allow_download: false
      },
      operational: {
        user_can_sell: false,
        user_can_authorise: false,
        user_can_create_user: false
      }
    }
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet", "platforms"]),
    checkItems() {
      return this.paginate;
    }
  },
  methods: {
    ...mapActions(["checkStorage"]),
    changePage: function(pageItems) {
      this.paginate = pageItems;
    },

    stringToObj: function(path, value, obj) {
      var parts = path.split("."),
        part;
      var last = parts.pop();
      while ((part = parts.shift())) {
        if (typeof obj[part] != "object") obj[part] = {};
        obj = obj[part]; // update "pointer"
      }
      obj[last] = value;
      //return obj;
    },
    toggle: function(index, value, event) {
      this.stringToObj(index, value, this.privileges);
    },
    
    loadRoles: function() {
      this.assignMenus().then(menu => {
        let parent = [],
          objMenu = [],
          counter = 0;

        menu.forEach(x => {
          if (!x.divider) {
            objMenu.push(x);
          }
        });
        this.menus = objMenu;
      });
    },
    loadUserRoles: function() {
      this.$Progress.start();
      this.get(`/users-access-role/${this.group_id}`)
        .then(response => {
          if (response.status > 0) {
            console.log(response.response)
            //this.menus=response.response.menus
            this.group = response.response.group;
            this.roles = response.response.roles;
          } else {
            this.$toastr.error(response.message);
          }
          this.stillSearching = false;
        })
        .finally(() => {
          if (this.roles.length > 0) {
          }
          this.$Progress.finish();
        });
    },

    assignRoles: function() {
      this.$Progress.start();
      let group_roles = {
        group: this.group_id,
        menus: this.selected_items,
        privilege: this.privileges.privilege,
        operational: this.privileges.operational,
        user: this.user.id
      };
      //console.log(group_roles);return;
      //group_roles.menus=group_roles.menus.sort((a, b) => (a.id > b.id) ? 1 : -1);
      this.post(`/users-access-role/${this.group_id}`, group_roles)
        .then(resp => {
          console.log(resp)
          if (resp.status > 0) {
            this.$toastr.success(resp.message);
          } else {
            this.$toastr.error(resp.message);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    authUser: function(auth) {
      if (auth) {
        this.assignRoles();
        this.authDialog = false;
      }
    },
    closeAuth: function() {
      this.authDialog = false;
    }
  },
  mounted() {
    this.group_id = this.$route.params.id;
    this.user=LS.get('user')
    this.loadRoles();
    this.loadUserRoles();
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
