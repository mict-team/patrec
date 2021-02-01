<template>
    <v-container grid-list-sm>
        <v-toolbar row wrap class="grey lighten-4">
            <v-toolbar-title>{{ patient.basic.name }}</v-toolbar-title>
            <v-spacer />
            <v-toolbar-title>Gender: {{ patient.basic.gender }}</v-toolbar-title>
            <v-spacer />
            <v-toolbar-title>Age: {{ patient.basic.dob|toAge }}yrs</v-toolbar-title>
            <v-spacer />
            <v-avatar
                size="80"
                class="mx-auto v-card--material__avatar elevation-6"
                color="grey"
                style="margin-top:80px;">
                <v-img :src="patient.identification.passport" />
            </v-avatar>
            <v-spacer />
            <v-toolbar-title>Status: {{ patient.basic.marital_status }}</v-toolbar-title>
            <v-spacer />
            <v-toolbar-title>Phone: {{ patient.contact.phone }}</v-toolbar-title>
            <v-spacer />
      </v-toolbar>
        <v-card>
            <v-container>
                <v-layout>
                    <v-timeline
                        dense
                        clipped
                        >
                        <v-timeline-item
                            fill-dot
                            class="white--text mb-12"
                            color="orange"
                            large
                        >
                            <template v-slot:icon>
                                <span>JL</span>
                            </template>
                            <v-text-field
                            v-model="input"
                            hide-details
                            flat
                            label="Leave a comment..."
                            solo
                            @keydown.enter="comment"
                            @click="alert('deji')"
                            >
                            <template v-slot:append>
                                <v-btn
                                class="mx-0"
                                depressed
                                @click="comment"
                                >
                                Post
                                </v-btn>
                            </template>
                            </v-text-field>
                        </v-timeline-item>

                        <v-slide-x-transition
                            group
                        >
                            <v-timeline-item
                            v-for="event in timeline"
                            :key="event.id"
                            class="mb-4"
                            color="pink"
                            small
                            >
                                <v-row justify="space-between">
                                    <v-col
                                    cols="7"
                                    v-text="event.text"
                                    ></v-col>
                                    <v-col
                                    class="text-right"
                                    cols="5"
                                    v-text="event.time"
                                    ></v-col>
                                </v-row>
                            </v-timeline-item>
                        </v-slide-x-transition>

                        <v-timeline-item
                            class="mb-6"
                            hide-dot
                        >
                            <span>TODAY</span>
                        </v-timeline-item>

                        <v-timeline-item
                            class="mb-4"
                            color="grey"
                            icon-color="grey lighten-2"
                            small
                        >
                            <v-row justify="space-between">
                            <v-col cols="7">
                                This order was archived.
                            </v-col>
                            <v-col
                                class="text-right"
                                cols="5"
                            >
                                15:26 EDT
                            </v-col>
                            </v-row>
                        </v-timeline-item>

                        <v-timeline-item
                            class="mb-4"
                            small
                        >
                            <v-row justify="space-between">
                            <v-col cols="7">
                                <v-chip
                                class="white--text ml-0"
                                color="purple"
                                label
                                small
                                >
                                APP
                                </v-chip>
                                Digital Downloads fulfilled 1 item.
                            </v-col>
                            <v-col
                                class="text-right"
                                cols="5"
                            >
                                15:25 EDT
                            </v-col>
                            </v-row>
                        </v-timeline-item>

                        <v-timeline-item
                            class="mb-4"
                            color="grey"
                            small
                        >
                            <v-row justify="space-between">
                            <v-col cols="7">
                                Order confirmation email was sent to John Leider (john@vuetifyjs.com).
                            </v-col>
                            <v-col
                                class="text-right"
                                cols="5"
                            >
                                15:25 EDT
                            </v-col>
                            </v-row>
                        </v-timeline-item>

                        <v-timeline-item
                            class="mb-4"
                            hide-dot
                        >
                            <v-btn
                            class="mx-0"
                            >
                            Resend Email
                            </v-btn>
                        </v-timeline-item>

                        <v-timeline-item
                            class="mb-4"
                            color="grey"
                            small
                        >
                            <v-row justify="space-between">
                            <v-col cols="7">
                                A $15.00 USD payment was processed on PayPal Express Checkout
                            </v-col>
                            <v-col
                                class="text-right"
                                cols="5"
                            >
                                15:25 EDT
                            </v-col>
                            </v-row>
                        </v-timeline-item>

                        <v-timeline-item
                            color="grey"
                            small
                        >
                            <v-row justify="space-between">
                            <v-col cols="7">
                                John Leider placed this order on Online Store (checkout #1937432132572).
                            </v-col>
                            <v-col
                                class="text-right"
                                cols="5"
                            >
                                15:25 EDT
                            </v-col>
                            </v-row>
                        </v-timeline-item>
                    </v-timeline>    
                </v-layout>
            </v-container>
        </v-card>
        
    </v-container>
</template>
<script>
import { URL, LS, SHA256, toCurrency } from "../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "MedicalNote",

  data: () => ({
    user: [],
    medical: [],
    patient: [],
    dates: [],
    dept: [],
    platform: [],
    e1: 1,
    steps: 4,
    altLabels: false,
    editable: true,
    viewTestResult: false,
    test: []
  }),

  props: {
    source: String,
    id: String
  },
  components: {},
  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    }
  },
  computed: {
    ...mapState(["domain", "outlet", "settings"])
  },
  methods: {
    ...mapActions(["setDomain", "setSearch", "checkStorage"]),
    innitialize: function() {
      this.patient = LS.get("patient");
      this.user = LS.get("user");
      this.dept = LS.get("department");
      this.platform = LS.get("platform");
    },
    onInput(val) {
      this.steps = parseInt(val);
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
    cancelNote: function() {
      this.$router.go(-1);
    },
    takeNote: function() {
      LS.set('admission', this.medical.id)
      LS.set('schedule', this.patient.id)
      this.$router.push({ path: `/doctors-note` });
    },
    loadMedical: function() {
      this.$Progress.start();
      this.get(`/patient-med/history/detail/${this.id}`)
        .then(resp => {
          //console.log(resp.response)
          if (resp.status > 0) {
            this.medical = resp.response.mega;
            this.patient = resp.response.patient;
            this.steps = resp.response.count;
            this.dates = resp.response.dates;
          }
        })
        .finish(() => {
          this.$Progress.finish();
        });
    },
    viewTest: function(test) {
      this.test = test;
      this.viewTestResult = true;
    }
  },
  mounted() {
    this.checkStorage();
    this.setDomain();
    this.innitialize();
    this.loadMedical();
  }
};
</script>
<style scoped>
.child-container {
  width: 100% !important;
  margin: 5px 0px 0px -20px;
  padding: 0px !important;
  background-color: #fff;
}
.right {
  color: blue;
  text-align: right;
}
.header-text {
  font-size: 20px;
  font-weight: bold;
  color: grey;
}
</style>
