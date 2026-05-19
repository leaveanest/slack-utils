---
name: "slack-utils-setup"
description: "Use when setting up or troubleshooting a local development environment for this slack-utils repository on macOS or Windows, including installing Deno, Git, Slack CLI, PowerShell, Node.js, VS Code, Git hooks, Slack login, and validating the repo setup. Use especially when the user asks for setup commands, package manager choices, onboarding, or OS-specific install order."
---

# Slack Utils Setup

Guide local development environment setup for this Slack Deno SDK repository.
Prefer package managers for repeatable installs, but use Slack's official
installer for Slack CLI on Windows.

## Scope

Use this skill for:

- New machine setup for this repository.
- macOS setup with Homebrew.
- Windows setup with winget for dependencies and Slack's official installer for
  Slack CLI.
- Setup verification, `slack login`, `.env`, Git hooks, and repo health checks.

Do not use this skill for:

- Implementing Slack functions, workflows, triggers, or connector steps.
- Publishing releases unless the user is specifically setting up release tooling.
- Creating package-manager manifests such as `package.json`; this is a Deno
  repository.

## Required Tools

Install these for normal development:

- Deno runtime.
- Git, including Git Bash on Windows.
- Slack CLI.

Install these when useful:

- PowerShell 7 on Windows before running the Slack CLI installer.
- Node.js LTS when working on semantic-release scripts or release dry runs.
- GitHub CLI for GitHub PR and issue workflows.
- VS Code or Cursor with the Deno extension for editor support.

## macOS Workflow

1. Check for Homebrew:

   ```bash
   brew --version
   ```

2. Install required packages:

   ```bash
   brew install git deno
   brew install --cask slack-cli
   ```

3. Install optional tools only when needed:

   ```bash
   brew install node gh
   brew install --cask visual-studio-code
   ```

4. Verify commands:

   ```bash
   git --version
   deno --version
   slack version
   ```

5. Authenticate Slack:

   ```bash
   slack login
   ```

6. Set up the repository:

   ```bash
   cp .env.example .env
   slack env add local
   bash scripts/setup-git-hooks.sh
   deno task cursor-ci
   ```

## Windows Workflow

Use winget for the dependency tools, then use Slack's official PowerShell
installer for Slack CLI. Do not install `SlackTechnologies.Slack` as a substitute
for Slack CLI; that package is the Slack desktop app.

1. Check that winget is available:

   ```powershell
   winget --version
   ```

   If winget is missing, update App Installer from Microsoft Store or follow
   Microsoft's Windows Package Manager installation guidance before continuing.

2. Install required dependency tools with winget:

   ```powershell
   winget install --id Git.Git --exact
   winget install --id Microsoft.PowerShell --exact
   winget install --id DenoLand.Deno --exact
   ```

3. Open a new PowerShell 7 terminal so PATH changes are loaded before running
   Slack's installer.

4. Install Slack CLI with Slack's official Windows installer:

   ```powershell
   irm https://downloads.slack-edge.com/slack-cli/install-windows.ps1 -outfile install-windows.ps1
   .\install-windows.ps1 -SkipGit $true
   ```

   Use `-SkipGit $true` because Git was installed explicitly with winget in the
   previous step. If the user needs an alias because another `slack` command is
   already on PATH, download the installer first and pass `-Alias <name>`.

5. Install optional tools only when needed:

   ```powershell
   winget install --id OpenJS.NodeJS.LTS --exact
   winget install --id GitHub.cli --exact
   winget install --id Microsoft.VisualStudioCode --exact
   ```

6. Verify commands:

   ```powershell
   git --version
   deno --version
   slack version
   ```

7. Authenticate Slack:

   ```powershell
   slack login
   ```

8. Set up the repository:

   ```powershell
   Copy-Item .env.example .env
   slack env add local
   bash scripts/setup-git-hooks.sh
   deno task cursor-ci
   ```

## Slack CLI Notes

- On macOS, prefer `brew install --cask slack-cli` when Homebrew is available.
- On Windows, prefer Slack's official PowerShell installer. Slack CLI requires
  PowerShell for installation on Windows.
- The Slack CLI installer configures the `slack` command, but runtime tools such
  as Deno must be installed separately for Deno Slack SDK projects.
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

- If `slack` is not found after installation, open a new terminal and verify PATH.
- On Windows, run the Slack CLI installer from PowerShell, not Git Bash.
- On Windows, if the installer reports a restricted language mode, check
  `$ExecutionContext.SessionState.LanguageMode` and follow Slack's guidance for
  `FullLanguage`.
- If Git hooks fail on Windows, ensure Git for Windows is installed and `bash`
  is available on PATH.
- If Deno imports fail, run `deno cache manifest.ts workflows/example_workflow.ts`
  or rerun the repo checks to refresh dependencies.

## Output Expectations

When using this skill, respond with:

- The detected or assumed OS.
- The install order and commands for that OS.
- Which tools are required versus optional.
- Slack CLI handling, especially the official Windows installer choice.
- Verification commands and any setup commands already run.
- Any blockers, such as missing winget, missing Homebrew, PATH issues, or Slack
  authentication requiring user interaction.
