export interface TierMetrics {
  objectCount: number
  totalTokens: number
  avgObjectTokens: number
}

export interface TypeMetrics {
  count: number
  created: number
  merged: number
  archived: number
}

export interface SessionMetrics {
  sessionId: string
  runId: string
  triggeredBy: string
  startedAt: string
  completedAt: string
  durationMs: number

  contextSaved: number
  compressionRatio: number
  knowledgePreservedPercent: number
  duplicateReduction: number
  estimatedTokenSavings: number
  knowledgeDensity: number

  objectsCreated: number
  objectsMerged: number
  objectsArchived: number
  objectsPromoted: number
  objectsDemoted: number

  byTier: {
    working: TierMetrics
    project: TierMetrics
    permanent: TierMetrics
  }

  byType: Partial<Record<string, TypeMetrics>>
}

export interface CumulativeMetrics {
  projectId: string
  sessionCount: number
  totalContextSaved: number
  avgCompressionRatio: number
  avgKnowledgeDensity: number
  trendCompressionRatio: 'Improving' | 'Stable' | 'Degrading'
  lastUpdated: string
  sessions: SessionMetrics[]
}

export const EMPTY_TIER_METRICS: TierMetrics = {
  objectCount: 0,
  totalTokens: 0,
  avgObjectTokens: 0,
}
