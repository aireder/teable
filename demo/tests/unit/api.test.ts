/**
 * Unit tests for API service
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockApiService } from '../../src/services/api';
import { generateMockRows } from '../../src/data/makeMockRows';

describe('Mock API Service', () => {
  let apiService: MockApiService;
  let mockRows: ReturnType<typeof generateMockRows>;
  
  beforeEach(() => {
    mockRows = generateMockRows(100);
    apiService = new MockApiService(mockRows);
  });
  
  describe('Pagination', () => {
    it('should fetch first page correctly', async () => {
      const result = await apiService.fetchRows({
        page: 1,
        pageSize: 10,
      });
      
      expect(result.data).toHaveLength(10);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.total).toBe(100);
      expect(result.totalPages).toBe(10);
    });
    
    it('should fetch last page correctly', async () => {
      const result = await apiService.fetchRows({
        page: 10,
        pageSize: 10,
      });
      
      expect(result.data).toHaveLength(10);
      expect(result.page).toBe(10);
    });
    
    it('should handle partial last page', async () => {
      const result = await apiService.fetchRows({
        page: 4,
        pageSize: 30,
      });
      
      expect(result.data).toHaveLength(10); // 100 - (3 * 30) = 10
    });
  });
  
  describe('Sorting', () => {
    it('should sort by number ascending', async () => {
      const result = await apiService.fetchRows({
        page: 1,
        pageSize: 100,
        sort: [{ columnId: 'col-number', direction: 'asc' }],
      });
      
      const numbers = result.data.map(r => r.number);
      const sorted = [...numbers].sort((a, b) => a - b);
      
      expect(numbers).toEqual(sorted);
    });
    
    it('should sort by number descending', async () => {
      const result = await apiService.fetchRows({
        page: 1,
        pageSize: 100,
        sort: [{ columnId: 'col-number', direction: 'desc' }],
      });
      
      const numbers = result.data.map(r => r.number);
      const sorted = [...numbers].sort((a, b) => b - a);
      
      expect(numbers).toEqual(sorted);
    });
    
    it('should sort by text ascending', async () => {
      const result = await apiService.fetchRows({
        page: 1,
        pageSize: 100,
        sort: [{ columnId: 'col-text', direction: 'asc' }],
      });
      
      const texts = result.data.map(r => r.text);
      const sorted = [...texts].sort((a, b) => a.localeCompare(b));
      
      expect(texts).toEqual(sorted);
    });
    
    it('should handle multi-column sort', async () => {
      const result = await apiService.fetchRows({
        page: 1,
        pageSize: 100,
        sort: [
          { columnId: 'col-status', direction: 'asc' },
          { columnId: 'col-number', direction: 'desc' },
        ],
      });
      
      expect(result.data).toHaveLength(100);
    });
  });
  
  describe('Filtering', () => {
    it('should filter by text contains', async () => {
      const result = await apiService.fetchRows({
        page: 1,
        pageSize: 100,
        filters: [
          { columnId: 'col-text', type: 'text', operator: 'contains', value: 'Task 1' },
        ],
      });
      
      result.data.forEach(row => {
        expect(row.text).toContain('Task 1');
      });
    });
    
    it('should filter by number greater than', async () => {
      const result = await apiService.fetchRows({
        page: 1,
        pageSize: 100,
        filters: [
          { columnId: 'col-number', type: 'number', operator: 'gt', value: 5000 },
        ],
      });
      
      result.data.forEach(row => {
        expect(row.number).toBeGreaterThan(5000);
      });
    });
    
    it('should filter by select value in array', async () => {
      const result = await apiService.fetchRows({
        page: 1,
        pageSize: 100,
        filters: [
          {
            columnId: 'col-status',
            type: 'select',
            operator: 'in',
            value: ['Done', 'In Progress'],
          },
        ],
      });
      
      result.data.forEach(row => {
        expect(['Done', 'In Progress']).toContain(row.select);
      });
    });
  });
  
  describe('Row Operations', () => {
    it('should update row', async () => {
      const row = mockRows[0];
      const updated = await apiService.updateRow(row.id, { text: 'Updated Task' });
      
      expect(updated.text).toBe('Updated Task');
      expect(updated.id).toBe(row.id);
    });
    
    it('should delete row', async () => {
      const row = mockRows[0];
      await apiService.deleteRow(row.id);
      
      const result = await apiService.fetchRows({ page: 1, pageSize: 100 });
      expect(result.total).toBe(99);
    });
    
    it('should duplicate row', async () => {
      const row = mockRows[0];
      const duplicated = await apiService.duplicateRow(row.id);
      
      expect(duplicated.text).toBe(row.text);
      expect(duplicated.id).not.toBe(row.id);
    });
  });
});