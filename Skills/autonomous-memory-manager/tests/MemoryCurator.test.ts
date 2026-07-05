import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as os from 'os'
import { MemoryCurator } from '../src/MemoryCurator'
import { KnowledgeDistiller } from '../src/KnowledgeDistiller'
import { StateGenerator } from '../src/StateGenerator'
import { MemoryRepository } from '../src/MemoryRepository'
import { MetricsEngine } from '../src/MetricsEngine'
import { MemoryEventType } from '../schemas/events'
import type { ProjectState } from '../schemas/knowledge-objects'
import { makeEvent, makeCandidatesEvent, makeRisk } from './fixtures'

let tmpDir: string

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'amm-test-'))
})

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true })
})

function buildCurator(projectId: string, basePath: string) {
  const repository = new MemoryRepository(basePath)
  const curator = new MemoryCurator(
    { projectId, minBudgetRequired: 1000 },
    new KnowledgeDistiller(),
    new StateGenerator(),
    repository,
    new MetricsEngine(),
  )
  return { curator, repository }
}

// TC-AMM-14
describe('MemoryCurator — empty state initialization (TC-AMM-14)', () => {
  it('creates state.json from nothing, version 1, empty arrays', async () => {
    const { curator, repository } = buildCurator('proj-empty', tmpDir)
    const result = await curator.onEvent(makeEvent())

    expect(result.success).toBe(true)
    const state = await repository.getProjectState('proj-empty')
    expect(state).not.toBeNull()
    expect(state!.version).toBe(1)
    expect(state!.objects).toEqual([])
    expect(state!.archives).toEqual([])
  })
})

// TC-AMM-10
describe('MemoryCurator — version increments (TC-AMM-10)', () => {
  it('increments version on every run', async () => {
    const { curator, repository } = buildCurator('proj-version', tmpDir)

    const seed: ProjectState = {
      projectId: 'proj-version',
      snapshotDate: new Date().toISOString(),
      objects: [],
      archives: [],
      lastAmmRun: new Date().toISOString(),
      version: 5,
    }
    await repository.saveProjectState(seed)

    const result = await curator.onEvent(makeEvent())
    expect(result.success).toBe(true)

    const after = await repository.getProjectState('proj-version')
    expect(after!.version).toBe(6)
  })
})

// TC-AMM-11
describe('MemoryCurator — concurrent runs are queued, not dropped (TC-AMM-11, N-AMM-R14)', () => {
  it('queues event B while event A runs; both succeed; version increments twice', async () => {
    const { curator, repository } = buildCurator('proj-concurrent', tmpDir)

    const eventA = makeEvent({ context: { projectId: 'proj-concurrent', sessionId: 's1' } })
    const eventB = makeEvent({ context: { projectId: 'proj-concurrent', sessionId: 's2' } })

    const [resultA, resultB] = await Promise.all([
      curator.onEvent(eventA),
      curator.onEvent(eventB),
    ])

    expect(resultA.success).toBe(true)
    expect(resultB.success).toBe(true)

    // Queued event resolves immediately with a placeholder result rather
    // than the real run outcome (see MemoryCurator.pendingResult) — the
    // durable proof that it actually ran, serially (not dropped, not
    // parallel) is the persisted state reaching version 2. The queued
    // continuation is fire-and-forget (setImmediate without awaiting it in
    // MemoryCurator.onEvent), so poll for it instead of guessing tick counts.
    const deadline = Date.now() + 2000
    let state = await repository.getProjectState('proj-concurrent')
    while ((state?.version ?? 0) < 2 && Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 10))
      state = await repository.getProjectState('proj-concurrent')
    }

    expect(state!.version).toBe(2)
  })
})

// TC-AMM-12
describe('MemoryCurator — metrics computed after every run (TC-AMM-12, N-AMM-R10)', () => {
  it('produces SessionMetrics with correct triggeredBy and object counts', async () => {
    const { curator, repository } = buildCurator('proj-metrics', tmpDir)

    const seed: ProjectState = {
      projectId: 'proj-metrics',
      snapshotDate: new Date().toISOString(),
      objects: [makeRisk({ id: 'RSK-100' })],
      archives: [],
      lastAmmRun: new Date().toISOString(),
      version: 3,
    }
    await repository.saveProjectState(seed)

    const candidate = makeRisk({ id: 'RSK-101', risk: 'Totally unrelated new fact about deployments' })
    const event = makeCandidatesEvent([candidate], {
      type: MemoryEventType.SESSION_CLOSE,
      priority: 'Critical',
      context: { projectId: 'proj-metrics', sessionId: 's1' },
    })

    const result = await curator.onEvent(event)

    expect(result.success).toBe(true)
    expect(result.metrics).toBeDefined()
    expect(result.metrics.triggeredBy).toBe(MemoryEventType.SESSION_CLOSE)
    expect(result.metrics.objectsCreated).toBe(1)
    expect(result.metrics.compressionRatio).toBeGreaterThan(0)
    expect(result.metrics.knowledgeDensity).toBeGreaterThan(0)

    const cumulative = await repository.getMetrics('proj-metrics')
    expect(cumulative?.sessionCount).toBe(1)
  })

  it('still computes metrics when no objects are modified (N-AMM-R10)', async () => {
    const { curator } = buildCurator('proj-metrics-empty', tmpDir)
    const result = await curator.onEvent(makeEvent())
    expect(result.metrics).toBeDefined()
    expect(result.metrics.objectsCreated).toBe(0)
  })
})

describe('MemoryCurator — emits AMM_RUN_COMPLETED (N-AMM-R11)', () => {
  it('calls onComplete handlers with metrics in metadata after a successful run', async () => {
    const repository = new MemoryRepository(tmpDir)
    const curator = new MemoryCurator(
      { projectId: 'proj-complete', minBudgetRequired: 1000 },
      new KnowledgeDistiller(),
      new StateGenerator(),
      repository,
      new MetricsEngine(),
    )

    let completedEvent: ReturnType<typeof makeEvent> | undefined
    curator.onComplete(event => { completedEvent = event })

    await curator.onEvent(makeEvent({ context: { projectId: 'proj-complete', sessionId: 's1' } }))

    expect(completedEvent).toBeDefined()
    expect(completedEvent!.type).toBe(MemoryEventType.AMM_RUN_COMPLETED)
    expect(completedEvent!.metadata?.metrics).toBeDefined()
  })
})
