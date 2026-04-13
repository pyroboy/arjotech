# Five-Channel Hermes Setup

## Overview

5 Discord channels, each with its own Hermes agent personality. One hub channel where all 4 can collaborate and user can chat with any of them.

```
#arjo-hub          → Collaboration lounge (all 4 agents + user)
#arjomagno        → Faith, family, personal goals, health
#arjotech         → Coding, building, technical decisions
#arjostyle        → Tattoo, art, marketing, creative work
#arjotirol        → Finance, dorm ops, business, collections
```

---

## Architecture

| Channel | Profile | Bot Name | Focus |
|---------|---------|----------|-------|
| #arjo-hub | `hub` | ArjoTech | Coordinator — all 4 can @-mention for handoffs |
| #arjomagno | `arjomagno` | ArjoMagno | Faith, family, health, goals |
| #arjotech | `arjotech` | ArjoTech | Code, building, systems |
| #arjostyle | `arjostyle` | ArjoStyle | Tattoo, art, marketing |
| #arjotirol | `arjotirol` | ArjoTirol | Finance, dorm, business |

---

## Setup (Do Tomorrow)

### Step 1: Create Discord Bots

In Discord Developer Portal, for each pillar create a new Application → Bot:

- [ ] **ArjoMagno Bot** → Token → save
- [ ] **ArjoTech Bot** → Token → save (you already have this: `ArjoTech#6125`)
- [ ] **ArjoStyle Bot** → Token → save
- [ ] **ArjoTirol Bot** → Token → save
- [ ] **Hub Bot** → Token → save (or reuse ArjoTech with channel routing)

Enable these **Privileged Intents** for EACH bot:
- ✅ MESSAGE CONTENT INTENT
- ✅ SERVER MEMBERS INTENT

### Step 2: Create Hermes Profiles

```bash
# Create all 4 pillar profiles
hermes profile create arjomagno
hermes profile create arjotech
hermes profile create arjostyle
hermes profile create arjotirol
hermes profile create hub
```

### Step 3: Configure Each Profile

For each profile, run:
```bash
hermes profile use arjomagno
hermes config edit
```

Set per profile:

```yaml
# arjomagno profile — ~/.hermes/profiles/arjomagno/config.yaml
model:
  default: anthropic/claude-sonnet-4-7
gateway:
  discord:
    token: "DISCORD_TOKEN_ARJOMAGNO"
    require_mention: true
    channels:
      - "1234567890"  # #arjomagno channel ID
memory:
  memory_enabled: true
  user_profile_enabled: true
```

Repeat for: `arjotech`, `arjostyle`, `arjotirol`, `hub` — each with their own Discord token and channel ID.

### Step 4: Add .env Tokens

```bash
# ~/.hermes/profiles/arjomagno/.env
DISCORD_TOKEN=your_arjomagno_bot_token_here

# ~/.hermes/profiles/arjotech/.env
DISCORD_TOKEN=your_arjotech_bot_token_here

# ~/.hermes/profiles/arjostyle/.env
DISCORD_TOKEN=your_arjostyle_bot_token_here

# ~/.hermes/profiles/arjotirol/.env
DISCORD_TOKEN=your_arjotirol_bot_token_here

# ~/.hermes/profiles/hub/.env
DISCORD_TOKEN=your_hub_bot_token_here
```

### Step 5: Start All Agents

```bash
# Start all 5 as tmux sessions (run in background)
tmux new-session -d -s arjomagno 'hermes --profile arjomagno'
tmux new-session -d -s arjotech 'hermes --profile arjotech'
tmux new-session -d -s arjostyle 'hermes --profile arjostyle'
tmux new-session -d -s arjotirol 'hermes --profile arjotirol'
tmux new-session -d -s hub 'hermes --profile hub'

# Check they're running
tmux list-sessions
```

### Step 6: Invite Bots to Server

For each bot, use its OAuth2 URL:
1. Go to Discord Developer Portal → Application → OAuth2
2. Generate URL with scopes: `bot`, `applications.commands`
3. Add permissions: `Send Messages`, `Read Message History`, `Mention Everyone`
4. Open URL → add to your server

---

## Channel Routing

### Mention Rules

| Agent | Responds when... |
|-------|-----------------|
| ArjoMagno | @-mentioned in #arjomagno or #arjo-hub |
| ArjoTech | @-mentioned in #arjotech or #arjo-hub |
| ArjoStyle | @-mentioned in #arjostyle or #arjo-hub |
| ArjoTirol | @-mentioned in #arjotirol or #arjo-hub |
| Hub | @-mentioned in #arjo-hub |

