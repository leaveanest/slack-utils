---
name: "slack-utils-setup"
description: "Use when setting up or troubleshooting a local development environment for this slack-utils repository on macOS or Windows, including installing Deno, Git, Slack CLI, PowerShell, Node.js, VS Code, Git hooks, Slack login, and validating the repo setup. Use especially when the user asks for setup commands, package manager choices, onboarding, or OS-specific install order."
---

# Slack Utils Setup

Guide local development environment setup for this Slack Deno SDK repository.
Use package managers for system tools, use mise for Deno version management, and
use Slack's official installer for Slack CLI on Windows.

## Scope

Use this skill for:

- New machine setup for this repository.
- macOS setup with Homebrew and mise-managed Deno.
- Windows setup with winget for dependency tools, mise-managed Deno, and Slack's
  official installer for Slack CLI.
- Setup verification, `slack login`, `.env`, Git hooks, and repo health checks.

Do not use this skill for:

- Implementing Slack functions, workflows, triggers, or connector steps.
- Publishing releases unless the user is specifically setting up release
  tooling.
- Creating package-manager manifests such as `package.json`; this is a Deno
  repository.

## Required Tools

Install these for normal development:

- Git, including Git Bash on Windows.
- mise for Deno runtime management.
- Deno 2.x runtime through the repository `.mise.toml`.
- Slack CLI.

Install these when useful:

- PowerShell 7 on Windows before running the Slack CLI installer.
- Node.js LTS when working on semantic-release scripts or release dry runs.
- GitHub CLI for GitHub PR and issue workflows.
- VS Code or Cursor with the Deno extension for editor support.

## Workflow

1. Detect or ask for the target OS.
2. Load only the matching setup reference:
   - macOS: `references/macos.md`
   - Windows: `references/windows.md`
3. Present the install order before commands when the user is preparing a new
   machine.
4. Keep required tools separate from optional tools.
5. Verify `git`, `mise`, `deno`, and `slack` after installation.
6. Run Slack authentication and repository setup only after the tools are
   installed.

## OS References

- Use `references/macos.md` for Homebrew + mise setup.
- Use `references/windows.md` for winget dependency setup, mise-managed Deno,
  and Slack's official Windows installer.

## Slack CLI Notes

- On macOS, prefer `brew install --cask slack-cli` when Homebrew is available.
- On Windows, prefer Slack's official PowerShell installer. Slack CLI requires
  PowerShell for installation on Windows.
- Do not install `SlackTechnologies.Slack` as a substitute for Slack CLI on
  Windows; that package is the Slack desktop app.
- The Slack CLI installer configures the `slack` command, but Deno must be
  installed separately. Prefer `mise install` from the repository root so mise
  reads `.mise.toml` and installs the repository's Deno 2.x toolchain.
- Verify installation with `slack version` before running `slack login`.
- Re-check Slack's official install docs before changing install commands,
  because Slack CLI releases and installer behavior can change.

## Repository Checks

After installation, run:

```bash
deno task fmt
deno task lint
deno task check
deno task test
deno task i18n:check
```

For a full CI-like check, run:

```bash
deno task cursor-ci
```

## Troubleshooting

- If `slack` is not found after installation, open a new terminal and verify
  PATH.
- On Windows, run the Slack CLI installer from PowerShell, not Git Bash.
- On Windows, if the installer reports a restricted language mode, check
  `$ExecutionContext.SessionState.LanguageMode` and follow Slack's guidance for
  `FullLanguage`.
- If Git hooks fail on Windows, ensure Git for Windows is installed and `bash`
  is available on PATH.
- If Deno imports fail, run
  `deno cache manifest.ts workflows/example_workflow.ts` or rerun the repo
  checks to refresh dependencies.

## Output Expectations

When using this skill, respond with:

- The detected or assumed OS.
- The install order and commands for that OS.
- Which tools are required versus optional.
- Slack CLI handling, especially the official Windows installer choice.
- Verification commands and any setup commands already run.
- Any blockers, such as missing winget, missing Homebrew, PATH issues, or Slack
  authentication requiring user interaction.
