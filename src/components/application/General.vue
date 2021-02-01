<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" white-text
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>
        <v-tabs v-model="tab">
          <v-tab>General</v-tab>
          <v-tab>Almona</v-tab>
          <v-tab>Pharmacy</v-tab>
          <v-tab>Receipt</v-tab>
        </v-tabs>
      </v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4 px-8">
        <v-layout row>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-flex xs12 row wrap>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.general.central_nurses_station"
                      inset
                      label="Centralised nurses station"
                    ></v-switch
                  ></v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.general.central_ward_admin"
                      inset
                      label="Centralised ward administration"
                    ></v-switch
                  ></v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.general.follow_sequence"
                      inset
                      label="Generate patient code sequentially"
                    ></v-switch
                  ></v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.general.allow_fingerprint"
                      inset
                      label="Allow fingerprint"
                    ></v-switch
                  ></v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.general.auth_before_edit"
                      inset
                      label="User must authorize before edit"
                    ></v-switch
                  ></v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.general.pay_before_service"
                      inset
                      label="User must pay before service"
                    ></v-switch
                  ></v-flex>
                  
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.general.allow_transaction_type"
                      inset
                      label="Allow transaction type"
                    ></v-switch
                  ></v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.general.waver_lock"
                      inset
                      label="User must authenticate for discount"
                    ></v-switch
                  ></v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.general.collapse_all_laboratory"
                      inset
                      label="Collapse all laboratory into one"
                    ></v-switch
                  ></v-flex>
                </v-flex>
                <v-divider />
                <v-flex xs12 row>
                  <v-spacer></v-spacer>
                  <v-btn class="primary" @click="saveGeneral"><v-icon>save</v-icon>Save</v-btn>
                </v-flex>
              </v-tab-item>
              <v-tab-item>
                <v-flex xs12 row wrap>
                  <v-flex xs3>
                    <v-switch
                      v-model="settings.almona.allow_discount"
                      inset
                      label="Allow user to give discount"
                    ></v-switch>
                  </v-flex>
                  <v-flex xs3>
                    <v-switch
                      v-model="settings.almona.show_sales_summary"
                      inset
                      label="Allow sales summary before logout"
                    ></v-switch>
                  </v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.general.allow_operator_edit_total_amount"
                      inset
                      label="Allow user to edit total amount"
                    ></v-switch
                  ></v-flex>
                </v-flex>
                <v-divider />
                <v-flex xs12 row>
                  <v-spacer></v-spacer>
                  <v-btn class="primary" @click="saveAlmona"><v-icon>save</v-icon>Save</v-btn>
                </v-flex>
              </v-tab-item>
              <v-tab-item>
                <v-flex xs12 row wrap>
                  <v-flex xs3>
                    <v-switch
                      v-model="settings.pharmacy.allow_negative_inventory"
                      inset
                      label="Allow negative inventory"
                    ></v-switch>
                  </v-flex>
                  <v-flex xs3>
                    <v-switch
                      v-model="settings.pharmacy.allow_sales_for_items_lower_alert_qty"
                      inset
                      label="Allow sales of items lower than alert qty"
                    ></v-switch>
                  </v-flex>
                  <v-flex xs3>
                    <v-switch
                      v-model="settings.pharmacy.allow_discount"
                      inset
                      label="Allow user to give discount"
                    ></v-switch>
                  </v-flex>
                  <v-flex xs3>
                    <v-switch
                      v-model="settings.pharmacy.show_sales_summary"
                      inset
                      label="Allow sales summary before logout"
                    ></v-switch>
                  </v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.general.allow_operator_edit_total_amount"
                      inset
                      label="Allow user to edit total amount"
                    ></v-switch
                  ></v-flex>
                </v-flex>
                <v-divider />
                <v-flex xs12 row>
                  <v-spacer></v-spacer>
                  <v-btn class="primary" @click="savePharmacy"><v-icon>save</v-icon>Save</v-btn>
                </v-flex>
              </v-tab-item>
              <v-tab-item>
                <v-flex xs12 row wrap>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.receipt.show_patient_code"
                      inset
                      label="Show patient code sequentially"
                    ></v-switch
                  ></v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.receipt.show_phone_no"
                      inset
                      label="Show payer phone number"
                    ></v-switch
                  ></v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.receipt.show_dob"
                      inset
                      label="Show payer date of birth"
                    ></v-switch
                  ></v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.receipt.show_gender"
                      inset
                      label="Show payer gender"
                    ></v-switch
                  ></v-flex>
                  <v-flex xs3
                    ><v-switch
                      v-model="settings.receipt.show_address"
                      inset
                      label="Show payer address"
                    ></v-switch
                  ></v-flex>
                </v-flex>
                <v-divider />
                <v-flex xs12 row>
                  <v-spacer></v-spacer>
                  <v-btn class="primary" @click="saveReceipt"><v-icon>save</v-icon>Save</v-btn>
                </v-flex>
              </v-tab-item>
            </v-tabs-items>
        </v-layout>
        
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Settings",
  data: () => ({
    tab: null,
    store: [],
    error: "",
    currentSession: [],
    loadingDialog: false,
    Newdialog: false,
    message: "",
    settings: {
      general: {
        follow_sequence: false,
        allow_fingerprint: false,
        auth_before_edit: false,
        pay_before_service: false,
        allow_operator_edit_total_amount: false,
        allow_transaction_type: false,
        waver_lock: false,
        central_nurses_station: false,
        central_ward_admin: false,
        collapse_all_laboratory: false,
        allow_cross_case_treatment: false
      },
      receipt: {
        show_patient_code: false,
        show_phone_no: false,
        show_dob: false,
        show_gender: 0,
        show_address: false
      },
      almona: { 
        allow_discount: false, 
        show_sales_summary: false,
        allow_operator_edit_total_amount: false 
      },
      pharmacy: {
        allow_negative_inventory: false,
        allow_sales_for_items_lower_alert_qty: false,
        show_qty_on_item_list: false,
        allow_discount: false,
        show_sales_summary: false,
        allow_operator_edit_total_amount: false
      }
    }
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet"])
  },

  methods: {
    ...mapActions([
      "checkStorage"
    ]),
    stringToObj: function(path, value, obj) {
      var parts = path.split("."),
        part;
      var last = parts.pop();
      while ((part = parts.shift())) {
        if (typeof obj[part] != "object") obj[part] = {};
        obj = obj[part]; // update "pointer"
      }
      obj[last] = value;
      //return obj;
    },
    toggle: function(index, value, event) {
      this.stringToObj(index, value, this.settings);
    },
    loadSettings: function() {
      this.$Progress.start();
      this.get(`/settings/${this.outlet.id}`)
      .then(resp => {
        if (resp.status > 0) {
          this.settings= {
            general: {
              follow_sequence: (resp.response.general.follow_sequence)?resp.response.general.follow_sequence: false,
              allow_fingerprint:  (resp.response.general.allow_fingerprint)?resp.response.general.allow_fingerprint: false,
              auth_before_edit:  (resp.response.general.auth_before_edit)?resp.response.general.auth_before_edit: false,
              pay_before_service:  (resp.response.general.pay_before_service)?resp.response.general.pay_before_service: false,
              allow_transaction_type:  (resp.response.general.allow_transaction_type)?resp.response.general.allow_transaction_type: false,
              waver_lock:  (resp.response.general.waver_lock)?resp.response.general.waver_lock: false,
              central_nurses_station:  (resp.response.general.central_nurses_station)?resp.response.general.central_nurses_station: false,
              central_ward_admin:  (resp.response.general.central_ward_admin)?resp.response.general.central_ward_admin: false,
              collapse_all_laboratory:  (resp.response.general.collapse_all_laboratory)?resp.response.general.collapse_all_laboratory: false
            },
            receipt: {
              show_patient_code:  (resp.response.receipt.show_patient_code)?resp.response.receipt.show_patient_code: false,
              show_phone_no:  (resp.response.receipt.show_phone_no)?resp.response.receipt.show_phone_no: false,
              show_dob:  (resp.response.receipt.show_dob)?resp.response.receipt.show_dob: false,
              show_gender:  (resp.response.receipt.show_gender)?resp.response.receipt.show_gender: false,
              show_address:  (resp.response.receipt.show_address)?resp.response.receipt.show_address: false
            },
            almona: { 
              allow_discount:  (resp.response.almona.allow_discount)?resp.response.almona.allow_discount: false, 
              show_sales_summary:  (resp.response.almona.show_sales_summary)?resp.response.almona.show_sales_summary: false ,
              allow_operator_edit_total_amount:  (resp.response.general.allow_operator_edit_total_amount)?resp.response.general.allow_operator_edit_total_amount: false,
            },
            pharmacy: {
              allow_negative_inventory:  (resp.response.pharmacy.allow_negative_inventory)?resp.response.pharmacy.allow_negative_inventory: false,
              allow_sales_for_items_lower_alert_qty:  (resp.response.pharmacy.allow_sales_for_items_lower_alert_qty)?resp.response.pharmacy.allow_sales_for_items_lower_alert_qty: false,
              show_qty_on_item_list:  (resp.response.pharmacy.show_qty_on_item_list)?resp.response.pharmacy.show_qty_on_item_list: false,
              allow_discount:  (resp.response.pharmacy.allow_discount)?resp.response.pharmacy.allow_discount: false,
              show_sales_summary:  (resp.response.pharmacy.show_sales_summary)?resp.response.pharmacy.show_sales_summary: false,
              allow_operator_edit_total_amount:  (resp.response.general.allow_operator_edit_total_amount)?resp.response.general.allow_operator_edit_total_amount: false
            }
          }
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    },
    saveGeneral: function(){
      var postdata = {
        general: this.settings.general,
        action: 'general'
      };
      this.saveSettings(postdata)
    },
    saveAlmona: function(){
      var postdata = {
        almona: this.settings.almona,
        action: 'almona'
      };
      this.saveSettings(postdata)
    },
    savePharmacy: function(){
      var postdata = {
        receipt: this.settings.receipt,
        action: 'receipt'
      };
      this.saveSettings(postdata)
    },
    saveReceipt: function(){
      var postdata = {
        pharmacy: this.settings.pharmacy,
        action: 'pharmacy'
      };
      this.saveSettings(postdata)
    },
    saveSettings: function(postdata) {
      this.$Progress.start();

      this.post(`/settings/${this.outlet.id}`, postdata)
      .then(resp => {
        if (resp.status > 0) {
          LS.set("settings", {
            general: this.settings.general,
            receipt: this.settings.receipt,
            almona: this.settings.almona,
            pharmacy: this.settings.pharmacy
          });
          this.$toastr.success(resp.message);
          this.loadSettings();
        } else {
          this.$toastr.error(resp.message);
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    }
  },
  mounted() {
    this.checkStorage();
    setTimeout(this.loadSettings, 200);
  }
};
</script>

<style scoped></style>
