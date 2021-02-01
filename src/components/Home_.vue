<template>
  <v-container>
    <v-toolbar row wrap>
      <v-toolbar-title>Welcome back Adedeji</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card class="scroller" visible="1">
      <v-container grid-list-sm class="pa-4">
        <v-layout>
          <div class="row">
            <template v-for="(dept, index) in bookSummary">
              <div class="row box" :key="index">
                <div class="column left info">
                  <v-icon white>book</v-icon>
                </div>
                <div class="column right">
                  <h6>{{ dept.name }}</h6>
                  <p>{{ dept.nos }}</p>
                </div>
              </div>
            </template>
          </div>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <LineChart
              :chart-data="datacollection"
              :options="options"
            ></LineChart>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
import LineChart from "../charts/LineChart";
export default {
  name: "home",
  data: () => ({
    store: [],
    error: "",
    currentSession: [],
    datacollection: null,
    options: null,
    loadingDialog: false,
    elevations: [6, 12, 18],
    bookSummary: []
  }),
  props: {
    source: String
  },
  components: {
    LineChart
  },
  computed: {
    ...mapState(["domain", "outlet", "platforms"])
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      var canvas = document.createElement("canvas");

      this.gradient = canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);

      this.gradient2 = canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);

      this.gradient.addColorStop(0, "rgba(228, 113, 122, 0.5)");
      this.gradient.addColorStop(0.5, "rgba(228, 113, 122, 0.25)");
      this.gradient.addColorStop(1, "rgba(228, 113, 122, 0)");

      this.gradient2.addColorStop(0, "rgba(0, 191, 255, 0.9)");
      this.gradient2.addColorStop(0.5, "rgba(0, 191, 255, 0.25)");
      this.gradient2.addColorStop(1, "rgba(0, 191, 255, 0)");

      this.options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      };
    },
    loadSummary: function() {
      this.get(`/record/summary/${this.outlet.id}`)
        .then(resp => {
          if (resp.status > 0) {
            this.bookSummary = resp.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    fillData: function() {
      this.datacollection = {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        datasets: [
          {
            label: "Walk-in Patient",
            backgroundColor: this.gradient,
            borderColor: "#FC2525",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            data: [40, 20, 30, 50, 90, 10, 20, 40, 50, 70, 90, 100]
          },
          {
            label: "Transfer Patient",
            backgroundColor: this.gradient2,
            borderColor: "#FC2525",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            data: [30, 40, 50, 60, 70, 80, 90, 40, 50, 70, 90, 100]
          }
        ]
      };
    }
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    alert(JSON.stringify(this.platforms));
    return false;
    switch (this.platforms.type) {
      case 1:
        this.$router.push({ name: "rhome" });
        break;
      case 2:
        this.$router.push({ name: "dhome" });
        break;
      case 3:
        this.$router.push({ name: "lab-home" });
        break;
      case 5:
        this.$router.push({ name: "pharm-home" });
        break;
      case 6:
        this.$router.push({ name: "account-home" });
        break;
      case 7:
        this.$router.push({ name: "nurse" });
        break;
      case 8:
        this.$router.push({ name: "sales" });
        break;
      default:
        var vm = this;
        setTimeout(vm.loadSummary, 3000);
        this.innitialize();
        this.fillData();
        break;
    }
  }
};
</script>

<style scoped></style>
