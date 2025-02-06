import { app, BrowserWindow } from "electron";
import { spawn } from "child_process";
import path from "path";
import {
  getAutoCompleteData,
  isDev,
  getFormConfig,
  getOrderDesignDetails,
  saveForm as saveFormUtil,
  getListView,
  deleteForm
} from "./util.js";
import { triggerFunction } from "./triggerHandler.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { ipcMain } from "electron";
import { performTransaction } from "./db.js";
import { saveModel } from "./models/utils.js";
import {init_models} from "./models/database.js";

app.on("ready", async () => {
  init_models();
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

  ipcMain.handle("getAutoCompleteData", async (_, query: any) => {
    return await performTransaction("readOnly", async (client) => {
      return await getAutoCompleteData(client, query);
    });
  });

  ipcMain.handle("listview", async (_,filters:any) => {
    return await performTransaction("readOnly", async (client) => {
      return await getListView(client,filters);
    });
  });

  ipcMain.handle("getFormConfig", (_, formName: any) => {
    return getFormConfig(formName);
  });

  ipcMain.handle("getOrderDesignDetails",async (_, designCode: string) => {
    return await performTransaction("readOnly", async (client) => {
      return await getOrderDesignDetails(client, designCode);
    });
  });

  ipcMain.handle("triggerFunction",async (_, kwargs: any) => {
    return await performTransaction("readOnly", async (client) => {
      return await triggerFunction(client,kwargs);
    });
   
  });

  ipcMain.handle("saveForm", async (_, kwargs: any) => {
    console.log("saveForm", kwargs);
    try {
      await saveModel(kwargs[0]);
      return "ok";
    } catch (error) {
      console.error('Error saving order and designs:', error);
      throw error;
    }
  });

  ipcMain.handle("deleteForm",async (_, kwargs: any) => {
    return await performTransaction("write", async (client) => {
      return await deleteForm(client,kwargs);
    });
  });

  handleCloseEvents(mainWindow);
  // createMenu(mainWindow);
});

ipcMain.handle("runPython", async (_event, arg) => {
  return new Promise((resolve, reject) => {
      console.log(app.getPath('exe'))
      const user_path = app.getPath('exe').split('\\')
      console.log(user_path[0], user_path[1], user_path[2], "path")
      const script_path = `${user_path[0]}\\${user_path[1]}\\${user_path[2]}\\Desktop\\script.py`
      console.log(script_path, "script path")
      const pythonProcess = spawn("python", [script_path]);
      let output = app.getPath('exe');

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
