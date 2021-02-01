<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" white-text
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>Income Notification</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="Newdialog = true">Add reciever</v-btn>
      <v-btn color="green" @click="freqdialog = true">Set frequency</v-btn>
    </v-toolbar>
    <v-card class="scroller" style="height:580px !important;" :visible="1">
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex xs12>
            <table class="table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody v-if="recivers && recivers.length > 0">
                <tr v-for="(dept, index) in recivers" :key="index">
                  <td width="10%">{{ index + 1 }}</td>
                  <td>{{ dept.name }}</td>
                  <td>{{ dept.phone }}</td>
                  <td>{{ dept.email }}</td>
                  <td>{{ dept.status }}</td>
                  <td>
                    <v-btn icon small v-if="dept.status == 1">
                      <v-icon color="red">highlight_off</v-icon>
                    </v-btn>
                    <v-btn icon small v-if="dept.status == 0">
                      <v-icon color="green">offline_pin</v-icon>
                    </v-btn>
                    <v-btn icon small>
                      <v-icon color="red">mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
              <tr v-else>
                <td colspan="9">
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
    <v-dialog v-model="Newdialog" left top width="700px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          New reciver
          <v-spacer></v-spacer>
          <v-btn @click="Newdialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="addReciever">Add User</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row>
            <v-flex xs12 row>
              <v-flex xs12>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Name"
                  v-model="newRec.name"
                />
              </v-flex>
              <v-flex xs6>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Email address"
                  v-model="newRec.email"
                />
              </v-flex>
              <v-flex xs6>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Phone number"
                  v-model="newRec.phone"
                />
              </v-flex>
              <hr />
              <v-flex xs12>
                <v-radio-group :row="row" color="accent" v-model="newRec.type">
                  <v-radio label="Notify by mail" value="mail"></v-radio>
                  <v-radio label="Notify by SMS" value="sms"></v-radio>
                  <v-radio label="Notify by SMS & Mail" value="both"></v-radio>
                </v-radio-group>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="freqdialog" left top width="500px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title"
          >Notification frequency</v-card-title
        >
        <v-container grid-list-sm class="pa-4">
          <v-layout row>
            <v-flex xs12>
              <table class="table">
                <tbody>
                  <tr>
                    <td>1</td>
                    <td width="70%">Daily</td>
                    <td>
                      <v-btn color="primary" @click="freqdialog = false"
                        >Set</v-btn
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td width="70%">Weekly</td>
                    <td>
                      <v-btn color="primary" @click="freqdialog = false"
                        >Set</v-btn
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td width="70%">Monthly</td>
                    <td>
                      <v-btn color="primary" @click="freqdialog = false"
                        >Set</v-btn
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="freqdialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Search",
  data: () => ({
    store: [],
    error: "",
    currentSession: [],
    loadingDialog: false,
    recivers: [],
    row: true,
    newRec: {
      name: "",
      phone: "",
      email: "",
      type: ""
    },
    Newdialog: false,
    freqdialog: false
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "search", "transCode", "today"])
  },
  methods: {
    ...mapActions([
      "setDomain",
      "setSearch",
      "checkStorage",
      "setCode",
      "setToday"
    ]),
    startSearch: function() {
      this.searchdialog = true;
      this.get("/notification").then(response => {
        if (response.status > 0) {
          this.recivers = response.response;
        }
      });
    },

    addReciever: function() {
      if (this.newRec.name == "") {
        this.$toastr.error("Name must be specified");
        return;
      }
      if (this.newRec.type == "mail" && this.newRec.email == "") {
        this.$toastr.error("Email must be specified for email notification");
        return;
      }
      if (this.newRec.type == "sms" && this.newRec.phone == "") {
        this.$toastr.error("Phone must be specified for sms notification");
        return;
      }
      if (
        this.newRec.type == "both" &&
        (this.newRec.email == "" || this.newRec.phone == "")
      ) {
        this.$toastr.error(
          "Email and phone number must be specified for both notification"
        );
        return;
      }
      this.post("/notification", this.newRec).then(resp => {
        if (resp.status > 0) {
          this.$toastr.success("Reciever added to notification list.");
          this.startSearch();
        }
      });
    }
  },
  mounted() {
    this.startSearch();
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
