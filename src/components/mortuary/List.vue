<template>
    <v-container>
        <v-toolbar row wrap>
            <v-btn color="red"><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn>
            <v-toolbar-title>Registered corps</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>{{ getCorps.length > 0 ? getCorps.length : 0 }} onbed patients</v-toolbar-title>
        </v-toolbar>
        <v-card>
            <v-container grid-list-sm class="pa-4">
                <v-layout row>
                    <v-flex xs12>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Age</th>
                                    <th>Date brought</th>
                                    <th>Days spent</th>
                                    <th>Total bill</th>
                                    <th>Amount paid</th>
                                    <th>Balance</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody v-if="getCorps && getCorps.length > 0">
                                <template v-for="(corp, index) in getCorps">
                                    <tr :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ corp.code }}</td>
                                        <td>{{ corp.name }}</td>
                                        <td>{{ corp.gender }}</td>
                                        <td>{{ corp.age }}</td>
                                        <td>{{ corp.date_of_admission }}</td>
                                        <td>get days spent()</td>
                                        <td>total amount to pay</td>
                                        <td>Amount paid</td>
                                        <td>Balance</td>
                                        <th class="no-print">
                                            
                                            <v-chip class="ma-2" color="red" text-color="white">
                                                <v-icon left>cancel</v-icon>Release corp
                                            </v-chip>
                                        </th>
                                    </tr>
                                </template>
                            </tbody>

                            <tr v-else>
                                <td colspan="11">
                                    <v-flex xs12 style="text-align:center;">
                                    <img src="../../assets/addnewitem.svg" />
                                    </v-flex>
                                </td>
                            </tr>
                        </table>
                    </v-flex>
                    <base-pagination :total="corps.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
                </v-layout>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
    data: () => ({
        corps: [],
        page: 1,
        pageSize: 50,
        searchStr:'',
        user: [],
        group:[],
        loading: true
    }),
    props: {
        source: String
    },
    computed: {
        ...mapState(["outlet", "search", "users"]),
        getCorps(){
            return this.corps;//.result;
        }
    },
    methods:{
        changePage: function(pageItems) {
            this.page=pageItems.page;
            this.pageSize=pageItems.pageSize;
            this.searchStr=pageItems.search;
            this.loadCorps();
        },
        loadCorps(){
            this.loading=false;
        }
    },
    mounted(){
        this.user=LS.get('user');
        this.group=LS.get('group');
    }
}
</script>

<style>

</style>