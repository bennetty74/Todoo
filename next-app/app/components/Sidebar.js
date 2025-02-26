"use client";
import {
  FaTasks,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
} from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";

const Sidebar = ({
  activeMenu,
  onMenuClick,
  toggleTheme,
  theme,
  onPriorityFilterChange,
  selectedPriorities,
  tags,
  onTagFilterChange,
  selectedTags,
}) => {
  // 处理优先级多选
  const handlePriorityToggle = (priority) => {
    const newSelectedPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter((p) => p !== priority) // 取消选中
      : [...selectedPriorities, priority]; // 选中
    onPriorityFilterChange(newSelectedPriorities);
  };

  // 处理标签多选
  const handleTagToggle = (tag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagFilterChange(newSelectedTags);
  };

  return (
    <div className="w-64 h-full p-4 flex flex-col">
      <div className="flex flex-col mb-4">
        <h3 className="text-sm font-bold mb-2 dark:text-white"> 任务视图</h3>
        {/* Todo 菜单 */}
        <button
          onClick={() => onMenuClick("todo")}
          className={`flex items-center p-2 dark:text-white rounded mb-2 hover:border-gray-400 
            ${
              activeMenu === "todo"
                ? "text-white bg-gray-500 dark:bg-gray-700"
                : ""
            }`}
        >
          <FaTasks className="mr-2" />
          列表视图
        </button>

        {/* Calendar 菜单 */}
        <button
          onClick={() => onMenuClick("calendar")}
          className={`flex items-center p-2 dark:text-white rounded mb-2 hover:border-gray-400 
            ${
              activeMenu === "calendar"
                ? "text-white bg-gray-500 dark:bg-gray-700"
                : "text-black"
            }`}
        >
          <FaCalendarAlt className="mr-2" />
          日程视图
        </button>

        {/* 优先级筛选菜单 */}
        <div className="mt-4">
          <h3 className="text-sm font-bold mb-2 dark:text-white">优先级</h3>
          {/* 高优先级 */}
          <button
            onClick={() => handlePriorityToggle("high")}
            className={`flex items-center p-2 dark:text-white rounded hover:border-gray-400 w-full
              ${
                selectedPriorities.includes("high")
                  ? "text-white bg-gray-500 dark:bg-gray-700"
                  : "text-black"
              }`}
          >
            <FaArrowUp className="mr-2 text-red-500" />
            高优先级
          </button>
          {/* 中优先级 */}
          <button
            onClick={() => handlePriorityToggle("medium")}
            className={`flex items-center p-2 dark:text-white rounded hover:border-gray-400 w-full
              ${
                selectedPriorities.includes("medium")
                  ? "text-white bg-gray-500 dark:bg-gray-700"
                  : "text-black"
              }`}
          >
            <FaEquals className="mr-2 text-yellow-500" />
            中优先级
          </button>
          {/* 低优先级 */}
          <button
            onClick={() => handlePriorityToggle("low")}
            className={`flex items-center p-2 dark:text-white rounded mb-2 hover:border-gray-400 w-full
              ${
                selectedPriorities.includes("low")
                  ? "text-white bg-gray-500 dark:bg-gray-700"
                  : "text-black"
              }`}
          >
            <FaArrowDown className="mr-2 text-green-500" />
            低优先级
          </button>
        </div>

        {/* 标签筛选菜单 */}
        <div className="mt-4">
          <h3 className="text-sm font-bold mb-2 dark:text-white">标签</h3>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-1 max-h-[220px] overflow-y-auto scrollbar-hide">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`text-[12px] px-2 py-1 dark:text-white rounded hover:border-gray-400
            ${
              selectedTags.includes(tag)
                ? "text-white bg-gray-500 dark:bg-gray-700"
                : "text-black border border-gray-300"
            }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">暂无标签</p>
          )}
        </div>
      </div>

      {/* 主题切换按钮 */}
      <div className="mt-auto mb-8">
        <h3 className="text-sm font-bold mb-2 dark:text-white">设置</h3>
        <button
          onClick={toggleTheme}
          className="flex items-center p-2 text-gray-900 dark:text-white rounded w-full hover:border-gray-400"
        >
          {theme === "light" ? (
            <FiMoon className="mr-2" />
          ) : (
            <FiSun className="mr-2" />
          )}
          {theme === "light" ? "暗夜模式" : "明亮模式"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
