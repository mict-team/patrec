<template>
  <div>
    <div class="about">
      <v-row>
        <v-col class="left">
          <div class="about-header">
            <img src="~@/assets/logo.png" class="about-logo" />
          </div>
        </v-col>
        <v-col style="padding-top:160px;">
          <div class="row"><br /><br /></div>
          <div class="row">
            <div class="col right">
              <div v-if="error">
                <div class="alert alert-danger col-md-12">{{ error }}</div>
              </div>
              <div class="form-group">
                <label
                  for="exampleInputEmail1"
                  style="color:#fff; font-size:20px;"
                >
                  <v-icon color="white">mdi-license</v-icon>Facility activation
                  license</label
                >
                <input
                  type="text"
                  class="form-control"
                  name="username"
                  placeholder="Activation license"
                  v-model="license"
                  autocomplete="false"
                />
                <small id="emailHelp" class="form-text text-muted"></small>
              </div>

              <div class="form-group pull-right" style="text-align:right;">
                <div class="rainbow-button-wrapper">
                  <button
                    class="about-button"
                    @click="finistSetup"
                    :disabled="!isLicenseValid"
                    v-if="!isLoading"
                  >
                    Authenticate
                  </button>
                  <button class="about-button" v-else :disabled="true">
                    <v-progress-circular
                      class="pa-4"
                      :size="30"
                      color="blue"
                      indeterminate
                    ></v-progress-circular>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { URL, LS, OS } from "../shared/config.js";
export default {
  name: "Landing",
  data() {
    return {
      isLoading: false,
      license:
        "1d50ccf2db568240e35e23c8894f4eea0c0e7f61e263c6f51a1ccee7c10bb029",
      error: ""
    };
  },
  computed: {
    isLicenseValid() {
      return this.license != "";
    }
  },
  methods: {
    finistSetup: function(e, event) {
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
      let payload = {
        license: btoa(this.license)
      };
      this.isLoading = true;
      this.postOnline("http://mict.local/revenue/licenses/confirm", payload)
        .then(resp => {
          if (resp.status > 0) {
            this.post("/install", { license: resp.response, dir: btoa(dir) })
              .then(result => {
                if (result.status > 0) {
                  this.$router.push({ name: "logins" });
                } else {
                  this.$toastr.error(result.message);
                }
                this.isLoading = false;
              })
              .catch(e => {
                this.$toastr.error(e.message);
                this.isLoading = false;
              });
          }else{
            this.$toastr.error(resp.message)
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    checkItem: function(item) {
      this.detail.platform = item;
    }
  },
  mounted() {}
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
  background-color: #1867c0;
  border-top-left-radius: 20em;
  border-bottom-left-radius: 20em;
  padding-top: 70px;
  padding-left: 50px;
  padding-bottom: 70px;
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
