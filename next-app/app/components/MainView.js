"use client";
import { useState, useEffect } from "react";
import TodoList from "./TodoList";
import CalendarView from "./CalendarView";

const MainView = ({ activeMenu, selectedPriorities, selectedTags, tasks, setTasks }) => {
  
  return (
    <div className="flex-1 p-4 dark:bg-gray-800">
      {activeMenu === "todo" && (
        <TodoList
          tasks={tasks}
          setTasks={setTasks}
          selectedPriorities={selectedPriorities}
          selectedTags={selectedTags}
        />
      )}
      {activeMenu === "calendar" && (
        <CalendarView tasks={tasks} selectedPriorities={selectedPriorities} selectedTags={selectedTags} />
      )}
    </div>
  );
};

export default MainView;
