<template>
  <v-app id="inspire">
    <v-layout align-center justify-center >
        <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>About eRevenue </v-toolbar-title>
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
                    <v-flex xs12>
                        Application name: eRevenue
                    </v-flex>
                    <v-flex xs12>
                        Application name: eRevenue
                    </v-flex>
                    <v-flex xs12>
                        <v-btn @click="checkUpdate">
                            Check for update now
                        </v-btn>
                    </v-flex>
                </v-form>
              </v-card-text>
              <v-card-actions>
                
              </v-card-actions>
            </v-card>
          </v-flex>
       
    </v-layout>
    
  </v-app>
</template>

<script>
    import { URL, LS, SHA256 } from "../shared/config.js";
    import { checkForUpdates } from "../shared/updater.js";

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
           checkUpdate: function(){
               checkForUpdates();
           }
        },
        mounted() {
           
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