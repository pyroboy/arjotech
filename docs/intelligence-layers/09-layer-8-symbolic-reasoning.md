# Layer 8: Symbolic Reasoning

> **Every other layer in this system deals with probability — likely patterns, approximate similarities, confidence scores. Layer 8 deals with certainty. It doesn't ask "is this probably correct?" It asks "can this be proven correct?" It's the difference between a weather forecast and a mathematical theorem.**

Layer 8 is the crown of the intelligence stack. While Layers 1-7 operate in the fuzzy world of natural language, heuristics, and statistical similarity, Layer 8 operates in the world of formal logic. It treats code invariants as mathematical claims, constructs proofs that these claims hold, and detects when changes violate proven properties. This is the system's mechanism for moving from "I think this is right" to "I can prove this is right."

---

## How It Works

### The `symbolic_artifacts` Table (6 rows)

Layer 8's entire state lives in a single table — lean by design:

```sql
CREATE TABLE symbolic_artifacts (
  id UUID PRIMARY KEY,
  claim VARCHAR,                -- the property being verified
  claim_type VARCHAR,           -- 'invariant', 'precondition', 'postcondition', 'conjecture'
  source_file VARCHAR,          -- which code file this relates to
  proof_status VARCHAR,         -- 'proven', 'refuted', 'pending', 'stale'
  proof_sketch TEXT,            -- the reasoning chain
  confidence FLOAT,             -- for conjectures: estimated likelihood
  dependencies JSON,            -- other artifacts this depends on
  last_verified TIMESTAMP,
  created_at TIMESTAMP
);
```

Six artifacts — that's not a failure of ambition. It's the reality of formal verification: every artifact represents a significant investment in precise reasoning. Each one is a claim about the code that has been either proven or is actively being investigated.

### Claim Types

Layer 8 works with four types of formal claims:

#### Invariants

Properties that must **always** hold, regardless of system state:

```
INVARIANT: context_tree_nodes.depth >= 0
PROOF: depth is set to 0 for domains, parent_depth + 1 for children.
       Domains have no parent (parent_id = NULL, depth = 0).
       Children compute depth from parent, which is always >= 0.
       Therefore depth >= 0 for all nodes. ∎
```

Invariants are the strongest claim type. Once proven, they're treated as axioms that other proofs can build on. If a code change violates an invariant, L8 immediately flags it — the change either needs to be adjusted or the invariant needs to be re-evaluated.

#### Preconditions

Properties that must hold **before** an operation executes:

```
PRECONDITION: Before inserting into context_tree_nodes,
  parent_id must reference an existing node OR be NULL (for domains).
PROOF: The insert function checks parentExists(parent_id) before write.
       NULL parent_id is explicitly allowed for node_type = 'domain'.
       Non-domain nodes require valid parent reference. ∎
```

Preconditions define the contract for system operations. They're the formal version of input validation — but instead of runtime checks, they're compile-time (or analysis-time) guarantees.

#### Postconditions

Properties that must hold **after** an operation completes:

```
POSTCONDITION: After context_tree_nodes INSERT,
  parent.entry_count = previous_count + 1
PROOF: The insert function executes UPDATE parent SET entry_count = 
       entry_count + 1 in the same transaction.
       DuckDB transaction guarantees atomicity. ∎
```

Postconditions define what "success" means for an operation. They turn implicit expectations ("I assume the parent count is updated") into explicit verified properties.

#### Conjectures

Unproven claims that the system believes are likely true based on evidence:

```
CONJECTURE: All DuckDB queries in RelayDuckDB.ts have LIMIT clauses
CONFIDENCE: 0.85
EVIDENCE: 47/51 observed queries include LIMIT.
          4 queries without LIMIT are COUNT() aggregations.
STATUS: pending — requires exhaustive code analysis to prove/refute
```

Conjectures are the frontier of L8's knowledge. They represent patterns the system has observed but hasn't formally verified. Each conjecture is an invitation for investigation — either proving it (adding it to the invariant library) or refuting it (identifying the counterexample and fixing it).

### The Verification Process

L8's verification follows a structured methodology:

1. **Claim Extraction**: Source code is analyzed for implicit claims. Type assertions, null checks, transaction boundaries, and state machine transitions all imply properties that can be formalized.

2. **Proof Construction**: For each claim, L8 constructs a reasoning chain. This isn't automated theorem proving (though it aspires to be) — it's structured logical reasoning about code behavior, grounded in the actual implementation.

