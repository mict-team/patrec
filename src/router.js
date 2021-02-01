import Vue from "vue";
import Router from "vue-router";

import auth from "./middleware/auth";
import quest from "./middleware/quest";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/landing",
      name: "landing",
      component: require("@/components/LandingPage").default,
      meta: {
        title: "Setup: Patrec",
        middleware: quest
      }
    },
    {
      path: "/",
      name: "logins",
      component: require("@/components/Login_").default,
      meta: {
        title: "Login: Patrec",
        middleware: quest
      }
    },
    {
      path: "/configure-app",
      name: "configure",
      component: require("@/components/Configure").default,
      meta: {
        title: "Configure user: Patrec",
        middleware: auth
      }
    },
    {
      path: "/user-pin",
      title: "user-pin",
      name: "userpin",
      component: require("@/components/user/Userpin").default,
      meta: {
        middleware: auth
      }
    },
    {
      path: "/app",
      title: "App",
      name: "app",
      component: require("@/components/Index").default,
      meta: {
        middleware: auth
      },
      redirect: {
        name: "home"
      },
      children: [
        {
          path: "/home",
          title: "Dashboard",
          name: "home",
          component: require("@/components/Dashboard").default,
          meta: {
            title: "Dashboard: Patrec",
            middleware: auth
          }
        },
        {
          path: "/schedule",
          title: "Schedules",
          name: "schedule",
          component: require("@/components/Schedule").default,
          meta: {
            title: "Schedules: Patrec",
            middleware: auth
          }
        },
        {
          path: "/search",
          title: "Search",
          name: "search",
          component: require("@/components/Search").default,
          meta: {
            title: "Search: Patrec",
            middleware: auth
          }
        },

        {
          path: "/doctors-note",
          title: "Doctor note",
          name: "doctors-note",
          component: require("@/components/DoctorNote").default,
          props: true,
          meta: {
            title: "Doctor note: Patrec",
            middleware: auth
          }
        },
        {
          path: "/medical-history/:id",
          title: "Medical history",
          name: "medicalhistory",
          component: require("@/components/MedicalNoteBook").default,
          props: true,
          meta: {
            title: "Patient history: Patrec",
            middleware: auth
          }
        },
        {
          path: "/view-patient-history",
          title: "Patients history",
          name: "detail-patient",
          component: require("@/components/PatientAll").default,
          meta: {
            title: "View patient history: Patrec",
            middleware: auth
          }
        },
        {
          path: "/transfer-requests",
          title: "Transfer requests",
          name: "transfer-request",
          component: require("@/components/anomalous/Requests").default,
          meta: {
            title: "Transfer: Patrec",
            middleware: auth
          }
        },
        {
          path: "/transfer-requests/:id",
          title: "Transfer request",
          name: "transfer-request-detail",
          component: require("@/components/anomalous/Details").default,
          meta: {
            title: "Transfer detail: Patrec",
            middleware: auth
          }
        },
        {
          path: "/track-patient",
          title: "Track patient",
          name: "track-patient",
          component: require("@/components/reports/record/Tracking").default,
          meta: {
            title: "Track patient: Patrec",
            middleware: auth
          }
        },
        {
          path: "/track-patient/:id",
          title: "Track patient",
          name: "track-patient",
          component: require("@/components/anomalous/Track").default,
          meta: {
            title: "Track patient: Patrec",
            middleware: auth
          }
        },

        {
          path: "/user-profile",
          title: "User profile",
          name: "user-profile",
          component: require("@/components/user/UserProfile").default,
          props: true,
          meta: {
            title: "User profile: Patrec",
            middleware: auth
          }
        },
      
        {
          path: "/account",
          title: "Account",
          name: "account-home",
          component: require("@/components/ChildView").default,
          meta: {
            title: "Account: Patrec",
            middleware: auth
          },
          redirect: {
            name: "achome"
          },
          children: [
            {
              name: "achome",
              title: "Overview",
              path: "overview",
              component: require("@/components/Dashboard").default,
              meta: {
                title: "Welcome: Patrec",
                search: "account",
                page: 'Account',
                middleware: auth
              }
            },
            {
              name: "tarrif",
              title: "Tarrifs",
              path: "tarrif",
              component: require("@/components/account/Tarrif").default,
              meta: {
                search: "account",
                title: "Tarrif: Patrec",
                middleware: auth
              }
            },
            {
              name: "salmona",
              title: "Almonas",
              path: "almona",
              component: require("@/components/user/User").default,
              meta: {
                title: "Almona: Patrec",
                middleware: auth
              }
            },
            {
              name: "account-patients",
              title: "Onbed patients",
              path: "patients",
              component: require("@/components/account/Bills").default,
              meta: {
                title: "Patients: Patrec",
                middleware: auth
              }
            },
            {
              name: "account-patient",
              title: "Patient bills",
              path: "/account/patient/:patient",
              component: require("@/components/account/Patient").default,
              meta: {
                title: "Patient bills: Patrec",
                middleware: auth
              }
            },
          ]
        },
        {
          path: "/doctors",
          title: "Doctor",
          name: "doctor",
          component: require("@/components/ChildView").default,
          meta: {
            title: "Doctor: Patrec",
            middleware: auth
          },
          redirect: {
            name: "dhome"
          },
          children: [
            {
              name: "dhome",
              title: "Overview",
              path: "overview",
              component: require("@/components/Dashboard").default,
              meta: {
                title: "Welcome: Patrec",
                page: 'Doctor',
                searchPath: 'doctor',
                middleware: auth
              }
            },
            {
              name: "dappointment",
              title: "Appointments",
              path: "appointment",
              component: require("@/components/doctors/Appointment").default,
              meta: {
                title: "Appointments: Patrec",
                middleware: auth
              }
            },
            {
              name: "dschedule",
              title: "Patients",
              path: "schedules",
              component: require("@/components/doctors/Schedule").default,
              meta: {
                title: "Schedules: Patrec",
                middleware: auth
              }
            },
            {
              name: "doctor-patients",
              title: "Onbed patients",
              path: "patients",
              component: require("@/components/doctors/Patients").default,
              meta: {
                title: "Patients: Patrec",
                middleware: auth
              }
            },
            {
              name: "doc-patient",
              title: "Patient",
              path: "patient/:id",
              component: require("@/components/Patient").default,
              meta: {
                title: "Appointments: Patrec",
                middleware: auth
              },
            },
          ]
        },
        {
          path: "/nurse",
          title: "Nurses station",
          name: "nurse",
          component: require("@/components/ChildView").default,
          meta: {
            title:"Medical admin",
            middleware: auth
          },
          redirect: {
            name: "nhome"
          },
          children: [
            {
              name: "nhome",
              title: "Overview",
              path: "overview",
              component: require("@/components/Dashboard").default,
              meta: {
                title: "Welcome: Patrec",
                search: "nurse",
                page: 'Nurse',
                middleware: auth
              }
            },
            {
              name: "nschedules",
              title: "In patients",
              path: "schedules",
              component: require("@/components/nurse/Schedule").default,
              meta: {
                title: "Schedules: Patrec",
                middleware: auth
              }
            },
            {
              name: "preschedule",
              title: "Pre scheduled patients",
              path: "preschedule",
              component: require("@/components/nurse/PreSchedule").default,
              meta: {
                title: "Vita signs: Patrec",
                middleware: auth
              }
            },
            {
              name: "mappointment",
              title: "Appointments",
              path: "appointment",
              component: require("@/components/patient/Appointment").default,
              meta: {
                title: "Vita signs: Patrec",
                middleware: auth
              }
            },
            {
              name: "mreport",
              title: "Report",
              path: "report",
              component: require("@/components/nurse/Report").default,
              meta: {
                title: "Vita signs: Patrec",
                middleware: auth
              }
            }
          ]
        },

        {
          path: "/patient/:id",
          title: "Patient",
          component: require("@/components/Patient").default,
          meta: {
            middleware: auth
          },
          redirect: {
            name: "phome"
          },
          children: [
            {
              name: "phome",
              title: "Overview",
              path: "overview",
              component: require("@/components/patient/Home").default,
              props: true,
              meta: {
                title: "Patient: Patrec",
                search: "patient",
                middleware: auth
              }
            },

            {
              name: "phistory",
              title: "History",
              path: "history",
              component: require("@/components/patient/History").default,
              props: true,
              meta: {
                title: "History: Patrec",
                middleware: auth
              }
            },
            {
              name: "pappointment",
              title: "Appointment",
              path: "appointments",
              component: require("@/components/patient/Appointment").default,
              props: true,
              meta: {
                title: "Appointments: Patrec",
                middleware: auth
              }
            },
            {
              name: "bookpappointment",
              title: "Book Appointment",
              path: "book-appointment",
              component: require("@/components/patient/BookAppointment").default,
              meta: {
                title: "Appointments: Patrec",
                middleware: auth
              }
            },
            {
              name: "pdiagnosis",
              title: "Diagnosis",
              path: "diagnosis",
              component: require("@/components/patient/Diagnosis").default,
              meta: {
                title: "Disgnosis: Patrec",
                middleware: auth
              }
            },
            {
              name: "padmission",
              title: "Admission",
              path: "admission",
              component: require("@/components/patient/Admission").default,
              meta: {
                title: "Admission: Patrec",
                middleware: auth
              }
            },
            {
              name: "pprescription",
              title: "Drug prescription",
              path: "prescription",
              component: require("@/components/patient/Prescription").default,
              meta: {
                title: "Prescription: Patrec",
                middleware: auth
              }
            },

            {
              path: "pdiagonise",
              title: "Request",
              name: "diagonise",
              component: require("@/components/patient/NewDiagnosis").default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "payment-bill",
              title: "Payment bill",
              name: "paybill",
              component: require("@/components/patient/Bills").default,
              meta: {
                middleware: auth
              }
            }
          ]
        },
        {
          path: "/pharmacy",
          component: require("@/components/ChildView").default,
          meta: {
            title: "Pharmacy: Patrec",
            middleware: auth
          },
          redirect: {
            name: "pharm-home"
          },
          children: [
            {
              name: "pharm-home",
              path: "overview",
              component: require("@/components/Dashboard").default,
              meta: {
                title: "Welcome: Patrec",
                page: 'Pharmacy',
                search: "pharmacy",
                middleware: auth
              }
            },
            {
              name: "main-store",
              path: "main-store",
              component: require("@/components/pharmacy/Mainstore").default,
              meta: {
                title: "Main store: Patrec",
                middleware: auth
              }
            },
            {
              name: "add-drugs",
              path: "add-drugs",
              component: require("@/components/pharmacy/AddItem").default,
              meta: {
                title: "Add item: Patrec",
                middleware: auth
              }
            },
            {
              name: "edit-drugs",
              path: "edit-drugs/:id",
              component: require("@/components/pharmacy/EditItem").default,
              meta: {
                title: "Edit item: Patrec",
                middleware: auth
              }
            },
            {
              name: "upload-drugs",
              path: "upload-drug",
              component: require("@/components/pharmacy/UploadCSV").default,
              meta: {
                title: "Upload items: Patrec",
                middleware: auth
              }
            },
            {
              name: "locations",
              path: "locations",
              component: require("@/components/pharmacy/Locations").default,
              meta: {
                title: "Sales location: Patrec",
                middleware: auth
              }
            },
            {
              name: "locations-details",
              path: "locations/detail/:id",
              component: require("@/components/pharmacy/LocationsView").default,
              meta: {
                title: "Sales location: Patrec",
                middleware: auth
              }
            },
            {
              name: "supply",
              path: "supply",
              component: require("@/components/pharmacy/Supply").default,
              meta: {
                title: "Supply: Patrec",
                middleware: auth
              }
            },
            {
              name: "stock-transfer",
              path: "stock-transfer",
              component: require("@/components/pharmacy/Transfer").default,
              meta: {
                title: "Stock transfer: Patrec",
                middleware: auth
              }
            },
            {
              name: "requisition",
              path: "requisition",
              component: require("@/components/pharmacy/Requisition").default,
              meta: {
                title: "Requisition: Patrec",
                middleware: auth
              }
            },
            {
              name: "supplier",
              path: "supplier",
              component: require("@/components/pharmacy/Supplier").default,
              meta: {
                title: "Suppliers: Patrec",
                middleware: auth
              }
            },
            {
              name: "pharmacy-patient",
              path: "patient",
              component: require("@/components/pharmacy/Patient").default,
              meta: {
                title: "Patients: Patrec",
                middleware: auth
              }
            }
          ]
        },
        
        {
          path: "/record",
          title: "Record",
          component: require("@/components/ChildView").default,
          meta: {
            middleware: auth
          },
          redirect: {
            name: "rhome"
          },
          children: [
            {
              name: "rhome",
              title: "Overview",
              path: "overview",
              component: require("@/components/Dashboard").default,
              meta: {
                title: "Welcome: Patrec",
                search: "record",
                page: 'Records',
                middleware: auth
              }
            },
            {
              name: "new-patient",
              title: "New patient",
              path: "new-patient",
              component: require("@/components/records/NewPatient").default,
              meta: {
                title: "Patient registration: Patrec",
                middleware: auth
              }
            },
            {
              name: "record-patient",
              title: "Patient schedule",
              path: "/record/patient/:patient",
              component: require("@/components/records/Patient").default,
              meta: {
                title: "View Patient: Patrec",
                middleware: auth
              }
            },
            {
              name: "transfer-patient",
              title: "Transfer patient",
              path: "transfer-patient",
              component: require("@/components/records/TransferReq").default,
              meta: {
                title: "Transfer Patient: Patrec",
                middleware: auth
              }
            },
            {
              name: "transfered-patient",
              title: "Transfered patient",
              path: "transfers",
              component: require("@/components/records/Transfered").default,
              meta: {
                title: "Transfered Patient: Patrec",
                middleware: auth
              }
            },
            {
              name: "refered-patient",
              title: "Refered patient",
              path: "refers",
              component: require("@/components/records/Refers").default,
              meta: {
                title: "Transfered Patient: Patrec",
                middleware: auth
              }
            },
            {
              name: "rreports",
              title: "Report",
              path: "reports",
              component: require("@/components/records/Report").default,
              meta: {
                title: "Reports: Patrec",
                middleware: auth
              }
            }
          ]
        },

        {
          path: "/laboratory",
          component: require("@/components/ChildView").default,
          meta: {
            middleware: auth
          },
          redirect: {
            name: "lab-home"
          },
          children: [
            {
              name: "lab-home",
              path: "overview",
              component: require("@/components/Dashboard").default,
              meta: {
                title: "Patrec: Laboratory",
                page: 'Laboratory',
                search: "laboratory",
                middleware: auth
              }
            },
            {
              name: "tests",
              path: "tests",
              component: require("@/components/laboratory/Diagonise").default,
              meta: {
                title: "Patrec: Diagnosis",
                middleware: auth
              }
            },
            {
              name: "laboratory-patient",
              path: "patient",
              component: require("@/components/laboratory/Patient").default,
              meta: {
                middleware: auth
              }
            },
            {
              name: "lab-requests",
              path: "requests",
              component: require("@/components/laboratory/Request").default,
              meta: {
                middleware: auth
              }
            },
            {
              name: "lab-requests-result",
              path: "result",
              component: require("@/components/laboratory/Result").default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "diagnosis-report",
              title: "Diagnosis report",
              name: "diagnosis-report",
              component: require("@/components/laboratory/DiagnosisReport").default,
              meta: {
                title: "Diagnosis report: Patrec",
                middleware: auth
              }
            },
            {
              name: "glab-report",
              title: "Diagnosis report",
              path: "lab-report",
              component: require("@/components/laboratory/Report").default,
              meta: {
                title: "Laboratory report: Patrec",
                middleware: auth
              }
            },
            {
              name: "lab-patient",
              title: "Patient schedule",
              path: "patient/:patient",
              component: require("@/components/laboratory/Patient").default,
              meta: {
                title: "View Patient: Patrec",
                middleware: auth
              }
            },
          ]
        },
        {
          path: "/users",
          component: require("@/components/ChildView").default,
          meta: {
            title: "User manager: Patrec",
            middleware: auth
          },
          redirect: {
            name: "user-home"
          },
          children: [
            {
              name: "auser",
              path: "users",
              component: require("@/components/user/User").default,
              meta: {
                title: "Users: Patrec",
                middleware: auth
              }
            },
            {
              name: "newuser",
              path: "new-users",
              component: require("@/components/user/NewUser").default,
              meta: {
                title: "New Users: Patrec",
                middleware: auth
              }
            },
            {
              name: "accessgroup",
              path: "access-group",
              component: require("@/components/user/AccessGroup").default,
              meta: {
                title: "User access group: Patrec",
                middleware: auth
              }
            },
            {
              name: "auser",
              path: "users/:dept",
              component: require("@/components/user/User").default,
              meta: {
                title: "Users: Patrec",
                middleware: auth
              }
            },
            {
              name: "newuser",
              path: "new-users/:dept",
              component: require("@/components/user/NewUser").default,
              meta: {
                title: "New Users: Patrec",
                middleware: auth
              }
            },
            {
              name: "accessgroup",
              path: "access-group/:dept",
              component: require("@/components/user/AccessGroup").default,
              meta: {
                title: "User access group: Patrec",
                middleware: auth
              }
            },
            {
              name: "accessroles",
              path: "access-roles/:id",
              component: require("@/components/user/AccessRoles").default,
              meta: {
                title: "User access roles: Patrec",
                middleware: auth
              }
            }
          ]
        },
        {
          path: "/his",
          component: require("@/components/ChildView").default,
          meta: {
            title: "Health Insurance Scheme: Patrec",
            middleware: auth
          },
          redirect: {
            name: "scheme-home"
          },
          children: [
            {
              name: "scheme-home",
              path: "schemes",
              component: require("@/components/hmos/Scheme").default,
              meta: {
                title: "Health Insurance Scheme: Patrec",
                middleware: auth
              }
            },
            {
              name: "newscheme",
              path: "new-scheme",
              component: require("@/components/hmos/NewScheme").default,
              meta: {
                title: "New Scheme: Patrec",
                middleware: auth
              }
            },
            {
              name: "scheme-hmos",
              path: "scheme-hmos/:scheme",
              component: require("@/components/hmos/SchemeHmos").default,
              meta: {
                title: "HMOS: Patrec",
                middleware: auth
              }
            },
            {
              name: "scheme-supported-drugs",
              path: "scheme-hmos/:scheme/drugs",
              component: require("@/components/hmos/SupportedDrugs").default,
              meta: {
                title: "HMOS: Patrec",
                middleware: auth
              }
            },
            {
              name: "scheme-supported-tarrifs",
              path: "scheme-hmos/:scheme/tarrifs",
              component: require("@/components/hmos/SupportedTarrif").default,
              meta: {
                title: "HMOS: Patrec",
                middleware: auth
              }
            }
          ]
        },
        {
          path: "/application",
          component: require("@/components/ChildView").default,
          meta: {
            title: "Application settings: Patrec",
            middleware: auth
          },
          redirect: {
            name: "ahome"
          },
          children: [
            {
              name: "ahome",
              path: "overview",
              component: require("@/components/application/General").default,
              meta: {
                title: "Settings: Patrec",
                middleware: auth
              }
            },
            
            {
              name: "sdept",
              path: "department",
              component: require("@/components/application/Department").default,
              meta: {
                title: "Departments: Patrec",
                middleware: auth
              }
            },
            {
              name: "data-templates",
              path: "data-templates",
              component: require("@/components/application/FormTemplate").default,
              meta: {
                title: "Form generator: Patrec",
                middleware: auth
              }
            },

            {
              name: "aplatform",
              path: "platform",
              component: require("@/components/application/Platform").default,
              meta: {
                title: "Module manager: Patrec",
                middleware: auth
              }
            },
            {
              name: "anotification",
              path: "notification",
              component: require("@/components/application/Notification")
                .default,
              meta: {
                title: "Notification manager: Patrec",
                middleware: auth
              }
            }
          ]
        },
        
        {
          path: "/wards",
          component: require("@/components/ChildView").default,
          meta:{
            title: 'Wards',
            middleware: auth
          },
          redirect: {
            name: 'ward-home'
          },
          children:[
            {
              name: "ward-home",
              path: "overview",
              component: require("@/components/Dashboard").default,
              meta: {
                title: "Wards: Patrec",
                page: 'Ward',
                search: "ward",
                middleware: auth,
              }
            },
            {
              name: "ward-man",
              path: "lists",
              component: require("@/components/wards/Wards").default,
              meta: {
                title: "Wards: Patrec",
                middleware: auth
              }
            },
            {
              name: "ward-patient",
              path: "wards/:id",
              component: require("@/components/wards/Patients").default,
              meta: {
                title: "Wards: Patrec",
                middleware: auth
              }
            },
            {
              name: "ward-request",
              path: "admission-request",
              component: require("@/components/wards/Request").default,
              meta: {
                title: "Admission request: Patrec",
                middleware: auth
              }
            },
            {
              name: "discharge-request",
              path: "discharge-request",
              component: require("@/components/wards/Discharge").default,
              meta: {
                title: "Discharge request: Patrec",
                middleware: auth
              }
            },
            {
              name: "discharge",
              path: "discharge/:id",
              component: require("@/components/wards/DischargeForm").default,
              meta: {
                title: "Discharge detail: Patrec",
                middleware: auth
              }
            },
            {
              name: "ward-onbed-patients",
              path: "onbed-patients",
              component: require("@/components/wards/OnBedPatient").default,
              meta: {
                title: "Onbed Patients: Patrec",
                middleware: auth
              }
            },
            {
              name: "ward-report",
              path: "report",
              component: require("@/components/wards/Report").default,
              meta: {
                title: "Report: Patrec",
                middleware: auth
              }
            },
          ]
        },

        {
          path: "/mortuary",
          component: require("@/components/ChildView").default,
          meta:{
            title: 'Mortuary',
            middleware: auth
          },
          redirect: {
            name: 'mortuary-home'
          },
          children:[
            {
              name: "mortuary-home",
              path: "overview",
              component: require("@/components/Dashboard").default,
              meta: {
                title: "Mortuary: Patrec",
                page: 'Mortuary',
                search: "mortuary",
                middleware: auth,
              }
            },
            {
              name: "mortuary-reg",
              path: "register",
              component: require("@/components/mortuary/Register").default,
              meta: {
                title: "Mortuary: Patrec",
                middleware: auth
              }
            },
            {
              name: "mortuary-man",
              path: "lists",
              component: require("@/components/mortuary/List").default,
              meta: {
                title: "Mortuary: Patrec",
                middleware: auth
              }
            },
            {
              name: "mortuary-report",
              path: "report",
              component: require("@/components/mortuary/Report").default,
              meta: {
                title: "Report: Patrec",
                middleware: auth
              }
            },
          ]
        },

        {
          path: "/almona",
          name: "almona",
          component: require("@/components/ChildView").default,
          meta: {
            middleware: auth
          },
          redirect: {
            name: "sales-home"
          },
          children: [
            {
              path: "/almona/overview",
              name: "sales-home",
              component: require("@/components/Dashboard").default,
              meta: {
                page: 'Almona',
                search: "almona",
                middleware: auth
              }
            },
            {
              path: "/almona/billings",
              name: "almona-patient",
              component: require("@/components/sales/amona/Bills").default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/almona/teller",
              name: "bsales-cashteller",
              component: require("@/components/sales/amona/Cashteller").default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/almona/change",
              name: "bsales-change",
              component: require("@/components/sales/amona/Change").default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/almona/expenses",
              name: "bsales-expenses",
              component: require("@/components/sales/amona/Expenses").default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/almona/pricebook",
              name: "bsales-pricebook",
              component: require("@/components/sales/amona/PriceList").default,
              meta: {
                middleware: auth
              }
            },
            {
              name: "almona-patient",
              title: "Patient bills",
              path: "/almona/patient/:patient",
              component: require("@/components/sales/amona/Billings").default,
              meta: {
                title: "Patient bills: Patrec",
                middleware: auth
              }
            },
            {
              name: "almona-register",
              title: "Register details",
              path: "/almona/register-details",
              component: require("@/components/sales/amona/RegisterBook").default,
              meta: {
                title: "Patient bills: Patrec",
                middleware: auth
              }
            },
          ]
        },
        {
          path: "/pharmacist",
          name: "pharmacist",
          component: require("@/components/ChildView").default,
          meta: {
            middleware: auth
          },
          redirect: {
            name: "pharm-home"
          },
          children: [
            {
              path: "/pharmacist/overview",
              name: "pharm-home",
              component: require("@/components/Dashboard").default,
              meta: {
                page: 'Pharmacist',
                search: "pharmacist",
                middleware: auth
              }
            },
            {
              path: "/pharmacy/billings",
              name: "pharmacy-bills-patient",
              component: require("@/components/sales/pharm/Bills").default,
              meta: {
                middleware: auth
              }
            },
            {
              name: "pharmacy-billing-patient",
              title: "Patient bills",
              path: "/pharmacy/billings/:medical/:patient",
              component: require("@/components/sales/pharm/Billings").default,
              props: true,
              meta: {
                title: "Patient bills: Patrec",
                middleware: auth
              }
            },
            {
              path: "/pharmacist/requisition",
              name: "pharmacy-sales-requisition",
              component: require("@/components/sales/pharm/Requisition").default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/pharmacist/stock",
              name: "pharmacy-sales-stock",
              component: require("@/components/sales/pharm/Stock").default,
              meta: {
                middleware: auth
              }
            },
            {
              name: "pharmacist-patient",
              title: "Patient bills",
              path: "/pharmacist/patient/:patient",
              component: require("@/components/sales/pharm/Billings").default,
              meta: {
                title: "Patient bills: Patrec",
                middleware: auth
              }
            },
            {
              name: "pharmacist-report",
              title: "Pharmacist report",
              path: "/pharmacist/report",
              component: require("@/components/reports/pharmacy/Sales").default,
              meta: {
                title: "Patient bills: Patrec",
                middleware: auth
              }
            },
          ]
        },
        
        {
          path: "/report/record",
          name: "report-record",
          component: require("@/components/ChildView").default,
          meta: {
            middleware: auth
          },
          redirect: {
            name: "report-record-overview"
          },
          children: [
            {
              path: "/report/record",
              name: "report-record-overview",
              component: require("@/components/reports/record/Overview").default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/report/record/patients",
              name: "report-record-patient",
              component: require("@/components/reports/record/Patients")
                .default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/report/record/department",
              name: "report-record-dept",
              component: require("@/components/reports/record/Department")
                .default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/report/record/scheme",
              name: "report-record-scheme",
              component: require("@/components/reports/record/Scheme")
                .default,
              meta: {
                middleware: auth
              }
            }
          ]
        },
        {
          path: "/report/account",
          name: "report-account",
          component: require("@/components/ChildView").default,
          meta: {
            middleware: auth
          },
          redirect: {
            name: "report-account-overview"
          },
          children: [
            {
              path: "/report/account",
              name: "report-account-overview",
              component: require("@/components/reports/account/Overview")
                .default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/report/account/general",
              name: "report-account-general",
              component: require("@/components/reports/account/General")
                .default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/report/account/cashbook",
              name: "report-account-cashbook",
              component: require("@/components/reports/account/Cashbook")
                .default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/report/account/revenue-head",
              name: "report-account-revenue-head",
              component: require("@/components/reports/account/Revenue")
                .default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/report/account/scheme",
              name: "report-account-scheme",
              component: require("@/components/reports/account/Scheme")
                .default,
              meta: {
                middleware: auth
              }
            }
          ]
        },
        {
          path: "/report/pharmacy",
          name: "report-pharmacy",
          component: require("@/components/reports/pharmacy/Index").default,
          meta: {
            middleware: auth
          },
          redirect: {
            name: "report-pharmacy-overview"
          },
          children: [
            {
              path: "/report/pharmacy",
              name: "report-pharmacy-overview",
              component: require("@/components/reports/pharmacy/Overview")
                .default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/report/pharmacy/General",
              name: "report-pharmacy-general",
              component: require("@/components/reports/pharmacy/General")
                .default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/report/pharmacy/selling-point",
              name: "report-pharmacy-selling-point",
              component: require("@/components/reports/pharmacy/Sellingpoint")
                .default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/report/pharmacy/stock",
              name: "report-pharmacy-stock",
              component: require("@/components/reports/pharmacy/Stock")
                .default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/report/pharmacy/transfer",
              name: "report-pharmacy-transfer",
              component: require("@/components/pharmacy/Transfer")
                .default,
              meta: {
                middleware: auth
              }
            },
            {
              path: "/report/pharmacy/requisition",
              name: "report-pharmacy-requisition",
              component: require("@/components/pharmacy/Requisition")
                .default,
              meta: {
                middleware: auth
              }
            }
          ]
        }
      ]
    },
    {
      path: "/sales/:type",
      title: "Sales",
      name: "sales",
      component: require("@/components/SalesPos").default,
      meta: {
        middleware: auth
      },
      redirect: {
        name: "sales-register"
      },
      children: [
        {
          path: "registers",
          name: "sales-register",
          component: require("@/components/sales/Register").default,
          meta: {
            middleware: auth
          }
        },
        
        {
          path: "pos",
          name: "amona-pos",
          component: require("@/components/sales/amona/pos").default,
          meta: {
            middleware: auth
          }
        },
        {
          path: "almona/receipt/:id",
          name: "amona-receipt",
          component: require("@/components/sales/amona/Receipt").default,
          meta: {
            middleware: auth
          }
        },
        {
          path: "pharm/pos",
          name: "pharm-pos",
          component: require("@/components/sales/pharm/Pos").default,
          meta: {
            middleware: auth
          }
        },
        {
          path: "pharm/receipt/:id",
          name: "pharm-receipt",
          component: require("@/components/sales/pharm/Receipt").default,
          meta: {
            middleware: auth
          }
        }
      ]
    }
  ]
});

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title);
  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(
    document.querySelectorAll("[data-vue-router-controlled]")
  ).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if (nearestWithMeta) {
    // Turn the meta tag definitions into actual elements in the head.
    nearestWithMeta.meta.metaTags
      .map(tagDef => {
        const tag = document.createElement("meta");

        Object.keys(tagDef).forEach(key => {
          tag.setAttribute(key, tagDef[key]);
        });

        // We use this to track which meta tags we create, so we don't interfere with other ones.
        tag.setAttribute("data-vue-router-controlled", "");

        return tag;
      })
      // Add the meta tags to the document head.
      .forEach(tag => document.head.appendChild(tag));
  }

  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

export default router;
