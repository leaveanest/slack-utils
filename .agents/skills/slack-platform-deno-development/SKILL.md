---
name: slack-platform-deno-development
description: Use when designing, implementing, or debugging Slack Platform primitives in this repository with Deno Slack SDK v2, including custom functions, workflows, link/scheduled/event/webhook triggers, manifest scopes, datastores, Slack Web API calls, Block Kit messages/modals/interactivity, Slack native functions, external auth, or Slack CLI behavior directly tied to a Slack app change.
---

# Slack Platform Deno Development

## Overview

Use this skill to make Slack Deno SDK work in this repository feel boring and
deterministic: choose the right Slack Platform primitive, inspect the right
local files, verify current official docs, implement with this repo's i18n/Zod
rules, and validate with Deno/Slack CLI checks.

This skill is project-scoped. It assumes the repo structure in `slack-utils`:
`manifest.ts`, `functions/`, `workflows/`, `triggers/`, `lib/`, `locales/`,
`docs/`, `deno.jsonc`, `import_map.json`, `.mise.toml` when present, and
`slack.json`.

## When Not To Use

- For pure code review of a diff or PR, use the review workflow/skill first and
  load this skill only for Slack-specific facts.
- For external SaaS connector adoption, use `slack-connector-functions` as the
  primary skill; return here only for workflow, manifest, trigger, or external
  auth integration details.
- For generic Deno, CI, formatting, release, or GitHub Actions work unrelated to
  Slack Platform behavior, follow the repo's normal development workflow.
- For Slack workspace mutations such as deploys, trigger creation, trigger
  access changes, datastore writes, or function access changes, proceed only
  when the user explicitly asks for that operation and the target workspace/app
  is clear.

## Workflow

1. Classify the requested Slack work before editing:
   - Slack-only operation: prefer Slack native functions or Slack Web API.
   - External SaaS operation: check the existing `slack-connector-functions`
     skill and the official connector catalog before custom OAuth/API code.
   - User-started workflow: usually link trigger plus `OpenForm` or modal.
   - Time-based workflow: scheduled trigger.
   - Slack event-based workflow: workflow event trigger if supported; otherwise
     consider Events API/Socket Mode outside this Deno SDK workflow pattern.
   - External system-started workflow: webhook trigger.
2. Inspect local code with fast repo search before designing:
   - `manifest.ts` for workflows, functions, scopes, datastores, domains.
   - `functions/*/mod.ts` and `test.ts` for handler and test patterns.
   - `workflows/*.ts` for step wiring and native/connector function usage.
   - `triggers/*.ts` for trigger typing and `TriggerContextData`.
   - `lib/validation/schemas.ts`, `lib/i18n/mod.ts`, and `locales/*.json` for
     Zod/i18n rules.
3. Verify current Slack docs for the exact primitive before implementing. Slack
   docs change often; do not rely only on memory for scopes, method limits,
   trigger syntax, connector availability, or CLI command flags.
4. Read only the reference files needed for the task:
   - `references/architecture.md` for SDK, manifest, workflow, function, and
     datastore design.
   - `references/triggers-events.md` for link/scheduled/event/webhook triggers
     and Events API boundaries.
   - `references/block-kit-interactivity.md` for Block Kit, `OpenForm`, modals,
     view handlers, and interactive messages.
   - `references/web-api-scopes.md` for Web API methods, scopes, pagination,
     rate limits, token visibility, and error handling.
   - `references/native-connectors-external-auth.md` for Slack native functions,
     connector functions, and external OAuth decisions.
   - `references/cli-deno-ci.md` for Slack CLI v4, Deno v2, local/deploy,
     testing, hooks, and CI.
5. Implement in the repo's established style:
   - Custom functions live in `functions/<name>/mod.ts` with `DefineFunction`
     and `SlackFunction` together.
   - Tests live next to functions as `test.ts`.
   - Workflows live in `workflows/` and use explicit `addStep` wiring.
   - Triggers live in `triggers/` and use `Trigger<typeof Workflow.definition>`.
   - Public functions get JSDoc.
   - User-facing strings, errors, logs, Slack text, and fallback text use i18n.
   - Inputs and external data are validated with Zod schemas from
     `lib/validation`.
6. Validate proportionally:
   - Run `deno fmt --check`, `deno lint`, `deno task check`, `deno task test`,
     and `deno task i18n:check` when code changes are made. If Deno is managed
     by mise or is not on PATH, run the same commands through the repository's
     `.mise.toml` toolchain, for example `mise x --command "deno task test"`.
   - For read-only Slack CLI validation, prefer `slack manifest validate` when
     the CLI is installed and credentials exist.
   - Run stateful Slack CLI commands such as `slack run`,
     `slack trigger create --trigger-def ...`, `slack deploy`, or
     `slack activity --tail` only after explicit user request and target
     workspace/app confirmation.

## Hard Rules

- Do not hardcode user-facing Slack text, error text, or log text in new code.
- Do not add inputs, environment values, trigger payload fields, or external API
  responses without validation.
- Do not call Slack Web API data before checking `response.ok` and required
  response fields.
- Do not assume local triggers work for deployed apps; local and deployed
  triggers are separate.
- Do not assume Events API event names map one-to-one to Deno workflow
  `TriggerEventTypes`.
- Do not add custom OAuth/API client code before checking Slack connector
  functions when the task involves an external SaaS.
- Do not add App Home behavior to a Deno Slack SDK workflow app without first
  confirming current platform support; official docs have stated Deno SDK apps
  cannot use App Home.

## Output Expectations

When using this skill, include:

- The selected Slack primitive and why.
- Files to edit and manifest/scope/domain changes needed.
- Trigger, Block Kit, Web API, datastore, connector, or CLI constraints that
  could surprise the next developer.
- Test and validation commands actually run or intentionally skipped.
- Official Slack/Deno doc links when a current behavior, scope, limit, or CLI
  command influenced the design.
