import Vue from "vue";
import Vuex from "vuex";

import idbs from "./idb";
import { URL, LS, IDGenerator } from "./config.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    barColor: "rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)",
    barImage: "https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg",
    drawer: null,
    outlet: [],
    departments: [],
    platforms: [],
    paymentMethods: [],
    settings: [],
    transactions: [],
    carts: [],
    chats: [],
    unsentChat: [],
    drugs: [],
    user: [],
    patients: [],
    register: [],
    schedules: [],
    returned: [],
    requisition: [],
    packeditems: [],
    users: [],
    roles: [],
    group: [],
    products: [],
    schemes: [],
    domain: "",
    patCode: "",
    transCode: "",
    today: "",
    todaySales: [],
    search: "",
    dataFields: [
      "outlet",
      "departments",
      "platforms",
      "paymentMethods",
      "settings",
      "transactions",
      "register",
      "drugs",
      "chats",
      "carts",
      "users",
      "roles",
      "group",
      "schemes",
      "products",
      "patients",
      "schedules",
      "returned",
      "requisition",
      "packeditems"
    ]
  },
  mutations: {
    setState(state, { field, data }) {
      Vue.set(state, field, data);
    },
    SET_BAR_IMAGE(state, payload) {
      state.barImage = payload;
    },
    SET_DRAWER(state, payload) {
      state.drawer = payload;
    },

    setSearch(state, str) {
      state.search = str;
    },
    setDomain(state) {
      state.domain =
        !state.outlet.domain || state.outlet.domain == ""
          ? URL
          : state.outlet.domain;
    },
    setCode(state) {
      //var id = state.outlet.id.toString()+ (new Date().getTime()).toString(8);
      state.patCode = "PAT" + IDGenerator(5);
    },
    setToday(state) {
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
      state.today = today;
    },
    setProducts(state, newProduct) {
      state.products = newProduct;
    },
    setUser(state, newUser) {
      state.users = newUser;
    },
    setRoles(state, newRoles) {
      state.roles = newRoles;
    },
    setGroup(state, newGroup) {
      state.group = newGroup;
    },
    setSchemes(state, schemes) {
      state.schemes = schemes;
    },
    setDepartment(state, newDepartment) {
      state.departments = newDepartment;
    },
    addDepartment(state, newDepartment) {
      state.departments.push(newDepartment);
    },
    setChats(state, newChat) {
      state.chats = newChat;
    },
    addChats(state, newChat) {
      let found=false;
      if(state.chats.length>0){
        for(let ln in state.chats){
          //console.log(ln, state.chats[ln])
          if(state.chats[ln].receiver.id==newChat.receiver.id){
            state.chats[ln]['msg'].push(newChat.msg);
            found=true;
            break;
          }
        }
        if(!found){
          let msg=[];
          msg[0]=newChat.msg;
          state.chats.push({sender: newChat.sender, receiver: newChat.receiver, msg: msg});
        }
      }else{
        let msg=[];
        msg=newChat.msg;
        newChat.msg=[];
        newChat.msg[0]=msg;
        state.chats[0]=newChat;
      }
    },
    setPlatform(state, platform) {
      state.platforms = platform;
    },
    setTransactions(state, newTransactions) {
      state.transactions = newTransactions;
    },
    setRegister(state, newRegister) {
      state.register = newRegister;
    },

    setOutlet(state, newOutlet) {
      state.outlet = newOutlet;
    },

    setDrugs(state, newDrugs) {
      state.drugs = newDrugs;
    },
    addDrugs(state, newDrug) {
      state.drugCategory.push(newDrug);
    },

    setPaymentMethods(state, newMethod) {
      state.paymentMethods = newMethod;
    },

    addCart(state, newCart) {
      state.carts.push(newCart);
    },
    setCart(state, newCart) {
      state.carts = newCart;
    },

    setPatients(state, newPatients) {
      state.patients = newPatients;
    },
    addPatients(state, newPatients) {
      state.patients.push(newPatients);
    },

    setSettings(state, newSettings) {
      state.settings = newSettings;
    },

    setRetruns(state, newReturns) {
      state.returns = newReturns;
    },
    addRetruns(state, newReturns) {
      state.returns.push(newReturns);
    },

    setSchedules(state, newSchedules) {
      state.schedules = newSchedules;
    },

    addRequisition(state, newRequisition) {
      state.requisition.push(newRequisition);
    },
    setRequisition(state, newRequisition) {
      state.requisition = newRequisition;
    },

    addPacked(state, newPacked) {
      state.packeditems.push(newPacked);
    },
    setPacked(state, newPacked) {
      state.packeditems = newPacked;
    },
    todaySales(state) {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = yyyy + "-" + mm + "-" + dd;
      state.todaySales = [];
      var user = LS.get("user");
      for (var i = 0; i < state.carts.length; i++) {
        if (
          state.carts[i]["date"] == today &&
          state.carts[i]["user"]["id"] == user["id"]
        ) {
          state.todaySales.push(state.carts[i]);
        }
      }
    }
  },
  actions: {
    setDomain({ commit, dispatch }) {
      commit("setDomain");
    },

    setCode({ commit, dispatch }) {
      commit("setCode");
    },
    setSearch({ commit, dispatch }, str) {
      commit("setSearch", str);
    },
    setProducts({ commit, dispatch }, obj) {
      commit("setProducts", obj);
      dispatch("saveStorage");
    },
    setRegister({ commit, dispatch }, obj) {
      commit("setRegister", obj);
      dispatch("saveStorage");
    },
    setOutlet({ commit, dispatch }, obj) {
      commit("setOutlet", obj);
      dispatch("saveStorage");
    },
    setSchemes({ commit, dispatch }, obj) {
      commit("setSchemes", obj);
      dispatch("saveStorage");
    },
    setUser({ commit, dispatch }, obj) {
      commit("setUser", obj);
      dispatch("saveStorage");
    },
    setRoles({ commit, dispatch }, obj) {
      commit("setRoles", obj);
      dispatch("saveStorage");
    },
    setGroup({ commit, dispatch }, obj) {
      commit("setGroup", obj);
      dispatch("saveStorage");
    },
    setChats({ commit, dispatch }, obj) {
      commit("setChats", obj);
      dispatch("saveStorage");
    },
    addChats({ commit, dispatch }, obj) {
      commit("addChats", obj);
      dispatch("saveStorage");
    },
    setPlatform({ commit, dispatch }, obj) {
      commit("setPlatform", obj);
      dispatch("saveStorage");
    },
    getToday({ commit, dispatch }) {
      commit("setToday");
    },
    setTransactions({ commit, dispatch }, obj) {
      commit("setTransactions", obj);
      dispatch("saveStorage");
    },
    setDepartment({ commit, dispatch }, obj) {
      commit("setDepartment", obj);
      dispatch("saveStorage");
    },
    addDepartment({ commit, dispatch }, obj) {
      commit("addDepartment", obj);
      dispatch("saveStorage");
    },

    setDrugs({ commit, dispatch }, obj) {
      commit("setDrugs", obj);
      dispatch("saveStorage");
    },

    addDrugs({ commit, dispatch }, obj) {
      commit("addDrugs", obj);
      dispatch("saveStorage");
    },
    setPaymentMethods({ commit, dispatch }, obj) {
      commit("setPaymentMethods", obj);
      dispatch("saveStorage");
    },

    addCart({ commit, dispatch }, obj) {
      commit("addCart", obj);
      dispatch("saveStorage");
    },
    setCart({ commit, dispatch }, obj) {
      commit("setCart", obj);
      dispatch("saveStorage");
    },

    setPatients({ commit, dispatch }, obj) {
      commit("setPatients", obj);
      dispatch("saveStorage");
    },
    addPatients({ commit, dispatch }, obj) {
      commit("addPatients", obj);
      dispatch("saveStorage");
    },

    setSettings({ commit, dispatch }, obj) {
      commit("setSettings", obj);
      dispatch("saveStorage");
    },

    setRetruns({ commit, dispatch }, obj) {
      commit("setRetruns", obj);
      dispatch("saveStorage");
    },
    addRetruns({ commit, dispatch }, obj) {
      commit("addRetruns", obj);
      dispatch("saveStorage");
    },

    setSchedules({ commit, dispatch }, obj) {
      commit("setSchedules", obj);
      dispatch("saveStorage");
    },

    addRequisition({ commit, dispatch }, obj) {
      commit("addRequisition", obj);
      dispatch("saveStorage");
    },
    setRequisition({ commit, dispatch }, obj) {
      commit("setRequisition", obj);
      dispatch("saveStorage");
    },

    addPacked({ commit, dispatch }, obj) {
      commit("addPacked", obj);
      dispatch("saveStorage");
    },
    setPacked({ commit, dispatch }, obj) {
      commit("setPacked", obj);
      dispatch("saveStorage");
    },

    getCode({ commit, dispatch }) {
      commit("setCode");
    },
    async checkStorage({ state, commit }) {
      state.dataFields.forEach(async field => {
        try {
          let data = await idbs.checkStorage(field);
          // IndexedDB did not find the data, try localStorage
          if (data === undefined) data = [];
          // LocalStorage did not find the data, reset it
          if (data === null) data = [];

          commit("setState", { field, data });
        } catch (e) {
          // The value in storage was invalid or corrupt so just set it to blank
          commit("setState", { field, data: [] });
        }
      });
    },
    async saveStorage({ state }) {
      try {
        //console.log(state)
        await Promise.all(
          state.dataFields.map(field => idbs.saveToStorage(field, state[field]))
        );
      } catch (e) {
        //console.log(e)
        return;
        //state.dataFields.forEach(field => ls.saveToStorage(field, state[field]))
      }
    }
  }
});
