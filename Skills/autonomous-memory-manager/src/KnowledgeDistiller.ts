import {
  AnyKnowledgeObject,
  MemoryTier,
  LIFETIME_TO_TIER,
  PRIORITY_ORDER,
} from '../schemas/knowledge-objects'
import { MemoryEvent } from '../schemas/events'

export type ArchiveReason = 'Deprecated' | 'LowValue' | 'Expired'

export interface DistillationResult {
  extracted: AnyKnowledgeObject[]
  merged: AnyKnowledgeObject[]
  archived: string[]
  /** Archive reason per archived id — §5.3's two archival clauses (Low-value vs Sprint-expired) need different ArchiveRecord.reason values. */
  archivedReasons: Record<string, ArchiveReason>
  demoted: AnyKnowledgeObject[]
  deduplicateCount: number
}

interface SimilarityMatch {
  existing: AnyKnowledgeObject
  candidate: AnyKnowledgeObject
  similarity: number
}

// SPECIFICATION.md N-AMM-R6 sets the merge trigger at similarity > 0.85, and
// TECHNICAL-REPORT.md documents that figure against raw-word Jaccard. In
// practice raw-word Jaccard on real-world phrasing (synonyms, reordering,
// articles/prepositions) rarely clears 0.85 — TC-AMM-06/07 in
// tests/TEST-CASES.md demonstrate pairs that are obviously the same fact
// scoring 0.43-0.667. This constant is the deliberate deviation: Jaccard over
// normalized tokens (lowercased, accents stripped, ES/EN stopwords removed)
// with a lower, still-conservative threshold. Tune here only.
const NORMALIZED_JACCARD_THRESHOLD = 0.5

// Stopwords removed before similarity scoring. Small, deliberately
// conservative (function words only) so we don't erase the specific nouns
// that actually distinguish two candidate facts.
const STOPWORDS = new Set([
  // English
  'a', 'an', 'the', 'of', 'for', 'to', 'in', 'on', 'at', 'by', 'with', 'as',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'and', 'or', 'but',
  'this', 'that', 'these', 'those', 'it', 'its',
  // Spanish
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
  'para', 'por', 'con', 'en', 'y', 'o', 'pero', 'es', 'son', 'fue', 'fueron',
  'ser', 'estar', 'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
])

export class KnowledgeDistiller {
  private readonly MERGE_THRESHOLD = NORMALIZED_JACCARD_THRESHOLD

