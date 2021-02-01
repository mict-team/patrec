<template>
  <v-card>
    <v-card-title class="grey lighten-4 py-4 card-title">
      New user
      <v-spacer />
      <v-btn @click="$router.go(-1)">Cancel</v-btn>
      <v-btn color="primary" v-if="!processing" @click="addUser"
        >Create user</v-btn
      >
      <v-btn v-else>
        <v-progress-circular
          class="pa-4"
          :size="30"
          indeterminate
        ></v-progress-circular>
      </v-btn>
    </v-card-title>
    <v-container grid-list-sm class="pa-4 ">
      <v-row>
        <v-spacer />
        <v-col cols="12" md="9">
          <h5>Personal detail</h5>
          <hr />
          <v-card class="px-5 py-4">
            <v-row>
              <v-col cols="12" md="12">
                <v-row>
                  <v-col cols="12" md="5">
                    <label>Title</label>
                    <select
                      class="form-control select-drop"
                      placeholder="Gender"
                      v-model="user.title"
                    >
                      <option value="" selected disabled="true"
                        >..Select title..</option
                      >
                      <option value="Mr" selected>Mr.</option>
                      <option value="Miss">Miss</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Dr">Dr</option>
                      <option value="Pharm">Pharm</option>
                      <option value="Chief">Chief</option>
                    </select>
                  </v-col>
                  <v-col cols="12" md="7">
                    <label for="brandWebsite"> Staff ID</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="user.staff_id"
                      placeholder="e.g PAT001/2020."
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="12">
                <label for="brandWebsite"> Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="user.name"
                  placeholder="e.g Adewumi Adedeji."
                />
              </v-col>
              <v-col cols="12" md="7">
                <label for="brandWebsite"> Email</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="user.email"
                  placeholder="e.g firstname.lastname@metroverts.com."
                />
              </v-col>
              <v-col cols="12" md="5">
                <label for="brandWebsite"> Phone number</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="user.phone"
                  placeholder="e.g 08010000001"
                />
              </v-col>
              <v-col cols="12" md="12">
                <v-row>
                  <v-col cols="12" md="5">
                    <label for="brandWebsite">Designation</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="user.designation"
                      placeholder="e.g CMD, Accountant ..."
                    />
                  </v-col>
                  <v-col cols="12" md="7">
                    <label for="brandWebsite"> Username</label>
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Username"
                        v-model="user.username"
                      />
                      <span style="background-color:#ccc;">
                        <button class="btn">@patrec.com</button>
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="12">
                <label for="brandWebsite"> Password</label>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="e.g Password"
                    v-model="user.password"
                  />
                  <span style="background-color:#ccc;">
                    <button class="btn" @click="generateCode">Generate</button>
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-card>
          <h5>Access level</h5>
          <hr />
          <v-card class="px-5 py-4">
            <v-row>
              <v-col cols="12" md="12">
                <label for="brandName"> Working department/unit</label>
                <select class="form-control select" v-model="user.dept">
                  <option value="" selected disabled="true"
                    >..Select department..</option
                  >
                  <option
                    v-for="(dept, index) in department"
                    :key="index"
                    :value="dept.id"
                    >{{ dept.name }}</option
                  >
                </select>
                <small>Attach user to a department or unit.</small>
              </v-col>
              <v-col cols="12" md="12">
                <label for="brandName"> Access role</label>
                <select class="form-control select" v-model="user.role">
                  <option value="" selected disabled="true"
                    >Select access roles</option
                  >
                  <option
                    v-for="(role, ind) in roles"
                    :key="ind"
                    :value="role.id"
                    >{{ role.name }}</option
                  >
                </select>
                <small>Attach user to an access group.</small>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-spacer />
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { URL, LS, SHA256, ALPHASTR, IDGenerator } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      processing: false,
      department: [],
      roles: [],
      user: {
        code: "",
        title: "",
        staff_id: "",
        name: "",
        email: "",
        phone: "",
        designation: "",
        username: "",
        password: "",
        dept: "",
        role: ""
      }
    };
  },
  computed: {
    ...mapState(["outlet", "transCode", "today", "platforms"]),
    checkItems() {
      return this.paginate;
    }
  },
  methods: {
    ...mapActions(["setSearch", "checkStorage", "setCode", "setToday"]),
    generateCode: function() {
      var password =
        this.user.username ||
        "patrec@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      new Date().getTime().toString(8);
      this.user.password = ALPHASTR(password);
    },
    loadDept: function() {
      this.$Progress.start();
      this.get("/department")
        .then(response => {
          if (response.status > 0) {
            this.department = response.response;
          }
        })
        .finally(() => {
          //console.log(this.department)
          this.$Progress.finish();
        });
    },
    loadAccessGroup: function() {
      this.$Progress.start();
      this.get("users-access")
        .then(resp => {
          if (resp.status > 0) {
            this.roles = resp.response;
          }
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    addUser: function() {
      this.$Progress.start();
      this.processing = true;
      this.setCode();

      (this.user.outlet = this.outlet.id),
        (this.user.code = IDGenerator(6)),
        this.post("/users", this.user)
          .then(response => {
            if (response.status > 0) {
              this.$toastr.success(response.message);
            } else {
              this.$toastr.error(response.message);
            }
          })
          .finally(() => {
            this.$Progress.finish();
            this.processing = false;
          });
    }
  },
  mounted() {
    this.loadAccessGroup();
    this.loadDept();
  }
};
</script>

<style></style>
