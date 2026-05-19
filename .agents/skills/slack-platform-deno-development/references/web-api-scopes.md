# Web API, Scopes, And Errors Reference

Use this reference when calling Slack Web API methods through the Deno Slack SDK
`client`, choosing scopes, handling pagination/rate limits, or debugging API
errors.

## Official Sources

- Calling Slack API methods:
  https://docs.slack.dev/tools/deno-slack-sdk/guides/calling-slack-api-methods/
- Web API methods: https://docs.slack.dev/reference/methods/
- Pagination: https://docs.slack.dev/apis/web-api/pagination/
- Rate limits: https://docs.slack.dev/apis/web-api/rate-limits/
- Tokens: https://docs.slack.dev/authentication/tokens/
- `chat.postMessage`: https://docs.slack.dev/reference/methods/chat.postMessage/
- `conversations.info`:
  https://docs.slack.dev/reference/methods/conversations.info/
- `conversations.history`:
  https://docs.slack.dev/reference/methods/conversations.history/
- File upload migration: https://docs.slack.dev/reference/methods/files.upload

## Calling Pattern

Use either typed-style namespaces or `apiCall`:

```ts
const response = await client.chat.postMessage({
  channel,
  text,
});

const raw = await client.apiCall("chat.postMessage", {
  channel,
  text,
});
```

Always check `ok` and required fields before reading response data.

## Common Methods

| Method                     | Scopes                                                                                                                                      | Use                                | Pitfalls                                                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chat.postMessage`         | `chat:write`; maybe `chat:write.public`, `chat:write.customize`                                                                             | Post messages, DMs, thread replies | Roughly 1 message/sec/channel; include fallback `text`; channel visibility matters                                                                         |
| `chat.update`              | `chat:write`                                                                                                                                | Update own messages                | Use channel ID, not user ID for DMs; handle interactive message races with app-side state/idempotency. `hash` applies to `views.update`, not `chat.update` |
| `chat.delete`              | `chat:write`                                                                                                                                | Delete own messages                | Bot tokens generally delete bot-authored messages only                                                                                                     |
| `conversations.info`       | `channels:read`, `groups:read`, `im:read`, `mpim:read`                                                                                      | Channel/DM metadata                | Add `include_num_members: true` when `num_members` is needed                                                                                               |
| `conversations.history`    | `channels:history`, `groups:history`, `im:history`, `mpim:history`                                                                          | Message history                    | Cursor pagination; strict newer limits for some non-Marketplace apps                                                                                       |
| `conversations.replies`    | history scopes                                                                                                                              | Thread replies                     | Same rate-limit class; `reply_users` can include bot IDs                                                                                                   |
| `conversations.list`       | read scopes by conversation type                                                                                                            | Conversation discovery             | Filter happens after virtual page; keep following `next_cursor`                                                                                            |
| `conversations.members`    | read scopes by conversation type                                                                                                            | Member IDs                         | Cursor pagination required for large channels                                                                                                              |
| `conversations.join`       | `channels:join` for bot; `channels:write` for user                                                                                          | Join public channels               | Private/archived channels fail; warnings may still accompany success                                                                                       |
| `conversations.open`       | `im:write`, `mpim:write`                                                                                                                    | Open DM/MPIM                       | `users` is 1-8 IDs; do not include self                                                                                                                    |
| `users.info`, `users.list` | `users:read`; maybe `users:read.email`                                                                                                      | User lookup/directory              | Pagination; deleted/deactivated users can appear                                                                                                           |
| `usergroups.*`             | `usergroups:read`, `usergroups:write`                                                                                                       | Usergroup management               | Paid-plan/team constraints                                                                                                                                 |
| `reactions.*`              | `reactions:read`, `reactions:write`                                                                                                         | Add/get/list/remove reactions      | `already_reacted` can be business-success                                                                                                                  |
| `files.*`                  | `files:read`, `files:write`; remote file methods use `remote_files:read`, `remote_files:share`, or `remote_files:write` depending on method | File operations                    | `files.upload` is deprecated; use external upload flow                                                                                                     |
| `views.*`                  | Often no OAuth scopes in method docs                                                                                                        | Modals/App Home views              | `trigger_id` is short-lived; use `hash` for update races; verify App Home support                                                                          |
| `pins.*`                   | `pins:read`, `pins:write`                                                                                                                   | Pin management                     | Message needs channel + timestamp                                                                                                                          |
| `bookmarks.*`              | `bookmarks:read`, `bookmarks:write`                                                                                                         | Channel bookmarks                  | Workflow featured operations can share scopes                                                                                                              |
| `canvases.*`               | `canvases:read`, `canvases:write`                                                                                                           | Canvas operations                  | Paid-plan/support constraints; Canvas markdown is not Block Kit                                                                                            |
| Trigger APIs               | `triggers:write`                                                                                                                            | Runtime trigger management         | Static CLI triggers usually do not need app runtime trigger writes                                                                                         |

## Pagination

- Use `limit` and `cursor`.
- Continue until `response_metadata.next_cursor` is empty/missing.
- Do not treat a short or empty page as complete if `next_cursor` exists.
- Keep cursors short-lived; handle `invalid_cursor` by restarting discovery.

## Rate Limits

- Slack rate limits are generally per API method per workspace per app.
- On HTTP 429, respect `Retry-After` for that method/workspace pair.
- Other methods and other workspaces are separate buckets.
- Design around about 1 request/sec/method unless method docs allow more.
- Write retries need idempotency, especially message posting or datastore
  updates.

## Token And Visibility Notes

| Token                    | Meaning                                                                |
| ------------------------ | ---------------------------------------------------------------------- |
| Bot token (`xoxb-`)      | App/bot-scoped token; visibility depends on scopes and membership      |
| User token (`xoxp-`)     | Acts within user's visible/allowed scope                               |
| Workflow token (`xwfp-`) | Short-lived workflow token; may borrow visibility in workflow contexts |

Private channels, DMs, MPIMs, Slack Connect, and Enterprise Grid can all change
what a token can see or mutate.

## Error Handling Standard

1. Check `response.ok` before reading data.
2. Capture `error`, `needed`, `provided`, and `response_metadata.messages` for
   logs/diagnostics.
3. Map user-facing errors to i18n keys.
4. Do not retry configuration errors such as `missing_scope`,
   `not_allowed_token_type`, or `team_access_not_granted`.
5. Retry transient errors such as `internal_error`, `fatal_error`,
   `service_unavailable`, and `request_timeout` only a small number of times
   with backoff and jitter.
6. Treat `channel_not_found`, `not_in_channel`, `no_permission`, `is_archived`,
   `message_not_found`, and `user_not_found` as business errors.
7. Log warnings from `response_metadata.warnings`.

## Optional Response Fields

Some Web API methods omit expensive or optional fields unless explicitly
requested. For example, `conversations.info` requires an explicit option when a
function needs member counts. Check the method reference before assuming a field
is present.
