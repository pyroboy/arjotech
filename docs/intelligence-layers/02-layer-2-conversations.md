# Layer 2: Conversations

> **Every conversation leaves traces — tone shifts, frustration spikes, satisfaction drops. Most AI systems throw all of that away. Layer 2 captures the emotional and factual history of every interaction, turning ephemeral chat into institutional knowledge.**

Layer 2 is the system's conversational memory. It maintains a 90-day rolling window of every interaction, enriched with sentiment analysis and session summaries. Where Layer 1 stores *what the system knows*, Layer 2 stores *what was said and how the user felt about it*.

---

## How It Works

Layer 2 operates through three interconnected tables:

### The `conversations` Table

This is the primary message store with 769 entries — every meaningful exchange between the user and the system. Each conversation record captures:

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  session_id VARCHAR,           -- groups messages by session
  role VARCHAR,                 -- 'user', 'assistant', 'system'
  content TEXT,                 -- the actual message
  timestamp TIMESTAMP,
  token_count INTEGER,          -- cost tracking
  model VARCHAR,                -- which model responded
  tool_calls JSON,              -- tools invoked in this turn
  metadata JSON                 -- arbitrary context
);
```

Messages are grouped by `session_id`, which maps to a single conversation session. This grouping is crucial — it allows the system to reconstruct the full flow of a conversation, not just individual messages. When the system needs context about "what we discussed yesterday," it pulls the entire session, preserving the back-and-forth that gives individual messages meaning.

The 90-day retention window is deliberate. Conversations older than 90 days are archived and eventually purged. This prevents unbounded growth while keeping enough history for meaningful pattern detection. The retention period was chosen based on the observation that most project contexts are relevant for about one quarter — after that, the codebase has usually changed enough that old conversations reference outdated states.

### The `sentiment` Table

Every conversation turn gets a sentiment score. With 52 entries tracking rolling sentiment, the system maintains an emotional map of the user's experience:

```sql
CREATE TABLE sentiment (
  id UUID PRIMARY KEY,
  session_id VARCHAR,
  message_id UUID,
  score FLOAT,            -- -1.0 (frustrated) to 1.0 (satisfied)
  label VARCHAR,          -- 'positive', 'negative', 'neutral', 'frustrated'
  indicators JSON,        -- what triggered the score
  timestamp TIMESTAMP
);
```

Sentiment isn't just a number — the `indicators` field records *why* the score was assigned. Short, terse messages after a long AI response suggest frustration. Explicit praise ("perfect, exactly what I needed") drives positive scores. Corrections ("no, I said X not Y") drive negative scores with specific failure indicators.

The sentiment system detects patterns, not just individual moments. Three consecutive negative scores trigger a behavioral adjustment — the system becomes more concise, asks clarifying questions earlier, and avoids assumptions. This feedback loop means the system's communication style adapts to the user's current emotional state, not just their stated preferences.

### The `session_summaries` Table

At 612 entries, session summaries distill entire conversations into structured digests:

```sql
CREATE TABLE session_summaries (
  id UUID PRIMARY KEY,
  session_id VARCHAR,
  summary TEXT,              -- what happened
  key_decisions JSON,        -- decisions made during the session
  topics JSON,               -- subjects discussed
  outcome VARCHAR,           -- 'completed', 'abandoned', 'continued'
  duration_minutes INTEGER,
  tool_usage JSON,           -- which tools were used and how often
  created_at TIMESTAMP
);
```

Summaries serve a dual purpose. First, they provide rapid context retrieval — instead of reading 50 messages from a session, the system reads a 200-word summary. Second, they enable cross-session pattern detection. By analyzing summaries over time, the system can identify recurring topics, common workflows, and persistent issues.

The `key_decisions` field is particularly valuable. It records choices made during the session — "chose approach X over Y because of Z." This is the kind of context that's impossible to reconstruct from code alone. The code shows *what* was done; the decision record shows *why*.

---

## Why This Layer Exists

The fundamental problem Layer 2 solves is **context loss between sessions**. When a conversation ends, the in-context window disappears. Without L2, the next conversation has no knowledge of:

1. **What was discussed**: The user might reference "that approach we talked about yesterday" — without conversation history, the system has no idea what they mean.

2. **How the user felt**: If the last three sessions ended with frustration, the system should adjust its approach. Without sentiment tracking, it has no signal to adapt.

3. **What was decided**: Decisions made in conversation — choosing a database, picking an architecture pattern, agreeing on a naming convention — evaporate without session summaries.

4. **What tools worked**: If `code-search` consistently found better results than `grep` for this user's queries, that pattern should inform future tool selection. Without tool usage tracking, the system can't optimize its own workflows.

Layer 2 also solves the **summarization problem**. Raw conversation logs are expensive to process — feeding 50 messages back into context burns thousands of tokens. Session summaries compress this to a fraction of the cost while preserving the essential information. The system can check "what did we do yesterday?" with a single summary read instead of replaying the entire conversation.

---

## Benefits to the System

### Conversational Continuity

The most obvious benefit: conversations don't start from zero. When the user says "remember what we discussed about the auth middleware?", the system queries L2 and retrieves the relevant session summary with its key decisions. This continuity makes multi-session projects viable — work builds on itself instead of being rediscovered each time.

### Emotional Intelligence

Sentiment tracking gives the system a primitive form of emotional awareness. It can't truly understand emotions, but it can detect patterns: frustration building over multiple turns, satisfaction after a successful implementation, confusion when explanations are too technical. This signal feeds back into response generation — a frustrated user gets shorter, more direct responses; a curious user gets more detailed explanations.

### Self-Improvement Signal

Conversation history is the system's primary training signal for self-improvement. By analyzing which responses led to positive sentiment and which led to corrections, the system builds an implicit model of "what works for this user." L6 (Reasoning Engine) consumes this signal for its 4-pillar scoring, and L5 (FrontalLobe) uses it to validate or reject proposed memory writes.

### Token Optimization

Session summaries dramatically reduce context costs. Instead of injecting 50 raw messages (potentially 10,000+ tokens) for context, the system injects a 200-word summary (~300 tokens). This 30x compression is critical for the token-optimized architecture — every token saved on context retrieval is a token available for actual work.

### Audit Trail

Every interaction is recorded. If something goes wrong — a destructive command was run, a bad recommendation was followed — the full conversation log exists for forensic analysis. The system can trace exactly what was asked, what was recommended, and how the user responded.

---

## When Layer 2 Fails

### Sentiment Miscalibration

Sentiment detection uses heuristics, not perfect understanding. A terse message might indicate frustration — or it might just be the user's natural communication style. If the system miscalibrates, it can over-correct: becoming too cautious with a user who's actually satisfied, or too casual with one who's genuinely frustrated.

**Mitigation**: Sentiment is calibrated against L1 user preferences. If the user's facts include "prefers direct, concise communication," short messages aren't flagged as frustration. The system adapts its sentiment baseline to the individual.

### Summary Drift

Session summaries are generated automatically, and they can miss nuance. A summary might capture "discussed auth middleware" but miss the crucial detail that the team decided to use JWT over session tokens. Key decisions that aren't explicitly stated can fall through the cracks.

**Mitigation**: The `key_decisions` field is populated by explicit detection of decision language ("let's go with X," "we'll use Y," "the approach should be Z"). Important conversations can also be manually flagged for more detailed summarization.

### Retention Window Gaps

The 90-day rolling window means old conversations are eventually lost. If a project spans six months, early conversations about architectural decisions may be purged before the project completes.

**Mitigation**: Important decisions graduate from L2 to L1 (as memory entries) or L4 (as context tree nodes). The retention window only affects raw conversations — the extracted knowledge persists in higher layers.

### Storage Growth

769 conversations and 612 summaries are manageable, but high-frequency usage can push these numbers into the thousands. Each conversation entry includes full message content, which can be large for sessions involving code output.

**Mitigation**: The 90-day retention window naturally caps growth. Additionally, system messages and tool outputs are stored as references rather than full content where possible, reducing per-entry storage cost.

---

## Communication & Connections

Layer 2 has a broad communication surface:

- **L1 (Core Memory)** ← Reads facts for sentiment calibration and user context. Writes to memory when conversation patterns are detected (e.g., "user consistently asks about testing before deployment").
- **L2.5 (External Intelligence)** → External intel queries are logged as conversation turns, creating a record of what external knowledge was sought and used.
- **L3 (Analytics)** → Session summaries feed into analytics dashboards. Tool usage data from conversations drives L3's efficiency metrics.
- **L4 (Context Tree)** → Mature conversation patterns graduate to context tree entries. If the same topic comes up in 5+ sessions, it likely deserves a curated knowledge node.
- **L5 (FrontalLobe)** → Sentiment data is a key input for FrontalLobe's quality assessment. Negative sentiment after a system action triggers L5 review. Learning propagation uses conversation history to validate whether learned behaviors are actually improving outcomes.
- **L6 (Reasoning)** → Conversation patterns feed the 4-pillar scoring system. Successful conversations (high satisfaction, efficient tool use) reinforce the patterns that produced them.

---

## When Layer 2 Is Most Impactful

### Multi-Day Projects

When work spans multiple sessions — a feature implementation, a debugging investigation, an architecture migration — Layer 2 provides the continuity thread. The user picks up where they left off without re-explaining the problem, the constraints, or the decisions already made.

### After Bad Experiences

When something went wrong in a previous session, Layer 2 ensures the system knows about it. The sentiment record, the conversation log, and the session summary all capture the failure. The next session starts with awareness of what went wrong, not innocent ignorance.

### Behavioral Adaptation

Over time, Layer 2's sentiment data shapes the system's communication style more than any explicit instruction could. A user who consistently responds positively to code-first explanations will get more code-first responses. A user who prefers high-level summaries before diving into details will get that structure. This adaptation is invisible but transformative.

### Team Coordination Context

When multiple agents work on a project, Layer 2 provides shared conversational context. A new agent joining a team can review session summaries to understand what's been discussed, what's been decided, and what the current emotional temperature is. This prevents the "new team member asks questions everyone already answered" problem.

---

## Conclusion

Layer 2 is the system's narrative memory — not just *what* happened, but *how it felt* and *what it meant*. While Layer 1 stores atomic facts, Layer 2 stores the flowing, contextual history of interaction.

The three-table architecture — raw conversations, sentiment scores, session summaries — provides different levels of granularity for different needs. Quick context checks use summaries. Emotional calibration uses sentiment. Deep investigation uses raw conversation logs. This layered access pattern keeps token costs low while maintaining full fidelity when needed.

The 90-day retention window is a deliberate trade-off: enough history for project continuity, not so much that the system drowns in stale context. Important knowledge doesn't die at 90 days — it graduates to L1 memories and L4 context tree nodes, where it persists indefinitely.

Perhaps most importantly, Layer 2 gives the system a sense of *trajectory*. Not just "where are we now?" but "where have we been, and how did we feel about getting here?" That trajectory — the arc of a project, the evolution of a working relationship — is what turns a stateless tool into a genuine collaborator.
