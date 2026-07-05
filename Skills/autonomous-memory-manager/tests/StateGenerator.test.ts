import { describe, it, expect } from 'vitest'
import { StateGenerator } from '../src/StateGenerator'
import type { DistillationResult } from '../src/KnowledgeDistiller'
import { LIFETIME_TO_TIER } from '../schemas/knowledge-objects'
import type { ProjectState, Lifetime } from '../schemas/knowledge-objects'
import { makeDecision, makeEvent } from './fixtures'

function emptyDistillation(overrides: Partial<DistillationResult> = {}): DistillationResult {
  return {
    extracted: [],
    merged: [],
    archived: [],
    archivedReasons: {},
    demoted: [],
    deduplicateCount: 0,
    ...overrides,
  }
}

function emptyState(overrides: Partial<ProjectState> = {}): ProjectState {
  return {
    projectId: 'proj-1',
    snapshotDate: '2026-01-01T00:00:00.000Z',
    objects: [],
    archives: [],
    lastAmmRun: '2026-01-01T00:00:00.000Z',
    version: 0,
    ...overrides,
  }
}

describe('StateGenerator — tier <-> lifetime invariant (N-AMM-R4, N-AMM-R5, LIFETIME_TO_TIER)', () => {
  const lifetimes: Lifetime[] = ['Session', 'Sprint', 'Project', 'Permanent']

  it.each(lifetimes)('every persisted object with lifetime=%s carries the schema-mandated tier', (lifetime) => {
    const gen = new StateGenerator()
    const before = emptyState()
    const obj = makeDecision({ id: `DEC-${lifetime}`, lifetime, tier: LIFETIME_TO_TIER[lifetime] })

    const after = gen.generate(before, emptyDistillation({ extracted: [obj] }), makeEvent())

    const persisted = after.objects.find(o => o.id === obj.id)!
    expect(persisted.tier).toBe(LIFETIME_TO_TIER[lifetime])
  })

  it('every object in the generated state has exactly one tier value (N-AMM-R4)', () => {
    const gen = new StateGenerator()
    const before = emptyState()
    const objs = lifetimes.map(lifetime =>
      makeDecision({ id: `DEC-${lifetime}-2`, lifetime, tier: LIFETIME_TO_TIER[lifetime] })
    )

    const after = gen.generate(before, emptyDistillation({ extracted: objs }), makeEvent())

    for (const obj of after.objects) {
      expect(['Working', 'Project', 'Permanent']).toContain(obj.tier)
      expect(obj.tier).toBe(LIFETIME_TO_TIER[obj.lifetime])
    }
  })

  it('version increments by exactly 1 per generate() call', () => {
    const gen = new StateGenerator()
    const before = emptyState({ version: 7 })
    const after = gen.generate(before, emptyDistillation(), makeEvent())
    expect(after.version).toBe(8)
  })
})

describe('StateGenerator — demoted objects replace their prior version in place', () => {
  it('applies the demoted copy (not the stale original) to the resulting object list', () => {
    const gen = new StateGenerator()
    const original = makeDecision({ id: 'DEC-005', impact: 'Medium', updated: '2026-01-01T00:00:00.000Z' })
    const before = emptyState({ objects: [original] })
    const demotedCopy = { ...original, impact: 'Low' as const, updated: '2026-02-01T00:00:00.000Z' }

    const after = gen.generate(before, emptyDistillation({ demoted: [demotedCopy] }), makeEvent())

    const persisted = after.objects.find(o => o.id === 'DEC-005')!
    expect(persisted.impact).toBe('Low')
    expect(persisted.updated).toBe('2026-02-01T00:00:00.000Z')
    expect(after.objects).toHaveLength(1)
  })
})

describe('StateGenerator — archive records carry the correct reason', () => {
  it('uses archivedReasons over the status-based fallback', () => {
    const gen = new StateGenerator()
    const obj = makeDecision({ id: 'DEC-006', status: 'Superseded', lifetime: 'Sprint' })
    const before = emptyState({ objects: [obj] })

    const after = gen.generate(
      before,
      emptyDistillation({ archived: ['DEC-006'], archivedReasons: { 'DEC-006': 'Expired' } }),
      makeEvent()
    )

    expect(after.objects.find(o => o.id === 'DEC-006')).toBeUndefined()
    const record = after.archives.find(a => a.archivedId === 'DEC-006')!
    expect(record.reason).toBe('Expired')
  })
})
