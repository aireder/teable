/**
 * Unit tests for URL persistence utilities
 */

import { describe, it, expect } from 'vitest';
import { serializeToUrl, deserializeFromUrl } from '../../src/utils/persist';

describe('URL Persistence', () => {
  it('should serialize page to URL', () => {
    const result = serializeToUrl({ page: 2 });
    expect(result).toBe('page=2');
  });
  
  it('should not include page 1 in URL', () => {
    const result = serializeToUrl({ page: 1 });
    expect(result).toBe('');
  });
  
  it('should serialize pageSize to URL', () => {
    const result = serializeToUrl({ pageSize: 50 });
    expect(result).toBe('pageSize=50');
  });
  
  it('should serialize sort config to URL', () => {
    const result = serializeToUrl({
      sort: [
        { columnId: 'col-1', direction: 'asc' },
        { columnId: 'col-2', direction: 'desc' },
      ],
    });
    
    expect(result).toContain('sort=');
    const decoded = decodeURIComponent(result);
    expect(decoded).toContain('col-1');
    expect(decoded).toContain('asc');
  });
  
  it('should serialize filters to URL', () => {
    const result = serializeToUrl({
      filters: [
        { columnId: 'col-1', type: 'text', operator: 'contains', value: 'test' },
      ],
    });
    
    expect(result).toContain('filters=');
    const decoded = decodeURIComponent(result);
    expect(decoded).toContain('col-1');
    expect(decoded).toContain('contains');
  });
  
  it('should serialize complete state', () => {
    const result = serializeToUrl({
      page: 3,
      pageSize: 100,
      sort: [{ columnId: 'col-1', direction: 'asc' }],
      filters: [{ columnId: 'col-2', type: 'number', operator: 'gt', value: 100 }],
    });
    
    expect(result).toContain('page=3');
    expect(result).toContain('pageSize=100');
    expect(result).toContain('sort=');
    expect(result).toContain('filters=');
  });
  
  it('should deserialize page from URL', () => {
    const result = deserializeFromUrl('page=5');
    expect(result.page).toBe(5);
  });
  
  it('should deserialize pageSize from URL', () => {
    const result = deserializeFromUrl('pageSize=200');
    expect(result.pageSize).toBe(200);
  });
  
  it('should deserialize sort from URL', () => {
    const sortConfig = [{ columnId: 'col-1', direction: 'asc' as const }];
    const serialized = `sort=${encodeURIComponent(JSON.stringify(sortConfig))}`;
    const result = deserializeFromUrl(serialized);
    
    expect(result.sort).toEqual(sortConfig);
  });
  
  it('should deserialize filters from URL', () => {
    const filterConfig = [
      { columnId: 'col-1', type: 'text' as const, operator: 'contains' as const, value: 'test' },
    ];
    const serialized = `filters=${encodeURIComponent(JSON.stringify(filterConfig))}`;
    const result = deserializeFromUrl(serialized);
    
    expect(result.filters).toEqual(filterConfig);
  });
  
  it('should handle invalid JSON gracefully', () => {
    const result = deserializeFromUrl('sort=invalid-json');
    expect(result.sort).toBeUndefined();
  });
  
  it('should deserialize complete URL', () => {
    const state = {
      page: 2,
      pageSize: 50,
      sort: [{ columnId: 'col-1', direction: 'desc' as const }],
      filters: [{ columnId: 'col-2', type: 'number' as const, operator: 'gt' as const, value: 100 }],
    };
    
    const serialized = serializeToUrl(state);
    const deserialized = deserializeFromUrl(serialized);
    
    expect(deserialized.page).toBe(2);
    expect(deserialized.pageSize).toBe(50);
    expect(deserialized.sort).toEqual(state.sort);
    expect(deserialized.filters).toEqual(state.filters);
  });
});