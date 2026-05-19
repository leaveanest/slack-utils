# Windows Setup

Use winget for dependency tools, mise for Deno version management, then use
Slack's official PowerShell installer for Slack CLI. Do not install
`SlackTechnologies.Slack` as a substitute for Slack CLI; that package is the
Slack desktop app.

## Install Order

1. Confirm winget is available.
2. Install Git for Windows so Git Bash is available for repo hooks.
3. Install PowerShell 7 for Slack's Windows installer.
4. Install mise.
5. Configure mise activation or shims for PowerShell.
6. Install Deno 2.x through the repository `.mise.toml`.
7. Open a new PowerShell 7 terminal.
8. Install Slack CLI with Slack's official Windows installer.
9. Install optional tools if needed.
10. Authenticate Slack.
11. Set up and validate the repository.

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
winget install --id jdx.mise --exact
```

Configure mise for PowerShell. Prefer activation for interactive shells:

```powershell
if (!(Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }
Add-Content $PROFILE 'mise activate pwsh | Out-String | Invoke-Expression'
```

If profile changes are not allowed, add mise shims to the user PATH instead:

```powershell
[Environment]::SetEnvironmentVariable(
  "Path",
  [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:LOCALAPPDATA\mise\shims",
  "User"
)
```

Open a new PowerShell 7 terminal so PATH and mise activation changes are loaded.

Install Deno with mise:

```powershell
mise trust
mise install
```

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
mise --version
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
bash scripts/setup-git-hooks.sh
deno task cursor-ci
```

Edit `.env` after copying it. `slack.json` is already configured to load `.env`
for the local environment when Slack CLI runs the app.

## Troubleshooting

- If `slack` is not found after installation, open a new PowerShell 7 terminal
  and verify PATH.
- If `deno` is not found after `mise install`, verify mise activation or shims
  in the current shell.
- `mise trust` is expected on first checkout because mise asks users to trust
  project config files before applying them.
- Run `mise use deno@2` only when intentionally changing or initializing the
  repository Deno pin.
- Run the Slack CLI installer from PowerShell, not Git Bash.
- If the installer reports a restricted language mode, check
  `$ExecutionContext.SessionState.LanguageMode` and follow Slack's guidance for
  `FullLanguage`.
- If Git hooks fail, ensure Git for Windows is installed and `bash` is available
  on PATH.