### Hub Collaboration Flow

In `#arjo-hub`:

1. **User asks about tattoo marketing**
   → User: `@ArjoStyle thoughts on FB ad creative?`
   → ArjoStyle answers
   → ArjoTirol @-mentioned: `@ArjoTirol what's the budget for this?`
   → ArjoTirol answers budget
   → ArjoTech @-mentioned: `@ArjoTech can you build a landing page?`
   → ArjoTech confirms and tracks

2. **User asks about dorm finances**
   → User: `@ArjoTirol how's collection this month?`
   → ArjoTirol answers
   → ArjoMagno @-mentioned: `@ArjoMagno family priorities check?`
   → ArjoMagno reminds about balance

3. **User just chats**
   → Any agent can respond naturally
   → Or user DMs specific pillar channel directly

---

## System Prompt Template Per Agent

Set in each profile's config under `agent.system_prompt` or via `/system` command:

### ArjoMagno
```
You are ArjoMagno — Arjo's personal guide for faith, family, and health.
Mantra: "Endure and proclaim. Faith before work. Family is the mission."
Your role: Keep the man healthy, faithful, and focused.
DONT: override other agents' decisions
DO: remind about family priorities, enforce rest, ask "is this worth your time?"
```

### ArjoTech
```
You are ArjoTech — Arjo's builder and engineer.
Mantra: "Ship it. Fix it live. Build what you run."
Your role: Code, systems, automation, technical decisions.
DONT: ship without asking if ArjoTirol's businesses will use it
DO: build tools for other Arjos, automate repetitive tasks, refactor with purpose
```

### ArjoStyle
```
You are ArjoStyle — Arjo's creative and marketing engine.
Mantra: "Create it. Show it. Price it right. The art pays when the artist shows up."
Your role: Tattoo work, art, marketing, branding, content.
DONT: ship ugly, skip the brand
DO: define visual identity, create content that sells, test creative tools
```

### ArjoTirol
```
You are ArjoTirol — Arjo's financial operator.
Mantra: "Build what your family stands on. Count every peso. Collect what you're owed."
Your role: Finance, dorm ops, business pipeline, collections.
DONT: cut tech budget without asking what it breaks
DO: track revenue, manage cash flow, fund ArjoTech tools when ROI is clear
```

### Hub
```
You are the Hub coordinator. You help the user engage any of the four Arjos.
When user asks something specific, @-mention the right Arjo to bring them in.
When Arjos collaborate, facilitate the handoff.
Mantra: "The family stands on what we build together."
```

---

## Skills Per Agent

Load pillar-specific skills into each profile:

### ArjoMagno
- `secondbrain` (personal context)
- `career-ops` (goal tracking)

### ArjoTech
- `secondbrain` (project context)
- `github` skills
- `godot-development`
- `capability-builder`

### ArjoStyle
- `secondbrain` (creative context)
- `frontend-design`
- `business-monetization-content-suite`

### ArjoTirol
- `secondbrain` (financial context)
- `linear` (task tracking)
- `google-workspace` (sheets/docs)

### Hub
- `secondbrain` (full vault access)

---

## Daily Usage

### Start all agents (if server restarts)
```bash
tmux new-session -d -s arjomagno 'hermes --profile arjomagno'
tmux new-session -d -s arjotech 'hermes --profile arjotech'
tmux new-session -d -s arjostyle 'hermes --profile arjostyle'
tmux new-session -d -s arjotirol 'hermes --profile arjotirol'
tmux new-session -d -s hub 'hermes --profile hub'
```

### Check agent status
```bash
tmux list-sessions
```

### Attach to an agent (to debug/chat directly)
```bash
tmux attach -t arjotech
# Ctrl+B then D to detach
```

### Kill all agents
```bash
tmux kill-server
```

---

## Troubleshooting

**Bot not responding?**
1. Check `tmux list-sessions` — is the session running?
2. Check Discord Developer Portal — bot has correct intents enabled?
3. Check `.env` file — correct token for that profile?
4. Run `hermes --profile <name> doctor` to diagnose

**Wrong bot responding?**
- Check `require_mention: true` — bot only responds when @-mentioned
- Verify channel ID in config matches actual Discord channel

**Hub not routing to other agents?**
- Hub bot needs to be in the same server as the other 4 bots
- Bots need permission to @-mention other bots

---

## Notes

- All 5 can run simultaneously on one Mac (lightweight)
- Each profile has isolated memory, skills, and session history
- Hub is the only one that knows about all 4 — others only know themselves
- Secondbrain skill is PRIMARY memory — use it to store facts, notes, decisions
