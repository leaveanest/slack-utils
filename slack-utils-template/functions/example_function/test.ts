import { assertEquals, assertRejects } from "std/testing/asserts.ts";
import type { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { retrieveChannelSummary } from "./mod.ts";

type ConversationsInfo = SlackAPIClient["conversations"]["info"];
type ConversationsInfoArgs = Parameters<ConversationsInfo>[0];
type ConversationsInfoResult = Awaited<ReturnType<ConversationsInfo>>;

Deno.test("正常にチャンネル情報を取得できる", async () => {
  const mockClient = {
    conversations: {
      info(_args: ConversationsInfoArgs): Promise<ConversationsInfoResult> {
        return Promise.resolve({
          ok: true,
          channel: {
            id: "C12345",
            name: "general",
            is_archived: false,
            num_members: 42,
          },
        } as ConversationsInfoResult);
      },
    },
  } as unknown as SlackAPIClient;

  const summary = await retrieveChannelSummary(mockClient, "C12345");
  assertEquals(summary, {
    id: "C12345",
    name: "general",
    is_archived: false,
    member_count: 42,
  });
});

Deno.test("API エラー時には例外を投げる", async () => {
  const mockClient = {
    conversations: {
      info(_args: ConversationsInfoArgs): Promise<ConversationsInfoResult> {
        return Promise.resolve({
          ok: false,
          error: "not_in_channel",
        } as ConversationsInfoResult);
      },
    },
  } as unknown as SlackAPIClient;

  await assertRejects(
    () => retrieveChannelSummary(mockClient, "C00000"),
    Error,
    "Failed to load channel info: not_in_channel",
  );
});
