import { MemoryEvent, MemoryEventType, EventContext, EventPriority, EVENT_PRIORITY_MAP } from '../schemas/events'

let eventCounter = 0

function generateEventId(): string {
  return `evt-${Date.now()}-${++eventCounter}`
}

export interface DetectionContext {
  projectId: string
  sessionId: string
  contextUsagePercent: number
  recentDecisionCount: number
  taskCompleted: boolean
  taskId?: string
  phaseChanged: boolean
  newPhase?: string
  moduleChanged: boolean
  newModule?: string
  sessionClosing: boolean
  sprintGenerationRequested: boolean
}

export type EventHandler = (event: MemoryEvent) => Promise<void>

export class EventDetector {
  readonly CONTEXT_HIGH_WATERMARK_PERCENT = 70
  readonly ARCHITECTURAL_DECISIONS_THRESHOLD = 3

  private handlers: EventHandler[] = []
  private lastRunAt: string | null = null

  onEvent(handler: EventHandler): void {
    this.handlers.push(handler)
  }

  async detect(ctx: DetectionContext): Promise<MemoryEvent[]> {
    const events: MemoryEvent[] = []

    if (ctx.sessionClosing) {
      events.push(this.build(MemoryEventType.SESSION_CLOSE, ctx))
    }

    if (ctx.contextUsagePercent >= this.CONTEXT_HIGH_WATERMARK_PERCENT) {
      events.push(this.build(MemoryEventType.CONTEXT_HIGH_WATERMARK, ctx, {
        contextUsagePercent: ctx.contextUsagePercent,
      }))
    }

    if (ctx.taskCompleted && ctx.taskId) {
      events.push(this.build(MemoryEventType.TASK_COMPLETED, ctx, {
        taskId: ctx.taskId,
      }))
    }

    if (ctx.phaseChanged && ctx.newPhase) {
      events.push(this.build(MemoryEventType.PHASE_CHANGED, ctx, {
        phase: ctx.newPhase,
      }))
    }

    if (ctx.recentDecisionCount >= this.ARCHITECTURAL_DECISIONS_THRESHOLD) {
      events.push(this.build(MemoryEventType.ARCHITECTURAL_DECISIONS_ACCUMULATED, ctx, {
        decisionCount: ctx.recentDecisionCount,
      }))
    }

    if (ctx.moduleChanged && ctx.newModule) {
      events.push(this.build(MemoryEventType.MODULE_CHANGE, ctx, {
        module: ctx.newModule,
      }))
    }

    if (ctx.sprintGenerationRequested) {
      events.push(this.build(MemoryEventType.PRE_SPRINT_GENERATION, ctx))
    }

    const deduped = this.deduplicate(events)
    await this.dispatch(deduped)
    return deduped
  }

  setLastRunAt(timestamp: string): void {
    this.lastRunAt = timestamp
  }

  getLastRunAt(): string | null {
    return this.lastRunAt
  }

  private build(
    type: MemoryEventType,
    ctx: DetectionContext,
    extras: Partial<EventContext> = {}
  ): MemoryEvent {
    return {
      id: generateEventId(),
      type,
      priority: EVENT_PRIORITY_MAP[type] as EventPriority,
      timestamp: new Date().toISOString(),
      context: {
        projectId: ctx.projectId,
        sessionId: ctx.sessionId,
        taskId: ctx.taskId,
        contextUsagePercent: ctx.contextUsagePercent,
        decisionCount: ctx.recentDecisionCount,
        ...extras,
      },
    }
  }

  private deduplicate(events: MemoryEvent[]): MemoryEvent[] {
    const seen = new Set<MemoryEventType>()
    return events.filter(e => {
      if (seen.has(e.type)) return false
      seen.add(e.type)
      return true
    })
  }

  private async dispatch(events: MemoryEvent[]): Promise<void> {
    for (const event of events) {
      for (const handler of this.handlers) {
        await handler(event)
      }
    }
  }
}
