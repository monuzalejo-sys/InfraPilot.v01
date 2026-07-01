import { ProjectState, AnyKnowledgeObject, ArchiveRecord } from '../schemas/knowledge-objects'
import { MemoryEvent } from '../schemas/events'
import { DistillationResult } from './KnowledgeDistiller'

export class StateGenerator {
  generate(
    before: ProjectState,
    distillation: DistillationResult,
    _event: MemoryEvent
  ): ProjectState {
    const archivedIds = new Set(distillation.archived)

    const supersededIds = new Set(
      distillation.merged.flatMap(m => m.supersedes ?? [])
    )

    // Also exclude objects that appear in distillation.merged (winner may have same ID as existing)
    const mergedIds = new Set(distillation.merged.map(m => m.id))

    const survivingObjects = before.objects.filter(
      obj => !archivedIds.has(obj.id) && !supersededIds.has(obj.id) && !mergedIds.has(obj.id)
    )

    const newObjects: AnyKnowledgeObject[] = [
      ...survivingObjects,
      ...distillation.extracted,
      ...distillation.merged,
    ]

    const newArchives = this.buildArchiveRecords(before, distillation)

    return {
      projectId: before.projectId,
      snapshotDate: new Date().toISOString(),
      objects: newObjects,
      archives: [...before.archives, ...newArchives],
      lastAmmRun: new Date().toISOString(),
      version: before.version + 1,
    }
  }

  private buildArchiveRecords(
    before: ProjectState,
    distillation: DistillationResult
  ): ArchiveRecord[] {
    const records: ArchiveRecord[] = []
    const now = new Date().toISOString()

    for (const id of distillation.archived) {
      const obj = before.objects.find(o => o.id === id)
      if (!obj) continue
      records.push({
        id: `archive-${Date.now()}-${id}`,
        archivedId: id,
        archivedType: obj.type,
        archivedAt: now,
        reason: obj.status === 'Deprecated' ? 'Deprecated' : 'LowValue',
      })
    }

    for (const merged of distillation.merged) {
      for (const supersededId of merged.supersedes ?? []) {
        const alreadyArchived = records.some(r => r.archivedId === supersededId)
        if (alreadyArchived) continue
        const obj = before.objects.find(o => o.id === supersededId)
        if (!obj) continue
        records.push({
          id: `archive-${Date.now()}-${supersededId}`,
          archivedId: supersededId,
          archivedType: obj.type,
          archivedAt: now,
          reason: 'Merged',
          supersededBy: merged.id,
        })
      }
    }

    return records
  }
}
