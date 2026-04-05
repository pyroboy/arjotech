# Layer 4: Context Tree

> **Databases store data. Wikis store documents. But what if your knowledge base was a living tree — where every piece of knowledge has a parent, siblings, children, and relatives? Where searching for "authentication" also finds "OAuth," "JWT," and "session management" because the tree understands they're family? That's Layer 4.**

The Context Tree is the system's curated knowledge graph. With 6,989 nodes organized across 21 domains, it's the largest and most structured data store in the entire intelligence stack. Unlike the flat tables of Layers 1-3, the Context Tree is hierarchical — knowledge lives in a tree structure where domains contain topics, topics contain entries, and entries reference each other through semantic relationships.

---

## How It Works

### The Three-Table Architecture

Layer 4 is backed by three tables:

#### `context_tree_nodes` (6,989 rows)

This is the primary knowledge store. Every node is one of three types:

```sql
CREATE TABLE context_tree_nodes (
  id VARCHAR PRIMARY KEY,         -- 'CTN-' + hex identifier
  parent_id VARCHAR,              -- references parent node
  label VARCHAR,                  -- human-readable title
  label_normalized VARCHAR,       -- lowercase for search
  content TEXT,                   -- the actual knowledge
  description VARCHAR,            -- one-line summary
  node_type VARCHAR,              -- 'domain', 'topic', 'entry'
  scope VARCHAR,                  -- 'relay', 'global', 'project'
  status VARCHAR,                 -- 'active', 'archived', 'deprecated'
  relevance_score FLOAT,          -- 0.0 to 1.0
  depth INTEGER,                  -- 0=domain, 1=topic, 2+=entry
  entry_count INTEGER,            -- children count (domains/topics only)
  tags JSON,                      -- keyword array for search
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

The hierarchy works like a file system:

```
Domain: "Database" (depth 0, 44 entries)
├── Topic: "DuckDB Patterns" (depth 1)
│   ├── Entry: "WAL mode configuration" (depth 2)
│   ├── Entry: "Concurrent write handling" (depth 2)
│   └── Entry: "Schema migration strategy" (depth 2)
├── Topic: "Query Optimization" (depth 1)
│   ├── Entry: "Index selection heuristics" (depth 2)
│   └── Entry: "JOIN vs subquery performance" (depth 2)
└── Topic: "Error Patterns" (depth 1)
    └── Entry: "Corrupt WAL recovery" (depth 2)
