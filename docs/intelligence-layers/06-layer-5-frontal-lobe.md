# Layer 5: FrontalLobe — Memory Governance

> **What happens when an AI system that never forgets starts remembering garbage? When contradictory facts coexist? When a confident but wrong memory overrides a correct but uncertain one? Layer 5 is the prefrontal cortex — the part of the brain that decides what's worth remembering, what's contradictory, and what needs to be forgotten.**

The FrontalLobe is the system's quality controller for all knowledge. It doesn't store knowledge itself — it governs how knowledge enters, persists, conflicts, and eventually expires across every other layer. Without L5, the system would accumulate an ever-growing pile of unvalidated, contradictory, duplicated information. With L5, every piece of knowledge passes through a quality gate before it's trusted.

---

## How It Works

Layer 5 operates through three tables and a set of governance processes:

### The `learnings` Table (21 rows)

Learnings represent validated patterns — things the system has confirmed through repeated experience:

```sql
CREATE TABLE learnings (
  id UUID PRIMARY KEY,
  category VARCHAR,          -- 'behavioral', 'technical', 'preference'
  pattern VARCHAR,           -- the learned pattern
  evidence JSON,             -- what supports this learning
  confidence FLOAT,          -- 0.0 to 1.0
  application_count INTEGER, -- how many times this has been applied
  last_applied TIMESTAMP,
  outcome_accuracy FLOAT,    -- how often applying this learning led to good outcomes
  created_at TIMESTAMP
);
```

A learning is more than a memory — it's a memory with a track record. The `outcome_accuracy` field tracks whether applying this learning actually improves results. A learning that says "use pnpm instead of npm" with 95% outcome accuracy is gold. A learning that says "always add error handling" with 40% outcome accuracy (because it sometimes adds unnecessary complexity) gets downgraded.

Learnings represent the system's **validated wisdom** — they've been tested, measured, and confirmed to work.

### The `knowledge_conflicts` Table (0 rows, ready)

This table detects and manages contradictions in the knowledge base:

```sql
CREATE TABLE knowledge_conflicts (
  id UUID PRIMARY KEY,
  fact_a_id VARCHAR,          -- first conflicting piece of knowledge
  fact_b_id VARCHAR,          -- second conflicting piece
  conflict_type VARCHAR,      -- 'contradiction', 'supersession', 'scope_overlap'
  resolution VARCHAR,         -- 'a_wins', 'b_wins', 'merged', 'unresolved'
  resolution_reason TEXT,
  confidence FLOAT,
  detected_at TIMESTAMP,
  resolved_at TIMESTAMP
);
```

The table is currently empty — not because conflicts don't exist, but because the detection system resolves them proactively. When L5 detects that a new fact contradicts an existing one (e.g., user says "I'm a backend engineer" but facts stores "role: frontend developer"), it resolves the conflict before it persists. Only unresolvable conflicts would be stored here for manual review.

Conflict types matter:
- **Contradiction** — A directly says the opposite of B. One must be wrong.
- **Supersession** — B is a newer version of A. A should be archived.
- **Scope overlap** — A and B are both partially true in different contexts. They need scoping, not resolution.

### The `learning_propagation` Table (2 rows)

This tracks how learnings spread through the system:

```sql
CREATE TABLE learning_propagation (
  id UUID PRIMARY KEY,
  learning_id UUID,
  source_layer VARCHAR,        -- where the learning originated
  target_layer VARCHAR,        -- where it was propagated to
  propagation_type VARCHAR,    -- 'direct', 'inference', 'cross_reference'
  impact_score FLOAT,          -- measured impact of propagation
  propagated_at TIMESTAMP
);
```

When a learning from L1 (Core Memory) is validated, it might be propagated to L4 (Context Tree) as a curated entry, or to L6 (Reasoning) as a scoring factor. Propagation tracking ensures the system knows which learnings have been distributed and whether that distribution improved outcomes.

### The Five Quality Gates

Every piece of knowledge that enters the system passes through L5's five-gate filter:

1. **Noise Gate** — Is this worth storing at all? "The test passed" is noise. "The test passed after we fixed the race condition by adding a mutex" is signal. The noise gate uses content analysis to distinguish information from knowledge.

2. **Deduplication Gate** — Does this already exist? Using Jaccard similarity (threshold > 0.7 for topics, exact match for URLs), L5 prevents the same knowledge from being stored multiple times. This is especially important for L2.5 external intelligence, where the same Stack Overflow answer might be fetched multiple times.

