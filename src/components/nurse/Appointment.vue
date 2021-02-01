<template>
    <v-container>
        <v-card>
            <v-toolbar row wrap>
                <v-btn color="red" @click="$router.go(-1)"
                ><v-icon white-text>keyboard_arrow_left</v-icon
                ><span>Back</span></v-btn
                >
                <v-toolbar-title>Appointments</v-toolbar-title>
                <v-spacer />
                <v-btn class="red" :disabled="!patients" @click="printpage"
                ><v-icon>print</v-icon>Print</v-btn>
            </v-toolbar>
            
            <v-container grid-list-sm class="pa-4" ref="printarea">
                <v-layout row>
                <v-flex xs12>
                    <table class="table">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Pat.Code</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>DOB</th>
                        <th>Date of visit</th>
                        <th>Dept</th>
                        <th>Paid</th>
                        <th>Treated</th>
                        <th>Date</th>
                        </tr>
                    </thead>
                    <template v-if="loading">
                        <v-progress-circular
                        :size="40"
                        color="primary"
                        indeterminate
                        ></v-progress-circular
                        >Loading pls...
                    </template>
                    <template v-else>
                        <tbody v-if="checkItems.length>0">
                        <tr v-for="(pat, index) in checkItems" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ pat.code }}</td>
                            <td>{{ pat.name }}</td>
                            <td>{{ pat.gender }}</td>
                            <td>{{ pat.dob }}</td>
                            <td>{{ pat.date }}</td>
                            <td>{{ pat.dept }}</td>
                            <td>
                            <span v-if="pat.paid == 0">No</span>
                            <span v-else>Yes</span>
                            </td>
                            <td>
                            <span v-if="pat.status == 0">Yes</span>
                            <span v-else>No</span>
                            </td>
                            <td>{{ pat.date }}</td>
                        </tr>
                        </tbody>
                        <tr v-else>
                        <td colspan="10">
                            <v-flex xs12 justify="left" style="text-align:center;">
                            <img src="../../assets/addnewitem.svg" />
                            </v-flex>
                        </td>
                        </tr>
                    </template>
                    </table>
                    
                </v-flex>
                </v-layout>
                <base-pagination :total="appointments.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
            </v-container>
            </v-card>
    </v-container>
</template>
<script>
import { URL, LS, SHA256, DownloadCSV, PrintDoc } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
    data(){
        return{
            loading: false,
            user:[],
            appointments:[]
        }
    },
    props: {
        source: String
    },
    computed: {
        ...mapState(["outlet","users", "group"]),
        checkItems(){
            return (this.appointments.result)?this.appointments.result:[];
        }
    },
    methods: {
        ...mapActions(["checkStorage"]),
        loadAppointments: function(){

        }
    },
    mounted(){
        this.checkStorage();
        setTimeout(this.loadAppointments, 200)
    }
}
</script>