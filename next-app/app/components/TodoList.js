import { useState } from "react";
import TodoCard from "./TodoCard";
import Modal from "./Modal";
import { FaPlus } from "react-icons/fa";

const TodoList = ({ tasks, setTasks, selectedPriorities }) => {
  const [newTask, setNewTask] = useState("");
  // 在组件顶部添加状态
  const [draggingOver, setDraggingOver] = useState(null);

  const [taskDetails, setTaskDetails] = useState({
    priority: "low",
    tags: [],
  });

  // 根据选中的优先级筛选任务
  const filteredTasks = selectedPriorities.length === 0
    ? tasks // 如果没有选中任何优先级，显示所有任务
    : tasks.filter((task) => selectedPriorities.includes(task.priority));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // 用于编辑时选中的任务

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setSelectedTask(taskToEdit);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const handleSaveTask = (newTask) => {
    if (selectedTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id ? { ...task, ...newTask } : task
      );
      setTasks(updatedTasks);
    } else {
      const taskWithId = { ...newTask, id: Date.now(), status: "todo" };
      setTasks([...tasks, taskWithId]);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setSelectedTask(null); // 清除选中的任务，表示新增任务
  };

  // 添加新任务
  const addTask = () => {
    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      status: "todo", // 默认状态为 "todo"
      ...taskDetails,
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask("");
  };

  // 更新任务状态
  const updateTaskStatus = (taskId, newStatus) => {
    const taskIdNum = Number(taskId); // 关键修复：转为数字类型
    const updatedTasks = tasks.map((task) =>
      task.id === taskIdNum ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  // 处理卡片拖拽到不同的状态栏
  const handleDropColumn = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId"); // 获取拖动任务的ID
    updateTaskStatus(taskId, status); // 更新任务的状态为目标栏的状态
  };

  // 处理卡片的拖动开始
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task.id); // 存储任务的 ID
    e.dataTransfer.setData("status", task.status); // 存储任务的状态
  };

  // 修改 handleDropColumn 和 onDragOver 处理
  const handleDragOver = (e, status) => {
    e.preventDefault();
    setDraggingOver(status);
  };

  return (
    <div className="flex space-x-2 h-full">
      {/* Todo Column */}
      <div
        className={`flex-1 p-4 rounded border-1 ${
          draggingOver === "todo" ? "bg-gray-100 dark:bg-gray-600" : "bg-transparent"
        }`}
        onDrop={(e) => {
          handleDropColumn(e, "todo");
          setDraggingOver(null);
        }}
        onDragOver={(e) => handleDragOver(e, "todo")}
        onDragLeave={() => setDraggingOver(null)}
      >
        {/* <div className="flex flex-row items-center justify-between"> */}
          <h2 className="text-xl text-center mb-2">Todo</h2>
          
        {/* </div> */}
        {filteredTasks
          .filter((task) => task.status === "todo")
          .map((task) => (
            <TodoCard
              key={task.id}
              task={task}
              updateStatus={updateTaskStatus}
              onDragStart={(e) => handleDragStart(e, task)}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}

          <div className="mt-2 p-2 border rounded flex justify-center items-center dark:border-gray-700" onClick={openModal}>
            <FaPlus className="text-gray-500"/>
          </div>
      </div>

      {/* Doing Column */}
      <div
        className={`flex-1 p-4 rounded border-1 ${
          draggingOver === "doing" ? "bg-gray-100 dark:bg-gray-600" : "bg-transparent"
        }`}
        onDrop={(e) => {
          handleDropColumn(e, "doing");
          setDraggingOver(null);
        }}
        onDragOver={(e) => handleDragOver(e, "doing")}
        onDragLeave={() => setDraggingOver(null)}
      >
        <h2 className="text-xl text-center mb-2">Doing</h2>
        {filteredTasks
          .filter((task) => task.status === "doing")
          .map((task) => (
            <TodoCard
              key={task.id}
              task={task}
              updateStatus={updateTaskStatus}
              onDragStart={(e) => handleDragStart(e, task)} // 设置拖动事件
            />
          ))}
      </div>

      {/* Done Column */}
      <div
        className={`flex-1 p-4 rounded border-1 ${
          draggingOver === "done" ? "bg-gray-100 dark:bg-gray-600" : "bg-transparent"
        }`}
        onDrop={(e) => {
          handleDropColumn(e, "done");
          setDraggingOver(null);
        }}
        onDragOver={(e) => handleDragOver(e, "done")}
        onDragLeave={() => setDraggingOver(null)}
      >
        <h2 className="text-xl text-center mb-2">Done</h2>
        {filteredTasks
          .filter((task) => task.status === "done")
          .map((task) => (
            <TodoCard
              key={task.id}
              task={task}
              updateStatus={updateTaskStatus}
              onDragStart={(e) => handleDragStart(e, task)} // 设置拖动事件
            />
          ))}
      </div>

      {/* Modal for adding/editing task */}
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
      />
    </div>
  );
};

export default TodoList;
