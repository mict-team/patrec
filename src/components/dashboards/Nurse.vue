<template>
  <v-container fluid tag="section">
    <v-row justify="enter">
      <v-col cols="12" md=8>
        <v-row center>
          <v-col cols="12" md="4" @click="$router.push('/doctor/schedules')">
            <base-material-card
              :bar="false"
              class="primary text-start font-weight-light white--text"
            >
              <v-icon class="icons">person_add</v-icon>
              <h6>Patients</h6>
            </base-material-card>
          </v-col>
          <v-col cols="12" md="4" @click="$router.push('/doctor/patients')">
            <base-material-card :bar="false" class="primary text-start white--text">
              <v-icon class="icons">mdi-bed-empty</v-icon>
              <h6>Onbed patients</h6>
            </base-material-card>
          </v-col>
          <v-col cols="12" md="4" @click="$router.push('/doctor/appointment')">
            <base-material-card :bar="false" class="primary text-start white--text">
              <v-icon class="icons">mdi-calendar</v-icon>
              <h6>Appointments</h6>
            </base-material-card>
          </v-col>

          <v-col cols="12" md="6">
            <base-material-card :bar="false" class="primary text-start white--text">
              <v-icon class="icons">mdi-calendar</v-icon>
              <h6>Appointments</h6>
            </base-material-card>
          </v-col>
          <v-col cols="12" md="6" @click="$router.push('/user-profile')">
            <base-material-card :bar="false" class="primary text-start white--text">
              <v-icon class="icons">mdi-account</v-icon>
              <h6>My Profile</h6>
            </base-material-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="4">
        <base-material-card class="v-card-profile" :avatar="user.passport">
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text" v-if="user.designation">
              {{ user.designation | toTitleCase }}
            </h6>

            <h1
              class="display-2 font-weight-light mb-3 black--text"
              style="font-size:22px !important;"
            >
              {{ user.name | toTitleCase }}
            </h1>

            <p class="font-weight-light grey--text" v-if="user.about">
              {{ user.about }}
            </p>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { URL, LS, SHA256 } from "../../shared/config.js";
export default {
    data:()=>{
        return{
            user:[]
        }
    },
    mounted(){
        this.user=LS.get('user');
    }
};
</script>

<style scoped>
.text-start {
  color: #fff;
  cursor: pointer;
}

.icons {
  font-weight: lighter;
  color: #fff;
  font-size: 60px;
}
</style>

