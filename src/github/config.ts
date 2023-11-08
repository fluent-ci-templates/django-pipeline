import { JobSpec, Workflow } from "fluent_github_actions";

/**
 * Generates a GitHub Actions workflow for testing a Django pipeline.
 * @returns The generated workflow.
 */
export function generateYaml(): Workflow {
  const workflow = new Workflow("Test");

  const push = {
    branches: ["main"],
  };

  const setupDagger = `\
  curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=0.8.1 sh
  sudo mv bin/dagger /usr/local/bin
  dagger version`;

  const test: JobSpec = {
    "runs-on": "ubuntu-latest",
    steps: [
      {
        uses: "actions/checkout@v2",
      },
      {
        name: "Setup Fluent CI",
        uses: "fluentci-io/setup-fluentci@v1",
      },
      {
        name: "Run Dagger Pipelines",
        run: "fluentci run django_pipeline",
      },
    ],
  };

  workflow.on({ push }).jobs({ test });

  return workflow;
}
