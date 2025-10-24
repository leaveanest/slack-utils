# Contributing to slack-utils-template

## 開発フロー

1. Issue を作成またはアサインされていることを確認します。
2. 作業用ブランチを切り、ローカルで開発します。
3. 作業中は小まめにテストや静的解析を実行します。
4. Pull Request を作成し、レビュアーへ共有します。

## コーディング規約

- Deno 標準スタイルガイドに従います。
- TypeScript は常に `strict` モードを前提とし、暗黙的な `any` を避けます。
- import は `import_map.json` を利用し、相対パスの氾濫を避けます。

### 重要なガイドライン

新しい機能を開発する際は、以下のガイドラインに従ってください：

- **テスト**: [`docs/testing-guide.md`](docs/testing-guide.md) -
  JSDocコメント必須、正常系・異常系テスト
- **多言語化**: [`docs/i18n-guide.md`](docs/i18n-guide.md) -
  エラーメッセージの`t()`関数化
- **例外処理**:
  [`docs/exception-handling-guide.md`](docs/exception-handling-guide.md)
  - API通信時の`response.ok`チェック
  - バリデーション必須
  - 型安全なエラーハンドリング

## Issue の書き方

- テンプレートに従い、背景・目的・受け入れ条件を明文化します。
- ラベル `ready-for-development` を使用して、実装可能な状態を明確にします。
- 再現手順や期待値、影響範囲をわかりやすく記述してください。

## Pull Request の作り方

- タイトルは簡潔に、Conventional Commits を意識した表現にします。
- テンプレートのチェックリストをすべて実行し、完了項目にチェックしてください。
- 関連する Issue があれば `Closes #<issue-number>` の形式でリンクします。

## 開発環境セットアップ

```bash
# Deno のインストール
curl -fsSL https://deno.land/install.sh | sh

# Slack CLI のインストール
curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash
slack login

# Git hooks のセットアップ（推奨）
bash scripts/setup-git-hooks.sh
```

- `.env` に Slack CLI 用のトークンなど機密情報を保存します。
- 必要に応じて `deno task dev` でローカル実行してください。
- Git
  hooksをセットアップすると、commit/push時に自動的に品質チェックが実行されます。

## テストと品質チェック

### 自動チェック（推奨）

Git hooksをセットアップすると、commit/push時に自動的にチェックが実行されます：

```bash
# 初回のみ実行
bash scripts/setup-git-hooks.sh
```

**実行されるチェック：**

- **pre-commit**: フォーマット + リント（コミット時）
- **pre-push**: フォーマット + リント + テスト（プッシュ時）

### 手動チェック

Git hooksを使わない場合は、**push する前に必ず以下を実行してください：**

```bash
# 1. フォーマットチェック
deno fmt --check

# 2. リントチェック
deno lint

# 3. 全テスト実行
deno test --allow-all
```

### 注意事項

- 全てのチェックがパスしてから `git commit` と `git push` を実行してください。
- CIでのフォーマットエラーやテスト失敗を防ぐため、ローカルで事前確認が必須です。
- 失敗した場合はログを確認し修正してから再実行してください。
- Slack API 依存部分はモックを活用し、安定したテストを維持します。
- 緊急時のみ `git push --no-verify` でフックをスキップ可能（非推奨）

## コミットメッセージ規約

- Conventional Commits を推奨しています。
  - 例: `feat: add {category} workflow`
- PR マージ前に `git rebase -i` などでコミット履歴を整理してください。
