<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>System setup</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="home"
                    name="hospital"
                    v-model="hospital.code"
                    label="Hospital number"
                    type="text"
                  ></v-text-field>
                  <v-select
                    v-model="hospital.paypoint"
                    :items="paypoints"
                    item-text="paypoint"
                    item-value="id"
                    :rules="[v => !!v || 'Paypoint is required']"
                    label="Paypoint number"
                    prepend-icon="keyboard"
                    required
                  ></v-select>
                  <v-text-field
                    prepend-icon="home"
                    name="domain"
                    v-model="hospital.domain"
                    label="Server domain"
                    type="text"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="red"
                  align="left"
                  @click="loadLogin"
                  v-if="this.outlet.length > 0"
                  ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="setupPaypoint">Setup</v-btn>
              </v-card-actions>
            </v-card>
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
          <v-btn color="primary" @click="failed = false">Close</v-btn>
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
import { URL, LS } from "../shared/config.js";
import { DATA, PAYMENTMETHOD } from "../shared/data.js";
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    drawer: null,
    paypoints: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    hospital: { code: "", paypoint: 1, domain: "" },
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
      "addpaymentMethods",
      "getDomain",
      "checkStorage",
      "saveStorage"
    ]),
    loadLogin: function() {
      this.$router.push("/");
    },
    setupPaypoint: function(e) {
      e.preventDefault();
      if (this.hospital.code != "") {
        this.loadingDialog = true;
        let formData = new FormData();
        formData.append("code", this.hospital.code);
        formData.append("paypoint", this.hospital.paypoint);
        formData.append("url", this.hospital.domain);
        var postData = {
          code: this.hospital.code,
          paypoint: this.hospital.paypoint,
          url: this.hospital.domain
        };
        //console.log(JSON.stringify(postData))

        this.post("/auth", postData)
          .then(response => {
            //return server response
            if (response.status > 0) {
              this.addOutlet(response.response.outlet);
              this.addpaymentMethods(response.response.method);
              this.message = response.message;
              this.loadingDialog = false;
              this.$router.push("/app-setup");
            } else {
              this.loadingDialog = false;
              this.failed = true;
              this.message = response.message;
            }
            console.log(response);
          })
          .catch(e => {
            //console.log(e)
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
    this.hospital.paypoint = this.outlet.paypoint || this.hospital.paypoint;
    this.hospital.domain = this.domain;
  }
};
</script>
