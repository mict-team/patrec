<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)" white-text
        ><v-icon>keyboard_arrow_left</v-icon>Back</v-btn
      >
      <v-toolbar-title>New product</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="primary" @click="saveProduct"
        ><v-icon>save</v-icon>Save</v-btn
      >
      <v-btn class="primary" @click="$router.push('upload-drug')"
        ><v-icon>cloud_upload</v-icon>Upload</v-btn
      >
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout>
          <v-row>
            <v-col col="12" md="3">
              <picture-input
                ref="pictureInput"
                @change="uploadPicture"
                width="600"
                height="600"
                margin="16"
                accept="image/jpeg,image/png"
                size="10"
                buttonClass="btn"
                :customStrings="{
                  upload: '<h1>Upload item picture!</h1>',
                  drag: 'Drag a 😺 GIF or GTFO'
                }"
              />
            </v-col>
            <v-col col="12" md="9">
              <v-row>
                <v-col col="12" md="12">
                  <label class="control-label">Product name</label>
                  <input
                    type="text"
                    id="name"
                    class="form-control"
                    placeholder="Product name"
                    v-model="drugs.name"
                  />
                </v-col>
                <v-col col="12" md="12">
                  <label class="control-label">Product category</label>
                  <v-select
                  v-model="drugs.category"
                  :items="categories"
                  label="Select category"
                  item-text="name"
                  item-value="id"
                  dense
                  solo
                  ></v-select>
                </v-col>
                <v-col col="12" md="12">
                  <label class="control-label">Product brand</label>
                  <v-select
                  v-model="drugs.brand"
                  :items="brands"
                  label="Select brand"
                  item-text="name"
                  item-value="id"
                  dense
                  solo
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>
            <v-col col="12" md="12">
              <label class="control-label">Product description</label>
              <textarea
                class="form-control"
                placeholder="Product description"
                v-model="drugs.description"
                rows="5"
              ></textarea>
            </v-col>
          </v-row>
        </v-layout>
      </v-container>
    </v-card>
    
    <v-card>
      <v-toolbar row wrap>
        <v-toolbar-title>Product detail</v-toolbar-title>
      </v-toolbar>
      <v-container grid-list-sm class="pa-4">
        <v-layout>
          <v-row>
            <v-col col="12" md="3">
              <label class="control-label">Product qty</label>
              <input
                type="text"
                id="location"
                class="form-control "
                placeholder="Cost price"
                v-model="drugs.qty"
                value="1"
                required
              />
              <v-switch
                v-model="drugs.make_opening_stock"
                inset
                label="Make opening stock"
              ></v-switch>
            </v-col>
            <v-col col="12" md="3">
              <label class="control-label">Alert qty</label>
              <input
                type="text"
                id="location"
                class="form-control"
                placeholder="Alert qty"
                v-model="drugs.alert_qty"
                value="5"
                required
              />
            </v-col>
            <v-col col="12" md="3">
              <label class="control-label">Expiry date</label>
              <v-menu
                v-model="modalexpiry"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <input
                    type="text"
                    class="form-control"
                    v-model="drugs.expiry_date"
                    placeholder="Expiry date"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="drugs.expiry_date"
                  @input="modalexpiry = false"
                  :landscape="true"
                  :relative="true"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col col="12" md="3">
              <label class="control-label">Selling Unit</label>
              <input
                type="text"
                id="location"
                class="form-control"
                placeholder="Selling"
                v-model="drugs.selling_unit"
                value=""
              />
            </v-col>
          </v-row>
        </v-layout>
      </v-container>
    </v-card>
    
    <v-card>
      <v-toolbar row wrap>
        <v-toolbar-title>Product type</v-toolbar-title>
      </v-toolbar>
      <v-container grid-list-sm class="pa-4">
        <v-layout>
          <v-row>
            <v-col col="12" md="12">
              <v-radio-group v-model="drugs.product_type" row>
                <v-radio label="Normal product" value="normal"></v-radio>
                <v-radio label="Composite product" value="composite" ></v-radio>
              </v-radio-group>
            </v-col>
            <template v-if="drugs.product_type == 'composite'">
              <v-col col="12" md="12">
                <base-mictComboBox :items="products" v-on:select="selectItems" />
              </v-col>
              <v-col col="12" md="12">
                <table class="table table-stripped">
                  <thead>
                    <th>#</th>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Qty to use</th>
                    <th>Subtotal</th>
                    <th></th>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(prod, index) in drugs.products"
                      :key="index"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>{{ prod.sku }}</td>
                      <td>{{ prod.name }}</td>
                      <td>{{ prod.available_qty }}</td>
                      <td>{{ prod.selling_price }}</td>
                      <td>
                        <input
                          type="text"
                          v-model="prod.qty"
                          class="form-control imput-sm"
                          @keyup="whatIsCompositeTotal(prod.qty, index)"
                        />
                      </td>
                      <td>{{ prod.total }}</td>
                      <td>
                        <v-icon @click="removeItem(index)"
                          >delete_forever</v-icon
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-col>
            </template>
          </v-row>
        </v-layout>
      </v-container>
    </v-card>
    
    <v-card>
      <v-toolbar row wrap>
        <v-toolbar-title>Pricing</v-toolbar-title>
      </v-toolbar>
      <v-container grid-list-sm class="pa-4">
      <v-layout>
        <v-row>
          <v-col col="12" md="3">
            <label class="control-label">Cost price</label>
            <input
              type="text"
              id="costprice"
              class="form-control costprice"
              placeholder="Cost price"
              v-model="drugs.cost_price"
              required
              @keyup="calculate_selling_price($event)"
            />
          </v-col>
          <v-col col="12" md="3">
            <label class="control-label">Gain type</label>
            <select
              class="form-control select2me gain_type"
              placeholder="select"
              v-model="drugs.gain_type"
              required
              @change="calculate_selling_price($event)"
            >
              <option value="0" selected>Fixed</option>
              <option value="%">Percentage</option>
            </select>
          </v-col>
          <v-col col="12" md="3">
            <label class="control-label">Gain Margin</label>
            <input
              type="text"
              class="form-control gain_margin"
              placeholder="0"
              v-model="drugs.gain_margin"
              @keyup="calculate_selling_price($event)"
            />
          </v-col>
          <v-col col="12" md="3">
            <label class="control-label">Selling price</label>
            <input
              type="text"
              class="form-control seelingprice"
              placeholder="Selling price"
              v-model="drugs.selling_price"
              require
            />
          </v-col>
        </v-row>

      </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { URL, LS, SHA256, compress } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