3. **Dependency Tracking**: Proofs can depend on other proofs. If Proof A assumes Invariant B holds, that dependency is recorded. If Invariant B is later refuted, all dependent proofs are invalidated.

4. **Staleness Detection**: When the source code changes, proven artifacts become stale. L8 doesn't assume the proof still holds — it marks it as stale and queues re-verification. The `last_verified` timestamp tracks when each proof was last confirmed.

5. **Conjecture Investigation**: Pending conjectures are periodically investigated. Evidence is accumulated (or counterexamples found), and conjectures either graduate to proven invariants or are refuted and closed.

### State Machine Verification

One of L8's most powerful applications is verifying state machine correctness. The system contains several state machines (QRISPI pipeline phases, task lifecycle, team formation), and L8 verifies properties like:

- **Reachability**: Every defined state is reachable from the initial state.
- **No dead states**: Every state has at least one outgoing transition (except terminal states).
- **Determinism**: For any state and input, there's exactly one valid transition.
- **Termination**: All execution paths eventually reach a terminal state.

These properties are particularly valuable because state machine bugs are notoriously hard to detect through testing — they often require specific sequences of events that tests don't cover.

---

## Why This Layer Exists

The lower layers of the intelligence system operate on probability and pattern matching. This works well for most tasks — but some properties must be guaranteed, not estimated:

1. **Type safety isn't enough**: TypeScript catches type errors at compile time, but many critical properties can't be expressed as types. "This function never returns null when the input is valid" — TypeScript can model this with `NonNullable`, but L8 can verify that the actual implementation satisfies this constraint.

2. **Testing is incomplete**: Tests verify specific cases, not all cases. A test might check that `depth >= 0` for 100 sample nodes, but it can't prove it for all possible nodes. L8's formal proof covers the entire space, not just sampled points.

3. **Code review is fallible**: Human and AI code reviewers catch many issues, but formal properties can be subtle. A reviewer might approve a change that violates an invariant established in a different file. L8's dependency tracking catches cross-file violations that reviewers miss.

4. **Regression prevention**: Once a property is proven, any change that would violate it is immediately detected. This is stronger than regression tests, which only catch violations in tested scenarios.

5. **Confidence calibration**: When L6 (Reasoning) needs to know how confident to be in a code path, L8 provides the strongest possible evidence. A proven invariant contributes maximum confidence to L6's scoring.

Layer 8 exists because **some things should be proven, not just tested**. In a system that governs its own knowledge (L5), reasons about its own decisions (L6), and learns from its own mistakes (L1), having a formal verification layer ensures that the foundation is solid, not just probably-okay.

---

## Benefits to the System

### Provably Correct Core Properties

The 6 artifacts in L8 represent 6 properties that are formally verified, not just tested. These become the bedrock that other layers build on. When L6 reasons about database operations, it can treat L8's DuckDB invariants as facts, not assumptions.

### Change Impact Verification

When a code change is proposed, L8 checks whether it violates any proven properties. This is a formal version of "does this change break anything?" — not based on test coverage (which might have gaps), but on mathematical proof (which has none).

### Conjecture-Driven Improvement

The conjecture pipeline provides a structured approach to codebase improvement. Each conjecture is a hypothesis about the code that, if proven, strengthens the formal foundation. If refuted, it reveals a gap that should be fixed. Either way, investigating conjectures improves the system.

### State Machine Correctness

For a system with multiple state machines (QRISPI, task lifecycle, team formation), formal verification of state machine properties prevents entire classes of bugs: unreachable states, deadlocks, non-deterministic transitions, and infinite loops.

### Cross-Layer Confidence

L8 provides the highest confidence signal in the system. When L5 evaluates knowledge quality, an L8-proven fact gets maximum credibility. When L6 scores a decision, approaches that align with L8 invariants get accuracy bonuses. The formal layer raises the confidence of the entire stack.

---

## When Layer 8 Fails

### Proof Complexity

Some properties are true but extremely difficult to prove. A property might require reasoning about complex data flows, concurrent operations, or emergent behavior. If the proof exceeds L8's reasoning capacity, the property remains a conjecture indefinitely.

**Mitigation**: Complex properties are decomposed into smaller, independently provable sub-properties. Even if the full property can't be proven, proving components provides partial assurance.

### Staleness After Refactoring

Major code refactoring can invalidate multiple proofs simultaneously. If 4 of 6 artifacts become stale after a large change, re-verification is expensive. The system might operate with stale proofs for a period.

