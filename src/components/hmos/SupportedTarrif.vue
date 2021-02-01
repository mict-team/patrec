<template>
    <v-container>
        <v-card>
        <v-toolbar>
            <v-btn color="red" @click="$router.go(-1)"><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn>
            <v-toolbar-title>{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn class="primary" @click="addDrugsDialog = true"><v-icon>add</v-icon> Add diagnosis to scheme</v-btn>
        </v-toolbar>

        <v-container grid-list-sm class="pa-4">
            <v-layout row>
                <v-flex xs12>
                    <v-flex xs12>
                        <table class="table">
                            <thead>
                                <tr>
                                <th>SN</th>
                                <th>Name</th>
                                <th>SCHEME Price</th>
                                <th>Status</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <template v-if="loading">
                                <v-progress-circular
                                :size="30"
                                color="primary"
                                indeterminate
                                ></v-progress-circular
                                >Loading pls...
                            </template>
                            <template v-else>
                                <tbody v-if="getItems && getItems.length > 0">
                                <template v-for="(drug, index) in getItems">
                                    <tr :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ drug.name }}</td>
                                    <td>{{ drug.available_qty }}</td>
                                    <td>{{ drug.price }}</td>
                                    <td>
                                        <v-chip class="ma-2" color="green" outlined v-if="drug.status == 1" >Active</v-chip>
                                        <v-chip class="ma-2" color="pink" outlined v-else >Disabled</v-chip>
                                    </td>
                                    <th class="no-print">
                                        
                                    </th>
                                    
                                    </tr>
                                </template>
                                </tbody>

                                <tr v-else>
                                <td colspan="5">
                                    <v-flex xs12 style="text-align:center;">
                                    <img src="../../assets/addnewitem.svg" />
                                    </v-flex>
                                </td>
                                </tr>
                            </template>
                        </table>
                    </v-flex>
                </v-flex>
            </v-layout>
            <base-pagination :total="diagnosis.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
        </v-container>
        </v-card>
        <v-dialog v-model="authDialog" persistent left top width="400px">
            <v-card>
                <v-container grid-list-sm class="pa-4">
                <base-authorization @authUser="authUser" @closeAuth="closeAuth" />
                </v-container>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
var fs = require("fs");
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
    name: "Department",
    data: () => ({
        scheme:'',
        page:1,
        pageSize: 50,
        diagnosis: [],
        search: "",
        addDrugsDialog: false
    }),
    components: {},
    props: {
        source: String
    },
    computed: {
        ...mapState(["domain", "outlet", "settings"]),
        getTitle(){
            return this.diagnosis.title;
        },
        getItems(){
            return this.diagnosis.result
        }
    },

    methods: {
        ...mapActions(["setDomain", "setSearch", "checkStorage"]),
        changePage: function(pageItems) {
            this.page=pageItems.page;
            this.pageSize=pageItems.pageSize;
            this.search=pageItems.search;
            this.loadDrugs();
        },
        loadDiagnosis: function() {
            this.$Progress.start();
            let payload={
                scheme: this.scheme,
                outlet: this.outlet,
                page: this.page,
                pageSize: this.pageSize,
                search: this.search,
                action: 'diagnosis'
            }
            this.post("/scheme/supported", payload)
            .then(resp => {
                if(resp.status>0){
                    this.diagnosis = resp.response;
                }else{
                    this.$toastr.error(resp.message)
                }
            })
            .finally(() => {
                this.$Progress.finish();
            });
        },
    },
    beforeMount() {
        this.setDomain();
        this.checkStorage();
    },
    mounted() {
        this.scheme=this.$route.params.scheme;
        setTimeout(this.loadDiagnosis, 200);
    }
};
</script>
<style scoped></style>
