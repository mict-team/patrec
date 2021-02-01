<template>
    <v-container>
        <template v-for="(msg, index) in getChats" class="red">
            <div
                class="talk-bubble-right round tri-right right-top"
                v-if="msg.sender.id == user.id"
                :key="index"
                >
                <div class="talktext">
                <p>{{ msg.msg }}</p>
                <small>{{ msg.date }}</small>
                </div>
            </div>
            <div
                class="talk-bubble-left round tri-left left-top"
                v-else
                :key="index"
            >
                <div class="talktext">
                <p>{{ msg.msg }}</p>
                <small>{{ msg.date }}</small>
                </div>
            </div>
        </template>
    </v-container>
</template>

<script>
export default {
    props:{
        chats:{
            type: [Object, Array],
            default: null
        }
    },
    computed:{
        getChats(){
            return this.chats;
        }
    }
}
</script>

<style>

</style>