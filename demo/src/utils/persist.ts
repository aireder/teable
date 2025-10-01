/**
 * Utilities for state persistence and URL synchronization
 */

import type { SortConfig, FilterConfig } from '../data/options';

interface UrlState {
  page?: number;
  pageSize?: number;
  sort?: SortConfig[];
  filters?: FilterConfig[];
}

export function serializeToUrl(state: UrlState): string {
  const params = new URLSearchParams();
  
  if (state.page && state.page > 1) {
    params.set('page', state.page.toString());
  }
  
  if (state.pageSize) {
    params.set('pageSize', state.pageSize.toString());
  }
  
  if (state.sort && state.sort.length > 0) {
    params.set('sort', JSON.stringify(state.sort));
  }
  
  if (state.filters && state.filters.length > 0) {
    params.set('filters', JSON.stringify(state.filters));
  }
  
  return params.toString();
}

export function deserializeFromUrl(search: string): UrlState {
  const params = new URLSearchParams(search);
  const state: UrlState = {};
  
  const page = params.get('page');
  if (page) {
    state.page = parseInt(page, 10);
  }
  
  const pageSize = params.get('pageSize');
  if (pageSize) {
    state.pageSize = parseInt(pageSize, 10);
  }
  
  const sort = params.get('sort');
  if (sort) {
    try {
      state.sort = JSON.parse(sort);
    } catch (e) {
      console.error('Failed to parse sort from URL:', e);
    }
  }
  
  const filters = params.get('filters');
  if (filters) {
    try {
      state.filters = JSON.parse(filters);
    } catch (e) {
      console.error('Failed to parse filters from URL:', e);
    }
  }
  
  return state;
}

export function updateUrlState(state: UrlState): void {
  const serialized = serializeToUrl(state);
  const newUrl = serialized ? `${window.location.pathname}?${serialized}` : window.location.pathname;
  window.history.pushState({}, '', newUrl);
}