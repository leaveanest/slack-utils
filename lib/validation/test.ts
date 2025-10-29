import { assertEquals } from "std/testing/asserts.ts";
import {
  channelIdSchema,
  nonEmptyStringSchema,
  userIdSchema,
} from "./schemas.ts";

Deno.test("channelIdSchema: 正常なチャンネルIDを検証", () => {
  const result = channelIdSchema.safeParse("C12345678");
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data, "C12345678");
  }
});

Deno.test("channelIdSchema: 不正なチャンネルIDを拒否（小文字）", () => {
  const result = channelIdSchema.safeParse("c12345678");
  assertEquals(result.success, false);
});

Deno.test("channelIdSchema: 不正なチャンネルIDを拒否（Cで開始しない）", () => {
  const result = channelIdSchema.safeParse("U12345678");
  assertEquals(result.success, false);
});

Deno.test("channelIdSchema: 空文字を拒否", () => {
  const result = channelIdSchema.safeParse("");
  assertEquals(result.success, false);
});

Deno.test("userIdSchema: 正常なユーザーIDを検証（U開始）", () => {
  const result = userIdSchema.safeParse("U0812GLUZD2");
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data, "U0812GLUZD2");
  }
});

Deno.test("userIdSchema: 正常なユーザーIDを検証（W開始）", () => {
  const result = userIdSchema.safeParse("W1234567890");
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data, "W1234567890");
  }
});

Deno.test("userIdSchema: 不正なユーザーIDを拒否", () => {
  const result = userIdSchema.safeParse("invalid");
  assertEquals(result.success, false);
});

Deno.test("userIdSchema: 空文字を拒否", () => {
  const result = userIdSchema.safeParse("");
  assertEquals(result.success, false);
});

Deno.test("nonEmptyStringSchema: 正常な文字列を検証", () => {
  const result = nonEmptyStringSchema.safeParse("Hello, World!");
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data, "Hello, World!");
  }
});

Deno.test("nonEmptyStringSchema: 空文字を拒否", () => {
  const result = nonEmptyStringSchema.safeParse("");
  assertEquals(result.success, false);
});

Deno.test("nonEmptyStringSchema: 空白のみの文字列を許可", () => {
  // 空白のみの文字列は許可される（trimはしない）
  const result = nonEmptyStringSchema.safeParse("   ");
  assertEquals(result.success, true);
});
