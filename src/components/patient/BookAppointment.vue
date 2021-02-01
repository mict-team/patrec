<template>
    <v-container>
        <v-toolbar row wrap>
            
            <v-toolbar-title>Book an appointment</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="bookAppointment">Book appointment</v-btn>
        </v-toolbar>
        <v-card>
            <v-container grid-list-sm class="pa-4">
                <v-row>
                    <v-col cols="12" md="6">
                        <label>Department</label>
                        <v-select
                            v-model="appointment.dept"
                            :items="serviceDepartments"
                            item-text="name"
                            item-value="id"
                            label="Select department"
                            dense
                            outlined
                            @change="loadDoctors"
                            style="z-index: 9999999;"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                        <label>Who to see</label>
                        <v-select
                            v-model="appointment.doctor"
                            :items="doctors"
                            item-text="name"
                            item-value="id"
                            label="Select doctor"
                            :disabled="!doctors"
                            dense
                            outlined
                            style="z-index: 9999999;"
                        ></v-select>
                        
                    </v-col>
                    <v-col cols="12" md="12">
                        <label>Leave a note</label>
                        <input type="text" class="form-control" style="z-index: 9999999;"/>
                    </v-col>
                    <v-col cols="12" md="12">
                        <DateTimePicker v-model="appointment.date" inline format="YYYY-MM-DD hh:mm a" :min-date="minDate" :overlay="false" :enabledDates="availableDates" style="z-index:-999999999999px !important;"/>
                    </v-col>
                    
                    
                </v-row>
            </v-container>
        </v-card>
        <v-toolbar row wrap>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="bookAppointment">Book appointment</v-btn>
        </v-toolbar>
    </v-container>
</template>
<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
import { mapState, mapActions } from "vuex";
export default {
    data() {
        return {
        modalApp: false,
        serviceDepartments: [],
        doctors: [],
        patient:[],
        filtereduser: [],
        availableDates:[],//'2021-02-21', '2021-02-22', '2021-02-23'
        appointment: {
            outlet: "",
            patient: "",
            dept: "",
            doctor: "",
            date: "",
            purpose: ""
        }
        };
    },
    props: {
        source: String,
    },
    computed: {
        ...mapState(["domain", "outlet", "platforms", "departments", "group", "users"]),
        minDate(){
            let now=new Date();
            let currentDate=now.getFullYear() +'-'+ ('0'+now.getMonth()+1).slice(-2) +'-'+ ('0'+now.getDate()).slice(-2) +' '+('0'+now.getHours()+1).slice(-2) +':'+ ('0'+now.getMinutes()).slice(-2);
            //alert(new Date().toISOString().slice(0, 16).replace('T', ' '));
            return new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
    },
    methods: {
        ...mapActions(["setDomain", "checkStorage"]),
        innitialize: function(){
            this.$Progress.start();
            let payload={
                outlet: this.outlet.id,
                has_clinic: 1,
                action: 'loads'
            }
            this.post("/dept", payload)
            .then(response => {
                if (response.status > 0) {
                    this.serviceDepartments = response.response;
                }
            })
            .finally(()=>{
                this.$Progress.finish();
            })
        },
        loadDept: function() {
            
        },
        loadDoctors: function() {
            this.$Progress.start();
            let payload={
                page:0,
                outlet: this.outlet.id,
                group: this.group.structure,
                dept: this.appointment.dept,
                action:'loads'
            }
            this.post('users', payload)
            .then(response => {
                if (response.status > 0) {
                    this.doctors = response.response.result;
                }
            })
            .finally(()=>{
                console.log(this.doctors)
                this.$Progress.finish();
            });
        },
        
        saveAppointment: function() {
            if (this.appointment.date == "") {
                this.$toastr.error("Date of appointment must be selected");
            } else if (this.appointment.dept == "") {
                this.$toastr.error("Booking department must set");
            } else if (this.appointment.purpose == "") {
                this.$toastr.error("Purpose of appointment cannot be emptied.");
            } else {
                this.$emit("bookAppointment", this.appointment);
            }
        },
        bookAppointment: function() {
            //console.log(this.appointment)
            if (this.appointment.date == "") {
                this.$toastr.error("Date of appointment must be selected");
            } else if (this.appointment.dept == "") {
                this.$toastr.error("Booking department must set");
            }else {
                
                this.$Progress.start();
                this.appointment.patient = this.patient.id;
                this.appointment.outlet = this.outlet.id;
                this.post("/patient/appointment", this.appointment)
                .then(resp => {
                    if (resp.status > 0) {
                        this.$toastr.success(`Appointment has been booked for ${this.patient.basic.name}`);
                        this.newAppointment = false;
                        //this.$router.go();
                    } else {
                        this.$toastr.error(resp.message);
                    }
                })
                .finally(() => {
                    this.$Progress.finish();
                });
            }
        },
        closePage: function() {
        this.$emit("closePage", false);
        }
    },
    beforeMount() {
        this.checkStorage();
        this.setDomain();
    },
    mounted() {
        this.patient=LS.get('bookpatient');
        setTimeout(this.innitialize, 200);
    }
};
</script>
