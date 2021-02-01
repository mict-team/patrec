<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
            <v-layout row align-center style="text-align:center !important;">
                <v-flex xs12>
                    <v-avatar size="100px" tile>
                        <img
                            src="../assets/logo.png"
                            :alt="outlet.outlet"
                        >
                    </v-avatar>
                </v-flex>
                <v-flex xs12>
                    <h4>{{outlet.outlet}}</h4>
                </v-flex>
            </v-layout>
            <template v-for="item in getItems">
                <v-layout v-if="item.divider" :key="item.heading" row align-center>
                    <v-flex xs12>
                        <v-divider></v-divider>
                    </v-flex>
                </v-layout>
                
                <v-list-group v-else-if="item.children" :key="item.text" v-model="item.model" :prepend-icon="item.model ? item.icon : item['icon-alt']" append-icon="">
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item v-for="(child, i) in item.children" :key="i" :to="child.url" >
                        <v-list-item-action v-if="child.icon">
                            <v-icon>{{ child.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ child.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-item v-else-if="item.checkPerm && canView" :key="item.text" :to="item.url" >
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-else :key="item.text" :to="item.url" >
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="chats" absolute temporary right width="350">
      <Chat  :base="domain" />
    </v-navigation-drawer>

    <v-app-bar id="app-bar" absolute app color="transparent" flat height="75" >
    
        <v-app-bar-nav-icon @click="drawer = !drawer" />
        <span class="title ml-3 mr-5">Welcome to&nbsp;<span class="font-weight-light">Patrec</span></span>

        <v-text-field
            
            solo-inverted
            hide-details
            prepend-inner-icon="search"
            label="Search for patient"
            class="hidden-sm-and-down"
            style="width: 500px"
            v-model="searchStr"
            @keyup="putSearch"
        ></v-text-field>
        
        <v-btn icon large title="Search with Finger print" @click="fingerdialog=true">
            <v-avatar size="42px" tile>
            <img
                src="../assets/fingerprint.png"
                alt="fingerprint"
            >
            </v-avatar>
        </v-btn>
        <v-spacer />
        <v-spacer></v-spacer>
        <v-btn icon  @click="$router.push('/home')">
            <v-icon>apps</v-icon>
        </v-btn>
      
        <v-badge color="green" content="6" value="6" overlap>
            <v-btn icon @click.stop="chats = !chats">
            <v-icon>email</v-icon>
            </v-btn>
        </v-badge>
        <v-menu bottom left offset-y origin="top right" transition="scale-transition" >
        <template v-slot:activator="{ attrs, on }">
            <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on" >
                <v-badge color="red" overlap bordered >
                    <template v-slot:badge>
                        <span>5</span>
                    </template>
                    <v-icon>notifications</v-icon>
                </v-badge>
            </v-btn>
        </template>

        <v-list
            :tile="false"
            nav
        >
            <div>
                <app-bar-item
                    v-for="(n, i) in notifications"
                    :key="`item-${i}`"
                >
                    <v-list-item-title v-text="n" />
                </app-bar-item>
            </div>
        </v-list>
        </v-menu>
      
        <v-btn icon large>
            <v-avatar size="32px" tile>
            <img
                src="../assets/user.png"
                alt="User passport"
            >
            </v-avatar>
        </v-btn>
        <v-btn icon @click="logout">
            <v-icon>logout</v-icon>
        </v-btn>
      
    </v-app-bar>

    <v-content>
      <v-container class="fill-height  main-body Cultured" fluid>
        <router-view class="inner-container scroller"></router-view>
      </v-container>
    </v-content>
    

    <v-dialog v-model="fingerdialog" left top width="400px">
      <v-card>
          <v-card-title
          class="grey lighten-4 py-4 title"
          >
          Place patient finger on sensor.
          </v-card-title>
          <v-container grid-list-sm class="pa-4">
            <v-layout row style="text-align: center !important;">
                <v-flex xs12 center>
                  <v-avatar size="150px" tile>
                    <img
                      src="../assets/fingerprint.png"
                      alt="fingerprint"
                    >
                  </v-avatar>
                </v-flex>
                <br>
                <v-flex xs12 center>Detected sesnsor: None</v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn  color="primary" @click="fingerdialog = false">Cancel</v-btn>
              <v-btn  @click="fingerdialog = false">Search</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="searchdialog" left top width="900px">
      <v-card>
          <v-card-title
          class="grey lighten-4 py-4 title"
          >
          Searching for {{searchStr}}
          </v-card-title>
          <v-container grid-list-sm class="pa-4">
            <v-layout row wrap>
                <v-flex xs12 v-if="stillSearching">
                  <img
                    src="../assets/loading.gif"
                    alt="loading"
                  >
                  {{message}}
                </v-flex>
                <v-flex xs12 v-else>
                  <table class="table table-stripped table-bordered" v-if="filterPtients.length>0">
                    <tr v-for="(pat, index) in filterPtients" :key="index">
                      <td>{{index + 1}}</td>
                      <td>{{pat.name}}</td>
                      <td>{{pat.gender}}</td>
                      <td>{{pat.dob}}</td>
                      <td>{{pat.maritak_status}}</td>
                    </tr>
                  </table>
                  <v-flex xs12 v-else>
                    {{message}}
                  </v-flex>
                </v-flex>
                
            </v-layout>
          </v-container>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn  color="primary" @click="searchdialog = false">Close</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import {URL, LS, APP, SHA256} from "../shared/config.js";
  import Chat from "./shared/Chat";
  export default {
    data: () => ({
      drawer: null,
      chats: null,
      platforms:[],
      drawer_top: null,
      items: [],
      searchStr:'',
      searchdialog: false,
      stillSearching: false,
      fingerdialog: false,
      filterPtients: [],
      sensor: [],
      message:'',
      labs:[],
      menus:[],
      logo:'',
      notifications: [
        'Mike John Responded to your email',
        'You have 5 new tasks',
        'You\'re now friends with Andrew',
        'Another Notification',
        'Another one',
      ],
    }),
    props: {
      source: String
    },
    components: {
      Chat
    },
    computed: {
      ...mapState([
          "outlet",
          "domain",
          "search",
          "patients",
          "newpatients",
          "departments",
          "users"
      ]),
      getItems(){
        var items={};
        //alert(this.platforms.type)
        if(this.platforms.type==0){
          items=this.menus;
        }else{
          var i=0;
          for(var key in this.menus) {
            if(this.menus[key].hasOwnProperty('none') && this.menus[key].none==true){
              continue
            }
            if(this.menus[key].hasOwnProperty('platform') && this.menus[key].platform==this.platforms.type){
              i=key;
              this.menus[key]['children'].forEach(k=>{
                items[i] = k;
                i=i+1;
              });
            }else if(!this.menus[key].hasOwnProperty('platform')){
              items[i] = this.menus[key];
              i=i+1;
            }
          }
        }
        //console.log(items)
        return items;
      }
    },
    methods:{
      ...mapActions([
        "setDomain",
        "setSearch",
        "addPatients",
        "setPlatform",
        "setDepartment",
        "setUser",
        "checkStorage"
      ]),
      initializeMenus: function(){
        this.platforms=LS.get('platform');
        
        this.menus=[
          { icon: 'home', text: 'Dashboard', url:'/home', target:'in', none:true },
          { icon: 'create_new_folder', 'icon-alt': 'create_new_folder', text: 'Records', platform:1, model: false,
            children: [
              { icon: 'home', text: 'Home', url:'/record/overview', target:'in' },
              { icon: 'add', text: 'New Patient', url:'/record/new-patient', target:'in' },
              { icon: 'bar_chart', text: 'Reports', url:'/record/reports', target:'in' },
              { icon: 'search', text: 'Patient Analysis' }
            ]
          },
          { icon: 'wc', 'icon-alt': 'wc', text: 'Nurse', platform:7, model: false,
            children: [
              { icon: 'home', text: 'Overview', url:'/nurse/overview', target:'in' },
              { icon: 'home', text: 'Schedules', url:'/nurse/schedules', target:'in' },
              { icon: 'add', text: 'Patient pre-test', url:'/nurse/preschedule', target:'in' },
            ]
          },
          { icon: 'supervisor_account', 'icon-alt': 'supervisor_account', text: 'Doctors', platform:2, model: false,
            children: [
              { icon: 'home', text: 'Overview', url:'/doctor/overview', target:'in' },
              { icon: 'person_add_disabled', text: 'My schedules', url:'/doctor/schedules', target:'in' },
              { icon: 'add', text: 'Onbed Patients', url:'/doctor/patients', target:'in' },
              { icon: 'search', text: 'Patient Analysis' }
            ]
          },
          { icon: 'colorize', 'icon-alt': 'colorize', text: 'Laboratory', platform:3, model:false,
            children: [
              { icon: 'home', text: 'Home', url:'/laboratory/overview', target:'in' },
              { icon: 'aspect_ratio', text: 'Requests', url:'/laboratory/requests', target:'in' },
              { icon: 'pregnant_woman', text: 'Tests', url:'/laboratory/tests', target:'in' },
              { icon: 'bar_chart', text: 'Report', url:'/laboratory/lab-report', target:'in' }
            ]
          },
          { icon: 'toggle_off', 'icon-alt': 'toggle_off', text: 'Pharmacy',  platform:5, model: false,
            children: [
              { icon: 'home', text: 'Home', url:'/pharmacy/overview', target:'in' },
              { icon: 'library_books', text: 'Main store', url:'/pharmacy/main-store', target:'in' },
              { icon: 'add', text: 'Add drugs', url:'/pharmacy/add-drugs', target:'in' },
              { icon: 'cloud_upload', text: 'Upload drugs', url:'/pharmacy/upload-drug', target:'in' },
              { icon: 'border_all', text: 'Locations', url:'/pharmacy/locations', target:'in', },
              { icon: 'add_comment', text: 'Add supply', url:'/pharmacy/supply', target:'in' },
              { icon: 'vertical_align_center', text: 'Stock transfer', url:'/pharmacy/stock-transfer', target:'in' },
              { icon: 'brightness_4', text: 'Stock requisition', url:'/pharmacy/requisition', target:'in' },
              { icon: 'bar_chart', text: 'Report', url:'/pharmacy/report', target:'in' }
            ]
          },
          { divider: 'divider', none:true},
          { icon: 'bar_chart', 'icon-alt': 'bar_chart', text: 'Reports', platform:0, model: false,
            children: [
              { icon: 'home', text: 'Summary' },
              { icon: 'persons', text: 'By patient' },
              { icon: 'border_all', text: 'By department' },
              { icon: 'border_all', text: 'By scheme' },
            ]
          },
          { divider: 'divider', none:true },
          
          { icon: 'settings', 'icon-alt': 'settings', text: 'Application manager', platform:0, model: false,
            children: [
              { icon: 'home', text: 'General settings', url:'/application/overview', target:'in' },
              { icon: 'home', text: 'Departments', url:'/application/department', target:'in' },
              { icon: 'code', text: 'Platforms', url:'/application/platform', target:'in' },
              { icon: 'hotel', text: 'Data Templates', url:'/application/data-templates', target:'in' },
              { icon: 'person', text: 'User access', url:'/application/users', target:'in' },
              { icon: 'group', text: 'User roles', url:'/application/roles', target:'in' },
              
              { icon: 'message', text: 'Revenue notification', url:'/application/notification', target:'in' }
            ] 
          },
          { divider: 'divider' },
          { icon: 'chat_bubble', text: 'Send feedback' },
          { icon: 'help', text: 'Help' },
          { icon: 'phonelink', text: 'App downloads' },
          { icon: 'keyboard', text: 'Go to the old version' }
        ];
        
      },
      gotoHome: function(){
        this.$router.push('home')
      },
      putSearch: function(e){
        if(e.keyCode===13 && this.searchStr !=''){
          this.setSearch(this.searchStr);
          this.$router.push('/search');
        }
        //this.setSearch(this.searchStr)
      },
      putSearchByFp: function(e){
        //console.log(e.keyCode)

        if(e.keyCode===13 && this.searchStr !=''){
          this.stillSearching=true;
          this.message=`Seaching for ${this.searchStr}`
          this.searchdialog=true;
          this.filterPtients=this.patients.filter(item => {
            return (item.pat_code.toLowerCase().includes(this.searchStr.toLowerCase()) || item.name.toLowerCase().includes(this.searchStr.toLowerCase()) || item.dob.includes(this.searchStr))
          });

          if(this.filterPtients.length<1){
            var postData={
              outlet: this.outlet,
              search: this.searchStr
            }
            this.post("/search-patients", postData).then(resp => {
              if (resp.status > 0) {
                this.addPatients(resp.response);
                this.this.filterPtients= resp.response;
              }else{
                this.$toastr.warning(resp.message);
              }
            }).catch(e => {
              //console.log(e)
              this.$toastr.error(e.message)
            });
          }
          this.stillSearching=false;
        }
        
      },
      loadLabs: function(){//laboratory
        var postData={
          outlet: this.outlet.id
        };
        this.post("/laboratory", postData).then(resp => {
            if (resp.status > 0) {
                this.labs(resp.response.labs);
                this.filterPtients= resp.response;
            }else{
                this.$toastr.warning("Search completed. No match found.");
            }
        })
        .catch(e => {
            this.$toastr.error(e.message);
        });
      },
      addNewPatient: function(){
        this.$router.push({name:'recordnew'});
      },
      logout: function(){
        var logout=new Promise((resolve, reject)=>{
          var user=LS.get('user');
          this.get(`/logout/${user.id}`).then(resp => {
              if (resp.status > 0) {
                  resolve(true)
              }else{
                reject(false);
              }
          })
          .catch(e => {
              reject(false)
          });  
        })
        
        logout.then(response=>{
          if(response){
            LS.remove('patient');
            LS.remove('platform');
            LS.remove('user');
            LS.remove('settings');
            alert('Thank you.')
            this.$router.push('/')
          }else{
            alert("Sorry, your logout attempt failed. Pls try again later.")
          }
        })
        
      },
      autoSync: function() {
        var vm = this;
        var interval = setInterval(function() {
          vm.syncData();
        }, 100000);
      },
      syncData: function() {
        
      },
    },
    created(){
      this.checkStorage();
      this.setDomain();
      var lg=LS.get('logo');
      if(lg){
        this.logo=lg;
      }else{
        this.logo='../assets/logo.png'
      }
    },
    mounted(){
        this.initializeMenus();
        this.autoSync();
    }
  }
</script>