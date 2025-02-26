import { useState } from "react";
import TodoCard from "./TodoCard";
import Modal from "./Modal";
import { FaPlus } from "react-icons/fa";
import { RxDotsHorizontal } from "react-icons/rx";

const TodoList = ({ tasks, setTasks, selectedPriorities,selectedTags }) => {
  // 在组件顶部添加状态
  const [draggingOver, setDraggingOver] = useState(null);
  // 根据选中的优先级和标签筛选任务
  const filteredTasks = tasks
    .filter((task) => 
      // 优先级过滤：如果没有选中任何优先级则显示所有，否则检查是否包含
      selectedPriorities.length === 0 || selectedPriorities.includes(task.priority)
    )
    .filter((task) => 
      // 标签过滤：如果没有选中任何标签则显示所有，否则检查是否包含
      selectedTags.length === 0 || selectedTags.some(tag => task.tags?.includes(tag))
    );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // 用于编辑时选中的任务

  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [isDoingOpen, setIsDoingOpen] = useState(false);
  const [isDoneOpen, setIsDoneOpen] = useState(false);

  // 切换下拉菜单显示状态
  const toggleTodoDropdown = () => {
    setIsTodoOpen(!isTodoOpen);
  };

  const toggleDoingDropdown = () => {
    setIsDoingOpen(!isDoingOpen);
  };

  const toggleDoneDropdown = () => {
    setIsDoneOpen(!isDoneOpen);
  };

  // 新增按钮处理函数
  const handleAdd = () => {
    openModal();
    setIsTodoOpen(false); // 关闭菜单
  };

  // 隐藏按钮处理函数
  const handleHide = () => {
    console.log("隐藏");
    setIsTodoOpen(false); // 关闭菜单
  };

  // 隐藏按钮处理函数
  const handleCancel = () => {
    console.log("取消");
    setIsTodoOpen(false); // 关闭菜单
  };
  

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setSelectedTask(taskToEdit);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const handleHideTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, hide: true } : task
    );
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
    <div className="grid grid-cols-3 gap-2 h-full">
      {/* Todo Column */}
      <div
        className={`h-full p-4 rounded border-1 overflow-y-auto scrollbar-hide ${
          draggingOver === "todo"
            ? "bg-gray-100 dark:bg-gray-600"
            : "bg-transparent"
        }`}
        onDrop={(e) => {
          handleDropColumn(e, "todo");
          setDraggingOver(null);
        }}
        onDragOver={(e) => handleDragOver(e, "todo")}
        onDragLeave={() => setDraggingOver(null)}
      >
        <div className="text-gray-500 flex flex-row items-center justify-between mb-2 relative">
          <h2 className="text-l">待开始</h2>
          <RxDotsHorizontal onClick={toggleTodoDropdown} />
          {/* Dropdown menu */}
          {isTodoOpen && (
            <div className="absolute right-0 top-6 w-48 bg-white dark:bg-gray-600 dark:text-white border border-gray-300 rounded shadow-lg z-10">
              <ul>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer flex flex-row items-center"
                  onClick={handleAdd}
                >
                  {/* <FaPlus className="mr-2"/> */}
                  新增
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer"
                  onClick={handleHide}
                >
                  隐藏
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer"
                  onClick={handleCancel}
                >
                  取消
                </li>
              </ul>
            </div>
          )}
        </div>

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
              onHide={handleHideTask}
            />
          ))}
       

        <div
          className="mt-2 p-2 border rounded flex justify-center items-center dark:border-gray-700"
          onClick={openModal}
        >
          <FaPlus className="text-gray-500" />
        </div>
      </div>

      {/* Doing Column */}
      <div
        className={`h-full p-4 rounded border-1 overflow-y-auto scrollbar-hide ${
          draggingOver === "doing"
            ? "bg-gray-100 dark:bg-gray-600"
            : "bg-transparent"
        }`}
        onDrop={(e) => {
          handleDropColumn(e, "doing");
          setDraggingOver(null);
        }}
        onDragOver={(e) => handleDragOver(e, "doing")}
        onDragLeave={() => setDraggingOver(null)}
      >
           <div className="text-gray-500 flex flex-row items-center justify-between mb-2 relative">
          <h2 className="text-l">进行中</h2>
          <RxDotsHorizontal onClick={toggleDoingDropdown} />
          {/* Dropdown menu */}
          {isDoingOpen && (
            <div className="absolute right-0 top-6 w-48 bg-white dark:bg-gray-600 dark:text-white border border-gray-300 rounded shadow-lg z-10">
              <ul>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer flex flex-row items-center"
                  onClick={handleAdd}
                >
                  {/* <FaPlus className="mr-2"/> */}
                  新增
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer"
                  onClick={handleHide}
                >
                  隐藏
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer"
                  onClick={toggleDoingDropdown}
                >
                  取消
                </li>
              </ul>
            </div>
          )}
        </div>

        {filteredTasks
          .filter((task) => task.status === "doing")
          .map((task) => (
            <TodoCard
              key={task.id}
              task={task}
              updateStatus={updateTaskStatus}
              onDragStart={(e) => handleDragStart(e, task)}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onHide={handleHideTask}
            />
          ))}
      </div>

      {/* Done Column */}
      <div
        className={`h-full p-4 rounded border-1 overflow-y-auto scrollbar-hide ${
          draggingOver === "done"
            ? "bg-gray-100 dark:bg-gray-600"
            : "bg-transparent"
        }`}
        onDrop={(e) => {
          handleDropColumn(e, "done");
          setDraggingOver(null);
        }}
        onDragOver={(e) => handleDragOver(e, "done")}
        onDragLeave={() => setDraggingOver(null)}
      >
           <div className="text-gray-500 flex flex-row items-center justify-between mb-2 relative">
          <h2 className="text-l">已完成</h2>
          <RxDotsHorizontal onClick={toggleDoneDropdown} />
          {/* Dropdown menu */}
          {isDoneOpen && (
            <div className="absolute right-0 top-6 w-48 bg-white dark:bg-gray-600 dark:text-white border border-gray-300 rounded shadow-lg z-10">
              <ul>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer flex flex-row items-center"
                  onClick={handleAdd}
                >
                  {/* <FaPlus className="mr-2"/> */}
                  新增
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer"
                  onClick={handleHide}
                >
                  隐藏
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer"
                  onClick={toggleDoneDropdown}
                >
                  取消
                </li>
              </ul>
            </div>
          )}
        </div>


        {filteredTasks
          .filter((task) => task.status === "done")
          .map((task) => (
            <TodoCard
              key={task.id}
              task={task}
              updateStatus={updateTaskStatus}
              onDragStart={(e) => handleDragStart(e, task)}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onHide={handleHideTask}
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
