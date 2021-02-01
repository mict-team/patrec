<template>
  <v-app-bar id="app-bar" absolute app color="transparent" flat height="75">
    <v-btn class="mr-3" elevation="1" fab small @click="setDrawer(!drawer)">
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$options.filters.toTitleCase($route.title)"
    />
     <v-spacer />
    <v-btn color="red" elevation="1" fab small @click="$router.go(-1)">
      <v-icon color="white">keyboard_arrow_left</v-icon>
    </v-btn>
    <v-btn class="mr-3" elevation="1" fab small @click="$router.go()">
      <v-icon>
        mdi-reload
      </v-icon>
    </v-btn>
     
    <v-text-field
      solo-inverted
      hide-details
      prepend-inner-icon="search"
      label="Search for patient"
      class="hidden-sm-and-down"
      style="width: 300px"
      v-model="searchStr"
      @keyup="putSearch"
    ></v-text-field>
    <v-btn
      icon
      large
      title="Search with Finger print"
      @click="fingerdialog = true"
      v-if="
        settings &&
          settings.general &&
          settings.general.allow_fingerprint &&
          settings.general.allow_fingerprint == 1
      "
    >
      <v-icon>fingerprint</v-icon>
    </v-btn>

    <v-spacer />
    <v-btn class="ml-2" min-width="0" text @click="$router.push('/home')">
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
          <v-badge color="red" overlap bordered>
            <template v-slot:badge>
              <span>{{ notifications.length }}</span>
            </template>

            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list :tile="false" nav>
        <div>
          <app-bar-item v-for="(n, i) in notifications" :key="`item-${i}`">
            <v-list-item-title v-text="n" />
          </app-bar-item>
        </div>
      </v-list>
    </v-menu>

    <v-btn class="ml-2" min-width="0" text to="/user-profile">
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <base-network />
  </v-app-bar>
</template>

<script>
// Components
import { VHover, VListItem } from "vuetify/lib";

// Utilities
import { mapState, mapActions, mapMutations } from "vuex";
import { LS } from "../shared/config.js";
export default {
  name: "DashboardCoreAppBar",

  components: {
    AppBarItem: {
      render(h) {
        return h(VHover, {
          scopedSlots: {
            default: ({ hover }) => {
              return h(
                VListItem,
                {
                  attrs: this.$attrs,
                  class: {
                    "black--text": !hover,
                    "white--text secondary elevation-12": hover
                  },
                  props: {
                    activeClass: "",
                    dark: hover,
                    link: true,
                    ...this.$attrs
                  }
                },
                this.$slots.default
              );
            }
          }
        });
      }
    }
  },

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    notifications: [
      "Mike John Responded to your email",
      "You have 5 new tasks",
      "You're now friends with Andrew",
      "Another Notification",
      "Another one"
    ],
    searchStr: "",
  }),

  computed: {
    ...mapState(["drawer", "settings"])
  },

  methods: {
    ...mapActions(["setSearch", "checkStorage"]),
    ...mapMutations({
      setDrawer: "SET_DRAWER"
    }),
    putSearch: function(e) {
      if (e.keyCode === 13 && this.searchStr != "") {
        this.setSearch(this.searchStr);
        this.$router.push("/search");
      }
      //this.setSearch(this.searchStr)
    },
    loadNotification: function() {
      var vm = this;
      var interval = setInterval(function() {
        var user = LS.get("user");
        vm.get(`/notification/${user.id}`).then(resp => {
          vm.notifications = resp.response;
        });
      }, 100000);
    },
  },
  beforeMount() {
    this.checkStorage();
  },
  mounted() {
    this.loadNotification();
  }
};
</script>
