# Triggers And Events Reference

Use this reference when adding or debugging link, scheduled, event, or webhook
triggers, or when deciding between workflow event triggers and the lower-level
Events API.

## Official Sources

- Using triggers: https://docs.slack.dev/tools/deno-slack-sdk/guides/using-triggers
- Creating link triggers: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-link-triggers/
- Creating scheduled triggers: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-scheduled-triggers/
- Creating event triggers: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-event-triggers/
- Creating webhook triggers: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-webhook-triggers/
- Managing triggers: https://docs.slack.dev/tools/deno-slack-sdk/guides/managing-triggers/
- Events API: https://docs.slack.dev/apis/events-api/
- Events catalog: https://docs.slack.dev/reference/events/
- Verifying requests from Slack: https://docs.slack.dev/authentication/verifying-requests-from-slack/
- Rate limits: https://docs.slack.dev/apis/web-api/rate-limits/

## Trigger Selection

| Trigger | Use when | Watch for |
|---|---|---|
| Link / shortcut | A Slack user explicitly starts a workflow from Slack | Best for forms, approvals, and end-user external auth |
| Scheduled | Time or interval starts the workflow | Once/hourly/daily/weekly/monthly/yearly schedules; timezone clarity |
| Event | Supported Slack event starts the workflow | Not every Events API event is supported; app must be in relevant channels |
| Webhook | External system posts a flat JSON payload to Slack | Nested JSON can fail validation; protect the URL |

Local triggers and deployed triggers are separate. Recreate triggers after
`slack deploy`; do not expect a `slack run` trigger to work against a deployed
app.

## Workflow Event Trigger Basics

| Item | Guidance |
|---|---|
| Type | `TriggerTypes.Event` |
| Event enum | Use `TriggerEventTypes.*`, not raw Events API names, when available |
| Inputs | Use `TriggerContextData.Event.<EventName>.*` |
| Channel targeting | Use `channel_ids` or `all_resources: true` for channel-based events |
| Enterprise targeting | Workspace-based event triggers can require `team_ids` |
| Filter | Use `AND`, `OR`, `NOT`; there is no `!=`; nesting has limits; no short-circuit |
| Membership | App must be a member of channels where channel events are observed |

## Common Workflow Event Types

| Category | Trigger enum | Data/event name | Typical fields | Scopes |
|---|---|---|---|---|
| App mention | `AppMentioned` | `app_mentioned` | `channel_id`, `message_ts`, `text`, `user_id` | `app_mentions:read` |
| Message | `MessagePosted` | `message_posted` | `channel_id`, `channel_type`, `message_ts`, `thread_ts`, `text`, `user_id` | `channels:history`, `groups:history`; Deno docs have also mentioned `im:read`, `mpim:read` |
| Metadata | `MessageMetadataPosted` | `message_metadata_posted` | metadata type/payload, channel, timestamp | `metadata.message:read` |
| Reaction | `ReactionAdded`, `ReactionRemoved` | `reaction_added/removed` | `reaction`, `user_id`, `item_user`, `channel_id`, `message_ts` | `reactions:read` |
| Channel membership | `UserJoinedChannel`, `UserLeftChannel` | `user_joined_channel/user_left_channel` | `user_id`, `channel_id`, `inviter_id`, `channel_type` | `channels:read`, `groups:read` |
| Channel lifecycle | `ChannelCreated`, `ChannelDeleted`, `ChannelRenamed`, `ChannelArchived`, `ChannelUnarchived` | `channel_*` | `channel_id`, `channel_name`, creator/user IDs | `channels:read` |
| Slack Connect | `ChannelShared`, `ChannelUnshared`, invite events | shared channel/invite data | channel/team/invite data | `channels:read`, `groups:read`, `conversations.connect:*` |
| Other | `DndUpdated`, `EmojiChanged`, `PinAdded`, `PinRemoved`, `UserJoinedTeam` | event-specific | event-specific | `dnd:read`, `emoji:read`, `pins:read`, `users:read` |

Events API catalog names may differ from workflow trigger data names. Example:
Events API uses `app_mention`; Deno workflow trigger data may use
`app_mentioned`. Implement against current `TriggerEventTypes` and
`TriggerContextData`.

## Events API Versus Workflow Event Trigger

Use workflow event triggers first for Slack-hosted Deno workflow apps.

Consider the lower-level Events API or Socket Mode only when:

- The required event is not supported by workflow event triggers.
- You need custom routing, queueing, signature verification, or idempotency
  outside Slack-hosted workflow execution.
- You need events such as `file_shared`, `link_shared`, `app_home_opened`,
  `app_uninstalled`, `tokens_revoked`, or `app_rate_limited`.

Events API endpoints must respond with 2xx quickly, handle retries, and verify
`X-Slack-Signature` against the raw request body. Workflow event triggers are
Slack-managed and do not require repo-owned signature verification.

## Event Implementation Rules

1. Pass IDs and timestamps into workflows, not large payload objects:
   `channel_id`, `user_id`, `message_ts`, `thread_ts`, `reaction`, `event_id`.
2. Use `event_id` as an idempotency key when side effects matter.
3. Add the smallest required scopes to `manifest.ts`.
4. Add narrow filters for `message_posted`; avoid `all_resources: true` unless
   the behavior and cost are intended.
5. Prevent self-trigger loops with filters such as `NOT {{data.user_id}} == ...`
   or by checking bot/user IDs in the function.
6. After scope changes, expect reinstall/reauthorization.

## Event Trigger Skeleton

```ts
import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import ExampleWorkflow from "../workflows/example_workflow.ts";

const EventTrigger: Trigger<typeof ExampleWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "Reaction workflow",
  workflow: `#/workflows/${ExampleWorkflow.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.ReactionAdded,
    channel_ids: ["C123ABC456"],
    filter: {
      version: 1,
      root: { statement: "{{data.reaction}} == eyes" },
    },
  },
  inputs: {
    channel_id: {
      value: TriggerContextData.Event.ReactionAdded.channel_id,
    },
  },
};

export default EventTrigger;
```