3. **Contradiction Gate** — Does this conflict with existing knowledge? If so, which is more credible? The resolution algorithm considers: recency (newer usually wins for technical facts), source reliability (user-stated > inferred), confidence scores, and corroboration from other sources.

4. **Scope Gate** — Is this appropriately scoped? A learning from one specific test file shouldn't be generalized to all test files. The scope gate evaluates whether the proposed knowledge applies broadly or narrowly, and stores it with appropriate scope metadata.

5. **Reality Filter** — Does this apply to our actual system? External intelligence about Python performance tips isn't relevant to a TypeScript project. The reality filter cross-references incoming knowledge against `system_capabilities` and the actual tech stack, boosting relevant content and demoting irrelevant content.

### The Self-Verification Process

`frontalSelfVerify()` runs periodically and performs maintenance:

- **Decay stale intel** — External intelligence older than its freshness threshold gets its decay_score reduced.
- **Auto-resolve conflicts** — Conflicts where one side has significantly higher confidence or recency are automatically resolved.
- **Update quality scores** — Learnings with new outcome data get their accuracy scores updated.
- **Garbage collection** — Knowledge that's been deprecated, superseded, or has decayed below minimum threshold is archived or deleted.

---

## Why This Layer Exists

The problem L5 solves is **knowledge entropy**. Without governance, knowledge systems degrade over time:

1. **Accumulation without curation**: Systems that only add knowledge and never remove it become noisy. The signal-to-noise ratio degrades until the knowledge base is more harmful than helpful — returning outdated advice alongside current best practices.

2. **Contradiction tolerance**: Without conflict detection, the system can simultaneously believe "use approach A" and "never use approach A." When both are present in context, the system's behavior becomes unpredictable — sometimes following A, sometimes avoiding it, with no consistent rationale.

3. **Scope creep**: A lesson learned in one narrow context gets applied everywhere. "Don't use mocks in integration tests" (correct and scoped) becomes "don't use mocks anywhere" (overgeneralized and harmful). Without scope governance, learnings spread beyond their valid boundaries.

4. **Quality blind spots**: Without outcome tracking, the system can't distinguish between "things I remember" and "things that actually work." A confident but wrong memory is worse than no memory at all — it produces confident but wrong behavior.

Layer 5 exists because **accumulating knowledge without governing it is worse than not having knowledge at all**. Curated, validated, properly-scoped knowledge is the goal. L5 is the mechanism that achieves it.

---

## Benefits to the System

### Knowledge Quality Assurance

Every fact, memory, context tree entry, and external intelligence item has been through the quality gate. This means downstream consumers (L6 Reasoning, L7 Embeddings, the QRISPI pipeline) can trust that the knowledge they're working with meets a minimum quality bar. No garbage in, less garbage out.

### Conflict-Free Knowledge Base

The contradiction gate ensures that the system's knowledge is internally consistent. You'll never get a recommendation that contradicts itself because two conflicting memories survived unchecked. When conflicts exist, they're detected and resolved — or explicitly flagged as unresolved.

### Appropriate Generalization

The scope gate prevents the "one bad experience ruins everything" problem. A failure in one specific context is scoped to that context, not generalized to all similar situations. This means the system maintains nuanced understanding — knowing when a pattern applies and when it doesn't.

### Self-Cleaning Knowledge

The self-verification process means the knowledge base improves over time, not just grows. Stale knowledge decays, wrong knowledge is corrected, and validated knowledge is promoted. The system's knowledge quality has a positive trajectory by design.

### Learning with Accountability

Every learning tracks its own outcome accuracy. The system knows which of its learned behaviors actually work. This accountability means L5 can deprecate learnings that looked good in theory but failed in practice — a form of empirical self-correction.

---

## When Layer 5 Fails

### Over-Aggressive Filtering

If the quality gates are too strict, valid knowledge gets rejected. A legitimate but unusual insight might fail the noise gate because it doesn't match expected patterns. Innovation often looks like noise at first.

**Mitigation**: Gate thresholds are configurable. The noise gate uses a conservative rejection threshold — it's biased toward inclusion over exclusion. Rejected items are logged, not silently dropped, so false rejections can be detected.

### Under-Detection of Conflicts

