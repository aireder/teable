/**
 * Kanban Task Card Component
 */

import type { FC } from 'react';
import { cn } from '../../utils';
import type { IKanbanTask, TaskComplexity, TaskStatus } from '../types';
import { KANBAN_COLUMNS } from '../constants';
import { calculateTaskCompletion } from '../utils';

export interface ITaskCardProps {
  task: IKanbanTask;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  draggable?: boolean;
  className?: string;
}

const complexityColors: Record<TaskComplexity, string> = {
  S: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  M: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  L: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusColors: Record<TaskStatus, string> = {
  backlog: 'border-gray-300',
  todo: 'border-blue-300',
  in_progress: 'border-yellow-300',
  in_review: 'border-purple-300',
  testing: 'border-orange-300',
  blocked: 'border-red-400',
  done: 'border-green-400',
};

export const TaskCard: FC<ITaskCardProps> = ({
  task,
  onClick,
  onDragStart,
  onDragEnd,
  draggable = true,
  className,
}) => {
  const completion = calculateTaskCompletion(task);
  const statusColumn = KANBAN_COLUMNS.find(col => col.id === task.status);
  
  const hasBlockingIssues = task.status === 'blocked' || task.bugs.some(
    bug => bug.priority === 'P0' && bug.status === 'open'
  );

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 p-4 cursor-pointer',
        'hover:shadow-md transition-shadow duration-200',
        statusColors[task.status],
        hasBlockingIssues && 'border-l-red-500',
        className
      )}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
            {task.title || 'Untitled Task'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.id}</p>
        </div>
        
        <span
          className={cn(
            'px-2 py-1 rounded text-xs font-medium ml-2 flex-shrink-0',
            complexityColors[task.complexity]
          )}
        >
          {task.complexity}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Progress Bar */}
      {task.subTasks.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs text-gray-500">{completion}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {task.developer && (
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                {task.developer.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-600 dark:text-gray-400">{task.developer}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Subtasks indicator */}
          {task.subTasks.length > 0 && (
            <span className="text-gray-500">
              {task.subTasks.filter(st => st.completed).length}/{task.subTasks.length}
            </span>
          )}

          {/* Bug indicator */}
          {task.bugs.length > 0 && (
            <span className={cn(
              'px-1.5 py-0.5 rounded',
              hasBlockingIssues
                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            )}>
              🐛 {task.bugs.filter(b => b.status === 'open').length}
            </span>
          )}

          {/* PR indicator */}
          {task.pullRequest && (
            <span className="text-purple-500">PR</span>
          )}
        </div>
      </div>

      {/* Status badge (small) */}
      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-500">
          {statusColumn?.name || task.status}
        </span>
      </div>
    </div>
  );
};