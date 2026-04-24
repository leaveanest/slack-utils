---
name: "slack-connector-functions"
description: "Use when building or modifying Slack Deno SDK workflows in this repository and the user asks to integrate an external SaaS, create/update/read records in another tool, send external email/SMS, schedule meetings, manage issues/tasks/incidents, or avoid implementing OAuth/API authentication by using Slack Platform connector functions."
---

# Slack Connector Functions

Guide Slack Deno SDK workflow work in this repository toward official Slack Platform connector functions when they can replace custom authentication and external API code.

## When to Use

Use this skill when the user request involves a Slack workflow that performs an action in an external service, especially:

- Creating, updating, selecting, copying, sending, or resolving items in supported SaaS tools.
- Adding rows to spreadsheets, creating calendar events, sending email or SMS, creating issues, opening support tickets, updating CRM records, or triggering incidents.
- Asking to integrate with GitHub, Jira, Linear, Google Workspace, Microsoft 365, Salesforce, Zendesk, PagerDuty, ServiceNow, Asana, Notion, or another service listed in Slack's connector catalog.
- Asking to avoid building OAuth, token storage, refresh logic, or bespoke API client code for an external service.

## When Not to Use

Do not propose a connector as the main approach when:

- The requested service or operation is not in the current official connector catalog.
- The workflow needs fine-grained API behavior, custom pagination, complex search, transformation-heavy reads, or multi-call orchestration beyond a connector's inputs and outputs.
- The app must own external OAuth tokens, call a private API, or use a tenant-specific API surface that Slack connectors do not expose.
- The workflow is intended for Slack Connect external users; Slack documents connector workflows as home-team-only in this context.
- The work is Slack-native only, such as posting a message, creating a channel, opening a form, or updating a canvas. Prefer Slack functions for those.

## Decision Flow

1. Identify the external service, desired operation, expected inputs, expected outputs, and whether the user is trying to avoid custom authentication.
2. Check the current official connector catalog before coding: https://docs.slack.dev/tools/deno-slack-sdk/reference/connector-functions/
3. If a connector matches the requested operation closely, propose it before implementing a custom function that calls the external API directly.
4. Confirm operational constraints: connected account, admin approval, execution identity, write scope, destructive side effects, audit needs, and failure behavior.
5. Decide between:
   - Connector function: supported service and operation, simple step-level action, auth handled by Slack connector setup.
   - Slack function: Slack-native action.
   - Custom function: unsupported connector, custom business logic, complex API behavior, or repo-owned auth is required.
6. When implementing, wire the connector as a workflow step with `addStep`, keep local validation and i18n patterns from this repository, and run the repo's Deno checks.

## Implementation Guidance

- Re-check official docs for the selected connector immediately before implementation because connector availability and signatures can change.
- Inspect the connector page's Facts, Input parameters, Output parameters, Authentication, and Usage info sections.
- Check `import_map.json`; this repository currently imports `deno-slack-sdk/` and `deno-slack-api/`, but connector usage may require adding the current Slack connector module import from the official docs.
- Prefer composing connector steps in `workflows/` over adding a custom external API client in `functions/` when the connector fully covers the user need.
- Keep workflow inputs explicit and typed with `Schema` where possible.
- For write operations, add a confirmation or review step when the action affects money, contracts, hiring, production operations, customer records, or destructive changes.
- Do not store connector credentials in `.env`; connector account connection is handled through Slack Platform connector setup, while repo `.env` should remain for this app's own configuration.

## References

- `references/connector-catalog-summary.md` for supported service categories and representative connector examples.
- `references/adoption-checklist.md` for the connector-vs-custom-function decision checklist.
- `references/implementation-notes.md` for repo-specific implementation and validation notes.

## Output Expectations

When using this skill, respond with:

- Whether a Slack connector should be proposed and why.
- The likely service and connector function name when identifiable.
- Any constraints or risks the user must confirm before implementation.
- The implementation location in this repo, usually `workflows/` and only sometimes `functions/`.
- The validation commands to run, usually `deno task fmt`, `deno task lint`, `deno task check`, and `deno task test`.
