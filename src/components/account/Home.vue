<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-row center>
          <v-col cols="12" md="4" @click="$router.push('/doctor/schedules')">
            <base-material-card
              :bar="false"
              class="primary text-start font-weight-light"
            >
              <v-icon class="icons">person_add</v-icon>
              <h6>Patients</h6>
            </base-material-card>
          </v-col>

          <v-col cols="12" md="4" @click="$router.push('/account/tarrif')">
            <base-material-card :bar="false" class="primary text-start">
              <v-icon class="icons">mdi-wallet</v-icon>
              <h6>Tarrifs</h6>
            </base-material-card>
          </v-col>

          <v-col cols="12" md="4" @click="$router.push('/account/almonas')">
            <base-material-card :bar="false" class="primary text-start">
              <v-icon class="icons">mdi-account-cash</v-icon>
              <h6>Almonas</h6>
            </base-material-card>
          </v-col>

          <v-col cols="12" md="6" @click="$router.push('/report/account')">
            <base-material-card :bar="false" class="primary text-start">
              <v-icon class="icons">bar_chart</v-icon>
              <h6>Reports</h6>
            </base-material-card>
          </v-col>
          <v-col cols="12" md="6" @click="$router.push('/user-profile')">
            <base-material-card :bar="false" class="primary text-start">
              <v-icon class="icons">mdi-account</v-icon>
              <h6>My Profile</h6>
            </base-material-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="4">
        <base-material-card class="v-card-profile" :avatar="user.passport">
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text" v-if="user.designation">
              {{ user.designation | toTitleCase }}
            </h6>

            <h1
              class="display-2 font-weight-light mb-3 black--text"
              style="font-size:22px !important;"
            >
              {{ user.name | toTitleCase }}
            </h1>

            <p class="font-weight-light grey--text" v-if="user.about">
              {{ user.about }}
            </p>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "Doctor",
  data: () => ({
    store: [],
    error: "",
    user: [],
    currentSession: [],
    departments: [],
    loadingDialog: false
  }),
  components: {},
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet", "search"])
  },
  methods: {
    ...mapActions(["setSearch", "checkStorage"]),
    navigate: function() {
      alert("deji");
    },
    innitialize: function() {
      var user = LS.get("user");
      this.get(`/users/user/${user.id}`)
        .then(resp => {
          this.user = resp.response;
          this.user.passport =
            this.user.passport != null
              ? this.user.passport
              : "https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg";
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    }
  },
  mounted() {
    this.checkStorage();
    this.innitialize();
  }
};
</script>

<style scoped>
.text-start {
  color: #fff;
  cursor: pointer;
}

.icons {
  font-weight: lighter;
  color: #fff;
  font-size: 60px;
}
</style>
