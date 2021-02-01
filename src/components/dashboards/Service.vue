<template>
  <div class="dashboard-icons">
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
  </div>
</template>

<script>
export default {};
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

