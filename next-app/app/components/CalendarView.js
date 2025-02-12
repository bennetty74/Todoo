import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  FaRegCheckCircle,
  FaHourglassHalf,
  FaClock,
} from "react-icons/fa";

const CalendarView = ({ tasks, selectedPriorities }) => {
  const [viewMode, setViewMode] = useState("day"); // 默认周视图
  const [currentDate, setCurrentDate] = useState(new Date()); // 当前日期

  // 根据选中的优先级筛选任务
  const filteredTasks =
    selectedPriorities.length === 0
      ? tasks // 如果没有选中任何优先级，显示所有任务
      : tasks.filter((task) => selectedPriorities.includes(task.priority));

  // 切换视图模式
  const handleViewChange = (newMode) => {
    setViewMode(newMode);
  };

  // 切换日期（前一天/后一天，前一周/后一周，前一月/后一月）
  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "prev" ? -1 : 1));
    } else if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "prev" ? -7 : 7));
    } else if (viewMode === "month") {
      newDate.setMonth(
        currentDate.getMonth() + (direction === "prev" ? -1 : 1)
      );
    }
    setCurrentDate(newDate);
  };

  // 获取一周的日期范围
  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  };

  const formatPrivority = (val) => {
    if(val === 'low'){
      return "低";
    } else if(val === 'medium'){
      return "中";
    } else {
      return '高';
    }
  };

  // 渲染日视图
  const renderDayView = () => {
    const dayTasks = filteredTasks.filter(
      (task) =>
        new Date(task.time).toDateString() === currentDate.toDateString()
    );

    const timeSlots = ["上午", "下午", "晚上"];
    return (
      <div className="grid grid-cols-3 h-full">
        {timeSlots.map((slot) => (
          <div key={slot} className="p-2">
            <h3 className="font-bold mb-2">{slot}</h3>
            {dayTasks
              .filter((task) => {
                const hour = new Date(
                  `1970-01-01T${task.time.split("T")[1]}`
                ).getHours();
                if (slot === "上午" && hour >= 6 && hour < 12) return true;
                if (slot === "下午" && hour >= 12 && hour < 18)
                  return true;
                if (slot === "晚上" && hour >= 18) return true;
                return false;
              })
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        ))}
      </div>
    );
  };

  // 渲染周视图
  const renderWeekView = () => {
    const { start, end } = getWeekRange(currentDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }

    return (
      <div className="grid grid-cols-7 h-full">
        {days.map((day) => {
          const dayTasks = filteredTasks.filter(
            (task) => new Date(task.time).toDateString() === day.toDateString()
          );
          return (
            <div key={day.toDateString()} className="p-1">
              {/* 显示星期几和日期 */}
              <h3 className="font-bold mb-2">
                {day.toLocaleDateString("default", { weekday: "short" })}{" "}
                {/* {day.getDate()} */}
              </h3>
              {dayTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  // 任务卡片组件
  const TaskCard = ({ task }) => {
    const priorityColor = {
      low: "bg-green-500 text-white",
      medium: "bg-yellow-500 text-white",
      high: "bg-red-500 text-white",
    };

    return (
      <div
        className={`p-1 mb-2 rounded border border-gray-300 dark:border-gray-700 ${
          task.status === "done" ? "line-through text-gray-500" : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {task.status === "todo" && (
              <FaClock className="min-w-[15px] min-h-[15px] text-gray-500 mr-2" />
            )}
            {task.status === "doing" && (
              <FaHourglassHalf className="min-w-[15px] min-h-[15px] text-yellow-500 mr-2" />
            )}
            {task.status === "done" && (
              <FaRegCheckCircle className="min-w-[15px] min-h-[15px] text-green-500 mr-2" />
            )}
            <span className="text-sm">{task.text}</span>
          </div>

          <div
            className={`p-1 rounded text-[10px] ${
              priorityColor[task.priority]
            }`}
          >
            {formatPrivority(task.priority)}
          </div>
        </div>
        <div className="mt-2 text-[8px]">
          {task.tags.map((tag) => (
            <span key={tag} className="border border-gray-400 p-1 rounded mr-1">
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {/* 顶部导航栏 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FaChevronLeft onClick={() => handleDateChange("prev")} />
          <span className="mx-4 text-xl font-bold">
            {viewMode === "day"
              ? currentDate.toLocaleDateString()
              : viewMode === "week"
              ? `${getWeekRange(
                  currentDate
                ).start.toLocaleDateString()} - ${getWeekRange(
                  currentDate
                ).end.toLocaleDateString()}`
              : currentDate.toLocaleDateString("default", {
                  month: "long",
                  year: "numeric",
                })}
          </span>
          <FaChevronRight onClick={() => handleDateChange("next")} />
        </div>

        {/* 视图切换按钮 */}
        <div className="flex flex-row bg-gray-100 dark:bg-gray-700 rounded p-1 pl-2 pr-2">
          <button
            onClick={() => handleViewChange("day")}
            className={`flex items-center p-1 pl-3 pr-3 dark:text-white rounded hover:border-gray-400 ${
              viewMode === "day" ? "bg-gray-500 text-white" : ""
            }`}
          >
            日视图
          </button>
          <button
            onClick={() => handleViewChange("week")}
            className={`flex items-center p-2 dark:text-white rounded ml-2 hover:border-gray-400 ${
              viewMode === "week" ? "bg-gray-500 text-white" : ""
            }`}
          >
            周视图
          </button>
        </div>
      </div>

      {/* 视图内容 */}
      <div className="h-full">
        {viewMode === "day" && renderDayView()}
        {viewMode === "week" && renderWeekView()}
      </div>
    </div>
  );
};

export default CalendarView;
