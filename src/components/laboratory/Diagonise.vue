<template>
  <v-container>
    <v-toolbar row wrap>
      <v-btn color="red" @click="$router.go(-1)"
        ><v-icon white-text>keyboard_arrow_left</v-icon><span>Back</span></v-btn
      >
      <v-toolbar-title>List of diagnosis</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="primary" @click="newTestDialog = true" v-if="canLabUpdatePrice">
        <v-icon>create_new_folder</v-icon>New test</v-btn
      >
      <v-btn class="primary" @click="uploadTestDialog = true" v-if="canLabUpdatePrice">
        <v-icon>cloud_upload</v-icon>Upload test</v-btn
      >
      <v-btn class="primary" @click="download"
        ><v-icon>cloud_download</v-icon>Download test</v-btn
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
            >Loading pls...
          </template>
          <template v-else>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>SKU</th>
                  <th v-if="canAttendToAnyLab">Dept</th>
                  <th>Name</th>
                  <th>Remark</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th ></th>
                </tr>
              </thead>
              <tbody v-if="getItems.length>0">
                <template v-for="(test, index) in getItems">
                  <tr :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ test.sku }}</td>
                    <td v-if="canAttendToAnyLab">{{ test.dept }}</td>
                    <td>{{ test.name }}</td>
                    <td>{{ test.remark }}</td>
                    <td>{{ test.amount | toDecimal }}</td>
                    <td>{{ test.status == 1 ? "Active" : "Deactivated" }}</td>
                    <th >
                      <template v-if="canLabUpdatePrice">
                        <v-icon @click="editItem(test)">edit</v-icon>
                        <v-icon @click="disableItem(test)">cancel</v-icon>
                      </template>
                    </th>
                  </tr>
                </template>
              </tbody>
              <tr v-else>
                <td colspan="8">
                  <v-flex xs12 style="text-align:center;">
                    <img src="../../assets/addnewitem.svg" />
                  </v-flex>
                </td>
              </tr>
            </table>
          </template>
          
        </v-layout>
        <base-pagination :total="tests.total" :initialPage="page" :pageSize="pageSize" :callback="changePage" />
      </v-container>
    </v-card>
    <v-dialog v-model="newTestDialog" persistent left top width="400px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          New test
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 v-if="isProcessing">
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
              ></v-progress-circular
              >Processing pls...
            </v-flex>
            <v-flex xs12>
              <label>Test name</label>
              <input class="form-control" type="text" v-model="newTest.name" />
            </v-flex>
            <v-flex xs6>
              <label>Test amount</label>
              <input
                class="form-control"
                type="text"
                v-model="newTest.amount"
              />
            </v-flex>
            <v-flex xs6>
              <label>Remark</label>
              <input
                class="form-control"
                type="text"
                v-model="newTest.remark"
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="newTestDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveTest">Add item</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editTestModal" persistent left top width="400px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          New test
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 v-if="isProcessing">
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
              ></v-progress-circular
              >Processing pls...
            </v-flex>
            <v-flex xs12>
              <label>Test name</label>
              <input
                class="form-control"
                type="text"
                v-model="editTestContent.name"
              />
            </v-flex>
            <v-flex xs6>
              <label>Test amount</label>
              <input
                class="form-control"
                type="text"
                v-model="editTestContent.amount"
              />
            </v-flex>
            <v-flex xs6>
              <label>Remark</label>
              <input
                class="form-control"
                type="text"
                v-model="editTestContent.remark"
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="editTestModal = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveTest">Post test</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="uploadTestDialog" persistent left top width="400px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          New test
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 v-if="isProcessing">
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
              ></v-progress-circular
              >Processing pls...
            </v-flex>
            <v-flex xs12>
              <label>Upload .csv file</label>
              <base-csv-input v-model="avatar">
                <div slot="activator">
                  <div class="box">
                    <input
                      type="file"
                      id="file-5"
                      ref="file"
                      class="inputfile inputfile-4"
                    />
                    <label for="file-5" ref="label"
                      ><figure>
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
                      <span>Choose a file&hellip;</span></label
                    >
                  </div>
                  <div v-ripple v-if="avatar" class="mb-3">
                    <img
                      src="../../assets/csv-flat.png"
                      alt="avatar"
                      style="width:70px !important; height:70px !important;"
                    />
                  </div>
                </div>
              </base-csv-input>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="uploadTestDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="submitUpload">Post test</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="authDialog" persistent left top width="400px">
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
  name: "Diagnise",

  data: () => ({
    newTestDialog: false,
    uploadTestDialog: false,
    tests: [],
    isProcessing: false,
    isLoading: true,
    uploadFile: "",
    editTestModal: false,
    editTestContent: [],
    paginate: [],
    page: 1,
    pageSize:50,
    newTest: {
      outlet: 0,
      dept: 0,
      name: "",
      remark: "",
      amount: 0.0,
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
    ...mapState([
      "domain",
      "outlet",
      "group",
      "users",
      "search",
      "departments",
      "platforms",
      "settings"
    ]),
    checkItems() {
      return this.paginate;
    },
    initItem() {
      return this.tests;
    },
    getItems(){
      return this.tests;
    },
    canAttendToAnyLab(){
      return this.settings && this.settings.general && this.settings.general.collapse_all_laboratory
    },
    canLabUpdatePrice(){
      return this.settings && this.settings.general && this.settings.general.can_lab_enter_update_price
    }
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      setTimeout(this.loadTests, 100);
    },
    loadTests: function() {
      this.$Progress.start();
      this.isLoading = true;
      let dept='';
      if(this.group.structure == 'facilty'){
        if(!this.canAttendToAnyLab){
          dept=this.users.department;
        }
      }
      var postData = {
        page:this.page,
        perPage: this.pageSize,
        outlet: this.outlet.id,
        dept:  dept,
        type: 1,
        action:'loads'
      };
      console.log(postData)
      this.post("/charges", postData)
      .then(resp=>{
        if(resp.status>0){
          this.tests = resp.response.result
        }
      })
      .finally(()=>{
        this.isLoading=false
        this.$Progress.finish();
      })
      
    },
    changePage: function(pageItems) {
      this.page=pageItems.page;
      this.pageSize=pageItems.pageSize;
      this.search=pageItems.search;
      this.loadDrugs();
    },
    saveTest: function() {
      if (
        this.newTestDialog &&
        (this.newTest.amount == "" || this.newTest.name == "")
      ) {
        alert("Amount and name cannot be left empty.");
        return false;
      }
      if (
        this.editTestModal &&
        (this.editTestContent.amount == "" || this.editTestContent.name == "")
      ) {
        alert("Amount and name cannot be left empty.");
        return false;
      }
      let formData = new FormData();
      this.isProcessing = true;
      if (this.newTestDialog) {
        formData.append("outlet", this.outlet.id);
        formData.append("dept", this.departments.id);
        formData.append("name", this.newTest.name);
        formData.append("amount", this.newTest.amount);
        formData.append("remark", this.newTest.remark);
        formData.append("action", 'save');
        this.postTest(formData);
      }
      if (this.editTestModal) {
        formData.append("id", this.editTestContent.id);
        formData.append("name", this.editTestContent.name);
        formData.append("amount", this.editTestContent.amount);
        formData.append("remark", this.editTestContent.remark);
        formData.append("action", 'update');
        this.authDialog = true;
        this.postTest(formData);
      }
    },
    postTest: function(formdata) {
      this.post(`/charges`, formdata)
        .then(response => {
          if (response.status > 0) {
            this.$toastr.success(response.message);
            if (this.newTestDialog) {
              this.newTest.name = "";
              this.newTest.amount = 0;
              this.newTest.remark = "";
            }
            if (this.editTestModal) {
              this.editTestContent = [];
            }
          } else {
            this.$toastr.error(response.message);
          }
          this.isProcessing = false;
        })
        .catch(e => {
          this.isProcessing = false;
          this.$toastr.error(e.message);
        });
    },

    submitUpload: function() {
      this.isProcessing = true;
      let formData = new FormData();

      formData.append("outlet", this.outlet.id);
      formData.append("dept", this.departments.id);
      formData.append("tests", JSON.stringify(this.avatar.csv));
      this.post("/charges/upload", formData)
        .then(resp => {
          if (resp.status > 0) {
            this.$toastr.success(resp.message);
          } else {
            this.$toastr.error(response.message);
          }
          this.isProcessing = false;
        })
        .catch(e => {
          this.$toastr.error(e.message);
          this.isProcessing = false;
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
      DownloadCSV({ data: this.tests });
    },
    editItem: function(index) {
      this.editTestContent = index;
      if (
        this.settings.general &&
        this.settings.general.auth_before_edit &&
        this.settings.general.auth_before_edit == 1
      ) {
        this.authDialog = true;
      } else {
        this.authDialog = false;
        this.editTestModal = true;
      }
    },
   
    authUser: function(auth) {
      if (auth) {
        this.authDialog = false;
        this.editTestModal = true;
      }
    },
    closeAuth: function(cancel) {
      this.authDialog = cancel;
    }
  },
  beforeMount() {
    this.checkStorage();
    this.setDomain();
  },
  mounted() {
    this.innitialize();
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
