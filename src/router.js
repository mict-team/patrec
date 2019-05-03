import Vue from "vue";
import Router from "vue-router";

import auth from "./middleware/auth";
import quest from "./middleware/quest";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Home from "./components/Home";
import Setup from "./components/Setup";
import Receipt from "./components/Receipt";
import Report from "./components/Report";
import PriceList from "./components/PriceList";
import Billing from "./components/NewBilling";
import BillingItem from "./components/BillingItem";
import AppSetting from "./components/AppSetup";
import SalesHome from "./components/SalesHome";
import UserProfile from "./components/UserProfile";
import Requisition from "./components/Requisition";
import About from "./components/About";

Vue.use(Router);

export default new Router({
  //mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/setup",
      name: "setup",
      component: Setup
    },
    {
      path: "/app-setup",
      name: "appSetup",
      component: AppSetting
    },
    {
      path: "/",
      name: "login",
      component: Login,
      meta: {
        middleware: quest
      }
    },
    {
      path: "/login",
      name: "logins",
      component: Login,
      meta: {
        middleware: quest
      }
    },
    {
      path: "/app",
      name: "app",
      component: Dashboard,
      meta: {
        middleware: auth
      },
      redirect: {
        name: "home"
      },
      children: [
        {
          path: "/home",
          name: "home",
          component: Home
        },
        {
          path: "/sales",
          name: "sales",
          component: SalesHome
        },
        {
          path: "/billing",
          name: "Billing",
          component: Billing
        },
        {
          path: "/billing-list",
          name: "BillingItem",
          component: BillingItem
        },
        {
          path: "/receipt",
          name: "receipt",
          component: Receipt
        },

        {
          path: "/report",
          name: "report",
          component: Report
        },

        {
          path: "/price-list",
          name: "price_list",
          component: PriceList
        },

        {
          path: "/user-profile",
          name: "user_profile",
          component: UserProfile
        },

        {
          path: "/about",
          name: "help",
          component: About
        }
      ]
    }
  ]
});

// route.beforeEach((to, from, next) => {
//     console.log(to)
//     if(to.matched.some(record => record.meta.requiresAuth)) {
//         if (localStorage.getItem('me') == null) {
//             console.log(to)
//             next({
//                 path: '/',
//                 params: { nextUrl: to.fullPath }
//             })
//         } else {
//             let user = JSON.parse(localStorage.getItem('me'))
//             next({ name: 'dashboard'})
//         }
//     }else {
//         next({ name: 'login'})
//     }
// })
