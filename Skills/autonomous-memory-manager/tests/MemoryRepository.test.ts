import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as os from 'os'
import { MemoryRepository } from '../src/MemoryRepository'
import type { ProjectState } from '../schemas/knowledge-objects'
import { makeDecision } from './fixtures'

let tmpDir: string

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'amm-repo-test-'))
})

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true })
})

describe('MemoryRepository — read/write round trip', () => {
  it('returns null for a project with no state yet', async () => {
    const repo = new MemoryRepository(tmpDir)
    expect(await repo.getProjectState('nonexistent')).toBeNull()
  })

  it('persists and reloads a ProjectState verbatim', async () => {
    const repo = new MemoryRepository(tmpDir)
    const state: ProjectState = {
      projectId: 'proj-x',
      snapshotDate: '2026-01-01T00:00:00.000Z',
      objects: [makeDecision({ id: 'DEC-900' })],
      archives: [],
      lastAmmRun: '2026-01-01T00:00:00.000Z',
      version: 1,
    }

    const writeResult = await repo.saveProjectState(state)
    expect(writeResult.success).toBe(true)

    const reloaded = await repo.getProjectState('proj-x')
    expect(reloaded).toEqual(state)
  })

  it('writeObjects upserts by id without duplicating', async () => {
    const repo = new MemoryRepository(tmpDir)
    const original = makeDecision({ id: 'DEC-901', title: 'Original title text here' })
    await repo.writeObjects('proj-y', [original])

    const updated = makeDecision({ id: 'DEC-901', title: 'Updated title text here' })
    await repo.writeObjects('proj-y', [updated])

    const state = await repo.getProjectState('proj-y')
    expect(state!.objects).toHaveLength(1)
    expect((state!.objects[0] as { title: string }).title).toBe('Updated title text here')
  })
})

describe('MemoryRepository — query filtering', () => {
  it('filters by type, status, and impact', async () => {
    const repo = new MemoryRepository(tmpDir)
    await repo.writeObjects('proj-q', [
      makeDecision({ id: 'DEC-910', status: 'Accepted', impact: 'High' }),
      makeDecision({ id: 'DEC-911', status: 'Rejected', impact: 'Low' }),
    ])

    const accepted = await repo.queryObjects('proj-q', { filter: { status: 'Accepted' } })
    expect(accepted.map(o => o.id)).toEqual(['DEC-910'])

    const lowImpact = await repo.queryObjects('proj-q', { filter: { impact: 'Low' } })
    expect(lowImpact.map(o => o.id)).toEqual(['DEC-911'])
  })
})

describe('MemoryRepository — cumulative metrics', () => {
  it('increments sessionCount across appendSessionMetrics calls', async () => {
    const repo = new MemoryRepository(tmpDir)
    const metrics = {
      sessionId: 's1',
      runId: 'run-1',
      triggeredBy: 'TASK_COMPLETED',
      startedAt: '2026-01-01T00:00:00.000Z',
      completedAt: '2026-01-01T00:00:01.000Z',
      durationMs: 1000,
      contextSaved: 10,
      compressionRatio: 1.2,
      knowledgePreservedPercent: 100,
      duplicateReduction: 0,
      estimatedTokenSavings: 8,
      knowledgeDensity: 0.01,
      objectsCreated: 1,
      objectsMerged: 0,
      objectsArchived: 0,
      objectsPromoted: 0,
      objectsDemoted: 0,
      byTier: {
        working: { objectCount: 0, totalTokens: 0, avgObjectTokens: 0 },
        project: { objectCount: 1, totalTokens: 100, avgObjectTokens: 100 },
        permanent: { objectCount: 0, totalTokens: 0, avgObjectTokens: 0 },
      },
      byType: {},
    }

    await repo.appendSessionMetrics('proj-m', metrics)
    await repo.appendSessionMetrics('proj-m', { ...metrics, runId: 'run-2' })

    const cumulative = await repo.getMetrics('proj-m')
    expect(cumulative!.sessionCount).toBe(2)
    expect(cumulative!.sessions).toHaveLength(2)
  })
})
