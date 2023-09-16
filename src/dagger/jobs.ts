import Client from "@fluentci.io/dagger";
import { withDevbox } from "https://nix.fluentci.io/v0.5.0/src/dagger/steps.ts";

export enum Job {
  djangoTests = "django-tests",
}

export const exclude = [".git", ".devbox", ".fluentci"];

export const djangoTests = async (client: Client, src = ".") => {
  // get MariaDB base image
  const mariadb = client
    .container()
    .from("mariadb:10.11.2")
    .withEnvVariable("MARIADB_USER", Deno.env.get("MARIADB_USER") || "user")
    .withEnvVariable(
      "MARIADB_PASSWORD",
      Deno.env.get("MARIADB_PASSWORD") || "password"
    )
    .withEnvVariable("MARIADB_DATABASE", "test_db")
    .withEnvVariable(
      "MARIADB_ROOT_PASSWORD",
      Deno.env.get("MARIADB_ROOT_PASSWORD") || "root"
    )
    .withExposedPort(3306);

  const context = client.host().directory(src);
  const baseCtr = withDevbox(
    client
      .pipeline(Job.djangoTests)
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "bash", "curl"])
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  );

  const ctr = baseCtr
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withServiceBinding("db", mariadb)
    .withEnvVariable("MARIADB_USER", Deno.env.get("MARIADB_USER") || "user")
    .withEnvVariable(
      "MARIADB_PASSWORD",
      Deno.env.get("MARIADB_PASSWORD") || "password"
    )
    .withEnvVariable("MARIADB_DATABASE", "test_db")
    .withEnvVariable(
      "MARIADB_ROOT_PASSWORD",
      Deno.env.get("MARIADB_ROOT_PASSWORD") || "root"
    )
    .withEnvVariable("MARIADB_HOST", Deno.env.get("MARIADB_HOST") || "db")
    .withExec([
      "sh",
      "-c",
      "eval $(devbox shell --print-env) && \
       python3 -m venv $VENV_DIR && \
       . $VENV_DIR/bin/activate && \
       python -m pip install -r requirements.txt --use-pep517 && \
       cd todo_project && \
       python3 manage.py makemigrations && \
       python3 manage.py migrate && \
       python3 manage.py check && \
       python3 manage.py test",
    ]);
  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (client: Client, src?: string) => Promise<void>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.djangoTests]: djangoTests,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.djangoTests]: "Run django tests",
};
