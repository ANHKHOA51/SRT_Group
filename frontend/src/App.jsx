import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardHeader from './components/DashboardHeader';
import Toolbar from './components/Toolbar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import Pagination from './components/Pagination';

const PAGE_SIZE = 5;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalTasks, setTotalTasks] = useState(0);
  const [activeTaskCount, setActiveTaskCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_desc');

  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = '/api/tasks';
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      params.append('page', currentPage);
      params.append('limit', PAGE_SIZE);
      params.append('sortBy', sortBy);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error fetching tasks');
      }
      const data = await response.json();
      setTasks(data.tasks || []);
      setTotalTasks(data.totalTasks || 0);
      setActiveTaskCount(data.activeTasks || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, statusFilter, sortBy, currentPage]);

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error deleting task');
      }
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Error updating task status');
      }
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      let response;
      if (editingTask) {
        response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
      } else {
        response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
      }

      if (!response.ok) {
        throw new Error('Error saving task details');
      }

      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const totalPages = Math.max(1, Math.ceil(totalTasks / PAGE_SIZE));
  const activePage = Math.max(1, Math.min(currentPage, totalPages));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-container-max mx-auto space-y-6">
          {error && (
            <div className="bg-error-container text-error px-4 py-3 rounded-lg text-body-md font-semibold">
              {error}
            </div>
          )}

          <DashboardHeader activeTaskCount={activeTaskCount} onAddTaskClick={handleAddClick} />

          <Toolbar
            searchQuery={searchQuery}
            onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            statusFilter={statusFilter}
            onStatusFilterChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
            sortBy={sortBy}
            onSortByChange={(val) => { setSortBy(val); setCurrentPage(1); }}
          />

          <TaskList
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            isLoading={isLoading}
          />

          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}
