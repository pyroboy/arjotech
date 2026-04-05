# Layer 1: Core Memory

> **Imagine telling someone your name, your wife's name, your favorite programming language — and having to repeat it every single time you talk to them. That's what every AI assistant does. Layer 1 is the reason this one doesn't.**

Core Memory is the foundation of the entire intelligence system. It stores who the user is, what they've told the system, what the system has learned from its mistakes, and the operational directives that govern behavior. Without Layer 1, every conversation starts from zero. With it, the system accumulates a persistent identity model of the user and itself.

---

## How It Works

Layer 1 is backed by four DuckDB tables, each serving a distinct persistence role:

### The `facts` Table

This is the identity store. It holds atomic pieces of personal information about the user — their name, family members, preferences, roles, and anything they've explicitly stated about themselves.

```sql
CREATE TABLE facts (
  id UUID PRIMARY KEY,
  key VARCHAR,          -- 'wife', 'preferred_language', 'role'
  value VARCHAR,        -- 'Raclaire Stephan Magno', 'TypeScript', 'CTO'
  source VARCHAR,       -- 'user_note', 'inferred', 'correction'
  confidence FLOAT,     -- 0.0 to 1.0
  created_at TIMESTAMP
);
```

Every fact has a confidence score. User-stated facts (`source: 'user_note'`) get 0.9 confidence. Inferred facts start lower and can be promoted or demoted based on subsequent interactions. The `source` field creates an audit trail — you can always trace why the system believes something.

The facts table is **session-loaded**. A `brain_primer` process injects all facts into the system prompt at conversation start. This means the system knows who you are before you say a single word. It doesn't need to ask "what's your name?" — it already knows.

### The `memory` Table

This is the largest L1 table at 3,545 rows. It stores learned patterns, corrections, behavioral adjustments, and operational knowledge that the system has accumulated over time.

Unlike `facts` (which stores what the user *is*), `memory` stores what the system has *learned*. These are entries like:

- "User prefers pnpm over npm — enforced since 2026-03-15"
- "Never use `git add -A` in this project — user lost uncommitted work once"
- "When user says 'ultrathink', apply maximum reasoning depth"

Memory entries have temporal weight. Recent memories are weighted more heavily than old ones. The system uses a decay function — memories that haven't been reinforced in 30 days gradually lose influence. This prevents stale learned behaviors from overriding current preferences.

### The `operational_data` Table

This is the state machine backing store. With 611 rows, it persists the operational state of long-running processes — particularly the QRISPI pipeline (the 4-phase planning system). When the relay restarts, operational data survives. A planning session that was in the "Research" phase will resume exactly where it left off.

Operational data also stores configuration state: which loop agents are running, their last checkpoint, and their health status. It's the system's equivalent of `/var/run` — runtime state that must survive process restarts but isn't permanent knowledge.

### The `directives` Table

This is the governance layer. Directives are hard rules that override all other behavior — things like "never expose API keys in tool output" or "always confirm before destructive git operations." There's currently 1 directive, but the table is designed for growth. Directives have priority levels and can be scoped to specific contexts (relay-only, team-only, global).

---

## Why This Layer Exists

The fundamental problem with AI assistants is **amnesia**. Every conversation is independent. The user must re-establish context, re-state preferences, and re-explain corrections every single time. This isn't just annoying — it's actively harmful:

1. **Repeated mistakes**: Without memory of corrections, the system makes the same errors over and over. The user corrects "don't mock the database in tests" in session 1, and session 2 cheerfully suggests mocks.

2. **Lost identity**: Personal context matters. Knowing that the user is a CTO who prefers concise communication changes how every response should be structured. Without facts, the system defaults to generic behavior.

3. **Broken continuity**: Multi-session projects lose all momentum. Work done yesterday has to be re-discovered today through file reads and git logs instead of being instantly available.

4. **Configuration drift**: Without operational state persistence, every restart is a cold start. Pipeline states are lost, loop agent checkpoints vanish, and the system has to re-derive everything from scratch.

Layer 1 exists to make the AI **stateful**. Not in a temporary, in-context-window way — in a durable, survives-restart, accumulates-over-months way.

---

## Benefits to the System

### Personalization Without Prompting

Because facts are session-loaded, every response is automatically tailored. The system knows the user's expertise level, preferred tools, communication style, and domain context. A response to a data scientist looks different from a response to a frontend developer — and L1 is what makes that possible.

### Error Prevention Through Learned Corrections

The memory table contains 3,545 learned patterns. Many of these are negative patterns — things the system tried that failed, approaches the user rejected, commands that caused problems. Every new action is implicitly checked against this library of past mistakes. The system doesn't just avoid repeating its own errors — it avoids repeating errors from *other sessions* with the same user.

### Operational Resilience

