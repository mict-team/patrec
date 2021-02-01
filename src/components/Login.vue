<template>
    <div class="body">
      <div class="left">
        <div class="triangle"></div>
        <div class="form-horizontal">
          <div class="form-group">
            <label>Email address</label>
            <input
              type="text"
              class="form-control"
              name="username"
              placeholder="Email"
              v-model="username"
              autocomplete="false"
              @keypress="checkSeupKeys"
            />
            <small id="emailHelp" class="form-text text-muted"></small>
          </div>
          <div class="form-group">
            <label>Password</label>
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
          
        </div>
      </div>
      <div class="body-info">
        <img src="~@/assets/logo.png" class="logo" />
        <h3>Patrec EHR</h3>
        <p>patrec.com.ng</p>
        <p>By proceeding, you agree to Patrec Terms and Privacy Policy.</p>
      </div>
      <div class="footer">

      </div>
      <v-dialog v-model="setupAuth" hide-overlay persistent width="300">
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
import { URL, LS, SHA256, ValidateEmail, OS } from "../shared/config.js";
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
    isSetupActivated(){
      return false;
    }
  },
  methods: {
    ...mapActions(["setDomain", "setOutlet", "checkStorage", "saveToStorage"]),
    checkSeupKeys: function(args){
      alert(args.key)
      if(this.username=='Activate settings'){
        alert(this.username)
        this.setupAuth=true;

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
      this.setupAuth=true;
      return false;
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
    .body{
      background-color:rgb(174, 179, 184);
      color: #000;
      min-height: 40.3em;
    }
    .left{
      width: 65%;
      background-color: #fff;
      min-height: 35.3em;
      z-index:-9999;
    }
    .triangle{
      width: 0;
      height: 0;
      background: rgb(174, 179, 184);
      border-style: solid;
      margin-top: -12px;
      border-width: 300px 0 300px 200px;
      border-color: transparent transparent transparent #fff;
      position: relative;
      left:80%;
      border-style: inset 0 0 4vmin 3vmin rgba(0,0,0,0.5);
      z-index:99;
    }
    .body-info{
      position: absolute;
      top: 0;
      left: 67%;
      padding-top: 8%;
      text-align: center;
      color: #fff;
    }
    .logo{
      width: 50%;
      height:70%;
    }
    .footer{
      height: 2.8em; 
      background: green;
      box-shadow: 0 0 .25em .25em rgba(0, 0, 0, 0.25);
      z-index:9999999 !important;
    }
    .form-horizontal{
      width: 30%;
      position: absolute;
      top:12em;
      left: 12em;
      text-align: left;
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
