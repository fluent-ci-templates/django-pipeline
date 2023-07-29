import Client from "@dagger.io/dagger";
import { withDevbox } from "https://deno.land/x/nix_installer_pipeline@v0.3.6/src/dagger/steps.ts";

export const djangoTests = async (client: Client, src = ".") => {
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
    .withExec([
      "sh",
      "-c",
      "mkdir -p .devbox && eval $(devbox shell --print-env) && \
       devbox services up -b && \
       devbox services stop && \
       sed -i 's/mysqld 2/mysqld --user=root 2/' .devbox/virtenv/mysql80/process-compose.yaml",
    ])
    .withExec([
      "sh",
      "-c",
      "devbox services up -b && \
       sleep 3 && \
       eval $(devbox shell --print-env) && \
       echo 'CREATE DATABASE IF NOT EXISTS todo_db;' | mysql -u root && \
       cd todo_project && \
       . $VENV_DIR/bin/activate && \
       python3 manage.py makemigrations && \
       python3 manage.py migrate && \
       python3 manage.py check && \
       python3 manage.py test && \
       devbox services stop",
    ]);
  const result = await ctr.stdout();

  console.log(result);
};
