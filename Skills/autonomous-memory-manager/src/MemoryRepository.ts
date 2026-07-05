import * as fs from 'fs/promises'
import * as path from 'path'
import { IMemoryRepository, QueryOptions, WriteResult } from '../schemas/repository'
import { ProjectState, AnyKnowledgeObject, ArchiveRecord, PRIORITY_ORDER, IMPACT_ORDER } from '../schemas/knowledge-objects'
import { SessionMetrics, CumulativeMetrics } from '../schemas/metrics'

export class MemoryRepository implements IMemoryRepository {
  constructor(private readonly basePath: string) {}

  async getProjectState(projectId: string): Promise<ProjectState | null> {
    try {
      const raw = await fs.readFile(this.statePath(projectId), 'utf-8')
      return JSON.parse(raw) as ProjectState
    } catch {
      return null
    }
  }

  async saveProjectState(state: ProjectState): Promise<WriteResult> {
    try {
      const filePath = this.statePath(state.projectId)
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, JSON.stringify(state, null, 2), 'utf-8')
      return { success: true, written: 1, failed: 0 }
    } catch (error) {
      return { success: false, written: 0, failed: 1, errors: [String(error)] }
    }
  }

  async queryObjects(projectId: string, options?: QueryOptions): Promise<AnyKnowledgeObject[]> {
    const state = await this.getProjectState(projectId)
    if (!state) return []

    let result = state.objects

    if (options?.filter) {
      const f = options.filter
      result = result.filter(obj => {
        if (f.type) {
          const types = Array.isArray(f.type) ? f.type : [f.type]
          if (!types.includes(obj.type)) return false
        }
        if (f.tier) {
          const tiers = Array.isArray(f.tier) ? f.tier : [f.tier]
          if (!tiers.includes(obj.tier)) return false
        }
        if (f.status) {
          const statuses = Array.isArray(f.status) ? f.status : [f.status]
          if (!statuses.includes(obj.status)) return false
        }
        if (f.priority) {
          const priorities = Array.isArray(f.priority) ? f.priority : [f.priority]
          if (!priorities.includes(obj.priority)) return false
        }
        if (f.impact) {
          const impacts = Array.isArray(f.impact) ? f.impact : [f.impact]
          if (!impacts.includes(obj.impact)) return false
        }
        if (f.ids) {
          if (!f.ids.includes(obj.id)) return false
        }
        if (f.tags?.length) {
          const hasTag = f.tags.some(tag => obj.tags?.includes(tag))
          if (!hasTag) return false
        }
        return true
      })
    }

    if (options?.sortBy) {
      const order = options.sortOrder ?? 'desc'
      result = [...result].sort((a, b) => {
        let cmp = 0
        switch (options.sortBy) {
          case 'priority': cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]; break
          case 'impact':   cmp = IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact]; break
          case 'updated':  cmp = a.updated.localeCompare(b.updated); break
          case 'created':  cmp = a.created.localeCompare(b.created); break
        }
        return order === 'asc' ? cmp : -cmp
      })
    }

    if (options?.limit) {
      result = result.slice(0, options.limit)
    }

    return result
  }

  async getObjectById(projectId: string, id: string): Promise<AnyKnowledgeObject | null> {
    const state = await this.getProjectState(projectId)
    return state?.objects.find(o => o.id === id) ?? null
  }

  async writeObjects(projectId: string, objects: AnyKnowledgeObject[]): Promise<WriteResult> {
    const state = await this.getProjectState(projectId) ?? this.emptyState(projectId)
    const existingMap = new Map(state.objects.map(o => [o.id, o]))

    for (const obj of objects) {
      existingMap.set(obj.id, obj)
    }

    const newState: ProjectState = {
      ...state,
      objects: [...existingMap.values()],
      snapshotDate: new Date().toISOString(),
      version: state.version + 1,
    }

    return this.saveProjectState(newState)
  }

  async archiveObject(projectId: string, archive: ArchiveRecord): Promise<WriteResult> {
    const state = await this.getProjectState(projectId)
    if (!state) return { success: false, written: 0, failed: 1, errors: ['State not found'] }

    const newState: ProjectState = {
      ...state,
      objects: state.objects.filter(o => o.id !== archive.archivedId),
      archives: [...state.archives, archive],
      snapshotDate: new Date().toISOString(),
      version: state.version + 1,
    }

    return this.saveProjectState(newState)
  }

  async getMetrics(projectId: string): Promise<CumulativeMetrics | null> {
    try {
      const raw = await fs.readFile(this.metricsPath(projectId), 'utf-8')
      return JSON.parse(raw) as CumulativeMetrics
    } catch {
      return null
    }
  }

  async appendSessionMetrics(projectId: string, metrics: SessionMetrics): Promise<WriteResult> {
    try {
      const existing = await this.getMetrics(projectId) ?? this.emptyCumulative(projectId)

      existing.sessionCount++
      existing.totalContextSaved += metrics.contextSaved
      existing.avgCompressionRatio = this.rollingAvg(
        existing.avgCompressionRatio, metrics.compressionRatio, existing.sessionCount
      )
      existing.avgKnowledgeDensity = this.rollingAvg(
        existing.avgKnowledgeDensity, metrics.knowledgeDensity, existing.sessionCount
      )
      existing.sessions.push(metrics)
      existing.lastUpdated = new Date().toISOString()
      existing.trendCompressionRatio = this.computeTrend(existing.sessions)

      const filePath = this.metricsPath(projectId)
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8')
      return { success: true, written: 1, failed: 0 }
    } catch (error) {
      return { success: false, written: 0, failed: 1, errors: [String(error)] }
    }
  }

  private rollingAvg(current: number, next: number, n: number): number {
    return (current * (n - 1) + next) / n
  }

  private computeTrend(sessions: SessionMetrics[]): 'Improving' | 'Stable' | 'Degrading' {
    if (sessions.length < 3) return 'Stable'
    const [first, , last] = sessions.slice(-3).map(s => s.compressionRatio)
    const delta = last! - first!
    if (delta > 0.05) return 'Improving'
    if (delta < -0.05) return 'Degrading'
    return 'Stable'
  }

  private statePath(projectId: string): string {
    return path.join(this.basePath, projectId, 'state.json')
  }

  private metricsPath(projectId: string): string {
    return path.join(this.basePath, projectId, 'metrics.json')
  }

  private emptyState(projectId: string): ProjectState {
    return {
      projectId,
      snapshotDate: new Date().toISOString(),
      objects: [],
      archives: [],
      lastAmmRun: new Date().toISOString(),
      version: 0,
    }
  }

  private emptyCumulative(projectId: string): CumulativeMetrics {
    return {
      projectId,
      sessionCount: 0,
      totalContextSaved: 0,
      avgCompressionRatio: 1.0,
      avgKnowledgeDensity: 0,
      trendCompressionRatio: 'Stable',
      lastUpdated: new Date().toISOString(),
      sessions: [],
    }
  }
}
