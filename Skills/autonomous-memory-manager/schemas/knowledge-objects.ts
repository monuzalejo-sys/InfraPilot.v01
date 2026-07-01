export type KnowledgeObjectType =
  | 'Decision'
  | 'Policy'
  | 'Knowledge'
  | 'Constraint'
  | 'Risk'
  | 'Pending'
  | 'Architecture'
  | 'Roadmap'
  | 'Metric'

export type MemoryTier = 'Working' | 'Project' | 'Permanent'

export type Lifetime = 'Session' | 'Sprint' | 'Project' | 'Permanent'

export type Impact = 'High' | 'Medium' | 'Low'

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'

export interface KnowledgeObject {
  id: string
  type: KnowledgeObjectType
  tier: MemoryTier
  created: string
  updated: string
  lifetime: Lifetime
  impact: Impact
  priority: Priority
  status: string
  dependencies: string[]
  supersedes?: string[]
  tags?: string[]
}

export interface Decision extends KnowledgeObject {
  type: 'Decision'
  status: 'Accepted' | 'Pending' | 'Rejected' | 'Superseded'
  title: string
  description: string
  reason: string
}

export interface Policy extends KnowledgeObject {
  type: 'Policy'
  status: 'Active' | 'Deprecated'
  rule: string
  scope: string[]
}

export interface Knowledge extends KnowledgeObject {
  type: 'Knowledge'
  status: 'Current' | 'Deprecated'
  fact: string
  context?: string
  source?: string
}

export interface Constraint extends KnowledgeObject {
  type: 'Constraint'
  status: 'Active' | 'Resolved'
  constraint: string
  reason: string
}

export interface Risk extends KnowledgeObject {
  type: 'Risk'
  status: 'Open' | 'Mitigated' | 'Resolved'
  risk: string
  probability: Impact
  mitigation: string
}

export interface Pending extends KnowledgeObject {
  type: 'Pending'
  status: 'Blocked' | 'Ready' | 'In-Progress' | 'Done' | 'Cancelled'
  task: string
  reason: string
}

export interface Architecture extends KnowledgeObject {
  type: 'Architecture'
  status: 'Proposed' | 'Accepted' | 'Implemented' | 'Deprecated'
  component: string
  description: string
  pattern: string
}

export interface Roadmap extends KnowledgeObject {
  type: 'Roadmap'
  status: 'Planned' | 'In-Progress' | 'Done' | 'Cancelled'
  milestone: string
  description: string
  estimatedSprint?: number
}

export interface Metric extends KnowledgeObject {
  type: 'Metric'
  status: 'Improving' | 'Stable' | 'Degrading'
  metric: string
  value: number
  unit: string
  baseline?: number
  target?: number
}

export type AnyKnowledgeObject =
  | Decision
  | Policy
  | Knowledge
  | Constraint
  | Risk
  | Pending
  | Architecture
  | Roadmap
  | Metric

export interface ArchiveRecord {
  id: string
  archivedId: string
  archivedType: KnowledgeObjectType
  archivedAt: string
  reason: 'Deprecated' | 'Superseded' | 'Merged' | 'LowValue'
  supersededBy?: string
}

export interface ProjectState {
  projectId: string
  snapshotDate: string
  objects: AnyKnowledgeObject[]
  archives: ArchiveRecord[]
  lastAmmRun: string
  version: number
}

export const ID_PREFIXES: Record<KnowledgeObjectType, string> = {
  Decision: 'DEC',
  Policy: 'POL',
  Knowledge: 'KN',
  Constraint: 'CON',
  Risk: 'RSK',
  Pending: 'PEND',
  Architecture: 'ARCH',
  Roadmap: 'ROAD',
  Metric: 'MET',
}

export const LIFETIME_TO_TIER: Record<Lifetime, MemoryTier> = {
  Session: 'Working',
  Sprint: 'Project',
  Project: 'Project',
  Permanent: 'Permanent',
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
}

export const IMPACT_ORDER: Record<Impact, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
}
