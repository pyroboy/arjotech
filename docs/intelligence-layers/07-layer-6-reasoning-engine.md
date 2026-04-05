# Layer 6: Reasoning Engine

> **Most AI systems make decisions. This one scores them. Layer 6 doesn't just choose — it evaluates every decision across four independent dimensions, detects patterns in what works and what doesn't, and optimizes future decisions based on empirical outcomes. It's the difference between guessing and reasoning.**

The Reasoning Engine is the system's decision-making framework. It implements a 4-pillar scoring model where every significant decision is evaluated across four orthogonal dimensions. Over time, the system learns which decision patterns lead to good outcomes and adjusts its scoring weights accordingly. This isn't rule-based reasoning — it's empirical, data-driven optimization.

---

## How It Works

Layer 6 operates through five interconnected tables:

### The 4-Pillar Model

Every decision the system makes — which agent to assign a task, which approach to recommend, which tool to use — is scored across four pillars:

1. **Efficiency** — How well does this decision use resources? Token cost, wall-clock time, tool invocations. A solution that uses 10,000 tokens is less efficient than one using 2,000 tokens for the same outcome.

2. **Accuracy** — How correct is the decision likely to be? Based on past outcomes, domain expertise, and confidence in the underlying knowledge. A recommendation backed by L5-validated learnings scores higher than one based on raw memory.

3. **Adaptability** — How well does this decision handle uncertainty? If conditions change (requirements shift, errors occur, context evolves), how robust is this approach? Solutions with graceful degradation score higher than brittle all-or-nothing approaches.

4. **Collaboration** — How well does this decision enable team coordination? For multi-agent tasks, this measures communication overhead, dependency creation, and blocking potential. A task decomposition that creates 5 parallel independent subtasks scores higher than one creating 5 sequential dependent subtasks.

### The `pattern_scores` Table (0 rows, accumulating)

```sql
CREATE TABLE pattern_scores (
  id UUID PRIMARY KEY,
  pattern_type VARCHAR,       -- 'delegation', 'tool_selection', 'approach_choice'
  pattern_signature VARCHAR,  -- serialized pattern description
  efficiency_score FLOAT,
  accuracy_score FLOAT,
  adaptability_score FLOAT,
  collaboration_score FLOAT,
  composite_score FLOAT,      -- weighted combination
  sample_count INTEGER,       -- how many times this pattern has been observed
  last_observed TIMESTAMP,
  created_at TIMESTAMP
);
```

Pattern scores are the system's learned priors. When a delegation pattern ("assign code review to Agent A") is observed 10 times with consistently high composite scores, the system builds confidence that this pattern works. When a tool selection pattern ("use semantic search before grep") shows high accuracy scores, the system preferentially applies it.

The `sample_count` field is critical. A pattern with 2 observations and a high score might be luck. A pattern with 50 observations and a high score is a reliable signal. L6 weights confidence by sample count, requiring minimum observations before treating a pattern as validated.

### The `pillar_weights` Table (0 rows, initializing)

```sql
CREATE TABLE pillar_weights (
  id UUID PRIMARY KEY,
  context VARCHAR,            -- 'code_review', 'implementation', 'research', 'debugging'
  efficiency_weight FLOAT,    -- 0.0 to 1.0, must sum to 1.0 across pillars
  accuracy_weight FLOAT,
  adaptability_weight FLOAT,
  collaboration_weight FLOAT,
  calibration_source VARCHAR, -- 'default', 'learned', 'manual'
  updated_at TIMESTAMP
);
```

Different contexts weight the four pillars differently:

- **Code review**: Accuracy is paramount (weight: 0.45). An efficient but inaccurate code review is worse than a slow but thorough one.
- **Implementation**: Efficiency and accuracy are balanced (0.30 each). Getting it done quickly AND correctly both matter.
- **Research**: Adaptability leads (0.35). Research paths often change direction — the ability to pivot matters more than speed.
- **Debugging**: Accuracy dominates (0.50). Finding the actual root cause, not a fast but wrong diagnosis, is the goal.
- **Team coordination**: Collaboration is highest (0.40). How well agents work together is more important than individual efficiency.

These weights start at defaults but evolve based on observed outcomes. If accuracy-weighted debugging sessions consistently produce better results than efficiency-weighted ones, the system reinforces the accuracy bias for debugging contexts.

### The `delegation_patterns` Table (0 rows, accumulating)

```sql
CREATE TABLE delegation_patterns (
  id UUID PRIMARY KEY,
  task_type VARCHAR,           -- 'code_review', 'implementation', 'testing'
  agent_profile VARCHAR,       -- agent capabilities/role
  success_rate FLOAT,          -- historical success for this combination
  avg_duration FLOAT,          -- average completion time
  avg_token_cost FLOAT,        -- average token usage
  sample_size INTEGER,
  last_delegation TIMESTAMP
);
```

