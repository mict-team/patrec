export const MENUS = [
  { id:0, 
    icon: "home", 
    title: "Dashboard", 
    url: "/home", 
    target: "in", 
    none: true 
  },

  {
    id:1,
    icon: "create_new_folder",
    "icon-alt": "create_new_folder",
    title: "Records",
    platform: 1,
    model: false,
    children: [
      { id:2, 
        icon: "home", 
        title: "Overview", 
        url: "/record/overview", 
        parent: 'Records',
        home: "Records",
        searchPath: 'record'
      },
      {
        id:3,
        icon: "add",
        title: "New Patient",
        url: "/record/new-patient",
        parent: 'Records'
      },
      {
        id: 4,
        icon: "add",
        title: "Transfered Patients",
        url: "/record/transfers",
        parent: 'Records'
      },
      {
        id:5,
        icon: "add",
        title: "Refered Patients",
        url: "/record/refers",
        parent: 'Records'
      },
      {
        id:6,
        icon: "bar_chart",
        title: "Reports",
        url: "/record/reports",
        parent:'Records'
      }
    ]
  },
  {
    id:7,
    icon: "mdi-wallet",
    "icon-alt": "mdi-wallet",
    title: "Account",
    platform: 6,
    model: false,
    children: [
      {
        id:8,
        icon: "home",
        title: "Overview",
        url: "/account/overview",
        parent:'Account',
        home: "Account",
        searchPath: 'account'
      },
      {
        id:9,
        icon: "mdi-wallet",
        title: "Tarrifs",
        url: "/account/tarrif",
        parent:'Account'
      },
      {
        id:9,
        icon: "mdi-wallet",
        title: "Active bills",
        url: "/account/patients",
        parent:'Account'
      },
    ]
  },
  {
    id:11,
    icon: "wc",
    "icon-alt": "wc",
    title: "Medical Admin",
    platform: 7,
    model: false,
    children: [
      { 
        id:12,
        icon: "home", 
        title: "Overview", 
        url: "/nurse/overview", 
        parent: 'Nurse',
        home: "Nurse",
        searchPath: 'nurse'
      },
      {
        id:13,
        icon: "home",
        title: "Schedules",
        url: "/nurse/schedules",
        parent: 'Nurse'
      },
      {
        id:14,
        icon: "add",
        title: "Appointments",
        url: "/nurse/apointment",
        parent: 'Nurse'
      },
      {
        id:14,
        icon: "bar_chart",
        title: "Report",
        url: "/nurse/report",
        parent: 'Nurse'
      }
    ]
  },
  {
    id:87,
    icon: "mdi-bed-empty",
    "icon-alt": "mdi-bed-empty",
    title: "Wards",
    parent:'Wards',
    children: [
      {
        id:88,
        icon: "mdi-bed-empty",
        title: "Overview",
        url: "/wards/overview",
        parent:'Ward manager',
        home: "Ward",
        searchPath: 'ward'
      },
      {
        id:89,
        icon: "mdi-bed-empty",
        title: "Wards",
        url: "/wards/lists",
        parent:'Ward manager'
      },
      {
        id:90,
        icon: "mdi-bed-empty",
        title: "Admission request",
        url: "/wards/admission-request",
        parent:'Ward manager'
      },
      {
        id:90,
        icon: "mdi-bed-empty",
        title: "Discharge request",
        url: "/wards/discharge-request",
        parent:'Ward manager'
      },
      {
        id:91,
        icon: "mdi-bed-empty",
        title: "On-Bed patients",
        url: "/wards/onbed-patients",
        parent:'Ward manager'
      },
      {
        id:92,
        icon: "bar_chart",
        title: "Reports",
        url: "/wards/report",
        parent:'Ward report manager'
      },
    ]
  },
  {
    id:15,
    icon: "supervisor_account",
    "icon-alt": "supervisor_account",
    title: "Doctors",
    platform: 2,
    model: false,
    children: [
      {
        id:16,
        icon: "home",
        title: "Overview",
        url: "/doctors/overview",
        home: "Doctor",
        searchPath: 'doctors'
      },
      {
        id:17,
        icon: "person_add",
        title: "Patients",
        url: "/doctors/schedules",
        parent:'Doctor'
      },
      {
        id:18,
        icon: "mdi-bed-empty",
        title: "Onbed Patients",
        url: "/doctors/patients",
        parent:'Doctor'
      },
      {
        id:19,
        icon: "mdi-calendar",
        title: "Appointments",
        url: "/doctors/appointment",
        parent:'Doctor'
      },
      { 
        id:20,
        icon: "bar_chart", 
        title: "Patient Analysis",
        parent:'Doctor' 
      }
    ]
  },
  {
    id:21,
    icon: "colorize",
    "icon-alt": "colorize",
    title: "Laboratory",
    platform: 3,
    model: false,
    children: [
      {
        id:22,
        icon: "home",
        title: "Overview",
        url: "/laboratory/overview",
        parent:'Laboratory',
        home: "Laboratory",
        searchPath: 'laboratory'
      },
      {
        id:23,
        icon: "aspect_ratio",
        title: "Requests",
        url: "/laboratory/requests",
        parent:'Laboratory'
      },
      {
        id:24,
        icon: "pregnant_woman",
        title: "Tests",
        url: "/laboratory/tests",
        parent:'Laboratory'
      },
      {
        id:25,
        icon: "bar_chart",
        title: "Report",
        url: "/laboratory/lab-report",
        parent:'Laboratory'
      }
    ]
  },
  {
    id:26,
    icon: "toggle_off",
    "icon-alt": "toggle_off",
    title: "Pharmacy",
    platform: 5,
    model: false,
    children: [
      { 
        id:27, 
        icon: "home", 
        title: "Overview", 
        url: "/pharmacy/overview",
        parent:'Pharmacy',
        home: "Pharmacy",
        searchPath: 'pharmacy'
      },
      {
        id:28,
        icon: "library_books",
        title: "Main store",
        url: "/pharmacy/main-store",
        parent:'Pharmacy' 
      },
      {
        id:29,
        icon: "add",
        title: "Add drugs",
        url: "/pharmacy/add-drugs",
        parent:'Pharmacy' 
      },
      {
        id:30,
        icon: "cloud_upload",
        title: "Upload drugs",
        url: "/pharmacy/upload-drug",
        parent:'Pharmacy' 
      },
      {
        id:31,
        icon: "border_all",
        title: "Locations",
        url: "/pharmacy/locations",
        parent:'Pharmacy' 
      },
      {
        id:32,
        icon: "add_comment",
        title: "Manage supply",
        url: "/pharmacy/supply",
        parent:'Pharmacy' 
      },
      {
        id:33,
        icon: "add_comment",
        title: "Add supplier",
        url: "/pharmacy/supplier",
        parent:'Pharmacy' 
      },
      {
        id:34,
        icon: "vertical_align_center",
        title: "Stock transfer",
        url: "/pharmacy/stock-transfer",
        parent:'Pharmacy' 
      },
      {
        id:35,
        icon: "brightness_4",
        title: "Stock requisition",
        url: "/pharmacy/requisition",
        parent:'Pharmacy' 
      },
      {
        id:36,
        icon: "bar_chart",
        title: "Report",
        url: "/pharmacy/report",
        parent:'Pharmacy' 
      }
    ]
  },
  {
    id: 93,
    icon: "airline_seat_flat",
    "icon-alt": "airline_seat_flat",
    title:"Mortuary",
    model: false,
    children:[
      { 
        id:94, 
        icon: "home", 
        title: "Overview", 
        url: "/mortuary/overview",
        parent:'Mortuary' ,
        home: "Mortuary",
        searchPath: 'mortuary'
      },
      { 
        id:95, 
        icon: "home", 
        title: "List of corps", 
        url: "/mortuary/lists",
        parent:'Mortuary' 
      },
      { 
        id:96, 
        icon: "bar_chat", 
        title: "Report", 
        url: "/mortuary/report",
        parent:'Mortuary' 
      },
    ]
  },
  { divider: "divider", none: true },
  {
    id:37,
    icon: "mdi-bus-stop-uncovered",
    title: "Transfer request",
    url: "/transfer-requests",
    none: true
  },
  {
    id:63,
    icon: "mdi-bus-stop-uncovered",
    title: "Track Patient",
    url: "/track-patient",
    none: true
  },
  { divider: "divider", none: true },
  {
    id:38,
    icon: "add_shopping_cart",
    "icon-alt": "add_shopping_cart",
    title: "Almona",
    platform: 8,
    model: false,
    children: [
      { 
        id:39, 
        icon: "home", 
        title: "Overview", 
        url: "/almona/overview",
        home: "Almona",
        parent:'Almona',
        searchPath: 'almona'
      },
      {
        id:40,
        icon: "shopping_cart",
        title: "POS",
        url: "/sales/almona",
        parent:'Almona'
      },
      {
        id:41,
        icon: "calendar_today",
        title: "Billing",
        url: "/almona/billings",
        parent:'Almona'
      },

      { 
        id:43, 
        icon: "book", 
        title: "Price book", 
        url: "/almona/pricebook", 
        parent:'Almona'
      },
      { 
        id:44, 
        icon: "healing", 
        title: "Expenses", 
        url: "/almona/expenses", 
        parent:'Almona'
      },
      {
        id:45,
        icon: "assignment",
        title: "Change book",
        url: "/almona/change",
        parent:'Almona'
      },
      { 
        id:46, 
        icon: "keyboard", 
        title: "Cash teller", 
        url: "/almona/teller", 
        parent:'Almona'
      },
      {
        id:47, 
        icon: "person",
        title: "User profile",
        url: "/user-profile",
        parent:'Almona'
      },
      { 
        id:42, 
        icon: "bar_chart", 
        title: "Reports", 
        url: "/almona/report", 
        parent:'Almona'
      },
    ]
  },

  {
    id:48,
    icon: "toggle_on",
    "icon-alt": "toggle_on",
    title: "Pharmacy POS",
    platform: 8,
    model: false,
    children: [
      { 
        id:49, 
        icon: "home", 
        title: "Overview", 
        url: "/pharmacist/overview",
        parent:'Pharmacy POS',
        home: "Pharmacist",
        searchPath: 'pharmacist'
      },
      {
        id:50,
        icon: "shopping_cart",
        title: "POS",
        url: "/sales/pharmacy",
        parent:'Pharmacy POS'
      },
      {
        id:51,
        icon: "calendar_today",
        title: "Prescribtion",
        url: "/pharmacy/billings",
        parent:'Pharmacy POS'
      },
      {
        id:57,
        icon: "book",
        title: "Stock",
        url: "/pharmacist/stock",
        checkPerm: true,
        parent:'Pharmacy POS'
      },
      {
        id:59,
        icon: "book",
        title: "Requisition",
        url: "/pharmacist/requisition",
        checkPerm: true,
        parent:'Pharmacy POS'
      },
      
      /*{ 
        id:53, 
        icon: "book", 
        title: "Price book", 
        url: "/pharmacy/price-list", 
        parent:'Pharmacy POS'
      },
      { 
        id:54, 
        icon: "healing", 
        title: "Expenses", 
        url: "/pharmacy/expenses", 
        parent:'Pharmacy POS'
      },
      {
        id:55, 
        icon: "assignment",
        title: "Change book",
        url: "/pharmacy/change",
        parent:'Pharmacy POS'
      },
      { 
        id:56, 
        icon: "keyboard", 
        title: "Cash teller", 
        url: "/pharmacy/teller", 
        parent:'Pharmacy POS'
      },*/
      { 
        id:52, 
        icon: "bar_chart", 
        title: "Reports", 
        url: "/pharmacist/report", 
        parent:'Pharmacy POS'
      },
      {
        id:60,
        icon: "person",
        title: "User profile",
        url: "/user-profile",
        parent:'Pharmacy POS'
      }
    ]
  },
  { divider: "divider", none: true },
  {
    id:61,
    icon: "bar_chart",
    "icon-alt": "bar_chart",
    title: "Patient report",
    platform: 1,
    model: false,
    children: [
      { 
        id:62, 
        icon: "home", 
        title: "Summary", 
        url: "/report/record", 
        parent:'Patient report'
      },
      {
        id:64,
        icon: "border_all",
        title: "By department",
        url: "/report/record/department",
        parent:'Patient report'
      },
      {
        id:65,
        icon: "mdi-home-plus",
        title: "By scheme",
        url: "/report/record/scheme",
        parent:'Patient report'
      }
    ]
  },
  {
    id:66,
    icon: "bar_chart",
    "icon-alt": "bar_chart",
    title: "Revenue report",
    platform: 6,
    model: false,
    children: [
      {
        id:67,
        icon: "mdi-summit",
        title: "Summary",
        url: "/report/account",
        parent:'Revenue report'
      },
      {
        id:68,
        icon: "mdi-chart-bar-stacked",
        title: "General report",
        url: "/report/account/general",
        parent:'Revenue report'
      },
      {
        id:69,
        icon: "mdi-checkbook",
        title: "Cash book",
        url: "/report/account/cashbook",
        parent:'Revenue report'
      },
      {
        id:70,
        icon: "mdi-chart-bubble",
        title: "By revenue head",
        url: "/report/account/revenue-head",
        parent:'Revenue report'
      },
      {
        id:71,
        icon: "mdi-home-city-outline",
        title: "By scheme",
        url: "/report/account/scheme",
        parent:'Revenue report'
      }
    ]
  },
  {
    id:72,
    icon: "bar_chart",
    "icon-alt": "bar_chart",
    title: "Pharmacy report",
    platform: 5,
    model: false,
    children: [
      { 
        id:73, 
        icon: "home", 
        title: "Summary", 
        url: "/report/pharmacy", 
        parent:'Pharmacy report'
      },
      {
        id:74,
        icon: "persons",
        title: "General report",
        url: "/report/pharmacy/general",
        parent:'Pharmacy report'
      },
      {
        id:75,
        icon: "persons",
        title: "By selling point",
        url: "/report/pharmacy/selling-point",
        parent:'Pharmacy report'
      },
      {
        id:76,
        icon: "border_all",
        title: "Stock report",
        url: "/report/pharmacy/stock",
        parent:'Pharmacy report'
      },
      {
        id:77,
        icon: "border_all",
        title: "Transfer report",
        url: "/report/pharmacy/transfer",
        parent:'Pharmacy report'
      },
      {
        id:78,
        icon: "border_all",
        title: "Requisition report",
        url: "/report/pharmacy/requisition",
        parent:'Pharmacy report'
      }
    ]
  },
  { divider: "divider", none: true },
  {
    id:79,
    icon: "group",
    "icon-alt": "mdi-alphabet-aurebesh",
    title: "Health Insurance Scheme",
    platform: 0,
    model: false,
    children: [
      { 
        id:80, 
        icon: "person", 
        title: "Schemes", 
        url: "/his/schemes", 
        parent:'Health Insurance Scheme'
      },
      { 
        id:81, 
        icon: "mdi-account-group", 
        title: "New Schemes", 
        url: "#", 
        parent:'Health Insurance Scheme'
      }
    ]
  },
  {
    id:82,
    icon: "group",
    "icon-alt": "settings",
    title: "User Manager",
    platform: 0,
    model: false,
    children: [
      { 
        id:83, 
        icon: "person", 
        title: "Users", 
        url: "/users/users", 
        parent:'User Manager'
      },
      { 
        id:84, 
        icon: "mdi-account-group", 
        title: "User access group", 
        url: "/users/access-group", 
        parent:'User Manager'
      }
    ]
  },

  { divider: "divider", none: true },

  {
    id:85,
    icon: "settings",
    "icon-alt": "settings",
    title: "Application manager",
    platform: 0,
    model: false,
    children: [
      
      {
        id:88,
        icon: "home",
        title: "Departments",
        url: "/application/department",
        parent:'Application manager'
      },
      {
        id:89,
        icon: "code",
        title: "Platforms",
        url: "/application/platform",
        parent:'Application manager'
      },
      {
        id:90,
        icon: "hotel",
        title: "Data Templates",
        url: "/application/data-templates",
        parent:'Application manager'
      },
      {
        id:91,
        icon: "message",
        title: "Notification",
        url: "/application/notification",
        parent:'Application manager'
      },
      {
        id:86,
        icon: "home",
        title: "General settings",
        url: "/application/overview",
        parent:'Application manager'
      },
    ]
  }
];
