/**
 * Kanban Board Constants
 */

import { TaskStatus } from './types';

/**
 * Standard Kanban columns configuration
 */
export const KANBAN_COLUMNS = [
  {
    id: TaskStatus.Backlog,
    name: 'Backlog',
    description: '需求池 - Tasks identified but not scheduled',
    color: '#9CA3AF', // Gray
  },
  {
    id: TaskStatus.Todo,
    name: 'To Do',
    description: 'Sprint待办 - Tasks scheduled for current sprint',
    color: '#60A5FA', // Blue
  },
  {
    id: TaskStatus.InProgress,
    name: 'In Progress',
    description: '开发中 - Tasks currently being developed',
    color: '#FBBF24', // Yellow/Amber
  },
  {
    id: TaskStatus.InReview,
    name: 'In Review',
    description: '代码审查 - PR submitted for code review',
    color: '#A78BFA', // Purple
  },
  {
    id: TaskStatus.Testing,
    name: 'Testing / QA',
    description: 'QA测试中 - QA executing test cases',
    color: '#F59E0B', // Orange
  },
  {
    id: TaskStatus.Blocked,
    name: 'Blocked',
    description: '阻塞 - Tasks blocked by dependencies or issues',
    color: '#EF4444', // Red
  },
  {
    id: TaskStatus.Done,
    name: 'Done',
    description: '验收通过 - Tasks that passed acceptance',
    color: '#10B981', // Green
  },
] as const;

/**
 * Status transition rules matrix
 * Defines which status transitions are allowed
 */
export const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.Backlog]: [TaskStatus.Todo, TaskStatus.Blocked],
  [TaskStatus.Todo]: [TaskStatus.InProgress, TaskStatus.Backlog, TaskStatus.Blocked],
  [TaskStatus.InProgress]: [TaskStatus.InReview, TaskStatus.Blocked, TaskStatus.Todo],
  [TaskStatus.InReview]: [TaskStatus.Testing, TaskStatus.InProgress, TaskStatus.Blocked],
  [TaskStatus.Testing]: [TaskStatus.Done, TaskStatus.InProgress, TaskStatus.Blocked],
  [TaskStatus.Blocked]: [
    TaskStatus.Backlog,
    TaskStatus.Todo,
    TaskStatus.InProgress,
    TaskStatus.InReview,
    TaskStatus.Testing,
  ],
  [TaskStatus.Done]: [TaskStatus.InProgress], // Allow reopening if needed
};

/**
 * Required fields for each status
 */
export const STATUS_REQUIREMENTS: Record<
  TaskStatus,
  {
    requiredFields: string[];
    description: string;
  }
> = {
  [TaskStatus.Backlog]: {
    requiredFields: ['title', 'description', 'goal'],
    description: 'Basic task information required',
  },
  [TaskStatus.Todo]: {
    requiredFields: ['title', 'description', 'goal', 'developer', 'complexity'],
    description: 'Task must be estimated and assigned',
  },
  [TaskStatus.InProgress]: {
    requiredFields: [
      'title',
      'description',
      'goal',
      'developer',
      'complexity',
      'acceptanceCriteria',
    ],
    description: 'Acceptance criteria must be defined',
  },
  [TaskStatus.InReview]: {
    requiredFields: [
      'title',
      'description',
      'goal',
      'developer',
      'complexity',
      'acceptanceCriteria',
      'pullRequest',
    ],
    description: 'PR must be created with proper description',
  },
  [TaskStatus.Testing]: {
    requiredFields: [
      'title',
      'description',
      'goal',
      'developer',
      'complexity',
      'acceptanceCriteria',
      'pullRequest',
      'testCases',
    ],
    description: 'Test cases must be defined and PR approved',
  },
  [TaskStatus.Blocked]: {
    requiredFields: ['title', 'description'],
    description: 'Can be blocked at any stage',
  },
  [TaskStatus.Done]: {
    requiredFields: [
      'title',
      'description',
      'goal',
      'developer',
      'complexity',
      'acceptanceCriteria',
      'pullRequest',
      'testCases',
    ],
    description: 'All criteria validated and QA passed',
  },
};

/**
 * Default column for new tasks
 */
export const DEFAULT_TASK_STATUS = TaskStatus.Backlog;

/**
 * Task ID prefix pattern
 */
export const TASK_ID_PREFIX = 'TASK';

/**
 * Sprint name pattern
 */
export const SPRINT_PREFIX = 'Sprint';