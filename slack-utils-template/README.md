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

# 依存設定と初期化
slack login
slack env add local
```

- `.env` に Slack CLI が要求するトークンや変数を設定してください。
- `import_map.json` で解決される依存を使用します。

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
└── .github/           # CI/CD と Issue テンプレート
```

## ライセンス

本テンプレートは MIT ライセンスで提供されています。詳細は `LICENSE`
を参照してください。