Delegation patterns answer: "for task type X, which agent profile Y produces the best results?" This is the empirical backbone of intelligent task assignment. Instead of random or round-robin delegation, the system can match tasks to agents based on historical performance.

### The `task_efficiency` Table (0 rows, accumulating)

```sql
CREATE TABLE task_efficiency (
  id UUID PRIMARY KEY,
  task_type VARCHAR,
  approach VARCHAR,            -- which approach was used
  duration_minutes FLOAT,
  token_cost INTEGER,
  tool_calls INTEGER,
  outcome VARCHAR,             -- 'success', 'partial', 'failed'
  pillar_scores JSON,          -- per-pillar scores for this specific task
  created_at TIMESTAMP
);
```

Task efficiency is the raw performance data that feeds everything else. Each completed task generates an efficiency record, which feeds into pattern scoring, delegation optimization, and pillar weight calibration.

### The `experiments` Table (0 rows, ready)

```sql
CREATE TABLE experiments (
  id UUID PRIMARY KEY,
  hypothesis VARCHAR,          -- what we're testing
  control_approach VARCHAR,    -- the baseline approach
  experimental_approach VARCHAR, -- the new approach
  metric VARCHAR,              -- what we're measuring
  control_result FLOAT,
  experimental_result FLOAT,
  statistical_significance FLOAT,
  conclusion VARCHAR,          -- 'confirmed', 'rejected', 'inconclusive'
  created_at TIMESTAMP
);
```

The experiments table enables A/B testing of approaches. When the system wants to test whether a new delegation strategy outperforms the current one, it can run both, measure the results, and draw statistically grounded conclusions. This is the system's mechanism for deliberate self-improvement, as opposed to the passive learning from observation.

---

## Why This Layer Exists

Decision-making without a framework is ad hoc. Different conversations, different contexts, different system states lead to inconsistent decisions. Layer 6 exists to provide **structured, measurable, improvable decision-making**.

The specific problems L6 solves:

1. **Inconsistent delegation**: Without scoring, the system assigns tasks based on whatever heuristic the current conversation context suggests. This leads to inefficient resource use — the fastest agent for code review might get stuck with research tasks while a slower reviewer sits idle.

2. **No learning from outcomes**: Without tracking which decisions led to good outcomes, the system can't improve its decision-making over time. It makes the same quality of decisions on day 100 as day 1.

3. **Single-dimensional thinking**: Most optimization targets one dimension — speed, correctness, or cost. The 4-pillar model forces consideration of all relevant dimensions simultaneously. A fast solution that breaks team coordination is scored poorly, even if it's individually efficient.

4. **No experimental framework**: Without the experiments table, the system has no way to deliberately test improvements. Changes are made and hoped to work. L6 provides the controlled experimentation infrastructure.

5. **Context-insensitive reasoning**: Without pillar weights, the system applies the same decision criteria everywhere. But debugging requires different thinking than implementation, which requires different thinking than research. L6 adapts its reasoning to the context.

---

## Benefits to the System

### Optimal Agent-Task Matching

By tracking delegation patterns with success rates, duration, and cost, L6 enables intelligent task routing. Instead of "assign to whoever's free," the system can "assign to the agent most likely to complete this task type efficiently and correctly." This optimization compounds — better matching means faster completion, which means more capacity, which means more tasks completed overall.

### Self-Improving Decision Quality

The feedback loop between decisions and outcomes means the system's decision quality improves over time. Early decisions might be no better than random. But as pattern_scores accumulate, the system develops empirically-validated priors for different decision types. By the 100th code review delegation, the system knows exactly which agent profile produces the best results.

### Multi-Dimensional Optimization

The 4-pillar model prevents pathological optimization. A system optimizing only for speed will make sloppy decisions. Optimizing only for accuracy will be slow. The multi-pillar approach with context-specific weights ensures balanced decision-making — fast enough, accurate enough, adaptable enough, collaborative enough, with the balance tuned to the specific task.

### Transparent Reasoning

Every decision can be explained through its pillar scores. "I assigned this task to Agent A because: efficiency score 0.85 (fastest for this type), accuracy score 0.90 (highest success rate), adaptability 0.70, collaboration 0.80, composite 0.84." This transparency enables debugging of decision-making itself — when a bad decision is made, the pillar scores reveal which dimension was mis-scored.

### Experimental Self-Improvement

The experiments table elevates the system from "learn from what happens" to "design what should happen." Instead of passively waiting for data, L6 can actively test hypotheses about better approaches. This directed learning is faster and more reliable than observational learning alone.

---

## When Layer 6 Fails

### Cold Start

