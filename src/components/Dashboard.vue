<template>
  <v-container id="user-profile" fluid tag="section">
    <component :is="componentName" />
  </v-container>
</template>


<script>
import { URL, LS, SHA256 } from "../shared/config.js";
import { mapState, mapActions } from "vuex";
import * as components from './dashboards'
export default {
  name: "Home",
  data: () => ({
    store: [],
    error: "",
    user: [],
    currentSession: [],
    departments: [],
    loadingDialog: false,
    
  }),
  components,
  props: {
    source: String
  },
  computed: {
    ...mapState(["outlet", "group", "roles", "search"]),
    componentName(){
      let home=LS.get('home');
      home=(home)?home:'Home_';
      //alert(home)
      return home;//this.$route.meta.page;
    },
    componentSearchPath(){
      return this.$route.meta.search
    }
  },
  methods: {
    ...mapActions(["setSearch", "checkStorage"]),
    
    innitialize: function() {
      
      LS.set('searchPath', this.componentSearchPath);
      var loadDept = new Promise((resolve, reject) => {
        this.get("/dept")
          .then(response => {
            if (response.status > 0) {
              resolve(response.response);
            } else {
              reject(response.message);
            }
          })
          .catch(e => {
            reject(e.message);
          });
      });
      loadDept.then(depts => {
        var loadUsers = new Promise((resolve, reject) => {
          this.get("/users")
            .then(response => {
              if (response.status > 0) {
                resolve(response.response);
              } else {
                reject(response.message);
              }
            })
            .catch(e => {
              reject(e.message);
            });
        });
        loadUsers.then(users => {
          depts.forEach(w => {
            var items = users.filter(item => {
              return item.department == w.id;
            });
            var obj = {
              dept: w.name,
              users: items.length
            };
            this.departments.push(obj);
          });
        });
      });
    },
  },
  mounted() {
    this.checkStorage();
    //this.innitialize();
  }
};
</script>

<style scoped>

</style>