/**
 * Main Grid Demo Application Component
 * Integrates all Grid features with state management
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Grid, type IGridRef, type ICellItem, type ICell, type CombinedSelection } from '@teable/grid-table-kanban';
import { useGridStore } from '../states/useGridStore';
import { generateMockRows, mockRowToCells } from '../data/makeMockRows';
import { MockApiService } from '../services/api';
import { GridToolbar } from './GridToolbar';
import { ColumnConfigurator } from './ColumnConfigurator';
import { FPSMonitor } from './FPSMonitor';
import { updateUrlState, deserializeFromUrl } from '../utils/persist';
import { announceToScreenReader } from '../utils/a11y';

// Initialize mock data and API service
const mockRows = generateMockRows(1500);
const apiService = new MockApiService(mockRows);

export function GridDemoApp() {
  const gridRef = useRef<IGridRef>(null);
  
  const {
    columns,
    columnVisibility,
    freezeColumnCount,
    rows,
    currentPage,
    pageSize,
    sortConfig,
    filterConfig,
    expandedRowIds,
    setRows,
    setTotalRows,
    setPage,
    setPageSize,
    addSort,
    addFilter,
    setLoading,
    toggleRowExpansion,
    updateRow,
  } = useGridStore();
  
  // Filter visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter(col => columnVisibility[col.id!] !== false);
  }, [columns, columnVisibility]);
  
  // Fetch data when pagination, sort, or filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await apiService.fetchRows({
          page: currentPage,
          pageSize,
          sort: sortConfig,
          filters: filterConfig,
        });
        
        setRows(result.data);
        setTotalRows(result.total);
        
        // Update URL with current state
        updateUrlState({
          page: currentPage,
          pageSize,
          sort: sortConfig,
          filters: filterConfig,
        });
        
        announceToScreenReader(
          `Loaded ${result.data.length} rows, page ${currentPage} of ${result.totalPages}`
        );
      } catch (error) {
        console.error('Failed to fetch rows:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentPage, pageSize, sortConfig, filterConfig, setRows, setTotalRows, setLoading]);
  
  // Initialize from URL on mount
  useEffect(() => {
    const urlState = deserializeFromUrl(window.location.search);
    
    if (urlState.page) setPage(urlState.page);
    if (urlState.pageSize) setPageSize(urlState.pageSize);
    if (urlState.sort) {
      urlState.sort.forEach(s => addSort(s));
    }
    if (urlState.filters) {
      urlState.filters.forEach(f => addFilter(f));
    }
  }, []);
  
  // Get cell content
  const getCellContent = useCallback((cell: ICellItem): ICell => {
    const [columnIndex, rowIndex] = cell;
    const row = rows[rowIndex];
    
    if (!row) {
      return {
        type: 'Loading' as const,
      };
    }
    
    return mockRowToCells(row, columnIndex);
  }, [rows]);
  
  // Handle cell edit
  const handleCellEdited = useCallback((cell: ICellItem, newValue: ICell) => {
    const [columnIndex, rowIndex] = cell;
    const row = rows[rowIndex];
    
    if (!row) return;
    
    // Map column index to field name
    const fieldMap: Record<number, keyof typeof row> = {
      0: 'text',
      1: 'number',
      2: 'select',
      3: 'multiSelect',
      4: 'date',
      5: 'boolean',
      6: 'rating',
      7: 'relation',
      8: 'link',
      9: 'email',
    };
    
    const field = fieldMap[columnIndex];
    if (field && 'data' in newValue) {
      updateRow(row.id, { [field]: newValue.data });
      announceToScreenReader(`Updated ${field} for row ${rowIndex + 1}`);
    }
  }, [rows, updateRow]);
  
  // Handle column resize
  const handleColumnResize = useCallback((column: unknown, newSize: number, colIndex: number) => {
    const col = visibleColumns[colIndex];
    if (col?.id) {
      useGridStore.getState().updateColumn(col.id, { width: newSize });
      announceToScreenReader(`Resized ${col.name} to ${newSize} pixels`);
    }
  }, [visibleColumns]);
  
  // Handle column freeze
  const handleColumnFreeze = useCallback((count: number) => {
    useGridStore.getState().setFreezeColumnCount(count);
    announceToScreenReader(`Froze ${count} columns`);
  }, []);
  
  // Handle row expansion
  const handleRowExpand = useCallback((rowIndex: number) => {
    const row = rows[rowIndex];
    if (row) {
      toggleRowExpansion(row.id);
      announceToScreenReader(`${expandedRowIds.has(row.id) ? 'Collapsed' : 'Expanded'} row ${rowIndex + 1}`);
    }
  }, [rows, toggleRowExpansion, expandedRowIds]);
  
  // Handle selection change
  const handleSelectionChanged = useCallback((selection: CombinedSelection) => {
    const { type } = selection;
    
    if (type === 'Rows') {
      const rowCount = selection.ranges.length;
      announceToScreenReader(`Selected ${rowCount} rows`);
    } else if (type === 'Cells') {
      announceToScreenReader('Cell selection changed');
    }
  }, []);
  
  // Handle copy
  const handleCopy = useCallback((selection: CombinedSelection, e: React.ClipboardEvent) => {
    // Implement copy logic
    console.log('Copy:', selection);
    announceToScreenReader('Copied to clipboard');
  }, []);
  
  // Handle paste
  const handlePaste = useCallback((selection: CombinedSelection, e: React.ClipboardEvent) => {
    // Implement paste logic
    const pastedText = e.clipboardData.getData('text');
    console.log('Paste:', pastedText);
    announceToScreenReader('Pasted from clipboard');
  }, []);
  
  // Handle delete
  const handleDelete = useCallback((selection: CombinedSelection) => {
    // Implement delete logic
    console.log('Delete:', selection);
    announceToScreenReader('Deleted selection');
  }, []);
  
  // Handle column header click (for sorting)
  const handleColumnHeaderClick = useCallback((colIndex: number) => {
    const column = visibleColumns[colIndex];
    if (!column?.id) return;
    
    const existingSort = sortConfig.find(s => s.columnId === column.id);
    const newDirection = existingSort?.direction === 'asc' ? 'desc' : 'asc';
    
    addSort({
      columnId: column.id,
      direction: newDirection,
    });
    
    announceToScreenReader(`Sorted ${column.name} ${newDirection}ending`);
  }, [visibleColumns, sortConfig, addSort]);
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Grid Component Demo</h1>
            <p className="text-blue-100 mt-1">
              Full-featured Grid with 1500+ rows • Virtual Scrolling • Sorting • Filtering
            </p>
          </div>
          <ColumnConfigurator />
        </div>
      </div>
      
      {/* Toolbar */}
      <GridToolbar />
      
      {/* Grid Container */}
      <div className="flex-1 overflow-hidden">
        <Grid
          ref={gridRef}
          columns={visibleColumns}
          rowCount={rows.length}
          freezeColumnCount={freezeColumnCount}
          getCellContent={getCellContent}
          onCellEdited={handleCellEdited}
          onColumnResize={handleColumnResize}
          onColumnFreeze={handleColumnFreeze}
          onRowExpand={handleRowExpand}
          onSelectionChanged={handleSelectionChanged}
          onCopy={handleCopy}
          onPaste={handlePaste}
          onDelete={handleDelete}
          onColumnHeaderClick={handleColumnHeaderClick}
          smoothScrollX={true}
          smoothScrollY={true}
          isMultiSelectionEnable={true}
          draggable="all"
          selectable="all"
        />
      </div>
      
      {/* FPS Monitor */}
      <FPSMonitor />
      
      {/* Status Bar */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>Visible Columns: {visibleColumns.length}/{columns.length}</span>
          <span>•</span>
          <span>Rows: {rows.length}</span>
          <span>•</span>
          <span>Frozen: {freezeColumnCount}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Expanded: {expandedRowIds.size}</span>
          <span>•</span>
          <span className="font-mono">Keyboard: Arrow keys, Tab, Shift, Enter, Esc</span>
        </div>
      </div>
    </div>
  );
}