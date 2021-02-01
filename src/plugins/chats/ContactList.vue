<template>
    <v-container>
        <v-flex xs12 row>
            <v-flex xs2>
                <v-btn icon @click="showChats">
                <v-icon style="font-size:35px;">keyboard_arrow_left</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs10>
                <input
                type="text"
                label="Search "
                class="form-control"
                placeholder="Search user"
                />
            </v-flex>
        <v-divider></v-divider>
        </v-flex>
        <v-card-text>
            <v-flex
                row
                v-for="(user, index) in users"
                :key="index"
                style="cursor:pointer"
                @click="viewMsg(user)"
                >
                <v-flex xs3>
                <v-avatar size="55px" tile>
                    <img src="../assets/user.png" />
                </v-avatar>
                </v-flex>
                <v-flex xs9>
                <v-flex xs12 row>
                    <v-flex xs11>
                    <h6>{{ user.name }}</h6>
                    <small>{{ user.dept }}</small>
                    </v-flex>
                    <v-flex xs1>
                    <v-badge
                        color="green"
                        overlap
                        bordered
                        v-if="user.online"
                    >
                        <template v-slot:badge>
                        <span></span>
                        </template>
                    </v-badge>
                    <v-badge
                        color="red"
                        overlap
                        bordered
                        v-if="!user.online"
                    >
                        <template v-slot:badge>
                        <span></span>
                        </template>
                    </v-badge>
                    </v-flex>
                </v-flex>
                <v-divider></v-divider>
                </v-flex>
            </v-flex>
        </v-card-text>
    </v-container>
</template>

<script>
export default {
    data(){
        return{
            users: [],
        }
    },
    methods:{
        showSearch: function() {
            this.inChatArea = false;
            this.isSearch = true;
            this.get(`/users/chats/${this.user.id}`)
            .then(response => {
                if (response.status > 0) {
                    this.users = response.response;
                }
            })
        },
    },
    mounted(){
        setTimeout(this.showSearch, 200);
    }
}
</script>

<style>

</style>