import { Manifest } from "deno-slack-sdk/mod.ts";
import { ExampleFunctionDefinition } from "./functions/example_function/mod.ts";
import ExampleWorkflow from "./workflows/example_workflow.ts";

export default Manifest({
  name: "{Category} Utilities",
  description: "{description}",
  icon: "assets/icon.png",
  workflows: [ExampleWorkflow],
  functions: [ExampleFunctionDefinition],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "channels:read",
    "groups:read",
    "users:read",
  ],
});
