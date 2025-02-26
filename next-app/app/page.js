"use client";
import { useState, useEffect, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import MainView from "./components/MainView";

// 从 localStorage 中读取任务数据
const getTasksFromLocalStorage = () => {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : null;
};

const formatTime = (date) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Shanghai",
    hour12: false, // 使用24小时制
  };

  const formattedTime = new Intl.DateTimeFormat("zh-CN", options).format(date);

  // 拆分并格式化为 'yyyy-MM-dd'T'HH:mm' 格式
  const [datePart, timePart] = formattedTime.split(" ");
  const formattedDate = datePart.split("/").join("-");
  // const formattedTimeString = timePart.replace(':', '');

  return `${formattedDate}T${timePart}`;
};

// 从 localStorage 中读取设置数据
const getSettingsFromLocalStorage = () => {
  const settings = localStorage.getItem("settings");
  return settings ? JSON.parse(settings) : { theme: "light" }; // 默认主题为 light
};

export default function App() {
  const [activeMenu, setActiveMenu] = useState("todo");
  const [selectedPriorities, setSelectedPriorities] = useState([]); // 选中的优先级
  const [selectedTags, setSelectedTags] = useState([]); // 选中的标签
  const [barTitle, setBarTitle] = useState("Todoo"); // 修正 useState 的使用
  const [settings, setSettings] = useState({ theme: "light" }); // 用户设置
  const [tags, setTags] = useState([]);

  // 初始化任务数据
  const [tasks, setTasks] = useState([]);

  // 发送任务提醒到 Electron 主进程
  const sendTaskReminderToElectron = (task) => {
    if (window.electron && window.electron.sendTaskReminder) {
      window.electron.sendTaskReminder(task);
    }
  };

  // 通过 useEffect 确保只在客户端获取和设置 localStorage 数据
  useEffect(() => {
    //  每分钟检查一次任务时间
    const interval = setInterval(() => {
      const storedTasks = getTasksFromLocalStorage();
      console.log("exec interval", storedTasks);
      const currentTime = formatTime(new Date());

      storedTasks.forEach((task) => {
        const taskTime = task.time;
        console.log("current time", currentTime, "task time", taskTime);
        if (taskTime === currentTime) {
          console.log("it's time");
          sendTaskReminderToElectron(task); // 如果时间相同，发送通知
        }
      });
    }, 60000); // 每分钟检查一次

    // 清理定时器
    return () => clearInterval(interval);
  }, [tasks]); // 仅在组件挂载后执行一次

  

  useEffect(() => {
    window.electron.onRequestTasks(() => {
      console.log("Sending tasks to main process:", tasks);
      if(tasks.length !== 0){
        window.electron.sendTasks(tasks);
      }
    });
  }, [tasks]);

  // 监听导出结果
  useEffect(() => {
    window.electron.onExportResult((result) => {
      window.electron.sendTaskReminder({"text" : result.message});
    });
  }, []);

  // 通过 useEffect 确保只在客户端获取和设置 localStorage 数据
  useEffect(() => {
    const storedTasks = getTasksFromLocalStorage();
    if (storedTasks) {
      setTasks(storedTasks);
      const tags = Array.from(
        new Set(storedTasks.flatMap((task) => task.tags || []))
      );
      setTags(tags);
    }
  }, []); // 仅在组件挂载后执行一次

  // 当 tasks 更新时，同步到 localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    const tags = Array.from(new Set(tasks.flatMap((task) => task.tags || [])));
    setTags(tags);
  }, [tasks]);

  useEffect(() => {
    const settings = getSettingsFromLocalStorage();
    console.log("load", settings);
    if (settings) {
      setSettings(settings);
      if (window.electron) {
        window.electron.setTheme(settings.theme);
      }
      // 设置初始主题类名
      document.documentElement.classList.toggle(
        "dark",
        settings.theme === "dark"
      );
    }
  }, []);

  // 当 settings 更新时，同步到 localStorage
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const toggleTheme = () => {
    setSettings((old) => {
      const newTheme = old.theme === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      if (window.electron) {
        window.electron.setTheme(newTheme);
      }
      return { ...old, theme: newTheme };
    });
  };

  // 处理优先级筛选
  const handlePriorityFilterChange = (priorities) => {
    setSelectedPriorities(priorities);
  };

  // 处理标签筛选
  const handleTagsChange = (selectedTags) => {
    setSelectedTags(selectedTags);
  };

  return (
    <div
      className={`${
        settings.theme === "dark"
          ? "dark:bg-gray-800 dark:text-white"
          : "bg-white text-black"
      } h-full overflow-y-hidden scroll-bar-hidden`}
    >
      {/* 自定义标题栏 */}
      <div
        id="title-bar"
        className=" h-8 px-5 text-center cursor-move"
        style={{
          WebkitAppRegion: "drag", // 使这个区域可以拖动窗口
        }}
      >
        {/* <span className='p-2'>{barTitle}</span> */}
      </div>
      <div className="flex h-full">
        <Sidebar
          activeMenu={activeMenu}
          onMenuClick={setActiveMenu}
          toggleTheme={toggleTheme}
          theme={settings.theme}
          selectedPriorities={selectedPriorities}
          onPriorityFilterChange={handlePriorityFilterChange}
          tags={tags}
          selectedTags={selectedTags}
          onTagFilterChange={handleTagsChange}
        />
        <MainView
          activeMenu={activeMenu}
          tasks={tasks}
          setTasks={setTasks}
          selectedPriorities={selectedPriorities}
          selectedTags={selectedTags}
        />
      </div>
    </div>
  );
}
