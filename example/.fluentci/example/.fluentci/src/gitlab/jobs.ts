import { Job } from "fluent_gitlab_ci";

export const install = new Job()
  .image("ubuntu:20.04")
  .services(["mysql:8.0"])
  .cache(["~/.cache/pip/"]).beforeScript(`
    apt -y update
    apt -y install apt-utils
    apt -y install net-tools python3.8 python3-pip mysql-client libmysqlclient-dev
    apt -y upgrade
    pip3 install -r requirements.txt
  `);

export const migrations = new Job().stage("build").script(`
    python3 manage.py makemigrations
    python3 manage.py migrate
    python3 manage.py check
  `);

export const djangoTests = new Job().stage("test").script(`
    echo "GRANT ALL on *.* to '\${MYSQL_USER}';"| mysql -u root --password="\${MYSQL_ROOT_PASSWORD}" -h mysql
    python3 manage.py test
  `);
