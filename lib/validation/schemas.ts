/**
 * 共通バリデーションスキーマ
 * Zodを使用した型安全なバリデーション
 * i18n対応のエラーメッセージをサポート
 */
import { z } from "zod";
import { t } from "../i18n/mod.ts";

/**
 * i18n対応のSlackチャンネル ID スキーマを生成
 * 形式: C + 英数字大文字
 *
 * @returns Zodスキーマ
 *
 * @example
 * ```typescript
 * const schema = createChannelIdSchema();
 * const channelId = schema.parse("C12345678");
 * ```
 */
export function createChannelIdSchema() {
  return z.string()
    .min(1, t("errors.validation.channel_id_empty"))
    .regex(
      /^C[A-Z0-9]+$/,
      t("errors.validation.channel_id_format"),
    );
}

/**
 * i18n対応のSlack ユーザー ID スキーマを生成
 * 形式: U または W + 英数字大文字
 *
 * @returns Zodスキーマ
 *
 * @example
 * ```typescript
 * const schema = createUserIdSchema();
 * const userId = schema.parse("U0812GLUZD2");
 * ```
 */
export function createUserIdSchema() {
  return z.string()
    .min(1, t("errors.validation.user_id_empty"))
    .regex(
      /^[UW][A-Z0-9]+$/,
      t("errors.validation.user_id_format"),
    );
}

/**
 * i18n対応の空でない文字列スキーマを生成
 *
 * @returns Zodスキーマ
 *
 * @example
 * ```typescript
 * const schema = createNonEmptyStringSchema();
 * const text = schema.parse("Hello");
 * ```
 */
export function createNonEmptyStringSchema() {
  return z.string().min(1, t("errors.validation.value_empty"));
}

/**
 * Slackチャンネル ID スキーマ（デフォルトインスタンス）
 * 後方互換性のため、モジュール読み込み時のロケールでインスタンス化されます
 *
 * @example
 * ```typescript
 * const channelId = channelIdSchema.parse("C12345678");
 * ```
 */
export const channelIdSchema = createChannelIdSchema();

/**
 * Slack ユーザー ID スキーマ（デフォルトインスタンス）
 * 後方互換性のため、モジュール読み込み時のロケールでインスタンス化されます
 *
 * @example
 * ```typescript
 * const userId = userIdSchema.parse("U0812GLUZD2");
 * ```
 */
export const userIdSchema = createUserIdSchema();

/**
 * 空でない文字列スキーマ（デフォルトインスタンス）
 * 後方互換性のため、モジュール読み込み時のロケールでインスタンス化されます
 *
 * @example
 * ```typescript
 * const text = nonEmptyStringSchema.parse("Hello");
 * ```
 */
export const nonEmptyStringSchema = createNonEmptyStringSchema();

/**
 * 型推論のエクスポート
 */
export type ChannelId = z.infer<ReturnType<typeof createChannelIdSchema>>;
export type UserId = z.infer<ReturnType<typeof createUserIdSchema>>;
export type NonEmptyString = z.infer<
  ReturnType<typeof createNonEmptyStringSchema>
>;
