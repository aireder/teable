/**
 * Column definitions and options
 */

import type { IGridColumn } from '@teable/grid-table-kanban';

export const COLUMN_DEFINITIONS: IGridColumn[] = [
  {
    id: 'col-text',
    name: 'Task Name',
    width: 300,
    isPrimary: true,
    hasMenu: true,
    description: 'Task description and title',
  },
  {
    id: 'col-number',
    name: 'Value',
    width: 120,
    hasMenu: true,
    description: 'Numeric value',
  },
  {
    id: 'col-status',
    name: 'Status',
    width: 150,
    hasMenu: true,
    description: 'Current status',
  },
  {
    id: 'col-tags',
    name: 'Tags',
    width: 200,
    hasMenu: true,
    description: 'Multiple tags',
  },
  {
    id: 'col-date',
    name: 'Due Date',
    width: 150,
    hasMenu: true,
  },
  {
    id: 'col-boolean',
    name: 'Completed',
    width: 100,
    hasMenu: true,
  },
  {
    id: 'col-rating',
    name: 'Priority',
    width: 150,
    hasMenu: true,
  },
  {
    id: 'col-relation',
    name: 'Location',
    width: 150,
    hasMenu: true,
  },
  {
    id: 'col-link',
    name: 'URL',
    width: 200,
    hasMenu: true,
  },
  {
    id: 'col-email',
    name: 'Contact',
    width: 200,
    hasMenu: true,
  },
];

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  columnId: string;
  direction: SortDirection;
}

export interface FilterConfig {
  columnId: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean';
  operator: 'contains' | 'equals' | 'gt' | 'lt' | 'between' | 'in';
  value: string | number | string[] | [number, number] | boolean;
}

export interface ColumnVisibility {
  [columnId: string]: boolean;
}