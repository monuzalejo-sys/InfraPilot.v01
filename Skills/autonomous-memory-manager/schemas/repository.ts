import type {
  AnyKnowledgeObject,
  ArchiveRecord,
  KnowledgeObjectType,
  MemoryTier,
  Priority,
  Impact,
  Lifetime,
  ProjectState,
} from './knowledge-objects'
import type { SessionMetrics, CumulativeMetrics } from './metrics'

export interface QueryFilter {
  type?: KnowledgeObjectType | KnowledgeObjectType[]
  tier?: MemoryTier | MemoryTier[]
  status?: string | string[]
  lifetime?: Lifetime | Lifetime[]
  priority?: Priority | Priority[]
  impact?: Impact | Impact[]
  tags?: string[]
  ids?: string[]
}

export interface QueryOptions {
  filter?: QueryFilter
  limit?: number
  sortBy?: 'priority' | 'impact' | 'updated' | 'created'
  sortOrder?: 'asc' | 'desc'
}

export interface WriteResult {
  success: boolean
  written: number
  failed: number
  errors?: string[]
}

export interface IMemoryRepository {
  getProjectState(projectId: string): Promise<ProjectState | null>
  saveProjectState(state: ProjectState): Promise<WriteResult>

  queryObjects(projectId: string, options?: QueryOptions): Promise<AnyKnowledgeObject[]>
  getObjectById(projectId: string, id: string): Promise<AnyKnowledgeObject | null>
  writeObjects(projectId: string, objects: AnyKnowledgeObject[]): Promise<WriteResult>
  archiveObject(projectId: string, archive: ArchiveRecord): Promise<WriteResult>

  getMetrics(projectId: string): Promise<CumulativeMetrics | null>
  appendSessionMetrics(projectId: string, metrics: SessionMetrics): Promise<WriteResult>
}
