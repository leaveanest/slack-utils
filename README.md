# slack-utils-template

{description}

## 概要

- slack-utils シリーズの共通テンプレートです。
- {Category} をはじめとした {category} ワークフローを素早く構築できます。
- Slack Deno SDK v2.0.0
  を利用し、関数・ワークフロー・トリガーを一貫して管理します。

## 前提条件

- Deno 1.37+ がインストールされていること
- Slack CLI が利用可能で、ワークスペースにログイン済みであること
- Slack App を作成できる権限を持っていること

## セットアップ

```bash
# リポジトリを取得
git clone https://github.com/your-org/slack-utils-template.git
cd slack-utils-template

# 環境変数の設定
cp .env.example .env
# .env ファイルを編集して、アプリ名やカテゴリをカスタマイズ

# 依存設定と初期化
slack login
slack env add local

# Git hooks をセットアップ（推奨）
bash scripts/setup-git-hooks.sh
```

### 環境変数の設定

`.env` ファイルで以下の変数をカスタマイズできます：

```bash
# Slack App Configuration
SLACK_APP_NAME=Slack Utils Template        # アプリ名
SLACK_APP_DESCRIPTION=A template...         # アプリの説明
SLACK_CATEGORY=Channel                      # カテゴリ名（例: Team, Project など）
```

これらの変数は、ワークフロー、ファンクション、トリガーの名前や説明に自動的に反映されます。

### デプロイ設定

`slack.json` でデプロイ先のワークスペース名を設定してください：

```json
"deployments": {
  "production": {
    "workspace": "your-workspace-name",  // ← 実際のワークスペース名に変更
    "token_alias": "production"
  }
}
```

- `import_map.json` で解決される依存を使用します。
- Git hooksをセットアップすると、commit/push前に自動的にチェックが実行されます。

## 使い方

```bash
# フォーマット・Lint・テスト
deno task fmt
deno task lint
deno task check
deno task test

# ローカル実行
slack run workflows/example_workflow
```

- `functions/example_function/mod.ts` が {category}
  チャンネル情報を取得するサンプルです。
- `workflows/example_workflow.ts` は上記関数を利用して {Category} を分析します。
- `triggers/example_trigger.ts` を Slack CLI
  で登録し、ショートカットからワークフローを呼び出せます。

## Slack CLI のインストール

```bash
curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash
slack login
```

- macOS / Linux を想定しています。Windows の場合は WSL
  上で同様の手順を実行してください。

## GitHub Secrets の設定

GitHub Actionsを使用するため、以下のシークレットを設定してください：

```
Settings → Secrets and variables → Actions
```

必須のシークレット：

- `SLACK_WEBHOOK` - Slack通知用のIncoming Webhook URL

オプションのシークレット：

- `CODECOV_TOKEN` - コードカバレッジレポート用（プライベートリポジトリの場合）
- `OPENAI_API_KEY` - Codex CLI用（issue-to-prワークフロー使用時）
- `NPM_TOKEN` - npm公開用（npmパッケージとして公開する場合）
- `JSR_TOKEN` - JSR公開用（JSRパッケージとして公開する場合）

## デプロイ手順

```bash
# テストと型チェックを完了させる
deno task test
deno task check

# Slack CLI でデプロイ
slack deploy --env production
```

- `slack.json` の設定を環境に合わせて更新してください。
- デプロイ後は
  `slack triggers create --trigger-file triggers/example_trigger.ts`
  でトリガーを有効化します。

## プロジェクト構成

```
slack-utils-template/
├── functions/         # Slack Functions
├── workflows/         # Slack Workflows
├── triggers/          # Slack Triggers
├── assets/            # アイコンなどの静的アセット
├── .github/           # CI/CD と Issue テンプレート
├── .cursor/           # Cursor AI エディタのルール設定
├── .gitattributes     # 改行コード統一設定 (LF)
└── deno.jsonc         # Deno設定（CHANGELOG.md除外含む）
```

## 開発時の注意事項

- **改行コード**: 全ファイルでLF（Unix形式）に統一されています
- **Cursor AI**: `.cursor/rules/push_rules.mdc`
  でpush前チェックが自動実行されます
- **CHANGELOG.md**:
  release-pleaseが自動生成するため、フォーマットチェックから除外されています

## Git Hooks による品質チェック（推奨）

Git hooksを設定すると、commit/push時に自動的に品質チェックが実行されます。

### セットアップ

```bash
bash scripts/setup-git-hooks.sh
```

### 自動実行される内容

**pre-commit（コミット前）:**

- ✅ フォーマットチェック
- ✅ リントチェック

**pre-push（プッシュ前）:**

- ✅ フォーマットチェック
- ✅ リントチェック
- ✅ テスト実行

### メリット

- CI/CDのエラーを事前に防止
- ローカルで即座にフィードバック
- 品質の自動保証

### 緊急時のスキップ（非推奨）

```bash
git commit --no-verify  # pre-commitをスキップ
git push --no-verify    # pre-pushをスキップ
```

詳細は `docs/git-hooks-setup.md` を参照してください。

## ライセンス

本テンプレートは MIT ライセンスで提供されています。詳細は `LICENSE`
を参照してください。
