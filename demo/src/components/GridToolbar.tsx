/**
 * Grid toolbar with controls for sorting, filtering, pagination, etc.
 */

import { useGridStore } from '../states/useGridStore';
import type { SortDirection } from '../data/options';

export function GridToolbar() {
  const {
    columns,
    sortConfig,
    filterConfig,
    currentPage,
    pageSize,
    totalRows,
    freezeColumnCount,
    addSort,
    clearSort,
    clearFilters,
    setPage,
    setPageSize,
    setFreezeColumnCount,
    resetToDefaults,
  } = useGridStore();
  
  const totalPages = Math.ceil(totalRows / pageSize);
  const visibleColumns = columns.filter(col => col.id);
  
  const handleSortChange = (columnId: string, direction: SortDirection) => {
    addSort({ columnId, direction });
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Left side - Sorting & Filtering */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Quick Sort:</label>
            <select
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const [columnId, direction] = e.target.value.split(':');
                if (columnId && direction) {
                  handleSortChange(columnId, direction as SortDirection);
                }
              }}
              value=""
            >
              <option value="">Add sort...</option>
              {visibleColumns.map((col) => (
                <optgroup key={col.id} label={col.name}>
                  <option value={`${col.id}:asc`}>↑ Ascending</option>
                  <option value={`${col.id}:desc`}>↓ Descending</option>
                </optgroup>
              ))}
            </select>
            
            {sortConfig.length > 0 && (
              <button
                onClick={clearSort}
                className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition"
              >
                Clear Sort ({sortConfig.length})
              </button>
            )}
          </div>
          
          {filterConfig.length > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition"
            >
              Clear Filters ({filterConfig.length})
            </button>
          )}
        </div>
        
        {/* Middle - Freeze Column Control */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Freeze Columns:</label>
          <select
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={freezeColumnCount}
            onChange={(e) => setFreezeColumnCount(parseInt(e.target.value, 10))}
          >
            {[0, 1, 2, 3].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
        
        {/* Right side - Pagination */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Page Size:</label>
            <select
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700 px-2">
              Page {currentPage} of {totalPages} ({totalRows} rows)
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Last
            </button>
          </div>
          
          <button
            onClick={resetToDefaults}
            className="px-4 py-1.5 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition"
          >
            Reset All
          </button>
        </div>
      </div>
      
      {/* Active Sorts Display */}
      {sortConfig.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Active Sorts:</span>
            {sortConfig.map((sort, index) => {
              const column = columns.find(c => c.id === sort.columnId);
              return (
                <span
                  key={sort.columnId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                >
                  {index + 1}. {column?.name} ({sort.direction === 'asc' ? '↑' : '↓'})
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}