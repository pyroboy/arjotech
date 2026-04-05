# Layer 3: Analytics

> **You can't improve what you can't measure. Layer 3 is the system's nervous system for measurement — tracking every event, every task, every team action, so the intelligence layers above it can reason about what's working, what's failing, and what's trending.**

Layer 3 is the observability backbone. While Layers 1 and 2 store *knowledge* and *conversations*, Layer 3 stores *metrics*. It captures event streams, task lifecycle data, team performance statistics, and daily rollups. This is the data that feeds the reasoning engine's pattern detection, the delegation optimizer's efficiency calculations, and the dashboard's real-time views.

---

## How It Works

Layer 3 operates through four core tables with a 60-day retention window:

### The `events` Table

With 252 entries, this is the system's event bus log. Every significant action — agent spawned, task completed, tool invoked, error thrown, pipeline advanced — generates an event:

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  event_type VARCHAR,        -- 'agent_spawn', 'task_complete', 'tool_invoked', 'error'
  source VARCHAR,            -- which component emitted the event
  payload JSON,              -- event-specific data
  session_id VARCHAR,
  team_name VARCHAR,
  severity VARCHAR,          -- 'info', 'warning', 'error', 'critical'
  timestamp TIMESTAMP
);
```

Events are the raw material from which all analytics are derived. They're append-only — once written, never modified. This immutability is critical for audit trails and reproducible analysis.

The event type taxonomy is deliberate. Rather than freeform strings, event types are drawn from a controlled vocabulary. This means queries like "how many agent spawns happened this week?" are always accurate — there's no risk of missing events due to inconsistent naming.

### The `task_tracking` Table

At 331 rows, this tracks the full lifecycle of every task in the system:

```sql
CREATE TABLE task_tracking (
  id UUID PRIMARY KEY,
  task_id VARCHAR,
  team_name VARCHAR,
  status VARCHAR,              -- 'pending', 'in_progress', 'completed', 'failed', 'blocked'
  assigned_to VARCHAR,         -- agent name
  created_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_minutes FLOAT,      -- wall-clock time from start to completion
  blocked_duration FLOAT,      -- time spent in blocked state
  tool_calls INTEGER,          -- how many tool invocations the task required
  token_cost INTEGER,          -- tokens consumed
  outcome VARCHAR              -- 'success', 'partial', 'failed', 'abandoned'
);
```

This table answers the questions that matter for productivity: How long do tasks take? Which agents are fastest? Which task types get blocked most? What's the average token cost per task? These metrics feed directly into L6's delegation decisions — if Agent A completes code review tasks 2x faster than Agent B, L6 will preferentially assign code reviews to Agent A.

The `blocked_duration` field is particularly revealing. It measures time tasks spend waiting on dependencies, permissions, or other tasks. High blocked duration across many tasks signals architectural bottlenecks — not agent performance issues.

### The `team_stats` Table

With 4 entries (one per active team), this provides aggregate performance metrics:

```sql
CREATE TABLE team_stats (
  id UUID PRIMARY KEY,
  team_name VARCHAR,
  total_tasks INTEGER,
  completed_tasks INTEGER,
  avg_completion_time FLOAT,
  communication_volume INTEGER,   -- messages between agents
  coordination_overhead FLOAT,    -- % of tokens spent on coordination vs. work
  agent_count INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

Team stats reveal the coordination tax — what percentage of resources go to agents talking to each other versus actually doing work. A team where 40% of tokens are spent on coordination is probably over-communicating. A team where 2% is spent on coordination might be siloed, with agents duplicating work because they're not sharing status.

### The `daily_stats` Table

Nine entries capture day-level rollups:

```sql
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY,
  date DATE,
  total_sessions INTEGER,
  total_messages INTEGER,
  total_tool_calls INTEGER,
  total_tokens INTEGER,
  total_cost FLOAT,
  avg_sentiment FLOAT,
  error_count INTEGER,
  peak_hour INTEGER
);
```

Daily stats provide the trend line. Is the system being used more or less? Is cost increasing? Is error rate spiking? Is sentiment trending down? These macro patterns are invisible in individual events but obvious in daily aggregates.

---

## Why This Layer Exists

Intelligence without measurement is guesswork. The layers above L3 — Reasoning (L6), FrontalLobe (L5), Embeddings (L7) — all need quantitative signals to make good decisions. Without L3:

1. **L6 can't optimize delegation**: Without task duration, completion rates, and per-agent performance data, the reasoning engine has no basis for assigning the right agent to the right task. It would have to assign randomly.

2. **L5 can't detect regression**: If memory governance changes cause task completion times to increase, L5 needs the before/after metrics to detect the regression. Without L3, regressions are invisible until the user complains.

3. **The dashboard is blind**: The Electron UI's real-time views — Kanban board, agent status, task progress — all consume L3 data. Without it, the UI shows static snapshots instead of live metrics.

4. **Cost tracking is impossible**: Token usage and model costs are tracked per-task and per-session in L3. Without this, there's no way to answer "how much did that feature implementation cost?" or "which agent is the most token-efficient?"

5. **Trend detection fails**: Is the system getting better or worse? Are error rates declining? Is user satisfaction improving? These questions require time-series data that only L3 provides.

---

## Benefits to the System

### Data-Driven Delegation

L6's delegation patterns consume L3's task tracking data to build performance profiles per agent per task type. Instead of round-robin assignment, the system can route tasks to the agent most likely to complete them quickly and correctly. This is only possible because L3 records who did what and how well they did it.

### Cost Optimization

By tracking token usage at the task level, the system can identify expensive operations and optimize them. A task that consumes 50,000 tokens for a simple code review is a red flag — L3 makes this visible. The token optimization directives in CLAUDE.md were informed by L3 data showing where tokens were being wasted.

### Anomaly Detection

L3's event stream is the primary input for anomaly detection. A sudden spike in error events, a drop in task completion rates, or an unusual increase in coordination overhead all show up in L3 before they show up in user experience. This enables proactive intervention.

### Performance Benchmarking

When the system changes — new tools added, prompt engineering adjustments, model upgrades — L3 provides the before/after comparison. Did the change improve task completion time? Did it affect error rates? Without L3, changes are judged by gut feel instead of data.

### Capacity Planning

Daily stats reveal usage patterns. If token consumption is growing 15% per week, the system needs budget adjustments before it hits limits. If error counts spike on certain days, there might be environmental factors (deploy days, high-load periods) to account for.

---

## When Layer 3 Fails

### Event Loss

If the event recording system fails (DuckDB write error, process crash during event emission), events are silently lost. The system continues functioning — L3 failure doesn't break anything — but the analytics become incomplete.

**Mitigation**: Events are written with fire-and-forget semantics by design. The error sink (`error_sink` table with 254 entries) captures write failures, so at least the failure itself is recorded. Critical events (errors, task completions) have retry logic.

### Metric Staleness

Daily stats require an aggregation job to run. If the aggregation skips a day, there's a gap in the trend line. The 60-day retention window means gaps older than 60 days can never be filled.

**Mitigation**: Daily aggregation runs as part of the loop agent cycle. If a day is missed, the next run fills in gaps by querying raw events for the missing period.

### Coordination Overhead Misattribution

Team stats measure coordination overhead as a percentage of total tokens, but this measurement is imprecise. Some "coordination" messages contain substantive work (code snippets, analysis results), while some "work" messages are really coordination (status updates, blocking notifications). The heuristic-based classification can misattribute.

**Mitigation**: The classification uses tool calls as a signal — messages that invoke tools are more likely "work," while messages that mention other agents are more likely "coordination." This isn't perfect, but the 80/20 accuracy is sufficient for trend detection.

### Small Sample Size

With 4 team entries and 9 daily stat entries, some analytics tables have very thin data. Statistical significance is questionable with fewer than 30 data points. Patterns detected in 4 teams might just be noise.

**Mitigation**: As the system accumulates more data, statistical reliability improves. In the meantime, L6 applies confidence intervals to small-sample metrics and discounts them proportionally.

---

## Communication & Connections

Layer 3's communication pattern is primarily **write-heavy, read-by-upper-layers**:

- **L1 (Core Memory)** → Writes events when memory operations occur (fact stored, memory recalled, directive applied). Reads from L1 for session context enrichment.
- **L2 (Conversations)** → Session summaries reference L3 metrics (tools used, tokens consumed, task outcomes). Conversation events flow into the event table.
- **L2.5 (External Intel)** → External queries generate events, making research activity measurable.
- **L5 (FrontalLobe)** → Consumes task metrics to validate whether memory governance changes improve or degrade performance. L5's learning propagation tracks how learned patterns affect L3 outcomes.
- **L6 (Reasoning)** → The primary consumer. Delegation patterns, task efficiency calculations, and 4-pillar scoring all depend on L3's quantitative data. L6 reads L3 far more than any other layer.
- **Dashboard** → The Electron UI consumes real-time event streams for Kanban updates, agent status displays, and performance dashboards.
- **Error Sink** → The `error_sink` table (254 entries) captures errors from all layers, making L3 the centralized error collection point.

---

## When Layer 3 Is Most Impactful

### Team Scaling Decisions

When deciding whether to add agents to a team or split a team into two, L3 provides the evidence: Is coordination overhead growing faster than productivity? Are task completion times increasing as team size grows? These metrics directly inform scaling decisions.

### Post-Mortem Analysis

After something goes wrong — a task failed, a session ended in frustration, a team delivered late — L3 provides the forensic timeline. What events occurred in what order? Where did the process break down? Which task was the bottleneck?

### Token Budget Optimization

L3 data drove the token optimization directives in CLAUDE.md. By measuring token usage per tool call, per agent, per task type, the system identified where tokens were being wasted and applied targeted caps (20 tokens for classification, 1500 for relay DMs, etc.).

### Continuous Improvement Validation

When the autoresearch loop (`/autoresearch`) applies a fix and re-measures, it's L3 that provides both the before and after measurements. Without L3, the improvement loop can't tell whether a change actually improved anything.

---

## Conclusion

Layer 3 is the system's quantitative backbone. It doesn't make decisions — it provides the data that enables better decisions everywhere else. Every task tracked, every event logged, every metric aggregated contributes to the system's ability to optimize itself.

The 60-day retention window keeps the data fresh and relevant. The four-table architecture separates concerns cleanly: events for raw activity, tasks for workflow metrics, team stats for coordination efficiency, daily stats for trend analysis.

If Layer 1 is what the system *knows* and Layer 2 is what the system *experienced*, Layer 3 is what the system *measured*. And in a system that continuously optimizes itself — through delegation improvements, token budgeting, and behavioral adaptation — measurement is the foundation everything else is built on.
