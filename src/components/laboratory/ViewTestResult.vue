<template>
    
</template>

<script>
export default {
    data(){
        return{
            testId:''
        }
    },
    mounted(){
        this.testId=this.$route.param.test;
    }
}
</script>

<style>

</style>