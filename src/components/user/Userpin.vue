<template>
  <v-container>
    <v-row>
      <v-col col="12" md="3"></v-col>
      <v-col col="12" md="6">
        <v-toolbar row wrap>
          <v-toolbar-title>User pin<br>
            <div class="subtitle-1 font-weight-light" v-if="defaultPin">
            Complete your account registration
          </div>
          <div class="subtitle-1 font-weight-light" v-else>
            Change your authentication pin
          </div>
          </v-toolbar-title>
          
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card row wrap id="printMe">
          <v-container class="py-0">
            <v-row>
              <v-col cols="12" md="12" :disabled="workingarea" v-if="!defaultPin">
                <label>Change your authentication pin</label>
                <base-authorization
                  :auth="true"
                  :close="false"
                  :user="user.id"
                  msg="Validating pin code"
                  @authUser="validatePin"
                />
                <div class="alert alert-success" v-if="validpin">
                  User authentication pin valid.
                </div>
                <div
                  class="alert alert-danger"
                  v-if="userPin != '' && !validpin"
                >
                  Still the same old/default authentication pin. Pls change
                  it.
                </div>
              </v-col>
              <v-col cols="12" md="12" :disabled="workingarea" v-else>
                <template>
                  <label>Create authentication pin</label>
                  <base-authorization
                    :auth="false"
                    :close="false"
                    :clearInput="false"
                    :user="user.id"
                    msg="Validating pin code"
                    @authUser="createPin"
                  />
                </template>
                <template v-if="getValidPin">
                  <label>Confirm your authentication pin</label>
                  <base-authorization
                    :auth="false"
                    :close="false"
                    :confirm="true"
                    :clearInput="false"
                    msg="Matching pin code"
                    @authUser="confirmPin"
                    :readonly="!getValidPin"
                  />
                </template>
                
                <div class="alert alert-success" v-if="getPinConfirmed">
                  User Authentication Pin matches.
                </div>
                <div class="alert alert-danger" v-if="!getPinConfirmed && confirmError!=''">
                  {{confirmError}}
                </div>
              </v-col>

              <v-col cols="12" class="text-right">
                <v-btn v-if="!defaultPin" @click="navigateUser">Back</v-btn>
                <v-btn v-else @click="logout">Logout</v-btn>
                <v-btn
                  class="primary mr-0 blue"
                  :disabled="!getPinConfirmed"
                  @click="updateUserPin"
                >
                  Update authorization pin
                </v-btn>
                
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  //
  name: "User",

  data: () => ({
    user: [],
    userPin: "",
    auth:'',
    confirmUserPin:"",
    confirmError:"",
    validpin: false,
    workingarea: false,
    defaultPin: false,
    pinConfirmed: false
  }),
  computed: {
    ...mapState(["domain", "outlet", "search", "patients", "patCode", "today"]),
    getValidPin(){
      return this.validpin ;
    },
    getPinConfirmed(){
      return this.pinConfirmed;
    }
  },
  methods: {
    ...mapActions(["setUser", "setSearch", "checkStorage"]),
    
    loadDetail: function() {
      this.user = LS.get("user");
      this.auth = SHA256("000000");
      //alert(this.user.user_pin)
      if (!this.user.user_pin || this.user.user_pin == this.auth) {
        this.defaultPin=true;
      }
    },

    validatePin: function(resp){
      if(!resp.auth){
        this.confirmError="Invalid User Authentication PIN. Kindly confirm your old PIN to proceed."
      }else{
        this.defaultPin=true;
      }
    },

    createPin: function(resp) {
      if (resp.auth) {
        this.userPin = resp.pin;
        this.validpin = true;
      } else {
        this.validpin = false;
        if (this.user.user_pin == null || this.user.user_pin == this.auth) {
          this.confirmError="You cannot use default User Authentication Pin. Kindly change it."
        }else{
          this.confirmError="User Authentication Pin matches your most recent PIN. Pls try another PIN."
        }
      }
    },

    confirmPin: function(resp) {
      if(this.userPin ==resp.pin){
        this.pinConfirmed=true;
      }else{
        this.confirmError="PIN not match";
      }
    },

    updateUserPin: function() {
      this.$Progress.start();
      this.post("/users", {
        action: "pin",
        user: this.user.id,
        pin: this.userPin
      }).then(resp => {
        if (resp.status > 0) {
          this.$toastr.success(resp.message);
          this.user.user_pin = SHA256(this.userPin);
          LS.set("user", this.user);
          this.setUser(this.user);
          this.workingarea = true;
          this.navigateUser();
        } else {
          this.$toastr.error(resp.message);
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    navigateUser: function(){
      let menus=LS.get('menus');
      let homeFixed=false;
      let searchFixed=false;
      if(menus){
        menus.forEach(element => {
          //alert(element.title)
          if (element.hasOwnProperty("title") && element.title=='Overview' && !homeFixed) {
            LS.set("home", element.home);
            this.$route.meta.page=element.home;
            homeFixed=true;
            this.$router.push(element.url);
          } 
          if (element.hasOwnProperty("searchPath") && !searchFixed) {
            LS.set("searchPath", element.searchPath);
            searchFixed=true;
          }
        });
      }else{
        this.$router.push('/app');
      }
    },
    logout: function() {
      var logout = new Promise((resolve, reject) => {
        
        this.get(`/logout/${this.user.id}`)
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
  mounted() {
    this.checkStorage();
    
    this.loadDetail();
  }
};
</script>
<style scoped>
.primary{
  background-color: rgb(24, 102, 191);
}
</style>