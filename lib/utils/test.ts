/**
 * 文字列ユーティリティ関数のテスト
 */
import { assertEquals, assertThrows } from "std/testing/asserts.ts";
import {
  getLocale,
  initI18n,
  loadLocale,
  setLocale,
  SUPPORTED_LOCALES,
} from "../i18n/mod.ts";
import { truncate } from "./string.ts";

// i18n初期化
await initI18n();

// テストで使用する全てのロケールを事前に読み込む
await loadLocale("en");
await loadLocale("ja");

const originalLocale = getLocale() as typeof SUPPORTED_LOCALES[number];

// 正常系のテスト
Deno.test("truncate: テキストが最大長を超える場合は切り詰める", () => {
  const result = truncate("Hello World", 5);
  assertEquals(result, "Hello...");
});

Deno.test("truncate: テキストが最大長以下の場合はそのまま返す", () => {
  const result = truncate("Hi", 10);
  assertEquals(result, "Hi");
});

Deno.test("truncate: テキストがちょうど最大長の場合はそのまま返す", () => {
  const result = truncate("Hello", 5);
  assertEquals(result, "Hello");
});

Deno.test("truncate: カスタムサフィックスを使用できる", () => {
  const result = truncate("Hello World", 5, "…");
  assertEquals(result, "Hello…");
});

Deno.test("truncate: 空文字列を処理できる", () => {
  const result = truncate("", 5);
  assertEquals(result, "");
});

Deno.test("truncate: 空のサフィックスを使用できる", () => {
  const result = truncate("Hello World", 5, "");
  assertEquals(result, "Hello");
});

Deno.test("truncate: 日本語テキストを処理できる", () => {
  const result = truncate("こんにちは世界", 5);
  assertEquals(result, "こんにちは...");
});

Deno.test("truncate: 絵文字を含むテキストを処理できる", () => {
  const result = truncate("Hello 👋 World 🌍", 8);
  assertEquals(result, "Hello 👋 ...");
});

Deno.test("truncate: 非常に長いテキストを処理できる", () => {
  const longText = "a".repeat(1000);
  const result = truncate(longText, 10);
  assertEquals(result, "aaaaaaaaaa...");
  assertEquals(result.length, 13); // 10 + "..." の長さ
});

// 異常系のテスト
Deno.test("truncate: maxLengthが0の場合はエラーをthrow", () => {
  assertThrows(
    () => truncate("Hello", 0),
    Error,
  );
});

Deno.test("truncate: maxLengthが負の値の場合はエラーをthrow", () => {
  assertThrows(
    () => truncate("Hello", -1),
    Error,
  );
});

Deno.test("truncate: maxLengthが小数の場合はエラーをthrow", () => {
  assertThrows(
    () => truncate("Hello", 5.5),
    Error,
  );
});

// i18n対応のテスト
Deno.test({
  name: "truncate: エラーメッセージが英語で表示される",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: () => {
    setLocale("en");
    try {
      truncate("Hello", -1);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      assertEquals(message, "maxLength must be a positive integer");
    }
    setLocale(originalLocale); // 元に戻す
  },
});

Deno.test({
  name: "truncate: エラーメッセージが日本語で表示される",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: () => {
    setLocale("ja");
    try {
      truncate("Hello", -1);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // 日本語のエラーメッセージを確認（部分一致）
      assertEquals(message.includes("maxLength"), true);
      assertEquals(message.includes("正の整数"), true);
    }
    setLocale(originalLocale); // 元に戻す
  },
});

// エッジケースのテスト
Deno.test("truncate: maxLengthが1の場合", () => {
  const result = truncate("Hello", 1);
  assertEquals(result, "H...");
});

Deno.test("truncate: サフィックスが長い場合でも正しく動作する", () => {
  const result = truncate("Hello World", 5, " (truncated)");
  assertEquals(result, "Hello (truncated)");
});

Deno.test("truncate: 特殊文字を含むテキストを処理できる", () => {
  const result = truncate("Hello\nWorld\t!", 8);
  assertEquals(result, "Hello\nWo...");
});
