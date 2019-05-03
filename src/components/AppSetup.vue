<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
          
        <v-layout align-center justify-center>
            <v-flex xs12 md7>
                <v-flex xs11 row wrap>
                    <v-flex
                    v-for="(method, index) in outlet.app_type"
                    :key="index"
                    @click="setupPaypoint(method)"
                    >
                        <v-card class="red thumbnail">
                            <v-container fill-height fluid pa-2>
                                <v-layout fill-height>
                                    <v-flex xs12 align-end flexbox>
                                        <span
                                            class="headline white--text"
                                            v-text="method.name"
                                        ></span>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-flex>
                </v-flex>
            </v-flex>
        </v-layout>

      </v-container>
    </v-content>
    <v-dialog v-model="failed" max-width="500px">
      <v-card>
        <v-card-title>
          Message
        </v-card-title>
        <v-card-text>
          {{ message }}
        </v-card-text>
        <v-card-actions align-right>
          <v-btn color="primary" flat @click="failed = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="loadingDialog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Authenticating paypoint.
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from "axios";
import { URL, LS } from "../shared/config.js";
import { DATA, PAYMENTMETHOD } from "../shared/data.js";
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    drawer: null,
    paypoints: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    hospital: { code: "", paypoint: 1, domain:'' },
    loadingDialog: false,
    failed: false,
    message: ""
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet", "domain"]),
    outletExists: () => {
      return this.outlet.length > 0;
    }
  },
  methods: {
    ...mapActions([
      "addOutlet",
      "addUsers",
      "getDomain",
      "addProduct",
      "addpaymentMethods",
      "checkStorage",
      "saveStorage"
    ]),
    loadLogin: function() {
      this.$router.push("/");
    },
    setupPaypoint: function(item) {
      
      if (this.hospital.code != "") {
        this.loadingDialog = true;
        //console.log(this.outlet)
        var postData={
          outlet: this.outlet,
          app:item
        }
        //console.log(JSON.stringify(postData))
        
        axios
          .post(this.domain + "/getType", postData)
          .then(response => {
            //return server response
            if (response.data.status > 0) {
                this.addOutlet(response.data.response.outlet);
                this.addProduct(response.data.response.product);
                this.addUsers(response.data.response.users, false);
                this.outlet.app_type=item;
                //console.log(this.outlet)
                
                this.message = response.data.message;
                this.loadingDialog = false;
                this.$router.push("/");
            } else {
              this.loadingDialog = false;
              this.failed = true;
              this.message = response.data.message;
            }
            //console.log(response)
          })
          .catch(e => {
            console.log(e)
            this.message = "Error occured while trying to save Paypoint detail";
            this.loadingDialog = false;
            this.failed = true;
          });
      }
    }
  },
  mounted() {
    this.checkStorage();
    this.getDomain();
    //console.log(this.outlet)
    this.hospital.code = this.outlet.code;
    this.hospital.domain = this.domain;
  }
};
</script>
