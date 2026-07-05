import { EventDetector } from './EventDetector'
import { MemoryCurator } from './MemoryCurator'
import { KnowledgeDistiller } from './KnowledgeDistiller'
import { StateGenerator } from './StateGenerator'
import { MemoryRepository } from './MemoryRepository'
import { MetricsEngine } from './MetricsEngine'

export interface AmmConfig {
  projectId: string
  repositoryPath: string
  minBudgetRequired?: number
}

export interface AmmInstance {
  detector: EventDetector
  curator: MemoryCurator
  repository: MemoryRepository
}

export function createAmm(config: AmmConfig): AmmInstance {
  const repository    = new MemoryRepository(config.repositoryPath)
  const distiller     = new KnowledgeDistiller()
  const stateGen      = new StateGenerator()
  const metricsEngine = new MetricsEngine()

  const curator = new MemoryCurator(
    {
      projectId: config.projectId,
      minBudgetRequired: config.minBudgetRequired ?? 1000,
    },
    distiller,
    stateGen,
    repository,
    metricsEngine,
  )

  const detector = new EventDetector()
  detector.onEvent(async event => { await curator.onEvent(event) })

  return { detector, curator, repository }
}

export { EventDetector } from './EventDetector'
export { MemoryCurator } from './MemoryCurator'
export { KnowledgeDistiller } from './KnowledgeDistiller'
export { StateGenerator } from './StateGenerator'
export { MemoryRepository } from './MemoryRepository'
export { MetricsEngine } from './MetricsEngine'

export type { DetectionContext, EventHandler } from './EventDetector'
export type { DistillationResult, ArchiveReason } from './KnowledgeDistiller'
export type { RunResult, RunMode, CompletionHandler } from './MemoryCurator'
export type { MetricsInput } from './MetricsEngine'
