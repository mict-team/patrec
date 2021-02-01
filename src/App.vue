<template>
  <div id="app">
    <router-view></router-view>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
export default {};
</script>
<style>
@import "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900";
@import "https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css";
/*@import "./assets/css/dropdown.css";*/

#app {
  will-change: transition;
  font-family: "Hilda-Regular", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input[type="text"],
input[type="password"],
input[type="tel"] {
  text-align: left !important;
  outline: none;
  letter-spacing: 1px;
}

.input-group-addon{
  width:50px;
  text-align: center;
  background: rgb(211, 209, 209);
  vertical-align: middle;
  padding-top:1%;
}
.addon-left{
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.addon-right{
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  cursor: pointer;
}

select.form-control,
label {
  box-sizing: border-box;
  text-transform: initial;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select.form-control:not([size]):not([multiple]) {
  height: inherit;
}

small {
  font-size: 11px !important;
  text-transform: capitalize;
}

.mgl {
  margin-left: 5%;
}
.hidden-sm-and-down {
  border: 0px solid #fff !important;
}
.inner-container {
  width: 78% !important;
  position: fixed;
  top: 70px;
  padding: 0px -5px !important;
}
.scroller {
  overflow-y: scroll;
}

.back {
  background-image: url(./assets/bg.png?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260);
  background-size: cover;
}
.table tr.rowClick {
  cursor: pointer;
}
.list-group-item {
  padding-top: 10px;
  padding-bottom: 10px;
}
textarea {
  background: url(./assets/notebook.png) repeat-y;
  width: 600px;
  height: 300px;
  font: normal 14px verdana;
  line-height: 25px;
  padding: 2px 10px;
  border: solid 0px #ddd;
  padding-left: 11% !important;
}
.thumbnail {
  font-family: "Times New Roman";
  text-align: center !important;
  height: 125px !important;
  font-size: 14px;
}
.thumbnail:hover {
  background-color: #007fff !important;
  cursor: pointer;
  color: #fff;
}
.thumbnail .icon {
  position: absolute;
  top: 10px;
  right: 10px;
  line-height: 1;
  color: #ccc;
}

.thumbnail .titles {
  padding-top: 15px;
  padding-left: 3px;
  padding-right: 3px;
  height: 80px;
  text-align: center;
  font-weight: bold;
}
.thumbnail .amount {
  height: 20px;
  padding-top: 15px;
  text-align: center;
  font-weight: bold;
}

.thumbnail .highlight {
  margin-top: 4px;
  height: 4px;
  border-radius: 2px;
  content: "&nbsp;";
}
.bg-color-gold {
  background-color: #f0ad4e;
}
.bg-color-green {
  background-color: #5cb85c;
}
.bg-color-red {
  background-color: #d9534f;
}
.bg-color-blue {
  background-color: #5bc0de;
}
.bg-color-orange {
  background-color: #f39c12;
}
.bg-color-pink {
  background-color: #e671b8;
}
.bg-color-purple {
  background-color: #7b4f9d;
}
.bg-color-lime {
  background-color: #8cbf26;
}
.bg-color-magenta {
  background-color: #ff0097;
}
.bg-color-teal {
  background-color: #00aba9;
}
.bg-color-turquoise {
  background-color: #2ecc71;
}
.bg-color-amethyst {
  background-color: #9b59b6;
}
.bg-color-wet-asphalt {
  background-color: #34495e;
}
.bg-color-midnight-blue {
  background-color: #2c3e50;
}
.bg-color-sun-flower {
  background-color: #f1c40f;
}
.bg-color-pomegranate {
  background-color: #c0392b;
}
.bg-color-silver {
  background-color: #bdc3c7;
}
.bg-color-asbestos {
  background-color: #7f8c8d;
}

@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }

  .coc_form {
    /*background-image:url(../assets/bg.jpg) !important;*/
    -webkit-background-size: cover !important;
    -moz-background-size: cover !important;
    -o-background-size: cover !important;
    background-size: cover !important;
    width: 100% !important;
    height: 100% !important;
  }

  #print {
    margin: auto;
    /*margin-left:8em !important;	*/
    width: 626px;
    padding-top: 20px;
    border: 1px solid #ebebeb;
    box-shadow: #999 2px;
    font-family: Myriad Pro;
    -webkit-background-size: cover !important;
    -moz-background-size: cover !important;
    -o-background-size: cover !important;
    background-size: cover !important;
  }

  .table-advance tr:nth-child(even) {
    background: #f0f0f0 !important;
    height: 7px !important;
  }

  .table-advance tr:nth-child(odd) {
    background: #fff !important;
    height: 7px !important;
  }

  .footer {
    padding: 20px !important;
    background: #eee !important;
    text-align: center !important;
  }

  .app-code {
    padding: 7px !important;
    background: #000 !important;
    color: #fff !important;
    width: 100% !important;
  }
  table-bordered th,
  table-bordered td {
    border: 1px solid #ddd !important;
  }
  table-bordered {
    border-top: 0;
  }
  table-bordered.table-force-topborder {
    border-top: 1px solid #ddd;
  }
  table-bordered.dataTable {
    border-top: 1px solid #ddd;
  }
  table-bordered.dataTable.dataTable-noheader {
    border-top: 0;
  }
  table-bordered,
  table-bordered thead:first-child tr:first-child > th:first-child,
  table-bordered tbody:first-child tr:first-child > td:first-child,
  table-bordered tbody:first-child tr:first-child > th:first-child,
  table-bordered thead:first-child tr:first-child > th:last-child,
  table-bordered tbody:first-child tr:first-child > td:last-child,
  table-bordered tbody:first-child tr:first-child > th:last-child,
  table-bordered thead:last-child tr:last-child > th:first-child,
  table-bordered tbody:last-child tr:last-child > td:first-child,
  table-bordered tbody:last-child tr:last-child > th:first-child,
  table-bordered tfoot:last-child tr:last-child > td:first-child,
  table-bordered tfoot:last-child tr:last-child > th:first-child,
  table-bordered thead:last-child tr:last-child > th:last-child,
  table-bordered tbody:last-child tr:last-child > td:last-child,
  table-bordered tbody:last-child tr:last-child > th:last-child,
  table-bordered tfoot:last-child tr:last-child > td:last-child,
  table-bordered tfoot:last-child tr:last-child > th:last-child {
    -webkit-border-radius: 0 !important;
    -moz-border-radius: 0 !important;
    border-radius: 0 !important;
  }
  /*tr td {
      font-size: 13px;
    }*/
  .alert {
    display: none;
  }
  .page-break {
    display: block;
    page-break-before: always;
  }
}

