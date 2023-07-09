import Client from "@dagger.io/dagger";

export const install = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline("install")
    .container()
    .from("ubuntu:20.04")
    .withMountedCache("~/.cache/pip/", client.cacheVolume("pip"))
    .withDirectory("/app", context, {
      exclude: [".git"],
    })
    .withWorkdir("/app")
    .withExec(["apt", "-y", "update"])
    .withExec(["apt", "-y", "install", "apt-utils"])
    .withExec([
      "apt",
      "-y",
      "install",
      "net-tools",
      "python3.8",
      "python3-pip",
      "mysql-client",
      "libmysqlclient-dev",
    ])
    .withExec(["apt", "-y", "upgrade"])
    .withExec(["pip3", "install", "-r", "requirements.txt"]);

  const result = await ctr.stdout();

  console.log(result);
};

export const migrations = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline("migrations")
    .container()
    .from("ubuntu:20.04")
    .withMountedCache("~/.cache/pip/", client.cacheVolume("pip"))
    .withDirectory("/app", context, {
      exclude: [".git"],
    })
    .withWorkdir("/app")
    .withExec(["python3", "manage.py", "makemigrations"])
    .withExec(["python3", "manage.py", "migrate"])
    .withExec(["python3", "manage.py", "check"]);

  const result = await ctr.stdout();

  console.log(result);
};

export const djangoTests = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline("django-tests")
    .container()
    .from("ubuntu:20.04")
    .withMountedCache("~/.cache/pip/", client.cacheVolume("pip"))
    .withDirectory("/app", context, {
      exclude: [".git"],
    })
    .withWorkdir("/app")
    .withEnvVariable("MYSQL_USER", "root")
    .withEnvVariable("MYSQL_ROOT_PASSWORD", "root")
    .withExec([
      "sh",
      "-c",
      'echo "GRANT ALL on *.* to \'${MYSQL_USER}\';"| mysql -u root --password="${MYSQL_ROOT_PASSWORD}" -h mysql',
    ])
    .withExec(["python3", "manage.py", "test"]);

  const result = await ctr.stdout();

  console.log(result);
};
