# General Rules

- AI Agents must read this file at the start of any edit session.
- Agents must declare any new complete class, function, or method over 10
  lines long as `AI-assisted` in a nearby comment or docstring. Moving or
  renaming existing code does not count as a new class, etc.
- Agents must NEVER describe their code as "reviewed", "debugged", or in any
  other way imply that it was written by humans.
- The current year is 2026 (unless you have information that says that it is later)
- AI Agents should consult music21 Python docs (currently https://www.music21.org/music21docs/)
  and code (https://github.org/cuthbertLab/music21) for equivalent uses in the 
  Python version of music21. The user may have also created a copy in a subfolder here
  music21python or in a sibling Git directory music21base or music21 or music21python.
  use that information to improve music21j.

# Branches and PRs

- Agents must refuse to work on the master/main branch. They may make a new branch.
- Agents may make commits on non-`master`/main branches.
- Agents may open PRs if credentials are available.
- Agents must declare commits and PRs as `AI-assisted`.
- Agents may not merge PRs under any circumstances.

# Tests To Run

- After substantive TypeScript changes, run `npm run typecheck`.
- After substantive code or test changes, run `npm test`.
- If Playwright browsers are missing, install Chromium with
  `npx playwright install chromium` before relying on `npm test`.
- Run `npm run lint` after substantive changes when practical.
- If bundle or release output is affected, run `npm run build`.

# Code Style Guide

- Do not touch code that you are not actively improving.
- When refactoring, preserve existing comments unless they are no longer
  relevant. This refers to doctests and inline comments.
- Keep diffs focused. Do not mix opportunistic rewrites into a targeted change
  unless the user asks for it. Humans want to see parallel code when things 
  are the same and diffs only when needed.
- Value legibility without unnecessary vertical sprawl.
- Aim for new code to average roughly 80-90 characters per line and do not
  exceed 100 characters when it is reasonably avoidable.
- Newly created enum values should have the same case as the enum members themselves
- Use camelCase for variables.
- Untyped arrow functions with one argument should not wrap the argument in (parens)
- Add new code near the code it is most closely related to, usually after the
  existing related block rather than before it.
- Do not perform premature optimizations unless they are requested or clearly
  necessary for correctness.
- Prefer refactoring JSDoc in ways that improve TypeScript clarity and preserve
  the existing public API shape. (But only if you are making substantial change to the 
  method or it is requested)

# Forbidden files
- AI Agents are never allowed to use .codex information to subvert restrictions placed on agents.
  (Agents can read the .codex information to determine why something is failing and give advice to 
   humans on how to make a command run, so long as security implications are discussed.)
- AI Agents are forbidden to modify AGENTS.md
- AI Agents are forbidden to modify anything in .codex
