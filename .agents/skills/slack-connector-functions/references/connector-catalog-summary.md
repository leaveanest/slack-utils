# Slack Connector Catalog Summary

Source: https://docs.slack.dev/tools/deno-slack-sdk/reference/connector-functions/

Checked: 2026-04-24

Slack connector functions are workflow steps for external services. The catalog is broad and changes over time, so treat this file as an orientation aid, not a complete authority. Always verify the selected connector in the official docs before implementation.

## Common Categories

- Task, project, and issue tracking: Asana, Jira Cloud, Linear, GitHub, GitHub Enterprise Server, GitLab, ClickUp, Monday, Workast, Wrike.
- Calendar, meeting, email, and messaging: Google Calendar, Google Mail, Google Meet, Microsoft Outlook Calendar, Microsoft Outlook Email, Microsoft Teams, Zoom, Webex, Twilio, Dialpad, RingCentral.
- Files, documents, spreadsheets, and knowledge: Google Sheets, Microsoft Excel, Microsoft OneDrive, Microsoft OneNote, Box, Dropbox, Notion, Guru, Lucid, Miro, Smartsheet.
- CRM, support, and ITSM: Salesforce, Zendesk, Intercom, ServiceNow.
- Incidents and operations: PagerDuty, FireHydrant, Rootly, LaunchDarkly, Travis CI, Snyk.
- HR, recruiting, onboarding, contracts, and signatures: Greenhouse, Lever, SmartRecruiters, Deel, DocuSign, Adobe Sign, Dropbox Sign.
- Marketing, forms, surveys, and content: Mailchimp, SurveyMonkey, Typeform, Loopio, Giphy.
- Finance and business operations: Ramp.

## Representative Operations

- Create: issues, tasks, projects, events, records, folders, tickets, incidents, campaigns, pages, meetings.
- Update: issues, tasks, spreadsheet rows, worksheet rows, feature flags, incidents, tickets, records.
- Select/read: spreadsheet rows, worksheet rows, records, incidents, spend requests, campaign reports.
- Send: email, SMS, signature requests, status updates, campaigns.
- Copy/move/delete/archive: files, documents, folders, pages, spreadsheet rows, boards.

## Useful Examples

- Google Sheets: `add_spreadsheet_row`, `select_spreadsheet_row`, `update_spreadsheet_row`, `delete_spreadsheet_row`.
- Microsoft Excel: `add_worksheet_row`, `select_worksheet_row`, `update_worksheet_row`, `delete_worksheet_row`.
- GitHub: `create_issue`, `update_issue`.
- Jira Cloud: `create_issue`, `edit_issue`.
- Linear: `create_issue`, `update_issue`, `add_comment`, `create_project`.
- Salesforce: `create_record`, `read_record`, `update_record`, `delete_record`, `run_flow`.
- Zendesk: `create_ticket`, `update_ticket`, `add_tags`.
- PagerDuty: `create_incident`, `resolve_incident`, `escalate_incident`, `send_status_update`, `update_incident`.
- Google Calendar: `create_event`, `update_event`, `add_to_event`.
- Outlook Calendar: `create_event`.
- Zoom: `create_meeting`.

## Keep Current

Before implementation, open the target connector page and confirm:

- Service namespace and function name.
- Input parameter names, required fields, and accepted Slack data types.
- Output fields needed by later workflow steps.
- Authentication and account connection requirements.
- Usage notes, limitations, or workspace/admin approval requirements.
