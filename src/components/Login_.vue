<template>
  <div>
    <div class="about">
      <v-row>
        <v-col class="left">
          <div class="about-header">
            <img :src="getLogo" class="about-logo" />
            <div class="col">
              <h1>{{getName}}</h1>
              <h5>{{getAddress}}</h5>
            </div>
          </div>
        </v-col>
        <v-col style="padding-top:100px;">
          <div class="row"><br /><br /></div>
          <div class="row">
            <div class="col right">
              <form class="form-horizontal">
                <div v-if="error">
                  <div class="alert alert-danger col-md-12">{{ error }}</div>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1"></label>
                  <input
                    type="text"
                    class="form-control"
                    name="username"
                    placeholder="Email"
                    v-model="username"
                    autocomplete="false"
                    @keyup="checkSeupKeys"
                  />
                  <small id="emailHelp" class="form-text text-muted"></small>
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword"></label>
                  <input
                    type="password"
                    class="form-control"
                    name="password"
                    placeholder="Password"
                    v-model="password"
                  />
                  <small id="passwordHelp" class="form-text text-muted"></small>
                </div>
                <div class="form-group pull-right">
                  <div class="rainbow-button-wrapper">
                    <button class="about-button" @click="doLogin">Login</button>
                  </div>
                </div>

                <br /><br /><br /><br />
                <div class="form-group pull-right" style="display:none;">
                  <div class="rainbow-button-wrapper">
                    <button class="about-button" @click="setupApp">
                      Setup app
                    </button>
                  </div>
                  <div class="rainbow-button-wrapper">
                    <button class="about-button" @click="closeWindow">
                      Exit
                    </button>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                </div>
              </form>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="loadingDialog" hide-overlay persistent width="300px">
      <v-card color="primary" dark>
        <v-card-text>
          Authenticating your account. Please wait.
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="setupAuth" hide-overlay persistent width="300px">
      <v-card>
        <v-card-text>
          <div class="form-group">
            <label>Enter the default password.</label>
            <input
              type="password"
              class="form-control"
              name="password"
              placeholder="Password"
              v-model="defaultPwd"
            />
          </div>
        </v-card-text>
      </v-card>
      <v-toolbar row wrap>
        <v-spacer></v-spacer>
        <v-btn class="primary" @click="setupApp">Authorize</v-btn >
      </v-toolbar>
    </v-dialog>
  </div>
    
</template>

<script>
//import helper from "../shared/mixin.js";
import { LS, ValidateEmail, OS } from "../shared/config.js";
import { mapState, mapActions } from "vuex";
var FileSaver = require("file-saver");

