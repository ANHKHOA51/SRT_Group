import React from 'react';

export default function Toolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-outline-variant/50 p-3 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 min-w-[240px] relative">
        <span
          className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none"
          data-icon="search"
        >
          search
        </span>
        <input
          className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary-container outline-none"
          placeholder="Search tasks..."
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-body-md text-outline font-medium">Status:</label>
          <select
            className={`border rounded-lg px-3 py-2 text-body-md focus:outline-none cursor-pointer font-semibold transition-colors ${
              statusFilter === 'pending'
                ? 'bg-[#fffbeb] text-[#b45309] border-[#fde68a] hover:border-[#fcd34d]'
                : statusFilter === 'ongoing'
                ? 'bg-[#eff6ff] text-[#1d4ed8] border-[#93c5fd] hover:border-[#60a5fa]'
                : statusFilter === 'completed'
                ? 'bg-[#f0fdf4] text-[#15803d] border-[#86efac] hover:border-[#4ade80]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
            }`}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="all" style={{ color: '#374151', backgroundColor: 'white' }}>All</option>
            <option value="pending" style={{ color: '#b45309', backgroundColor: '#fffbeb' }}>Pending</option>
            <option value="ongoing" style={{ color: '#1d4ed8', backgroundColor: '#eff6ff' }}>On Going</option>
            <option value="completed" style={{ color: '#15803d', backgroundColor: '#f0fdf4' }}>Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-body-md text-outline font-medium">Sort by:</label>
          <select
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-primary outline-none cursor-pointer"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="created_desc">Newest</option>
            <option value="created_asc">Oldest</option>
            <option value="title_asc">Title A-Z</option>
            <option value="title_desc">Title Z-A</option>
            <option value="deadline_asc">Nearest Deadline</option>
            <option value="deadline_desc">Furthest Deadline</option>
            <option value="status_asc">Status (Completed ➔ Pending)</option>
            <option value="status_desc">Status (Pending ➔ Completed)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
