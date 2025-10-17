import { Trigger } from "deno-slack-sdk/types.ts";
import ExampleWorkflow from "../workflows/example_workflow.ts";

const ExampleTrigger: Trigger<typeof ExampleWorkflow.definition> = {
  callback_id: "example_trigger",
  type: "shortcut",
  name: "Run {Category} Lookup",
  description: "{description}",
  workflow: `#/workflows/${ExampleWorkflow.definition.callback_id}`,
  inputs: {
    channel_id: {
      value: "{{data.channel_id}}",
    },
  },
};

export default ExampleTrigger;
