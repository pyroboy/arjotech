# Layer 7: Embeddings

> **Keyword search finds what you typed. Embedding search finds what you meant. When you search for "how to make the database faster," keyword search looks for the word "faster." Layer 7 understands that you're asking about query optimization, indexing strategies, WAL configuration, and connection pooling — and finds all of them.**

Layer 7 is the system's semantic intelligence layer. Powered by Ollama running the `nomic-embed-text` model, it transforms text into 768-dimensional vectors that capture meaning, not just words. This enables conceptual code navigation, semantic knowledge search, and intelligent similarity detection across the entire codebase and knowledge base.

---

## How It Works

### The Embedding Pipeline

Layer 7's core process transforms text into mathematical representations:

1. **Source content** is collected from code files, context tree nodes, and vault notes.
2. **Text is chunked** into appropriate segments — for code, typically function-level; for knowledge, entry-level.
3. **Ollama processes** each chunk through the `nomic-embed-text` model, producing a 768-dimensional float vector.
4. **Vectors are stored** in DuckDB alongside metadata (file path, content hash, timestamps).
5. **Queries are embedded** at search time, and cosine similarity finds the closest matches.

The embedding model choice matters. `nomic-embed-text` was selected for several reasons:
- **768 dimensions** — Rich enough for nuanced similarity, compact enough for efficient storage and search.
- **Local execution** — Runs entirely on the local machine via Ollama. No API calls, no latency, no data leaving the system.
- **Code awareness** — Trained on code as well as natural language, making it effective for both codebase search and knowledge retrieval.

### The `code_file_index` Table (1,767 rows)

This is the code intelligence backbone:

```sql
CREATE TABLE code_file_index (
  id UUID PRIMARY KEY,
  file_path VARCHAR,           -- relative path from project root
  content_hash VARCHAR,        -- SHA-256 of file content
  language VARCHAR,             -- 'typescript', 'javascript', 'json'
  summary VARCHAR,              -- 80-char code summary
  embedding FLOAT[768],         -- the vector representation
  file_size INTEGER,
  last_modified TIMESTAMP,
  indexed_at TIMESTAMP,
  status VARCHAR                -- 'indexed', 'stale', 'pending'
);
```

1,767 files indexed means the system has a semantic map of the entire codebase. When you search for "DuckDB persistence," it doesn't just grep for the string "DuckDB" — it finds files that are semantically related to DuckDB persistence patterns, even if they use different terminology (e.g., a file about "data layer storage" that implements DuckDB writes).

The `content_hash` field enables incremental updates. When a file changes, only its hash changes — the system re-embeds only modified files, not the entire codebase. This makes index maintenance O(changed files) instead of O(all files).

The `summary` field (capped at 80 characters per CLAUDE.md) provides a human-readable preview without loading the full file content. Combined with the vector, this enables a two-phase search: vector similarity narrows candidates, summaries help select the most relevant.

### The `vault_sync_state` Table (1,000 rows)

This tracks synchronization between the Obsidian vault and the intelligence system:

```sql
CREATE TABLE vault_sync_state (
  id UUID PRIMARY KEY,
  note_path VARCHAR,            -- path within the Obsidian vault
  content_hash VARCHAR,         -- current content hash
  embedding FLOAT[768],         -- vector representation
  pillar_coverage JSON,         -- which knowledge pillars this note covers
  wikilink_count INTEGER,       -- Obsidian internal link count
  sync_status VARCHAR,          -- 'synced', 'stale', 'pending'
  last_synced TIMESTAMP
);
```

1,000 vault notes synced means the system's semantic search extends beyond code into personal knowledge management. When the user asks "what do I know about distributed systems?", L7 searches both code (files implementing distributed patterns) and vault notes (personal notes about distributed systems) with equal capability.

