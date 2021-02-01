<template>
    <div>
        <v-flex style="text-align:center;">
            <v-avatar size="100px" circle>
                <img :src="getPassport" :alt="patient.basic.name" />
            </v-avatar>
        </v-flex>
        <v-flex style="text-align:center;"><h3>{{ patient.basic.name }}</h3></v-flex>
        <v-flex class="">
            <table class="table">
                <tr>
                    <td>
                        <small>ID</small><br />
                        {{ patient.basic.code }}
                    </td>
                </tr>
                <tr>
                    <td>Age<small>Age</small><br />{{ patient.basic.dob }}</td>
                </tr>
                <tr>
                    <td>
                        <small>Gender</small><br />{{ patient.basic.gender }}
                    </td>
                </tr>
                <tr>
                    <td>
                        <small>Marital Status</small><br />{{
                        patient.basic.marital_status
                        }}
                    </td>
                </tr>
                <tr>
                    <td>
                        <small>Phone</small><br />{{ patient.contact.phone }}
                    </td>
                </tr>
                <tr>
                    <td>
                        <small>Email</small><br />{{ patient.contact.email }}
                    </td>
                </tr>
                <tr>
                    <td>
                        <small>Address</small><br />{{ patient.contact.address }}
                    </td>
                </tr>
                <tr>
                    <td>
                        <small>Guardian Name</small><br />{{
                        patient.nextOfKin.name
                        }}
                    </td>
                </tr>
                <tr>
                    <td>
                        <small>Guardian Contact</small><br />{{
                        patient.nextOfKin.phone
                        }}
                    </td>
                </tr>
            </table>
        </v-flex>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
    props:{
        patient:{
            type:[Array, Object],
            default:[]
        }
    },
    computed:{
        ...mapState(["outlet"]),
        getPassport(){
            if(this.patient && this.patient.identification && this.patient.identification.passport != ''){
                return `${this.outlet.resourceDomain}/${this.patient.identification.passport}`;
            }else{
                return "../assets/user.png";
            }
        }
    },
    methods: {
        ...mapActions([ "checkStorage"]),
    },
    mounted() {
        this.checkStorage();
        console.log(this.patient)
    }
}
</script>

<style>

</style>