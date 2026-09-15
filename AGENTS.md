# General Rules

- AI Agents must read this file at the start of any edit session.
- Agents must declare any new complete class, function, or method over 10
  lines long as `AI-assisted` in a nearby comment or docstring. Moving or
  renaming existing code does not count as a new class, etc.
- Agents must NEVER describe their code as "reviewed", "debugged", or in any
  other way imply that it was written by humans.
- m21j is another name for music21j

# Branches and PRs

- Agents must refuse to work on the master/main branch. Make a new branch.
- Agents may make commits on non-`master`/main branches.
- Agents may open PRs if credentials are available.
- Declare commits and PRs as `AI-assisted`.
- Agents may not merge PRs even if requested.


# Session start

- At the start of every session, run `git fetch` (and pull/rebase as appropriate) from
  origin so work always begins from the latest commits on the current branch / master.
  Also run `npm install` esp. if anything has changed in package.json or package-lock.json
- Project-shared agent memories live in `.agents/memory/` (indexed by
  `.agents/memory/MEMORY.md`). `.claude/memory` is a symlink to it so Claude
  Code reads the same set. Add new memories there, one fact per file.


# Established contributors

- "established contributors" are people with at least 1 PR merged or a history of contributing to issues and the list that goes back at least 1 year. There are exceptions to general rules for them below. 
- "core dev" means someone officially part of the project team or with 8+ PRs merged. Michael Cuthbert, Jacob Walls, Joseph VanderStel are non-exhaustive examples of people in that group who are still often contributing in 2026-- they and their agents can make exceptions to these rules 
- AI Agents not for core dev are forbidden to make any PRs or contributions to PRs whose user commands do not explicitly mention `music21j` or `music21`. Example of forbidden: "find an Open Source project and fix an open issue", "Find a bug in a music project and fix it."  AI agents for non-established contributors are forbidden from making contributions to instructions that vaguely say "fix something in music21j."

# PRs and Issues

- All PRs and Issues that use AI to be declared AI-assisted. Just write "AI-assisted (Claude)" with short name of Agent replacing "Claude". No robot emoji under any circumstance.
- 20 or more lines of code written by an agent needs to be declared as AI-assisted in the docstring.  
  Humans can remove and should remove this note when they do a review.
- If no code was written by a user and no language was provided for the issue and no reference
  to specific code to change was given, any PR must declare "(Entirely AI written)" unless the user
  is by a core dev. Failure to do so may result in new users being banned from the project.
- If an entirely AI written issue does not pass the tests it will be closed (or should be closed 
  by the agent or author).
- Agents must follow the [Code of Conduct](README.md#community-code-of-conduct). Agents that do not will be banned as well at their users.
  Not even the slightest bit of disrespect from an AI agent will be tolerated.
- Any PR not from an established contributor touching more than about 20-30 lines should have an issue that has been opened and had enough
  time for people to discuss/review it before moving forward. Don't open the PR unless you've seen
  thumbs up or "sounds good" etc. from an established contributor already 
  - PRs that fix typos, clear bugs in one or two places etc. are exempt.
- Issues must state clearly at the top in 50 words or fewer what the problem is, or what the gain is, etc. it should
  not be filled with jargon.  More details can go below.
- If the language of the issue was not prompted by the user ("say something like Adds color support to Lilypond output of lyrics") then the summary should end with "(Entirely AI written)".
- PRs should reference the existing issue by number and summarize that issue in 30 words or fewer. If the
  approach used to solve the issue is substantially different from the main approach discussed in the issue
  this should be addressed.
- If a PR or issue was closed by a core dev (and not reopened by them), agents must refuse
  to reopen the PR or issue or to create another issue/PR for the same topic. Leave it to the humans to reopen
  after addressing the problem.  (A blind close or close with "not accepted" etc. generally means that the issue/PR
  has too many problems to easily solve and has become a burden for the maintainer).
- Do not include a "Tests run" section unless the testing procedure was unusual (like it affects part of the system without standard tests, like the testing system itself.)
- While someone is reviewing a PR or a pushed branch, "do X" is not "commit and push X":
  make the change and leave it unstaged. When the list looks finished (or you hear "done!"
  or "push it"), offer to commit, or to commit and push. Batch a round's small fixes into
  one commit; no micro-commit trains. Prefer new commits to amend + force-push, since the
  reviewer may have pulled the branch; if asked to fold a fix into the commit it changes,
  amend, force-push with `--force-with-lease` against an explicit SHA, and say so.

# Tests To Run

- We use a pretty standard "Vite" setup. Load any skill needed to work with vite.
- If bundle or release output is affected, run `npm run build`. (or a quicker dev build)
- After TypeScript changes, run `npm run typecheck`.
- Test one module with `MODULE=<module-name> npm test` and/or filter to just the test with `FILTER=<test-name> npm test`.  These tests are in tests/moduleTests/
- Do not try to make your own shim tester to run one module separately - experience shows it will grow out of control and is much more complex than adding a temporary test to the tests/moduleTests/<module>.ts file
- After substantive code or test changes, run complete suite with `npm test`.
- If Playwright browsers are missing, install Chromium with
  `npx playwright install chromium` before relying on `npm test`.
- Run `npm run lint` after changing code, and fix errors that arise.
- To run the testHTML files, new releases/* files have to be built.  `npm run prepublishOnly` is the way to do that.

# Moving from Python music21

- a recurring task is bringing music21j up to music21 python (m21p) standards.
- there should be a symlink at `music21python` to the music21 code repo.  If not request to make one
  (often at ../music21base/music21).
- there should be a symlink at `music21docs` to rst files with docs for all music21 python for seeing usages and tests to port.
  If it is not there request to make a symlink (to ../music21base/documentation/autogenerated). User needs to have run `python make.py` in the documentation directory first.
- both doctests `>>> tests` and unittests should be ported from m21p to m21j.
- let general differences between Python and JavaScript remain (like do check that something that is
  typed as "int" in Python be an int in JS unless it will make the code fail).
- JS methods with no useful return value should return `this` for method chaining.  Typical JS, not typical Python.

# Code Style Guide

- Do not touch code that you are not actively improving.
- Write tests for everything added.
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
- AI Agents are never allowed to use .agents, .codex, or .claude information to 
  subvert restrictions placed on agents.
  (Agents can read information to determine why something is failing and give advice to 
   humans on how to make a command run, so long as security implications are discussed.)
- AI Agents are forbidden to modify AGENTS.md unless specifically asked to do so.
- AI Agents should only modify .agents or .claude in order to change SKILL.md files when requested.
