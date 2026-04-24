# Connector Adoption Checklist

Use this checklist before choosing a Slack connector function over a custom
function with external API calls.

## Fit

- The user request is part of a Slack Deno SDK workflow.
- The target service appears in Slack's official connector catalog.
- The requested operation is a close match to a listed connector function.
- The connector's inputs can be supplied by workflow inputs or previous steps.
- The connector's outputs are sufficient for the next workflow step or final
  response.

## Authentication and Ownership

- The user wants to avoid implementing OAuth, token refresh, secret storage, or
  an external API client.
- The team accepts Slack connector account setup as the authentication path.
- The implementation does not require storing external service credentials in
  `.env`.
- The owner of the connected account and its permissions are clear.

## Safety

- The action's side effects are understood.
- Destructive, financial, hiring, contractual, production, or customer-data
  changes have a confirmation or approval step.
- Failure handling is defined, including what message or fallback path users
  see.
- Audit expectations are clear enough for the workflow's risk level.

## Constraints

- The workflow is not intended for Slack Connect external users.
- Workspace admin approval requirements are understood.
- Rate limits, connector-specific restrictions, and required external-service
  permissions have been checked in the official docs.
- The connector is available in the user's Slack plan and workspace context.

## Decision

Prefer a connector when the fit is high and authentication should be handled by
Slack Platform setup.

Prefer a Slack function when the action is Slack-native.

Prefer a custom function when the connector catalog does not cover the
operation, the flow needs complex API orchestration, or this app must own
external auth and API behavior.