export default {
  data: () => ({
    store: [],
    username: "",
    password: "",
    defaultPwd:'',
    error: "",
    currentSession: [],
    loadingDialog: false,
    setupAuth: false
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet", "domain"]),
    isEmpty: function() {
      return !Object.keys(this.outlet).length;
    },
    getLogo(){
      return (this.outlet.logo)?`${this.outlet.resourceDomain}/${this.outlet.logo}`:'~@/assets/logo.png';
    },
    getName(){
      return (this.outlet.name)?`${this.outlet.name}`:'';
    },
    getAddress(){
      return (this.outlet.address)?`${this.outlet.address}`:'';
    }
  },
  methods: {
    ...mapActions(["setDomain", "setOutlet", "checkStorage", "saveToStorage"]),
    checkSeupKeys: function(args){
      args.preventDefault();
      if(args.keyCode==13){
        if(this.username.toLowerCase()=='activate settings'){
          alert(this.username)
          this.$router.push({ name: "landing" });
          //this.setupAuth=true;
        }
      }
    },
    setupApp: function() {
      if(this.defaultPwd=='Moduroti27@'){
        this.setupAuth=false;
        this.$router.push({ name: "landing" });
      }
    },
    checkIfSetup: function() {
      try {
        console.log(spawn);
        const ls = spawn("ls", ["-la"]);

        ls.stdout.on("data", data => {
          console.log(`stdout: ${data}`);
        });
      } catch (e) {
        console.log(e.message);
        this.$toastr.error(e.message);
      }
      /*try {
            var isFileSaverSupported = !!new Blob;
            var blob = new Blob(["Hello, world!", "Deji is my name"], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "helloworld.txt");
            //this.$router.push({name: 'landing'});
        } catch (e){
          this.$toastr.error(e.message)
        }*/
    },
    loadOutlet: function() {
      var dir = "";
      var os = OS();
      if (os == "Mac") {
        dir = "/Library/Patrec";
      } else if (os == "Windows") {
        dir = "System32/Patrec";
      } else if (os == "Linux") {
        dir = "/Patrec";
      } else {
        this.$toastr.error(
          "Sorry this version of Operating System is not supported."
        );
        return false;
      }

      this.post("/install/get", { dir: btoa(dir) })
        .then(resp => {
          if (resp.status > 0) {
            this.setOutlet(resp.response);
          } else {
            this.$router.push({ name: "landing" });
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },

    doLogin: function(e) {
      e.preventDefault();
      if(this.username.toLowerCase()=='activate settings'){
       this.$router.push({ name: "landing" });
        return;
      }
      if (this.usersname != "" && this.password != "") {
        this.loadingDialog = true;
        this.$Progress.start();
        var email = ValidateEmail(this.username);
        this.username += !email ? "@patrec.com.ng" : "";
        var postData = {
          //outlet: this.outlet.id,
          username: this.username,
          password: this.password
        };
        this.post("/login", postData)
          .then(response => {
            this.loadingDialog = false;
            if (response.status > 0) {
              LS.set("checkLogin", true);
              LS.set("user", response.response);
              this.$router.push("/configure-app");
            } else {
              this.error = response.message;
              this.failed = true;
            }
          })
          .catch(e => {
            this.message = e.message;
            this.loadingDialog = false;
            this.failed = true;
            this.$Progress.fail();
          });
      } else {
        this.error = "Invalid user inputs";
        this.failed = true;
      }
    },

    closeWindow() {
      window.close();
    },
    setupApp: function() {
      this.$router.push({ name: "landing" });
    }
  },
  beforeMounted() {
    this.saveToStorage();
    this.setDomain();
  },
  mounted() {
    this.checkStorage();
    this.loadOutlet();

    //this.checkIfSetup();
    //console.log(this.outlet)
  }
};
</script>
<style scoped>
.about {
  --about-space: 4rem;
  display: flex;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 9999;
  background-image: url("../assets/sky-white-opacity.png");
  background-position: bottom;
  background-color: #fff;
  max-width: 95% !important;
  min-height: 617px;
  pointer-events: inherit;
  visibility: visible;
  opacity: 1;
  transform: scale(1.1);
  transition: visibility 0s 0.12s linear, opacity 0.12s ease-in,
    transform 0.12s ease-in;
}

.about .left {
  background-color: transparent;
  padding-top: 100px;
}
.about .right {
  background-color: rgb(24, 102, 191);
  border-top-left-radius: 20em;
  border-bottom-left-radius: 20em;
  padding-top: 120px;
  padding-left: 50px;
}
.about-header {
  /*padding: var(--about-space) 0;*/
  border-bottom: 0px solid hsl(0, 0%, 88%);
  padding-top: -120px !important;
  margin-left: 7rem !important;
}

.about-logo {
  display: block;
  margin: 0 auto;
  width: 260px;
}

.about h2 {
  text-align: left;
  margin: 0 0 1em 0;
  font-size: 1.5em;
  color: hsl(0, 0%, 55%);
}

.about .about-code h2 {
  color: hsl(330, 65%, 55%);
}

.about .play-along h2 {
  color: hsl(222, 53%, 50%);
}

.about-button {
  display: block;
  margin: 0 auto;
  padding: 0.4em 1.2em;
  font: inherit;
  font-size: 1.6em;
  color: inherit;
  border: 2px solid;
  border-radius: 4px;
  background-color: transparent;
}
.about-button:focus {
  outline: none;
  border-color: hsl(0, 0%, 88%);
}

.footer.about-section {
  text-align: center;
}

.rainbow-button-wrapper {
  --rainbow-button-width: 170px;
  --rainbow-button-height: 50px;
  --rainbow-button-width-inner: 164px;
  --rainbow-button-height-inner: 44px;
  --rainbow-color-1: hsl(116, 30%, 36%);
  --rainbow-color-2: hsl(194, 60%, 36%);
  --rainbow-color-3: hsl(222, 53%, 50%);
  --rainbow-color-4: hsl(285, 47%, 46%);
  --rainbow-color-5: hsl(330, 65%, 48%);
  --rainbow-color-6: hsl(32, 79%, 49%);
  --rainbow-color-7: hsl(53, 84%, 50%);

  display: inline-block;
  width: var(--rainbow-button-width);
  height: var(--rainbow-button-height);
  position: relative;
  overflow: hidden;
  border-radius: 5px;
}

.rainbow-button-wrapper:before {
  display: block;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 600px;
  height: var(--rainbow-button-height);
  background: #ccc;
  background: linear-gradient(
    to right,
    var(--rainbow-color-1) 0%,
    var(--rainbow-color-2) 14%,
    var(--rainbow-color-3) 28%,
    var(--rainbow-color-4) 42%,
    var(--rainbow-color-5) 56%,
    var(--rainbow-color-6) 70%,
    var(--rainbow-color-7) 84%,
    var(--rainbow-color-1) 100%
  );
  background-position: -200px 0;
  transition: all 0.5s;
  content: "";
}

.rainbow-button-wrapper button {
  display: block;
  width: var(--rainbow-button-width-inner);
  height: var(--rainbow-button-height-inner);
  position: absolute;
  z-index: 3;
  top: 3px;
  left: 3px;
  border: none;
  background: white;
  color: black;
  font-size: 1.3rem;
}

.rainbow-button-wrapper:hover:before {
  background-position: 200px 0;
}
</style>
