<template>
  <div>
    <v-layout row wrap>
        <transition name="fade">
            <v-flex xs12 class="offline" v-if="!isOnline">
                <strong>Offline mode.</strong> No active internet connection. Keep working
            </v-flex>
      </transition>
    </v-layout>
  </div>
</template>
<script>
import { URL, LS, APP } from "../shared/config.js";
import axios from "axios";
const dns = window.require('dns');
export default {
    name: "PrintReceipt",
    data() {
        return {
            domain:"check-connection",
            disapear:true,
            isOnline:false
        };
    },
    
    methods: {
        checkConnectivity: function(){
            var vm = this;
            dns.lookup('unimedth.com',function(err, addr) {
                //console.log(err)
                if (err!=null) {
                    vm.isOnline= false;
                } else {
                    vm.isOnline= true;
                }
            });
            //console.log(vm.isOnline)
        }
    },
    mounted() {
        var vm = this;
        setInterval(function() {
            vm.checkConnectivity();
            //console.log(vm.isOnline)
            vm.$emit("checkConnectivity", {status: vm.isOnline});
        }, 5000);
    }
};
</script>
<style>
    .onine{

    }
    .offline{
        color:red;
        -webkit-animation: blink .75s linear infinite;
        -moz-animation: blink .75s linear infinite;
        -ms-animation: blink .75s linear infinite;
        -o-animation: blink .75s linear infinite;
        animation: blink .75s linear infinite;
    }
    @-webkit-keyframes offline {
        0% { opacity: 1; }
        50% { opacity: 1; }
        50.01% { opacity: 0; }
        100% { opacity: 0; }
    }
    @-moz-keyframes offline {
        0% { opacity: 1; }
        50% { opacity: 1; }
        50.01% { opacity: 0; }
        100% { opacity: 0; }
    }
    @-ms-keyframes offline {
        0% { opacity: 1; }
        50% { opacity: 1; }
        50.01% { opacity: 0; }
        100% { opacity: 0; }
    }
    @-o-keyframes offline {
        0% { opacity: 1; }
        50% { opacity: 1; }
        50.01% { opacity: 0; }
        100% { opacity: 0; }
    }
    @keyframes offline {
        0% { opacity: 1; }
        50% { opacity: 1; }
        50.01% { opacity: 0; }
        100% { opacity: 0; }
    }
</style>
