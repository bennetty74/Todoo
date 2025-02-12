import { useState } from "react";
import {
  FaRegCircle,
  FaRegCheckCircle,
  FaHourglassHalf,
  FaEllipsisV,
  FaClock,
} from "react-icons/fa";
import Modal from "./Modal";

const formatTime = (time) => {
  const date = new Date(time);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, 
  };

  return new Intl.DateTimeFormat('default', options).format(date);
};

const TodoCard = ({ task, updateStatus, onDragStart, onEdit, onDelete }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedTaskText, setEditedTaskText] = useState(task.text);

  const priorityColor = {
    low: "bg-green-500 text-white",
    medium: "bg-yellow-500 text-white",
    high: "bg-red-500 text-white",
  };

  // 右键菜单点击事件
  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowContextMenu(true);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setShowContextMenu(false);
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

  // 修改任务文本
  const handleEditTask = () => {
    onEdit(task.id, editedTaskText); // 更新任务
    setIsEditing(false);
    closeContextMenu();
  };

  // 删除任务
  const handleDeleteTask = () => {
    onDelete(task.id); // 删除任务
    closeContextMenu();
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onContextMenu={handleContextMenu} // 右键菜单
      className={`p-2 mb-2 rounded shadow-lg border border-gray-300 dark:border-gray-700 ${
        task.status === "done" ? "line-through text-gray-500" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {task.status === "todo" && <FaClock className="min-w-[15px] min-h-[15px] text-gray-500 mr-2" />}
          {task.status === "doing" && (
            <FaHourglassHalf className="min-w-[15px] min-h-[15px] text-yellow-500 mr-2" />
          )}
          {task.status === "done" && (
            <FaRegCheckCircle className="min-w-[15px] min-h-[15px] text-green-500 mr-2" />
          )}
          <span className="text-sm text-ellipsis">{task.text}</span>
        </div>
        <div className={`p-0.5 pr-1 pl-1 rounded-[2px] text-[10px] ${priorityColor[task.priority]}`}>
          {formatPrivority(task.priority)}
          {/* 显示优先级 */}
        </div>
      </div>

      <div className="mt-2 text-sm flex justify-between">
        {/* 显示标签 */}
        <div>
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="border text-[8px] text-gray-600 dark:text-gray-400 border-gray-400 p-0.5 rounded-sm mr-1"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 显示任务时间 */}
        <div className="text-[8px] text-gray-500">
          {formatTime(task.time)}
        </div>
      </div>

      {/* 右键菜单 */}
      {showContextMenu && (
        <div
          className="absolute z-10 bg-white dark:bg-gray-600 shadow-md p-2 rounded"
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
        >
          <div
            className="p-2 pl-4 pr-4 rounded cursor-pointer hover:bg-gray-500 hover:text-white"
            onClick={() => {
              onEdit(task.id);
              closeContextMenu();
            }}
          >
            Edit Task
          </div>
          <div
            className="p-2 pl-4 pr-4 rounded cursor-pointer text-red-500 hover:bg-gray-500"
            onClick={() => {
              onDelete(task.id);
              closeContextMenu();
            }}
          >
            Delete Task
          </div>
          <div
            className="p-2 pl-4 pr-4 rounded cursor-pointer hover:bg-gray-500"
            onClick={() => {
              closeContextMenu();
            }}
          >
            Cancel
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoCard;
