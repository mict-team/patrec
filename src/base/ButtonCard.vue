<template>
  <v-card v-bind="$attrs" :class="classes" class="v-card--material pa-3">
    <div class="d-flex grow flex-wrap text-center">
      <v-avatar
        v-if="avatar"
        size="128"
        class="mx-auto v-card--material__avatar elevation-6"
        color="grey"
      >
        <v-img :src="getPicture" />
      </v-avatar>

      
      <div class="ml-5 mr-5">
        <div class="card-title font-weight-light" v-text="name" />
        <div class="card-title font-weight-light" v-text="`${code} ${gender}`" />
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "MaterialCard",

  props: {
    avatar: {
      type: String,
      default: ""
    },
    
    color: {
      type: String,
      default: "primary"
    },
    
    name: {
      type: String,
      default: ""
    },
    code: {
      type: String,
      default: ""
    },
    gender: {
      type: String,
      default: ""
    },
  },

  computed: {
    ...mapState([ "outlet"]),
    classes() {
      return {
        "v-card--material--has-heading": this.hasHeading
      };
    },
    hasHeading() {
      return Boolean(this.$slots.heading || this.name);
    },
    hasAltHeading() {
      return Boolean(this.$slots.heading || (this.name));
    },
    getPicture: function(){
      return (this.avatar)?`${this.outlet.resourceDomain}/${this.avatar}`:'../assets/user.png';
    },
  },
  mounted(){
    //alert(this.outlet.resourceDomain)
  }
};
</script>

<style lang="sass" scoped>
.v-card--material
    cursor: pointer
    :hover
        background-color: #007fff
        color: #ffffff
        text-align: center

    &__avatar
        position: relative
        top: -64px
        margin-bottom: -32px

    &__heading
        position: relative
        top: -40px
        transition: .3s ease
        z-index: 1
</style>
