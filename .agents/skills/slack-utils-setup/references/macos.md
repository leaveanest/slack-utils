# macOS Setup

Use Homebrew for system tools and mise for Deno version management.

## Install Order

1. Homebrew.
2. Required system tools: Git, mise, Slack CLI.
3. Deno 2.x through the repository `.mise.toml`.
4. Optional tools: Node.js, GitHub CLI, VS Code.
5. Slack authentication.
6. Repository setup and validation.

## Commands

Check for Homebrew:

```bash
brew --version
```

Install required system packages:

```bash
brew install git mise
brew install --cask slack-cli
```

Install Deno with mise:

```bash
mise trust
mise install
```

Install optional tools only when needed:

```bash
brew install node gh
brew install --cask visual-studio-code
```

Verify commands:

```bash
git --version
mise --version
deno --version
slack version
```

Authenticate Slack:

```bash
slack login
```

Set up the repository:

```bash
[ -f .env ] || cp .env.example .env
bash scripts/setup-git-hooks.sh
deno task cursor-ci
```

Edit `.env` after copying it. `slack.json` is already configured to load `.env`
for the local environment when Slack CLI runs the app.

## Notes

- Prefer `brew install --cask slack-cli` when Homebrew is available.
- If Homebrew is not available, use Slack's official Mac/Linux installer for
  Slack CLI and install mise separately.
- Prefer mise over `brew install deno` so the project can align on Deno 2.x
  consistently across macOS and Windows.
- `mise trust` is expected on first checkout because mise asks users to trust
  project config files before applying them.
- Run `mise use deno@2` only when intentionally changing or initializing the
  repository Deno pin.
- Open a new terminal if newly installed commands are not found.
