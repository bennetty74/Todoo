// main/index.js
const { app, BrowserWindow ,Notification, Tray, ipcMain, nativeTheme, dialog, Menu} = require('electron');
const path = require('path');
const fs = require('fs');



let mainWindow;

let tray = null;
let taskReminders = []; // 存储任务提醒

function setupTray() {
  tray = new Tray(path.join(__dirname, '../build/icon.png')); // 需要提供一个托盘图标
  console.log(tray)
  updateTrayMenu();
}

function updateTrayMenu() {
  const contextMenu = Menu.buildFromTemplate([
    ...taskReminders.map((task, index) => ({
      label: `${task.text} (${task.time || 'No time'})`,
      click: () => {
        console.log(`Clicked on task: ${task.text}`);
        // 可选：打开任务详情窗口
      },
      submenu: [
        {
          label: '关闭提醒',
          click: () => {
            taskReminders.splice(index, 1); // 移除该任务
            updateTrayMenu(); // 更新托盘菜单
          },
        },
      ],
    })),
    { type: 'separator' },
    { label: '退出', role: 'quit' },
  ]);
  tray.setToolTip('任务提醒');
  tray.setContextMenu(contextMenu);
}

const menuTemplate = [
  {
    label: '文件',
    submenu: [
      {
        label: '导出任务',
        click: async () => {
          try {
            // 通过 IPC 请求任务数据
            mainWindow.webContents.send('request-tasks');
            const tasks = await new Promise((resolve) => {
              ipcMain.once('send-tasks', (event, data) => resolve(data));
            });
            console.log('Received tasks:', tasks);
            if (tasks && tasks.length > 0) {
              const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
                title: '导出任务',
                defaultPath: 'tasks.json',
                filters: [{ name: 'JSON Files', extensions: ['json'] }],
              });

              if (!canceled && filePath) {
                const data = JSON.stringify(tasks, null, 2);
                fs.writeFileSync(filePath, data, 'utf-8');
                mainWindow.webContents.send('export-result', { success: true, message: '任务导出成功' });
              }
            } else {
              mainWindow.webContents.send('export-result', { success: false, message: '没有任务可导出' });
            }
          } catch (error) {
            mainWindow.webContents.send('export-result', { success: false, message: `导出失败: ${error.message}` });
          }
        },
      },
      { type: 'separator' },
      { label: '退出', role: 'quit' },
    ],
  },
];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    titleBarStyle: 'hidden', // 隐藏默认的标题栏
    backgroundColor: '#fff',
    icon: path.join(__dirname, '../build/icons/png/256x256.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // 预加载脚本（如需通信）
    },
  });


  // 加载静态文件（静态导出模式）
//   console.log(process.env.NODE_ENV)
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    // 开发环境：启动 Next.js 开发服务器并加载 URL
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // 生产环境：加载静态文件
    const staticPath = path.join(__dirname, '../next-app/out/index.html');
    mainWindow.loadFile(staticPath);
  }

  // 打开调试窗口
  // mainWindow.webContents.openDevTools()

// 启用根据系统模式变化
nativeTheme.on('updated', () => {
  if (nativeTheme.shouldUseDarkColors) {
    mainWindow.setTitle('Dark Mode');
  } else {
    mainWindow.setTitle('Light Mode');
  }
});

// 默认根据系统主题设置
if (nativeTheme.shouldUseDarkColors) {
  mainWindow.setTitle('Dark Mode');
} else {
  mainWindow.setTitle('Light Mode');
}

  // 监听来自 Next.js 的任务提醒
  ipcMain.on('send-task-reminder', (event, task) => {
    console.log(event, task)
    // 添加任务到提醒列表
  taskReminders.push(task);
  updateTrayMenu();

    // 任务提醒
    const notification = new Notification({
      title: '通知',
      body: `${task.text}`,
      requireInteraction: true
    });

    notification.show();

    notification.on('close', () => {
      console.log(`Notification for task "${task.text}" was closed`);
    });
  });

  ipcMain.on('set-theme', (event, theme) => {
    const win = BrowserWindow.getFocusedWindow();
    if (theme === 'dark') {
      // win.setTitle('Dark Mode');
      nativeTheme.themeSource = 'dark';
    } else {
      // win.setTitle('Light Mode');
      nativeTheme.themeSource = 'light';
    }
  });

  // 处理导出任务的 IPC 请求
ipcMain.handle('export-tasks', async (event, tasks) => {
  try {
    // 弹出保存对话框，让用户选择保存路径
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: '导出任务',
      defaultPath: 'tasks.json',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
    });

    if (!canceled && filePath) {
      // 将任务数据写入文件
      const data = JSON.stringify(tasks, null, 2); // 美化 JSON 格式
      fs.writeFileSync(filePath, data, 'utf-8');
      return { success: true, message: '任务导出成功' };
    }
    return { success: false, message: '取消导出' };
  } catch (error) {
    return { success: false, message: `导出失败: ${error.message}` };
  }
});

  // 关闭窗口时释放资源
  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
  createWindow();
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  setupTray();
});

// 处理渲染进程返回的任务数据
ipcMain.handle('request-tasks', async () => {
  return new Promise((resolve) => {
    mainWindow.webContents.send('request-tasks');
    ipcMain.once('send-tasks', (event, tasks) => resolve(tasks));
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
