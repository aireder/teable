/**
 * Kanban Board State Management Store
 */

import { create } from 'zustand';
import type {
  IKanbanBoard,
  IKanbanTask,
  TaskStatus,
  ISubTask,
  ITestCase,
  IAcceptanceCriteria,
  IBug,
  ICodeReview,
  IDevLogEntry,
  IRelatedFile,
  ITaskDependency,
} from './types';
import {
  generateTaskId,
  generateSubId,
  canTransitionStatus,
  validateTaskForStatus,
  createEmptyTask,
} from './utils';
import { KANBAN_COLUMNS, DEFAULT_TASK_STATUS } from './constants';

interface IKanbanStore {
  // State
  board: IKanbanBoard | null;
  selectedTask: IKanbanTask | null;
  filter: {
    status?: TaskStatus[];
    developer?: string;
    sprint?: string;
    search?: string;
  };

  // Actions - Board
  initializeBoard: (boardData?: Partial<IKanbanBoard>) => void;
  updateBoard: (updates: Partial<IKanbanBoard>) => void;

  // Actions - Tasks
  addTask: (task: Partial<IKanbanTask>) => void;
  updateTask: (taskId: string, updates: Partial<IKanbanTask>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, toStatus: TaskStatus) => { success: boolean; error?: string };
  selectTask: (taskId: string | null) => void;

  // Actions - Sub-tasks
  addSubTask: (taskId: string, subTask: Omit<ISubTask, 'id'>) => void;
  updateSubTask: (taskId: string, subTaskId: string, updates: Partial<ISubTask>) => void;
  deleteSubTask: (taskId: string, subTaskId: string) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;

  // Actions - Test Cases
  addTestCase: (taskId: string, testCase: Omit<ITestCase, 'id'>) => void;
  updateTestCase: (taskId: string, testCaseId: string, updates: Partial<ITestCase>) => void;
  deleteTestCase: (taskId: string, testCaseId: string) => void;

  // Actions - Acceptance Criteria
  addAcceptanceCriteria: (taskId: string, criteria: Omit<IAcceptanceCriteria, 'id'>) => void;
  updateAcceptanceCriteria: (
    taskId: string,
    criteriaId: string,
    updates: Partial<IAcceptanceCriteria>
  ) => void;
  validateAcceptanceCriteria: (taskId: string, criteriaId: string, validator: string) => void;
  deleteAcceptanceCriteria: (taskId: string, criteriaId: string) => void;

  // Actions - Bugs
  addBug: (taskId: string, bug: Omit<IBug, 'id' | 'createdAt'>) => void;
  updateBug: (taskId: string, bugId: string, updates: Partial<IBug>) => void;
  resolveBug: (taskId: string, bugId: string) => void;

  // Actions - Code Review
  addCodeReview: (taskId: string, review: Omit<ICodeReview, 'id'>) => void;
  updateCodeReview: (taskId: string, reviewId: string, updates: Partial<ICodeReview>) => void;

  // Actions - Dev Log
  addDevLog: (taskId: string, log: Omit<IDevLogEntry, 'id' | 'timestamp'>) => void;

  // Actions - Filter
  setFilter: (filter: IKanbanStore['filter']) => void;
  clearFilter: () => void;

  // Actions - Persistence
  exportToJSON: () => string;
  importFromJSON: (jsonData: string) => void;
}

