import { MemoryEvent, MemoryEventType } from '../schemas/events'
import { ProjectState } from '../schemas/knowledge-objects'
import { SessionMetrics } from '../schemas/metrics'
import { KnowledgeDistiller } from './KnowledgeDistiller'
import { StateGenerator } from './StateGenerator'
import { MemoryRepository } from './MemoryRepository'
import { MetricsEngine } from './MetricsEngine'

export interface CuratorConfig {
  projectId: string
  minBudgetRequired: number
}

export type RunMode = 'full' | 'minimal'

export interface RunResult {
  success: boolean
  mode: RunMode
  metrics: SessionMetrics
  objectsWritten: number
  error?: string
}

export type CompletionHandler = (event: MemoryEvent) => void

export class MemoryCurator {
  private running = false
  private queue: MemoryEvent[] = []
  private completionHandlers: CompletionHandler[] = []

  constructor(
    private readonly config: CuratorConfig,
    private readonly distiller: KnowledgeDistiller,
    private readonly stateGenerator: StateGenerator,
    private readonly repository: MemoryRepository,
    private readonly metricsEngine: MetricsEngine,
  ) {}

  onComplete(handler: CompletionHandler): void {
    this.completionHandlers.push(handler)
  }

  async onEvent(event: MemoryEvent): Promise<RunResult> {
    if (this.running) {
      this.queue.push(event)
      return this.pendingResult(event)
    }

    this.running = true
    try {
      return await this.run(event)
    } finally {
      this.running = false
      if (this.queue.length > 0) {
        const next = this.queue.shift()!
        setImmediate(() => this.onEvent(next))
      }
    }
  }

  private async run(event: MemoryEvent): Promise<RunResult> {
    const runId = `amm-run-${Date.now()}`
    const startedAt = new Date().toISOString()
    const mode = this.selectMode(event)

    try {
      const existing = await this.repository.getProjectState(this.config.projectId)
      const before = existing ?? this.emptyState()

      const distillation = await this.distiller.distill(event, before.objects)

      const after = this.stateGenerator.generate(before, distillation, event)

      const writeResult = await this.repository.saveProjectState(after)

      const completedAt = new Date().toISOString()
      const metrics = this.metricsEngine.compute({
        runId,
        sessionId: event.context.sessionId,
        triggeredBy: event.type,
        startedAt,
        completedAt,
        before,
        after,
      })

      await this.repository.appendSessionMetrics(this.config.projectId, metrics)

      // N-AMM-R11: emit AMM_RUN_COMPLETED after every successful run
      const completionEvent: MemoryEvent = {
        id: `evt-${Date.now()}-completed`,
        type: MemoryEventType.AMM_RUN_COMPLETED,
        priority: 'Low',
        timestamp: completedAt,
        context: event.context,
        metadata: { metrics },
      }
      for (const handler of this.completionHandlers) {
        handler(completionEvent)
      }

      return {
        success: writeResult.success,
        mode,
        metrics,
        objectsWritten: writeResult.written,
      }
    } catch (error) {
      const metrics = this.metricsEngine.emptyMetrics(
        runId, event.context.sessionId, event.type, startedAt
      )
      return {
        success: false,
        mode,
        metrics,
        objectsWritten: 0,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  private selectMode(event: MemoryEvent): RunMode {
    // Reserved for future budget-aware mode selection
    return 'full'
  }

  private pendingResult(event: MemoryEvent): RunResult {
    const now = new Date().toISOString()
    return {
      success: true,
      mode: 'full',
      metrics: this.metricsEngine.emptyMetrics(
        `queued-${Date.now()}`,
        event.context.sessionId,
        event.type,
        now
      ),
      objectsWritten: 0,
    }
  }

  private emptyState(): ProjectState {
    return {
      projectId: this.config.projectId,
      snapshotDate: new Date().toISOString(),
      objects: [],
      archives: [],
      lastAmmRun: new Date().toISOString(),
      version: 0,
    }
  }
}
