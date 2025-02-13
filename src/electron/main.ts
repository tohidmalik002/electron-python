import { app, BrowserWindow } from "electron";
import { spawn } from "child_process";
import path from "path";
import {
 isDev
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
  return new Promise((resolve, reject) => {
      console.log(app.getPath('exe'))
      const user_path = app.getPath('exe').split('\\')
      console.log(user_path[0], user_path[1], user_path[2], "path")
      let script_path;
      if (arg.report=='stock_ledger'){
         script_path = `${user_path[0]}\\${user_path[1]}\\${user_path[2]}\\Desktop\\Stock_Ledger_Client_Format.py`
      }
      else{
         script_path = `${user_path[0]}\\${user_path[1]}\\${user_path[2]}\\Desktop\\consumption.py`
      }
      
      console.log(script_path, "script path")
      const pythonProcess = spawn("python", [script_path]);
      //let output = app.getPath('exe');
      let output = ''
      pythonProcess.stdout.on("data", (data) => {
          output += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
          reject(`Error: ${data.toString()}`);
      });

      pythonProcess.on("close", () => {
          resolve(output.trim());
      });
  });
});
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