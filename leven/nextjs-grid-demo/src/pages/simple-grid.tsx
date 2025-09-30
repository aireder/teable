import { useCallback, useRef, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Grid,
  type IGridRef,
  type IGridColumn,
  type ICell,
  type ICellItem,
  type IInnerCell,
  CellType,
  DraggableType,
  SelectableType,
  RowControlType,
  Colors,
} from '@teable/grid-table-kanban';

// Simple mock data
const generateData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `row-${i}`,
    name: `Task ${i + 1}`,
    status: ['todo', 'in-progress', 'done'][i % 3],
    priority: ['low', 'medium', 'high'][i % 3],
    rating: (i % 5) + 1,
  }));
};

export default function SimpleGrid() {
  const gridRef = useRef<IGridRef | null>(null);
  const [data, setData] = useState(() => generateData(50));
  
  const [columns, setColumns] = useState<IGridColumn[]>([
    { id: 'name', name: 'Task Name', width: 200, isPrimary: true, hasMenu: true },
    { id: 'status', name: 'Status', width: 120, hasMenu: true },
    { id: 'priority', name: 'Priority', width: 120, hasMenu: true },
    { id: 'rating', name: 'Rating', width: 140, hasMenu: true },
  ]);

  const getCellContent = useCallback((cell: ICellItem): ICell => {
    const [colIndex, rowIndex] = cell;
    const column = columns[colIndex];
    const row = data[rowIndex];

    if (!row || !column) {
      return { type: CellType.Text, data: '', displayData: '' };
    }

    switch (column.id) {
      case 'name':
        return {
          type: CellType.Text,
          data: row.name,
          displayData: row.name,
        };

      case 'status': {
        const colorMap: Record<string, string> = {
          'todo': Colors.Gray,
          'in-progress': Colors.Blue,
          'done': Colors.Green,
        };
        return {
          type: CellType.Select,
          data: [{ title: row.status.toUpperCase(), id: row.status }],
          displayData: [row.status.toUpperCase()],
          isMultiple: false,
          choiceMap: {
            [row.status]: {
              id: row.status,
              name: row.status.toUpperCase(),
              color: colorMap[row.status] || Colors.Gray,
            }
          }
        };
      }

      case 'priority': {
        const colorMap: Record<string, string> = {
          'low': Colors.Green,
          'medium': Colors.Orange,
          'high': Colors.Red,
        };
        return {
          type: CellType.Select,
          data: [{ title: row.priority.toUpperCase(), id: row.priority }],
          displayData: [row.priority.toUpperCase()],
          isMultiple: false,
          choiceMap: {
            [row.priority]: {
              id: row.priority,
              name: row.priority.toUpperCase(),
              color: colorMap[row.priority] || Colors.Gray,
            }
          }
        };
      }

      case 'rating':
        return {
          type: CellType.Rating,
          data: row.rating,
          icon: 'star',
          color: Colors.Amber,
          max: 5,
        };

      default:
        return { type: CellType.Text, data: '', displayData: '' };
    }
  }, [columns, data]);

  const handleCellEdited = useCallback((cell: ICellItem, newValue: IInnerCell) => {
    const [colIndex, rowIndex] = cell;
    const columnId = columns[colIndex]?.id;
    
    setData(prevData => {
      const newData = [...prevData];
      const row = { ...newData[rowIndex] };
      
      if (columnId === 'name') {
        row.name = String(newValue);
      } else if (columnId === 'rating') {
        row.rating = Number(newValue) || 0;
      }
      
      newData[rowIndex] = row;
      return newData;
    });
  }, [columns]);

  const handleColumnResize = useCallback((column: IGridColumn, newSize: number, colIndex: number) => {
    setColumns(prev => prev.map((c, i) => i === colIndex ? { ...c, width: newSize } : c));
  }, []);

  return (
    <>
      <Head>
        <title>Simple Grid Demo</title>
      </Head>
      <div className="h-screen w-screen flex flex-col bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold">Simple Grid Demo</h1>
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
          <p className="text-gray-600">
            A simple demonstration of the Grid component from @teable/grid-table-kanban
          </p>
        </div>

        {/* Grid Container */}
        <div className="flex-1 min-h-0 p-4">
          <div className="h-full bg-white rounded-lg shadow-lg border border-gray-200">
            <Grid
              ref={gridRef}
              columns={columns}
              rowCount={data.length}
              freezeColumnCount={1}
              draggable={DraggableType.Column}
              selectable={SelectableType.All}
              rowControls={[
                { type: RowControlType.Checkbox },
                { type: RowControlType.Expand },
              ]}
              getCellContent={getCellContent}
              onCellEdited={handleCellEdited}
              onColumnResize={handleColumnResize}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}