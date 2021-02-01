<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm4 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Open sales register</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <label class="control-label">What is your opening balance</label>
          <input
            type="text"
            class="form-control"
            name="openingBalance"
            v-model="registerDetail.amount"
            placeholder="What is your opening balance"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openRegister" v-if="!processing"
            >Open register</v-btn
          >
          <v-btn disabled="true" v-else>
            <v-progress-circular
              class="pa-4"
              :size="30"
              color="blue"
              indeterminate
            ></v-progress-circular>
          </v-btn>
        </v-card-actions>
        <hr />
        <template v-if="isRegisterOpened">
          <v-card-text>
            Do you still want to continue with sales register opened on
            {{ register.opening_date }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="danger" @click="continueWithRegister"
              >Yes! Continue</v-btn
            >
          </v-card-actions>
        </template>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { URL, LS, IDGenerator, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  data: () => {
    return {
      processing: false,
      registerDetail: {
        amount: ""
      },
      platform_url: ""
    };
  },
  computed: {
    ...mapState(["outlet", "domain", "today", "users", "register", "settings"]),
    isRegister: function() {
      this.checkIfJustLogin();
      return this.registerOpen;
    },
    isRegisterOpened: function() {
      //console.log(this.register);
      return (
        this.register && this.register.code && this.register.code != undefined
      );
    }
  },
  methods: {
    ...mapActions([
      "setDomain",
      "checkStorage",
      "getCode",
      "getToday",
      "setRegister"
    ]),
    loadRegister: function() {
      this.$Progress.start();
      let payload = {
        user: this.users.id,
        action: "loads"
      };
      this.post("/open-register", payload)
        .then(resp => {
          //console.log(resp)
          if (resp.status > 0) {
            this.setRegister(resp.response);
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    openRegister: function() {
      this.$Progress.start();
      this.processing = true;
      this.getCode();
      this.getToday();
      this.registerDetail.outlet = this.outlet.id;
      this.registerDetail.code = this.users.id.toString() + IDGenerator(6);
      this.registerDetail.user = this.users.id;
      this.registerDetail.date = this.today;
      this.registerDetail.action = "save";
      //console.log(this.registerDetail); return false;
      this.setRegister(this.registerDetail);

      this.post("/open-register", this.registerDetail)
        .then(resp => {
          if (resp.status > 0) {
            this.registerDetail.id = resp.response;
            this.setRegister(this.registerDetail);
            this.$router.push({ name: this.platform_url });
          } else {
            alert(
              "Unable to save your sales registered on the cloud. Dont worry, it will synchronice."
            );
          }
        })
        .finally(() => {
          this.processing = false;
          LS.set("justLogin", false);
          this.registerOpen = true;
          this.$Progress.finish();
        });
    },
    continueWithRegister: function() {
      //console.log(this.register)
      LS.set("justLogin", false);
      this.registerOpen = true;
      this.$router.push({ name: this.platform_url });
    }
  },
  mounted() {
    let type = LS.get("pathUrl");
    
    //=this.$route.params.type;
    this.platform_url = type == "account" ? "amona-pos" : "pharm-pos";
    //alert(this.platform_url); 
    if(this.isRegisterOpened){
      this.$router.push({ name: this.platform_url });
    }else{
      this.loadRegister();
    }
    
  }
};
</script>

<style></style>
