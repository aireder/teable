/**
 * Kanban Board Utility Functions
 */

import type {
  IKanbanTask,
  IKanbanBoard,
  TaskStatus,
  IBoardStatistics,
  TaskComplexity,
  ISubTask,
  ITestCase,
  IAcceptanceCriteria,
  IBug,
  BugPriority,
} from './types';
import { STATUS_TRANSITIONS, STATUS_REQUIREMENTS, TASK_ID_PREFIX } from './constants';

/**
 * Generate a unique task ID
 */
export function generateTaskId(prefix: string = TASK_ID_PREFIX): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

/**
 * Generate a unique sub-item ID (for subtasks, test cases, etc.)
 */
export function generateSubId(type: string = 'item'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  return `${type}-${timestamp}-${random}`;
}

/**
 * Validate if a status transition is allowed
 */
export function canTransitionStatus(
  fromStatus: TaskStatus,
  toStatus: TaskStatus
): boolean {
  const allowedTransitions = STATUS_TRANSITIONS[fromStatus];
  return allowedTransitions.includes(toStatus);
}

/**
 * Validate task has required fields for a status
 */
export function validateTaskForStatus(
  task: IKanbanTask,
  status: TaskStatus
): { valid: boolean; errors: string[] } {
  const requirements = STATUS_REQUIREMENTS[status];
  const errors: string[] = [];

  for (const field of requirements.requiredFields) {
    const value = (task as any)[field];
    
    if (value === undefined || value === null || value === '') {
      errors.push(`Missing required field: ${field}`);
      continue;
    }

    // Special validations
    if (Array.isArray(value) && value.length === 0) {
      errors.push(`Required field "${field}" must have at least one item`);
    }
  }

  // Additional status-specific validations
  if (status === 'in_review' || status === 'testing' || status === 'done') {
    if (task.pullRequest && task.pullRequest.reviews.length === 0) {
      errors.push('PR requires at least one review');
    }
  }

  if (status === 'testing' || status === 'done') {
    const approvedReviews = task.pullRequest?.reviews.filter(r => r.status === 'approved') || [];
    if (approvedReviews.length === 0) {
      errors.push('PR must have at least one approved review before testing');
    }
  }

  if (status === 'done') {
    // Check all acceptance criteria are validated
    const unvalidatedCriteria = task.acceptanceCriteria.filter(ac => !ac.validated);
    if (unvalidatedCriteria.length > 0) {
      errors.push(`${unvalidatedCriteria.length} acceptance criteria not validated`);
    }

    // Check all P0 bugs are resolved
    const unresolvedP0Bugs = task.bugs.filter(
      bug => bug.priority === 'P0' && bug.status !== 'fixed'
    );
    if (unresolvedP0Bugs.length > 0) {
      errors.push(`${unresolvedP0Bugs.length} P0 bugs must be fixed`);
    }

    // Check all test cases passed
    const failedTests = task.testCases.filter(tc => tc.status === 'failed');
    if (failedTests.length > 0) {
      errors.push(`${failedTests.length} test cases failed`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate task completion percentage based on subtasks
 */
export function calculateTaskCompletion(task: IKanbanTask): number {
  if (!task.subTasks || task.subTasks.length === 0) {
    return task.status === 'done' ? 100 : 0;
  }

  const completedCount = task.subTasks.filter(st => st.completed).length;
  return Math.round((completedCount / task.subTasks.length) * 100);
}

/**
 * Get board statistics
 */
export function getBoardStatistics(board: IKanbanBoard): IBoardStatistics {
  const stats: IBoardStatistics = {
    totalTasks: board.tasks.length,
    tasksByStatus: {
      backlog: 0,
      todo: 0,
      in_progress: 0,
      in_review: 0,
      testing: 0,
      blocked: 0,
      done: 0,
    },
    tasksByComplexity: {
      S: 0,
      M: 0,
      L: 0,
    },
    completionRate: 0,
    blockedTasks: 0,
    criticalBugs: 0,
  };

  board.tasks.forEach(task => {
    // Count by status
    stats.tasksByStatus[task.status]++;

    // Count by complexity
    if (task.complexity) {
      stats.tasksByComplexity[task.complexity]++;
    }

    // Count blocked tasks
    if (task.status === 'blocked') {
      stats.blockedTasks++;
    }

    // Count critical bugs
    const p0Bugs = task.bugs.filter(
      bug => bug.priority === 'P0' && bug.status === 'open'
    );
    stats.criticalBugs += p0Bugs.length;
  });

  // Calculate completion rate
  if (stats.totalTasks > 0) {
    stats.completionRate = Math.round(
      (stats.tasksByStatus.done / stats.totalTasks) * 100
    );
  }

  return stats;
}

/**
 * Sort tasks by priority/complexity
 */
export function sortTasks(tasks: IKanbanTask[], sortBy: 'complexity' | 'updated' | 'created'): IKanbanTask[] {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'complexity':
        const complexityOrder = { L: 3, M: 2, S: 1 };
        return complexityOrder[b.complexity] - complexityOrder[a.complexity];
      
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      
      default:
        return 0;
    }
  });
}

/**
 * Filter tasks by criteria
 */
export function filterTasks(
  tasks: IKanbanTask[],
  filters: {
    status?: TaskStatus[];
    developer?: string;
    sprint?: string;
    complexity?: TaskComplexity[];
    search?: string;
    hasBlockers?: boolean;
  }
): IKanbanTask[] {
  return tasks.filter(task => {
    // Filter by status
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(task.status)) return false;
    }

    // Filter by developer
    if (filters.developer && task.developer !== filters.developer) {
      return false;
    }

    // Filter by sprint
    if (filters.sprint && task.sprint !== filters.sprint) {
      return false;
    }

    // Filter by complexity
    if (filters.complexity && filters.complexity.length > 0) {
      if (!filters.complexity.includes(task.complexity)) return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchableText = `${task.title} ${task.description} ${task.goal}`.toLowerCase();
      if (!searchableText.includes(searchLower)) return false;
    }

    // Filter by blockers
    if (filters.hasBlockers !== undefined) {
      const hasBlockers = task.status === 'blocked' || 
        task.dependencies.some(d => d.type === 'blocked_by');
      if (filters.hasBlockers !== hasBlockers) return false;
    }

    return true;
  });
}

