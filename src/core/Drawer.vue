<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-break-point="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
    </template>

    <v-list dense nav>
      <v-list-item>
        <v-list-item-avatar class="align-self-center" color="white" contain>
          <v-avatar>
            <img src="../assets/logo.png" :alt="outlet.name" />
          </v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title
            class="display-1"
            style="height:35px; padding-top: 10px;"
            v-if="outlet.name && outlet.name != ''"
            v-text="outlet.name"
          />
          <v-list-item-title class="display-1" v-else v-text="profile.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list expand nav>
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />

      <template v-for="(item, i) in getMenus">
        
        <v-layout v-if="item.divider" :key="`group-${i}`" row align-center>
            <v-flex xs12 row class="mt-5 ml-3">
                <strong class="col-md-9">{{item.text}}</strong>
                <span class="col-md-3 " :class="item.icon" v-if="item.icon && !item.action"></span>
                <span class="col-md-3 anchor" :class="item.icon" v-if="item.icon && item.action" @click="handle_function_call(item.action)"></span>
            </v-flex>
        </v-layout>
        <base-item-group
          v-else-if="item.children"
          :key="`group-${i}`"
          :item="item"
        >
          <!--  -->
        </base-item-group>

        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>

    <template v-slot:append>
      <base-click-item
        :item="{
          title: $t('logout'),
          icon: 'mdi-package-up',
          to: '/logout'
        }"
        @logout="logoutDialog = true"
        style="cursor:pointer;"
      />
    </template>
    <v-dialog v-model="logoutDialog" left top persistent width="400px">
      <v-card>
        <v-card-title class=" lighten-4 py-4 title">
          Do you want to logout?
          <v-spacer></v-spacer>
          <v-btn color="red" @click="logout">::Logout::</v-btn>
          <v-btn color="primary" @click="logoutDialog = false"
            >No continue</v-btn
          >
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row>
            <v-flex xs12
              >Would you like to share your experience? Kindly rate us.</v-flex
            >
            <v-flex xs12 class="text-center">
              <v-rating v-model="rating"></v-rating>
            </v-flex>
          </v-layout>
          <hr />
          <v-layout row>
            <v-flex xs2>
              <v-avatar size="50px">
                <img src="../assets/logo.png" :alt="outlet.outlet" />
              </v-avatar>
            </v-flex>
            <v-flex xs10>
              I will be right here waiting for you.
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { URL, LS, APP, SHA256 } from "../shared/config.js";

import { mapState, mapActions } from "vuex";

export default {
  name: "DashboardCoreDrawer",

  props: {
    expandOnHover: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    menus: [],
    logo: "",
    logoutDialog: false,
    rating: 5,
    group:[]
  }),

  computed: {
    ...mapState(["barColor", "barImage", "outlet", "roles"]),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      }
    },
    getMenus() {
      return this.menus;
    },
    profile() {
      return {
        avatar: true,
        title: this.$t("Patrec")
      };
    },
    getGroup(){
      //alert(this.group.structure)
      this.initializeMenus()
      return this.group;
    }
  },
  created() {
    var lg = LS.get("logo");
    if (lg) {
      this.logo = lg;
    } else {
      this.logo = "../assets/logo.png";
    }
  },
  
  methods: {
    ...mapActions([ "checkStorage", "setRegister"]),
    initializeMenus: function() {
      this.platforms = LS.get("platform");
      this.group=LS.get('group');
      //alert(this.group.structure)
      //this.assignMenus().then(menu => {
        //this.menus = menu;
      //});
      if(this.group.structure=='default'){
        this.assignMenus().then(menu => {
          this.menus = menu;
        });
      }else{
        this.assignAutoMenus(LS.get('menus')).then(menu=>{
          //console.log(menu)
          this.menus=menu;
        })
      }
      
    },
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title)
      };
    },
    
    logout: function() {
      var logout = new Promise((resolve, reject) => {
        var user = LS.get("user");
        this.get(`/logout/${user.id}`)
          .then(resp => {
            if (resp.status > 0) {
              resolve(true);
            } else {
              reject(false);
            }
          })
          .catch(e => {
            reject(false);
          });
      });

      logout.then(response => {
        if (response) {
          LS.remove("patient");
          LS.remove("platform");
          LS.remove("user");
          LS.remove("settings");
          LS.remove("home");
          this.setRegister([])
          this.$router.push("/");
        } else {
          alert("Sorry, your logout attempt failed. Pls try again later.");
        }
      });
    }
  },
  mounted(){
    this.checkStorage();
    setTimeout(this.initializeMenus, 200);
  }
};
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px

      +ltr()
        margin-right: 24px
        margin-left: 12px !important

      +rtl()
        margin-left: 24px
        margin-right: 12px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
        padding-left: 8px

      +rtl()
        padding-right: 8px

    .v-list-group__header
      +ltr()
        padding-right: 0

      +rtl()
        padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2

        +ltr()
          margin-right: 8px

        +rtl()
          margin-left: 8px
</style>