export const useKanbanStore = create<IKanbanStore>((set, get) => ({
  // Initial state
  board: null,
  selectedTask: null,
  filter: {},

  // Initialize board
  initializeBoard: (boardData) => {
    const now = new Date().toISOString();
    const board: IKanbanBoard = {
      id: boardData?.id || `board-${Date.now()}`,
      name: boardData?.name || 'Kanban Board',
      description: boardData?.description,
      columns: KANBAN_COLUMNS.map(col => ({ ...col })),
      tasks: boardData?.tasks || [],
      sprints: boardData?.sprints || ['Sprint 1'],
      currentSprint: boardData?.currentSprint || 'Sprint 1',
      createdAt: boardData?.createdAt || now,
      updatedAt: now,
    };
    set({ board });
  },

  // Update board
  updateBoard: (updates) => {
    set(state => ({
      board: state.board ? { ...state.board, ...updates, updatedAt: new Date().toISOString() } : null,
    }));
  },

  // Add task
  addTask: (taskData) => {
    const task = createEmptyTask({
      ...taskData,
      id: taskData.id || generateTaskId(),
      status: taskData.status || DEFAULT_TASK_STATUS,
    });

    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: [...state.board.tasks, task],
            updatedAt: new Date().toISOString(),
          }
        : null,
    }));
  },

  // Update task
  updateTask: (taskId, updates) => {
    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                : task
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
      selectedTask:
        state.selectedTask?.id === taskId
          ? { ...state.selectedTask, ...updates, updatedAt: new Date().toISOString() }
          : state.selectedTask,
    }));
  },

  // Delete task
  deleteTask: (taskId) => {
    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.filter(task => task.id !== taskId),
            updatedAt: new Date().toISOString(),
          }
        : null,
      selectedTask: state.selectedTask?.id === taskId ? null : state.selectedTask,
    }));
  },

  // Move task to different status
  moveTask: (taskId, toStatus) => {
    const state = get();
    const task = state.board?.tasks.find(t => t.id === taskId);

    if (!task) {
      return { success: false, error: 'Task not found' };
    }

    // Check if transition is allowed
    if (!canTransitionStatus(task.status, toStatus)) {
      return {
        success: false,
        error: `Cannot move task from ${task.status} to ${toStatus}`,
      };
    }

    // Validate task for new status
    const validation = validateTaskForStatus(task, toStatus);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join('; '),
      };
    }

    // Update task status
    const updates: Partial<IKanbanTask> = { status: toStatus };
    
    // Set completion time if moving to done
    if (toStatus === 'done') {
      updates.completedAt = new Date().toISOString();
    }

    get().updateTask(taskId, updates);

    return { success: true };
  },

  // Select task
  selectTask: (taskId) => {
    const task = taskId ? get().board?.tasks.find(t => t.id === taskId) || null : null;
    set({ selectedTask: task });
  },

  // Add subtask
  addSubTask: (taskId, subTaskData) => {
    const subTask: ISubTask = {
      ...subTaskData,
      id: generateSubId('subtask'),
    };

    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    subTasks: [...task.subTasks, subTask],
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Update subtask
  updateSubTask: (taskId, subTaskId, updates) => {
    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    subTasks: task.subTasks.map(st =>
                      st.id === subTaskId ? { ...st, ...updates } : st
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Delete subtask
  deleteSubTask: (taskId, subTaskId) => {
    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    subTasks: task.subTasks.filter(st => st.id !== subTaskId),
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Toggle subtask completion
  toggleSubTask: (taskId, subTaskId) => {
    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    subTasks: task.subTasks.map(st =>
                      st.id === subTaskId ? { ...st, completed: !st.completed } : st
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Add test case
  addTestCase: (taskId, testCaseData) => {
    const testCase: ITestCase = {
      ...testCaseData,
      id: generateSubId('testcase'),
    };

    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    testCases: [...task.testCases, testCase],
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Update test case
  updateTestCase: (taskId, testCaseId, updates) => {
    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    testCases: task.testCases.map(tc =>
                      tc.id === testCaseId ? { ...tc, ...updates } : tc
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Delete test case
  deleteTestCase: (taskId, testCaseId) => {
    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    testCases: task.testCases.filter(tc => tc.id !== testCaseId),
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Add acceptance criteria
  addAcceptanceCriteria: (taskId, criteriaData) => {
    const criteria: IAcceptanceCriteria = {
      ...criteriaData,
      id: generateSubId('criteria'),
    };

    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    acceptanceCriteria: [...task.acceptanceCriteria, criteria],
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Update acceptance criteria
  updateAcceptanceCriteria: (taskId, criteriaId, updates) => {
    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    acceptanceCriteria: task.acceptanceCriteria.map(ac =>
                      ac.id === criteriaId ? { ...ac, ...updates } : ac
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Validate acceptance criteria
  validateAcceptanceCriteria: (taskId, criteriaId, validator) => {
    get().updateAcceptanceCriteria(taskId, criteriaId, {
      validated: true,
      validatedBy: validator,
      validatedAt: new Date().toISOString(),
    });
  },

  // Delete acceptance criteria
  deleteAcceptanceCriteria: (taskId, criteriaId) => {
    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    acceptanceCriteria: task.acceptanceCriteria.filter(ac => ac.id !== criteriaId),
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Add bug
  addBug: (taskId, bugData) => {
    const bug: IBug = {
      ...bugData,
      id: generateSubId('bug'),
      createdAt: new Date().toISOString(),
    };

    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    bugs: [...task.bugs, bug],
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Update bug
  updateBug: (taskId, bugId, updates) => {
    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    bugs: task.bugs.map(bug => (bug.id === bugId ? { ...bug, ...updates } : bug)),
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Resolve bug
  resolveBug: (taskId, bugId) => {
    get().updateBug(taskId, bugId, {
      status: 'fixed',
      resolvedAt: new Date().toISOString(),
    });
  },

  // Add code review
  addCodeReview: (taskId, reviewData) => {
    const review: ICodeReview = {
      ...reviewData,
      id: generateSubId('review'),
    };

    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    pullRequest: task.pullRequest
                      ? {
                          ...task.pullRequest,
                          reviews: [...task.pullRequest.reviews, review],
                        }
                      : undefined,
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Update code review
  updateCodeReview: (taskId, reviewId, updates) => {
    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    pullRequest: task.pullRequest
                      ? {
                          ...task.pullRequest,
                          reviews: task.pullRequest.reviews.map(review =>
                            review.id === reviewId ? { ...review, ...updates } : review
                          ),
                        }
                      : undefined,
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Add dev log entry
  addDevLog: (taskId, logData) => {
    const log: IDevLogEntry = {
      ...logData,
      id: generateSubId('log'),
      timestamp: new Date().toISOString(),
    };

    set(state => ({
      board: state.board
        ? {
            ...state.board,
            tasks: state.board.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    devLog: [...task.devLog, log],
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        : null,
    }));
  },

  // Set filter
  setFilter: (filter) => {
    set({ filter });
  },

  // Clear filter
  clearFilter: () => {
    set({ filter: {} });
  },

  // Export to JSON
  exportToJSON: () => {
    const state = get();
    return JSON.stringify(state.board, null, 2);
  },

  // Import from JSON
  importFromJSON: (jsonData) => {
    try {
      const board = JSON.parse(jsonData) as IKanbanBoard;
      set({ board });
    } catch (error) {
      console.error('Failed to import board:', error);
    }
  },
}));