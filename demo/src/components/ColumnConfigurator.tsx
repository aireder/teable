/**
 * Column configurator for showing/hiding columns and adjusting widths
 */

import { useState } from 'react';
import { useGridStore } from '../states/useGridStore';

export function ColumnConfigurator() {
  const [isOpen, setIsOpen] = useState(false);
  const { columns, columnVisibility, toggleColumnVisibility, updateColumn } = useGridStore();
  
  const visibleCount = Object.values(columnVisibility).filter(Boolean).length;
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
      >
        Configure Columns ({visibleCount}/{columns.length})
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Column Settings</h3>
              <p className="text-sm text-gray-500 mt-1">
                Toggle visibility and adjust column widths
              </p>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className="p-3 border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={columnVisibility[column.id!] ?? true}
                        onChange={() => toggleColumnVisibility(column.id!)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {column.name}
                      </span>
                    </label>
                    <span className="text-xs text-gray-500">
                      {column.width}px
                    </span>
                  </div>
                  
                  {column.description && (
                    <p className="text-xs text-gray-500 ml-6">
                      {column.description}
                    </p>
                  )}
                  
                  <div className="ml-6 mt-2">
                    <label className="text-xs text-gray-600">Width:</label>
                    <input
                      type="range"
                      min={80}
                      max={500}
                      value={column.width}
                      onChange={(e) =>
                        updateColumn(column.id!, {
                          width: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}