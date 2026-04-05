# Layer 2.5: External Intelligence

> **Your AI assistant lives in a bubble. It knows its training data and your local files — nothing else. Layer 2.5 pops that bubble, connecting the system to 55+ live web platforms so it can answer "what does the community think?" instead of just "what do I think?"**

Layer 2.5 is the system's window to the outside world. Through `opencli-rs`, a Rust CLI that leverages Chrome login sessions, the system can query Hacker News, Stack Overflow, Reddit, GitHub, ArXiv, and dozens more platforms. But raw web data is noisy. L2.5 doesn't just fetch — it absorbs, validates, cross-references, and curates external knowledge through a multi-stage pipeline governed by Layer 5's quality gates.

---

## How It Works

The external intelligence pipeline has four stages: **Fetch → Gate → Score → Store**.

### Stage 1: Fetch (opencli-rs)

`opencli-rs` is a Rust binary at `~/.local/bin/opencli-rs` that provides CLI access to 55+ web platforms. It uses Chrome's existing login sessions, meaning it can access authenticated content without storing credentials.

```bash
# Token-optimized: always use CSV format (-f csv)
opencli-rs hackernews top --limit 10 -f csv
opencli-rs stackoverflow search "DuckDB embedded" -f csv
opencli-rs reddit search "claude code tips" --subreddit programming -f csv
```

Two relay tools expose opencli-rs to the AI system:
- **`opencli_rs_query`** — Ad-hoc single queries. Used when the user asks a specific question or the system needs to check one platform.
- **`opencli_study`** — Haiku-powered capability-aware sweeps. This tool orchestrates multi-platform research campaigns, using the lightweight Haiku model to classify results and identify relevant content.

The fetch stage respects token budgets. All output uses `--format csv` (5x leaner than default table format), and results are truncated at 200 characters per source before entering LLM context. HTML is stripped via `stripHtml()` before any further processing.

### Stage 2: Quality Gate (L5 FrontalLobe)

Raw web data doesn't go directly into the knowledge base. It passes through Layer 5's quality gate, which applies five filters:

1. **Noise filter** — Removes low-signal content (memes, off-topic comments, spam-like patterns).
2. **URL deduplication** — Same URL from multiple fetches is stored once.
3. **Topic deduplication** — Uses Jaccard similarity (threshold > 0.7) to detect near-duplicate topics. "How to use DuckDB in Node" and "DuckDB Node.js tutorial" are recognized as the same topic.
4. **Reality filter** — Boosts content that references our actual stack (DuckDB, Electron, TypeScript, Ollama). Generic advice is scored lower than advice relevant to our specific technology choices.
5. **Credibility scoring** — Platform reputation, author karma/reputation, and community engagement (upvotes, accepted answers) contribute to a credibility score.

Only content that passes all five gates is persisted.

### Stage 3: Scoring & Cross-Referencing

Content that passes the gate gets scored along multiple dimensions:

```sql
CREATE TABLE external_intelligence (
  id UUID PRIMARY KEY,
  topic VARCHAR,
  content TEXT,
  source_platform VARCHAR,      -- 'hackernews', 'stackoverflow', 'reddit'
  source_url VARCHAR,
  community_signal FLOAT,       -- engagement score (upvotes, comments)
  technique_extracted VARCHAR,   -- what specific technique or approach was found
  platforms_seen INTEGER,        -- how many platforms mention this topic
  decay_score FLOAT,             -- freshness score, decreases over time
  validity VARCHAR,              -- 'untested', 'proven', 'validated', 'failed', 'deprecated'
  created_at TIMESTAMP
);
```

The **cross-platform triangulation** system is the key differentiator. When the same topic appears on three or more platforms, it's automatically promoted from "untested" to "proven." If a DuckDB optimization technique is discussed on Hacker News, recommended on Stack Overflow, and benchmarked on a dev blog, that convergence is a strong signal of validity.

### Stage 4: Storage & Classification

Validated content is stored in two locations:

1. **`external_intelligence` table** — The raw intelligence record with full metadata.
2. **`context_tree_nodes` under "External Intelligence" domain** — Auto-classified into per-platform topic nodes for hierarchical browsing and semantic search.

The L4 Context Tree integration means external knowledge becomes searchable alongside internal knowledge. A query for "DuckDB performance" returns both internally learned patterns and externally sourced techniques.

---

## Why This Layer Exists

AI systems suffer from **epistemic isolation**. They know their training data (which has a cutoff date) and whatever files exist locally. They don't know:

1. **What the community recommends**: The best approach to a problem might be a library released last month, a technique discussed on Hacker News yesterday, or a Stack Overflow answer with 500 upvotes. Without external intelligence, the system can only recommend what it already knows.

2. **Whether its knowledge is current**: Training data becomes stale. A library the system recommends might have been deprecated. A security vulnerability might have been discovered. External intelligence provides a reality check against the outside world.

3. **What emerging patterns exist**: Technology moves fast. New frameworks, new best practices, new anti-patterns emerge constantly. L2.5 gives the system a feed of what's trending, what's being discussed, and what's gaining traction.

4. **How others solve similar problems**: The most valuable external intelligence isn't facts — it's approaches. How did other teams handle DuckDB at scale? What patterns work for Electron apps with heavy file I/O? These are questions that local code can't answer.

Layer 2.5 exists because **an AI that only knows what's inside the repo is an AI working with incomplete information**.

---

## Benefits to the System

### Evidence-Based Recommendations

Instead of recommending approaches based purely on training data, the system can back its suggestions with community evidence. "This approach has 47 upvotes on Stack Overflow and was discussed favorably on Hacker News" is a stronger recommendation than "I think this might work."

### Trend Awareness

