# Native Functions, Connectors, And External Auth Reference

Use this reference when choosing between Slack native functions, connector
functions, custom functions, and external OAuth/API code.

## Official Sources

- Creating functions: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-functions/
- Slack functions catalog: https://docs.slack.dev/tools/deno-slack-sdk/reference/slack-functions/
- Creating Slack functions: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-slack-functions/
- Connector functions catalog: https://docs.slack.dev/tools/deno-slack-sdk/reference/connector-functions/
- Creating connector functions: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-connector-functions/
- Creating custom functions: https://docs.slack.dev/tools/deno-slack-sdk/guides/creating-custom-functions/
- External authentication: https://docs.slack.dev/tools/deno-slack-sdk/guides/integrating-with-services-requiring-external-authentication/
- Security best practices: https://docs.slack.dev/tools/deno-slack-sdk/guides/following-security-best-practices/
- Environment variables: https://docs.slack.dev/tools/deno-slack-sdk/guides/using-environment-variables/

## Decision Table

| Type | Use when | Implementation | Avoid when |
|---|---|---|---|
| Slack native function | Slack provides the operation directly | `Schema.slack.functions.*` in `workflow.addStep` | Custom business logic or unsupported Slack operation is required |
| Connector function | External SaaS operation is in Slack connector catalog | Add official connector step to workflow | Operation needs custom pagination, complex search, private API, or unsupported service |
| Custom function | Logic is repo-specific or Slack/connector functions cannot express it | `DefineFunction` + `SlackFunction` | Native/connector covers the task cleanly |
| Custom function + external auth | Repo must call external OAuth API directly | `DefineOAuth2Provider`, `Schema.slack.types.oauth2`, `client.apps.auth.external.get` | Connector covers the service/operation |

## Native Slack Function Examples

| Category | Examples | Use |
|---|---|---|
| Messages | `send_message`, `send_dm`, `send_ephemeral_message`, `reply_in_thread` | Notifications and Slack responses |
| Forms | `open_form` | Static input collection |
| Channels | `create_channel`, `archive_channel`, `invite_user_to_channel`, `update_channel_topic` | Channel operations |
| Usergroups | `create_usergroup`, `add_user_to_usergroup`, `remove_user_from_usergroup` | Usergroup management |
| Canvas | `canvas_create`, `canvas_copy`, `canvas_update_content`, `channel_canvas_create`, `share_canvas` | Canvas operations, when available |
| Utility | `add_bookmark`, `add_pin`, `delay` | Workflow utility steps |

## Connector Service Categories

| Service group | Representative operations |
|---|---|
| Google Workspace | Sheets row add/select/update/delete, Calendar events, Gmail send, Meet start |
| Microsoft | Excel row operations, OneDrive file copy/create, Outlook email/calendar, Teams meetings |
| Git/issues | GitHub/GitLab/Jira/Linear issue creation and updates |
| CRM/support/ITSM | Salesforce records/flows, Zendesk tickets, ServiceNow incidents |
| Incident/ops | PagerDuty incidents/status/escalation, FireHydrant, Rootly, LaunchDarkly, Snyk |
| Project/task | Asana, ClickUp, Monday, Basecamp, Workast, Wrike tasks/projects |
| Docs/files/knowledge | Notion pages, Dropbox, Box, Guru, Miro, Smartsheet |
| HR/contracts/signature | Greenhouse, Lever, Deel, DocuSign, Adobe Sign, Dropbox Sign |
| Messaging/marketing/forms | Twilio/RingCentral/Dialpad SMS, Mailchimp, SurveyMonkey, Typeform, Zoom |

Also read the repo-local `slack-connector-functions` skill for external SaaS
work. It has the dedicated connector adoption checklist and catalog summary.

## External Auth Checklist

Use custom external auth only after connector rejection.

1. Define an OAuth2 provider with `DefineOAuth2Provider`.
2. Add the provider to `externalAuthProviders` in `manifest.ts`.
3. Configure the external provider redirect URL:
   `https://oauth2.slack.com/external/auth/callback`.
4. Register secrets after deploy with Slack CLI external-auth commands.
5. Add `Schema.slack.types.oauth2` input to the custom function.
6. Retrieve tokens with `client.apps.auth.external.get`.
7. Choose credential source deliberately: `END_USER` or `DEVELOPER`.
8. Add required `outgoingDomains`.
9. Never log tokens, secrets, PII, or customer data.
10. Add a confirmation step for destructive, production, hiring, contract,
    money, or customer-record operations.

## Trigger Pairing

| Trigger | Good pairing |
|---|---|
| Link | User confirmation, `OpenForm`, connector auth, END_USER external auth |
| Scheduled | Reports, periodic syncs, deadline checks, scheduled notifications |
| Event | Slack event automation, reactions, app mentions, joins/leaves |
| Webhook | External system starts Slack workflow with flat payload |
