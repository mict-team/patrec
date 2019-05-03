<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>
<style>
  .thumbnail{
    font-family: "Times New Roman";
    text-align:center !important;
  }
  .thumbnail:hover{
    background-color:#007FFF !important;
    color:#fff;
  }
  .thumbnail .icon{
    position:absolute;
    top:10px;
    right:10px;
    font-size:48px;
    line-height:1;
    color:#ccc;
  }
  
  .thumbnail .titles{
    font-size:18px !important;
    height:70px;
    text-align:center;
    font-weight:bold;
  }
  
  .thumbnail .highlight{
    margin-top:4px;
    height:4px;
    border-radius:2px;
    content:'&nbsp;';
  }
  .bg-color-gold{background-color:#f0ad4e;}
  .bg-color-green{background-color:#5cb85c;}
  .bg-color-red{background-color:#d9534f;}
  .bg-color-blue{background-color:#5bc0de;}
  .bg-color-orange{background-color:#f39c12;}
  .bg-color-pink{background-color:#e671b8;}
  .bg-color-purple{background-color:#7b4f9d;}
  .bg-color-lime{background-color:#8cbf26;}
  .bg-color-magenta{background-color:#ff0097;}
  .bg-color-teal{background-color:#00aba9;}
  .bg-color-turquoise{background-color:#2ecc71;}
  .bg-color-amethyst{	background-color:#9b59b6;	}
  .bg-color-wet-asphalt{	background-color:#34495e;}
  .bg-color-midnight-blue{background-color:#2c3e50;}
  .bg-color-sun-flower{background-color:#f1c40f;}
  .bg-color-pomegranate{background-color:#c0392b;}
  .bg-color-silver{background-color:#bdc3c7;}
  .bg-color-asbestos{background-color:#7f8c8d;}
  .panel.panel-accent-gold{border-top:3px solid #f0ad4e;}
  .panel.panel-accent-green{border-top:3px solid #5cb85c;}
  .panel.panel-accent-red{border-top:3px solid #d9534f;}
  .panel.panel-accent-blue{border-top:3px solid #5bc0de;}
  .panel.panel-accent-orange{border-top:3px solid #f39c12;}
  .panel.panel-accent-pink{border-top:3px solid #e671b8;}
  .panel.panel-accent-purple{border-top:3px solid #7b4f9d;}
  .panel.panel-accent-lime{border-top:3px solid #8cbf26;}
  .panel.panel-accent-magenta{border-top:3px solid #ff0097;}
  .panel.panel-accent-teal{border-top:3px solid #00aba9;}
  .panel.panel-accent-turquoise{border-top:3px solid #1abc9c;}
  .panel.panel-accent-emerald{border-top:3px solid #2ecc71;}
  .panel.panel-accent-amethyst{border-top:3px solid #9b59b6;}
  .panel.panel-accent-wet-asphalt{border-top:3px solid #34495e;}
  .panel.panel-accent-midnight-blue{border-top:3px solid #2c3e50;}
  .panel.panel-accent-sun-flower{border-top:3px solid #f1c40f;}
  .panel.panel-accent-pomegranate{border-top:3px solid #c0392b;}
  .panel.panel-accent-silver{border-top:3px solid #bdc3c7;}
  .panel.panel-accent-asbestos{border-top:3px solid #7f8c8d;}
  .panel>.panel-heading{background-color:#fff;border-bottom:0;font-weight:bold;}
  .panel>.panel-heading .panel-title .btn{color:#fff;border:0;}
  .panel>.panel-heading .panel-title .btn:hover{color:#000;}
  .panel small{color:#888;}
  .panel>.panel-body{padding:0;max-height:170px;overflow:auto;}
  .panel>.panel-footer{border-top:0;}
  .panel>.panel-body p{padding:10px 15px;}
  .panel>.list-group{height:270px; width:100%; overflow:auto;border-top:1px solid #ddd;border-bottom:1px solid #ddd;padding-right:15px;}
  .panel>.list-group .list-group-item{padding:4px 10px;}
  .panel>.list-group .list-group-item:last-child{border-bottom:0;}

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
      width:100% !important;
      height:100% !important;
    }

    #print{
      margin:auto;
      /*margin-left:8em !important;	*/
      width:626px;
      padding-top:20px;
      border:1px solid #EBEBEB;
      box-shadow:#999 2px;
      font-family:Myriad Pro;
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
    tr td {
      font-size: 13px;
    }
    .alert {
      display: none;
    }
    .page-break {
      display: block;
      page-break-before: always;
    }
}
  
</style>
