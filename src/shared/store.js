import Vue from "vue";
import Vuex from "vuex";

import idbs from "../utils/idb";
import {URL, LS, IDGenerator} from "../shared/config.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    outlet: [],
    products: [],
    cart: [],
    users: [],
    todaySales: [],
    paymentMethods: [],
    unsyncCart: [],
    unsyncUsers: [],
    billings: [],
    bills:[],
    domain:'',
    transCode:'',
    today:'',
    dataFields: [
      "outlet",
      "products",
      "paymentMethods",
      "cart",
      "users",
      "billings"
    ]
  },
  mutations: {
    setState(state, { field, data }) {
      Vue.set(state, field, data);
    },
    setDomain(state) {
      state.domain=(!state.outlet.domain || state.outlet.domain=='')?URL:state.outlet.domain;
    },
    setCode(state) {
      
      var id = state.outlet.paypoint.toString()+ (new Date().getTime()).toString(8);
      state.transCode = state.outlet.paypoint.toString() + IDGenerator();//Math.floor(Math.random() * 1000000000 + 1);
    },
    setToday(state) {
      var today = new Date();
      // var dd = String(today.getDate()).padStart(2, "0");
      // var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      // var yyyy = today.getFullYear();
      var date = String(today.getFullYear()).padStart(2, "0")+'-'+String((today.getMonth()+1)).padStart(2, "0")+'-'+String(today.getDate()).padStart(2, "0");
      var time = String(today.getHours()).padStart(2, "0") + ":" + String(today.getMinutes()).padStart(2, "0") + ":" + String(today.getSeconds()).padStart(2, "0");
      today = date + " " + time;

      state.today = today;
    },
    addOutlet(state, newOutlet) {
      state.outlet = newOutlet;
    },
    addBilling(state, newBilling) {
      // var index=state.billings.findIndex(bill=>bill.code == newBilling.code)
      // if(index> -1){
      //   state.billings.splice(index, 1);
      // }
      //console.log(state.billings);
      state.billings=newBilling;
    },
    addProduct(state, newProduct) {
      state.products = newProduct;
    },
    addpaymentMethods(state, newMethod) {
      state.paymentMethods=newMethod;
    },
    addCart(state, newCart) {
      state.cart.push(newCart);
    },
    setCart(state, newCart) {
      state.cart=newCart;
    },
    addUsers(state, newUsers, flag) {
      if(flag===true){
        state.users.push(newUsers);
      }else{
        state.users=newUsers;
      }
    },
    
    deleteCart(state, { cartIndex }) {
      state.cart.splice(cartIndex, 1);
    },
    getBills(state){
      let bills=state.billings
      var res = [];
      for (var bill of bills) {
        bill['total']=Number(bill['total'])
        //console.log(bill['amount'])
        var filter=res.findIndex(value => value['customer']['file'] === bill['customer']['file'])
        if(filter<0){
          res.push(bill)
        }else{
          res.forEach(value => {
            if (value['customer']['file'] === bill['customer']['file']){
              //console.log(value['amount'])
              value['total'] += bill['total']
            }
          }); 
        }     
      }
      //console.log(res);
      state.bills= res;
    },
    todaySales(state) {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = yyyy + "-" + mm + "-" + dd;
      state.todaySales=[];
      //console.log(state.cart)
      var user=LS.get('user');
      for(var i=0; i<state.cart.length; i++){
        if(state.cart[i]['date']==today && state.cart[i]['user']['id']==user['id']){
          state.todaySales.push(state.cart[i]);
        }
      }
    },
    unsyncCart(state, status) {
      var found = state.cart.filter(function(item) {
        return  item.sync===status ;
      })
      state.unsyncCart=found;
    },
    
    unsyncUsers(state) {
      var found = state.users.find(x => x.sync === true);
      state.unsyncUsers.push(found);
    },
    deleteUser(state, { userIndex }) {
      state.users.splice(userIndex, 1);
    },
    deleteBilling (state, { billingIndex }) {
      if (billingIndex) {
        let bill=state.billings;
        for(var i=0; i<bill.length; i++){
          if(bill[i]['card_no']===billingIndex['card_no']){
            bill.splice(i,1);
          }
        }
        state.billings=bill;
      }
    },
  },
  actions: {
    
    addOutlet({ commit, dispatch }, newOutlet) {
      commit("addOutlet", newOutlet);
      dispatch("saveStorage");
    },

    addProduct({ commit, dispatch }, newProduct) {
      commit("addProduct", newProduct);
      dispatch("saveStorage");
    },
    
    addBilling({ commit, dispatch }, newBilling) {
      commit("addBilling", newBilling);
      dispatch("saveStorage");
    },
    deleteBilling ({ commit, dispatch }, billingInfo) {
      commit('deleteBilling', billingInfo)
      dispatch('saveStorage')
    },
    addpaymentMethods({ commit, dispatch }, newMethod) {
      commit("addpaymentMethods", newMethod);
      dispatch("saveStorage");
    },
    addCart({ commit, dispatch }, newCart) {
      commit("addCart", newCart);
      dispatch("saveStorage");
    },
    setCart({commit, dispatch}, newCart){
      commit('setCart', newCart);
      dispatch("saveStorage");
    },
    addUsers({ commit, dispatch }, newUsers, flag) {
      commit("addUsers", newUsers, flag);
      dispatch("saveStorage");
    },
    getCode({ commit, dispatch }){
      commit("setCode");
    },
    getToday({ commit, dispatch }){
      commit("setToday");
    },
    getDomain({ commit, dispatch }){
      commit("setDomain");
    },
    padBills({ commit }) {
      commit("getBills");
    },
    filterSales({ commit, dispatch }) {
      commit("todaySales");
    },
    unSyncCart({ commit, dispatch }, status) {
      commit("unsyncCart", status);
    },
    
    unsyncUsers({ commit, dispatch }, userIndex) {
      commit("unsyncUsers", userIndex);
      dispatch("saveStorage");
    },
    updateCarts({state, dispatch}, cart){
      //console.log(state.unsyncCart)
      
      //console.log(cart)
      if(cart){
        dispatch("updateStorage", {code:'code', search:cart.code, value:cart});
      }
    },
    updateBilling({state, dispatch}, bill){
      if(bill){
        dispatch("updateStorage", bill);
      }
    },
    deleteCart({ commit, dispatch }, cartInfo) {
      commit("deleteCart", cartInfo);
      dispatch("saveStorage");
    },
    deleteUser({ commit, dispatch }, userInfo) {
      commit("deleteUser", userInfo);
      dispatch("saveStorage");
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
    },
    async updateStorage({state}, value){
      try {
        //console.log(value)
        await Promise.all(
          idbs.updateSorage(value.store, value.index, value.search, value.value)
        );
      } catch (e) {
        //console.log(e)
        return;
        //state.dataFields.forEach(field => ls.saveToStorage(field, state[field]))
      }
    }
  }
});
