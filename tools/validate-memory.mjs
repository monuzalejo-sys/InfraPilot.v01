#!/usr/bin/env node
/**
 * ORION memory validator — checks an ORION project memory (state.json +
 * metrics.json) against the AMM knowledge-object schema
 * (Skills/autonomous-memory-manager/schemas/knowledge-objects.ts).
 *
 * Usage:  node validate-memory.mjs <memory-dir>
 *         node validate-memory.mjs C:\Users\Kalel\ORION\memory\infrapilot
 *
 * Exit codes: 0 = valid (warnings allowed), 1 = schema errors, 2 = unusable input.
 * Zero dependencies. This is the executable half of ORION's "compliance is
 * testable, not assertable" principle (RFC-0006) applied to memory files.
 */

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const TYPES = ['Decision', 'Policy', 'Knowledge', 'Constraint', 'Risk', 'Pending', 'Architecture', 'Roadmap', 'Metric']
const ID_PREFIXES = { Decision: 'DEC', Policy: 'POL', Knowledge: 'KN', Constraint: 'CON', Risk: 'RSK', Pending: 'PEND', Architecture: 'ARCH', Roadmap: 'ROAD', Metric: 'MET' }
const TIERS = ['Working', 'Project', 'Permanent']
const LIFETIMES = ['Session', 'Sprint', 'Project', 'Permanent']
const LIFETIME_TO_TIER = { Session: 'Working', Sprint: 'Project', Project: 'Project', Permanent: 'Permanent' }
const IMPACTS = ['High', 'Medium', 'Low']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']
const STATUS_BY_TYPE = {
  Decision: ['Accepted', 'Pending', 'Rejected', 'Superseded'],
  Policy: ['Active', 'Deprecated'],
  Knowledge: ['Current', 'Deprecated'],
  Constraint: ['Active', 'Resolved'],
  Risk: ['Open', 'Mitigated', 'Resolved'],
  Pending: ['Blocked', 'Ready', 'In-Progress', 'Done', 'Cancelled'],
  Architecture: ['Proposed', 'Accepted', 'Implemented', 'Deprecated'],
  Roadmap: ['Planned', 'In-Progress', 'Done', 'Cancelled'],
  Metric: ['Improving', 'Stable', 'Degrading'],
}
const PAYLOAD_BY_TYPE = {
  Decision: ['title', 'description', 'reason'],
  Policy: ['rule', 'scope'],
  Knowledge: ['fact'],
  Constraint: ['constraint', 'reason'],
  Risk: ['risk', 'probability', 'mitigation'],
  Pending: ['task', 'reason'],
  Architecture: ['component', 'description', 'pattern'],
  Roadmap: ['milestone', 'description'],
  Metric: ['metric', 'value', 'unit'],
}
const TERMINAL_STATUSES = new Set(['Deprecated', 'Superseded', 'Done', 'Resolved', 'Cancelled', 'Rejected'])
const ARCHIVE_REASONS = ['Deprecated', 'Superseded', 'Merged', 'LowValue', 'Expired']
const CURATION_THRESHOLD = 25

const errors = []
const warns = []
const err = (msg) => errors.push(msg)
const warn = (msg) => warns.push(msg)
const isIso = (s) => typeof s === 'string' && !Number.isNaN(Date.parse(s))

const dir = process.argv[2]
if (!dir) {
  console.error('Usage: node validate-memory.mjs <memory-dir>')
  process.exit(2)
}

function loadJson(name, required) {
  const p = join(dir, name)
  if (!existsSync(p)) {
    if (required) { console.error(`FATAL: ${p} not found`); process.exit(2) }
    return null
  }
  try {
    return JSON.parse(readFileSync(p, 'utf-8'))
  } catch (e) {
    console.error(`FATAL: ${name} is not valid JSON: ${e.message}`)
    process.exit(2)
  }
}

const state = loadJson('state.json', true)
const metrics = loadJson('metrics.json', false)

