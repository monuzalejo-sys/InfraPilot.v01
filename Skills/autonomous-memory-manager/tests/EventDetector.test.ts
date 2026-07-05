import { describe, it, expect } from 'vitest'
import { EventDetector, DetectionContext } from '../src/EventDetector'
import { MemoryEventType } from '../schemas/events'

function ctx(overrides: Partial<DetectionContext> = {}): DetectionContext {
  return {
    projectId: 'test-project',
    sessionId: 'session-1',
    contextUsagePercent: 0,
    recentDecisionCount: 0,
    taskCompleted: false,
    phaseChanged: false,
    moduleChanged: false,
    sessionClosing: false,
    sprintGenerationRequested: false,
    ...overrides,
  }
}

// TC-AMM-01
describe('EventDetector — SESSION_CLOSE (TC-AMM-01)', () => {
  it('emits SESSION_CLOSE with Critical priority when sessionClosing is true', async () => {
    const detector = new EventDetector()
    const events = await detector.detect(ctx({ sessionClosing: true }))
    expect(events).toHaveLength(1)
    expect(events[0]?.type).toBe(MemoryEventType.SESSION_CLOSE)
    expect(events[0]?.priority).toBe('Critical')
  })
})

// TC-AMM-02 / TC-AMM-03
describe('EventDetector — CONTEXT_HIGH_WATERMARK boundary (TC-AMM-02/03)', () => {
  it('triggers at exactly 70% (inclusive boundary)', async () => {
    const detector = new EventDetector()
    const events = await detector.detect(ctx({ contextUsagePercent: 70 }))
    expect(events.some(e => e.type === MemoryEventType.CONTEXT_HIGH_WATERMARK)).toBe(true)
    expect(events[0]?.priority).toBe('Critical')
  })

  it('does not trigger at 69%', async () => {
    const detector = new EventDetector()
    const events = await detector.detect(ctx({ contextUsagePercent: 69 }))
    expect(events).toHaveLength(0)
  })
})

// TC-AMM-04
describe('EventDetector — ARCHITECTURAL_DECISIONS_ACCUMULATED threshold (TC-AMM-04)', () => {
  it('triggers at exactly 3 decisions', async () => {
    const detector = new EventDetector()
    const events = await detector.detect(ctx({ recentDecisionCount: 3 }))
    expect(events).toHaveLength(1)
    expect(events[0]?.type).toBe(MemoryEventType.ARCHITECTURAL_DECISIONS_ACCUMULATED)
    expect(events[0]?.priority).toBe('High')
  })

  it('does not trigger below 3 decisions', async () => {
    const detector = new EventDetector()
    const events = await detector.detect(ctx({ recentDecisionCount: 2 }))
    expect(events).toHaveLength(0)
  })
})

// TC-AMM-05
describe('EventDetector — simultaneous events deduplicate by type (TC-AMM-05)', () => {
  it('emits exactly one of each triggered type, no duplicates', async () => {
    const detector = new EventDetector()
    const events = await detector.detect(ctx({
      sessionClosing: true,
      contextUsagePercent: 75,
      taskCompleted: true,
      taskId: 'T1',
      recentDecisionCount: 4,
    }))

    const types = events.map(e => e.type)
    const expected = [
      MemoryEventType.SESSION_CLOSE,
      MemoryEventType.CONTEXT_HIGH_WATERMARK,
      MemoryEventType.TASK_COMPLETED,
      MemoryEventType.ARCHITECTURAL_DECISIONS_ACCUMULATED,
    ]

    for (const type of expected) {
      expect(types.filter(t => t === type)).toHaveLength(1)
    }
    expect(new Set(types).size).toBe(types.length)
  })
})

describe('EventDetector — PHASE_CHANGED and MODULE_CHANGE', () => {
  it('emits PHASE_CHANGED when phaseChanged with a newPhase', async () => {
    const detector = new EventDetector()
    const events = await detector.detect(ctx({ phaseChanged: true, newPhase: 'build' }))
    expect(events).toHaveLength(1)
    expect(events[0]?.type).toBe(MemoryEventType.PHASE_CHANGED)
    expect(events[0]?.context.phase).toBe('build')
  })

  it('emits MODULE_CHANGE when moduleChanged with a newModule', async () => {
    const detector = new EventDetector()
    const events = await detector.detect(ctx({ moduleChanged: true, newModule: 'billing' }))
    expect(events).toHaveLength(1)
    expect(events[0]?.type).toBe(MemoryEventType.MODULE_CHANGE)
    expect(events[0]?.context.module).toBe('billing')
  })

  it('emits PRE_SPRINT_GENERATION when requested', async () => {
    const detector = new EventDetector()
    const events = await detector.detect(ctx({ sprintGenerationRequested: true }))
    expect(events).toHaveLength(1)
    expect(events[0]?.type).toBe(MemoryEventType.PRE_SPRINT_GENERATION)
  })
})
