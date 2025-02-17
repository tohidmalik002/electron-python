const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  runPython: (kwargs: any) => ipcInvoke("runPython", kwargs),
  saveDBCred: (kwargs: any) => ipcInvoke("saveDBCred", kwargs),
});

function ipcInvoke<Key extends string>(key: Key, args?: any): Promise<any> {
  return electron.ipcRenderer.invoke(key, args);
}
