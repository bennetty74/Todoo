'use client'
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainView from './components/MainView';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('todo');
  const [theme, setTheme] = useState('light');
  const [selectedPriorities, setSelectedPriorities] = useState([]); // 选中的优先级

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'light');
  };

  // 处理优先级筛选
  const handlePriorityFilterChange = (priorities) => {
    setSelectedPriorities(priorities);
  };

  return (
    <div className={theme === 'dark' ? 'dark:bg-gray-800 dark:text-white' : 'bg-white text-black'}>
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} toggleTheme={toggleTheme} theme={theme} selectedPriorities={selectedPriorities} onPriorityFilterChange={handlePriorityFilterChange} />
        <MainView activeMenu={activeMenu} selectedPriorities={selectedPriorities} />
      </div>
    </div>
  );
}

