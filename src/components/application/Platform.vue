<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" white-text @click="$router.go(-1)"
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>Modules manager</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <template v-for="(plat, index) in platforms">
            <v-flex
              xs4
              :key="index"
              @click="downloadModule(plat)"
              v-if="plat.status == 0"
            >
              <v-card class="thumbnail">
                <v-flex xs12 row wrap class="pt-4" style="padding-left:30px;">
                  <v-flex xs8 style="text-align:left;">
                    <h6>{{ plat.name }}</h6>
                    <p v-if="plat.status == 1">Installed</p>
                    <p v-if="plat.status == 0">Download module</p>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      icon
                      large
                      class="primary"
                      color="white"
                      v-if="plat.status == 0"
                      ><v-icon>cloud_download</v-icon></v-btn
                    >
                    <v-btn
                      icon
                      large
                      class="success"
                      color="white"
                      v-if="plat.status == 1"
                      ><v-icon>check</v-icon></v-btn
                    >
                  </v-flex>
                </v-flex>
              </v-card>
            </v-flex>
            <v-flex xs4 :key="index" v-else>
              <v-card class="thumbnail">
                <v-flex xs12 row wrap class="pt-4" style="padding-left:30px;">
                  <v-flex xs8 style="text-align:left;">
                    <h6>{{ plat.name }}</h6>
                    <p v-if="plat.status == 1">Installed</p>
                    <p v-if="plat.status == 0">Download module</p>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      icon
                      large
                      class="primary"
                      color="white"
                      v-if="plat.status == 0"
                      ><v-icon>cloud_download</v-icon></v-btn
                    >
                    <v-btn
                      icon
                      large
                      class="success"
                      color="white"
                      v-if="plat.status == 1"
                      ><v-icon>check</v-icon></v-btn
                    >
                  </v-flex>
                </v-flex>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-dialog v-model="Newdialog" left top persistent width="400px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4">
          Request for module activation
          <v-spacer></v-spacer>
          <v-flex v-if="isAdding">
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular
            >Processing pls...
          </v-flex>
          <v-flex v-else>
            <v-btn @click="Newdialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="addPlatform">Send request</v-btn>
          </v-flex>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-flex xs12 style="text-align:center;">
            <v-flex xs12>
              <v-btn icon large class="primary" color="white"
                ><v-icon>cloud_download</v-icon></v-btn
              >
            </v-flex>
            <v-flex xs12>
              <h4>{{ request.name }}</h4>
              <p>
                Kindly send request to enable this module for your facility.
                Kindly note that it might attract extra cost
              </p>
            </v-flex>
          </v-flex>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Search",
  data: () => ({
    error: "",
    isLoading: false,
    platforms: [],
    Newdialog: false,
    request: [],
    isAdding: false
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet"])
  },
  methods: {
    ...mapActions([
      "setDomain",
      "setSearch",
      "checkStorage",
      "setCode",
      "setToday"
    ]),
    loadItems: function() {
      this.isLoading = true;
      this.get("/platforms")
        .then(response => {
          if (response.status > 0) {
            this.platforms = response.response;
          } else {
            this.$toastr.error(response.message);
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
          this.stillSearching = false;
        });
    },
    downloadModule: function(platform) {
      this.request = platform;
      this.Newdialog = true;
    },
    addPlatform: function() {
      this.isAdding = true;
      var req = {
        outlet: this.outlet.id,
        platform: this.request.code,
        name: this.request.name
      };

      this.postOnline("http://patrec.com.ng/api/v2.0/platform/request/", req)
        .then(resp => {
          if (resp.status > 0) {
            this.get(`/platform/update/${this.request.code}`)
              .then(result => {
                this.isAdding = false;
                this.$toastr.success(
                  "Platform has been downloaded and installed"
                );
                this.loadItems();
              })
              .catch(e => {
                this.$toastr.error(e.message);
                this.isAdding = false;
              });
          } else {
            this.$toastr.error(resp.message);
            this.isAdding = false;
          }
        })
        .catch(e => {
          this.isAdding = false;
          this.$toastr.error(e.message);
        });
    }
  },
  created() {
    this.loadItems();
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
