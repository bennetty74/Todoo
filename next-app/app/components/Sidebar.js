'use client'
import { FaTasks, FaCalendarAlt, FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';

const Sidebar = ({ activeMenu, onMenuClick, toggleTheme, theme, onPriorityFilterChange, selectedPriorities }) => {
  // 处理优先级多选
  const handlePriorityToggle = (priority) => {
    const newSelectedPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter((p) => p !== priority) // 取消选中
      : [...selectedPriorities, priority]; // 选中
    onPriorityFilterChange(newSelectedPriorities);
  };

  return (
    <div className="w-64 h-screen p-4 flex flex-col">
      <div className="flex flex-col mb-4">
      <h3 className="text-sm font-bold mb-2 dark:text-white">View Mode</h3>
        {/* Todo 菜单 */}
        <button
          onClick={() => onMenuClick('todo')}
          className={`flex items-center p-2 dark:text-white rounded mb-2 hover:border-gray-400 
            ${activeMenu === 'todo' ? 'text-white bg-gray-500 dark:bg-gray-700' : ''}`}
        >
          <FaTasks className="mr-2" />
          Todo
        </button>

        {/* Calendar 菜单 */}
        <button
          onClick={() => onMenuClick('calendar')}
          className={`flex items-center p-2 dark:text-white rounded mb-2 hover:border-gray-400 
            ${activeMenu === 'calendar' ? 'text-white bg-gray-500 dark:bg-gray-700' : 'text-black'}`}
        >
          <FaCalendarAlt className="mr-2" />
          Calendar
        </button>

        {/* 优先级筛选菜单 */}
        <div className="mt-4">
          <h3 className="text-sm font-bold mb-2 dark:text-white">Filter by Priority</h3>
          {/* 高优先级 */}
          <button
            onClick={() => handlePriorityToggle('high')}
            className={`flex items-center p-2 dark:text-white rounded hover:border-gray-400 w-full
              ${selectedPriorities.includes('high') ? 'text-white bg-gray-500 dark:bg-gray-700' : 'text-black'}`}
          >
            <FaArrowUp className="mr-2 text-red-500" />
            High Priority
          </button>
          {/* 中优先级 */}
          <button
            onClick={() => handlePriorityToggle('medium')}
            className={`flex items-center p-2 dark:text-white rounded hover:border-gray-400 w-full
              ${selectedPriorities.includes('medium') ? 'text-white bg-gray-500 dark:bg-gray-700' : 'text-black'}`}
          >
            <FaEquals className="mr-2 text-yellow-500" />
            Medium Priority
          </button>
          {/* 低优先级 */}
          <button
            onClick={() => handlePriorityToggle('low')}
            className={`flex items-center p-2 dark:text-white rounded mb-2 hover:border-gray-400 w-full
              ${selectedPriorities.includes('low') ? 'text-white bg-gray-500 dark:bg-gray-700' : 'text-black'}`}
          >
            <FaArrowDown className="mr-2 text-green-500" />
            Low Priority
          </button>
        </div>
      </div>

      {/* 主题切换按钮 */}
      <div className="mt-auto">
      <h3 className="text-sm font-bold mb-2 dark:text-white">Settings</h3>
        <button
          onClick={toggleTheme}
          className="flex items-center p-2 text-gray-900 dark:text-white rounded w-full hover:border-gray-400"
        >
          {theme === 'light' ? (
            <FiMoon className="mr-2" />
          ) : (
            <FiSun className="mr-2" />
          )}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;