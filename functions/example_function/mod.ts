import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import type { SlackAPIClient } from "deno-slack-sdk/types.ts";

export const ExampleFunctionDefinition = DefineFunction({
  callback_id: "example_function",
  title: "Fetch {Category} Details",
  description: "{description}",
  source_file: "functions/example_function/mod.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "対象となる {category} のチャンネル ID",
      },
    },
    required: ["channel_id"],
  },
  output_parameters: {
    properties: {
      id: {
        type: Schema.types.string,
        description: "{category} チャンネルの ID",
      },
      name: {
        type: Schema.types.string,
        description: "{category} チャンネルの名前",
      },
      is_archived: {
        type: Schema.types.boolean,
        description: "チャンネルがアーカイブ済みかどうか",
      },
      member_count: {
        type: Schema.types.number,
        description: "チャンネルのメンバー数",
      },
    },
    required: ["id", "name", "is_archived", "member_count"],
  },
});

export interface ChannelSummary {
  id: string;
  name: string;
  is_archived: boolean;
  member_count: number;
}

export async function retrieveChannelSummary(
  client: SlackAPIClient,
  channelId: string,
): Promise<ChannelSummary> {
  const response = await client.conversations.info({
    channel: channelId,
  });

  if (!response.ok || response.channel === undefined) {
    const error = response.error ?? "unknown_error";
    throw new Error(`Failed to load channel info: ${error}`);
  }

  const channel = response.channel as {
    id: string;
    name?: string;
    is_archived?: boolean;
    num_members?: number;
  };

  return {
    id: channel.id,
    name: channel.name ?? "(no name)",
    is_archived: Boolean(channel.is_archived),
    member_count: channel.num_members ?? 0,
  };
}

export default SlackFunction(
  ExampleFunctionDefinition,
  async ({ inputs, client }) => {
    try {
      const summary = await retrieveChannelSummary(client, inputs.channel_id);
      return { outputs: summary };
    } catch (error) {
      const message = error instanceof Error ? error.message : `${error}`;
      return { error: message };
    }
  },
);
