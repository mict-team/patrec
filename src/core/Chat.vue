<template>
  <div id="chat-wrapper">
    <v-card id="settings" class="py-2 px-4" color="rgba(0, 0, 0, .3)" dark flat link min-width="100"
      style="position: fixed; top: 115px; right: -35px; border-radius: 8px;" >
      <v-badge color="green" overlap bordered v-if="isAnyMsg">
        <template v-slot:badge>
          <span>{{ getNoOfUnreadChat }}</span>
        </template>

        <v-icon large>email</v-icon>
      </v-badge>
      <v-icon large v-else>
        email
      </v-icon>
    </v-card>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      activator="#settings"
      bottom
      content-class="v-settings"
      left
      nudge-left="8"
      offset-x
      origin="top right"
      transition="scale-transition"
      max-height="500"
      :allow-overflow="scroll"
    >
      <v-card class="text-left" width="350" height="100%">
        <template v-if="!inChatArea">
            <template v-if="!isSearch">
              <v-flex xs12 row style="width: 100%; margin-left:0px; padding: 5px 5px; border-bottom: 1px solid #eee;">
                <v-flex xs11>
                  <strong class="mb-3 d-inline-block">{{ user.name | toTitleCase }}</strong>
                </v-flex>
                <v-flex xs1>
                  <v-btn icon @click="showSearch">
                    <v-icon>search</v-icon>
                  </v-btn>
                </v-flex>
              </v-flex>
              <v-card-text>
                <v-flex
                  row
                  v-for="(user, index) in chatList"
                  :key="index"
                  @click="viewMsg(user.receiver)"
                  style="cursor: pointer"
                >
                  <v-flex xs3>
                    <v-avatar size="48px" tile>
                      <img src="../assets/user.png" />
                    </v-avatar>
                  </v-flex>
                  <v-flex xs9>
                    <v-flex xs12 row>
                      <v-flex xs6 style="text-align: left;font-weight: bold !important;"><h6>{{ user.receiver.name | truncate(15) }}</h6></v-flex>
                      <v-flex xs6 style="text-align: right; font-size:12px;">{{ formatDateTime(user.msg) }}</v-flex>
                      <v-flex xs11 style="text-transform: capitalize !important;">
                        <small>{{ getLastMsg(user.msg) | truncate(40) }}</small>
                      </v-flex>
                    </v-flex>
                    <v-divider></v-divider>
                  </v-flex>
                </v-flex>
              </v-card-text>
            </template>
            <template v-else>
              <v-flex xs12 row style="width: 100%; margin-left:0px; padding: 5px 5px; border-bottom: 1px solid #eee;">
                <v-flex xs1>
                  <v-btn icon @click="showChats">
                    <v-icon style="font-size:35px;">keyboard_arrow_left</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs11>
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
            </template>
          </template>
          <template v-else>
            <v-toolbar color="blue" dark>
              <v-btn icon @click="showChats">
                <v-icon style="font-size:35px;">keyboard_arrow_left</v-icon>
              </v-btn>
              <v-avatar size="55px" tile>
                    <img src="../assets/user.png" />
                  </v-avatar>
              <v-toolbar-title>
                
                {{ party.name }}
                </v-toolbar-title>
              <v-spacer></v-spacer>

              <v-btn icon @click="$refs.attachment.click()">
                <v-icon style="font-size:35px;">attachment</v-icon>
                <input type="file" style="display:none" ref="attachment" />
              </v-btn>
            </v-toolbar>
            <v-card-text class="scroller" style="height:355px;">
              <div class="rows" v-for="(msg, index) in getChats" :key="index">
                <div class="col-md-12">
                  <div class="talk-bubble round" :class="msg.sender == user.id?'talk-bubble-right tri-right right-top':' tri-left left-top'">
                    <div class="talktext">
                      <span>{{ msg.msg }}</span>
                      <br>
                      <small class="date">{{ formatDateTimeFromSingle(msg.date) }}</small>
                    </div>
                  </div>  
                </div>
              </div>
            </v-card-text>
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
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import Proxyable from "vuetify/lib/mixins/proxyable";
import { mapState, mapActions } from "vuex";
import { URL, LS, APP, SHA256 } from "../shared/config.js";
const DateService=require("../shared/date.service.js");
export default {
  name: "DashboardCoreChat",
  data: () => ({
    menu: false,
    tab: null,
    msg: "",
    chatList:[],
    messages: [],
    openedChats:[],
    inChatArea: false,
    isSearch: false,
    users: [],
    user: [],
    party: [],
    scroll: true
  }),
  mixins: [Proxyable],
  components: {},
  computed: {
    ...mapState(["chats", "domain"]),
    getChats() {
      return this.openedChats;
    },
    isAnyMsg() {
      return this.chatList.length > 0 ? true : false;
    },
    getNoOfUnreadChat(){
      let unreads=this.chatList.filter(x=>x.msg.isRead=='0');
      return unreads.length || '';
    }
  },
  methods: {
    ...mapActions(["setDomain", "setChats", "addChats", "checkStorage"]),
    innitialzeBoard: function() {
      this.user = LS.get("user");
      this.inChatArea = false;
      this.isSearch = false;
      this.chatList = this.chats;
    },
    formatDateTime: function(msgs){
      return DateService.shortDate(new Date(msgs[msgs.length-1].date), 'en');
    },
    formatDateTimeFromSingle: function(value){
      return DateService.shortDate(new Date(value), 'en');
    },
    openChat: function(index) {
      this.party = index;
      this.inChatArea = true;
    },
    showChats: function() {
      this.inChatArea = false;
      this.isSearch = false;
    },
    getLastMsg: function(msgs){
      //console.log(msgs)
      return msgs[msgs.length-1].msg
    },
    showSearch: function() {
      this.inChatArea = false;
      this.isSearch = true;
      this.get(`/users/chats/${this.user.id}`)
        .then(response => {
          if (response.status > 0) {
            this.users = response.response;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    viewMsg: function(index) {
      this.openedChats=[];
      if(this.chats.length>0){
        let chats=[]
        for(let ln in this.chatList){
          //console.log(index.id, this.chatList[ln].receiver.id)
          if(this.chatList[ln].receiver.id==index.id){
            chats=this.chatList[ln];
          }
        }
        if(chats){
          this.openedChats=chats.msg
        }  
      }
      
      this.party = index;
      this.inChatArea = true;
    },
    sendMsg: function() {
      var today = new Date();
      var date =
        String(today.getFullYear()).padStart(2, "0") +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");
      var time =
        String(today.getHours()).padStart(2, "0") +
        ":" +
        String(today.getMinutes()).padStart(2, "0") +
        ":" +
        String(today.getSeconds()).padStart(2, "0");
      today = date + " " + time;
      //alert(JSON.stringify(this.user))
      let sender={id: this.user.id, name: this.user.name, dept: this.user.department, online: true};
      this.messages = {
        sender: sender.id,
        receiver: this.party.id,
        msg: this.msg,
        date: today,
        isSent: 0,
        isRead: 0
      };
      //console.log(this.party)
      this.addChats({sender: sender, receiver: this.party, msg: this.messages});
      this.msg = "";
    },
    checkEnteredKeys: function(e) {
      if (e.keyCode === 13) {
        this.sendMsg();
      }
    },
    loadChats: function() {
      //alert(`${this.domain}/get-chats/${this.user.id}`)
      this.get(`/get-chats/${this.user.id}`)
        .then(response => {
          if (response.status > 0) {
            this.chatList = response.response;
            this.chats.forEach(w => {
              this.chatList.push(w);
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    loadDetails: function() {
      this.get(`/get-chats/${this.user.id}/${this.party.id}`)
        .then(response => {
          if (response.status > 0) {
            this.messages = response.response;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    postChats: function() {
      this.post(`/put-chats`, this.chats)
        .then(response => {
          if (response.status > 0) {
            this.setChats({});
          } else {
            this.setChats(response.response);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    normalizeChats: function() {},
    autoSync: function() {
      var vm = this;
      var interval = setInterval(function() {
        vm.loadChats();
      }, 100000);
      var interval_ = setInterval(function() {
        if (vm.inChatArea) {
          vm.loadDetails();
        }
        if (vm.chats.length > 0) {
          vm.postChats();
        }
      }, 5000);
    }
  },
  created() {
    this.checkStorage();
    this.setDomain();
  },
  mounted() {
    setTimeout(this.innitialzeBoard, 200);
    //this.autoSync();
  }
};
</script>

<style scoped>
v-chat v-item-group > * {
  cursor: pointer;
}

v-chat v-item-group v-item {
  border-width: 3px;
  border-style: solid;
  border-color: transparent !important;
}
v-chat v-item-group v-item:active {
  border-color: #00cae3 !important;
}
input[type="text"] {
  border: 0px;
  width: 100%;
  font-size: 15px;
}
.user-list {
  width: 100%;
  height: 20px; 
}
.talk-bubble {
  margin: 5px;
  display:inline-flex;
  position: relative;
  max-width: 300px;
  height: auto;
  background-color: lightgreen;
}
.talk-bubble-right {
  float: right;
  background-color: #dfe9ec;
  margin-right: 20px;
}
.border {
  border: 8px solid lightgreen;
}
.round {
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
}
.tri-left {
  position: relative;
  left: 5px;
}
.tri-left.border.left-top:before {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: -40px;
  right: auto;
  top: -8px;
  bottom: auto;
  border: 32px solid;
  border-color: lightgreen transparent transparent transparent;
}
.tri-left.left-top:after {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: -20px;
  right: auto;
  top: 0px;
  bottom: auto;
  border: 22px solid;
  border-color: lightgreen transparent transparent transparent;
}

.tri-right {
  position: relative;
  right: -20px;
}
.tri-right.border.right-top:before {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: -40px;
  top: -8px;
  bottom: auto;
  border: 32px solid;
  border-color: #dfe9ec transparent transparent transparent;
}
.tri-right.right-top:after {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: -20px;
  top: 0px;
  bottom: auto;
  border: 20px solid;
  border-color: #dfe9ec transparent transparent transparent;
}
/* talk bubble contents */
.talktext {
  width: auto;
  padding: 1em;
  text-align: left;
  line-height: 1.5em;
}
.talktext p {
  /* remove webkit p margins */
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
}
.talktext small {
  text-align: right !important;
}
</style>
