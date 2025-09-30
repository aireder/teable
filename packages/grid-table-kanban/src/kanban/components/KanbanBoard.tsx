/**
 * Kanban Board Component
 */

import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { cn } from '../../utils';
import type { IKanbanTask, TaskStatus } from '../types';
import { KANBAN_COLUMNS } from '../constants';
import { useKanbanStore } from '../store';
import { TaskCard } from './TaskCard';

export interface IKanbanBoardProps {
  className?: string;
  onTaskClick?: (task: IKanbanTask) => void;
  showStats?: boolean;
}

export const KanbanBoard: FC<IKanbanBoardProps> = ({
  className,
  onTaskClick,
  showStats = true,
}) => {
  const { board, moveTask, selectTask } = useKanbanStore();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = useCallback((taskId: string) => {
    setDraggedTaskId(taskId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, columnId: TaskStatus) => {
      e.preventDefault();
      
      if (!draggedTaskId) return;

      const result = moveTask(draggedTaskId, columnId);
      
      if (!result.success) {
        alert(`Cannot move task: ${result.error}`);
      }

      setDraggedTaskId(null);
      setDragOverColumn(null);
    },
    [draggedTaskId, moveTask]
  );

  const handleTaskClick = useCallback(
    (task: IKanbanTask) => {
      selectTask(task.id);
      onTaskClick?.(task);
    },
    [selectTask, onTaskClick]
  );

  if (!board) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No board initialized. Please initialize a board first.
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Board Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {board.name}
        </h1>
        {board.description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {board.description}
          </p>
        )}
        {board.currentSprint && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {board.currentSprint}
            </span>
          </div>
        )}
      </div>

      {/* Board Columns */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map(column => {
          const columnTasks = board.tasks.filter(task => task.status === column.id);
          const isDragOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              className={cn(
                'flex-shrink-0 w-80 flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg p-4',
                'border-2 border-transparent transition-colors',
                isDragOver && 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              )}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                    {column.name}
                  </h2>
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {columnTasks.length}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {column.description}
                </p>
              </div>

              {/* Tasks */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {columnTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => handleTaskClick(task)}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      handleDragStart(task.id);
                    }}
                    onDragEnd={handleDragEnd}
                    draggable
                    className={cn(
                      'transition-opacity',
                      draggedTaskId === task.id && 'opacity-50'
                    )}
                  />
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-sm text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    No tasks
                  </div>
                )}
              </div>

              {/* Column Footer Stats */}
              {showStats && columnTasks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {columnTasks.filter(t => t.complexity === 'S').length}S{' '}
                      {columnTasks.filter(t => t.complexity === 'M').length}M{' '}
                      {columnTasks.filter(t => t.complexity === 'L').length}L
                    </span>
                    {column.id !== 'backlog' && column.id !== 'blocked' && (
                      <span>
                        {columnTasks.filter(t => t.bugs.some(b => b.priority === 'P0' && b.status === 'open')).length > 0 && (
                          <span className="text-red-500">
                            {columnTasks.filter(t => t.bugs.some(b => b.priority === 'P0' && b.status === 'open')).length} P0
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};