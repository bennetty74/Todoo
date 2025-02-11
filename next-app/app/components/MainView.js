"use client";
import { useState, useEffect } from "react";
import TodoList from "./TodoList";
import CalendarView from "./CalendarView";

// 从 localStorage 中读取任务数据
const getTasksFromLocalStorage = () => {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : null;
};

const formatTime = (date) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Shanghai',
    hour12: false, // 使用24小时制
  };

  const formattedTime = new Intl.DateTimeFormat('zh-CN', options).format(date);
  
  // 拆分并格式化为 'yyyy-MM-dd'T'HH:mm' 格式
  const [datePart, timePart] = formattedTime.split(' ');
  const formattedDate = datePart.split('/').join('-');
  // const formattedTimeString = timePart.replace(':', '');
  
  return `${formattedDate}T${timePart}`;
};


// 默认任务数据
const defaultTasks = [];



const MainView = ({ activeMenu, selectedPriorities }) => {
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
      console.log("exec interval", storedTasks)
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

  // 通过 useEffect 确保只在客户端获取和设置 localStorage 数据
  useEffect(() => {
    const storedTasks = getTasksFromLocalStorage();
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []); // 仅在组件挂载后执行一次

  // 当 tasks 更新时，同步到 localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="flex-1 p-4 dark:bg-gray-800">
      {activeMenu === "todo" && (
        <TodoList
          tasks={tasks}
          setTasks={setTasks}
          selectedPriorities={selectedPriorities}
        />
      )}
      {activeMenu === "calendar" && (
        <CalendarView tasks={tasks} selectedPriorities={selectedPriorities} />
      )}
    </div>
  );
};

export default MainView;
