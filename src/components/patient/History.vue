<template>
  <v-container>
    <v-card>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Hospital</th>
            <th>Nurse</th>
            <th>Vital Signs</th>
            <th>Reason</th>
            <th></th>
          </tr>
        </thead>
        <tbody v-if="history.length > 0">
          <template v-for="(visit, index) in history">
            <tr @click="toggle($event, index)" :key="index" class="rowClick">
              <td>{{ index + 1 }}</td>
              <td>{{ visit.date }}</td>
              <td>
                <span class="success">{{ visit.outlet }}</span>
              </td>
              <td>{{ visit.name }}</td>
              <td>{{ visit.vital }}</td>
              <td>{{ visit.patient_type }}</td>
              <td>
                <!--v-icon
                  @click="detailMedical(visit.id)"
                  title="View detail"
                  v-if="visit.inconclusive == 1"
                  >edit</v-icon
                -->
                <v-icon
                  @click="detailMedical(visit.id)"
                  title="View detail"
                  >menu</v-icon
                >
              </td>
            </tr>
            <tr
              class="accordion-toggle collapse"
              :id="index"
              :key="index + '_1'"
            >
              <td colspan="7">
                <v-btn
                  @click="
                    innerNavigate('Appointment details', 'appointment', visit)
                  "
                  title="Appointments"
                >
                  <v-avatar size="40px" tile>
                    <img src="../../assets/calendar.png" />
                  </v-avatar>
                  Appointments
                </v-btn>
                <v-btn
                  @click="
                    innerNavigate('Patient Diagnosis', 'diagnosis', visit)
                  "
                  title="Tests conducted"
                >
                  <v-avatar size="40px" tile>
                    <img src="../../assets/lab.png" />
                  </v-avatar>
                  Diagnosis
                </v-btn>
                <v-btn
                  @click="
                    innerNavigate('Admission details', 'admission', visit)
                  "
                  title="Admission detail"
                >
                  <v-avatar size="40px" tile>
                    <img src="../../assets/bed.png" />
                  </v-avatar>
                  Admission
                </v-btn>
                <v-btn
                  @click="
                    innerNavigate('Patient precription', 'prescription', visit)
                  "
                  title="Prescription"
                >
                  <v-avatar size="40px" tile>
                    <img src="../../assets/calendar.png" />
                  </v-avatar>
                  Prescriptions
                </v-btn>
              </td>
            </tr>
          </template>
        </tbody>
        <tr v-if="!history.length > 0">
          <td colspan="6" style="text-align:center;">
            <v-flex xs12 style="text-align:center;">
              <img src="../../assets/addnewitem.svg" />
            </v-flex>
          </td>
        </tr>
      </table>
    </v-card>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Home",
  data: () => ({
    patient: "",
    history: []
  }),
  props: {
    source: String, 
    id: String
  },
  computed: {
    ...mapState(["outlet", "search", "patients", "transCode", "today"])
  },

  methods: {
    ...mapActions([
      "setSearch",
      "checkStorage",
      "addPatients",
      "setCode",
      "setToday"
    ]),
    hasClass(element, cls) {
      return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
    },
    toggle(e, index) {
      let els = document.getElementById(index);
      this.$el.onclick = e => {
        if (e.target.tagName !== "INPUT") {
          let ind = this.hasClass(els, "collapse");
          if (!ind) {
            els.classList.add("collapse");
          } else {
            els.classList.remove("collapse");
          }
        }
      };
    },
    colorAsign: function() {
      var colors = [
        "red",
        "green",
        "blue",
        "orange",
        "pink",
        "purple",
        "lime",
        "magenta",
        "teal",
        "turquoise",
        "amethyst",
        "wet-asphalt",
        "midnight-blue",
        "sun-flower",
        "pomegranate",
        "silver",
        "asbestos"
      ];
      var pos = Math.floor(Math.random() * colors.length);
      return colors[pos];
    },
    innitialize: function() {
      this.patient = this.id;//LS.get("patient");
    },
    loadHistory: function() {
      this.get("/patient-med/" + this.patient)
        .then(response => {
          if (response.status > 0) {
            this.history = response.response;
            if (this.history.length > 0) {
              for (var i = 0; i < this.history.length; i++) {
                this.history[i]["color"] = this.colorAsign();
              }
            }
          }
        })
        .catch(e => {
          this.$toastr.error(e.message);
        });
    },
    detailMedical: function(id) {
      this.$router.push({ path: `/medical-history/${id}` });
    },
    innerNavigate: function(title, uri, index) {
      this.component = title;
      LS.set("medical", index);
      this.$router.push({ path: `/patient/${uri}` });
    }
  },
  mounted() {
    this.checkStorage();
    this.innitialize();
    this.loadHistory();
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
.collapse {
  transition: all 0.1s ease-out;
}
</style>
