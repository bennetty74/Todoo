"use client";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

// 格式化时间为 datetime-local 支持的格式
const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const Modal = ({ isOpen, closeModal, onSave, task }) => {
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("low");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [taskTime, setTaskTime] = useState(formatDateForInput(new Date()));

  // 同步 task 数据到状态
  useEffect(() => {
    if (task) {
      setTaskText(task.text || "");
      setPriority(task.priority || "low");
      setTags(task.tags || []);
      setTaskTime(formatDateForInput(task.time || new Date()));
    } else {
      // 如果没有 task（新增模式），重置为默认值
      clearModal();
    }
  }, [task]); // 依赖 task，当它变化时更新状态

  // 处理保存任务
  const handleSave = () => {
    if (!taskText.trim()) {
      alert("任务名称不能为空");
      return;
    }
    const newTask = {
      text: taskText.trim(),
      priority,
      tags,
      hide: false,
      time: taskTime,
    };
    onSave(newTask);
    clearModal();
    closeModal();
  };

  const clearModal = () => {
    setTaskText("");
    setTags([]);
    setTaskTime(formatDateForInput(new Date()));
    setPriority("low");
    setNewTag(""); // 清空新标签输入框
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      const trimmedTag = newTag.trim();
      if (!tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const TaskTimeInput = ({ value, onChange, className }) => (
    <input
      type="datetime-local"
      value={value}
      step="1800"
      onChange={onChange}
      className={className}
    />
  );

  return (
    <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg w-96">
        <h3 className="text-xl mb-4 text-gray-900 dark:text-white">
          {task ? "编辑任务" : "添加任务"}
        </h3>

        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="输入任务名称"
          className="bg-white dark:bg-gray-700 p-2 border border-gray-400 rounded w-full mb-4 text-gray-900 dark:text-white"
        />

        <div className="flex mb-4 gap-4">
          <TaskTimeInput
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            className="bg-white dark:bg-gray-700 p-2 border border-gray-400 rounded flex-1 text-gray-900 dark:text-white"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-white dark:bg-gray-700 p-2 border border-gray-400 rounded text-gray-900 dark:text-white"
          >
            <option value="low">低优先级</option>
            <option value="medium">中优先级</option>
            <option value="high">高优先级</option>
          </select>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="添加标签，最多4个字 (回车键添加)"
            maxLength={4}
            className="bg-white dark:bg-gray-700 p-2 border border-gray-400 rounded w-full text-gray-900 dark:text-white"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={tag}
                className="relative bg-gray-200 dark:bg-gray-600 p-1 pl-2 pr-6 rounded text-gray-900 dark:text-white"
              >
                {tag}
                <FaTimes
                  className="absolute top-1 right-1 text-red-400 cursor-pointer text-xs"
                  onClick={() => handleRemoveTag(idx)}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={closeModal}
            className="bg-white dark:bg-gray-700 p-2 border border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="bg-gray-600 dark:bg-gray-500 p-2 border border-gray-600 text-white rounded hover:bg-gray-700 dark:hover:bg-gray-400"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;