import PictureInput from "vue-picture-input";
export default {
  name: "Mainstore",
  data: () => ({
    loading: false,
    error: "",
    storeName: "New product",
    products: [],
    drugs: {},
    categories: [],
    brands: [],
    loadingDialog: false,
    addNew: true,
    modalexpiry: false,
    avatar: "../../assets/no_image.png"
  }),
  props: {
    source: String
  },
  components: {
    PictureInput
  },

  computed: {
    ...mapState(["domain", "outlet"])
  },
  methods: {
    ...mapActions(["setDomain", "setDrugs", "addDrugs", "checkStorage"]),
    reset: function() {
      this.drugs = {
        outlet:"",
        name: "",
        category: "",
        brand: "",
        picture: "",
        description: "",
        qty: 1,
        alert_qty: 1,
        expiry_date: "",
        selling_unit: "",
        make_opening_stock: false,
        product_type: "normal",
        products: [],
        cost_price: 0,
        selling_price: 0,
        gain_type: "0",
        gain_margin: 0
      };
    },
    uploadPicture: function(image) {
      if (image) {
        this.drugs.picture = image;
        var dataUrl = image.split(",");
        //this.drugs.picture=`${dataUrl[0]},${dataUrl[1]}`;
      } else {
        console.log("FileReader API not supported: use the <form>, Luke!");
      }
    },
    loadCategory: function() {
      this.get("/category")
        .then(response => {
          if (response.status > 0) {
            this.categories = response.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
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
          this.$toastr.error(e.message);
        });
    },

    loadProducts: function() {
      this.get("/drugs")
        .then(response => {
          if (response.status > 0) {
            this.products = response.response;
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    selectItems: function(index) {
      index.item.qty = 1;
      index.item.total = index.item.qty * index.item.selling_price;
      this.drugs.products.push(index.item);
    },
    removeItem: function(index) {
      this.drugs.products.splice(index);
    },
    whatIsCompositeTotal: function(qty, index) {
      this.drugs.products[index].total =
        qty * this.drugs.products[index].selling_price;
    },
    calculate_selling_price: function(event) {
      if (this.drugs.cost_price == "") {
        this.drugs.cost_price = 1;
      }
      if (this.drugs.gain_margin == "") {
        this.drugs.gain_margin = 1;
      }
      let val = this.drugs.gain_type;

      if (val == 0) {
        this.drugs.selling_price =
          parseFloat(this.drugs.cost_price) +
          parseFloat(this.drugs.gain_margin);
      } else {
        var percent =
          (parseFloat(this.drugs.gain_margin) / 100) *
          parseFloat(this.drugs.cost_price);
        this.drugs.selling_price =
          parseFloat(this.drugs.cost_price) + parseFloat(percent);
      }
    },
    saveProduct: function() {
      if (this.drugs.name == "") {
        this.$toastr.error("Product name cannot be emptied.");
        return false;
      }
      if (this.drugs.cost_price == "") {
        this.$toastr.error("Product cost price cannot be emptied.");
        return false;
      }
      if (this.drugs.selling_price == "") {
        this.$toastr.error("Product selling price cannot be emptied.");
        return false;
      }
      this.drugs.outlet = this.outlet.id;
      this.drugs.action = "product";
      //console.log(this.drugs);
      this.post("/drugs", this.drugs)
        .then(resp => {
          if (resp.status > 0) {
            this.$toastr.success(resp.message);
            this.reset();
          } else {
            this.$toastr.error(resp.message);
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    }
  },
  created() {
    this.checkStorage();
    this.setDomain();
    this.reset();
    this.loadCategory();
    this.loadBrand();
    this.loadProducts();
  },
  mounted() {
    setTimeout(this.loadDrugs, 1000);
    //this.switchStore();
  }
};
</script>

<style scoped>

</style>