The system can detect when a technology is gaining or losing community support. If multiple platforms are discussing migration away from a library the project uses, that's a signal worth surfacing — even if the user hasn't asked about it.

### Validation of Internal Decisions

When the system or user makes a technical decision, L2.5 can cross-reference it against community consensus. "We chose approach X, and 3 Stack Overflow answers with high engagement also recommend X" provides confidence. Conversely, "we chose approach X, but the community strongly recommends Y" raises a valuable flag.

### Research Automation

The `opencli_study` tool turns research into a single command. Instead of manually visiting 5 platforms and synthesizing findings, the system sweeps relevant platforms, applies quality gates, and presents curated results. This turns a 30-minute manual research task into a 2-minute automated one.

### QRISPI Research Phase Enrichment

The QRISPI pipeline's Research phase (Stage 2) directly consumes L2.5 output. When planning a new feature, the system automatically queries relevant platforms for community approaches, common pitfalls, and recommended patterns. This means every planning session is informed by current community knowledge, not just the system's static training data.

---

## When Layer 2.5 Fails

### Platform Availability

opencli-rs depends on Chrome login sessions and platform APIs. If Chrome isn't running, sessions expire, or platforms change their API, fetches fail silently.

**Mitigation**: The fetch stage returns empty results rather than errors. The system continues functioning with internal knowledge only. `embeddings-status` includes platform connectivity checks.

### Information Quality Variance

Not all platforms are equally reliable. A Hacker News comment with 3 upvotes has very different credibility than a Stack Overflow accepted answer. The quality gate helps, but edge cases exist — viral but incorrect content can have high engagement scores.

**Mitigation**: The validity lifecycle (`untested → proven → validated → failed → deprecated`) provides ongoing verification. Content starts as untested regardless of engagement, and must accumulate cross-platform validation to advance.

### Decay and Staleness

External intelligence has a `decay_score` that decreases over time. A technique recommended a year ago might no longer be best practice. If the decay system is too aggressive, useful long-term knowledge is lost. Too conservative, and stale advice persists.

**Mitigation**: `frontalSelfVerify()` periodically decays stale intel, auto-resolves conflicts, and updates quality scores. Critical decisions always check the freshness of their source intelligence.

### Token Budget Pressure

External intelligence competes with internal knowledge for limited context window space. If the system spends too many tokens on external context, it has fewer for the actual task. The 200-character-per-source truncation helps, but multi-platform queries can still consume significant budget.

**Mitigation**: QRISPI applies hard caps — total input is capped at 12,000 characters. External intelligence is budgeted within this cap, not in addition to it.

### Relevance Drift

The reality filter boosts content mentioning our stack, but the stack evolves. If we adopt a new database or framework, the filter doesn't automatically adjust. Content about the new technology might be scored lower than it should be.

**Mitigation**: The reality filter's stack keywords are derived from `system_capabilities`, which is periodically updated. New technologies added to the capability registry automatically become boost targets.

---

## Communication & Connections

L2.5 has a focused but critical communication pattern:

- **L1 (Core Memory)** ← Reads user preferences and project context to inform queries. Writes to memory when significant external patterns are discovered.
- **L2 (Conversations)** → External queries are logged as conversation events, creating an audit trail of what was researched and when.
- **L4 (Context Tree)** → Validated intelligence is classified into context tree nodes under the "External Intelligence" domain. This makes it searchable alongside internal knowledge.
- **L5 (FrontalLobe)** → The primary gatekeeper. All external content passes through L5's five-gate quality filter before storage. L5 also manages the validity lifecycle and decay scoring.
- **L7 (Embeddings)** → Stored context tree nodes are embedded by Ollama for semantic search. A conceptual query like "how to optimize embedded databases" can surface relevant external intelligence even if the exact keywords don't match.
- **QRISPI Pipeline** → The Research phase directly queries L2.5 for community knowledge, making every planning session externally informed.

---

## When Layer 2.5 Is Most Impactful

### Technology Evaluation

When the user is choosing between competing approaches — database X vs Y, framework A vs B — L2.5 provides community signal that augments the system's internal analysis. "Stack Overflow has 3x more active questions about X than Y" is a meaningful data point.

### Debugging Unfamiliar Errors

When an error is encountered that doesn't match known patterns, L2.5 can search for the error message or stack trace across platforms. Community solutions found on Stack Overflow or GitHub Issues often resolve problems faster than first-principles debugging.

### Architecture Planning (QRISPI)

The Research phase of QRISPI is where L2.5 has its highest impact. Every planning session automatically includes current community approaches, common pitfalls, and recommended patterns for the specific technologies being used.

### Capability Discovery

When the user asks "can we do X?", L2.5 supplements `system_capabilities` with community evidence of whether X is feasible, which tools others use for it, and what the common approaches are.

---

## Conclusion

Layer 2.5 is the system's antidote to epistemic isolation. It connects an otherwise self-contained intelligence system to the collective knowledge of 55+ web platforms, turning community discussion into curated, scored, cross-referenced intelligence.

The five-stage quality gate prevents the garbage-in problem that plagues naive web scraping. Not everything on the internet is worth remembering — the FrontalLobe-governed pipeline ensures that only validated, relevant, properly scoped content enters the knowledge base.

The cross-platform triangulation system is perhaps the most elegant feature. A single source can be wrong, biased, or outdated. But when three independent platforms converge on the same recommendation, that convergence itself is a strong signal. Layer 2.5 captures and leverages that signal automatically.

In a world where technology evolves daily, an AI system that only knows its training data is an AI that's slowly going stale. Layer 2.5 keeps the system current — not by replacing its core knowledge, but by continuously enriching it with the best of what the community has to offer.
