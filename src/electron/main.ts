import { app, BrowserWindow } from "electron";
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
