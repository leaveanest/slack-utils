# macOS Setup

Use Homebrew for repeatable macOS setup.

## Install Order

1. Homebrew.
2. Required development tools: Git, Deno, Slack CLI.
3. Optional tools: Node.js, GitHub CLI, VS Code.
4. Slack authentication.
5. Repository setup and validation.

## Commands

Check for Homebrew:

```bash
brew --version
```

Install required packages:

```bash
brew install git deno
brew install --cask slack-cli
```

Install optional tools only when needed:

```bash
brew install node gh
brew install --cask visual-studio-code
```

Verify commands:

```bash
git --version
deno --version
slack version
```

Authenticate Slack:

```bash
slack login
```

Set up the repository:

```bash
cp .env.example .env
slack env add local
bash scripts/setup-git-hooks.sh
deno task cursor-ci
```

## Notes

- Prefer `brew install --cask slack-cli` when Homebrew is available.
- If Homebrew is not available, use Slack's official Mac/Linux installer for
  Slack CLI and install Deno separately.
- Open a new terminal if newly installed commands are not found.
