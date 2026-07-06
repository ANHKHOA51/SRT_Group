import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onStatusChange, onEdit, onDelete, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3 min-h-[512px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-body-md text-outline">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-outline-variant/30 p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[512px]">
        <span className="material-symbols-outlined text-[48px] text-outline/50 animate-pulse" data-icon="task">
          task
        </span>
        <div>
          <h3 className="font-task-title text-on-surface font-semibold text-lg">
            No tasks found
          </h3>
          <p className="text-body-md text-outline mt-1">
            Try changing your search filters or create a new task!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 min-h-[512px]">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
