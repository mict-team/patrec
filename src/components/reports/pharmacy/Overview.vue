<template>
    <v-container>
        <v-toolbar row wrap>
            <v-btn color="red" @click="$router.go(-1)" white-text><v-icon>keyboard_arrow_left</v-icon>Back</v-btn>
            <v-toolbar-title>Overview</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-container grid-list-sm class="pa-4">
            <v-layout row>
                <v-row>
                    <v-col col="12" md="3">
                        <v-card>
                            <v-toolbar row wrap>
                                <v-toolbar-title>Daily summary</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-icon @click="loadDailySummary">mdi-reload</v-icon>
                            </v-toolbar>
                            <v-container grid-list-sm class="pa-4">
                                <v-layout row>
                                    <table class="table">
                                        <tr v-for="(day, ind) in daily" :key="`day${ind}`">
                                            <th>{{day.name}}</th><td>{{day.value | toDecimal}}</td>
                                        </tr>
                                    </table>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-col>
                    
                    <v-col col="12" md="3">
                        <v-card>
                            <v-toolbar row wrap>
                                <v-toolbar-title>Weekly view</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-icon @click="loadWeeklySummary">mdi-reload</v-icon>
                            </v-toolbar>
                            <v-container grid-list-sm class="pa-4">
                                <v-layout row>
                                    <table class="table">
                                        <tr v-for="(week, ind) in weekly" :key="`week${ind}`">
                                            <th>{{week.name}}</th><td>{{week.value | toDecimal}}</td>
                                        </tr>
                                    </table>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-col>
                    <v-col col="12" md="3">
                        <v-card>
                            <v-toolbar row wrap>
                                <v-toolbar-title>Monthly view</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-icon @click="loadMonthlySummary">mdi-reload</v-icon>
                            </v-toolbar>
                            <v-container grid-list-sm class="pa-4">
                                <v-layout row>
                                    <table class="table">
                                        <tr v-for="(month, ind) in monthly" :key="`month${ind}`">
                                            <th>{{month.name}}</th><td>{{month.value | toDecimal}}</td>
                                        </tr>
                                    </table>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-col>
                    <v-col col="12" md="3">
                        <v-card>
                            <v-toolbar row wrap>
                                <v-toolbar-title>Yearly summary</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-icon @click="loadYearlySummary">mdi-reload</v-icon>
                            </v-toolbar>
                            <v-container grid-list-sm class="pa-4">
                                <v-layout row>
                                    <table class="table">
                                        <tr v-for="(year, ind) in yearly" :key="`year${ind}`">
                                            <th>{{year.name}}</th><td>{{year.value | toDecimal}}</td>
                                        </tr>
                                    </table>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-col>
                </v-row>
            </v-layout>
        </v-container>
    </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
    data:()=>{
        return{
            daily:[],
            weekly:[],
            monthly:[],
            yearly:[]
        }
    },
    computed:{
        ...mapState(["domain", "outlet"]),
    },
    methods:{
        ...mapActions(["setDomain", "checkStorage"]),
        

        loadWeeklySummary: function(){
            this.$Progress.start();
            let payload={
                outlet: this.outlet.id,
                action: 'weekly'
            }
            this.post('/report/account', payload)
            .then(resp=>{
                if(resp.status>0){
                    this.weekly=resp.response;
                }
            })
            .finally(()=>{
                this.$Progress.finish();
            })
        },
        loadMonthlySummary: function(){
            this.$Progress.start();
            let payload={
                outlet: this.outlet.id,
                action: 'monthly'
            }
            this.post('/report/account', payload)
            .then(resp=>{
                if(resp.status>0){
                    this.monthly=resp.response;
                }
            })
            .finally(()=>{
                this.$Progress.finish();
            })
        },
        loadYearlySummary: function(){
            this.$Progress.start();
            let payload={
                outlet: this.outlet.id,
                action: 'yearly'
            }
            this.post('/report/account', payload)
            .then(resp=>{
                if(resp.status>0){
                    this.yearly=resp.response;
                }
            })
            .finally(()=>{
                this.$Progress.finish();
            })
        },
        loadDailySummary: function(){
            this.$Progress.start();
            let payload={
                outlet: this.outlet.id,
                action: 'daily'
            }
            this.post('/report/account', payload)
            .then(resp=>{
                if(resp.status>0){
                    this.daily=resp.response;
                }
            })
            .finally(()=>{
                this.$Progress.finish();
            })
        }
    },
    mounted(){
        this.checkStorage();
        setTimeout(this.loadDailySummary, 200);
        setTimeout(this.loadWeeklySummary, 200);
        setTimeout(this.loadMonthlySummary, 200);
        setTimeout(this.loadYearlySummary, 200);
    }
}
</script>

<style>

</style>