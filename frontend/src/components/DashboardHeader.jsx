import React from 'react';

export default function DashboardHeader({ activeTaskCount, onAddTaskClick }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
          Task Management
        </h2>
        <p className="text-body-md text-outline">
          {activeTaskCount} active tasks
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center gap-2 font-label-md hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 cursor-pointer"
          onClick={onAddTaskClick}
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="add">add</span>
          Add Task
        </button>
      </div>
    </div>
  );
}
