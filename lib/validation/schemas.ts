/**
 * 共通バリデーションスキーマ
 * Zodを使用した型安全なバリデーション
 */
import { z } from "zod";

/**
 * Slackチャンネル ID スキーマ
 * 形式: C + 英数字大文字
 *
 * @example
 * ```typescript
 * const channelId = channelIdSchema.parse("C12345678");
 * ```
 */
export const channelIdSchema = z.string()
  .min(1, "Channel ID cannot be empty")
  .regex(
    /^C[A-Z0-9]+$/,
    "Channel ID must start with 'C' followed by uppercase alphanumeric characters",
  );

/**
 * Slack ユーザー ID スキーマ
 * 形式: U または W + 英数字大文字
 *
 * @example
 * ```typescript
 * const userId = userIdSchema.parse("U0812GLUZD2");
 * ```
 */
export const userIdSchema = z.string()
  .min(1, "User ID cannot be empty")
  .regex(
    /^[UW][A-Z0-9]+$/,
    "User ID must start with 'U' or 'W' followed by uppercase alphanumeric characters",
  );

/**
 * 空でない文字列スキーマ
 *
 * @example
 * ```typescript
 * const text = nonEmptyStringSchema.parse("Hello");
 * ```
 */
export const nonEmptyStringSchema = z.string().min(1, "Value cannot be empty");

/**
 * 型推論のエクスポート
 */
export type ChannelId = z.infer<typeof channelIdSchema>;
export type UserId = z.infer<typeof userIdSchema>;
export type NonEmptyString = z.infer<typeof nonEmptyStringSchema>;
