<template>
  <v-app id="inspire">
    <v-layout align-center justify-center >
        <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Update user account</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                    <v-flex xs12 style="text-align:center">
                        <v-btn icon large>
                            <v-avatar size="82px" tile>
                            <img
                                src="../assets/user.png"
                                alt="Adewumi Adedeji"
                            >
                            </v-avatar>
                        </v-btn>    
                    </v-flex>
                    
                    <br>
                    <v-text-field
                        prepend-icon="person"
                        name="person"
                        v-model="user.name"
                        label="Name"
                        type="text"
                    ></v-text-field>
                    <v-text-field
                        prepend-icon="person"
                        name="email"
                        v-model="username"
                        label="Username"
                        type="text"
                    ></v-text-field>
                    <v-text-field
                        prepend-icon="person"
                        name="telephone"
                        v-model="user.phone"
                        label="Phone number"
                        type="text"
                    ></v-text-field>
                    <v-text-field
                        prepend-icon="lock"
                        name="password"
                        v-model="password"
                        label="Password"
                        type="password"
                    ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                
                <v-spacer></v-spacer>

                <v-btn color="primary" @click="updateProfile">Update</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
       
    </v-layout>
    
    <v-dialog v-model="error_dialog" width="400px">
        <v-card align-center>
            <v-card-title class="grey lighten-4 py-4 title">
            Error message
            </v-card-title>
            <v-container grid-list-sm class="pa-4">
            {{ message }}
            </v-container>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="error_dialog = false"
                >Close</v-btn
            >
            </v-card-actions>
        </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
    import { URL, LS, SHA256 } from "../shared/config.js";
    import axios from "axios";
    import { mapState, mapActions } from "vuex";
    const { remote } = window.require("electron");
    const { BrowserWindow } = remote;
    const ipcRenderer = window.require("electron").ipcRenderer;
    export default {
        data() {
            return {
                error_dialog:false,
                username:'',
                extension:'',
                password:'',
                user:[],
                message:''
            }
        },
        computed: {
            ...mapState(["domain", "users"])
        },
        
        props: {
            source: String
        },
        methods: {
            ...mapActions(["checkStorage", "addUsers"]),

            updateProfile: function(){
                let index=this.users.findIndex(x=>x.email==this.user.email);
                if(this.password.length>0){
                    this.user.password=SHA256(this.password);
                    //alert(this.user.password)
                }
                if(this.username.length>0){
                    this.user.email=this.username+'@'+this.extension;
                }
                
                //console.log(JSON.stringify(this.user))
                axios.post(this.domain + "/user", this.user)
                .then(response => {
                    if(response.data.status>0){
                        this.users.splice(index, 1)
                        this.users.push(this.user);
                        this.addUsers(this.users);
                        LS.set('user', this.user)
                    }
                    this.message=response.data.message
                    this.error_dialog=true
                })
                .catch(e => {
                    //alert('error')
                    console.log(e)
                    this.message=e
                    this.error_dialog=true
                });
            }
        },
        mounted() {
            this.user=LS.get('user')
            this.username=this.user.email.substring(0, this.user.email.indexOf("@"))
            this.extension=this.user.email.split('@')[1]
            
            //this.checkStorage();
        }
    };
</script>

<style>
    .page-header {
        width: 100%;
        height: 70px;
        padding: 10px 20px 10px 20px;
        font-size: 2em;
    }
</style>
</script>
<style></style>