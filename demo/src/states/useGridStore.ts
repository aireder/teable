/**
 * Zustand store for Grid state management
 * Manages columns, sorting, filtering, pagination, and selection
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IGridColumn } from '@teable/grid-table-kanban';
import type { MockRowData } from '../data/makeMockRows';
import type { SortConfig, FilterConfig, ColumnVisibility } from '../data/options';
import { COLUMN_DEFINITIONS } from '../data/options';

export interface GridState {
  // Column state
  columns: IGridColumn[];
  columnVisibility: ColumnVisibility;
  freezeColumnCount: number;
  
  // Data state
  rows: MockRowData[];
  totalRows: number;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  
  // Sorting & Filtering
  sortConfig: SortConfig[];
  filterConfig: FilterConfig[];
  
  // Selection
  selectedRowIds: Set<string>;
  
  // Loading state
  isLoading: boolean;
  
  // Expanded rows
  expandedRowIds: Set<string>;
  
  // Actions
  setColumns: (columns: IGridColumn[]) => void;
  updateColumn: (columnId: string, updates: Partial<IGridColumn>) => void;
  reorderColumns: (fromIndex: number, toIndex: number) => void;
  toggleColumnVisibility: (columnId: string) => void;
  setFreezeColumnCount: (count: number) => void;
  
  setRows: (rows: MockRowData[]) => void;
  setTotalRows: (total: number) => void;
  updateRow: (rowId: string, updates: Partial<MockRowData>) => void;
  deleteRow: (rowId: string) => void;
  
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  addSort: (sort: SortConfig) => void;
  removeSort: (columnId: string) => void;
  clearSort: () => void;
  
  addFilter: (filter: FilterConfig) => void;
  removeFilter: (columnId: string) => void;
  clearFilters: () => void;
  
  setSelectedRows: (rowIds: Set<string>) => void;
  toggleRowSelection: (rowId: string) => void;
  selectAllRows: () => void;
  clearSelection: () => void;
  
  toggleRowExpansion: (rowId: string) => void;
  
  setLoading: (loading: boolean) => void;
  
  // Reset state
  resetToDefaults: () => void;
}

const initialState = {
  columns: COLUMN_DEFINITIONS,
  columnVisibility: COLUMN_DEFINITIONS.reduce((acc, col) => {
    acc[col.id!] = true;
    return acc;
  }, {} as ColumnVisibility),
  freezeColumnCount: 1,
  rows: [],
  totalRows: 0,
  currentPage: 1,
  pageSize: 100,
  sortConfig: [],
  filterConfig: [],
  selectedRowIds: new Set<string>(),
  expandedRowIds: new Set<string>(),
  isLoading: false,
};

export const useGridStore = create<GridState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Column actions
      setColumns: (columns) => set({ columns }),
      
      updateColumn: (columnId, updates) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId ? { ...col, ...updates } : col
          ),
        })),
      
      reorderColumns: (fromIndex, toIndex) =>
        set((state) => {
          const newColumns = [...state.columns];
          const [movedColumn] = newColumns.splice(fromIndex, 1);
          newColumns.splice(toIndex, 0, movedColumn);
          return { columns: newColumns };
        }),
      
      toggleColumnVisibility: (columnId) =>
        set((state) => ({
          columnVisibility: {
            ...state.columnVisibility,
            [columnId]: !state.columnVisibility[columnId],
          },
        })),
      
      setFreezeColumnCount: (count) => set({ freezeColumnCount: count }),
      
      // Row actions
      setRows: (rows) => set({ rows }),
      
      setTotalRows: (total) => set({ totalRows: total }),
      
      updateRow: (rowId, updates) =>
        set((state) => ({
          rows: state.rows.map((row) =>
            row.id === rowId ? { ...row, ...updates } : row
          ),
        })),
      
      deleteRow: (rowId) =>
        set((state) => ({
          rows: state.rows.filter((row) => row.id !== rowId),
          selectedRowIds: new Set(
            Array.from(state.selectedRowIds).filter((id) => id !== rowId)
          ),
        })),
      
      // Pagination actions
      setPage: (page) => set({ currentPage: page }),
      
      setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
      
      // Sort actions
      addSort: (sort) =>
        set((state) => {
          const existing = state.sortConfig.findIndex(
            (s) => s.columnId === sort.columnId
          );
          if (existing !== -1) {
            const newSort = [...state.sortConfig];
            newSort[existing] = sort;
            return { sortConfig: newSort };
          }
          return { sortConfig: [...state.sortConfig, sort] };
        }),
      
      removeSort: (columnId) =>
        set((state) => ({
          sortConfig: state.sortConfig.filter((s) => s.columnId !== columnId),
        })),
      
      clearSort: () => set({ sortConfig: [] }),
      
      // Filter actions
      addFilter: (filter) =>
        set((state) => {
          const existing = state.filterConfig.findIndex(
            (f) => f.columnId === filter.columnId
          );
          if (existing !== -1) {
            const newFilters = [...state.filterConfig];
            newFilters[existing] = filter;
            return { filterConfig: newFilters };
          }
          return { filterConfig: [...state.filterConfig, filter] };
        }),
      
      removeFilter: (columnId) =>
        set((state) => ({
          filterConfig: state.filterConfig.filter((f) => f.columnId !== columnId),
        })),
      
      clearFilters: () => set({ filterConfig: [] }),
      
      // Selection actions
      setSelectedRows: (rowIds) => set({ selectedRowIds: rowIds }),
      
      toggleRowSelection: (rowId) =>
        set((state) => {
          const newSelection = new Set(state.selectedRowIds);
          if (newSelection.has(rowId)) {
            newSelection.delete(rowId);
          } else {
            newSelection.add(rowId);
          }
          return { selectedRowIds: newSelection };
        }),
      
      selectAllRows: () =>
        set((state) => ({
          selectedRowIds: new Set(state.rows.map((row) => row.id)),
        })),
      
      clearSelection: () => set({ selectedRowIds: new Set() }),
      
      // Row expansion
      toggleRowExpansion: (rowId) =>
        set((state) => {
          const newExpanded = new Set(state.expandedRowIds);
          if (newExpanded.has(rowId)) {
            newExpanded.delete(rowId);
          } else {
            newExpanded.add(rowId);
          }
          return { expandedRowIds: newExpanded };
        }),
      
      // Loading
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Reset
      resetToDefaults: () => set(initialState),
    }),
    {
      name: 'grid-demo-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        columns: state.columns,
        columnVisibility: state.columnVisibility,
        freezeColumnCount: state.freezeColumnCount,
        pageSize: state.pageSize,
        sortConfig: state.sortConfig,
        filterConfig: state.filterConfig,
      }),
    }
  )
);