Operational data means the system can crash, restart, and pick up exactly where it left off. A 4-phase QRISPI planning session doesn't need to restart from scratch. Loop agents resume their monitoring intervals. The system's runtime state is as durable as its knowledge.

### Governance Compliance

Directives provide a hard override layer. No matter what the user asks or what the AI infers, directives are non-negotiable. This is critical for safety — ensuring that destructive operations always require confirmation, that sensitive data is never exposed, and that security boundaries are maintained.

---

## When Layer 1 Fails

### Stale Facts

Facts can become outdated. If the user changes roles, moves to a new project, or updates their preferences, old facts persist until explicitly corrected. The confidence score helps — low-confidence inferred facts naturally decay — but high-confidence user-stated facts require manual intervention to update.

**Mitigation**: L5 (FrontalLobe) monitors for contradictions between new statements and existing facts. If the user says "I'm a backend engineer" but facts stores "role: frontend developer", L5 flags the conflict for resolution.

### Memory Bloat

At 3,545 rows and growing, the memory table risks becoming noisy. Not every learned pattern is equally valuable. Some are hyper-specific to a single session ("the test file was at /tmp/test_123.ts") and shouldn't persist.

**Mitigation**: Memory entries have decay scores. The system periodically garbage-collects entries that haven't been reinforced. L5's quality gate also filters new memory writes — not everything that *could* be remembered *should* be.

### Cold Start Problem

A brand-new user has an empty L1. The system has no facts, no memories, no operational state. It behaves like a generic AI assistant until it accumulates enough data. The first few sessions are necessarily less personalized.

**Mitigation**: The system actively mines early conversations for facts and preferences, aggressively populating L1 during the onboarding period. Initial conversation turns often yield 5-10 facts that dramatically improve subsequent interactions.

### Incorrect Learned Behaviors

If the system learns the wrong lesson from a correction — generalizing too broadly from a specific case — it can develop persistent bad habits. For example, if the user once said "don't add type annotations to this file," the system might incorrectly learn "never add type annotations anywhere."

**Mitigation**: Memory entries include context and scope. L5's quality gate evaluates whether new memories are appropriately scoped before persisting them. L6's reasoning engine cross-references learned behaviors against current context to detect overgeneralization.

---

## Communication & Connections

Layer 1 is the most-connected layer in the system. Almost every other layer either reads from or writes to L1:

- **L2 (Conversations)** → Writes to memory when conversation patterns are detected. Reads facts for context injection.
- **L2.5 (External Intelligence)** → Writes to memory when external knowledge is absorbed. Reads operational state for pipeline tracking.
- **L3 (Analytics)** → Reads operational data for event correlation. Writes to memory when analytics reveal behavioral patterns.
- **L4 (Context Tree)** → Cross-references facts for knowledge deduplication. Memory entries often graduate to context tree nodes when they're mature enough.
- **L5 (FrontalLobe)** → The primary governor of L1. Gates all writes to memory and facts. Detects conflicts, manages quality, triggers garbage collection.
- **L6 (Reasoning)** → Reads memory and facts for scoring context. Writes back when reasoning patterns are validated.
- **L7 (Embeddings)** → Embeds memory entries for semantic search. The `memory "topic"` query uses L7's vector matching.
- **L8 (Symbolic)** → Reads directives as axioms for formal verification. If a directive says "never delete production data," L8 treats that as a theorem to verify.

---

## When Layer 1 Is Most Impactful

Layer 1's impact is **inversely proportional to how much the user has to explain themselves**.

- **Returning users**: Maximum impact. The system knows who they are, what they prefer, what went wrong last time, and where they left off. The conversation starts at speed instead of from zero.

- **Multi-session projects**: High impact. Operational data preserves pipeline state. Memory preserves decisions and their rationale. The user doesn't need to re-explain "we chose approach X because of Y."

- **Error recovery**: High impact. When something breaks, the system checks error history, past corrections, and memory before attempting a fix. It doesn't re-try approaches that already failed.

- **First-time interactions**: Low impact — but accumulating fast. Every statement the user makes is a potential fact or memory entry. L1 is at its weakest on day one and at its strongest on day one hundred.

---

## Conclusion

Layer 1 is the bedrock. Without it, every other layer operates in a vacuum — L5 has nothing to govern, L6 has no user context to reason about, L7 has no memories to embed. Core Memory transforms the system from a stateless response machine into a persistent, accumulating intelligence that gets better with every conversation.

The design philosophy is simple: **the user should never have to repeat themselves**. Every fact stated, every correction given, every preference expressed is captured, validated, and persisted. The system's job is to remember so the user doesn't have to.

The 22 facts and 3,545 memories currently stored represent months of accumulated understanding. Each one makes the next conversation slightly more personalized, slightly more accurate, slightly less frustrating. That compound effect — the slow accumulation of institutional knowledge — is what separates L1 from a simple key-value store. It's not just storage. It's *learning*.
