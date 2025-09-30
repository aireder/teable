import { useMemo, useRef, useState } from 'react'
import './App.css'
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
  type IGroupPoint,
  LinearRowType,
} from '../../packages/grid-table-kanban/src'

function App() {
  const gridRef = useRef<IGridRef | null>(null)

  const [columns, setColumns] = useState<IGridColumn[]>([
    { id: 'name', name: 'Name', width: 180, isPrimary: true },
    { id: 'email', name: 'Email', width: 240 },
    { id: 'status', name: 'Status', width: 140 },
    { id: 'rating', name: 'Rating', width: 160 },
    { id: 'assignees', name: 'Assignees', width: 200 },
    { id: 'done', name: 'Done', width: 120 },
  ])

  const [rowCount, setRowCount] = useState<number>(50)
  const [freeze, setFreeze] = useState<number>(1)
  const [selectable, setSelectable] = useState<SelectableType>(SelectableType.All)
  const [draggable, setDraggable] = useState<DraggableType>(DraggableType.All)
  const [collapsed, setCollapsed] = useState<Set<string> | null>(null)

  const groupPoints = useMemo<IGroupPoint[] | null>(() => {
    // 构造一个简单分组示例：按每 20 行分一组
    const points: IGroupPoint[] = []
    for (let g = 0; g < 5; g++) {
      points.push({ id: `group-${g}`, type: LinearRowType.Group, depth: 0, value: `Group ${g}` })
      points.push({ type: LinearRowType.Row, count: 20 })
    }
    return points
  }, [])

  const getCellContent = (cell: ICellItem): ICell => {
    const [col, row] = cell
    const columnId = columns[col]?.id
    switch (columnId) {
      case 'name':
        return { type: CellType.Text, data: `User ${row}`, displayData: `User ${row}` }
      case 'email':
        return {
          type: CellType.Link,
          data: [`mailto:user${row}@example.com`],
          displayData: `user${row}@example.com`,
        }
      case 'status': {
        const choices = ['Todo', 'Doing', 'Done']
        const value = choices[row % choices.length]
        return {
          type: CellType.Select,
          data: [{ title: value, id: value.toLowerCase() }],
          displayData: [value],
          isMultiple: false,
        }
      }
      case 'rating': {
        const score = (row % 5) + 1
        return {
          type: CellType.Rating,
          data: score,
          icon: 'star',
          color: '#f59e0b',
          max: 5,
        }
      }
      case 'assignees':
        return {
          type: CellType.User,
          data: [
            { id: `u-${row}-1`, name: `Alice ${row}` },
            { id: `u-${row}-2`, name: `Bob ${row}` },
          ],
        }
      case 'done':
        return { type: CellType.Boolean, data: row % 3 === 0 }
      default:
        return { type: CellType.Text, data: '', displayData: '' }
    }
  }

  const handleCellEdited = (_cell: ICellItem, _newValue: IInnerCell) => {
    // 在真实应用中，这里更新外部数据源。
    // demo 中仅控制台打印以验证编辑回调
    // console.log('onCellEdited', cell, newValue)
  }

  const handleRowAppend = () => setRowCount((c) => c + 1)
  const handleColumnAppend = () =>
    setColumns((cols) => [
      ...cols,
      { id: `col-${cols.length + 1}`, name: `Col ${cols.length + 1}`, width: 160 },
    ])

  const handleColumnResize = (_column: IGridColumn, newSize: number, colIndex: number) => {
    setColumns((cols) => cols.map((c, i) => (i === colIndex ? { ...c, width: newSize } : c)))
  }

  const handleRowOrdered = (_dragRows: number[], _dropRow: number) => {
    // 外部重排数据。此处仅打印验证
    // console.log('onRowOrdered', dragRows, dropRow)
  }

  const handleColumnOrdered = (dragCols: number[], dropCol: number) => {
    setColumns((cols) => {
      const moved = [...cols]
      const items = dragCols.sort((a, b) => a - b).map((idx) => moved[idx])
      // 先移除，再在 drop 位置插入
      for (let i = dragCols.length - 1; i >= 0; i--) moved.splice(dragCols[i], 1)
      moved.splice(dropCol, 0, ...items)
      return moved
    })
  }

  const toolbar = (
    <div className="flex gap-2 p-4 border-b border-gray-200 bg-gray-50">
      <button 
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={() => setFreeze((f) => (f + 1) % Math.max(1, columns.length))}
      >
        切换冻结列
      </button>
      <button 
        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        onClick={() => setSelectable((s: SelectableType) => (s === SelectableType.All ? SelectableType.Cell : SelectableType.All))}
      >
        切换选择模式
      </button>
      <button 
        className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        onClick={() => setDraggable((d: DraggableType) => (d === DraggableType.All ? DraggableType.None : DraggableType.All))}
      >
        切换拖拽
      </button>
      <button 
        className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        onClick={handleRowAppend}
      >
        追加行
      </button>
      <button 
        className="px-3 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
        onClick={handleColumnAppend}
      >
        追加列
      </button>
      <button 
        className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
        onClick={() => gridRef.current?.scrollToItem([columns.length - 1, rowCount - 1])}
      >
        滚动到末尾
      </button>
      <button 
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        onClick={() => gridRef.current?.resetState()}
      >
        重置内部状态
      </button>
    </div>
  )

  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      {toolbar}
      <div className="flex-1 min-h-0">
        <Grid
          ref={gridRef}
          columns={columns}
          rowCount={rowCount}
          freezeColumnCount={freeze}
          draggable={draggable}
          selectable={selectable}
          groupPoints={groupPoints}
          collapsedGroupIds={collapsed}
          onCollapsedGroupChanged={setCollapsed}
          getCellContent={getCellContent}
          onCellEdited={handleCellEdited}
          onRowAppend={handleRowAppend}
          onColumnAppend={handleColumnAppend}
          onRowOrdered={handleRowOrdered}
          onColumnOrdered={handleColumnOrdered}
          onColumnResize={handleColumnResize}
          onSelectionChanged={() => {}}
          onScrollChanged={() => {}}
          scrollBarVisible={true}
          smoothScrollX={true}
          smoothScrollY={true}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  )
}

export default App
