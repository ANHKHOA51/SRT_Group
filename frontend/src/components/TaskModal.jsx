import React, { useState, useEffect } from 'react';

function formatDateForInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function TaskModal({ isOpen, onClose, onSave, task }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [deadline, setDeadline] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setStatus(task.status || 'pending');
        setDeadline(formatDateForInput(task.deadline));
      } else {
        setTitle('');
        setDescription('');
        setStatus('pending');
        setDeadline('');
      }
      setValidationError('');
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Task title is required.');
      return;
    }
    if (title.trim().length > 255) {
      setValidationError('Task title cannot exceed 255 characters.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      deadline: deadline ? new Date(deadline).toISOString() : null,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-on-background/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden transform transition-all scale-100 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between shrink-0">
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            {task ? 'Edit Task' : 'Add New Task'}
          </h3>
          <button
            className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors cursor-pointer"
            onClick={onClose}
          >
            <span className="material-symbols-outlined" data-icon="close">
              close
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {validationError && (
            <div className="bg-error-container text-error px-4 py-2.5 rounded-lg text-body-md font-semibold">
              {validationError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant">
              Task Title <span className="text-error">*</span>
            </label>
            <input
              className="w-full border border-outline-variant/60 rounded-lg px-4 py-2.5 text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="Enter title..."
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={255}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant">
              Detailed Description
            </label>
            <textarea
              className="w-full border border-outline-variant/60 rounded-lg px-4 py-2.5 text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
              placeholder="Enter description..."
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                Deadline
              </label>
              <input
                className="w-full border border-outline-variant/60 rounded-lg px-4 py-2.5 text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                Status
              </label>
              <select
                className={`w-full border rounded-lg px-4 py-2.5 text-body-md focus:outline-none cursor-pointer font-semibold transition-colors ${
                  status === 'pending'
                    ? 'bg-[#fffbeb] text-[#b45309] border-[#fde68a] focus:ring-2 focus:ring-[#fde68a]'
                    : status === 'ongoing'
                    ? 'bg-[#eff6ff] text-[#1d4ed8] border-[#93c5fd] focus:ring-2 focus:ring-[#93c5fd]'
                    : status === 'completed'
                    ? 'bg-[#f0fdf4] text-[#15803d] border-[#86efac] focus:ring-2 focus:ring-[#86efac]'
                    : 'bg-white border-outline-variant/60 focus:ring-2 focus:ring-primary focus:border-primary'
                }`}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending" style={{ color: '#b45309', backgroundColor: '#fffbeb' }}>Pending</option>
                <option value="ongoing" style={{ color: '#1d4ed8', backgroundColor: '#eff6ff' }}>On Going</option>
                <option value="completed" style={{ color: '#15803d', backgroundColor: '#f0fdf4' }}>Completed</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              className="flex-1 px-4 py-2.5 border border-outline-variant rounded-lg text-on-surface font-medium hover:bg-surface-container transition-colors cursor-pointer"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 cursor-pointer"
              type="submit"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
