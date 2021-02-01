<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" lg="4">
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
            <span class="green--text">{{dailyPercentage}}%</span>&nbsp; increase in today's sales
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
      <v-col cols="12" lg="4">
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
            <span class="green--text">{{monthlyPercentage}}%</span>&nbsp; increase in today's sales
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

      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="yearSummaryChart.data"
          :options="yearSummaryChart.options"
          hover-reveal
          color="info"
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

          <h3 class="card-title font-weight-light mt-2 ml-2">
            Yearly sales
          </h3>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Yearly view of the sales
          </p>

          <template v-slot:actions>
            <v-icon class="mr-1" small>
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light"
              >campaign sent 26 minutes ago</span
            >
          </template>
        </base-material-chart-card>
      </v-col>
    </v-row>
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
      yearSummaryChart: {
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
      list: {
        0: false,
        1: false,
        2: false
      }
    };
  },
  computed: {
    ...mapState(["outlet", "group", "roles", "search"]),
    dailyPercentage(){
      return (this.summary.daily/this.summary.yearly) * 100;
    },
    monthlyPercentage(){
      return (this.summary.monthly/this.summary.monthly) * 100;
    }
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
            this.yearSummaryChart.data.labels.push(day.name);
            this.yearSummaryChart.data.series[0].push(day.value);
            data.push(day.value);
          }
          resolve(data);
        });
        year.then(resp => {
          this.yearSummaryChart.options.high = Math.max(...resp);
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
