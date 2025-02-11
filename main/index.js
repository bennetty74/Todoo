// main/index.js
const { app, BrowserWindow ,Notification, ipcMain} = require('electron');
const path = require('path');
const { exec } = require('child_process');
exec('npm run dev:next', { cwd: path.join(__dirname, '../next-app') });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // 预加载脚本（如需通信）
    },
  });

  // 加载静态文件（静态导出模式）
  console.log(process.env.NODE_ENV)
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    // 开发环境：启动 Next.js 开发服务器并加载 URL
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // 生产环境：加载静态文件
    const staticPath = path.join(__dirname, '../next-app/out/index.html');
    mainWindow.loadFile(staticPath);
  }

  mainWindow.webContents.openDevTools()

  // 监听来自 Next.js 的任务提醒
  ipcMain.on('send-task-reminder', (event, task) => {
    console.log(event, task)
    // 任务提醒
    new Notification({
      title: 'Task Reminder',
      body: `${task.text}`,
      requireInteraction: true,
    }).show();
  });

  // 关闭窗口时释放资源
  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});