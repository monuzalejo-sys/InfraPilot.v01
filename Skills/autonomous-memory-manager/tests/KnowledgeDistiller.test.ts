import { describe, it, expect } from 'vitest'
import { KnowledgeDistiller } from '../src/KnowledgeDistiller'
import { makeRisk, makeDecision, makePolicy, makePending, makeCandidatesEvent, makeEvent } from './fixtures'

describe('KnowledgeDistiller — deduplication / merge', () => {
  // TC-AMM-06 (adapted): normalized-token Jaccard, not raw-word Jaccard.
  // "Database fails under high load" vs "Database crashes under high load"
  // are near-synonyms describing the *same* risk in real prose; raw Jaccard
  // scores this 0.667 (below the spec's literal 0.85), which is exactly the
  // false-negative problem PEND-010 asked us to fix. With normalized tokens
  // and stopwords removed, "under" is dropped as a stopword-adjacent filler
  // in neither list actually -- the real effect is fewer denominator tokens
  // overall, pushing the score above our tuned 0.5 threshold.
  it('merges near-duplicate Risk objects describing the same fact', async () => {
    const distiller = new KnowledgeDistiller()
    const existing = [makeRisk({ id: 'RSK-001', risk: 'Database fails under high load' })]
    const candidate = makeRisk({ id: 'RSK-099', risk: 'Database crashes under high load' })

    const result = await distiller.distill(makeCandidatesEvent([candidate]), existing)

    expect(result.deduplicateCount).toBe(1)
    expect(result.merged).toHaveLength(1)
    expect(result.extracted).toHaveLength(0)
  })

  it('does NOT merge Risk objects describing genuinely different facts', async () => {
    const distiller = new KnowledgeDistiller()
    const existing = [makeRisk({ id: 'RSK-001', risk: 'Database fails under high load' })]
    const candidate = makeRisk({ id: 'RSK-050', risk: 'Frontend bundle size exceeds budget' })

    const result = await distiller.distill(makeCandidatesEvent([candidate]), existing)

    expect(result.deduplicateCount).toBe(0)
    expect(result.merged).toHaveLength(0)
    expect(result.extracted).toHaveLength(1)
  })

  // TC-AMM-07
  it('merge winner preserves higher-priority id and populates supersedes', async () => {
    const distiller = new KnowledgeDistiller()
    const existing = [
      makeDecision({
        id: 'DEC-001',
        title: 'Use PostgreSQL for primary storage as the main database',
        priority: 'Medium',
      }),
    ]
    const candidate = makeDecision({
      id: 'DEC-099',
      title: 'Use PostgreSQL for primary storage as the main database engine',
      priority: 'Critical',
    })

    const result = await distiller.distill(makeCandidatesEvent([candidate]), existing)

    expect(result.merged).toHaveLength(1)
    const winner = result.merged[0]!
    expect(winner.id).toBe('DEC-099') // Critical outranks Medium
    expect(winner.supersedes).toContain('DEC-001')
  })

  it('never merges objects of different types even with identical text', async () => {
    const distiller = new KnowledgeDistiller()
    const existing = [makePolicy({ id: 'POL-001', rule: 'Use PostgreSQL for primary storage' })]
    const candidate = makeDecision({ id: 'DEC-001', title: 'Use PostgreSQL for primary storage' })

    const result = await distiller.distill(makeCandidatesEvent([candidate]), existing)

    expect(result.merged).toHaveLength(0)
    expect(result.extracted).toHaveLength(1)
  })
})

describe('KnowledgeDistiller — tier classification (TC-AMM-13)', () => {
  it('assigns tier from lifetime per LIFETIME_TO_TIER', async () => {
    const distiller = new KnowledgeDistiller()
    const candidates = [
      makeDecision({ id: 'DEC-010', lifetime: 'Session' }),
      makeDecision({ id: 'DEC-011', lifetime: 'Sprint', title: 'Sprint decision unrelated text' }),
      makeDecision({ id: 'DEC-012', lifetime: 'Project', title: 'Project decision unrelated wording' }),
      makeDecision({ id: 'DEC-013', lifetime: 'Permanent', title: 'Permanent decision totally distinct' }),
    ]

    const result = await distiller.distill(makeCandidatesEvent(candidates), [])

    const byId = new Map(result.extracted.map(o => [o.id, o]))
    expect(byId.get('DEC-010')?.tier).toBe('Working')
    expect(byId.get('DEC-011')?.tier).toBe('Project')
    expect(byId.get('DEC-012')?.tier).toBe('Project')
    expect(byId.get('DEC-013')?.tier).toBe('Permanent')
  })
})

