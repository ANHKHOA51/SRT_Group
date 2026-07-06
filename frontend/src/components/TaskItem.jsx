import React from 'react';

function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TaskItem({ task, onStatusChange, onEdit, onDelete }) {
  const isCompleted = task.status === 'completed';

  let badgeClass = 'bg-[#fffbeb] text-[#b45309]';
  let selectClass = 'bg-[#fffbeb] text-[#b45309] border-[#fde68a] hover:border-[#fcd34d]';
  let badgeText = 'Pending';

  if (task.status === 'ongoing') {
    badgeClass = 'bg-[#eff6ff] text-[#1d4ed8]'; 
    selectClass = 'bg-[#eff6ff] text-[#1d4ed8] border-[#93c5fd] hover:border-[#60a5fa]';
    badgeText = 'Ongoing';
  } else if (task.status === 'completed') {
    badgeClass = 'bg-[#f0fdf4] text-[#15803d]'; 
    selectClass = 'bg-[#f0fdf4] text-[#15803d] border-[#86efac] hover:border-[#4ade80]';
    badgeText = 'Completed';
  }

  return (
    <div
      className={`group px-4 py-3 rounded-lg border transition-all flex items-center gap-4 h-24 ${
        isCompleted
          ? 'bg-white/60 border-outline-variant/70'
          : 'bg-white border-outline-variant hover:border-primary/30'
      }`}
    >
      <select
        className={`shrink-0 cursor-pointer border rounded-md py-1.5 px-2 font-semibold text-[13px] focus:outline-none transition-colors ${selectClass}`}
        value={task.status}
        onChange={(e) => onStatusChange(task, e.target.value)}
      >
        <option value="pending" style={{ color: '#b45309', backgroundColor: '#fffbeb' }}>Pending</option>
        <option value="ongoing" style={{ color: '#1d4ed8', backgroundColor: '#eff6ff' }}>On Going</option>
        <option value="completed" style={{ color: '#15803d', backgroundColor: '#f0fdf4' }}>Completed</option>
      </select>

      <div className="flex-1 min-w-0">
        <h3
          className={`font-task-title text-task-title text-on-surface font-semibold truncate ${
            isCompleted ? 'task-completed' : ''
          }`}
          title={task.title}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-body-md text-outline truncate max-w-xl" title={task.description}>
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badgeClass}`}>
            {badgeText}
          </span>
          {task.deadline && (
            <span className="text-outline text-label-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]" data-icon="calendar_today">
                calendar_today
              </span>
              {formatDate(task.deadline)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
        <button
          className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors cursor-pointer"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="edit">
            edit
          </span>
        </button>
        <button
          className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors cursor-pointer"
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="delete">
            delete
          </span>
        </button>
      </div>
    </div>
  );
}
