const { contextBridge, ipcRenderer } = require('electron');

// 将 Electron API 暴露给浏览器窗口
contextBridge.exposeInMainWorld('electron', {
  sendTaskReminder: (task) => ipcRenderer.send('send-task-reminder', task),
});
