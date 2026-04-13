# Claude Code Project Configuration
 
 > **This file inherits all rules from [`AGENTS.md`](AGENTS.md).**
 > Read `AGENTS.md` and [`CONSTITUTION.md`](CONSTITUTION.md) in full before starting any work.
 > Only Claude-specific overrides and notes are listed below.
 
 ---
 
 ## Claude-Specific Notes
 
 - This file is a **compatibility shim**, not a second repository handbook.
 - The canonical governance stack is:
   - `CONSTITUTION.md` = highest-level project governance
   - `AGENTS.md` = shared cross-agent operating handbook
   - `CLAUDE.md` = Claude-specific overlay only
 - `.claude/skills/` may exist locally as compatibility aliases pointing to the shared `.agents/skills/` bundles. Do not duplicate skill content here.
 - When Claude Code is the active agent, the same Agent Pipeline rules from `AGENTS.md` §🤖 apply — audit first, keep changes scoped, validate before closing.
 - All common commands, architecture guardrails, runtime surfaces, repo boundaries, and guidelines are defined in `AGENTS.md` and are not repeated here.
