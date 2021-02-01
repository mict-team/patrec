<template>
    <v-container id="user-profile" fluid tag="section">
        <v-row justify="center">
            <v-col cols="12" md="12">
                <base-material-chart-card
                    :data="dailySalesChart.data"
                    :options="dailySalesChart.options"
                    color="[primary]"
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
        <v-row>
            <v-col col="12" md="6">
                <v-card>
                    <v-toolbar row wrap>
                        <v-toolbar-title>Summary</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-chip color="green" text-color="white" @click="loadRegisterDetails"><v-icon>mdi-reload</v-icon></v-chip>
                    </v-toolbar>
                    <v-container>
                        <v-layout>
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <th>Register</th><td>{{`0` | toDecimal}}</td>
                                    </tr>
                                    <tr>
                                        <th>Total sales</th><td>{{`0` | toDecimal}}</td>
                                    </tr>
                                    <tr>
                                        <th>Expenses</th><td>{{`0` | toDecimal}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-col>
            <v-col col="12" md="6">
                <v-card>
                    <v-toolbar row wrap>
                        <v-toolbar-title>Recents</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-chip color="green" text-color="white" @click="loadMostRecents"><v-icon>mdi-reload</v-icon></v-chip>
                        <v-chip class="ma-2" color="green" text-color="white" @click="paginateMostRecent(-1)" :disabled="isMostRecentFirstPage"><v-icon>mdi-arrow-left-bold-circle</v-icon></v-chip>
                        <v-chip class="ma-2" color="green" text-color="white" @click="paginateMostRecent(+1)" :disabled="isMostRecentLastPage"><v-icon>mdi-arrow-right-bold-circle</v-icon></v-chip>
                    </v-toolbar>
                    <v-container>
                        <v-layout>
                            <table class="table">
                                <tbody>
                                    <tr v-for="(recent, ind) in getRecentItems" :key="`recent_${ind}`">
                                        <th>{{recent.name}}({{recent.code}})</th><td>{{recent.total | toDecimal}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
    data(){
        return{
            dailySalesChart: {
                data: {
                    labels: ["M", "T", "W", "T", "F", "S", "S"],
                    series: [[12, 17, 7, 17, 23, 18, 38]]
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
            page: 1,
            pageSize: 5,
            mostRecentTransactions:[]
        }
    },
    props:{
        user:{
            type: [Object, Array],
            default: null
        }
    },
    computed: {
        ...mapState([
            "domain",
            "outlet",
            "search",
            "users",
        ]),
        getRecentItems(){
            return this.mostRecentTransactions.result;
        },
        isMostRecentFirstPage(){
            return this.page<2
        },
        isMostRecentLastPage(){
            return this.page>=Math.ceil(this.mostRecentTransactions.total / this.pageSize);
        }
    },
    methods:{
        ...mapActions(["checkStorage", "setToday"]),
        loadSaleSummary: function(){
            this.$Progress.start();
            let payload={
                outlet: this.outlet.id,
                user: this.users.id,
                action: 'daily'
            }
            this.post("/report/pharmacist", payload)
            .then(resp=>{
                if(resp.status>0){
                    this.dailySalesChart.data.series=[resp.chart]
                }
            })
            .finally(()=>{
                //console.log(this.dailySalesChart.data.series)
                this.$Progress.finish();
            })
        },
        loadMostRecents: function(){
            this.$Progress.start();
            let payload={
                outlet: this.outlet.id,
                user: this.users.id,
                page: this.page,
                pageSize: this.pageSize,
                action: 'loads'
            }
            this.post("/report/pharmacist/general", payload)
            .then(resp=>{
                if(resp.status>0){
                    this.mostRecentTransactions=resp.response
                }
            })
            .finally(()=>{
                this.$Progress.finish();
            })
        },
        loadRegisterDetails: function(){

        },
        paginateMostRecent: function(value){
            this.page +=value;
            this.loadMostRecents();
        }
    },
    mounted(){
        LS.set("pathUrl", 'pharmacist');
        this.checkStorage();
        this.loadSaleSummary();
        this.loadMostRecents();
        this.loadRegisterDetails();
    }
}
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
