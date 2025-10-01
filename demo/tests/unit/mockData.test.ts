/**
 * Unit tests for mock data generator
 */

import { describe, it, expect } from 'vitest';
import { generateMockRows, mockRowToCells } from '../../src/data/makeMockRows';
import { CellType } from '@teable/grid-table-kanban';

describe('Mock Data Generator', () => {
  it('should generate specified number of rows', () => {
    const rows = generateMockRows(100);
    expect(rows).toHaveLength(100);
  });
  
  it('should generate rows with all required fields', () => {
    const rows = generateMockRows(1);
    const row = rows[0];
    
    expect(row).toHaveProperty('id');
    expect(row).toHaveProperty('text');
    expect(row).toHaveProperty('number');
    expect(row).toHaveProperty('select');
    expect(row).toHaveProperty('multiSelect');
    expect(row).toHaveProperty('date');
    expect(row).toHaveProperty('boolean');
    expect(row).toHaveProperty('rating');
    expect(row).toHaveProperty('relation');
    expect(row).toHaveProperty('link');
    expect(row).toHaveProperty('email');
  });
  
  it('should generate unique IDs', () => {
    const rows = generateMockRows(100);
    const ids = rows.map(r => r.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(100);
  });
  
  it('should convert row to text cell correctly', () => {
    const rows = generateMockRows(1);
    const cell = mockRowToCells(rows[0], 0);
    
    expect(cell.type).toBe(CellType.Text);
    expect(cell).toHaveProperty('data');
    expect(cell).toHaveProperty('displayData');
  });
  
  it('should convert row to number cell correctly', () => {
    const rows = generateMockRows(1);
    const cell = mockRowToCells(rows[0], 1);
    
    expect(cell.type).toBe(CellType.Number);
    expect(typeof (cell as any).data).toBe('number');
  });
  
  it('should convert row to select cell correctly', () => {
    const rows = generateMockRows(1);
    const cell = mockRowToCells(rows[0], 2);
    
    expect(cell.type).toBe(CellType.Select);
    expect((cell as any).isMultiple).toBe(false);
  });
  
  it('should convert row to multi-select cell correctly', () => {
    const rows = generateMockRows(1);
    const cell = mockRowToCells(rows[0], 3);
    
    expect(cell.type).toBe(CellType.Select);
    expect((cell as any).isMultiple).toBe(true);
    expect(Array.isArray((cell as any).data)).toBe(true);
  });
  
  it('should convert row to boolean cell correctly', () => {
    const rows = generateMockRows(1);
    const cell = mockRowToCells(rows[0], 5);
    
    expect(cell.type).toBe(CellType.Boolean);
    expect(typeof (cell as any).data).toBe('boolean');
  });
  
  it('should convert row to rating cell correctly', () => {
    const rows = generateMockRows(1);
    const cell = mockRowToCells(rows[0], 6);
    
    expect(cell.type).toBe(CellType.Rating);
    expect((cell as any).max).toBe(5);
    expect((cell as any).data).toBeGreaterThanOrEqual(0);
    expect((cell as any).data).toBeLessThanOrEqual(5);
  });
});