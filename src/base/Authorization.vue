<template>
  <div>
    <template v-if="loading">
      {{ msg }}
    </template>
    <template>
      <div class="row">
        <div class="col-md-10" v-if="auth && message!=''">
          <div class="alert alert-danger">
            {{message}}
          </div>
        </div>
        <div class="col-md-10">
          <base-otp-input
            ref="otpInput"
            input-classes="otp-input"
            separator="-"
            :num-inputs="6"
            :should-auto-focus="true"
            :is-input-num="false"
            :readonly="readonly"
            :secure="secure"
            @on-change="handleOnChange"
            @on-complete="handleOnComplete"
          />
        </div>
        <div class="col-md-2" v-if="close">
          <v-avatar
            size="45px"
            style="cursor:pointer;"
            @click="closeMe"
          >
            <img src="../assets/close.jpeg" alt="close" />
          </v-avatar>
        </div>
      </div>
    </template>
  </div>
</template>
<script scoped>
import { URL, LS, SHA256 } from "../shared/config.js";
import { mapState, mapActions } from "vuex";

export default {
  name: "Authorization",
  data: () => ({
    loading: false,
    message:""
  }),
  props: {
    auth: {
      type: Boolean,
      default: true
    },
    close: {
      type: Boolean,
      default: true
    },
    user: {
      type: [Number, String],
      default: ''
    },
    confirm: {
      type: Boolean,
      default: false
    },
    readonly:{
      type: Boolean,
      default: false
    },
    clearInput:{
      type: Boolean,
      default: true
    },
    secure:{
      type: Boolean,
      default: true
    },
    msg: {
      type: String,
      default: "Authenticating you. Pls waith..."
    }
  },
  computed: {},
  methods: {
    ...mapActions(["setDomain", "checkStorage"]),

    handleOnChange(value) {
      //console.log("OTP changed: ", value);
    },
    handleClearInput() {
      this.$refs.otpInput.clearInput();
    },
    handleOnComplete: function(value) {
      if (this.auth) {
        this.loading = true;
        this.post("/isAuth", { userPin: value, user: this.user })
        .then(response => {
          if (response.status > 0) {
            this.handleClearInput();
            this.$emit("authUser", response.response);
          } else {
            this.message=response.message;
            this.$emit("authUser", false);
          }
        })
        .finally(()=>{
          this.loading = false;
          
        });
      } else {
        if(this.confirm){
          this.$emit("authUser", { auth: true, pin: value });
        }else{
          this.loading = true;
          this.post("/isAuth", { userPin: value, user: this.user })
          .then(
            response => {
              if (response.status > 0) {
                this.$emit("authUser", { auth: false, pin: value });
              } else {
                this.$emit("authUser", { auth: true, pin: value });
              }
          })
          .finally(()=>{
            this.loading = false;
            if(this.clearInput){
              this.handleClearInput();
            }
            
          });;  
        }
        
      }
    },
    closeMe: function(){
      this.$emit('closeAuth');
    }
  },
  mounted() {
    if (!this.$listeners.authUser) {
      throw 'Missing required event listener: "authUser"';
    }

    this.checkStorage();
    this.setDomain();
    //this.message=this.msg;
  }
};
</script>
<style scoped>
input {
  padding: 10px;
  border: 1px solid #ddd;
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 30px;
}
</style>
