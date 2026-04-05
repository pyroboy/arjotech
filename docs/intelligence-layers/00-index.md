# The 8-Layer Intelligence System

> **What if your AI assistant didn't just respond — but *remembered*, *reasoned*, *verified*, and *learned* across every conversation it ever had?**

This documentation covers the 8-layer intelligence architecture that powers the Claude Agent Teams system. Each layer builds on the ones below it, creating an AI system that doesn't just answer questions — it accumulates institutional knowledge, detects its own mistakes, governs its own memory quality, and formally verifies its reasoning.

Most AI systems are stateless. They forget everything the moment a conversation ends. This system is different. It has 51 DuckDB tables, 7,000+ curated knowledge nodes, Ollama-powered semantic search, and a formal verification layer that treats code invariants like mathematical proofs.

## The Stack

| Layer | Name | Purpose | Key Tables |
|-------|------|---------|------------|
| **L1** | [Core Memory](./01-layer-1-core-memory.md) | Identity, facts, preferences, learned corrections | `memory`, `facts`, `operational_data`, `directives` |
| **L2** | [Conversations](./02-layer-2-conversations.md) | 90-day rolling conversation history with sentiment | `conversations`, `sentiment`, `session_summaries` |
| **L2.5** | [External Intelligence](./03-layer-2.5-external-intelligence.md) | Real-time knowledge from 55+ web platforms | `external_intelligence`, `context_tree_nodes` |
| **L3** | [Analytics](./04-layer-3-analytics.md) | Event tracking, task metrics, team performance stats | `events`, `task_tracking`, `team_stats`, `daily_stats` |
| **L4** | [Context Tree](./05-layer-4-context-tree.md) | Hierarchical curated knowledge across 21 domains | `context_tree_nodes`, `context_tree_cache`, `context_tree_aliases` |
| **L5** | [FrontalLobe](./06-layer-5-frontal-lobe.md) | Memory governance, quality gates, conflict resolution | `knowledge_conflicts`, `learnings`, `learning_propagation` |
| **L6** | [Reasoning Engine](./07-layer-6-reasoning-engine.md) | 4-pillar scoring, pattern recognition, delegation | `pattern_scores`, `pillar_weights`, `delegation_patterns` |
| **L7** | [Embeddings](./08-layer-7-embeddings.md) | Ollama vector search for code and knowledge | `code_file_index`, `vault_sync_state` |
| **L8** | [Symbolic Reasoning](./09-layer-8-symbolic-reasoning.md) | Formal verification, proofs, conjectures | `symbolic_artifacts` |

## How the Layers Communicate

The layers are not isolated silos. They form a directed acyclic graph of data dependencies:

```
L8 Symbolic ──verifies──▶ L6 Reasoning
     │                        │
     │                   scores from
     │                        │
L7 Embeddings ◀──indexes──▶ L4 Context Tree
     │                        │
     │                   curates from
     │                        │
L5 FrontalLobe ──gates──▶ L1 Core Memory
     │                        │
     │                   governs
     │                        │
L3 Analytics ◀──tracks──▶ L2 Conversations
                              │
                         enriched by
                              │
                        L2.5 External Intel
```

Every layer has a **check** skill (diagnostic) and a **fix** skill (self-healing). The `run-agi` launcher starts 8 monitoring agents, one per layer, that continuously audit health and trigger repairs.

## Reading This Documentation

Each layer page follows the same structure:

1. **The Hook** — Why should you care about this layer?
2. **How It Works** — Technical architecture and data flow
3. **Why This Layer Exists** — The problem it solves
4. **Benefits to the System** — What it enables
5. **Failure Modes** — When and how it breaks
6. **Communication & Connections** — Who it talks to
7. **Peak Impact** — When this layer matters most
8. **Conclusion** — Key takeaways

Start with Layer 1 and read sequentially, or jump to any layer that interests you. The pages are self-contained but reference each other where dependencies exist.

---

*Total system stats: 51 tables, 15,400+ rows, 21 knowledge domains, 94 registered tools, 35+ skills, 768-dimensional Ollama embeddings.*
