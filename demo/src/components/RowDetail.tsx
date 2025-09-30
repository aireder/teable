/**
 * Row detail panel for expanded rows
 */

import type { MockRowData } from '../data/makeMockRows';

interface RowDetailProps {
  row: MockRowData;
  onClose: () => void;
}

export function RowDetail({ row, onClose }: RowDetailProps) {
  return (
    <div className="p-4 bg-gray-50 border-t border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Row Details: {row.id}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          ✕
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Task Name
          </label>
          <p className="text-sm text-gray-900">{row.text}</p>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Value
          </label>
          <p className="text-sm text-gray-900">{row.number.toLocaleString()}</p>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Status
          </label>
          <p className="text-sm text-gray-900">{row.select}</p>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Tags
          </label>
          <div className="flex gap-1 flex-wrap">
            {row.multiSelect.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Due Date
          </label>
          <p className="text-sm text-gray-900">{row.date.toLocaleDateString()}</p>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Completed
          </label>
          <p className="text-sm text-gray-900">{row.boolean ? 'Yes' : 'No'}</p>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Rating
          </label>
          <p className="text-sm text-gray-900">{'⭐'.repeat(row.rating)}</p>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Location
          </label>
          <p className="text-sm text-gray-900">{row.relation}</p>
        </div>
        
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Link
          </label>
          <a
            href={row.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            {row.link}
          </a>
        </div>
        
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Contact
          </label>
          <p className="text-sm text-gray-900">{row.email}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition">
          Edit Details
        </button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition">
          View History
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition">
          Delete Row
        </button>
      </div>
    </div>
  );
}