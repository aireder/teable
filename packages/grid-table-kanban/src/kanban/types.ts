/**
 * Kanban Board Type Definitions
 */

/**
 * Task complexity levels
 */
export enum TaskComplexity {
  Small = 'S',
  Medium = 'M',
  Large = 'L',
}

/**
 * Task status (workflow columns)
 */
export enum TaskStatus {
  Backlog = 'backlog',
  Todo = 'todo',
  InProgress = 'in_progress',
  InReview = 'in_review',
  Testing = 'testing',
  Blocked = 'blocked',
  Done = 'done',
}

/**
 * Bug priority levels
 */
export enum BugPriority {
  P0 = 'P0', // Critical - must be fixed
  P1 = 'P1', // High - needs evaluation
  P2 = 'P2', // Medium - can be deferred
}

/**
 * Task sub-task item
 */
export interface ISubTask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
}

/**
 * Test case definition
 */
export interface ITestCase {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'passed' | 'failed';
  notes?: string;
}

/**
 * Bug record
 */
export interface IBug {
  id: string;
  title: string;
  description: string;
  priority: BugPriority;
  status: 'open' | 'fixed' | 'wontfix';
  reporter?: string;
  assignee?: string;
  createdAt: string;
  resolvedAt?: string;
}

/**
 * Code review record
 */
export interface ICodeReview {
  id: string;
  reviewer: string;
  status: 'pending' | 'approved' | 'changes_requested';
  comments?: string;
  reviewedAt?: string;
}

/**
 * Pull Request metadata
 */
export interface IPullRequest {
  id: string;
  title: string;
  description: string;
  url?: string;
  modifications: string; // What was changed
  runInstructions: string; // How to run/test
  impactAreas: string; // Areas affected
  regressionRisks: string; // Potential regression risks
  reviews: ICodeReview[];
  createdAt: string;
  mergedAt?: string;
}

/**
 * Acceptance criteria item
 */
export interface IAcceptanceCriteria {
  id: string;
  description: string;
  validated: boolean;
  validatedBy?: string;
  validatedAt?: string;
  notes?: string;
}

/**
 * Related file/design reference
 */
export interface IRelatedFile {
  id: string;
  type: 'code' | 'design' | 'document' | 'other';
  path: string;
  description?: string;
  url?: string;
}

/**
 * Task dependency
 */
export interface ITaskDependency {
  taskId: string;
  type: 'blocks' | 'blocked_by' | 'related_to';
}

/**
 * Development log entry
 */
export interface IDevLogEntry {
  id: string;
  timestamp: string;
  author: string;
  action: string;
  description: string;
  problems?: string;
  solutions?: string;
}

/**
 * Main Kanban Task interface
 */
export interface IKanbanTask {
  // Basic info
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  
  // Task details
  goal: string;
  subTasks: ISubTask[];
  developer: string;
  complexity: TaskComplexity;
  
  // Testing & Quality
  acceptanceCriteria: IAcceptanceCriteria[];
  testCases: ITestCase[];
  
  // References
  relatedFiles: IRelatedFile[];
  dependencies: ITaskDependency[];
  
  // Workflow tracking
  pullRequest?: IPullRequest;
  bugs: IBug[];
  
  // Development log
  devLog: IDevLogEntry[];
  
  // Metadata
  sprint?: string;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  
  // Tags
  tags?: string[];
}

/**
 * Kanban Board configuration
 */
export interface IKanbanBoard {
  id: string;
  name: string;
  description?: string;
  columns: {
    id: TaskStatus;
    name: string;
    description: string;
    color?: string;
  }[];
  tasks: IKanbanTask[];
  sprints: string[];
  currentSprint?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Workflow validation rules
 */
export interface IWorkflowRule {
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  validate: (task: IKanbanTask) => { valid: boolean; error?: string };
}

/**
 * Kanban board statistics
 */
export interface IBoardStatistics {
  totalTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByComplexity: Record<TaskComplexity, number>;
  completionRate: number;
  averageTimeInProgress?: number;
  blockedTasks: number;
  criticalBugs: number;
}