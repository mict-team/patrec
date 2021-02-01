<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)" white-text
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>Upload drugs</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-flex x10></v-flex>
      <v-flex xs2 row>
        <v-flex xs12
          ><button class="btn btn-primary" @click="$router.push('/add-drugs')">
            Add items
          </button></v-flex
        >
      </v-flex>
    </v-toolbar>
    <v-card>
      <v-card-title class="grey lighten-4 py-4 title">
        Upload drugs
      </v-card-title>
      <v-container grid-list-sm class="pa-4">
        <v-flex xs12>
          <upload-file accept=".csv" v-on:sendFile="loadCSV" />
        </v-flex>
      </v-container>
      <v-card-actions>
        <div class="col-md-5">
          <ProgressBar :options="options" :value="progress" />
        </div>
        <v-btn @click="uploadDrug" :disabled="!fileContent">Upload drugs</v-btn>
        <v-btn class="btn btn-success" @click="downloadFormat"
          >Download file format</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout>
          <v-flex xs12>
            <strong
              >Follow the instructions carefully before importing the
              file.</strong
            ><br />
            <p>The columns of the CSV file should be in the following order.</p>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <table class="table table-striped">
              <tr>
                <th>Column Number</th>
                <th>Column Name</th>
                <th>Instruction</th>
              </tr>
              <tr>
                <td>1</td>
                <td>
                  Product Name <small class="text-muted">(Required)</small>
                </td>
                <td>Name of the product</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Brand <small class="text-muted">(Optional)</small></td>
                <td>
                  Name of the brand <br /><small class="text-muted"
                    >(If not found new brand with the given name will be
                    created)</small
                  >
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Unit <small class="text-muted">(Required)</small></td>
                <td>Name of the unit</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Category <small class="text-muted">(Optional)</small></td>
                <td>
                  Name of the Category <br /><small class="text-muted"
                    >(If not found new category with the given name will be
                    created)</small
                  >
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td>
                  Sub category <small class="text-muted">(Optional)</small>
                </td>
                <td>
                  Name of the Sub-Category <br /><small class="text-muted"
                    >(If not found new sub-category with the given name under
                    the <br />
                    parent Category will be created)</small
                  >
                </td>
              </tr>
              <tr>
                <td>6</td>
                <td>SKU <small class="text-muted">(Optional)</small></td>
                <td>
                  Product SKU. If blank an SKU will be automatically generated
                </td>
              </tr>
              <tr>
                <td>7</td>
                <td>
                  Barcode Type
                  <small class="text-muted">(Optional, Default: C128)</small>
                </td>
                <td>
                  Barcode Type for the product. <br />
                  <strong
                    >Currently supported: C128, C39, EAN-13, EAN-8, UPC-A,
                    UPC-E, ITF-14</strong
                  >
                </td>
              </tr>
              <tr>
                <td>8</td>
                <td>
                  Manage Stock? <small class="text-muted">(Required)</small>
                </td>
                <td>
                  Enable or disable stock managemant<br />
                  <strong
                    >1 = Yes<br />
                    0 = No</strong
                  >
                </td>
              </tr>
              <tr>
                <td>9</td>
                <td>
                  Alert quantity
                  <small class="text-muted"
                    >(Required if Manage Stock is 1)</small
                  >
                </td>
                <td>Alert quantity</td>
              </tr>
              <tr>
                <td>10</td>
                <td>Expires in <small class="text-muted">(Optional)</small></td>
                <td>Product expiry period (Only in numbers)</td>
              </tr>
              <tr>
                <td>11</td>
                <td>
                  Expiry Period Unit
                  <small class="text-muted">(Optional)</small>
                </td>
                <td>
                  Unit for the expiry period<br />
                  <strong>Available Options: days, months</strong>
                </td>
              </tr>
              <tr>
                <td>12</td>
                <td>
                  Applicable Tax <small class="text-muted">(Optional)</small>
                </td>
                <td>
                  Name of the Tax Rate <br /><br />If purchase Price (Excluding
                  Tax) is not same as <br />Purchase Price (Including Tax)
                  <br />then you must supply the tax rate name.
                </td>
              </tr>
              <tr>
                <td>13</td>
                <td>
                  Selling Price Tax Type
                  <small class="text-muted">(Required)</small>
                </td>
                <td>
                  Selling Price Tax Type <br />
                  <strong>Available Options: inclusive, exclusive</strong>
                </td>
              </tr>
              <tr>
                <td>14</td>
                <td>
                  Product Type <small class="text-muted">(Required)</small>
                </td>
                <td>
                  Product Type <br />
                  <strong>Available Options: single, variable</strong>
                </td>
              </tr>
              <tr>
                <td>15</td>
                <td>
                  Variation Name
                  <small class="text-muted"
                    >(Required if product type is variable)</small
                  >
                </td>
                <td>Name of the variation (Ex: Size, Color etc )</td>
              </tr>
              <tr>
                <td>16</td>
                <td>
                  Variation Values
                  <small class="text-muted"
                    >(Required if product type is variable)</small
                  >
                </td>
                <td>
                  Values for the variation separated with '|' <br />
                  (Ex: Red|Blue|Green)
                </td>
              </tr>
              <tr>
                <td>17</td>
                <td>
                  Purchase Price (Including Tax)<br /><small class="text-muted"
                    >(Required if Purchase Price Excluding Tax is not
                    given)</small
                  >
                </td>
                <td>
                  Purchase Price (Including Tax) (Only in numbers)<br /><br />For
                  variable products '|' separated values with <br />the same
                  order as Variation Values <br />(Ex: 84|85|88)
                </td>
              </tr>
              <tr>
                <td>18</td>
                <td>
                  Purchase Price (Excluding Tax) <br /><small class="text-muted"
                    >(Required if Purchase Price Including Tax is not
                    given)</small
                  >
                </td>
                <td>
                  Purchase Price (Excluding Tax) (Only in numbers)<br /><br />For
                  variable products '|' separated values with <br />the same
                  order as Variation Values <br />(Ex: 84|85|88)
                </td>
              </tr>
              <tr>
                <td>19</td>
                <td>
                  Profit Margin % <small class="text-muted">(Optional)</small>
                </td>
                <td>
                  Profit Margin (Only in numbers)<br />
                  <small class="text-muted"
                    >If blank default profit margin for the <br />
                    business will be used</small
                  >
                </td>
              </tr>
              <tr>
                <td>20</td>
                <td>
                  Selling Price <small class="text-muted">(Optional)</small>
                </td>
                <td>
                  Selling Price (Only in numbers)<br />
                  <small class="text-muted"
                    >If blank selling price will be calculated <br />with the
                    given Purchase Price <br />and Applicable Tax
                  </small>
                </td>
              </tr>
              <tr>
                <td>21</td>
                <td>
                  Opening Stock <small class="text-muted">(Optional)</small>
                </td>
                <td>
                  Opening Stock (Only in numbers) <br /><br />For variable
                  products separate stock quantities with '|' <br />(Ex:
                  100|150|200)<br />
                </td>
              </tr>
              <tr>
                <td>22</td>
                <td>
                  Location
                  <small class="text-muted"
                    >(Optional) <br />If blank first business location will be
                    used</small
                  >
                </td>
                <td>Name of the business location<br /></td>
              </tr>
              <tr>
                <td>23</td>
                <td>
                  Expiry Date <small class="text-muted">(Optional)</small>
                </td>
                <td>
                  Stock Expiry Date <br /><b
                    >Format: mm-dd-yyyy; Ex: 11-25-2018</b
                  ><br />
                </td>
              </tr>
              <tr>
                <td>24</td>
                <td>
                  Enable Product description, IMEI or Serial Number
                  <small class="text-muted">(Optional, Default: 0)</small>
                </td>
                <td>
                  <strong
                    >1 = Yes<br />
                    0 = No</strong
                  ><br />
                </td>
              </tr>
              <tr>
                <td>25</td>
                <td>Weight <small class="text-muted">(Optional)</small></td>
                <td>Optional<br /></td>
              </tr>
              <tr>
                <td>26</td>
                <td>Rack <small class="text-muted">(Optional)</small></td>
                <td>
                  Rack details seperated by '|' for different business locations
                  serially.<br />
                  (Ex: R1|R5|R12)
                </td>
              </tr>
              <tr>
                <td>27</td>
                <td>Row <small class="text-muted">(Optional)</small></td>
                <td>
                  Row details seperated by '|' for different business locations
                  serially.<br />
                  (Ex: ROW1|ROW2|ROW3)
                </td>
              </tr>
              <tr>
                <td>28</td>
                <td>Position <small class="text-muted">(Optional)</small></td>
                <td>
                  Position details seperated by '|' for different business
                  locations serially.<br />
                  (Ex: POS1|POS2|POS3)
                </td>
              </tr>
              <tr>
                <td>29</td>
                <td>Image <small class="text-muted">(Optional)</small></td>
                <td>
                  Image name with extension.<br />
                  (Image name must be uploaded to the server img )
                </td>
                <td></td>
              </tr>
              <tr>
                <td>30</td>
                <td>
                  Product Description
                  <small class="text-muted">(Optional)</small>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>31</td>
                <td>
                  Custom Field1 <small class="text-muted">(Optional)</small>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>32</td>
                <td>
                  Custom Field2 <small class="text-muted">(Optional)</small>
                </td>
              </tr>
              <tr>
                <td>33</td>
                <td>
                  Custom Field3 <small class="text-muted">(Optional)</small>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>34</td>
                <td>
                  Custom Field4 <small class="text-muted">(Optional)</small>
                </td>
              </tr>
            </table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
