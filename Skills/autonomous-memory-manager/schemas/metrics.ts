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

/**
 * One agent spawn's outcome within a run. The learning signal for the
 * ADAPTIVE model-selection policy: runtimes without live token metering use
 * model tier (haiku/sonnet/opus) as the cost lever, and calibrate future
 * choices from these verdicts.
 */
export interface ModelOutcome {
  phase: string // 'analysis' | 'planning' | 'build:<step-id>' | 'verification' | 'fix' | 'reflection' | 'curation'
  model: string // 'haiku' | 'sonnet' | 'opus'
  verdict: 'ok' | 'fail' | 'escalate'
}

export interface SessionMetrics {
  sessionId: string
  runId: string
  triggeredBy: string
  startedAt: string
  completedAt: string
  durationMs: number

  modelOutcomes?: ModelOutcome[]

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
