import { app, BrowserWindow } from "electron";
import { exec } from "child_process";
import path from "path";
import {
 isDev
} from "./util.js";
import { setDbCredentials, getDbCredentials } from "./db.js";
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
  let exePath = null;
  if (arg.report=='shipping_bill'){
      exePath = path.join(user_path[0],user_path[1],user_path[2], '8848 App', 'dist', 'shipping_bill_json_generator');
  }
  if(!exePath){
    return "Invalid script option"
  }
  const pyArgs: Record<string, any> = {};
  const dbCredentials = getDbCredentials();
  if(dbCredentials.status == "error"){
    return dbCredentials.message
  }
  pyArgs["formData"] = arg.formData
  pyArgs["dbCredentials"] = dbCredentials.dbCredentials
  pyArgs["jsonSavePath"] = path.join(user_path[0],user_path[1],user_path[2], '8848 App', 'shipping_bill');
  const pyArgsString = JSON.stringify(pyArgs).replace(/"/g, '\\"');


  return new Promise((resolve, reject) => {
    exec(`"${exePath}" "${pyArgsString}"`, (error: any, stdout:any, stderr:any) => {
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
  const response = setDbCredentials(arg.credentials);
  if(response.status == "success"){
    return "Db Credentials Saved Successfully"
  }
  else{
    return "An Error occured while saving the db credentials"
  }
})

ipcMain.handle("getDBCreds",async (_event, arg)=> {
  return getDbCredentials();
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