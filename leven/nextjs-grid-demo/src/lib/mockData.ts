/**
 * Mock data generator for grid demonstration
 * Simulates the data structure that would come from a share view
 */

export interface MockRecord {
  id: string;
  name: string;
  email: string;
  status: string;
  priority: string;
  rating: number;
  progress: number;
  done: boolean;
  createdAt: string;
}

export interface MockField {
  id: string;
  name: string;
  type: string;
  width?: number;
}

export interface MockView {
  id: string;
  name: string;
  type: string;
  options?: {
    rowHeight?: number;
    frozenColumnCount?: number;
    fieldNameDisplayLines?: number;
  };
}

export interface ShareViewData {
  shareId: string;
  tableId: string;
  viewId: string;
  view: MockView;
  fields: MockField[];
  records: MockRecord[];
  shareMeta?: {
    allowCopy?: boolean;
  };
}

const statuses = ['todo', 'in-progress', 'review', 'done'];
const priorities = ['low', 'medium', 'high', 'urgent'];

export function generateMockRecords(count: number): MockRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `rec-${i}`,
    name: `Task ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    rating: (i % 5) + 1,
    progress: (i * 13) % 101,
    done: i % 3 === 0,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

export function getMockFields(): MockField[] {
  return [
    { id: 'fld-name', name: 'Task Name', type: 'text', width: 200 },
    { id: 'fld-email', name: 'Email', type: 'link', width: 220 },
    { id: 'fld-status', name: 'Status', type: 'select', width: 120 },
    { id: 'fld-priority', name: 'Priority', type: 'select', width: 120 },
    { id: 'fld-rating', name: 'Rating', type: 'rating', width: 140 },
    { id: 'fld-progress', name: 'Progress', type: 'number', width: 100 },
    { id: 'fld-done', name: 'Done', type: 'checkbox', width: 100 },
    { id: 'fld-created', name: 'Created At', type: 'date', width: 180 },
  ];
}

export function getMockShareViewData(shareId: string): ShareViewData {
  return {
    shareId,
    tableId: 'tbl-demo',
    viewId: 'viw-grid',
    view: {
      id: 'viw-grid',
      name: 'Grid View Demo',
      type: 'grid',
      options: {
        rowHeight: 1, // Short
        frozenColumnCount: 1,
        fieldNameDisplayLines: 1,
      },
    },
    fields: getMockFields(),
    records: generateMockRecords(100),
    shareMeta: {
      allowCopy: true,
    },
  };
}