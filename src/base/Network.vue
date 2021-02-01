<template>
    <v-snackbar v-model="snackbar" :centered="true" elevation="1">
        You are currently offline. 
        <template v-slot:action="{ attrs }">
            <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
        </template>
        
    </v-snackbar>
</template>
<script>
import { URL, LS, APP } from "../shared/config.js";
import { mapState, mapActions } from "vuex";
var ping = require('ping');
export default {
    name: "Network",
    data() {
        return {
            disapear:true,
            isOnline:false,
            snackbar: true
        };
    },
    computed: {
      
    },
    methods: {
        checkConnectivity: function(){
            var host = 'google.com';
            var vm = this;
            ping.sys.probe(host,{
                    timeout: 10
                }, function(isAlive){
                //console.log(`Network status: ${isAlive}`);
                vm.snackbar= (isAlive)? false: true;
            });
        }
    },
    mounted() {
        var vm = this;
        setInterval(function() {
            vm.checkConnectivity();
        }, 300000);
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