// ---- state.json: top level ----
if (typeof state.projectId !== 'string' || !state.projectId) err('state: projectId missing/empty')
if (!isIso(state.snapshotDate)) err('state: snapshotDate is not a valid ISO timestamp')
if (!isIso(state.lastAmmRun)) err('state: lastAmmRun is not a valid ISO timestamp')
if (!Number.isInteger(state.version) || state.version < 0) err('state: version must be a non-negative integer')
if (!Array.isArray(state.objects)) { err('state: objects must be an array'); state.objects = [] }
if (!Array.isArray(state.archives)) { err('state: archives must be an array'); state.archives = [] }

// ---- state.json: objects ----
const ids = new Set()
const archivedIds = new Set(state.archives.map(a => a?.archivedId).filter(Boolean))
const referenced = new Set()

for (const o of state.objects) {
  const label = o?.id ?? '<no id>'
  if (!o || typeof o !== 'object') { err(`object ${label}: not an object`); continue }

  // id + type + prefix
  if (typeof o.id !== 'string' || !o.id) err(`object ${label}: id missing`)
  else if (ids.has(o.id)) err(`object ${o.id}: duplicate id`)
  else ids.add(o.id)
  if (archivedIds.has(o.id)) err(`object ${o.id}: id also present in archives (ids must never be reused)`)
  if (!TYPES.includes(o.type)) { err(`object ${label}: invalid type '${o.type}'`); continue }
  const prefix = ID_PREFIXES[o.type]
  if (typeof o.id === 'string' && !new RegExp(`^${prefix}-\\d{3,}$`).test(o.id))
    err(`object ${label}: id doesn't match ${prefix}-NNN for type ${o.type}`)

  // enums
  if (!TIERS.includes(o.tier)) err(`object ${label}: invalid tier '${o.tier}'`)
  if (!LIFETIMES.includes(o.lifetime)) err(`object ${label}: invalid lifetime '${o.lifetime}'`)
  else if (LIFETIME_TO_TIER[o.lifetime] !== o.tier)
    err(`object ${label}: tier '${o.tier}' inconsistent with lifetime '${o.lifetime}' (expected '${LIFETIME_TO_TIER[o.lifetime]}')`)
  if (o.tier === 'Working') err(`object ${label}: Working-tier objects must not be persisted (N-AMM-R5)`)
  if (!IMPACTS.includes(o.impact)) err(`object ${label}: invalid impact '${o.impact}'`)
  if (!PRIORITIES.includes(o.priority)) err(`object ${label}: invalid priority '${o.priority}'`)
  if (!STATUS_BY_TYPE[o.type].includes(o.status))
    err(`object ${label}: status '${o.status}' not valid for ${o.type} (valid: ${STATUS_BY_TYPE[o.type].join('/')})`)

  // timestamps
  if (!isIso(o.created)) err(`object ${label}: created is not ISO`)
  if (!isIso(o.updated)) err(`object ${label}: updated is not ISO`)
  if (isIso(o.created) && isIso(o.updated) && Date.parse(o.updated) < Date.parse(o.created))
    err(`object ${label}: updated < created`)

  // payload
  for (const f of PAYLOAD_BY_TYPE[o.type])
    if (o[f] === undefined || o[f] === null || o[f] === '') err(`object ${label}: missing ${o.type} field '${f}'`)

  // dependencies
  if (!Array.isArray(o.dependencies)) err(`object ${label}: dependencies must be an array`)
  else for (const d of o.dependencies) referenced.add(d)
}

// dependency resolution (second pass, ids now complete)
for (const o of state.objects) {
  if (!Array.isArray(o?.dependencies)) continue
  for (const d of o.dependencies) {
    if (!ids.has(d) && !archivedIds.has(d)) err(`object ${o.id}: dependency '${d}' doesn't exist (active or archived)`)
    else if (archivedIds.has(d)) warn(`object ${o.id}: depends on archived '${d}'`)
  }
}