With 0 rows across most L6 tables, the system is in cold-start mode. Pattern scores haven't been established, delegation patterns haven't been observed, and pillar weights are at defaults. Decision quality during cold start is no better than heuristic-based approaches.

**Mitigation**: Default pillar weights are based on software engineering literature and general best practices. They're reasonable starting points even without data. The system also bootstraps from L3 analytics — historical task data from L3 can seed L6 patterns without waiting for L6-specific observations.

### Overfitting to Recent Patterns

If the system encounters a string of similar tasks, it can overfit its scoring to that narrow context. After 20 TypeScript debugging tasks, it might over-optimize for TypeScript debugging and under-perform when a Python task arrives.

**Mitigation**: Pattern scores include `sample_count` and are weighted by diversity of observations, not just count. The system maintains skepticism toward patterns with narrow diversity even if they have high sample counts.

### Metric Gaming

The 4-pillar model can be gamed — not maliciously, but through system dynamics. An agent that produces fast, confident answers (high efficiency and accuracy scores) might actually be over-confident and skipping important checks. The scores look good, but the outcomes are risky.

**Mitigation**: Outcome tracking is the antidote. Scores are validated against actual outcomes. An agent with high speed scores but frequent task failures will see its composite score drop as outcome data accumulates.

### Weight Oscillation

If pillar weights are adjusted too aggressively in response to individual outcomes, they can oscillate — swinging between over-weighting efficiency and over-weighting accuracy based on the latest result. This instability degrades decision quality.

**Mitigation**: Weight updates use exponential moving averages with a conservative learning rate. Individual outcomes shift weights marginally; only sustained patterns cause significant weight changes.

---

## Communication & Connections

L6 sits near the top of the stack, consuming data from lower layers and feeding decisions back:

- **L1 (Core Memory)** → Reads user preferences and behavioral patterns. Writes back when reasoning patterns are validated (adding to memory: "for this user, accuracy-weighted debugging works best").
- **L2 (Conversations)** → Conversation outcomes (satisfaction, correction frequency) feed pillar scoring. Successful conversations reinforce the patterns that produced them.
- **L3 (Analytics)** → The primary data source. Task tracking, event streams, and team stats all feed L6's scoring model. L6 consumes L3 far more than any other layer.
- **L4 (Context Tree)** → Domain knowledge from the tree informs scoring context. If the tree says "this domain has high complexity," L6 weights accuracy higher.
- **L5 (FrontalLobe)** → Validated learnings from L5 inform scoring priors. L6 trusts L5-validated knowledge more than raw data.
- **L7 (Embeddings)** → Semantic similarity between tasks helps L6 generalize patterns. If Task A is semantically similar to Task B, successful approaches for B can inform scoring for A.
- **L8 (Symbolic)** → Formal verification of decision properties. L8 can verify that a delegation pattern satisfies certain invariants (e.g., "no single agent gets more than 60% of tasks").

---

## When Layer 6 Is Most Impactful

### Multi-Agent Task Distribution

When a team of agents needs to divide work, L6 provides the intelligence for optimal distribution. Without L6, distribution is ad hoc. With L6, each task is matched to its ideal agent based on empirical data.

### Resource-Constrained Environments

When token budgets are tight, L6's efficiency pillar becomes critical. It ensures that constrained resources are allocated to the highest-impact tasks and approaches.

### Post-Failure Recovery

After a task fails, L6's pattern analysis identifies what went wrong in scoring terms. Was it an accuracy issue (wrong approach)? Efficiency issue (ran out of tokens)? Collaboration issue (agents blocked each other)? This diagnostic capability accelerates recovery.

### Continuous Improvement Cycles

The autoresearch loop (`/autoresearch`) uses L6 to measure improvements. Apply change → score with L6 → keep or discard. This tight feedback loop enables rapid, empirically-validated system improvements.

---

## Conclusion

Layer 6 is where the intelligence system transcends pattern matching and becomes genuinely intelligent. It doesn't just apply rules or recall knowledge — it reasons about decisions, scores them across multiple dimensions, and improves its reasoning based on outcomes.

The 4-pillar model is the core innovation. By evaluating every decision across efficiency, accuracy, adaptability, and collaboration, the system avoids the trap of single-dimensional optimization. Fast isn't enough. Correct isn't enough. Collaborative isn't enough. The system needs to be all of these, in the right proportion for the current context.

The cold-start challenge is real — most L6 tables are currently empty, meaning the system is operating on defaults rather than learned patterns. But the infrastructure is in place. Every task completed, every delegation made, every approach attempted generates data that will feed L6's pattern detection. The system is designed to get smarter with every interaction.

When the tables fill and patterns emerge, L6 will be the system's competitive advantage — making decisions not because they seem right, but because they've been empirically validated across hundreds of observations. That's not artificial intelligence mimicking reasoning. That's actual reasoning, grounded in data.
