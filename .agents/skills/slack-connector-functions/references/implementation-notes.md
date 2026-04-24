# Implementation Notes for This Repo

This repository is a Slack Deno SDK template with workflows, functions, triggers, i18n, and validation patterns.

## Repo Context

- Slack SDK imports are configured in `import_map.json`.
- Example workflow code lives in `workflows/example_workflow.ts`.
- Custom function code lives under `functions/`.
- App manifest configuration lives in `manifest.ts`.
- Localized messages live in `locales/en.json` and `locales/ja.json`.

## Implementation Pattern

1. Start in `workflows/` and try to model the external SaaS operation as a connector `addStep`.
2. Add custom functions only for validation, Slack-specific preparation, post-processing, or unsupported logic.
3. Keep user-visible errors and labels aligned with the repository's i18n conventions.
4. Add or adjust workflow inputs rather than hard-coding service identifiers when users need reuse.
5. Update `manifest.ts` only when the workflow/function set or Slack scopes actually change.
6. Do not add outgoing domains for a connector unless custom API calls are also introduced.

## Docs to Recheck

- Connector catalog: https://docs.slack.dev/tools/deno-slack-sdk/reference/connector-functions/
- Connector guide: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-connector-functions/
- Function types overview: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-functions/

## Validation

Run the relevant checks after changes:

```bash
deno task fmt
deno task lint
deno task check
deno task test
```

If connector imports are added, run `deno task check` against the changed workflow files and verify that `import_map.json` uses the current import path from the official Slack docs.
