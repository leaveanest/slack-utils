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
```

- `.env` に Slack CLI 用のトークンなど機密情報を保存します。
- 必要に応じて `deno task dev` でローカル実行してください。

## テストと品質チェック

```bash
deno task fmt
deno task lint
deno task check
deno task test
```

- 失敗した場合はログを確認し修正してから再実行してください。
- Slack API 依存部分はモックを活用し、安定したテストを維持します。

## コミットメッセージ規約

- Conventional Commits を推奨しています。
  - 例: `feat: add {category} workflow`
- PR マージ前に `git rebase -i` などでコミット履歴を整理してください。