.box {
  box-sizing: border-box;
  margin-right: 20px !important;
  margin-bottom: 5px;
  border: 1px solid #bbb;
}
/* Create two unequal columns that floats next to each other */
.column {
  float: left;
  padding: 5px;
  height: 50px; /* Should be removed. Only for demonstration */
}

.left {
  width: 50px;
  padding-top: 12px;
  background-color: #aaa;
  text-align: center !important;
}

.right {
  min-width: 100px;
  background-color: #fff;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

.divcheck {
    width: 100% !important;
    text-align: center;
    /* Made by */
  }

  .divcheck h1 {
    font-family: 'Dax', sans-serif;
    color: #fff;
  }
  .divcheck input[type="radio"] {
    display: none;
  }
  .divcheck input[type="radio"]:checked + .box {
    border: 1px solid #007e90;
    background-color: #9dcde9;
  }
  .divcheck input[type="radio"]:checked + .box span {
    transform: translateY(0px);
  }
  .divcheck input[type="radio"]:checked + .box span:before {
    transform: translateY(0px);
    opacity: 1;
  }
  .divcheck .box {
    width: 200px;
    min-height: 100px;
    max-height: 150px;
    background-color: #fff;
    transition: all 250ms ease;
    will-change: transition;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    position: relative;
    font-family: 'Dax', sans-serif;
    font-weight: normal;
    padding: 3px;
    margin-right:5px;
    border: 1px solid #eee;
  }
  .divcheck .box.small {
    width: 50px;
    height: 50px;
  }
  .divcheck .box:active {
    transform: translateY(10px);
  }
  .divcheck .box h3 {
    
  }
  .divcheck .box.small h3 {
    margin-top: 6px;
  }
  .divcheck .box span {
    position: relative;
    transform: translate(0, 0px);
    left: 0;
    right: 0;
    transition: all 300ms ease;
    font-size: 0.9em;
    user-select: none;
    color: #000;
  }
  .divcheck .box span:before {
    font-size: 1.2em;
    font-family: FontAwesome;
    display: block;
    transform: translateY(-80px);
    opacity: 0;
    transition: all 300ms ease-in-out;
    font-weight: normal;
    color: white;
  }

  .divcheck p {
    color: #fff;
    font-family: 'Dax', sans-serif;
    font-weight: 400;
  }
  .divcheck p span:after {
    content: '\f0e7';
    font-family: FontAwesome;
    color: yellow;
  }
  .topBadge{
    position: absolute;
    top:0px;
    right: 0px;
  }
</style>
