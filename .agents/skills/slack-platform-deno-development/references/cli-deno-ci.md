# Slack CLI, Deno, And CI Reference

Use this reference for local development, deploy, trigger management, Deno
validation, hooks, and CI updates.

## Official Sources

- Slack CLI commands: https://docs.slack.dev/tools/slack-cli/guides/running-slack-cli-commands
- Windows install: https://docs.slack.dev/tools/slack-cli/guides/installing-the-slack-cli-for-windows/
- Authorization: https://docs.slack.dev/tools/slack-cli/guides/authorizing-the-slack-cli/
- `slack run`: https://docs.slack.dev/tools/slack-cli/reference/commands/slack_run/
- `slack deploy`: https://docs.slack.dev/tools/slack-cli/reference/commands/slack_deploy/
- `slack activity`: https://docs.slack.dev/tools/slack-cli/reference/commands/slack_activity/
- `slack env`: https://docs.slack.dev/tools/slack-cli/reference/commands/slack_env/
- `slack trigger`: https://docs.slack.dev/tools/slack-cli/reference/commands/slack_trigger/
- `slack datastore`: https://docs.slack.dev/tools/slack-cli/reference/commands/slack_datastore/
- `slack function access`: https://docs.slack.dev/tools/slack-cli/reference/commands/slack_function_access/
- `slack docs search`: https://docs.slack.dev/tools/slack-cli/reference/commands/slack_docs_search/
- Hooks: https://docs.slack.dev/tools/slack-cli/reference/hooks/
- Local development: https://docs.slack.dev/tools/slack-cli/guides/developing-locally/
- GitHub Actions deploy: https://docs.slack.dev/tools/slack-cli/guides/deploying-the-slack-cli-with-github-actions/
- Deno config: https://docs.deno.com/runtime/fundamentals/configuration/
- Deno modules/import maps: https://docs.deno.com/runtime/fundamentals/modules/
- Deno permissions: https://docs.deno.com/runtime/manual/getting_started/permissions
- Deno test/check/fmt/lint/task references: https://docs.deno.com/runtime/reference/cli/

## Command Table

| Phase | Purpose | Command |
|---|---|---|
| Install | Check CLI | `slack version` |
| Install | Windows install | `irm https://downloads.slack-edge.com/slack-cli/install-windows.ps1 | iex` |
| Auth | Login/list auth | `slack login`, `slack auth list` |
| Local | Run app | `slack run` |
| Local | Create local trigger | `slack trigger create --trigger-def triggers/example_trigger.ts` |
| Local | Validate manifest | `slack manifest validate` |
| Test | Format/lint/check/test | `deno fmt --check`, `deno lint`, `deno task check`, `deno test --allow-env --allow-read --allow-net` |
| Deploy | Set env | `slack env set KEY value`, `slack env list` |
| Deploy | Deploy app | `slack deploy` or `slack deploy --team T...` |
| Deploy | Create deployed trigger | `slack trigger create --trigger-def triggers/example_trigger.ts` and select deployed app |
| Operate | Tail activity | `slack activity --tail --level info` |
| Operate | Trigger management | `slack trigger list/info/update/delete/access` |
| Operate | Datastore management | `slack datastore query/get/put/update/delete` |
| Operate | Function access | `slack function access --name callback_id --everyone` |
| Docs | Search current docs | `slack docs search "query" --output=json --limit=5` |

## Windows Notes

- Slack's Windows installer is PowerShell-oriented.
- Quote env values with URLs, spaces, or special characters:
  `slack env set SLACK_API_URL "https://example.com"`.
- This repo's git hook setup script is Bash-based; use Git Bash or WSL.

## Repo Observations

- `deno.jsonc` currently has `dev` as `slack run workflows/example_workflow`.
  Current Slack CLI v4 docs usually point to running from the app root with
  `slack run`; review before relying on this task.
- `deno.jsonc` `check` currently covers only `manifest.ts` and one workflow.
  Prefer checking `manifest.ts`, `functions/**/*.ts`, `workflows/**/*.ts`,
  `triggers/**/*.ts`, and `lib/**/*.ts`.
- `slack.json` uses `deno_slack_hooks@1.4.0`; current CLI hooks docs describe
  `.slack/hooks.json`. Verify CLI v4 compatibility before changing.
- README commands may need v4 updates: prefer `slack env set/list/unset`,
  `slack deploy`, and `slack trigger create --trigger-def`.
- CI workflows may be duplicated or mixed between `setup-deno` versions; inspect
  `.github/workflows/` before editing.

## Validation Standard

After code changes, run as much of the following as the environment allows:

```bash
deno fmt --check
deno lint
deno task check
deno test --allow-env --allow-read --allow-net
deno task i18n:check
```

If Slack CLI and auth are available, additionally run:

```bash
slack manifest validate
slack run
slack trigger create --trigger-def triggers/<trigger>.ts
slack activity --tail --level info
```

Do not claim Slack CLI validation succeeded unless the command was actually run.
