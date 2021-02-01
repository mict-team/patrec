<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Edit Profile
            </div>

            <div class="subtitle-1 font-weight-light">
              Complete your profile
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12" md="4">
                  <select class="form-control" v-model="user.title">
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Dr">Dr</option>
                    <option value="Nur">Nur</option>
                    <option value="Pharm">Pharm</option>
                    <option value="Chief">Chief</option>
                    <option value="HRM">HRM</option>
                  </select>
                </v-col>

                <v-col cols="12" md="4">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Email address"
                    v-model="user.email"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Mobile number"
                    v-model="user.phone"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Designation"
                    v-model="user.designation"
                  />
                </v-col>

                <v-col cols="12" md="8">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Names"
                    v-model="user.name"
                  />
                </v-col>

                <v-col cols="12">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Contact address"
                    v-model="user.address"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="City"
                    v-model="user.city"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="State/region"
                    v-model="user.state"
                  />
                </v-col>

                <v-col cols="12" md="">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Country"
                    v-model="user.country"
                  />
                </v-col>

                <v-col cols="12">
                  <textarea
                    class="form-control"
                    placeholder="About Me"
                    v-model="user.about"
                  ></textarea>
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn
                    color="primary"
                    class="mr-0"
                    @click="authDialog = true"
                  >
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <v-col cols="12" md="4">
        <base-material-card class="v-card-profile" :avatar="getPicture">
          <base-image-input
            v-model="avatar"
            style="text-align:center; font-size:12px; font-style:italic; color:red; cursor:pointer; margin-top:-10px !important;"
          >
            <div slot="activator">
              <label>Change passport?</label>
            </div>
          </base-image-input>
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text">
              {{ user.designation | toTitleCase }}
            </h6>

            <h1
              class="display-2 font-weight-light mb-3 black--text"
              style="font-size:22px !important;"
            >
              {{ user.name | toTitleCase }}
            </h1>

            <p class="font-weight-light grey--text">
              {{ user.about }}
            </p>

            <v-btn
              color="primary"
              rounded
              class="mr-0"
              @click="loginDialog = true"
            >
              Update Login
            </v-btn>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
    <v-dialog v-model="authDialog" persistent left top width="410px">
      <v-card>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap align-center>
            <base-authorization @authUser="authUser" @closeAuth="closeAuth" />
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="loginDialog" persistent left top width="400px">
      <v-card>
        <v-container grid-list-sm class="pa-4">
          <h5>Login details</h5>
          <v-divider></v-divider>
          <v-layout row wrap align-center>
            <v-col cols="12">
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                v-model="login.password"
              />
            </v-col>

            <v-col cols="12">
              <input
                type="password"
                class="form-control"
                placeholder="Auth pin"
                v-model="login.authPin"
              />
            </v-col>

            <v-col cols="12" class="text-right">
              <v-spacer></v-spacer>
              <v-btn @click="loginDialog = false">Close</v-btn>
              <v-btn color="primary" class="mr-0" @click="authDialog = true">
                Update
              </v-btn>
            </v-col>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
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
    login: {
      password: "",
      authPin: ""
    },
    authDialog: false,
    loginDialog: false,
    avatar: null,
    saved: false,
    showUpload: false
  }),
  watch: {
    avatar: {
      handler: function() {
        this.user.passport = this.avatar.base64;
      },
      deep: true
    }
  },
  computed: {
    ...mapState(["domain", "outlet", "search", "patients", "patCode", "today"]),
    getPicture: function(){
      return(this.user.passport)?`${this.outlet.resourceDomain}/${this.user.passport}`:'../../assets/user.png';
    },
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    loadDetail: function() {
      this.$Progress.start()
      var user = LS.get("user");
      console.log(user)
      this.get(`/users/user/${user.id}`)
      .then(resp => {
        this.user = resp.response;
        this.user.passport =
          this.user.passport != null
            ? this.user.passport
            : "https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg";
      })
      .finally(() => {
        console.log(this.user)
        this.$Progress.finish();
      });
    },
    updateDetail: function() {
      this.user.action = "update";
      this.post("/users", this.user)
        .then(resp => {
          if (resp.status > 0) {
            this.$toastr.success(resp.message);
          } else {
            this.$toastr.error(resp.message);
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    updateLogin: function() {
      this.login.action = "login";
      this.login.id = this.user.id;
      if (this.login.password == this.login.authPin) {
        this.$toastr.error(
          "Password must be different from your authorization pin."
        );
        return false;
      }
      this.post("/users", this.login)
        .then(resp => {
          if (resp.status > 0) {
            this.$toastr.success(resp.message);
          } else {
            this.$toastr.error(resp.message);
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    authUser: function(auth) {
      if (auth) {
        if (this.loginDialog) {
          this.updateLogin();
          this.loginDialog = false;
        } else {
          this.updateDetail();
        }
        this.authDialog = false;
      }
    },
    closeAuth: function(cancel) {
      this.authDialog = cancel;
    }
  },
  mounted() {
    this.checkStorage();
    this.loadDetail();
  }
};
</script>
