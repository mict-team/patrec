<template>
  <v-container id="dashboard" fluid tag="section">
    <v-flex xs12 class="header"> <span>&#8358;</span> Financials </v-flex>
    <v-row>
      <v-col cols="6" sm="7" lg="7">
        <v-layout row>
          <v-flex xs5 class="revenue">
            <v-card>
              <v-container grid-list-sm class="pa-4">
                <h5 class="title">Revenue</h5>
                <p class="amount">
                  {{summary.daily | toDecimal}} <span><v-icon>mdi-menu-up</v-icon>12%</span>
                </p>
                <ul>
                  <li class="row">
                    <v-flex xs9>Schemes</v-flex>
                    <v-flex xs3>{{summary.schemes}}%</v-flex>
                  </li>
                  <li class="row">
                    <v-flex xs9>Private</v-flex>
                    <v-flex xs3>{{summary.private}}%</v-flex>
                  </li>
                </ul>
                <hr />
                <ul>
                  <li class="row">
                    <v-flex xs9>Transactions</v-flex>
                    <v-flex xs3>{{summary.transactions}}</v-flex>
                  </li>
                  <li class="row">
                    <v-flex xs9>Unpaid balances</v-flex>
                    <v-flex xs3>&#8358;{{summary.unpaid | toDecimal}}</v-flex>
                  </li>
                </ul>
              </v-container>
            </v-card>
          </v-flex>
          <v-flex xs1></v-flex>
          <v-flex xs5 class="revenue">
            <v-card>
              <v-container grid-list-sm class="pa-4">
                <h5 class="title">Top earning services</h5>
                <ul>
                  <li class="row" v-for="(top, ind) in summary.highest" :key="`highest_${ind}`">
                    <v-flex xs9>{{top.name}}</v-flex>
                    <v-flex xs3>{{top.number |toDecimal}}%</v-flex>
                  </li>
                </ul>
                <hr />
                <h5 class="title">Least earning services</h5>
                <ul>
                  <li class="row" v-for="(top, ind) in summary.lowest" :key="`lowest_${ind}`">
                    <v-flex xs9>{{top.name}}</v-flex>
                    <v-flex xs3>{{top.number|toDecimal}}%</v-flex>
                  </li>
                </ul>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-col>
      <v-col cols="12" lg="5">
        <base-material-chart-card
          :data="dailySalesChart.data"
          :options="dailySalesChart.options"
          color="success"
          hover-reveal
          type="Line"
          >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info">
                    mdi-refresh
                  </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Daily Sales
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            <v-icon color="green" small>
              mdi-arrow-up
            </v-icon>
            <span class="green--text">55%</span>&nbsp; increase in today's sales
          </p>

          <template v-slot:actions>
            <v-icon class="mr-1" small>
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light"
              >updated 4 minutes ago</span
            >
          </template>
        </base-material-chart-card>
      </v-col>
    </v-row>
    <v-flex xs12 class="header">
      <span><v-icon color="white">mdi-home-plus</v-icon></span> Visits
    </v-flex>

    <v-row>
      <v-col cols="6" sm="7" lg="7">
        <v-layout row>
          <v-flex xs5 class="revenue">
            <v-card>
              <v-container grid-list-sm class="pa-4">
                <h5 class="title">Patients seen</h5>
                <p class="amount">
                  {{summary.patient}} <span><v-icon>mdi-menu-up</v-icon>12%</span>
                </p>
                <ul>
                  <li class="row">
                    <v-flex xs9>HMO</v-flex>
                    <v-flex xs3>63%</v-flex>
                  </li>
                  <li class="row">
                    <v-flex xs9>Private</v-flex>
                    <v-flex xs3>37%</v-flex>
                  </li>
                </ul>
                <hr />
                <ul>
                  <li class="row">
                    <v-flex xs9>Transactions</v-flex>
                    <v-flex xs3>3456</v-flex>
                  </li>
                  <li class="row">
                    <v-flex xs9>Unpaid balances</v-flex>
                    <v-flex xs3>&#8358;25,000</v-flex>
                  </li>
                </ul>
              </v-container>
            </v-card>
          </v-flex>
          <v-flex xs1></v-flex>
          <v-flex xs5 class="revenue">
            <v-card>
              <v-container grid-list-sm class="pa-4">
                <h5 class="title">Top diagnosis</h5>
                <ul>
                  <li class="row" v-for="(top, ind) in summary.tops" :key="`tops_${ind}`">
                    <v-flex xs9>{{top.name}}</v-flex>
                    <v-flex xs3>{{top.number |toDecimal}}%</v-flex>
                  </li>
                </ul>
                <hr />
                <h5 class="title">Least asked services</h5>
                <ul>
                  <li class="row" v-for="(top, ind) in summary.bottom" :key="`bots_${ind}`">
                    <v-flex xs9>{{top.name}}</v-flex>
                    <v-flex xs3>{{top.number |toDecimal}}%</v-flex>
                  </li>
                </ul>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-col>
      <v-col cols="12" lg="5">
        <base-material-chart-card
          :data="monthlySalesChart.data"
          :options="monthlySalesChart.options"
          color="primary"
          hover-reveal
          type="Bar"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info">
                    mdi-refresh
                  </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Daily Sales
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            <v-icon color="green" small>
              mdi-arrow-up
            </v-icon>
            <span class="green--text">55%</span>&nbsp; increase in today's sales
          </p>

          <template v-slot:actions>
            <v-icon class="mr-1" small>
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light"
              >updated 4 minutes ago</span
            >
          </template>
        </base-material-chart-card>
      </v-col>
    </v-row>

    <v-flex xs12 class="header"> <span>&#8358;</span> Summary </v-flex>
    <v-row>
      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="info"
          icon="mdi-bus-stop-uncovered"
          title="Patients"
          :sub-text="`${summary.patient} today`"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="success"
          icon="mdi-poll"
          title="Revenue"
          :sub-text="summary.revenue | toDecimal"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="primary"
          icon="mdi-store"
          title="Inpatients"
          :sub-text="`${summary.inpatient} today`"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="orange"
          icon="mdi-sofa"
          title="Outpatients"
          :sub-text="`${summary.outpatient} today`"
        />
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="info"
          icon="toggle_off"
          title="Today"
          :sub-text="summary.daily | toDecimal"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="primary"
          icon="mdi-poll"
          title="Week"
          :sub-text="summary.weekly | toDecimal"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="success"
          icon="mdi-store"
          title="Month"
          :sub-text="summary.monthly | toDecimal"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="red"
          icon="mdi-sofa"
          title="Year"
          :sub-text="summary.yearly | toDecimal"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "DashboardDashboard",

  data() {
    return {
      summary: {
        schemes:0,
        private:0,
        unpaid:0,
        revenue: 0,
        patient: 0,
        inpatient: 0,
        outpatient: 0,
        transactions:0,
        daily:0,
        weekly:0,
        monthly:0,
        yearly:0,
        highest:[],
        lowest:[],
        tops:[],
        bottom:[]
      },
      dailySalesChart: {
        data: {
          labels: [],
          series: [[]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50,
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      
      dataCompletedTasksChart: {
        data: {
          labels: [],
          series: [[]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      monthlySalesChart: {
        data: {
          labels: [],
          series: [[]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      },
      
      tabs: 0,
      
      list: {
        0: false,
        1: false,
        2: false
      }
    };
  },
  computed: {
    ...mapState(["outlet", "group", "roles", "search"]),
  },
  methods: {
    ...mapActions(["setSearch", "checkStorage"]),
    complete: function(index) {
      this.list[index] = !this.list[index];
    },
    innitialize: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id
      }
      this.post("/home", payload)
      .then(resp => {
        var yearly = resp.response.chart.year;
        var year = new Promise(resolve => {
          var data = [];
          for (let day of yearly) {
            this.dataCompletedTasksChart.data.labels.push(day.name);
            this.dataCompletedTasksChart.data.series[0].push(day.value);
            data.push(day.value);
          }
          resolve(data);
        });
        year.then(resp => {
          this.dataCompletedTasksChart.options.high = Math.max(...resp);
        });

        var monthly = resp.response.chart.month;
        var month = new Promise(resolve => {
          var data = [];
          for (let day of monthly) {
            this.monthlySalesChart.data.labels.push(day.name);
            this.monthlySalesChart.data.series[0].push(day.value);
            data.push(day.value);
          }
          resolve(data);
        });
        month.then(resp => {
          this.monthlySalesChart.options.high = Math.max(...resp);
        });

        var daily = resp.response.chart.day;
        var day = new Promise(resolve => {
          var data = [];
          for (let day of daily) {
            this.dailySalesChart.data.labels.push(day.name);
            this.dailySalesChart.data.series[0].push(day.value);
            data.push(day.value);
          }
          resolve(data);
        });
        day.then(resp => {
          this.dailySalesChart.options.high = Math.max(...resp);
        });
        this.summary.schemes = resp.response.block.schemes;
        this.summary.private = resp.response.block.private;
        this.summary.unpaid=resp.response.block.unpaidBill;
        this.summary.highest = resp.response.block.highest;
        this.summary.lowest = resp.response.block.lowest;
        this.summary.tops = resp.response.block.top;
        this.summary.bottom = resp.response.block.bottom;
        this.summary.transactions = resp.response.block.transactions.toString();
        this.summary.patient = resp.response.block.patient.toString();
        this.summary.revenue = resp.response.block.revenue.toString();
        this.summary.inpatient = resp.response.block.inpatient.toString();
        this.summary.outpatient = resp.response.block.outpatient.toString();
        this.summary.daily=resp.response.summary.today.toString();
        this.summary.weekly=resp.response.summary.week.toString();
        this.summary.monthly=resp.response.summary.month.toString();
        this.summary.yearly=resp.response.summary.year.toString();
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },
    
  },
  mounted() {
    this.checkStorage();
    setTimeout(this.innitialize, 200);
  }
};
</script>

<style scoped>
.header {
  color: rgb(73, 71, 71);
  font-size: 25px;
}
.header span {
  height: 70px !important;
  width: 70px !important;
  color: #fff;
  background-color: rgb(73, 71, 71);
  border-radius: 50%;
  padding: 0.2em;
}
.revenue {
  height: 300px;
}
.revenue .title {
  text-transform: uppercase;
  font-size: 14px !important;
  font-weight: bold;
  color: rgb(73, 71, 71);
}
.amount {
  color: rgb(49, 216, 49);
  font-size: 28px;
  font-weight: 500;
}
.amount span {
  font-size: 12px;
}
ul {
  width: 100%;
  margin-left: 0px;
}
ul li {
  margin-left: -12px;
  font-size: 12px;
  padding: 0.2em 0em;
  list-style: none;
  text-transform: uppercase;
  font-weight: 700;
}
ul li .figure {
  position: relative;
  right: 0% !important;
  text-align: right;
  background-color: aquamarine;
}
</style>