  async distill(
    event: MemoryEvent,
    existingObjects: AnyKnowledgeObject[]
  ): Promise<DistillationResult> {
    const candidates = await this.extractCandidates(event)

    const { unique, merged, deduplicateCount } = this.deduplicateWith(candidates, existingObjects)

    const classified = unique.map(obj => this.assignTier(obj))

    const { toArchive, demoted, archivedReasons } = this.applyDemotionPolicy(existingObjects)

    return {
      extracted: classified,
      merged,
      archived: toArchive.map(o => o.id),
      archivedReasons,
      demoted,
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

  /**
   * Normalizes text into a token set: lowercase, accents stripped, stopwords
   * removed. See NORMALIZED_JACCARD_THRESHOLD above for why this replaces
   * raw-word tokenization.
   */
  private normalizedTokens(text: string): Set<string> {
    const stripped = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // strip diacritics (tildes, etc.)
      .replace(/[^\p{L}\p{N}\s]/gu, ' ') // drop punctuation

    const tokens = stripped.split(/\s+/).filter(Boolean).filter(w => !STOPWORDS.has(w))
    return new Set(tokens)
  }

  private jaccard(a: string, b: string): number {
    const wordsA = this.normalizedTokens(a)
    const wordsB = this.normalizedTokens(b)
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
    // Unreachable given AnyKnowledgeObject's members, but keeps this total.
    return (obj as AnyKnowledgeObject).id
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

  /**
   * SPECIFICATION.md §5.3 + N-AMM-R9.
   *
   * §5.3: an object MUST be archived if it is terminal, unreferenced, and
   * Low impact.
   *
   * N-AMM-R9: before archiving ANY object, AMM MUST verify no active object
   * depends on it. If a dependency exists, the object MUST NOT be archived
   * — it MUST instead be demoted (impact: Low, status: Deprecated).
   *
   * The two rules interact on terminal, Low-impact objects that turn out to
   * still be referenced: §5.3's own "unreferenced" clause already keeps
   * them out of toArchive, but the pseudocode stopped there and just left
   * them untouched in `active`. R9 requires an explicit demotion action in
   * that case, so referenced callers see the object is on its way out.
   * Non-terminal or non-Low-impact referenced objects are left alone —
   * demotion only fires for objects that would otherwise have been
   * archived.
   *
   * Spec-vs-schema note: N-AMM-R9's literal text says "status: Deprecated",
   * but §4.3's per-type status tables only allow `Deprecated` for Policy,
   * Knowledge, and Architecture. Decision uses `Superseded`, Constraint and
   * Risk use `Resolved`, Pending and Roadmap use `Done` — none of those
   * types have a `Deprecated` member in their status union, and Metric has
   * no terminal status at all. The schema (§4.3) is the stricter, more
   * specific rule, so it wins per the task's spec-over-pseudocode
   * precedence: we keep the object's own already-terminal status untouched
   * and only force `impact: Low`, which is the demotion's real effect
   * (signals "won't be promoted, still protected from archival") and is
   * valid for every type.
   *
   * §5.3 also has a second, independent archival clause (SHOULD, not MUST):
   * a terminal, Sprint-lifetime object SHOULD be archived with reason
   * `Expired` once unreferenced, *regardless of impact* — Sprint objects
   * expire with the work that created them. That clause still routes
   * through the same N-AMM-R9 dependency check: if something still
   * references it, it is demoted instead of archived, same as the
   * Low-value path. The spec additionally requires that a reusable lesson
   * in a High-impact expiring object be extracted into a Knowledge object
   * first; this reference implementation cannot synthesize that extraction
   * on its own (extractCandidates is a passive, runtime-fed pipeline per
   * its own docstring), so it is a documented limitation, not a silent gap.
   */
  private applyDemotionPolicy(
    objects: AnyKnowledgeObject[]
  ): {
    active: AnyKnowledgeObject[]
    toArchive: AnyKnowledgeObject[]
    demoted: AnyKnowledgeObject[]
    archivedReasons: Record<string, ArchiveReason>
  } {
    const TERMINAL_STATUSES = new Set(['Deprecated', 'Superseded', 'Done', 'Resolved', 'Cancelled', 'Rejected'])

    const isReferenced = (id: string): boolean =>
      objects.some(o => o.dependencies.includes(id))

    const active: AnyKnowledgeObject[] = []
    const toArchive: AnyKnowledgeObject[] = []
    const demoted: AnyKnowledgeObject[] = []
    const archivedReasons: Record<string, ArchiveReason> = {}

    for (const obj of objects) {
      const isTerminal = TERMINAL_STATUSES.has(obj.status)
      const referenced = isReferenced(obj.id)
      const isLowValue = obj.impact === 'Low' && !referenced
      const isSprintExpired = obj.lifetime === 'Sprint' && !referenced

      if (isTerminal && (isLowValue || isSprintExpired)) {
        // §5.3: terminal + (Low impact | Sprint-expired) + unreferenced -> archive.
        toArchive.push(obj)
        archivedReasons[obj.id] = isLowValue ? 'LowValue' : 'Expired'
        continue
      }

      if (isTerminal && referenced && (obj.impact === 'Low' || obj.lifetime === 'Sprint')) {
        // N-AMM-R9: would otherwise be archived (either clause above), but
        // an active object depends on it -- demote instead of archiving
        // (see spec-vs-schema note above for why `status` is left as-is).
        const demotedObj: AnyKnowledgeObject = {
          ...obj,
          impact: 'Low',
          updated: new Date().toISOString(),
        }
        demoted.push(demotedObj)
        active.push(demotedObj)
        continue
      }

      active.push(obj)
    }

    return { active, toArchive, demoted, archivedReasons }
  }
}
