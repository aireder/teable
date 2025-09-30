/**
 * Mock API service with pagination, sorting, and filtering
 * Simulates server-side operations with 300ms delay
 */

import type { MockRowData } from '../data/makeMockRows';
import type { SortConfig, FilterConfig } from '../data/options';

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface QueryParams extends PaginationParams {
  sort?: SortConfig[];
  filters?: FilterConfig[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const SIMULATED_DELAY = 300; // ms

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function applyFilters(rows: MockRowData[], filters: FilterConfig[]): MockRowData[] {
  if (!filters.length) return rows;
  
  return rows.filter(row => {
    return filters.every(filter => {
      const value = row[filter.columnId.replace('col-', '') as keyof MockRowData];
      
      switch (filter.operator) {
        case 'contains':
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'equals':
          return value === filter.value;
        case 'gt':
          return Number(value) > Number(filter.value);
        case 'lt':
          return Number(value) < Number(filter.value);
        case 'between':
          if (Array.isArray(filter.value) && filter.value.length === 2) {
            const numValue = Number(value);
            return numValue >= filter.value[0] && numValue <= filter.value[1];
          }
          return false;
        case 'in':
          if (Array.isArray(filter.value)) {
            if (Array.isArray(value)) {
              return value.some(v => filter.value.includes(v));
            }
            return filter.value.includes(String(value));
          }
          return false;
        default:
          return true;
      }
    });
  });
}

function applySorting(rows: MockRowData[], sort: SortConfig[]): MockRowData[] {
  if (!sort.length) return rows;
  
  return [...rows].sort((a, b) => {
    for (const sortConfig of sort) {
      const field = sortConfig.columnId.replace('col-', '') as keyof MockRowData;
      const aValue = a[field];
      const bValue = b[field];
      
      let comparison = 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else if (Array.isArray(aValue) && Array.isArray(bValue)) {
        comparison = aValue.length - bValue.length;
      }
      
      if (comparison !== 0) {
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }
    }
    return 0;
  });
}

export class MockApiService {
  private allRows: MockRowData[] = [];
  
  constructor(rows: MockRowData[]) {
    this.allRows = rows;
  }
  
  async fetchRows(params: QueryParams): Promise<PaginatedResponse<MockRowData>> {
    await delay(SIMULATED_DELAY);
    
    let processedRows = [...this.allRows];
    
    // Apply filters
    if (params.filters && params.filters.length > 0) {
      processedRows = applyFilters(processedRows, params.filters);
    }
    
    // Apply sorting
    if (params.sort && params.sort.length > 0) {
      processedRows = applySorting(processedRows, params.sort);
    }
    
    // Apply pagination
    const total = processedRows.length;
    const totalPages = Math.ceil(total / params.pageSize);
    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize;
    const data = processedRows.slice(start, end);
    
    return {
      data,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages,
    };
  }
  
  async updateRow(id: string, updates: Partial<MockRowData>): Promise<MockRowData> {
    await delay(100);
    
    const index = this.allRows.findIndex(row => row.id === id);
    if (index !== -1) {
      this.allRows[index] = { ...this.allRows[index], ...updates };
      return this.allRows[index];
    }
    throw new Error(`Row ${id} not found`);
  }
  
  async deleteRow(id: string): Promise<void> {
    await delay(100);
    
    const index = this.allRows.findIndex(row => row.id === id);
    if (index !== -1) {
      this.allRows.splice(index, 1);
    }
  }
  
  async duplicateRow(id: string): Promise<MockRowData> {
    await delay(100);
    
    const row = this.allRows.find(r => r.id === id);
    if (row) {
      const newRow = { ...row, id: `row-${Date.now()}` };
      this.allRows.push(newRow);
      return newRow;
    }
    throw new Error(`Row ${id} not found`);
  }
  
  async reorderRows(sourceIds: string[], targetId: string): Promise<void> {
    await delay(200);
    
    // Implementation for row reordering
    const sourceIndices = sourceIds.map(id => this.allRows.findIndex(r => r.id === id));
    const targetIndex = this.allRows.findIndex(r => r.id === targetId);
    
    if (sourceIndices.some(i => i === -1) || targetIndex === -1) {
      throw new Error('Invalid row indices for reorder');
    }
    
    // Simple reorder logic
    const movedRows = sourceIndices.map(i => this.allRows[i]);
    const remaining = this.allRows.filter((_, i) => !sourceIndices.includes(i));
    
    remaining.splice(targetIndex, 0, ...movedRows);
    this.allRows = remaining;
  }
}