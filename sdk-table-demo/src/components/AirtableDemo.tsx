import { useMemo, useRef } from 'react'
import type { IGridRef, IGridColumn, ICellItem, ICell } from '@teable/sdk'
import { Grid, CellType } from '@teable/sdk'

// 模拟数据
const mockData = {
  columns: [
    { id: 'title', name: '标题', width: 200 },
    { id: 'count', name: '计数', width: 120 },
    { id: 'status', name: '状态', width: 150 },
  ],
  rows: Array.from({ length: 20 }, (_, i) => ({
    id: `row-${i}`,
    title: `任务 ${i + 1}`,
    count: Math.floor(Math.random() * 100),
    status: ['进行中', '已完成', '待处理'][i % 3],
  })),
}

export function AirtableDemo() {
  const gridRef = useRef<IGridRef>(null)

  // 准备列数据
  const columns: IGridColumn[] = useMemo(() => {
    return mockData.columns.map((col) => ({
      id: col.id,
      name: col.name,
      width: col.width,
    }))
  }, [])

  // 准备单元格内容获取函数
  const getCellContent = (cell: ICellItem): ICell => {
    const [colIndex, rowIndex] = cell
    const column = mockData.columns[colIndex]
    const row = mockData.rows[rowIndex]

    if (!row || !column) {
      return {
        type: CellType.Text,
        data: '',
      }
    }

    const value = row[column.id as keyof typeof row]

    // 根据列类型返回不同的单元格类型
    if (column.id === 'count') {
      return {
        type: CellType.Number,
        data: value?.toString() || '0',
      }
    }

    return {
      type: CellType.Text,
      data: value?.toString() || '',
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-700">数据表格</h2>
      </div>
      <div className="h-[600px]">
        <Grid
          ref={gridRef}
          columns={columns}
          rowCount={mockData.rows.length}
          getCellContent={getCellContent}
          rowHeight={40}
          columnHeaderHeight={40}
        />
      </div>
    </div>
  )
}
