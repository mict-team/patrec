<template>
  <v-container>
    <v-card>
      <v-toolbar row wrap>
        <v-btn color="red" @click="$router.go(-1)" white-text
          ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
        >
        <v-toolbar-title></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="primary" @click="transferDialog = true"
          ><v-icon>mdi-domain-plus</v-icon>New supplier</v-btn
        >
        <v-btn class="danger" @click="printPage"
          ><v-icon>mdi-printer</v-icon>Print</v-btn
        >
      </v-toolbar>

      <v-container grid-list-sm class="pa-4" id="printMe">
        <v-layout row>
          <v-flex xs12>
            <table class="table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Name</th>
                  <th>Phone number</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody v-if="getItems.length > 0">
                <tr v-for="(item, index) in getItems" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.phone }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.address }}</td>
                  <td>
                    <v-btn icon small @click="viewSupply(index)"
                      ><v-icon color="blue">remove_red_eye</v-icon></v-btn
                    >
                  </td>
                </tr>
              </tbody>
              <tr v-else>
                <td colspan="9">
                  <v-flex xs12 style="text-align:center;">
                    <img src="../../assets/addnewitem.svg" />
                  </v-flex>
                </td>
              </tr>
            </table>
          </v-flex>
        </v-layout>
        <base-pagination :total="suppliers.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
      </v-container>
    </v-card>
    <v-dialog v-model="transferDialog" persistent left top width="550px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          New Supplier
          <v-spacer></v-spacer>
          <v-btn @click="transferDialog = false">Close</v-btn>
          <v-btn class="primary" @click="addSupplier">Add supplier</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <template v-if="isProcessing">
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular
            >Processing transfer...
          </template>
          <v-layout row>
            <v-flex xs12>
              <label class="control-label">Company name</label>
              <input
                type="text"
                v-model="supplier.name"
                class="form-control"
                placeholder="Company name"
              />
            </v-flex>
            <v-flex xs6>
              <label class="control-label">Contact phone number</label>
              <input
                type="text"
                v-model="supplier.phone"
                class="form-control"
                placeholder="Phone number"
              />
            </v-flex>
            <v-flex xs6>
              <label class="control-label">Email address</label>
              <input
                type="text"
                v-model="supplier.email"
                class="form-control"
                placeholder="Email address"
              />
            </v-flex>

            <v-flex x12>
              <label class="control-label">Contact address</label>
              <textarea
                v-model="supplier.address"
                class="form-control"
                placeholder="Contact address"
              ></textarea>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { URL, LS, SHA256, IDGenerator } from "../../shared/config.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "Transfer",
  data: () => ({
    loading: false,
    store: [],
    error: "",
    stores: [],
    paginate: [],
    loadingDialog: false,
    transferDialog: false,
    isProcessing: false,
    page:1,
    pageSize:50,
    search:'',
    supplier: {
      outlet:'',
      name: "",
      phone: "",
      email: "",
      address: ""
    },
    suppliers: []
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet"]),
    getItems() {
      return (this.suppliers.result)?this.suppliers.result:[];
    }
  },
  methods: {
    ...mapActions(["checkStorage"]),
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search=pageItems.search;
      this.loadDrugs();
    },
    loadSupply: function() {
      this.$Progress.start();
      this.loading = true;
      let payload={
        outlet: this.outlet.id,
        page: this.page,
        pageSize: this.pageSize,
        search: this.search,
        action:'loads'
      }
      this.post("/supplier", payload)
      .then(resp => {
        if (resp.status > 0) {
          this.suppliers = resp.response;
        }
      })
      .finally(() => {
        this.$Progress.finish();
        this.loading = false;
      });
    },
    addSupplier: function() {
      if (this.supplier.name == "") {
        this.$toastr.error("Supplier name cannot be emptied");
        return false;
      }
      if (this.supplier.phone == "") {
        this.$toastr.error("Supplier contact number cannot be emptied");
        return false;
      }
      if (this.supplier.address == "") {
        this.$toastr.error("Supplier contact address cannot be emptied");
        return false;
      }

      this.$Progress.start();
      this.supplier.outlet=this.outlet.id;
      this.supplier.action="save";
      this.isProcessing = true;
      this.post("/supplier", this.supplier)
      .then(resp => {
        if (resp.status > 0) {
          this.isProcessing = false;
          this.$toastr.success(resp.message)
          this.loadSupply();
        } else {
          this.$toastr.error(resp.message);
          this.isProcessing = false;
        }
      })
      .finally(() => {
        this.$Progress.finish();
        this.isProcessing = false;
      });
    },
    viewSupply: function(index) {
      this.transDetails = this.transfers[index];
      this.viewTransferDialog = true;
    },
    printPage: function() {
      this.$htmlToPaper("printMe");
    }
  },
  mounted() {
    this.checkStorage();
    this.user = LS.get("user");
    setTimeout(this.loadSupply, 200);
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
