import { ProjectState, AnyKnowledgeObject } from '../schemas/knowledge-objects'
import { SessionMetrics, TierMetrics, TypeMetrics, EMPTY_TIER_METRICS } from '../schemas/metrics'

export interface MetricsInput {
  runId: string
  sessionId: string
  triggeredBy: string
  startedAt: string
  completedAt: string
  before: ProjectState
  after: ProjectState
}

export class MetricsEngine {
  compute(input: MetricsInput): SessionMetrics {
    const beforeTokens = this.estimateTokens(input.before)
    const afterTokens = this.estimateTokens(input.after)

    const objectsCreated = input.after.objects.filter(
      o => !input.before.objects.some(b => b.id === o.id)
    ).length

    const objectsMerged = input.after.objects.filter(o => {
      const prev = input.before.objects.find(b => b.id === o.id)
      if (!prev) return (o.supersedes?.length ?? 0) > 0
      return (o.supersedes?.length ?? 0) > (prev.supersedes?.length ?? 0)
    }).length

    const objectsArchived = input.after.archives.length - input.before.archives.length

    const objectsPromoted = input.after.objects.filter(o => {
      const prev = input.before.objects.find(b => b.id === o.id)
      return prev && prev.tier !== 'Permanent' && o.tier === 'Permanent'
    }).length

    const objectsDemoted = input.after.objects.filter(o => {
      const prev = input.before.objects.find(b => b.id === o.id)
      return prev && prev.tier === 'Permanent' && o.tier !== 'Permanent'
    }).length

    const contextSaved = Math.max(0, beforeTokens - afterTokens)
    const compressionRatio = afterTokens > 0 ? beforeTokens / afterTokens : 1.0
    const knowledgePreservedPercent = input.before.objects.length > 0
      ? Math.min(100, (input.after.objects.length / input.before.objects.length) * 100)
      : 100
    const duplicateReduction = Math.max(0,
      input.before.objects.length - (input.after.objects.length - objectsCreated)
    )
    const estimatedTokenSavings = contextSaved * 0.8
    const knowledgeDensity = afterTokens > 0
      ? input.after.objects.length / afterTokens
      : 0
    const durationMs =
      new Date(input.completedAt).getTime() - new Date(input.startedAt).getTime()

    return {
      sessionId: input.sessionId,
      runId: input.runId,
      triggeredBy: input.triggeredBy,
      startedAt: input.startedAt,
      completedAt: input.completedAt,
      durationMs,
      contextSaved,
      compressionRatio,
      knowledgePreservedPercent,
      duplicateReduction,
      estimatedTokenSavings,
      knowledgeDensity,
      objectsCreated,
      objectsMerged,
      objectsArchived,
      objectsPromoted,
      objectsDemoted,
      byTier: {
        working:   this.tierMetrics(input.after, 'Working'),
        project:   this.tierMetrics(input.after, 'Project'),
        permanent: this.tierMetrics(input.after, 'Permanent'),
      },
      byType: this.typeMetrics(input.before, input.after),
    }
  }

  emptyMetrics(
    runId: string,
    sessionId: string,
    triggeredBy: string,
    startedAt: string
  ): SessionMetrics {
    return {
      sessionId,
      runId,
      triggeredBy,
      startedAt,
      completedAt: new Date().toISOString(),
      durationMs: 0,
      contextSaved: 0,
      compressionRatio: 1.0,
      knowledgePreservedPercent: 100,
      duplicateReduction: 0,
      estimatedTokenSavings: 0,
      knowledgeDensity: 0,
      objectsCreated: 0,
      objectsMerged: 0,
      objectsArchived: 0,
      objectsPromoted: 0,
      objectsDemoted: 0,
      byTier: {
        working:   { ...EMPTY_TIER_METRICS },
        project:   { ...EMPTY_TIER_METRICS },
        permanent: { ...EMPTY_TIER_METRICS },
      },
      byType: {},
    }
  }

  private estimateTokens(state: ProjectState): number {
    return Math.ceil(JSON.stringify(state).length / 4)
  }

  private tierMetrics(state: ProjectState, tier: string): TierMetrics {
    const objects = state.objects.filter(o => o.tier === tier)
    const totalTokens = objects.reduce(
      (sum, o) => sum + Math.ceil(JSON.stringify(o).length / 4),
      0
    )
    return {
      objectCount: objects.length,
      totalTokens,
      avgObjectTokens: objects.length > 0 ? Math.ceil(totalTokens / objects.length) : 0,
    }
  }

  private typeMetrics(
    before: ProjectState,
    after: ProjectState
  ): Record<string, TypeMetrics> {
    const types = new Set([
      ...before.objects.map(o => o.type),
      ...after.objects.map(o => o.type),
    ])

    const result: Record<string, TypeMetrics> = {}

    for (const type of types) {
      const beforeObjs = before.objects.filter(o => o.type === type)
      const afterObjs  = after.objects.filter(o => o.type === type)
      result[type] = {
        count:    afterObjs.length,
        created:  afterObjs.filter(o => !beforeObjs.some(b => b.id === o.id)).length,
        merged:   afterObjs.filter(o => (o.supersedes?.length ?? 0) > 0).length,
        archived: beforeObjs.filter(o => !afterObjs.some(a => a.id === o.id)).length,
      }
    }

    return result
  }
}
