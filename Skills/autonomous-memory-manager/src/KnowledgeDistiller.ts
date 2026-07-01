import {
  AnyKnowledgeObject,
  MemoryTier,
  LIFETIME_TO_TIER,
  PRIORITY_ORDER,
} from '../schemas/knowledge-objects'
import { MemoryEvent } from '../schemas/events'

export interface DistillationResult {
  extracted: AnyKnowledgeObject[]
  merged: AnyKnowledgeObject[]
  archived: string[]
  deduplicateCount: number
}

interface SimilarityMatch {
  existing: AnyKnowledgeObject
  candidate: AnyKnowledgeObject
  similarity: number
}

export class KnowledgeDistiller {
  private readonly MERGE_THRESHOLD = 0.85

  async distill(
    event: MemoryEvent,
    existingObjects: AnyKnowledgeObject[]
  ): Promise<DistillationResult> {
    const candidates = await this.extractCandidates(event)

    const { unique, merged, deduplicateCount } = this.deduplicateWith(candidates, existingObjects)

    const classified = unique.map(obj => this.assignTier(obj))

    const { toArchive } = this.applyDemotionPolicy(existingObjects)

    return {
      extracted: classified,
      merged,
      archived: toArchive.map(o => o.id),
      deduplicateCount,
    }
  }

  private async extractCandidates(_event: MemoryEvent): Promise<AnyKnowledgeObject[]> {
    // In a full runtime implementation this would parse the event context
    // and extract new knowledge objects from session data.
    // Current implementation: runtime provides pre-structured objects via event.metadata.
    const raw = _event.metadata?.candidates
    if (!Array.isArray(raw)) return []
    return raw as AnyKnowledgeObject[]
  }

  private deduplicateWith(
    candidates: AnyKnowledgeObject[],
    existing: AnyKnowledgeObject[]
  ): { unique: AnyKnowledgeObject[]; merged: AnyKnowledgeObject[]; deduplicateCount: number } {
    const unique: AnyKnowledgeObject[] = []
    const merged: AnyKnowledgeObject[] = []
    let deduplicateCount = 0

    for (const candidate of candidates) {
      const match = this.findBestMatch(candidate, existing)
      if (match) {
        merged.push(this.merge(match.existing, candidate))
        deduplicateCount++
      } else {
        unique.push(candidate)
      }
    }

    return { unique, merged, deduplicateCount }
  }

  private findBestMatch(
    candidate: AnyKnowledgeObject,
    existing: AnyKnowledgeObject[]
  ): SimilarityMatch | null {
    let best: SimilarityMatch | null = null

    for (const obj of existing) {
      if (obj.type !== candidate.type) continue
      const similarity = this.jaccard(
        this.primaryText(candidate),
        this.primaryText(obj)
      )
      if (similarity >= this.MERGE_THRESHOLD) {
        if (!best || similarity > best.similarity) {
          best = { existing: obj, candidate, similarity }
        }
      }
    }

    return best
  }

  private jaccard(a: string, b: string): number {
    const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(Boolean))
    const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(Boolean))
    if (wordsA.size === 0 && wordsB.size === 0) return 1.0
    const intersection = [...wordsA].filter(w => wordsB.has(w)).length
    const union = new Set([...wordsA, ...wordsB]).size
    return union === 0 ? 0 : intersection / union
  }

  private primaryText(obj: AnyKnowledgeObject): string {
    if ('title' in obj) return (obj as { title: string }).title
    if ('rule' in obj) return (obj as { rule: string }).rule
    if ('fact' in obj) return (obj as { fact: string }).fact
    if ('constraint' in obj) return (obj as { constraint: string }).constraint
    if ('risk' in obj) return (obj as { risk: string }).risk
    if ('task' in obj) return (obj as { task: string }).task
    if ('component' in obj) return (obj as { component: string }).component
    if ('milestone' in obj) return (obj as { milestone: string }).milestone
    if ('metric' in obj) return (obj as { metric: string }).metric
    return obj.id
  }

  private merge(
    existing: AnyKnowledgeObject,
    candidate: AnyKnowledgeObject
  ): AnyKnowledgeObject {
    const existingOrder = PRIORITY_ORDER[existing.priority]
    const candidateOrder = PRIORITY_ORDER[candidate.priority]
    const winner = candidateOrder <= existingOrder ? candidate : existing
    const loser = winner === candidate ? existing : candidate

    return {
      ...winner,
      updated: new Date().toISOString(),
      supersedes: [
        ...(winner.supersedes ?? []),
        loser.id,
        ...(loser.supersedes ?? []),
      ],
    }
  }

  private assignTier(obj: AnyKnowledgeObject): AnyKnowledgeObject {
    const tier: MemoryTier = LIFETIME_TO_TIER[obj.lifetime] ?? 'Project'
    return { ...obj, tier }
  }

  private applyDemotionPolicy(
    objects: AnyKnowledgeObject[]
  ): { active: AnyKnowledgeObject[]; toArchive: AnyKnowledgeObject[] } {
    const activeIds = new Set(objects.map(o => o.id))

    const isReferenced = (id: string): boolean =>
      objects.some(o => o.dependencies.includes(id))

    const active: AnyKnowledgeObject[] = []
    const toArchive: AnyKnowledgeObject[] = []

    for (const obj of objects) {
      const TERMINAL_STATUSES = new Set(['Deprecated', 'Superseded', 'Done', 'Resolved', 'Cancelled', 'Rejected'])
      const isTerminal = TERMINAL_STATUSES.has(obj.status)
      const isLowValue = obj.impact === 'Low' && !isReferenced(obj.id)

      if (isTerminal && isLowValue) {
        toArchive.push(obj)
      } else {
        active.push(obj)
      }
    }

    return { active, toArchive }
  }
}
