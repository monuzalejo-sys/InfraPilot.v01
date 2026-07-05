import type {
  AnyKnowledgeObject,
  Decision,
  Risk,
  Policy,
  Pending,
} from '../schemas/knowledge-objects'
import type { MemoryEvent } from '../schemas/events'
import { MemoryEventType } from '../schemas/events'

/** Base fields shared by every KnowledgeObject fixture, with sane defaults. */
function base(overrides: Partial<AnyKnowledgeObject> = {}) {
  const now = overrides.created ?? '2026-01-01T00:00:00.000Z'
  return {
    created: now,
    updated: overrides.updated ?? now,
    lifetime: 'Project' as const,
    tier: 'Project' as const,
    impact: 'Medium' as const,
    priority: 'Medium' as const,
    dependencies: [] as string[],
    ...overrides,
  }
}

export function makeRisk(overrides: Partial<Risk> = {}): Risk {
  return {
    ...base(overrides),
    id: 'RSK-001',
    type: 'Risk',
    status: 'Open',
    risk: 'Database fails under high load',
    probability: 'Medium',
    mitigation: 'Add connection pooling',
    ...overrides,
  } as Risk
}

export function makeDecision(overrides: Partial<Decision> = {}): Decision {
  return {
    ...base(overrides),
    id: 'DEC-001',
    type: 'Decision',
    status: 'Accepted',
    title: 'Use PostgreSQL for primary storage',
    description: 'Chosen over MySQL for JSONB support',
    reason: 'Team familiarity and JSONB support',
    ...overrides,
  } as Decision
}

export function makePolicy(overrides: Partial<Policy> = {}): Policy {
  return {
    ...base(overrides),
    id: 'POL-001',
    type: 'Policy',
    status: 'Active',
    rule: 'All API responses must be JSON',
    scope: ['api'],
    ...overrides,
  } as Policy
}

export function makePending(overrides: Partial<Pending> = {}): Pending {
  return {
    ...base(overrides),
    id: 'PEND-001',
    type: 'Pending',
    status: 'Ready',
    task: 'Implement AMM dedup',
    reason: 'Required for PEND-010',
    ...overrides,
  } as Pending
}

let eventCounter = 0

export function makeEvent(overrides: Partial<MemoryEvent> = {}): MemoryEvent {
  eventCounter++
  return {
    id: `evt-test-${eventCounter}`,
    type: MemoryEventType.TASK_COMPLETED,
    priority: 'High',
    timestamp: '2026-01-01T00:00:00.000Z',
    context: {
      projectId: 'test-project',
      sessionId: 'session-1',
    },
    ...overrides,
  }
}

/** Builds a candidates event, as the runtime is expected to per KnowledgeDistiller.extractCandidates. */
export function makeCandidatesEvent(
  candidates: AnyKnowledgeObject[],
  overrides: Partial<MemoryEvent> = {}
): MemoryEvent {
  return makeEvent({
    metadata: { candidates },
    ...overrides,
  })
}
