<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title>Booked patients</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <v-flex row>
            <v-layout row wrap>
              <v-flex xs4 v-for="(patient, index) in patients" :key="index">
                <v-card>
                  <v-flex xs12 flexbox row wrap class="pt-4">
                    <v-flex xs4>
                      <v-avatar
                        size="70px"
                        style="position:relative; top:-15px;"
                      >
                        <img src="../../assets/user.png" :alt="patient.name" />
                      </v-avatar>
                    </v-flex>
                    <div xs8 class="titles " style="text-align:left;">
                      Name:{{ patient.name }}<br />Patrec Code:{{ patient.code
                      }}<br />
                      Gender: {{ patient.gender }}
                    </div>
                  </v-flex>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { STATE, LGAS } from "../../shared/state.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "NewPatient",
  data: () => ({
    patients: [],
    user: [],
    dept: []
  }),
  components: {},
  props: {
    source: String
  },
  computed: {
    ...mapState([
      "domain",
      "outlet",
      "search",
      "platforms",
      "departments",
      "users"
    ])
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      var vm = this;
      setTimeout(vm.loadPatients, 3000);
    },
    loadPatients: function() {
      this.get("/patient-med/dept/" + this.departments.id)
        .then(response => {
          if (response.status > 0) {
            this.patients = response.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    }
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
  }
};
</script>
<style scoped></style>
