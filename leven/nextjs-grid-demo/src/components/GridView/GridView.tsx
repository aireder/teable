import { useCallback, useRef, useMemo, useState } from 'react';
import {
  Grid,
  type IGridRef,
  type IGridColumn,
  type ICell,
  type ICellItem,
  type CombinedSelection,
  type IRectangle,
  CellType,
  DraggableType,
  SelectableType,
  RowControlType,
  Colors,
} from '@teable/grid-table-kanban';
import type { ShareViewData } from '@/lib/mockData';

export interface GridViewProps {
  shareViewData: ShareViewData;
}

const ROW_HEIGHT_DEFINITIONS: Record<number, number> = {
  0: 32, // Short
  1: 48, // Medium
  2: 64, // Tall
  3: 96, // Extra Tall
};

const FIELD_NAME_HEIGHT_DEFINITIONS: Record<number, number> = {
  1: 32,
  2: 64,
  3: 96,
};

export const GridView = ({ shareViewData }: GridViewProps) => {
  const { view, fields, records, shareMeta } = shareViewData;
  const gridRef = useRef<IGridRef>(null);
  const [selection, setSelection] = useState<CombinedSelection | null>(null);

  const rowHeight = ROW_HEIGHT_DEFINITIONS[view?.options?.rowHeight ?? 0];
  const columnHeaderHeight = FIELD_NAME_HEIGHT_DEFINITIONS[view?.options?.fieldNameDisplayLines ?? 1];
  
  // Convert fields to grid columns
  const columns = useMemo<IGridColumn[]>(() => {
    return fields.map((field, index) => ({
      id: field.id,
      name: field.name,
      width: field.width ?? 150,
      isPrimary: index === 0,
      hasMenu: true,
    }));
  }, [fields]);

  // Create a record map for quick access
  const recordMap = useMemo(() => {
    const map: Record<number, typeof records[0]> = {};
    records.forEach((record, index) => {
      map[index] = record;
    });
    return map;
  }, [records]);

  const getCellContent = useCallback<(cell: ICellItem) => ICell>(
    (cell) => {
      const [colIndex, rowIndex] = cell;
      const record = recordMap[rowIndex];
      const field = fields[colIndex];

      if (!record || !field) {
        return { type: CellType.Loading };
      }

      switch (field.id) {
        case 'fld-name':
          return {
            type: CellType.Text,
            data: record.name,
            displayData: record.name,
          };

        case 'fld-email':
          return {
            type: CellType.Link,
            data: [`mailto:${record.email}`],
            displayData: record.email,
          };

        case 'fld-status': {
          const colorMap: Record<string, string> = {
            'todo': Colors.Gray,
            'in-progress': Colors.Blue,
            'review': Colors.Orange,
            'done': Colors.Green,
          };
          return {
            type: CellType.Select,
            data: [{
              title: record.status.toUpperCase(),
              id: record.status,
            }],
            displayData: [record.status.toUpperCase()],
            isMultiple: false,
            choiceMap: {
              [record.status]: {
                id: record.status,
                name: record.status.toUpperCase(),
                color: colorMap[record.status] || Colors.Gray,
              }
            }
          };
        }

        case 'fld-priority': {
          const colorMap: Record<string, string> = {
            'low': Colors.Green,
            'medium': Colors.Orange,
            'high': Colors.Red,
            'urgent': Colors.Purple,
          };
          return {
            type: CellType.Select,
            data: [{
              title: record.priority.toUpperCase(),
              id: record.priority,
            }],
            displayData: [record.priority.toUpperCase()],
            isMultiple: false,
            choiceMap: {
              [record.priority]: {
                id: record.priority,
                name: record.priority.toUpperCase(),
                color: colorMap[record.priority] || Colors.Gray,
              }
            }
          };
        }

        case 'fld-rating':
          return {
            type: CellType.Rating,
            data: record.rating,
            icon: 'star',
            color: Colors.Amber,
            max: 5,
          };

        case 'fld-progress':
          return {
            type: CellType.Number,
            data: record.progress,
            displayData: `${record.progress}%`,
          };

        case 'fld-done':
          return {
            type: CellType.Boolean,
            data: record.done,
          };

        case 'fld-created':
          return {
            type: CellType.Text,
            data: new Date(record.createdAt).toLocaleDateString(),
            displayData: new Date(record.createdAt).toLocaleDateString(),
          };

        default:
          return {
            type: CellType.Text,
            data: '',
            displayData: '',
          };
      }
    },
    [recordMap, fields]
  );

  const onSelectionChanged = useCallback((newSelection: CombinedSelection) => {
    setSelection(newSelection);
  }, []);

  const onCopy = useCallback(
    async (selection: CombinedSelection) => {
      if (!shareMeta?.allowCopy) {
        alert("Sorry, copying is disabled for this view");
        return;
      }
      console.log('Copy selection:', selection);
    },
    [shareMeta]
  );

  const onColumnResize = useCallback((column: IGridColumn, newSize: number, colIndex: number) => {
    console.log('Column resized:', column.name, newSize);
  }, []);

  const onColumnFreeze = useCallback((count: number) => {
    console.log('Freeze column count:', count);
  }, []);

  const onColumnOrdered = useCallback((dragColIndexCollection: number[], dropColIndex: number) => {
    console.log('Column ordered:', dragColIndexCollection, '->', dropColIndex);
  }, []);

  const rowControls = useMemo(
    () => [
      {
        type: RowControlType.Checkbox,
        icon: RowControlType.Checkbox,
      },
      {
        type: RowControlType.Expand,
        icon: RowControlType.Expand,
      },
    ],
    []
  );

  const onRowExpand = useCallback((rowIndex: number) => {
    const record = recordMap[rowIndex];
    console.log('Expand record:', record);
  }, [recordMap]);

  return (
    <div className="relative size-full overflow-hidden">
      <Grid
        ref={gridRef}
        draggable={DraggableType.Column}
        rowCount={records.length}
        rowHeight={rowHeight}
        columnHeaderHeight={columnHeaderHeight}
        freezeColumnCount={view?.options?.frozenColumnCount ?? 1}
        columns={columns}
        rowControls={rowControls}
        style={{
          width: '100%',
          height: '100%',
        }}
        getCellContent={getCellContent}
        onSelectionChanged={onSelectionChanged}
        onCopy={onCopy}
        onRowExpand={onRowExpand}
        onColumnResize={onColumnResize}
        onColumnFreeze={onColumnFreeze}
        onColumnOrdered={onColumnOrdered}
      />
      {selection && (
        <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded shadow text-sm">
          {records.length} rows
        </div>
      )}
    </div>
  );
};