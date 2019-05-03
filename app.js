"use strict";

const electron = require("electron");
const app = electron.app;
const globalShortcut = electron.globalShortcut;
const os = require("os");
const path = require("path");
const config = require(path.join(__dirname, "package.json"));
const BrowserWindow = electron.BrowserWindow;
const fs=require('fs')
const ipcMain = electron.ipcMain;
const shell=electron.shell;
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
var mainWindow = null;
var workerWindow = null;
let url = null;
if (process.env.NODE_ENV === "DEV") {
  url = "http://localhost:8080/";
} else {
  url = `file://${__dirname}/dist/index.html`;
}
//`file://${process.cwd()}/dist/index.html`;
app.setName(config.productName);

app.on("ready", () => {
  
  const screen = require("electron").screen;
  const display = screen.getPrimaryDisplay();
  const area = display.workArea;

  mainWindow = new BrowserWindow({
    backgroundColor: "white",
    title: "Revenue Collection",
    show: false,
    webPreferences: {
      nodeIntegration: true,
      defaultEncoding: "UTF-8"
    },
    width: area.width,
    nativeWindowOpen: true,
    height: area.height,
    icon: __dirname + "/logo.ico",
    titleBarStyle: "hiddenInset",
    autoHideMenuBar: true,
    webPreferences: {webSecurity: false}
  });
  //console.log("URL:" + url)
  mainWindow.loadURL(url);
  //mainWindow.setIcon(__dirname + 'logo.ico')
  mainWindow.moveTop(), mainWindow.setTitle(config.productName);
  if (process.env.NODE_ENV !== "production") {
    //require("vue-devtools").install();
  }
  mainWindow.webContents.session.clearCache(function(){
    //some callback.
    console.log('ccahe cleared')
  });
  
  // Enable keyboard shortcuts for Developer Tools on various platforms.
  let platform = os.platform();
  if (platform === "darwin") {
    globalShortcut.register("Command+Option+I", () => {
      mainWindow.webContents.openDevTools();
    });
    globalShortcut.register('CommandOrControl+R', () => false);
    globalShortcut.register('F5', () => false);
  } else if (platform === "linux" || platform === "win32") {
    globalShortcut.register("Control+Shift+I", () => {
      //mainWindow.webContents.openDevTools();
    });
    globalShortcut.register('CommandOrControl+R', () => false);
    globalShortcut.register('F5', () => false);
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.setMenu(null);
    mainWindow.show();
  });

  mainWindow.onbeforeunload = e => {
    e.returnValue = true;
  };

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
  
  workerWindow=new BrowserWindow({
    width: 420,
    height: 580,
  });
  workerWindow.loadURL(url + "#/receipt");
  workerWindow.hide();
  workerWindow.on("closed", function(){
      workerWindow = undefined;
  });
  
});
app.on('before-quit', function() {
    globalShortcut.unregisterAll();
});
app.on('window-all-closed', () => {
  app.quit();
});
ipcMain.on('print', (event, content) => {
  //console.log(content)
  //workerWindow.webContents.send('print', content);
  workerWindow.loadURL(url + "#/receipt")
  workerWindow.show();
});

ipcMain.on('readyToPrint', (event) => {
    mainWindow.webContents.print({
      options: {
        scale:100,
        copies: '2',
        finishings: '3',
        'job-hold-until': 'no-hold',
        'job-priority': '0',
        'job-sheets': 'none,none',
      }
    });
});

ipcMain.on('print-to-pdf', (event) => {
  var pdfPath=path.join(os.tmpdir(), 'receipt.pdf');
  var win=BrowserWindow.fromWebContents(event.sender);
  win.webContents.printToPDF({marginsType: 0,
    printBackground: true,
    printSelectionOnly: false,}, (err, data)=>{
    if(err) console.log(err.message);

    fs.writeFile(pdfPath, data, err=>{
      if(err) console.log(err.message);

      shell.openExternal('file://' + pdfPath);
      event.sender.send('wrote-pdf', pdfPath);
    })
  })
  
});
