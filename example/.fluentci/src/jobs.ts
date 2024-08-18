import { type Directory, dag } from "../sdk/client.gen.ts";
import { getDirectory } from "./helpers.ts";

export enum Job {
  djangoTests = "django-tests",
}

export const exclude = [".git", ".devbox", ".fluentci"];

/**
 * @function
 * @description Run django tests
 * @param {string | Directory} src
 * @returns {Promise<string>}
 */
export async function djangoTests(
  src: Directory | string | undefined = "."
): Promise<string> {
  // get MariaDB base image
  const mariadb = dag
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
    .withExposedPort(3306)
    .asService();

  const context = await getDirectory(src);
  const baseCtr = dag
    .pipeline(Job.djangoTests)
    .container()
    .from("ghcr.io/fluentci-io/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec([
      "apt-get",
      "install",
      "-y",
      "build-essential",
      "python3-dev",
      "default-libmysqlclient-dev",
      "pkg-config",
      "python3-pip",
      "python3.11-venv",
      "python3-full",
    ]);

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
    .withEnvVariable("MYSQLCLIENT_CFLAGS", "-I/usr/include/mysql")
    .withEnvVariable(
      "MYSQLCLIENT_LDFLAGS",
      "-L/usr/lib/x86_64-linux-gnu -lmysqlclient"
    )
    .withExec([
      "bash",
      "-c",
      "\
  python3 -m venv venv && \
  chmod a+x venv/bin/activate && \
  ls -ltr venv/bin && \
    . venv/bin/activate && \
   pip install -r requirements.txt --use-pep517 && \
   cd todo_project && \
   python3 manage.py makemigrations && \
   python3 manage.py migrate && \
   python3 manage.py check && \
   python3 manage.py test",
    ]);
  const result = await ctr.stdout();
  return result;
}

export type JobExec = (src?: string) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.djangoTests]: djangoTests,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.djangoTests]: "Run django tests",
};
