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
  handleCloseEvents(mainWindow);
});

ipcMain.handle("runPython", async (_event, arg) => {
  const user_path = app.getPath('exe').split('\\')
  let exePath;
  if (arg.report=='stock_ledger'){
      exePath = path.join(user_path[0],user_path[1],user_path[2],"Desktop", "8848 App", 'dist', 'stock_ledger_report');
  }
  else if (arg.report=='consumption'){
    exePath = path.join(user_path[0],user_path[1],user_path[2],"Desktop", "8848 App", 'dist', 'consumption_report');
  }
  else if (arg.report=='stock_summary'){
    exePath = path.join(user_path[0],user_path[1],user_path[2],"Desktop", "8848 App", 'dist', 'stock_ledger_summary_report');
  }

  else{
    exePath = path.join(user_path[0],user_path[1],user_path[2],"Desktop", "8848 App", 'dist', 'raw_material_report');
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


function handleCloseEvents(mainWindow:any) {
  let willClose = false;

  mainWindow.on("close", (e:any) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    app.quit();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  app.on("before-quit", () => {
    willClose = true;
    if (mainWindow) {
      mainWindow.destroy();
    }
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});