<template>
    <v-container id="print">
        <v-toolbar row wrap>
            <v-btn color="red" white-text><v-icon>keyboard_arrow_left</v-icon>Back</v-btn>
            <v-toolbar-title>Sales register summary</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn class="primary no-print" @click="finallyCloseRegister">Close register</v-btn>
            <v-btn class="danger no-print" @click="printRegister">Printer</v-btn>
        </v-toolbar>
        <v-card>
            <v-container grid-list-sm class="pa-4">
                <v-layout row wrap>
                    <v-row>
                        <v-col col='12' md="8" v-if="settings.almona && settings.almona.show_sales_summary">
                            <v-card>
                                <table class="table table-border">
                                    <tbody>
                                        <tr><th>No of Transactions:</th><td>{{registerDetail.sales}}</td></tr>
                                        <tr><th>Opening Cash:</th><td>{{registerDetail.opening | toDecimal}}</td></tr>
                                        <tr><th>Subtotal:</th><td>{{registerDetail.subtotal | toDecimal}}</td></tr>
                                        <tr><th>Discount:</th><td>{{registerDetail.discount | toDecimal}}</td></tr>
                                        <tr><th>Balance:</th><td>{{registerDetail.balance | toDecimal}}</td></tr>
                                        
                                        <tr><th>Total Refund/Expense:</th><td>{{registerDetail.expense | toDecimal}}</td></tr>
                                        <tr><th>Total Cash:</th><td>{{getTotal | toDecimal}}</td></tr>
                                    </tbody>
                                </table>
                            </v-card>
                        </v-col>
                        <v-col col='12' md="4">
                            <v-card>
                                <table class="table table-border">
                                    <tbody v-for="(met, ind) in methods" :key="`method_${ind}`">
                                        <tr><th>{{ind+1}}. {{met.name}}:</th><td>{{met.amount | toDecimal}}</td></tr>
                                    </tbody>
                                </table>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row class=" blue">
                        <v-col col='12' md="4">
                            <div clas="form-group" >
                                <label class="control-label">Total Cash:*</label>
                                <input type="text" name="cash" class="form-control" v-model="summaryDetail.cash"/>
                            </div>
                        </v-col>
                        <v-col col='12' md="4">
                            <div clas="form-group" >
                                <label class="control-label">Total Card Slips:*</label>
                                <input type="text" name="card" class="form-control" v-model="summaryDetail.card"/>
                            </div>
                        </v-col>
                        <v-col col='12' md="4">
                            <div clas="form-group" >
                                <label class="control-label">Total cheques:*</label>
                                <input type="text" name="cheques" class="form-control" v-model="summaryDetail.cheques"/>
                            </div>
                        </v-col>
                        <v-col col='12' md="12">
                            <div clas="form-group" >
                                <label class="control-label">Closing Note:</label>
                                <textarea col="100%" rows="3" class="form-control" v-model="summaryDetail.remarks"></textarea>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col col='12' md="12" v-if="settings.almona && settings.almona.show_sales_summary">
                            <v-card>
                                <v-card-title><h3>Register detail </h3></v-card-title>
                                <v-card-text>
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>SN</th>
                                                <th>Receipt</th>
                                                <th>Patient</th>
                                                <th>Paid for</th>
                                                <th>Subtotal</th>
                                                <th>Discount</th>
                                                <th>Balance</th>
                                                <th>VAT</th>
                                                <th>Total</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in list" :key="`list_${index}`">
                                                <td class="disable">{{ index + 1 }}</td>
                                                <td class="disable">{{ item.receipt }}</td>
                                                <td class="disable">{{item.patient}}</td>
                                                <td class="disable">{{description(item.items)}}</td>
                                                <td class="disable">{{ item.subtotal | toDecimal}}</td>
                                                <td class="disable">{{ item.discount | toDecimal }}</td>
                                                <td class="disable">{{ item.balance | toDecimal }}</td>
                                                <td class="disable">{{ item.vat | toDecimal }}</td>
                                                <td class="disable">{{ item.total | toDecimal }}</td>
                                                <td class="disable">{{ item.date }}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot v-if="list.length<1">
                                            <tr>
                                                <td colspan="10">
                                                    <v-flex xs12 style="text-align:center;">
                                                        <img src="../../../assets/addnewitem.svg" />
                                                    </v-flex>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>    
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-layout>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { URL, LS, APP, SHA256 } from "../../../shared/config.js";
export default {
    data(){
        return{
            registerDetail: [],
            list: [],
            expList: [],
            sensor: [],
            methods: [],
            summaryDetail:{
                outlet:0,
                register:[],
                cash:0.0,
                card:0.0,
                cheques:0.0,
                remarks:'',
                date:''
            },
        }
    },
    props: {
        source: String
    },
    computed:{
        ...mapState([
            "outlet",
            "departments",
            "users",
            "register",
            "settings"
        ]),
        getTotal(){
            //console.log(this.registerDetail)
            return parseFloat(this.registerDetail.total) + parseFloat(this.registerDetail.opening)-parseFloat(this.registerDetail.expense)
        }
    },
    methods:{
        ...mapActions(["checkStorage"]),
        loadRegisterSummary: function() {
            this.$Progress.start();
            var parameters = {
                outlet: this.outlet.id,
                register: this.register.id,
                user: this.users.id,
                isClose: 1,
                action:'account-summary'
            };
            this.post("/open-register", parameters)
            .then(resp => {
                if (resp.status > 0) {
                    this.registerDetail = resp.response.summary;
                    this.list = resp.response.detail;
                    this.expList = resp.response.expense;
                    this.methods=resp.response.methods;
                }
            })
            .finally(() => {
                this.$Progress.finish();
            })
            .then(() => {});
        },
        finallyCloseRegister: function() {

            if (this.summaryDetail.cash == "") {
                alert("Sorry, you must provide the cash summary of today collection.");
                return false;
            }
            this.summaryDetail.register = this.register;
            var sum =
                parseFloat(this.registerDetail.total) +
                parseFloat(this.registerDetail.opening) -
                parseFloat(this.registerDetail.expense);
            var current =
                parseFloat(this.summaryDetail.cash) +
                parseFloat(this.summaryDetail.card) +
                parseFloat(this.summaryDetail.cheques);
            //console.log(`sum:${sum} current:${current}`);
            if (parseFloat(sum) != parseFloat(current) && this.settings.almona && this.settings.almona.show_sales_summary) {
                alert("Entered amount must equal to the expect total cash.");
                return false;
            }
            this.$Progress.start();
            this.summaryDetail.date = this.today;
            var postData = {
                outlet: this.outlet.id,
                params: this.summaryDetail
            };

            this.post("/close-register", postData)
            .then(response => {
                if (response.status > 0) {
                    this.$toastr.success("Register closed successfully.");
                    this.$router.push("/home");
                } else {
                    this.$toastr.error("Sorry, error occured from the server while closing your register.");
                }
            })
            .finally(() => {
                this.$Progress.finish();
            });
        },
        description(item){
            //console.log(item) @click.stop="drawer = false"
            var desc='';
            for(var i=0; i<item.length; i++){
                desc += item[i]['name'] +"("+ item[i]['sku'] +")="+ item[i]['total'] +";";
            }
            return desc;
        },
        printRegister: function() {
            //window.print();
            let stylesHtml = "";
            for (const node of [
                ...document.querySelectorAll('link[rel="stylesheet"], style')
            ]) {
                stylesHtml += node.outerHTML;
            }

            const prtHtml = this.jQuery("#print").html();
            var content = `<!DOCTYPE html>
                            <html>
                            <head>
                                ${stylesHtml}
                            </head>
                            <body>
                                ${prtHtml}
                            </body>
                            </html>`;
            ipcRenderer.send("readyToPrint");
        }
    },
    mounted(){
        this.checkStorage();
        setTimeout(this.loadRegisterSummary, 200);
    }
}
</script>

<style>

</style>