/**
 * Get tasks that are blocking another task
 */
export function getBlockingTasks(
  taskId: string,
  allTasks: IKanbanTask[]
): IKanbanTask[] {
  const task = allTasks.find(t => t.id === taskId);
  if (!task) return [];

  const blockingTaskIds = task.dependencies
    .filter(d => d.type === 'blocked_by')
    .map(d => d.taskId);

  return allTasks.filter(t => blockingTaskIds.includes(t.id));
}

/**
 * Get tasks that are blocked by a task
 */
export function getBlockedTasks(
  taskId: string,
  allTasks: IKanbanTask[]
): IKanbanTask[] {
  return allTasks.filter(task =>
    task.dependencies.some(d => d.type === 'blocked_by' && d.taskId === taskId)
  );
}

/**
 * Create a new empty task with default values
 */
export function createEmptyTask(overrides?: Partial<IKanbanTask>): IKanbanTask {
  const now = new Date().toISOString();
  
  return {
    id: generateTaskId(),
    title: '',
    description: '',
    status: 'backlog',
    goal: '',
    subTasks: [],
    developer: '',
    complexity: 'M',
    acceptanceCriteria: [],
    testCases: [],
    relatedFiles: [],
    dependencies: [],
    bugs: [],
    devLog: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Format task for markdown export
 */
export function formatTaskMarkdown(task: IKanbanTask): string {
  let md = `# Task ${task.id}: ${task.title}\n\n`;
  
  md += `## Status\n**Current**: ${task.status}\n`;
  if (task.sprint) md += `**Sprint**: ${task.sprint}\n`;
  md += `\n`;

  md += `## Overview\n${task.description}\n\n`;

  md += `## Goal\n${task.goal}\n\n`;

  md += `## Developer\n- Primary: ${task.developer}\n\n`;

  md += `## Estimated Complexity\n**Size**: ${task.complexity}\n\n`;

  if (task.subTasks.length > 0) {
    md += `## Sub-tasks\n`;
    task.subTasks.forEach(st => {
      md += `- [${st.completed ? 'x' : ' '}] ${st.title}`;
      if (st.assignee) md += ` (${st.assignee})`;
      md += `\n`;
    });
    md += `\n`;
  }

  if (task.acceptanceCriteria.length > 0) {
    md += `## Acceptance Criteria\n`;
    task.acceptanceCriteria.forEach((ac, i) => {
      md += `${i + 1}. ${ac.validated ? '✅' : '⏳'} ${ac.description}\n`;
    });
    md += `\n`;
  }

  if (task.testCases.length > 0) {
    md += `## Test Cases\n`;
    task.testCases.forEach((tc, i) => {
      const statusIcon = tc.status === 'passed' ? '✅' : tc.status === 'failed' ? '❌' : '⏳';
      md += `${i + 1}. **TC-${i + 1}**: ${tc.title}\n`;
      md += `   - Status: ${statusIcon} ${tc.status}\n`;
      if (tc.notes) md += `   - Notes: ${tc.notes}\n`;
    });
    md += `\n`;
  }

  return md;
}