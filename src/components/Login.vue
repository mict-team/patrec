<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="person"
                    name="email"
                    v-model="account.email"
                    label="Email"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="lock"
                    name="password"
                    v-model="account.password"
                    label="Password"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn danger align="left" @click="loadSetup"
                  ><v-icon>settings</v-icon>Configure</v-btn
                >
                <v-spacer></v-spacer>

                <v-btn color="primary" @click="doLogin">Login</v-btn>
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
          <v-btn color="primary" flat @click="failed = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="loadingDialog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Authenticating you.
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
import { mapState, mapActions } from "vuex";
import axios from "axios";
import { URL, LS, SHA256 } from "../shared/config.js";
export default {
  data: () => ({
    drawer: null,
    loadingDialog: false,
    account: { email: "", password: "" },
    user: [],
    message: "",
    failed: false
  }),
  computed: {
    ...mapState(["outlet", "domain", "users"])
  },
  props: {
    source: String
  },
  methods: {
    ...mapActions(["addUsers", "getDomain", "checkStorage", "saveStorage"]),
    loadSetup: function() {
      this.$router.push("/setup");
    },
    getSetup: function() {
      //console.log(this.outlet)
      if (this.outlet.length < 1) {
        //this.$router.push("/setup");
      }
      //this.user=LS.get('user')
    },
    doLogin: function(e) {
      e.preventDefault();
      
      if (this.account.email.length > 0 && this.account.password.length > 0) {
        const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var me='';
        if (!mailRegex.test(this.account.email)){
          me=this.account.email+"@unimedth.com";
        }else{
          me=this.account.email;
        }
        //var index=this.account.email.findIndex(x=>x.)
        this.loadingDialog = true;
        var postData={
          outlet: this.outlet,
          email: me,
          password: this.account.password
        };
        //console.log(JSON.stringify(postData))
        //alert(this.users.length)
        if (this.users.length > 0) {
          let userIndex=[];
          var found=false;
          for(var ln of this.users){
            if(ln['email']==me && ln['password']==SHA256(this.account.password)){
              userIndex=ln;
              found=true;
              break;
            }
          }
          //let userIndex = this.users.filter(x => x.email == postData.me && x.password == SHA256(this.account.password));
          //console.log(userIndex)
          if (found) {
            this.loadingDialog = false;
            LS.set("user", userIndex);
            this.$router.push("/home");
          } else {
            this.getUser(postData);
          }
        } else {
          this.getUser(postData);
        }
      }
    },
    getUser: function(data) {
      //alert(this.domain); return false
      axios
        .post(this.domain + "/login", data)
        .then(response => {
          //return server response
          if (response.data.status > 0) {
            this.addUsers(response.data.response, true);
            LS.set("user", response.data.response);
            this.loadingDialog = false;
            this.$router.push("/home");
            // if(this.outlet.app_type.code=='0'){
            //   this.$router.push("/home");
            // }else{
            //   this.$router.push("/sales");
            // }
            
          } else {
            this.loadingDialog = false;
            this.message = response.data.message;
            this.failed = true;
          }
          //console.log(response)
        })
        .catch(e => {
          console.log(e)
          this.message ="Unable to authenticate user. Kindly contact admin for assistance.";
          this.loadingDialog = false;
          this.failed = true;
        });
    }
  },
  mounted() {
    this.checkStorage();
    this.getDomain();
    this.getSetup();
    //console.log(this.users)
    
  }
};
</script>