import ProgressBar from "../../plugins/progressbar/ProgressBar";
import UploadFile from "../shared/UploadFile";
export default {
  name: "UploadDrugs",
  data: () => ({
    loading: false,
    error: "",
    storeName: "Main store",
    drugs: [],
    categories: [],
    brands: [],
    loadingDialog: false,
    progress: 0,
    fileContent: [],
    options: {
      text: {
        color: "#FFFFFF",
        shadowEnable: true,
        shadowColor: "#000000",
        fontSize: 14,
        fontFamily: "Helvetica",
        dynamicPosition: false,
        hideText: false
      },
      progress: {
        color: "#2dbd2d",
        backgroundColor: "#333333"
      },
      layout: {
        height: 35,
        width: "100",
        verticalTextAlign: 61,
        horizontalTextAlign: 43,
        zeroOffset: 0,
        strokeWidth: 30,
        progressPadding: 0,
        type: "line"
      }
    }
  }),
  props: {
    source: String
  },
  components: {
    UploadFile,
    ProgressBar
  },
  computed: {
    ...mapState(["domain", "outlet"])
  },
  methods: {
    ...mapActions(["setDomain", "setDrugs", "addDrugs", "checkStorage"]),
    loadCategory: function() {
      this.get("/category")
        .then(response => {
          if (response.status > 0) {
            this.categories = response.response;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    loadBrand: function() {
      this.get("/brand")
        .then(response => {
          if (response.status > 0) {
            this.brands = response.response;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },

    loadCSV: function(formData) {
      //console.log(formData)
      this.fileContent = formData;
    },
    uploadDrug: function() {
      //console.log(this.fileContent);
      //setTimeout(() => {   }, 2000);
      this.fileContent.append("action", "upProduct");
      this.progress = 5;
      this.post("/drugs", this.fileContent)
        .then(resp => {
          alert(response);
          if (resp.status > 0) {
            this.$toastr.success(resp.messsage);
          } else {
            this.$toastr.error(resp.messsage);
          }
        })
        .catch(e => {
          this.$toastr.error(e.messsage);
        });
    },
    downloadFormat: function() {
      this.download("file-format").then(resp => {
        this.$toastr.success("File downloaded successfully.");
      });
    }
  },
  created() {
    this.checkStorage();
    this.setDomain();
  },
  mounted() {
    setTimeout(this.loadDrugs, 1000);
    this.fileContent = new FormData();
    //this.switchStore();
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
