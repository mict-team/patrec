<template>
  <v-container>
    <v-card tile>
      <v-timeline v-if="timeline.length > 0">
        <v-timeline-item v-for="(line, i) in timeline" :key="i" :color="line.color" small>
          <template v-slot:opposite>
            <span :class="`headline font-weight-bold ${line.color}--text`" v-text="line.date"></span>
          </template>
          <div class="py-4">
            <h2 :class="`headline font-weight-light mb-4 ${line.color}--text`">
              {{ line.name }}
            </h2>
            <div>
              <h5>Complains:</h5>
              {{ line.complains }}
            </div>
            <br />
            <div>
              <h5>Observation:</h5>
              <span v-for="(obs, idx) in line.observation" :key="idx">{{
                obs.name
              }}</span
              >;
            </div>
          </div>
        </v-timeline-item>
      </v-timeline>
      <v-card-text v-else>
        No medical history for patient
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "Home",
  data: () => ({
    patient: [],
    schedule: "",
    timeline: []
  }),
  props: {
    source: String,
    id: String
  },
  computed: {
    ...mapState([
      "domain",
      "outlet",
      "search",
      "patients",
      "transCode",
      "today"
    ])
  },

  methods: {
    ...mapActions([
      "setDomain",
      "setSearch",
      "checkStorage",
      "addPatients",
      "setCode",
      "setToday"
    ]),
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
      this.schedule = this.id;//LS.get("schedule");
      this.loadTimelines();
      //console.log(this.schedule);
    },
    loadTimelines: function() {
      this.$Progress.start();
      this.get("/patient-med/history/" + this.schedule)
      .then(response => {
        if (response.status > 0) {
          this.timeline = response.response;
          if (this.timeline.length > 0) {
            for (var i = 0; i < this.timeline.length; i++) {
              this.timeline[i]["color"] = this.colorAsign();
            }
          }
        }
      })
      .finally(() => {
        this.$Progress.finish();
      });
    }
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
    
  }
};
</script>

<style scoped>
.home-body {
  opacity: 1;
  content: "";
}
</style>
