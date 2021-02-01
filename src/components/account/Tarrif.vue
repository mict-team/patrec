<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title>Tarrifs</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn class="primary" @click="newtarrifDialog = true"
        ><v-icon>create_new_folder</v-icon>New tarrif</v-btn
      >
      <v-btn class="primary" @click="uploadtarrifDialog = true"
        ><v-icon>cloud_upload</v-icon>Upload tarrif</v-btn
      >
      <v-btn class="primary" @click="download"
        ><v-icon>cloud_download</v-icon>Download tarrif</v-btn
      >
      <v-btn class="danger" @click="printTarrif"
        ><v-icon>mdi-printer</v-icon>Print</v-btn
      >
    </v-toolbar>
    <v-card>
      <v-container grid-list-sm class="pa-4">
        <v-layout row wrap>
          <template v-if="isLoading">
            <v-progress-circular
                :size="30"
                color="primary"
                indeterminate
              ></v-progress-circular
              >Processing pls...
          </template>
          <template>
            <table class="table table-hover" ref="printPage">
              <thead>
                <tr>
                  <th>#</th>
                  <th>SKU</th>
                  <th>Dept</th>
                  <th>Name</th>
                  <th>Remark</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th class="no-print"></th>
                </tr>
              </thead>
              <tbody v-if="getItems">
                <tr v-for="(tarrif, index) in getItems" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ tarrif.sku }}</td>
                  <td>{{ tarrif.dept }}</td>
                  <td>{{ tarrif.name }}</td>
                  <td>{{ tarrif.remark }}</td>
                  <td>{{ tarrif.amount | toDecimal }}</td>
                  <td>
                    <v-chip class="ma-2" color="green" outlined v-if="tarrif.status == 1" >Active</v-chip>
                    <v-chip class="ma-2" color="pink" outlined v-else >Disabled</v-chip>
                  </td>
                  <th class="no-print">
                    <v-chip class="ma-2" color="blue" text-color="white" @click="editItem(tarrif)">
                      <v-icon left>edit</v-icon>Edit
                    </v-chip>
                    <v-chip class="ma-2" color="red" text-color="white" @click="disableItem(tarrif)">
                      <v-icon left>cancel</v-icon>Disable
                    </v-chip>
                  </th>
                </tr>
              </tbody>
              <tfoot v-else >
                <tr>
                  <td colspan="4">
                    <v-flex xs12 style="text-align:center;">
                      <img src="../../assets/addnewitem.svg" />
                    </v-flex>
                  </td>
                </tr>  
              </tfoot>
            </table>
          </template>
          
          
        </v-layout>
      </v-container>
    </v-card>
    <base-pagination :total="tarrifs.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />

    <v-dialog v-model="newtarrifDialog" persistent left top width="600px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          New Tarrif
          <v-spacer></v-spacer>
          <v-btn @click="newtarrifDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="savetarrif">Add item</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 v-if="isProcessing">
              <v-progress-circular
                :size="30"
                color="primary"
                indeterminate
              ></v-progress-circular
              >Processing pls...
            </v-flex>
            <v-flex xs12>
              <label>Department</label>
              <v-select
                v-model="newtarrif.dept"
                :items="filterdepts"
                item-text="name"
                item-value="id"
                label="Select department"
                dense
                solo
              >
              <template v-slot:prepend-item>
                <v-list-item ripple >
                  <v-list-item-content>
                    <v-list-item-title>
                      <input type="text" class="form-control" placeholder="Search..." @keypress="filterDept" v-model="searchText" />
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>
              </v-select>
              
            </v-flex>
            <v-flex xs8>
              <label>Tarrif name</label>
              <input
                class="form-control"
                type="text"
                v-model="newtarrif.name"
              />
            </v-flex>
            <v-flex xs4>
              <label>Tarrif duration</label>
              <v-select
                v-model="newtarrif.duration"
                :items="tarrifDuration"
                item-text="name"
                item-value="id"
                label="Select duration"
                :return-object="true"
                dense
                solo
              />
            </v-flex>
            <v-flex xs6>
              <label>Tarrif amount</label>
              <input
                class="form-control"
                type="text"
                v-model="newtarrif.amount"
              />
            </v-flex>
            <v-flex xs6>
              <label>Remark</label>
              <input
                class="form-control"
                type="text"
                v-model="newtarrif.remark"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="edittarrifModal" persistent left top width="600px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          New tarrif
          <v-spacer></v-spacer>
          <v-btn @click="edittarrifModal = false">Cancel</v-btn>
          <v-btn color="primary" @click="savetarrif">Post tarrif</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 v-if="isProcessing">
              <v-progress-circular
                :size="30"
                color="primary"
                indeterminate
              ></v-progress-circular
              >Processing pls...
            </v-flex>
            <v-flex xs12>
              <label>Department</label>
              
              <select
                class="form-control"
                placeholder="Dept"
                v-model="edittarrifContent.dept"
              >
                <option value="">..Select</option>
                <option
                  v-for="(sh, index) in filterdepts"
                  :key="index"
                  :value="sh.id"
                  :selected="edittarrifContent.dept_id == sh.id"
                  >{{ sh.name }}</option
                >
              </select>
            </v-flex>
            <v-flex xs8>
              <label>Tarrif name</label>
              <input
                class="form-control"
                type="text"
                v-model="edittarrifContent.name"
              />
            </v-flex>
            <v-flex xs4>
              <label>Tarrif duration</label>
              <v-select
                v-model="edittarrifContent.duration"
                :items="tarrifDuration"
                item-text="name"
                item-value="id"
                label="Select duration"
                :return-object="true"
                dense
                solo
              />
            </v-flex>
            <v-flex xs6>
              <label>Tarrif amount</label>
              <input
                class="form-control"
                type="text"
                v-model="edittarrifContent.amount"
              />
            </v-flex>
            <v-flex xs6>
              <label>Remark</label>
              <input
                class="form-control"
                type="text"
                v-model="edittarrifContent.remark"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="uploadtarrifDialog" persistent left top width="600px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Upload tarrif
          <v-spacer></v-spacer>
          <v-btn @click="uploadtarrifDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="submitUpload" :disabled="!isFileAttached">Post tarrif</v-btn>
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 v-if="isProcessing">
              <v-progress-circular
                :size="30"
                color="primary"
                indeterminate
              ></v-progress-circular
              >Processing pls...
            </v-flex>
            <v-flex xs12>
              <base-csv-input v-model="avatar">
                <div slot="activator">
                  <div class="box">
                    <input
                      type="file"
                      id="file-5"
                      ref="file"
                      class="inputfile inputfile-4"
                    />
                    <label for="file-5" ref="label" v-if="!avatar">
                      <figure>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="17"
                          viewBox="0 0 20 17"
                        >
                          <path
                            d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
                          />
                        </svg>
                      </figure>
                      <span>Choose a file&hellip;</span>
                    </label>
                    <div v-ripple v-if="avatar" class="mb-3">
                      <img
                        src="../../assets/csv-flat.png"
                        alt="avatar"
                        style="width:70px !important; height:70px !important;"
                      />
                    </div>
                  </div>
                  
                </div>
              </base-csv-input>
            </v-flex>
            <v-expansion-panels v-model="panel">
              <v-expansion-panel>
                <v-expansion-panel-header>
                  {{setUploadDescription}}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-select
                    v-model="uploadDept"
                    :items="departmentLs"
                    item-text="name"
                    item-value="id"
                    label="Select department"
                    :return-object="true"
                    dense
                    solo
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel >
                <v-expansion-panel-header>
                  File format: .csv(Comma Delimted). Click to see detail
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <table class="table table-hover table-highlight">
                    <thead>
                      <tr>
                        <th>#</th><th>Column name</th><th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>1</td><td>Name</td><td>The name of the Tarrif</td></tr>
                      <tr><td>2</td><td>Amount</td><td>The payable amount by customer.</td></tr>
                      <tr><td>3</td><td>Remark(Optional)</td><td>Extra detail/information about the tarrif</td></tr>
                      <tr><td>4</td><td>Qty(Optiona)</td><td>The payable amount by customer.</td></tr>
                      <tr><td>4</td><td>Duration(Optiona)</td><td>Is item dialy payment or one time.<br>
                      <span style="color:red">VALUES:</span>Onetime, Daily, Weekly, Monthly or Yearly</td></tr>
                    </tbody>
                  </table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="authDialog" persistent left top width="600px">
      <v-card>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap align-center>
            <base-authorization @authUser="authUser" @closeAuth="closeAuth" />
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { URL, LS, SHA256, DownloadCSV } from "../../shared/config.js";
import { STATE, LGAS } from "../../shared/state.js";
import { mapState, mapActions } from "vuex";