// ---- state.json: archives ----
for (const a of state.archives) {
  const label = a?.id ?? a?.archivedId ?? '<archive>'
  if (!a?.archivedId) err(`archive ${label}: archivedId missing`)
  if (!TYPES.includes(a?.archivedType)) err(`archive ${label}: invalid archivedType '${a?.archivedType}'`)
  if (!isIso(a?.archivedAt)) err(`archive ${label}: archivedAt is not ISO`)
  if (!ARCHIVE_REASONS.includes(a?.reason)) err(`archive ${label}: invalid reason '${a?.reason}' (valid: ${ARCHIVE_REASONS.join('/')})`)
}

// ---- curation signals (warnings) ----
const active = state.objects.filter(o => !TERMINAL_STATUSES.has(o?.status))
const archivable = state.objects.filter(o =>
  TERMINAL_STATUSES.has(o?.status) &&
  !referencedBy(o?.id) &&
  (o?.impact === 'Low' || o?.lifetime === 'Sprint'))
function referencedBy(id) { return state.objects.some(x => Array.isArray(x?.dependencies) && x.dependencies.includes(id) && !TERMINAL_STATUSES.has(x?.status)) }
if (archivable.length > 0)
  warn(`${archivable.length} object(s) archivable by curation: ${archivable.map(o => o.id).join(', ')}`)
if (state.objects.length > CURATION_THRESHOLD)
  warn(`state has ${state.objects.length} objects (> ${CURATION_THRESHOLD}) — run orion-curator to keep memory cheap to load`)

// ---- metrics.json ----
if (metrics) {
  if (metrics.projectId !== state.projectId)
    err(`metrics: projectId '${metrics.projectId}' ≠ state projectId '${state.projectId}'`)
  if (!Array.isArray(metrics.sessions)) err('metrics: sessions must be an array')
  else {
    if (metrics.sessionCount !== metrics.sessions.length)
      err(`metrics: sessionCount ${metrics.sessionCount} ≠ sessions.length ${metrics.sessions.length}`)
    metrics.sessions.forEach((s, i) => {
      for (const f of ['objectsCreated', 'objectsMerged', 'objectsArchived'])
        if (typeof s?.[f] !== 'number') err(`metrics session[${i}]: ${f} missing or not a number`)
      if (!isIso(s?.completedAt)) warn(`metrics session[${i}]: completedAt missing/not ISO`)
      if (s?.modelOutcomes !== undefined) {
        if (!Array.isArray(s.modelOutcomes)) err(`metrics session[${i}]: modelOutcomes must be an array`)
        else s.modelOutcomes.forEach((m, j) => {
          if (!m?.phase || !m?.model || !['ok', 'fail', 'escalate'].includes(m?.verdict))
            err(`metrics session[${i}].modelOutcomes[${j}]: needs {phase, model, verdict: ok|fail|escalate}`)
        })
      }
    })
  }
  if (!isIso(metrics.lastUpdated)) err('metrics: lastUpdated is not ISO')
} else {
  warn('metrics.json not found — reflector should create it on the next run')
}

// ---- report ----
const activeCount = active.length
console.log(`ORION memory validation — ${dir}`)
console.log(`  objects: ${state.objects.length} (${activeCount} active, ${state.objects.length - activeCount} terminal) | archives: ${state.archives.length} | version: ${state.version}${metrics ? ` | sessions: ${metrics.sessions?.length ?? '?'}` : ''}`)
for (const e of errors) console.log(`  ERROR ${e}`)
for (const w of warns) console.log(`  WARN  ${w}`)
console.log(errors.length === 0
  ? `  RESULT: VALID${warns.length ? ` (${warns.length} warning${warns.length > 1 ? 's' : ''})` : ''}`
  : `  RESULT: INVALID — ${errors.length} error(s)`)
process.exit(errors.length === 0 ? 0 : 1)
