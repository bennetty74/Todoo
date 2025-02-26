const { contextBridge, ipcRenderer } = require('electron');

// 将 Electron API 暴露给浏览器窗口
contextBridge.exposeInMainWorld('electron', {
  sendTaskReminder: (task) => ipcRenderer.send('send-task-reminder', task),
  setTheme: (theme) => ipcRenderer.send('set-theme', theme),
  onRequestTasks: (callback) => ipcRenderer.on('request-tasks', () => callback()),
  sendTasks: (tasks) => ipcRenderer.send('send-tasks', tasks),
  onExportResult: (callback) => ipcRenderer.on('export-result', (event, result) => callback(result)),
});
