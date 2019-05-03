<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      app
      hide-overlay
      stateless
      temporary
    >
    <v-toolbar flat class="transparent" @click.stop="drawer = false">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="../assets/unimedth.png">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{outlet.ministry_name}}</v-list-tile-title>
              
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      
      <v-divider></v-divider>
      <v-list dense @click.stop="drawer = false">
        <template v-for="item in items">
          <v-layout v-if="item.divider" :key="item.heading" row align-center>
            <v-flex xs12>
              <v-divider></v-divider>
            </v-flex>
          </v-layout>
          <v-list-group v-else-if="item.children" :key="item.text" v-model="item.model" :prepend-icon="item.model ? item.icon : item['icon-alt']" append-icon="">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ item.text }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
            <v-list-tile v-for="(child, i) in item.children" :key="i" :to="child.url" >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :key="item.text" :to="item.url">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-3" dark app fixed class="no-print" @click.stop="drawer = false">
      <v-toolbar-title style="width: 400px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">{{outlet.outlet}}</span>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <Network v-on:checkConnectivity="handleConnectivityChange" class="floatedContent"></Network>
        
      <v-btn icon v-if="status" title="Currently connected">
        <v-icon>router</v-icon>
      </v-btn>
      <v-btn icon class="red" v-if="!status" title="No internet">
        <v-icon>not_interested</v-icon>
      </v-btn>
      
      <v-btn icon @click="updateApp" v-if="status" title="Update app">
        <v-icon>cloud_download</v-icon>
      </v-btn>
      <v-btn icon @click="$router.push('/home')" title="Go to dashboard">
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon @click="$router.push('/report')" title="Go to report">
        <v-icon>bar_chart</v-icon>
      </v-btn>
      <v-btn icon @click="priceList" title="Price book">
        <v-icon>book</v-icon>
      </v-btn>
      <v-btn icon title="Notification">
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-btn icon @click="logout" title="Logout"> 
        <v-icon>power_off</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img
            src="../assets/user.png"
            alt="Adewumi Adedeji"
          >
        </v-avatar>
      </v-btn>
    </v-toolbar>
    <v-content  @click.stop="drawer = !drawer">
      <v-container fluid fill-height grid-list-md>
        <v-layout justify-left align-left @click.stop="drawer = false">
            <router-view class="inner-container"></router-view>
        </v-layout>
      </v-container>
    </v-content>
    
  </v-app>
</template>

<script>
import axios from "axios";
import offline from 'v-offline';
import {URL, LS, APP} from "../shared/config.js";
import { mapState, mapActions } from "vuex";
import Network from "./Network";
const os = window.require("os");

  export default {
    data: () => ({
        dialog: false,
        drawer: null,
        status:false,
        showNotification:true,
        syncUpdate:true,
        startSync:0,
        items: [
          { icon: 'home', text: 'Dashboard', url:'/home', target:'in' },
          { icon: 'calendar_today', text: 'Billing', url:'/billing', target:'in' },
          { icon: 'healing', text: 'Requisition', url:'/requisition', target:'in' },
          { divider: 'divider' },
          { icon: 'bar_chart', text: 'Reports', url:'/report', target:'in' },
          { icon: 'book', text: 'Price book', url:'/price-list', target:'in' },
          { divider: 'divider' },
          { icon: 'person', text: 'User profile', url:'/user-profile', target:'in' },
          { divider: 'divider' },
          { icon: 'chat_bubble', text: 'Send feedback', url:'', target:'out' },
          { icon: 'phonelink', text: 'App downloads', url:'', target:'out' },
          { icon: 'keyboard', text: 'Go to the old version', url:'', target:'out' },
          { icon: 'help', text: 'Help', url:'/about', target:'out' }
        ]
    }),
    components: {
        Network
    },
    computed: {
      ...mapState([
        "outlet",
        "domain",
        "cart",
      ])
    },
    props: {
      source: String
    },
    methods: {
        ...mapActions([
          "addCart",
          "setCart",
          "addProduct",
          "getDomain",
          "unSyncCart",
          "updateCarts",
          "checkStorage",
          "saveStorage"
        ]),
        handleConnectivityChange(status) {
          if(status){
            this.status=status.status;
          }
          
          //console.log(status)
        },
        logout: function(){
          this.updateApp();
            
          LS.remove('user');
          this.$router.push('/login')
        },
        updateApp: function() {
          //console.log(this.unsyncCart)
          //this.setCart(data)
          
          if (this.status) {
            alert("Updating app... Please hold on");
            let postData = {
              key: 'update',
              outlet: this.outlet,
              carts: this.cart
            };
            console.log(JSON.stringify(postData))
            axios.post(this.domain + "/sync", postData)
            .then(response => {
                console.log(response.data)
                //alert('deji')
                if(response.data.status>0){
                  this.setCart(response.data.response.carts);
                  alert('Payments synchronized successfully. Please wait ...')
                }
            })
            .catch(e => {
              //console.log(e)
            });

            postData={
              key:'app',
              outlet: this.outlet,
              user: LS.get('user')
            }
            //console.log(JSON.stringify(postData))
            axios.post(this.domain + "/postSync", postData)
            .then(response => {
                if(response.data.status>0){
                  this.addProduct(response.data.response.product);
                  alert('Update completeed successfully. Your records uploaded.')
                }
            })
            .catch(e => {
              //console.log(e)
            });
          }else{
            alert("No internet connection. Please connect and try again.")
          }
        },
        autoSync: function() {
          var vm = this;
          if(this.syncUpdate){
             var interval = setInterval(function() {
              vm.syncData();
            }, 300000);
          }
          
        },
        syncData: function() {
          let postData = {
            outlet: this.outlet,
            carts: this.unsyncCart
          };
          //console.log(this.unsyncCart)
          if (this.status && this.unSyncCart.length>0) {
            //console.log(JSON.stringify(postData))
            axios.post(this.domain + "/sync", postData)
            .then(response => {
                
                if(response.data.status>0){
                  var cart=response.data.response.cart;
                  if(cart){
                    for(var i=0; i<cart.length; i++){
                      this.updateCarts(cart[i])
                    }  
                  }
                  
                }
                //console.log(response.data)
            })
            .catch(e => {
              //alert('error')
              console.log(e)
            });
          }
        },
        priceList: function(){
          this.$router.push('/price-list');
        }
    },
    mounted(){
      this.checkStorage();
      this.getDomain();
      this.autoSync();
      //this.unSyncCart(false);
      this.handleConnectivityChange(null)
      var system={'user': os.userInfo(), 'address':os.networkInterfaces()}
      LS.set('system',system);
      //console.log();
    }
  }
</script>
<style>
  .inner-container{
    width: 100%;
  }
  .fab-container {
    position: fixed;
    bottom: 0;
    right: 0;
  }
</style>
    