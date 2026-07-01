import type { SessionMetrics } from './metrics'

export enum MemoryEventType {
  TASK_COMPLETED = 'TASK_COMPLETED',
  PHASE_CHANGED = 'PHASE_CHANGED',
  SESSION_CLOSE = 'SESSION_CLOSE',
  CONTEXT_HIGH_WATERMARK = 'CONTEXT_HIGH_WATERMARK',
  ARCHITECTURAL_DECISIONS_ACCUMULATED = 'ARCHITECTURAL_DECISIONS_ACCUMULATED',
  DUPLICATE_DETECTED = 'DUPLICATE_DETECTED',
  PRE_SPRINT_GENERATION = 'PRE_SPRINT_GENERATION',
  MODULE_CHANGE = 'MODULE_CHANGE',
  AMM_RUN_COMPLETED = 'AMM_RUN_COMPLETED',
  AMM_RUN_FAILED = 'AMM_RUN_FAILED',
}

export type EventPriority = 'Critical' | 'High' | 'Medium' | 'Low'

export interface EventContext {
  projectId: string
  sessionId: string
  taskId?: string
  phase?: string
  module?: string
  contextUsagePercent?: number
  decisionCount?: number
  duplicateIds?: string[]
}

export interface MemoryEvent {
  id: string
  type: MemoryEventType
  priority: EventPriority
  timestamp: string
  context: EventContext
  metadata?: Record<string, unknown>
}

export interface AmmRunCompletedEvent extends MemoryEvent {
  type: MemoryEventType.AMM_RUN_COMPLETED
  metrics: SessionMetrics
}

export interface AmmRunFailedEvent extends MemoryEvent {
  type: MemoryEventType.AMM_RUN_FAILED
  error: string
  partialMetrics?: Partial<SessionMetrics>
}

export const EVENT_PRIORITY_MAP: Record<MemoryEventType, EventPriority> = {
  [MemoryEventType.SESSION_CLOSE]: 'Critical',
  [MemoryEventType.CONTEXT_HIGH_WATERMARK]: 'Critical',
  [MemoryEventType.TASK_COMPLETED]: 'High',
  [MemoryEventType.PHASE_CHANGED]: 'High',
  [MemoryEventType.ARCHITECTURAL_DECISIONS_ACCUMULATED]: 'High',
  [MemoryEventType.PRE_SPRINT_GENERATION]: 'High',
  [MemoryEventType.DUPLICATE_DETECTED]: 'Medium',
  [MemoryEventType.MODULE_CHANGE]: 'Medium',
  [MemoryEventType.AMM_RUN_COMPLETED]: 'Low',
  [MemoryEventType.AMM_RUN_FAILED]: 'High',
}

export const CRITICAL_EVENTS = new Set([
  MemoryEventType.SESSION_CLOSE,
  MemoryEventType.CONTEXT_HIGH_WATERMARK,
])

export const HIGH_EVENTS = new Set([
  MemoryEventType.TASK_COMPLETED,
  MemoryEventType.PHASE_CHANGED,
  MemoryEventType.ARCHITECTURAL_DECISIONS_ACCUMULATED,
  MemoryEventType.PRE_SPRINT_GENERATION,
])
