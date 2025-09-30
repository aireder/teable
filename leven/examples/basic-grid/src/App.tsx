import { useCallback, useMemo, useRef, useState } from 'react'
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
} from '@teable/grid-table-kanban'

// Mock data generator
const generateMockData = (count: number) => {
  const statuses = ['todo', 'in-progress', 'done']
  const priorities = ['low', 'medium', 'high']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `row-${i}`,
    name: `Task ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    rating: (i % 5) + 1,
    progress: (i * 13) % 101,
    done: i % 3 === 0,
  }))
}

function App() {
  const gridRef = useRef<IGridRef | null>(null)
  const [data, setData] = useState(() => generateMockData(100))
  
  const [columns, setColumns] = useState<IGridColumn[]>([
    { id: 'name', name: 'Task Name', width: 200, isPrimary: true, hasMenu: true },
    { id: 'email', name: 'Email', width: 220, hasMenu: true },
    { id: 'status', name: 'Status', width: 120, hasMenu: true },
    { id: 'priority', name: 'Priority', width: 120, hasMenu: true },
    { id: 'rating', name: 'Rating', width: 140, hasMenu: true },
    { id: 'progress', name: 'Progress', width: 100, hasMenu: true },
    { id: 'done', name: 'Done', width: 100, hasMenu: true },
  ])

  const [freezeColumnCount, setFreezeColumnCount] = useState(1)

  const getCellContent = useCallback((cell: ICellItem): ICell => {
    const [colIndex, rowIndex] = cell
    const column = columns[colIndex]
    const row = data[rowIndex]

    if (!row || !column) {
      return { type: CellType.Text, data: '', displayData: '' }
    }

    switch (column.id) {
      case 'name':
        return {
          type: CellType.Text,
          data: row.name,
          displayData: row.name,
        }

      case 'email':
        return {
          type: CellType.Link,
          data: [`mailto:${row.email}`],
          displayData: row.email,
        }

      case 'status':
        return {
          type: CellType.Select,
          data: [{ title: row.status.toUpperCase(), id: row.status }],
          displayData: [row.status.toUpperCase()],
          isMultiple: false,
        }

      case 'priority': {
        const colorMap = {
          low: Colors.Green,
          medium: Colors.Orange,
          high: Colors.Red,
        }
        return {
          type: CellType.Select,
          data: [{ 
            title: row.priority.toUpperCase(), 
            id: row.priority, 
            color: colorMap[row.priority as keyof typeof colorMap] 
          }],
          displayData: [row.priority.toUpperCase()],
          isMultiple: false,
        }
      }

      case 'rating':
        return {
          type: CellType.Rating,
          data: row.rating,
          icon: 'star',
          color: Colors.Amber,
          max: 5,
        }

      case 'progress':
        return {
          type: CellType.Number,
          data: row.progress,
          displayData: `${row.progress}%`,
        }

      case 'done':
        return {
          type: CellType.Boolean,
          data: row.done,
        }

      default:
        return { type: CellType.Text, data: '', displayData: '' }
    }
  }, [columns, data])

  const handleCellEdited = useCallback((cell: ICellItem, newValue: IInnerCell) => {
    const [colIndex, rowIndex] = cell
    const columnId = columns[colIndex]?.id
    
    setData(prevData => {
      const newData = [...prevData]
      const row = { ...newData[rowIndex] }
      
      switch (columnId) {
        case 'name':
          row.name = String(newValue)
          break
        case 'rating':
          row.rating = Number(newValue) || 0
          break
        case 'done':
          row.done = Boolean(newValue)
          break
        case 'progress':
          row.progress = Math.max(0, Math.min(100, Number(newValue) || 0))
          break
      }
      
      newData[rowIndex] = row
      return newData
    })
  }, [columns])

  const handleRowAppend = useCallback(() => {
    const newRow = {
      id: `row-${Date.now()}`,
      name: `New Task ${data.length + 1}`,
      email: `new${data.length + 1}@example.com`,
      status: 'todo',
      priority: 'medium',
      rating: 3,
      progress: 0,
      done: false,
    }
    setData(prev => [...prev, newRow])
  }, [data])

  const handleColumnAppend = useCallback(() => {
    const newCol: IGridColumn = {
      id: `custom-${columns.length}`,
      name: `Custom ${columns.length + 1}`,
      width: 150,
      hasMenu: true,
    }
    setColumns(prev => [...prev, newCol])
  }, [columns])

  const handleColumnResize = useCallback((column: IGridColumn, newSize: number, colIndex: number) => {
    setColumns(prev => prev.map((c, i) => i === colIndex ? { ...c, width: newSize } : c))
  }, [])

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 shadow-sm p-4">
        <h1 className="text-2xl font-bold mb-3">Grid Table - Basic Example</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleRowAppend}
          >
            Add Row
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={handleColumnAppend}
          >
            Add Column
          </button>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            onClick={() => setFreezeColumnCount(prev => (prev + 1) % (columns.length + 1))}
          >
            Freeze: {freezeColumnCount}
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            onClick={() => gridRef.current?.scrollToItem([columns.length - 1, data.length - 1])}
          >
            Scroll to End
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 min-h-0 p-4">
        <div className="h-full bg-white rounded-lg shadow-lg border border-gray-200">
          <Grid
            ref={gridRef}
            columns={columns}
            rowCount={data.length}
            freezeColumnCount={freezeColumnCount}
            draggable={DraggableType.All}
            selectable={SelectableType.All}
            rowControls={[
              { type: RowControlType.Checkbox },
              { type: RowControlType.Drag },
            ]}
            getCellContent={getCellContent}
            onCellEdited={handleCellEdited}
            onRowAppend={handleRowAppend}
            onColumnAppend={handleColumnAppend}
            onColumnResize={handleColumnResize}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  )
}

export default App