```

The 21 active domains span the full knowledge surface:

| Domain | Entries | Coverage |
|--------|---------|----------|
| Studied Repos | 158 | Patterns learned from analyzed repositories |
| General | 53 | Cross-cutting knowledge |
| Testing | 48 | Test patterns, strategies, tooling |
| Database | 44 | DuckDB, schema, queries |
| Deployment | 35 | Build, ship, infrastructure |
| Authentication | 26 | Auth flows, security |
| API | 21 | Endpoint design, protocols |
| Error Patterns | 19 | Known failure modes |
| Team Operations | 17 | Multi-agent coordination |
| Behavioral Corrections | 10 | How the system should behave |
| Discord Relay | 7 | Relay-specific knowledge |
| Technology & Projects | 5 | Tech stack decisions |
| Identity | 3 | System self-knowledge |
| External Intelligence | varies | Curated from L2.5 |

#### `context_tree_aliases` (367 rows)

Aliases are the synonym system. They map alternative names to canonical node IDs:

```sql
CREATE TABLE context_tree_aliases (
  id VARCHAR PRIMARY KEY,
  node_id VARCHAR,           -- references context_tree_nodes.id
  alias VARCHAR,             -- alternative name
  alias_normalized VARCHAR   -- lowercase for matching
);
```

When someone searches for "auth," the alias system maps it to "Authentication." When someone types "DB," it resolves to "Database." This synonym expansion is crucial for natural language queries — users don't always use the canonical terminology that the knowledge tree was built with.

With 367 aliases across 6,989 nodes, there's roughly one alias per 19 nodes. High-traffic domains like Database and Authentication have denser alias coverage.

#### `context_tree_cache` (0 rows, ready for use)

The cache table stores precomputed query results for frequently accessed paths. When the same context tree query runs repeatedly (which is common — "what do we know about DuckDB?" gets asked in many forms), the cache avoids re-traversing the tree.

```sql
CREATE TABLE context_tree_cache (
  id VARCHAR PRIMARY KEY,
  query_hash VARCHAR,        -- hash of the normalized query
  result JSON,               -- precomputed results
  hit_count INTEGER,         -- how often this cache entry is used
  ttl_minutes INTEGER,       -- time-to-live
  created_at TIMESTAMP
);
```

The cache is currently empty (0 rows) because the system is young enough that query patterns haven't stabilized. As usage increases, hot paths will be cached automatically.

### Search: Three Tiers

Context tree search operates in three tiers, falling through until results are found:

1. **Tier 1: Semantic Search (Ollama)** — When Ollama is running, queries are embedded into 768-dimensional vectors and matched against embedded context tree nodes using cosine similarity. This finds conceptually related content even when keywords don't match. "How do I persist data?" finds entries about DuckDB, file storage, and caching because the semantic meaning is similar.

2. **Tier 2: BM25 Text Search** — DuckDB's built-in full-text search with BM25 scoring. This is keyword-based but intelligent — it understands term frequency, document length, and field weighting. Faster than semantic search but less conceptually flexible.

3. **Tier 3: Alias Expansion** — If Tiers 1 and 2 return nothing, the query is expanded through the alias table. "auth" becomes "authentication," "DB" becomes "database," and the search is retried.

---

## Why This Layer Exists

The lower layers (L1-L3) store raw information — facts, conversations, events. But raw information isn't knowledge. Knowledge requires **structure, context, and relationships**.

Consider this scenario: the system has learned 50 different things about DuckDB across dozens of conversations. In L1, these are 50 scattered memory entries. In L2, they're buried in 50 different conversation logs. Finding "everything we know about DuckDB" requires querying multiple tables and manually synthesizing results.

In L4, all 50 pieces of knowledge are organized under `Database > DuckDB Patterns`, each with a parent-child relationship to its topic, cross-referenced with aliases, and searchable both semantically and by keyword. One query returns the complete, structured knowledge tree.

Layer 4 exists because **flat knowledge doesn't scale**. When the system has 100 memories, linear search works. At 3,545 memories (L1's current count), you need structure. The tree provides that structure — grouping related knowledge, enabling top-down browsing (start at a domain, drill into topics), and supporting bottom-up search (find an entry, navigate to its siblings and parent).

The tree also serves as the **graduation target** for lower-layer knowledge. A memory entry in L1 that's been reinforced 5 times and confirmed by user satisfaction is a candidate for graduation to a curated context tree entry. This promotion process means L4 contains the system's most validated, most useful knowledge.

---

## Benefits to the System

### Structured Knowledge Retrieval

Instead of "search everything and hope for the best," L4 enables targeted queries: "what do we know about testing?" → browse the Testing domain (48 entries). "What about DuckDB specifically?" → drill into Database > DuckDB Patterns. This structure reduces search time and improves precision.

### Cross-Domain Discovery

The tree structure reveals connections that flat storage hides. An entry under "Error Patterns" might reference a topic under "Database" — the tree makes this cross-domain relationship navigable. When debugging a database error, the system can follow these links to find related error patterns and solutions.

### Semantic Search Foundation

L7 (Embeddings) embeds context tree nodes for semantic search. The tree's hierarchical structure means embeddings capture not just the content of each node, but its position in the knowledge graph. An entry deep in "Database > DuckDB > WAL mode" gets embedded with that full context, making semantic matching more precise than embedding flat documents.

### Knowledge Curation

The context tree is curated, not dumped. Entries are reviewed by the quality gate (L5), scored for relevance, and organized by domain experts (the AI's own classification system). This means L4 entries are higher quality than raw memory entries — they've been validated, structured, and placed in context.

### Multi-Modal Access

The same knowledge can be accessed via text search, semantic search, alias expansion, hierarchical browsing, or direct node ID lookup. This flexibility means different system components can access knowledge in whatever way is most efficient for their use case.

---

## When Layer 4 Fails

### Domain Imbalance

With 158 entries in "Studied Repos" but 0 in "User Preferences," the tree is unevenly populated. Heavily-used domains have deep, rich subtrees while neglected domains are nearly empty. Queries in sparse domains return poor results.

**Mitigation**: The skill cohesion rule requires new features to seed their knowledge into L4. Empty domains are flagged by `/check-signal` for population. Over time, active usage fills gaps naturally.

### Stale Entries

Context tree entries don't have automatic decay like L2's 90-day window. An entry about "recommended auth approach" from 3 months ago might still reference a deprecated library. Without active maintenance, the tree becomes a graveyard of outdated knowledge.

**Mitigation**: Each entry has an `updated_at` timestamp and `relevance_score`. L5 periodically reviews entries whose relevance score has drifted below threshold. The `status` field supports marking entries as `deprecated` without deleting them.

### Hierarchy Rigidity

The three-level hierarchy (domain > topic > entry) works well for most knowledge, but some knowledge doesn't fit neatly. A piece of knowledge about "deploying DuckDB in Docker" spans three domains (Deployment, Database, Technology). It has to live in one place, with at best alias cross-references to the others.

**Mitigation**: Tags provide a secondary classification axis. An entry can be under "Deployment" in the tree but tagged with ["database", "docker", "infrastructure"], making it discoverable from multiple angles.

### Semantic Search Dependency

Tier 1 search depends on Ollama running. If Ollama is offline, search falls back to BM25 and alias expansion — still functional, but less capable. Conceptual queries ("how do I make things faster?") degrade significantly without semantic matching.

**Mitigation**: BM25 with alias expansion covers 70-80% of queries adequately. Ollama status is monitored by `/check-embeddings`, and the system warns when semantic search is degraded.

---

## Communication & Connections

Layer 4 is a central hub that connects to nearly every other layer:

- **L1 (Core Memory)** → Memory entries that are validated and reinforced graduate to context tree entries. Facts provide context for tree node classification.
- **L2 (Conversations)** → Recurring conversation topics trigger context tree node creation. Session summaries reference tree nodes for topic categorization.
- **L2.5 (External Intelligence)** → External knowledge is auto-classified into the "External Intelligence" domain. Cross-platform validated content gets its own topic nodes.
- **L3 (Analytics)** → Query frequency data (when the cache is active) informs which domains are most accessed. Event patterns can trigger tree updates.
- **L5 (FrontalLobe)** → The primary governor. L5 gates new entries, reviews existing entries for quality, manages the graduation pipeline from L1, and handles conflict resolution when entries contradict each other.
- **L6 (Reasoning)** → The reasoning engine queries L4 for contextual knowledge when scoring decisions. Domain expertise stored in the tree informs pillar weights.
- **L7 (Embeddings)** → Ollama embeds tree nodes for semantic search. The embedding quality of L4 directly affects the precision of conceptual queries.
- **L8 (Symbolic)** → Formal verification can reference tree knowledge as axioms. If the tree says "DuckDB doesn't support concurrent writers," L8 can use that as a premise in its proofs.

---

## When Layer 4 Is Most Impactful

### Onboarding New Knowledge Areas

When the system encounters a new technology, framework, or domain, L4 provides the scaffolding for organizing what it learns. Creating a new domain takes seconds; the tree structure ensures new knowledge is immediately organized and searchable.

### Complex Decision Making (QRISPI)

The QRISPI pipeline's Design phase draws heavily on L4. Architecture decisions require understanding existing patterns, known error modes, and validated approaches — all organized in the context tree. A single query can surface everything the system knows about the relevant domain.

### Cross-Team Knowledge Sharing

When multiple teams work on related features, L4 provides the shared knowledge base. Team A's discoveries about database performance are immediately available to Team B through the same tree. This prevents knowledge silos.

### Semantic Code Understanding

When combined with L7's embeddings, L4 enables conceptual code navigation. "Find code related to authentication" doesn't just grep for "auth" — it traverses the Authentication domain's tree, finds all related concepts (JWT, sessions, middleware, token validation), and searches for code related to each.

---

## Conclusion

Layer 4 is the system's organized mind. While lower layers accumulate raw information — facts, conversations, metrics — the Context Tree gives that information structure, hierarchy, and relationships.

The 6,989 nodes across 21 domains represent the system's curated understanding of its world. Not everything it's ever been told, but the subset that's been validated, organized, and scored for relevance. This curation is what makes L4 queries fast and precise — you're searching curated knowledge, not raw data.

The three-tier search system (semantic → BM25 → alias expansion) ensures that queries find results regardless of how they're phrased. The 367 aliases bridge the gap between user vocabulary and tree terminology. The hierarchical structure enables both browsing (top-down) and searching (bottom-up).

If Layer 1 is the system's memory and Layer 2 is its diary, Layer 4 is its textbook — organized, indexed, cross-referenced, and designed for efficient retrieval. It's the layer that turns accumulated experience into accessible knowledge.
