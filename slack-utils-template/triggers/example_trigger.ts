import { DefineTrigger, TriggerTypes } from "deno-slack-sdk/mod.ts";
import ExampleWorkflow from "../workflows/example_workflow.ts";

const ExampleTrigger = DefineTrigger({
  callback_id: "example_trigger",
  type: TriggerTypes.Shortcut,
  name: "Run {Category} Lookup",
  description: "{description}",
  workflow: `#/workflows/${ExampleWorkflow.definition.callback_id}`,
  inputs: {
    channel_id: {
      value: "{{data.channel_id}}",
    },
  },
});

export default ExampleTrigger;
