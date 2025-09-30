/**
 * Mock data generator for Grid demo
 * Generates 1000+ rows with various column types
 */

import { CellType, type ICell } from '@teable/grid-table-kanban';

export interface MockRowData {
  id: string;
  text: string;
  number: number;
  select: string;
  multiSelect: string[];
  date: Date;
  boolean: boolean;
  rating: number;
  relation: string;
  link: string;
  email: string;
}

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
const STATUSES = ['Todo', 'In Progress', 'Review', 'Done', 'Blocked'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const TAGS = ['bug', 'feature', 'enhancement', 'documentation', 'test', 'refactor'];
const CITIES = ['New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Toronto', 'Singapore'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateMockRows(count: number = 1000): MockRowData[] {
  const rows: MockRowData[] = [];
  
  for (let i = 0; i < count; i++) {
    rows.push({
      id: `row-${i + 1}`,
      text: `Task ${i + 1}: ${randomItem(['Implement', 'Fix', 'Update', 'Review', 'Optimize'])} ${randomItem(['feature', 'bug', 'performance', 'UI', 'API'])}`,
      number: Math.floor(Math.random() * 10000),
      select: randomItem(STATUSES),
      multiSelect: randomItems(TAGS, Math.floor(Math.random() * 3) + 1),
      date: randomDate(new Date(2024, 0, 1), new Date(2025, 11, 31)),
      boolean: Math.random() > 0.5,
      rating: Math.floor(Math.random() * 6),
      relation: randomItem(CITIES),
      link: `https://example.com/item/${i + 1}`,
      email: `user${i + 1}@example.com`,
    });
  }
  
  return rows;
}

// Choice maps for select fields
export const STATUS_CHOICES = {
  'Todo': { id: 'todo', name: 'Todo', color: '#6B7280', backgroundColor: '#F3F4F6' },
  'In Progress': { id: 'in-progress', name: 'In Progress', color: '#3B82F6', backgroundColor: '#DBEAFE' },
  'Review': { id: 'review', name: 'Review', color: '#F59E0B', backgroundColor: '#FEF3C7' },
  'Done': { id: 'done', name: 'Done', color: '#10B981', backgroundColor: '#D1FAE5' },
  'Blocked': { id: 'blocked', name: 'Blocked', color: '#EF4444', backgroundColor: '#FEE2E2' },
};

export const PRIORITY_CHOICES = {
  'Low': { id: 'low', name: 'Low', color: '#6B7280', backgroundColor: '#F3F4F6' },
  'Medium': { id: 'medium', name: 'Medium', color: '#3B82F6', backgroundColor: '#DBEAFE' },
  'High': { id: 'high', name: 'High', color: '#F59E0B', backgroundColor: '#FEF3C7' },
  'Urgent': { id: 'urgent', name: 'Urgent', color: '#EF4444', backgroundColor: '#FEE2E2' },
};

export const TAG_CHOICES = TAGS.reduce((acc, tag) => {
  acc[tag] = {
    id: tag,
    name: tag,
    color: '#334155',
    backgroundColor: '#E2E8F0',
  };
  return acc;
}, {} as Record<string, { id: string; name: string; color: string; backgroundColor: string }>);

// Convert mock data to Grid cell format
export function mockRowToCells(row: MockRowData, columnIndex: number): ICell {
  switch (columnIndex) {
    case 0: // Text
      return {
        type: CellType.Text,
        data: row.text,
        displayData: row.text,
      };
    case 1: // Number
      return {
        type: CellType.Number,
        data: row.number,
        displayData: row.number.toLocaleString(),
      };
    case 2: // Single Select (Status)
      return {
        type: CellType.Select,
        data: [{ title: row.select, id: row.select.toLowerCase().replace(' ', '-') }],
        displayData: [row.select],
        choiceMap: STATUS_CHOICES,
        isMultiple: false,
      };
    case 3: // Multi Select (Tags)
      return {
        type: CellType.Select,
        data: row.multiSelect.map(tag => ({ title: tag, id: tag })),
        displayData: row.multiSelect,
        choiceMap: TAG_CHOICES,
        isMultiple: true,
      };
    case 4: // Date
      return {
        type: CellType.Text,
        data: row.date.toISOString(),
        displayData: row.date.toLocaleDateString(),
      };
    case 5: // Boolean
      return {
        type: CellType.Boolean,
        data: row.boolean,
      };
    case 6: // Rating
      return {
        type: CellType.Rating,
        data: row.rating,
        icon: '⭐',
        color: '#F59E0B',
        max: 5,
      };
    case 7: // Relation (Link to another record)
      return {
        type: CellType.Text,
        data: row.relation,
        displayData: row.relation,
      };
    case 8: // Link
      return {
        type: CellType.Link,
        data: [row.link],
        displayData: row.link,
      };
    case 9: // Email
      return {
        type: CellType.Text,
        data: row.email,
        displayData: row.email,
      };
    default:
      return {
        type: CellType.Text,
        data: '',
        displayData: '',
      };
  }
}