Subtle contradictions can slip through. "Use async/await for file I/O" and "prefer synchronous reads for small files" don't obviously contradict — they have overlapping but not identical scopes. The contradiction gate might miss this nuance.

**Mitigation**: L5 uses semantic similarity (via L7 embeddings when available) in addition to keyword matching for conflict detection. Near-miss conflicts are flagged for review rather than auto-resolved.

### Propagation Cascades

When a learning is propagated from L1 to L4 to L6, and then the original learning is found to be wrong, the propagation must be reversed across all target layers. This cascading correction is complex and can leave orphaned references.

**Mitigation**: The learning_propagation table tracks all propagation events, enabling targeted rollback. When a learning is deprecated, all propagated instances are identified and updated.

### Self-Verify Timing

The self-verification process runs periodically, not continuously. Knowledge that enters between verification cycles doesn't get immediate maintenance. In a high-frequency system, stale or conflicting knowledge can persist for hours.

**Mitigation**: Critical paths (QRISPI planning, user-facing responses) trigger on-demand verification for the specific knowledge they consume. Periodic verification handles the background maintenance.

---

## Communication & Connections

Layer 5 is unique in that it **governs** rather than stores. Its connections are governance relationships:

- **L1 (Core Memory)** → Gates all writes to facts and memory. Manages confidence scores. Triggers when new user statements conflict with stored facts.
- **L2 (Conversations)** → Reads sentiment data to inform quality scoring (knowledge that correlates with positive sentiment is weighted higher). Session summaries trigger learning extraction.
- **L2.5 (External Intelligence)** → The primary filtering target. All external content passes through all five gates. Manages the validity lifecycle (untested → proven → validated → failed).
- **L3 (Analytics)** → Reads outcome data to score learnings. Task success/failure data validates whether learned patterns actually improve performance.
- **L4 (Context Tree)** → Manages the graduation pipeline — which L1 memories deserve promotion to curated tree entries. Reviews tree entries for quality and freshness.
- **L6 (Reasoning)** → Provides validated learnings as inputs to the scoring system. Receives feedback on whether reasoned decisions (informed by L5-governed knowledge) led to good outcomes.
- **L7 (Embeddings)** → Uses semantic similarity for conflict detection and deduplication. Quality-scored entries inform embedding priority.
- **L8 (Symbolic)** → Provides high-confidence learnings as axioms for formal verification. If a learning has 99% outcome accuracy, L8 can treat it as a theorem.

---

## When Layer 5 Is Most Impactful

### After External Intelligence Ingestion

When L2.5 fetches results from multiple platforms, L5 is the bottleneck — in a good way. It filters noise, deduplicates, cross-references, and scores before anything reaches the knowledge base. Without L5, every Hacker News comment would be treated as authoritative.

### During Knowledge Contradiction Events

When the user says something that contradicts stored knowledge — changing roles, updating preferences, correcting a misconception — L5 orchestrates the resolution. It doesn't just overwrite; it evaluates which version is more credible and updates the knowledge graph accordingly.

### At System Scale

As the system accumulates more knowledge, L5 becomes more critical. At 100 memories, contradictions are rare. At 3,545 memories, they're inevitable. L5's governance scales with the knowledge base, maintaining quality even as volume increases.

### During QRISPI Planning

The Design phase of QRISPI specifically invokes L5 for conflict detection. Before committing to an architecture, L5 checks whether the proposed approach conflicts with any existing knowledge or known failure patterns.

---

## Conclusion

Layer 5 is the invisible guardian of knowledge quality. It doesn't appear in dashboards, doesn't generate user-visible output, and doesn't make decisions the user can see. But every fact the system states, every recommendation it makes, every learned behavior it applies has been filtered, validated, and governed by L5.

The five-gate quality system ensures that the knowledge base grows in quality, not just quantity. The conflict detection system prevents the system from contradicting itself. The outcome tracking system ensures that learnings are empirically validated, not just plausible. The self-verification process ensures that the knowledge base is self-cleaning.

In neuroscience, the prefrontal cortex is responsible for executive function — planning, decision-making, and moderating social behavior. Layer 5 plays exactly this role in the intelligence system. It doesn't do the thinking — it ensures that the thinking is done well, on the basis of reliable, consistent, properly-scoped knowledge.

Without Layer 5, the system would be a hoarder — keeping everything, trusting everything, contradicting itself freely. With Layer 5, it's a curator — keeping what matters, validating what it trusts, and gracefully updating when it learns it was wrong.
