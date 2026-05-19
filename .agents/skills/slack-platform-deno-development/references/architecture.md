# Architecture Reference

Use this reference for Deno Slack SDK v2 app structure, manifest design,
functions, workflows, and datastores.

## Official Sources

- Deno Slack SDK: https://docs.slack.dev/tools/deno-slack-sdk/
- Creating functions: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-functions/
- Creating custom functions: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-custom-functions/
- Creating workflows: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-workflows/
- Using the app manifest: https://docs.slack.dev/tools/deno-slack-sdk/guides/using-the-app-manifest/
- App manifest reference: https://docs.slack.dev/reference/app-manifest/
- Using datastores: https://docs.slack.dev/tools/deno-slack-sdk/guides/using-datastores/
- Adding items to a datastore: https://docs.slack.dev/tools/deno-slack-sdk/guides/adding-items-to-a-datastore/
- Retrieving items from a datastore: https://docs.slack.dev/tools/deno-slack-sdk/guides/retrieving-items-from-a-datastore/
- Deleting items from a datastore: https://docs.slack.dev/tools/deno-slack-sdk/guides/deleting-items-from-a-datastore/

## Core Model

| Element | SDK API | Role | Repo location |
|---|---|---|---|
| App manifest | `Manifest({...})` | App name, scopes, workflows, functions, datastores, domains | `manifest.ts` |
| Custom function definition | `DefineFunction` | `callback_id`, `source_file`, input/output schema | `functions/<name>/mod.ts` |
| Custom function handler | `SlackFunction` | Receives `inputs`, `client`, `env`, `token`, event/team context; returns `{ outputs }` or `{ error }` | `functions/<name>/mod.ts` |
| Workflow | `DefineWorkflow` + `addStep` | Chains Slack/native/connector/custom functions | `workflows/*.ts` |
| Trigger | `Trigger`, `TriggerTypes`, `TriggerContextData` | Starts workflow from link, schedule, event, or webhook | `triggers/*.ts` |
| Datastore | `DefineDatastore`, `client.apps.datastore.*` | Slack-hosted NoSQL state | Usually `datastores/*.ts` plus manifest |

## Manifest Checklist

| Need | Manifest property | Notes |
|---|---|---|
| Bot scopes | `botScopes` | SDK guide uses this instead of writing `oauth_config.scopes.bot` directly. |
| Custom function | `functions` | Every used custom function definition must be listed. |
| Workflow | `workflows` | Every trigger target workflow must be listed. |
| External HTTP | `outgoingDomains` | Required for non-Slack external domains. Slack Web API calls do not need `slack.com` here. |
| Datastore | `datastores` plus scopes | Add `datastore:read` and/or `datastore:write`. |
| External OAuth | `externalAuthProviders` | Pair with `DefineOAuth2Provider` and `Schema.slack.types.oauth2`. |
| Custom types/events | `types`, `events` | Use for Slack metadata events or reusable custom types. |

## Function Rules

1. Put `DefineFunction` and `SlackFunction` in the same `functions/<name>/mod.ts`
   unless there is a strong local pattern saying otherwise.
2. Keep `source_file` exactly aligned with the file path.
3. Validate every input before use. Prefer schemas in `lib/validation/schemas.ts`;
   add schemas and tests there when needed.
4. Wrap the handler in `try/catch`, return `{ outputs }` on success and
   `{ error: message }` on failure.
5. Check every Slack API response with `response.ok` before reading data.
6. Use i18n for error, log, fallback, and Slack-visible strings.
7. Export pure helper functions for logic that can be unit-tested without the
   Slack runtime.

## Workflow Rules

1. Define workflow inputs with `DefineWorkflow`.
2. Wire inputs explicitly with `Workflow.inputs.foo` and `step.outputs.bar`.
3. Use Slack native functions for simple Slack-side actions before writing
   custom code.
4. Use connector functions for supported external SaaS actions before custom
   OAuth/API clients.
5. Keep workflows readable: one obvious business flow per file.

## Datastore Notes

- Add `datastores: [MyDatastore]` and the required datastore scopes.
- Use `put`/`bulkPut` for full item replacement and `update` for partial update.
- Use `get` for primary-key lookups; `query` is scan/filter-style and should not
  replace primary key access.
- Store idempotency keys such as event IDs when workflow side effects must not
  run twice.
- Keep items under Slack's documented size limit and handle bulk partial failure.

## Repo-Specific Observations

- `manifest.ts` already registers `ExampleWorkflow` and
  `ExampleFunctionDefinition`.
- `functions/example_function/mod.ts` follows the basic custom function pattern,
  but `conversations.info` should include `include_num_members: true` when
  `num_members` is required.
- This repo's rules require JSDoc for public functions, Zod validation, i18n,
  and colocated tests.
