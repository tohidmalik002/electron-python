import { app, BrowserWindow } from "electron";
import { exec, execFile, spawn } from "child_process";
import path from "path";
import {
 isDev,storeDB
} from "./util.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { ipcMain } from "electron";

app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    frame: true,
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  // pollResources(mainWindow);

  handleCloseEvents(mainWindow);
  // createMenu(mainWindow);
});

ipcMain.handle("runPython", async (_event, arg) => {
  const user_path = app.getPath('exe').split('\\')
  // console.log(user_path[0], user_path[1], user_path[2], "path")
  // const script_path = `${user_path[0]}\\${user_path[1]}\\${user_path[2]}\\Desktop\\script.py`
  let exePath;
  if (arg.report=='stock_ledger'){
      exePath = path.join(user_path[0],user_path[1],user_path[2],"Desktop", "Reports", 'dist', 'stock_ledger_emr');
  }
  else{
    exePath = path.join(user_path[0],user_path[1],user_path[2],"Desktop", "Reports", 'dist', 'consumption_emr');
  }
  return new Promise((resolve, reject) => {
    exec(`"${exePath}"`, (error: any, stdout:any, stderr:any) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(`Error: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout.trim());
    });
  });
});
ipcMain.handle("saveDBCred",async (_event, arg)=> {
  storeDB(arg);
})
function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", () => {
    willClose = true;
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}