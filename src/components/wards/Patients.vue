<template>
    <v-container>
        <v-toolbar>
            <v-btn color="red" @click="$router.go(-1)"
            ><v-icon white-text>keyboard_arrow_left</v-icon
            ><span>Back</span></v-btn>
            <v-toolbar-title> {{ward.name}}</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn class="primary" @click="updateCapacity = true">
            <v-icon>add</v-icon> Change capacity</v-btn>
        </v-toolbar>
        <v-card>
            <v-container grid-list-sm class="pa-4">
                <v-layout row wrap>
                    <v-col cols="12" md="6" v-for="cap in ward.capacity" :key="cap" :class="isEvenOrOdd(cap)?'even':'odd'">
                        <span class="bed-number">{{cap}}</span>
                        <v-icon class="bed-size" color="green" v-if="!isBedFixed(cap)">mdi-bed-empty</v-icon>
                        <template v-else>
                            <v-icon class="bed-size" color="red">mdi-bed</v-icon>
                            <div class="label">
                                <span class="name">{{isBedFixed(cap).name}}</span><br>
                                <span class="code">{{isBedFixed(cap).code}}</span>
                            </div>
                            
                        </template>
                        
                    </v-col>
                </v-layout>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data(){
        return{
            loading: false,
            updateCapacity: false,
            wardId:0,
            ward:[],
            patients:[]
        }
    },
    methods:{
        loadWard: function(){
            this.$Progress.start();
            let payload={
                id: this.wardId,
                action: 'loads'
            }
            this.post("wards", payload)
            .then(resp=>{
                this.ward=resp.response.ward;
                this.patient=resp.response.patients
            })
            .finally(()=>{
                this.$Progress.finish();
            })
        },
        isEvenOrOdd: function(capacity){
            console.log(capacity, capacity%2)
            return (capacity%2==0)? true: false;
        },
        isBedFixed: function(capacity){
            for(let pat in this.patients){
                if(pat.admission_bed==capacity){
                    return {code: 'PAT11509', name: 'Adewumi Adedeji'};
                }
            }
            return false;
        }
    },
    mounted(){
        this.wardId=this.$route.params.id;
        setTimeout(this.loadWard, 200);
    }
}
</script>

<style scoped>
    .even{
        text-align: left;
        padding-left:50px;
        position: relative;
    }
    .odd{
        text-align: right;
        padding-right: 50px;
        position: relative;
    }
    .bed-number{
        position: relative;
        z-index: 99999;
        left: 18.5%;
        top: -16px;
        color: #fff;
    }
    .bed-size{
        font-size:250px;
    }
    .label{
        position: absolute;
        float: left;
        left: 50%;
        top: 70%;
    }
    .even .label{
        left: 20%;
    }
    .label .name{

    }
    .label .code{
        font-size: 12px;
    }
</style>