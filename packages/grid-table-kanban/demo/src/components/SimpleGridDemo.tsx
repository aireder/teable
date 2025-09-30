import React, { useEffect, useMemo, useRef, useState } from 'react';

// 轻量版 Demo：实现列宽调整、列拖拽排序、基础编辑，便于本地直接运行体验
// 说明：这是纯前端实现，用来在 demo 中展示完整交互；实际产品中请使用包内 Canvas Grid 组件

type Column = { key: string; title: string; width: number; minWidth?: number };

type Row = (string | number | boolean)[];

const initialColumns: Column[] = [
  { key: 'name', title: '姓名', width: 160, minWidth: 80 },
  { key: 'email', title: '邮箱', width: 240, minWidth: 120 },
  { key: 'dept', title: '部门', width: 140, minWidth: 100 },
  { key: 'active', title: '在职', width: 100, minWidth: 80 },
  { key: 'rating', title: '评分', width: 140, minWidth: 120 },
  { key: 'status', title: '状态', width: 120, minWidth: 100 },
];

const initialData: Row[] = [
  ['张三', 'zhangsan@company.com', '技术部', true, 5, '活跃'],
  ['李四', 'lisi@company.com', '产品部', false, 4, '休假'],
  ['王五', 'wangwu@company.com', '设计部', true, 3, '活跃'],
  ['赵六', 'zhaoliu@company.com', '运营部', true, 5, '活跃'],
  ['钱七', 'qianqi@company.com', '市场部', false, 2, '离职'],
];

const depts = ['技术部', '产品部', '设计部', '运营部', '市场部'];
const statuses = ['活跃', '休假', '离职'];

const SimpleGridDemo: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [data, setData] = useState<Row[]>(initialData);

  // —— 列宽调整 ——
  const resizingRef = useRef<{ index: number; startX: number; startWidth: number } | null>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const s = resizingRef.current;
      if (!s) return;
      const delta = e.clientX - s.startX;
      setColumns((prev) => {
        const next = [...prev];
        const min = next[s.index].minWidth ?? 60;
        next[s.index] = { ...next[s.index], width: Math.max(min, s.startWidth + delta) };
        return next;
      });
    };
    const onUp = () => {
      resizingRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    if (resizingRef.current) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [resizingRef.current]);

  const startResize = (index: number, e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = columns[index].width;
    resizingRef.current = { index, startX, startWidth };
  };

  // —— 列拖拽排序 ——
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const onDragStart = (index: number, e: React.DragEvent) => {
    dragIndexRef.current = index;
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const onDrop = (index: number) => {
    const from = dragIndexRef.current;
    if (from == null || from === index) return setDragOverIndex(null);
    setColumns((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setData((prev) =>
      prev.map((row) => {
        const r = [...row];
        const [moved] = r.splice(from!, 1);
        r.splice(index, 0, moved);
        return r;
      })
    );
    setDragOverIndex(null);
  };

  // —— 行/列追加 ——
  const onRowAppend = () => {
    setData((prev) => [
      ...prev,
      [`用户${prev.length + 1}`, `user${prev.length + 1}@company.com`, '技术部', false, 3, '活跃'],
    ]);
  };
  const onColumnAppend = () => {
    setColumns((prev) => [
      ...prev,
      { key: `col_${prev.length + 1}`, title: `新列${prev.length + 1}`, width: 160 },
    ]);
    setData((prev) => prev.map((r) => [...r, '']));
  };

  // —— 编辑 ——
  const updateCell = (row: number, col: number, value: string | number | boolean) => {
    setData((prev) => {
      const next = [...prev];
      next[row] = [...next[row]];
      next[row][col] = value;
      return next;
    });
  };

  // —— 渲染 ——
  const headerCells = useMemo(() => {
    return columns.map((col, i) => (
      <th
        key={col.key}
        draggable
        onDragStart={(e) => onDragStart(i, e)}
        onDragOver={(e) => onDragOver(i, e)}
        onDrop={() => onDrop(i)}
        style={{
          position: 'relative',
          width: col.width,
          minWidth: col.minWidth ?? 60,
          padding: '12px',
          borderBottom: '1px solid #e5e7eb',
          textAlign: 'left',
          background: '#f9fafb',
          userSelect: 'none',
        }}
        className={dragOverIndex === i ? 'drag-over' : ''}
        title="拖拽列头可排序"
      >
        {col.title}
        <div
          onMouseDown={(e) => startResize(i, e)}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            width: 6,
            cursor: 'col-resize',
          }}
          title="拖拽调整列宽"
        />
      </th>
    ));
  }, [columns, dragOverIndex]);

  const renderCell = (
    value: string | number | boolean,
    colKey: string,
    rowIndex: number,
    colIndex: number
  ) => {
    if (colKey === 'active') {
      return (
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => updateCell(rowIndex, colIndex, e.target.checked)}
          />
          <span style={{ color: Boolean(value) ? '#10B981' : '#EF4444' }}>
            {Boolean(value) ? '在职' : '离职'}
          </span>
        </label>
      );
    }
    if (colKey === 'rating') {
      const v = Number(value);
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              onClick={() => updateCell(rowIndex, colIndex, i + 1)}
              style={{
                color: i < v ? '#F59E0B' : '#d1d5db',
                marginRight: 2,
                cursor: 'pointer',
                fontSize: 16,
              }}
              title={`评分 ${i + 1}`}
            >
              ★
            </span>
          ))}
        </div>
      );
    }
    if (colKey === 'dept') {
      return (
        <select
          value={String(value)}
          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
          style={{
            border: '1px solid #d1d5db',
            borderRadius: 4,
            padding: '4px 8px',
            background: 'white',
          }}
        >
          {depts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      );
    }
    if (colKey === 'status') {
      return (
        <select
          value={String(value)}
          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
          style={{
            border: '1px solid #d1d5db',
            borderRadius: 4,
            padding: '4px 8px',
            background: 'white',
          }}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      );
    }
    if (colKey === 'name' || colKey === 'email') {
      return (
        <input
          type={colKey === 'email' ? 'email' : 'text'}
          value={String(value)}
          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
          style={{
            border: '1px solid #d1d5db',
            borderRadius: 4,
            padding: '4px 8px',
            width: '100%',
            background: 'white',
          }}
        />
      );
    }
    return String(value ?? '');
  };

  return (
    <div className="demo-section">
      <div className="demo-header">
        <h2>Grid 表格演示</h2>
        <p>完整交互：列宽调整、列拖拽排序、编辑、追加行/列（演示版）</p>
      </div>

      <div className="demo-content">
        <div className="controls" style={{ marginBottom: 12 }}>
          <button className="control-button primary" onClick={onRowAppend}>
            + 添加行
          </button>
          <button className="control-button" onClick={onColumnAppend}>
            + 添加列
          </button>
        </div>

        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            overflow: 'hidden',
            background: 'white',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              {columns.map((c) => (
                <col key={c.key} style={{ width: c.width }} />
              ))}
            </colgroup>
            <thead>
              <tr>{headerCells}</tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {columns.map((c, colIndex) => (
                    <td
                      key={c.key}
                      style={{
                        padding: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {renderCell(row[colIndex], c.key, rowIndex, colIndex)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="feature-list">
          <div className="feature-card">
            <h3>已实现能力（演示版）</h3>
            <ul>
              <li>列宽拖拽调整</li>
              <li>列头拖拽排序</li>
              <li>文本/邮箱/选择/布尔/评分基础编辑</li>
              <li>追加行/列</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGridDemo;
