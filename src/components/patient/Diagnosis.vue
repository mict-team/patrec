<template>
  <div class="pa-4">
    <v-flex>
      <v-card tile style="width:100% !important">
        <v-card-text>
          <table class="table table-hover pointer">
            <thead>
              <tr>
                <th>#</th>
                <th>Complains</th>
                <th>Observation</th>
                <th></th>
              </tr>
            </thead>
            <tbody v-if="diagnosis">
              <template v-for="(pt, index) in diagnosis">
                <tr @click="toggle($event, index)" :key="index">
                  <td><v-icon>chevron_right</v-icon></td>
                  <td>{{ pt.complains }}</td>
                  <td>{{ pt.observation }}</td>
                  <td><v-icon>expand_more</v-icon></td>
                </tr>
                <tr class="accordion-toggle " :id="index" :key="index">
                  <td colspan="4">
                    <tr v-for="(ts, ind) in tests" :key="ind">
                      <td>{{ ind + 1 }}</td>
                      <td>{{ ts.dept }}</td>
                      <td>{{ ts.name }}</td>
                      <td>{{ ts.date_of_request }}</td>
                      <td>{{ ts.paid == 0 ? "Not paid for yet" : "Paid" }}</td>
                      <td>
                        <v-flex v-if="ts.status == 0">
                          No result
                        </v-flex>
                        <v-flex v-else>
                          <v-btn>View result</v-btn>
                        </v-flex>
                      </td>
                    </tr>
                  </td>
                </tr>
              </template>
            </tbody>
            <tr v-else>
              <td colspan="4">
                <v-flex xs12 style="text-align:center;">
                  <img src="../../assets/addnewitem.svg" />
                </v-flex>
              </td>
            </tr>
          </table>
        </v-card-text>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
import { URL, LS, SHA256, toCurrency } from "../../shared/config.js";
import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "Diagnosis",
  data: () => ({
    diagnosis: [],
    tests: [],
    patient: [],
    schedule: [],
    payments: []
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState(["domain", "outlet", "settings"])
  },

  methods: {
    ...mapActions(["setDomain", "checkStorage"]),
    innitialize: function() {
      this.patient = LS.get("patient");
      this.schedule = LS.get("medical");
      this.get(`/patient/diagnosis/${this.schedule.id}`)
        .then(response => {
          if (response.status > 0) {
            this.diagnosis = response.response.adm;
            this.tests = response.response.tests;
            setInterval(this.toggle(0), 3000);
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    hasClass(element, cls) {
      return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
    },
    toggle(e, index) {
      let els = document.getElementById(index);
      //console.log(els)
      this.$el.onclick = e => {
        if (e.target.tagName !== "INPUT") {
          let ind = this.hasClass(els, "collapse");
          //alert(index)
          if (!ind) {
            els.classList.add("collapse");
          } else {
            els.classList.remove("collapse");
          }
        }
      };
    }
  },
  created() {
    this.checkStorage();
    this.setDomain();
  },
  mounted() {
    this.innitialize();
  }
};
</script>

<style scoped>
.header-text {
  font-size: 20px;
  font-weight: bold;
  color: grey;
}
.collapsible {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
}

.active,
.collapsible:hover {
  background-color: #ccc;
}

.content {
  padding: 0 18px;
  display: none;
  overflow: hidden;
  background-color: #f1f1f1;
}
.collapse {
  transition: all 0.1s ease-out;
}
</style>
