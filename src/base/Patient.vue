<template>
    <v-card grid-list-sm>
        <v-layout row wrap>
            <v-flex style="text-align:center;">
            <v-avatar size="150px" circle>
                <img
                :src="getPassport"
                :alt="patient.basic.name"
                />
            </v-avatar>
            </v-flex>

            <table class="table table-hover" style="width:100%;">
            <tr>
                <td>
                Patient ID
                <div style="color:#007FFF; text-align: right;">{{ patient.basic.code }}</div>
                </td>
            </tr>
            <tr>
                <td>
                Age
                <div style="color:#007FFF; text-align: right;">{{ patient.basic.dob | toAge }}yrs old</div>
                </td>
            </tr>
            <tr>
                <td>
                Gender
                <div style="color:#007FFF; text-align: right;">
                    {{ patient.basic.gender }}
                </div>
                </td>
            </tr>
            <tr>
                <td>
                Marital Status
                <div style="color:#007FFF; text-align: right;">
                    {{ patient.basic.marital_status }}
                </div>
                </td>
            </tr>
            <tr>
                <td>
                Phone
                <div style="color:#007FFF; text-align: right;">
                    {{ patient.contact.phone }}
                </div>
                </td>
            </tr>
            <tr>
                <td>
                Email
                <div style="color:#007FFF; text-align: right; font-size:13px;">
                    {{ patient.contact.email }}
                </div>
                </td>
            </tr>
            <tr>
                <td>
                Address
                <div style="color:#007FFF; text-align: right;">
                    {{ patient.contact.address }}
                </div>
                </td>
            </tr>
            <tr>
                <td>
                Guardian Name
                <div style="color:#007FFF; text-align: right;">
                    {{ patient.nextOfKin.name }}
                </div>
                </td>
            </tr>
            <tr>
                <td>
                Guardian Contact
                <div style="color:#007FFF; text-align: right;">
                    {{ patient.nextOfKin.phone }}
                </div>
                </td>
            </tr>
            <tr>
                <td>
                Insurance
                <div style="color:#007FFF; text-align: right;">
                    {{ patient.insurance.name }}
                </div>
                </td>
            </tr>
            <tr>
                <td>
                HMO
                <div style="color:#007FFF; text-align: right;">
                    {{ patient.insurance.hmo_desc }}
                </div>
                </td>
            </tr>
            </table>
        </v-layout>
        </v-card>
</template>

<script>
export default {
    data(){
        return {
            passport:''
        }
    },
    props:{
        patient:{
            type: [Object, Array],
            default: null
        }
    },
    computed:{
        getPassport(){
            if(this.passport){
                return this.passport
            }else{
                return "../assets/no_image.png";
            }
        }
    },
    methods:{
        loadPassport: function(){
            this.get(`/patients/passport/${this.patient.id}`)
            .then(resp=>{
                if(resp.status>0){
                    this.passport=resp.response;
                }
            })
        }
    },
    mounted(){
        this.loadPassport()
    }
}
</script>

<style>

</style>