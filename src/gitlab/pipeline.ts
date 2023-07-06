import { GitlabCI } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";
import { install, migrations, djangoTests } from "./jobs.ts";

const gitlabci = new GitlabCI()
  .variables({
    MYSQL_DATABASE: "$MYSQL_DB",
    MYSQL_ROOT_PASSWORD: "$MYSQL_PASS",
    MYSQL_USER: "$MYSQL_USER",
    MYSQL_PASSWORD: "$MYSQL_PASS",
  })
  .addJob("install", install)
  .addJob("migrations", migrations)
  .addJob("django-tests", djangoTests);

export default gitlabci;
