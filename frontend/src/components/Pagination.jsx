import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between py-4 border-t border-outline-variant/30 mt-4 shrink-0">
      <p className="text-body-md text-outline font-medium">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          className="p-2 border border-outline-variant rounded-lg text-outline disabled:opacity-30 hover:bg-surface-container-low transition-colors cursor-pointer disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="chevron_left">
            chevron_left
          </span>
        </button>
        <button
          className="p-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="chevron_right">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}
