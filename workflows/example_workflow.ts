import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ExampleFunctionDefinition } from "../functions/example_function/mod.ts";

const ExampleWorkflow = DefineWorkflow({
  callback_id: "example_workflow",
  title: "{Category} Explorer",
  description: "{description}",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "処理対象の {category} チャンネル ID",
      },
    },
    required: ["channel_id"],
  },
});

ExampleWorkflow.addStep(ExampleFunctionDefinition, {
  channel_id: ExampleWorkflow.inputs.channel_id,
});

export default ExampleWorkflow;