export default {
  name: "Charges",

  data: () => ({
    newtarrifDialog: false,
    uploadtarrifDialog: false,
    page:1,
    pageSize:50,
    panel: 1,
    search: '',
    tarrifs: [],
    filter: [],
    tab: [],
    head: "",
    isProcessing: false,
    isLoading: true,
    uploadFile: "",
    uploadDept:[],
    edittarrifModal: false,
    searchDialog: false,
    searchText:'',
    dept: 0,
    edittarrifContent: [],
    departmentLs: [],
    filterdepts: [],
    paginate: [],
    tarrifDuration:[
      {id:0, name: 'One off'},
      {id:1, name: 'Daily'},
      {id:2, name: 'Weekly'},
      {id:3, name: 'Monthly'},
      {id:4, name: 'Yearly'}
    ],
    newtarrif: {
      outlet: 0,
      dept: 0,
      name: "",
      remark: "",
      amount: 0.0,
      duration:0,
      authorize: ""
    },
    authDialog: false,
    avatar: null
  }),
  props: {
    source: String
  },
  watch: {
    avatar: {
      handler: function() {
        this.saved = false;
      },
      deep: true
    }
  },
  computed: {
    ...mapState(["outlet", "departments", "users", "group", "settings"]),
    initItem() {
      return this.filter;
    },
    getItems(){
      return this.tarrifs.result;
    },
    isFileAttached(){
      return this.avatar && this.avatar.csv && this.avatar.csv.length>0
    },
    setUploadDescription(){
      return (this.uploadDept && this.uploadDept.id)? `${this.uploadDept.name} department`: `Change dept: ${this.departments.name} department`;
    }
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search=pageItems.search;
      this.loadCharges();
    },
    loadCharges: function() {
      //alert(this.outlet.id)
      this.$Progress.start();
      let payload={
        search: this.search,
        page:this.page,
        perPage: this.pageSize,
        outlet: this.outlet.id,
        group: this.group.structure,
        action:'loads'
      }
      this.post(`/charges`, payload)
      .then(response => {
        if (response.status > 0) {
          this.tarrifs=response.response;
        }
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },
    
    
    loadDept: function() {
      this.$Progress.start();
      let payload={
        outlet: this.outlet.id,
        has_payment: 1,
        action: 'loads'
      }
      this.post("/dept", payload)
      .then(response => {
        if (response.status > 0) {
          this.departmentLs = response.response;
        }
      })
      .finally(()=>{
        this.filterdepts=this.departmentLs;
        this.isLoading=false;
        this.$Progress.finish();
      });
    },
    filterDept: function(){
      this.filterdepts = this.departmentLs.filter(
        item => item.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
    savetarrif: function() {
      if (
        this.newtarrifDialog &&
        (this.newtarrif.amount == "" || this.newtarrif.name == "")
      ) {
        alert("Amount and name cannot be left empty.");
        return false;
      }
      if (
        this.edittarrifModal &&
        (this.edittarrifContent.amount == "" ||
          this.edittarrifContent.name == "")
      ) {
        alert("Amount and name cannot be left empty.");
        return false;
      }

      
      this.isProcessing = true;
      if (this.newtarrifDialog) {
        let formData = new FormData();
        formData.append("action", "new");
        formData.append("dept", this.newtarrif.dept);
        formData.append("name", this.newtarrif.name);
        formData.append("amount", this.newtarrif.amount);
        formData.append("remark", this.newtarrif.remark);
        this.posttarrif(formData);
      }
      if (this.edittarrifModal) {
        if (
          this.settings.general &&
          this.settings.general.auth_before_edit &&
          this.settings.general.auth_before_edit == 1
        ) {
          this.authDialog = true;
        } else {
          this.authDialog = false;
          let formData = new FormData();
          formData.append("action", "update");
          formData.append("id", this.edittarrifContent.id);
          formData.append("name", this.edittarrifContent.name);
          formData.append("amount", this.edittarrifContent.amount);
          formData.append("remark", this.edittarrifContent.remark);
          this.posttarrif(formData);
        }
      }
    },
    posttarrif: function(formdata) {
      this.$Progress.start();
      this.post(`/charges`, formdata)
      .then(response => {
        if (response.status > 0) {
          this.$toastr.success(response.message);
          if (this.newtarrifDialog) {
            this.newtarrif.name = "";
            this.newtarrif.amount = 0;
            this.newtarrif.remark = "";
            this.loadCharges();
          }
          if (this.edittarrifModal) {
            this.edittarrifContent = [];
          }
        } else {
          this.$toastr.error(response.message);
        }
        this.isProcessing = false;
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },

    submitUpload: function() {
      this.$Progress.start();
      this.isProcessing = true;
      /*let formData = new FormData();
      
      formData.append("outlet", this.outlet.id);
      formData.append("dept", (this.uploadDept)?this.uploadDept.id:this.users.department);
      formData.append("test", JSON.stringify(this.avatar.csv));*/
      let payload={
        outlet: this.outlet.id,
        dept: (this.uploadDept)?this.uploadDept.id:this.users.department,
        test: this.avatar.csv
      }
      this.post("/charges/upload", payload)
      .then(resp => {
        if (resp.status > 0) {
          this.$toastr.success(resp.message);
          this.loadCharges();
        } else {
          this.$toastr.error(resp.message);
        }
        this.isProcessing = false;
      })
      .finally(()=>{
        this.$Progress.finish();
      });
    },

    loadCSV(e) {
      var vm = this;
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        // Handle errors load
        reader.onload = function(event) {
          var csv = event.target.result;
          vm.parse_csv = vm.csvJSON(csv);
        };
        reader.onerror = function(evt) {
          if (evt.target.error.name == "NotReadableError") {
            this.$toastr.error("Canno't read file !");
          }
        };
      } else {
        this.$toastr.error("FileReader are not supported in this browser.");
      }
    },
    download: function() {
      DownloadCSV({ data: this.filter });
    },
    editItem: function(index) {
      this.edittarrifContent = index;
      this.authDialog = false;
      this.edittarrifModal = true;
    },
    
    authUser: function(auth) {
      if (auth) {
        this.authDialog = false;
        let formData = new FormData();
        formData.append("action", "update");
        formData.append("id", this.edittarrifContent.id);
        formData.append("dept", this.edittarrifContent.dept_id);
        formData.append("name", this.edittarrifContent.name);
        formData.append("amount", this.edittarrifContent.amount);
        formData.append("remark", this.edittarrifContent.remark);
        this.posttarrif(formData);
      }
    },
    closeAuth: function(cancel) {
      this.authDialog = cancel;
    },
    printTarrif: function() {
      this.$print(this.$refs["printPage"]);
    }
  },
  /*beforeMount() {
    this.checkStorage();
    this.setDomain();
  },*/
  mounted() {
    this.checkStorage();
    let vm=this;
    setTimeout(function(){
      vm.loadCharges();
      vm.loadDept();
    }, 400);
  }
};
</script>
<style scoped>
.box {
  text-align: center;
}

.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.inputfile + label {
  max-width: 100%;
  font-size: 1.25rem;
  /* 20px */
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  padding: 0.625rem 1.25rem;
  /* 10px 20px */
}

.inputfile:focus + label,
.inputfile.has-focus + label {
  outline: 1px dotted #000;
  outline: -webkit-focus-ring-color auto 5px;
}

.inputfile + label * {
  /* pointer-events: none; */
  /* in case of FastClick lib use */
}

.inputfile + label svg {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  margin-top: -0.25em;
  /* 4px */
  margin-right: 0.25em;
  /* 4px */
}
/* style 5 */

.inputfile-5 + label {
  color: #d3394c;
}

.inputfile-5:focus + label,
.inputfile-5.has-focus + label,
.inputfile-5 + label:hover {
  color: #722040;
}

.inputfile-5 + label figure {
  width: 100px;
  height: 135px;
  background-color: #d3394c;
  display: block;
  position: relative;
  padding: 30px;
  margin: 0 auto 10px;
}

.inputfile-5:focus + label figure,
.inputfile-5.has-focus + label figure,
.inputfile-5 + label:hover figure {
  background-color: #722040;
}

.inputfile-5 + label figure::before,
.inputfile-5 + label figure::after {
  width: 0;
  height: 0;
  content: "";
  position: absolute;
  top: 0;
  right: 0;
}

.inputfile-5 + label figure::before {
  border-top: 20px solid #dfc8ca;
  border-left: 20px solid transparent;
}

.inputfile-5 + label figure::after {
  border-bottom: 20px solid #722040;
  border-right: 20px solid transparent;
}

.inputfile-5:focus + label figure::after,
.inputfile-5.has-focus + label figure::after,
.inputfile-5 + label:hover figure::after {
  border-bottom-color: #d3394c;
}

.inputfile-5 + label svg {
  width: 100%;
  height: 100%;
  fill: #f1e5e6;
}
</style>
