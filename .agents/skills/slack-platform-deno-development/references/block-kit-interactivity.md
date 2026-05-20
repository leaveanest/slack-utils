# Block Kit And Interactivity Reference

Use this reference when building Slack messages, forms, modals, interactive
buttons, selects, slash-command-like entry points, or view handlers.

## Official Sources

- Block Kit reference: https://docs.slack.dev/reference/block-kit/
- Blocks: https://docs.slack.dev/reference/block-kit/blocks/
- Block elements: https://docs.slack.dev/reference/block-kit/block-elements/
- Surfaces: https://docs.slack.dev/surfaces/
- Modals: https://docs.slack.dev/surfaces/modals/
- App Home: https://docs.slack.dev/surfaces/app-home/
- Adding interactivity:
  https://docs.slack.dev/tools/deno-slack-sdk/guides/adding-interactivity/
- Creating a form:
  https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-a-form/
- Creating an interactive modal:
  https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-an-interactive-modal/
- `views.open`: https://docs.slack.dev/reference/methods/views.open/
- `views.update`: https://docs.slack.dev/reference/methods/views.update/
- `chat.postMessage`: https://docs.slack.dev/reference/methods/chat.postMessage/

## Choose The UI Primitive

| Need                          | Use                                                                           | Why                                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Static workflow form          | `Schema.slack.functions.OpenForm`                                             | Fastest way to collect inputs and pass them to later workflow steps                                |
| Dynamic form or multi-step UI | Block Kit modal with `views.open/update/push` and Deno interactivity handlers | Supports validation, state, loading screens, conditional updates                                   |
| Simple message action         | Block Kit message with buttons/selects                                        | Good for review/approve/ack flows                                                                  |
| Long-lived home screen        | Usually do not use for this repo's Deno SDK workflow app                      | Official docs have stated App Home is unavailable for Deno Slack SDK apps; verify before designing |

## Block Surface Matrix

| Block       | Message   | Modal     | App Home  | Notes                                        |
| ----------- | --------- | --------- | --------- | -------------------------------------------- |
| `section`   | yes       | yes       | yes       | Text, fields, accessory; common workhorse    |
| `context`   | yes       | yes       | yes       | Up to 10 text/image elements                 |
| `divider`   | yes       | yes       | yes       | Visual separator                             |
| `actions`   | yes       | yes       | yes       | Up to 25 interactive elements                |
| `input`     | no        | yes       | yes       | Form input block; not for messages           |
| `header`    | yes       | yes       | yes       | Plain text heading                           |
| `image`     | yes       | yes       | yes       | Requires alt text                            |
| `rich_text` | yes       | yes       | yes       | Often appears from Slack-generated rich text |
| `video`     | yes       | yes       | yes       | Requires appropriate link/embed permissions  |
| `file`      | read-only | read-only | read-only | Do not construct directly                    |

Slack limits messages to 50 blocks and modals/Home to 100 blocks. Verify exact
limits before shipping complex views.

## Common Elements

| Element                                                                                           | Blocks                        | Notes                                                                 |
| ------------------------------------------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------- |
| `button`                                                                                          | `section`, `actions`          | `url` buttons still produce interaction payloads                      |
| `static_select` / `external_select` / `users_select` / `conversations_select` / `channels_select` | `section`, `actions`, `input` | Static options are limited; external selects need suggestion handlers |
| `multi_*_select`                                                                                  | `section`, `actions`, `input` | Multiple selection variants                                           |
| `overflow`                                                                                        | `section`, `actions`          | Compact secondary actions                                             |
| `datepicker` / `timepicker`                                                                       | `section`, `actions`, `input` | Date/time values are strings                                          |
| `checkboxes` / `radio_buttons`                                                                    | `section`, `actions`, `input` | Option count limits apply                                             |
| `plain_text_input`                                                                                | `input`                       | Modal/Home only; use for free text                                    |
| `workflow_button`                                                                                 | `section`, `actions`          | Verify support and fit against link triggers before using             |

## Modal Checklist

1. Add `Schema.slack.types.interactivity` to workflow/function inputs.
2. Use `inputs.interactivity.interactivity_pointer` from link-trigger flows, or
   `body.interactivity.interactivity_pointer` from interaction payloads.
3. Open a modal immediately; if data loading is slow, open a loading modal and
   then call `views.update`.
4. Set stable `callback_id`, `block_id`, and `action_id` constants.
5. Keep `private_metadata` under limits and do not store secrets in it.
6. Use `notify_on_close: true` only when close handling is required.
7. Validate submissions with Zod and return field errors keyed by `block_id`.
8. Use `hash` with `views.update` to avoid race-condition overwrites.
9. Preserve identical `block_id` and `action_id` when you want Slack to retain
   user-entered modal values across updates.
10. For `completed: false` functions, explicitly complete success/error or
    document why completion is delegated.

## Message Rules

- Include top-level `text` even when using `blocks`; Slack recommends it for
  notifications and screen readers.
- Treat `text` as user-facing and i18n-controlled.
- Use `chat.update` or an equivalent state change after interactive actions to
  prevent double execution.
- Keep block builders pure: `buildXxxBlocks()` or `buildXxxView()` should be
  separately testable.
- Do not put `input` blocks in messages.

## Repo Pattern

For new interactive work, prefer:

- `functions/<feature>/blocks.ts` for pure Block Kit builders when the payload
  is non-trivial.
- `functions/<feature>/mod.ts` for the function definition and handler.
- Constants for `callback_id`, `block_id`, and `action_id`.
- i18n keys for all visible copy, fallback text, and validation messages.
- Tests for block/view builders and submission parsing.
