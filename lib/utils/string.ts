/**
 * 文字列ユーティリティ関数
 * 文字列の操作に関する共通処理を提供します
 */
import { z } from "zod";
import { initI18n, t } from "../i18n/mod.ts";

// トップレベルawaitでi18nを初期化
await initI18n();

/**
 * 文字列切り詰めオプションのZodスキーマ
 * maxLengthの検証用
 */
const truncateOptionsSchema = z.object({
  text: z.string(),
  maxLength: z.number().int().positive().superRefine((val, ctx) => {
    if (val <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "number",
        inclusive: false,
        message: t("errors.validation.max_length_invalid"),
      });
    }
  }),
  suffix: z.string().optional(),
});

/**
 * 長いテキストを指定した長さで切り詰める関数
 *
 * テキストが指定された最大長を超える場合、切り詰めてサフィックスを追加します。
 * テキストが最大長以下の場合は、そのまま返します。
 *
 * @param text - 切り詰める対象のテキスト
 * @param maxLength - テキストの最大長（正の整数）
 * @param suffix - 切り詰めた場合に追加するサフィックス（デフォルト: "..."）
 * @returns 切り詰めたテキスト
 * @throws {Error} maxLengthが正の整数でない場合
 *
 * @example
 * ```typescript
 * // 基本的な使用例
 * truncate("Hello World", 5); // => "Hello..."
 *
 * // テキストが短い場合はそのまま返す
 * truncate("Hi", 10); // => "Hi"
 *
 * // カスタムサフィックスを使用
 * truncate("Hello World", 5, "…"); // => "Hello…"
 *
 * // 空文字列
 * truncate("", 5); // => ""
 * ```
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix = "...",
): string {
  // 入力値のバリデーション
  const result = truncateOptionsSchema.safeParse({ text, maxLength, suffix });
  if (!result.success) {
    const errorMessage = result.error.errors[0].message;
    throw new Error(errorMessage);
  }

  // テキストが最大長以下の場合はそのまま返す
  if (text.length <= maxLength) {
    return text;
  }

  // テキストを切り詰めてサフィックスを追加
  return text.slice(0, maxLength) + suffix;
}
