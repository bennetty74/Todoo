'use client'
import { useState , useEffect} from 'react';
import { FaTimes } from 'react-icons/fa'; // 引入删除图标

const Modal = ({ isOpen, closeModal, onSave, task }) => {
  const [taskText, setTaskText] = useState(task ? task.text : '');
  const [priority, setPriority] = useState(task ? task.priority : 'low');
  const [tags, setTags] = useState(task ? task.tags : []);
  const [newTag, setNewTag] = useState('');
  const [taskTime, setTaskTime] = useState(task ? task.time : new Date().toISOString());
  

// 在任务传入时，更新 state 以实现编辑功能
useEffect(() => {
    if (task) {
      setTaskText(task.text);
      setPriority(task.priority);
      setTags(task.tags);
      setTaskTime(task.time);
    }
  }, [task]); // 当 task 变化时，更新输入框的状态


  // 处理保存任务
  const handleSave = () => {
    const newTask = {
      text: taskText,
      priority,
      tags,
      time: taskTime, // 使用选择的时间
    };
    onSave(newTask);
    
    clearModal()
    closeModal();
  };

  // 清空输入框
  const clearModal = () => {
    setTaskText('')
    setTags([])
    setTaskTime(new Date().toISOString())
  }

  // 处理添加 Tag
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // 删除 Tag
  const handleRemoveTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };


  if (!isOpen) return null;

  const TaskTimeInput = ({ taskTime, setTaskTime }) => {
    return (
      <input
        type="datetime-local"
        value={taskTime}  // 使用本地时区时间
        onChange={e=>setTaskTime(e.target.value)}
        className="bg-white dark:bg-gray-700 p-2 border border-gray-400 rounded flex-1"
      />
    );
  };

  return (
    <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white dark:bg-gray-700 p-4 rounded shadow-lg w-96">
        <h3 className="text-xl mb-4">{task ? 'Edit Task' : 'Add Task'}</h3>

        {/* 任务名称输入框 */}
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter task name"
          className="bg-white dark:bg-gray-700 p-2 border border-gray-400 rounded w-full mb-4"
        />

        {/* 任务时间和优先级在同一行 */}
        <div className="flex mb-4 gap-4">
          {/* 任务时间选择 */}
          <TaskTimeInput
            taskTime={taskTime} setTaskTime={setTaskTime}
          />

          {/* 优先级选择 */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-white dark:bg-gray-700 p-2 border border-gray-400 rounded"
          >
            <option value="low">低优先级</option>
            <option value="medium">中优先级</option>
            <option value="high">高优先级</option>
          </select>
        </div>

        {/* Tag 输入框和展示 */}
        <div className="mb-4">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add tag (press Enter to add)"
            className="bg-white dark:bg-gray-700 p-2 border border-gray-400 rounded w-full"
          />
          <div className="mt-2 flex flex-wrap">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="relative bg-gray-200 dark:bg-gray-600 p-1 pl-2 pr-2 rounded mr-1 mb-1"
              >
                {tag}
                <FaTimes
                  className="absolute -top-1 -right-1 text-red-400 rounded-full cursor-pointer text-xs"
                  onClick={() => handleRemoveTag(idx)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between">
          <button
            onClick={closeModal}
            className="bg-white dark:bg-gray-700 p-2 border border-gray-600 rounded hover:border-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-gray-600 dark:bg-white p-2 border border-gray-600 text-white dark:text-black rounded hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;