The `pillar_coverage` field maps notes to knowledge pillars (the same pillars used in L6's reasoning). This means vault notes contribute to the system's understanding of domain expertise — a user with 50 notes about database optimization has demonstrably deep knowledge in that domain.

### Search: How Semantic Queries Work

When a semantic search is triggered:

1. **Query embedding**: The search query is sent to Ollama, which returns a 768-dimensional vector.
2. **Similarity computation**: The query vector is compared against all stored vectors using cosine similarity: `similarity = dot(query, document) / (||query|| * ||document||)`.
3. **Ranking**: Results are sorted by similarity score (1.0 = identical, 0.0 = unrelated).
4. **Threshold filtering**: Only results above a minimum similarity threshold (typically 0.3) are returned.
5. **Metadata enrichment**: Results include the original metadata (file path, summary, timestamps) for context.

The cosine similarity approach has elegant properties:
- **Direction, not magnitude**: It measures the angle between vectors, not their length. This means a short code comment and a long documentation page are compared fairly — by their semantic direction, not their size.
- **Transitive similarity**: If A is similar to B and B is similar to C, there's likely some similarity between A and C. This enables discovery of indirect relationships.
- **Language independence**: The embedding captures meaning, not words. A Spanish comment about authentication and an English function named `validateToken` can be semantically similar.

### Fallback: Text Search

When Ollama is offline, L7 degrades gracefully to text-based search:

1. **BM25 scoring**: DuckDB's full-text search with term frequency weighting.
2. **File path matching**: Simple pattern matching on file paths.
3. **Content grep**: Direct text search as a last resort.

The fallback chain ensures that code search always works, even if semantic quality is reduced. The system clearly indicates when it's operating in degraded mode.

---

## Why This Layer Exists

Code search is one of the most common developer activities, and keyword search is remarkably bad at it. Consider these real scenarios:

1. **Conceptual queries**: "How does authentication work in this project?" — There's no single file named "authentication.ts." The auth system spans middleware, token validation, session management, and route guards. Keyword search finds files containing "auth" in the name. Semantic search finds all files involved in the authentication concept.

2. **Blast radius analysis**: "What files would be affected if I change the DuckDB schema?" — Keyword search finds files that import DuckDB. Semantic search finds files that are semantically related to DuckDB data patterns — including files that don't directly import it but work with the same data structures.

3. **Knowledge retrieval**: "What do we know about error handling?" — In L4's context tree, error handling knowledge is organized hierarchically. But some relevant knowledge lives under "Testing" (error test patterns), "API" (error response formats), or "Deployment" (error logging). Semantic search finds conceptually related knowledge regardless of where it lives in the tree.

4. **Cross-format search**: The system stores knowledge in code files, context tree nodes, vault notes, and conversation logs. Without embeddings, searching across these formats requires format-specific queries. With embeddings, one query searches everything — the vectors don't care whether the source is TypeScript or Markdown.

Layer 7 exists because **meaning matters more than words**, and semantic search is the technology that bridges the gap.

---

## Benefits to the System

### Conceptual Code Navigation

Instead of knowing exactly what to search for, developers can describe what they're looking for. "Where is the code that handles team member communication?" → L7 finds the inbox system, the SendMessage handler, the relay message router, and the TeamInboxReader — even though none of them contain the phrase "team member communication" literally.

### Blast Radius Detection

The `code-related` query uses L7 to find semantically similar files. Before modifying a critical file, the system can identify all files that are semantically related — not just those that import it, but those that deal with similar concepts. This catches ripple effects that dependency analysis alone would miss.

### Knowledge Graph Enrichment

By embedding L4 context tree nodes, L7 enables conceptual navigation of the knowledge graph. The tree structure provides hierarchical organization; the embeddings provide lateral connections. An entry about "DuckDB WAL configuration" is hierarchically under "Database" but semantically close to entries about "data durability" under "Deployment."

### Semantic Deduplication

L5's deduplication gate uses L7 embeddings for near-duplicate detection. Two pieces of knowledge that use different words but describe the same concept are detected as duplicates through semantic similarity, preventing redundant storage.

### Cross-Repository Learning

When the system studies external repositories (158 entries in the "Studied Repos" domain), L7 embeddings enable transfer learning. Patterns discovered in one repository are matched to similar patterns in the current codebase, enabling cross-pollination of techniques.

---

## When Layer 7 Fails

### Ollama Offline

If Ollama isn't running, semantic search is completely unavailable. The system falls back to text search, which is significantly less capable for conceptual queries.

**Mitigation**: `/check-embeddings` monitors Ollama status. The system warns when semantic search is degraded. Text fallback covers most practical queries, and the system queues re-embedding for when Ollama comes back online.

### Stale Embeddings

When code files change but aren't re-embedded, the stored vectors represent outdated content. Search results include files that no longer contain the matched concepts, or miss files that now contain relevant code.

**Mitigation**: The `content_hash` field detects stale entries. `/check-code-intel` audits index coverage and freshness. A background process re-embeds modified files periodically.

### Embedding Quality for Domain-Specific Content

`nomic-embed-text` is a general-purpose model. It might not capture the nuances of highly domain-specific terminology. A query about "WAL mode" might not find results about "write-ahead logging" if the model hasn't encountered that specific domain extensively.

**Mitigation**: L4's alias system provides explicit synonyms that L7's semantic matching might miss. The three-tier search (semantic → BM25 → alias) ensures that domain-specific queries still find results even if embeddings miss the connection.

### Memory Pressure

1,767 code files × 768 dimensions × 4 bytes = ~5.4 MB of vectors in the code index alone. Add 1,000 vault entries and context tree nodes, and the total vector storage grows. While not enormous, large-scale codebases could push memory limits.

**Mitigation**: Embedding storage is in DuckDB, which handles this scale efficiently. For larger codebases, the system can prioritize frequently-accessed files and expire embeddings for rarely-queried content.

### False Positives in Similarity

Semantic similarity is fuzzy by nature. Two files might be embedded similarly because they use the same language patterns (both have lots of async/await, both import from the same packages) rather than because they're conceptually related. These false positives add noise to search results.

**Mitigation**: The similarity threshold filters low-confidence matches. Results are ranked, not filtered — the top results are usually correct even when lower-ranked results include false positives. The two-phase search (vectors narrow, summaries select) reduces false positive impact.

---

## Communication & Connections

L7 serves as a search infrastructure layer, consumed by most other layers:

- **L1 (Core Memory)** → The `memory "topic"` query uses L7 for semantic matching. Memory entries are embedded for conceptual search beyond keyword matching.
- **L2 (Conversations)** → Conversation content can be semantically searched for conceptual questions about past discussions.
- **L2.5 (External Intelligence)** → External knowledge absorbed into L4 is embedded by L7, making it semantically searchable alongside internal knowledge.
- **L4 (Context Tree)** → Tier 1 search in the context tree uses L7 embeddings. The tree's hierarchical structure combined with L7's semantic matching provides the most powerful knowledge search in the system.
- **L5 (FrontalLobe)** → Semantic similarity powers L5's deduplication and conflict detection gates. Near-duplicate knowledge is detected through vector similarity.
- **L6 (Reasoning)** → Task similarity for pattern generalization uses L7 embeddings. If two tasks are semantically similar, successful approaches for one can inform the other.
- **L8 (Symbolic)** → Code embeddings help L8 identify which source files are relevant for verifying specific claims or invariants.
- **QRISPI Pipeline** → The Research phase uses L7 for code-aware search, finding relevant implementation patterns and potential conflicts.

---

## When Layer 7 Is Most Impactful

### Exploratory Code Navigation

When a developer is new to a codebase or exploring an unfamiliar area, L7 enables conceptual browsing. "Show me everything related to message handling" finds the relevant files without requiring the developer to know the exact class names, file paths, or import patterns.

### Pre-Change Impact Analysis

Before modifying a file, running `code-related "src/main/services/RelayDuckDB.ts"` reveals the semantic blast radius — all files that deal with similar concepts and might need updating. This catches impacts that static analysis misses.

### Cross-Domain Knowledge Queries

When a question spans multiple domains — "what's the relationship between our error handling and our deployment strategy?" — L7 finds relevant content in both domains through semantic similarity, enabling cross-domain reasoning that hierarchical search alone can't support.

### After Major Codebase Changes

When a refactoring or feature implementation touches many files, L7's stale detection identifies which embeddings need refreshing. Running `/fix-code-intel` after major changes ensures the semantic index stays accurate.

---

## Conclusion

Layer 7 transforms the intelligence system from keyword-aware to concept-aware. While lower layers store information in structured tables, L7 gives that information a mathematical representation that captures meaning, not just text.

The 768-dimensional vector space is a shared language that all knowledge types speak. Code, documentation, context tree entries, and vault notes all exist in the same semantic space, enabling cross-format search that no keyword system could provide. When you search for "how does authentication work?", you get code files, knowledge entries, and vault notes — all ranked by semantic relevance.

The pragmatic fallback chain (semantic → BM25 → alias) ensures robustness. When the ideal path fails (Ollama offline), the system degrades gracefully rather than catastrophically. This is critical for a system that needs to be reliable, not just capable.

With 1,767 code files and 1,000 vault notes indexed, L7 provides a comprehensive semantic map of both the project and the user's personal knowledge. As the codebase grows and knowledge accumulates, L7's value grows proportionally — more content means richer semantic connections, and richer connections mean better search results.

The embedding model runs locally, processes data instantly, and stores vectors efficiently. There's no cloud dependency, no API costs, and no data leaving the system. L7 proves that sophisticated semantic intelligence can be achieved entirely on-device — privacy and capability aren't trade-offs, they're complements.
