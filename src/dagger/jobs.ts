import Client from "@dagger.io/dagger";
import { withDevbox } from "https://deno.land/x/nix_installer_pipeline@v0.3.6/src/dagger/steps.ts";

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
      .pipeline("django-tests")
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "bash", "curl"])
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  );

  const ctr = baseCtr
    .withDirectory("/app", context, {
      exclude: [".git", ".devbox", ".fluentci"],
    })
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
