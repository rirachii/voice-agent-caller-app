import { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // Create a component generator
  plop.setGenerator("component", {
    description: "Generate a new UI component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the component?",
      },
      {
        type: "list",
        name: "type",
        message: "What type of component is this?",
        choices: ["ui", "layout", "feature"],
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/ui/src/components/{{dashCase name}}/{{pascalCase name}}.tsx",
        templateFile: "templates/component.hbs",
      },
      {
        type: "add",
        path: "packages/ui/src/components/{{dashCase name}}/index.ts",
        templateFile: "templates/component-index.hbs",
      },
    ],
  });

  // Create a screen generator
  plop.setGenerator("screen", {
    description: "Generate a new screen",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the screen?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/shared/src/screens/{{dashCase name}}/{{pascalCase name}}Screen.tsx",
        templateFile: "templates/screen.hbs",
      },
      {
        type: "add",
        path: "packages/shared/src/screens/{{dashCase name}}/index.ts",
        templateFile: "templates/screen-index.hbs",
      },
    ],
  });

  // Create a Supabase function generator
  plop.setGenerator("edge-function", {
    description: "Generate a new Supabase Edge Function",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the edge function?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "supabase/functions/{{dashCase name}}/index.ts",
        templateFile: "templates/edge-function.hbs",
      },
    ],
  });
}
