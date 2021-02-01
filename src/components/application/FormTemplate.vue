<template>
  <v-container>
    <v-card>
      <v-toolbar class="grey lighten-4 title">
        <v-toolbar-title>Patient data template</v-toolbar-title>

        <div class="flex-grow-1"></div>

        <v-btn icon @click="showBuilder"> <v-icon>add</v-icon>Add </v-btn>
      </v-toolbar>

      <v-container grid-list-sm class="pa-4">
        <v-layout row>
          <v-flex xs12 transition="scroll-y-transition" v-if="departmentDialog">
            <form-builder type="template"></form-builder>
          </v-flex>
          <v-flex xs12>
            <table class="table">
              <thead>
                <tr>
                  <th width="10%">SN</th>
                  <th width="60%">Name</th>
                  <th width="20%">Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody v-if="departments">
                <tr v-for="(dept, index) in departments" :key="index">
                  <td width="10%">{{ index + 1 }}</td>
                  <td width="60%">{{ dept.name }}</td>
                  <td width="20%">{{ dept.platform }}</td>
                  <td>
                    <v-icon>create</v-icon> |
                    <v-icon>delete_sweep</v-icon>
                  </td>
                </tr>
              </tbody>
              <tr v-if="!departments || departments.length < 1">
                <td colspan="4">
                  <v-flex xs12 style="text-align:center;">
                    <img src="../../assets/addnewitem.svg" />
                  </v-flex>
                </td>
              </tr>
            </table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
var fs = require("fs");
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
const image2base64 = require("image-to-base64");
import FormBuilder from "v-form-builder";
export default {
  name: "Department",
  data: () => ({
    store: [],
    error: "",
    currentSession: [],
    loadingDialog: false,
    departmentDialog: false,
    newDepartment: { name: "", code: "" },
    search: "",
    paths: "",
    message: ""
  }),
  components: {
    FormBuilder
  },
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "departments"])
  },

  methods: {
    ...mapActions([
      "setDomain",
      "setSearch",
      "checkStorage",
      "addDepartment",
      "setDepartment"
    ]),
    loadDepartments: function() {
      var postData = {
        outlet: this.outlet.id
      };
      this.get("/department")
        .then(response => {
          this.setDepartment(response.response);
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    showBuilder: function() {
      if (!this.departmentDialog) {
        this.departmentDialog = true;
      } else {
        this.departmentDialog = false;
      }
    },
    saveRegistration: function() {
      if (newDepartment.name != "") {
        this.post("/department/save", postData)
          .then(response => {
            this.addDepartment(response.response);
          })
          .catch(e => {
            this.$toastr.error(e.message);
          });
      }
    }
  },
  mounted() {
    this.setDomain();
    this.checkStorage();
    this.paths = this.domain === "" ? URL : this.domain;
    this.loadDepartments();
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
video {
  border: 1px solid transparent;
  width: 380px;
  height: 270px;
  background: black;
}
canvas {
  width: 380px;
  height: 270px;
  visibility: none;
}
.player {
  float: left;
  padding: 1em 1em 0.5em;
  border: 2px solid transparent;
  border-radius: 9px;
}
ul.menu {
  list-style: none;
  display: inset;
  width: 90%;
  height: 100%;
}
ul.menu li {
  min-height: 40px;
  cursor: pointer;
  width: 100%;
  font-style: uppercase;
  font-size: 22px;
  font-family: "Times new romans";
}
ul.menu li[first] {
  margin-top: 30px;
}
ul.menu li:hover {
  background-color: lightblue;
}
</style>