**Mitigation**: `/check-symbolic` monitors staleness and prioritizes re-verification of high-dependency artifacts. Critical invariants (those with many dependents) are re-verified first.

### False Confidence

A proven invariant that references outdated code is worse than no invariant at all — it provides false confidence. If the code has changed but the proof hasn't been re-verified, the system might trust a property that no longer holds.

**Mitigation**: The `last_verified` timestamp and `stale` status prevent false confidence. L5 and L6 check verification freshness before trusting L8 artifacts. Stale proofs are treated as conjectures, not facts.

### Limited Coverage

Six artifacts represent a small fraction of the properties that could be verified. The vast majority of code properties are unverified — relying on tests, types, and code review rather than formal proofs.

**Mitigation**: L8 is designed to grow. The conjecture pipeline continuously identifies new properties worth formalizing. Over time, coverage expands from core invariants to broader system properties. Quality over quantity — each artifact is carefully selected for maximum impact.

### Halting Problem

Some properties are theoretically undecidable. L8 can't prove termination for all programs, consistency for all type systems, or completeness for all state machines. These fundamental limits of formal verification apply here as they do everywhere.

**Mitigation**: L8 works within decidable fragments. Most practical code properties (type preservation, null safety, bounded recursion, state machine properties) fall within decidable domains. Properties that approach undecidability are flagged as conjectures rather than pursued to futility.

---

## Communication & Connections

L8 sits at the top of the stack, consuming from many layers but providing its unique formal guarantees back:

- **L1 (Core Memory)** → Reads directives as axioms. "Never delete production data" becomes a formal property to verify in code that touches production databases.
- **L4 (Context Tree)** → Knowledge about code architecture informs what properties are worth formalizing. If the tree says "DuckDB schema is critical infrastructure," L8 prioritizes DuckDB-related invariants.
- **L5 (FrontalLobe)** → Proven artifacts receive maximum credibility in L5's quality gate. L5 checks L8 for formal verification of contested claims before resolving conflicts.
- **L6 (Reasoning)** → Proven invariants provide maximum confidence to L6's accuracy pillar. Decisions that align with formal proofs score higher than decisions based on heuristics alone.
- **L7 (Embeddings)** → Code embeddings help L8 identify which source files are relevant for verifying specific claims. Semantic similarity finds files that might violate invariants but aren't directly imported.
- **Code Changes** → Every code change triggers a staleness check against L8 artifacts. Modified files are matched against artifact source references to identify proofs that need re-verification.

---

## When Layer 8 Is Most Impactful

### Critical Infrastructure Changes

When modifying core systems — DuckDB schema, state machines, data flow pipelines — L8 provides formal assurance that the changes don't violate proven properties. This is when the gap between "tested" and "proven" matters most.

### State Machine Design

When designing or modifying state machines (QRISPI phases, task lifecycles), L8 verifies formal properties that testing alone might miss. Deadlock freedom, reachability, and determinism are properties that require exhaustive analysis, not sample testing.

### Post-Incident Root Cause Analysis

After a production incident, L8 can trace which invariants were violated and why. If a data corruption incident occurs, L8's dependency graph shows which proofs failed and which code changes introduced the violation.

### System Maturity Assessment

The ratio of proven invariants to total code properties is a measure of system maturity. A system with 50 proven invariants about its core data structures is more reliable than one with 5. L8's artifact count is a meaningful quality metric.

---

## Conclusion

Layer 8 is the system's answer to the fundamental question: "How do you know this is correct?" While lower layers answer with "probably" and "based on past experience," L8 answers with "because it can be proven."

Six artifacts might seem small, but each represents a significant formal guarantee. These aren't test assertions that check specific values — they're mathematical proofs that cover all possible values. One proven invariant about DuckDB's depth field is stronger than a million test cases that check specific depths, because the proof covers the infinite space of possible inputs.

The conjecture pipeline provides a growth mechanism. The system continuously identifies properties worth proving, investigates them, and either adds them to the proven library or reveals gaps that should be fixed. Over time, the formal foundation grows, and the system's reliability grows with it.

In a world of probabilistic AI, Layer 8 is a reminder that some things should be certain. Not "95% confident" — certain. Not "works in all tested cases" — proven for all possible cases. That level of certainty has a cost in effort and complexity, but for core system properties, the cost is worth it.

Layer 8 is aspirational by design. It's the layer that says: we don't just want this system to work. We want to *know* that it works. And knowing, in the formal sense, means proving.