describe('KnowledgeDistiller — demotion / archival policy (TC-AMM-08/09, N-AMM-R9)', () => {
  // TC-AMM-08
  it('flags terminal, Low-impact, unreferenced objects for archival', async () => {
    const distiller = new KnowledgeDistiller()
    const existing = [
      makePolicy({ id: 'POL-003', status: 'Deprecated', impact: 'Low', dependencies: [] }),
      makePending({ id: 'PEND-010b', status: 'Done', impact: 'Low', dependencies: [] }),
    ]

    const result = await distiller.distill(makeEvent(), existing)

    expect(result.archived).toContain('POL-003')
    expect(result.archived).toContain('PEND-010b')
  })

  // TC-AMM-09
  it('does not archive a terminal Low-impact object that is still depended on', async () => {
    const distiller = new KnowledgeDistiller()
    const existing = [
      makePolicy({ id: 'POL-004', status: 'Deprecated', impact: 'Low', dependencies: [] }),
      makeDecision({ id: 'DEC-010', dependencies: ['POL-004'] }),
    ]

    const result = await distiller.distill(makeEvent(), existing)

    expect(result.archived).not.toContain('POL-004')
  })

  // New: N-AMM-R9 demotion branch specifically.
  it('demotes (rather than leaving untouched) a referenced terminal Low-impact object', async () => {
    const distiller = new KnowledgeDistiller()
    const existing = [
      makePolicy({ id: 'POL-004', status: 'Deprecated', impact: 'Low', dependencies: [] }),
      makeDecision({ id: 'DEC-010', dependencies: ['POL-004'] }),
    ]

    const result = await distiller.distill(makeEvent(), existing)

    expect(result.demoted.map(o => o.id)).toContain('POL-004')
    const demoted = result.demoted.find(o => o.id === 'POL-004')!
    expect(demoted.impact).toBe('Low')
    // updated timestamp must be bumped on demotion
    expect(demoted.updated).not.toBe(existing[0]!.updated)
  })

  it('does not demote a referenced object that is not terminal', async () => {
    const distiller = new KnowledgeDistiller()
    const existing = [
      makePolicy({ id: 'POL-005', status: 'Active', impact: 'Low', dependencies: [] }),
      makeDecision({ id: 'DEC-011', dependencies: ['POL-005'] }),
    ]

    const result = await distiller.distill(makeEvent(), existing)

    expect(result.demoted).toHaveLength(0)
    expect(result.archived).not.toContain('POL-005')
  })

  it('does not demote a referenced object whose impact is not Low', async () => {
    const distiller = new KnowledgeDistiller()
    const existing = [
      makePolicy({ id: 'POL-006', status: 'Deprecated', impact: 'High', dependencies: [] }),
      makeDecision({ id: 'DEC-012', dependencies: ['POL-006'] }),
    ]

    const result = await distiller.distill(makeEvent(), existing)

    expect(result.demoted).toHaveLength(0)
    expect(result.archived).not.toContain('POL-006')
  })
})

describe('KnowledgeDistiller — Sprint-lifetime expiration (§5.3 SHOULD clause)', () => {
  it('archives a terminal Sprint-lifetime object regardless of impact, reason Expired', async () => {
    const distiller = new KnowledgeDistiller()
    const existing = [
      makePending({
        id: 'PEND-020',
        status: 'Done',
        impact: 'High', // High impact does NOT protect Sprint objects from expiry
        lifetime: 'Sprint',
        dependencies: [],
      }),
    ]

    const result = await distiller.distill(makeEvent(), existing)

    expect(result.archived).toContain('PEND-020')
    expect(result.archivedReasons['PEND-020']).toBe('Expired')
  })

  it('demotes instead of archiving a Sprint-expired object that is still referenced', async () => {
    const distiller = new KnowledgeDistiller()
    const existing = [
      makePending({ id: 'PEND-021', status: 'Done', impact: 'High', lifetime: 'Sprint', dependencies: [] }),
      makeDecision({ id: 'DEC-020', dependencies: ['PEND-021'] }),
    ]

    const result = await distiller.distill(makeEvent(), existing)

    expect(result.archived).not.toContain('PEND-021')
    expect(result.demoted.map(o => o.id)).toContain('PEND-021')
  })

  it('does not expire a non-terminal Sprint object', async () => {
    const distiller = new KnowledgeDistiller()
    const existing = [
      makePending({ id: 'PEND-022', status: 'In-Progress', impact: 'High', lifetime: 'Sprint', dependencies: [] }),
    ]

    const result = await distiller.distill(makeEvent(), existing)

    expect(result.archived).not.toContain('PEND-022')
    expect(result.demoted).toHaveLength(0)
  })
})
