# Windows Setup

Use winget for dependency tools, then use Slack's official PowerShell installer
for Slack CLI. Do not install `SlackTechnologies.Slack` as a substitute for
Slack CLI; that package is the Slack desktop app.

## Install Order

1. Confirm winget is available.
2. Install Git for Windows so Git Bash is available for repo hooks.
3. Install PowerShell 7 for Slack's Windows installer.
4. Install Deno.
5. Open a new PowerShell 7 terminal.
6. Install Slack CLI with Slack's official Windows installer.
7. Install optional tools if needed.
8. Authenticate Slack.
9. Set up and validate the repository.

## Commands

Check that winget is available:

```powershell
winget --version
```

If winget is missing, update App Installer from Microsoft Store or follow
Microsoft's Windows Package Manager installation guidance before continuing.

Install required dependency tools with winget:

```powershell
winget install --id Git.Git --exact
winget install --id Microsoft.PowerShell --exact
winget install --id DenoLand.Deno --exact
```

Open a new PowerShell 7 terminal so PATH changes are loaded before running
Slack's installer.

Install Slack CLI with Slack's official Windows installer:

```powershell
irm https://downloads.slack-edge.com/slack-cli/install-windows.ps1 -outfile install-windows.ps1
.\install-windows.ps1 -SkipGit $true
```

Use `-SkipGit $true` because Git was installed explicitly with winget. If the
user needs an alias because another `slack` command is already on PATH, download
the installer first and pass `-Alias <name>`.

Install optional tools only when needed:

```powershell
winget install --id OpenJS.NodeJS.LTS --exact
winget install --id GitHub.cli --exact
winget install --id Microsoft.VisualStudioCode --exact
```

Verify commands:

```powershell
git --version
deno --version
slack version
```

Authenticate Slack:

```powershell
slack login
```

Set up the repository:

```powershell
Copy-Item .env.example .env
slack env add local
bash scripts/setup-git-hooks.sh
deno task cursor-ci
```

## Troubleshooting

- If `slack` is not found after installation, open a new PowerShell 7 terminal
  and verify PATH.
- Run the Slack CLI installer from PowerShell, not Git Bash.
- If the installer reports a restricted language mode, check
  `$ExecutionContext.SessionState.LanguageMode` and follow Slack's guidance for
  `FullLanguage`.
- If Git hooks fail, ensure Git for Windows is installed and `bash` is available
  on PATH.
