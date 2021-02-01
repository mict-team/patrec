<template>
    <v-toolbar color="blue" dark>
        <v-flex xs12 row>
            <v-flex xs11>
                <input
                type="text"
                v-model="msg"
                placeholder="Type here..."
                @keyup="checkEnteredKeys($event)"
                />
            </v-flex>
            <v-flex xs1>
                <v-btn icon @click="sendMsg">
                    <v-icon>send</v-icon>
                </v-btn>
            </v-flex>
        </v-flex>
    </v-toolbar>
</template>

<script>
export default {
    methods:{
        checkEnteredKeys: function(e) {
            if (e.keyCode === 13) {
                this.sendMsg();
            }
        },
    }
}
</script>

<style>

</style>