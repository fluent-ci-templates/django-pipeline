use anyhow::Error;
use fluentci_pdk::dag;

pub fn setup_devbox() -> Result<(), Error> {
    let devbox_json = r#"
  {
    "packages": [
      "python@3.12",
      "python312Packages.pip@latest",
      "mysql80@latest",
      "pkg-config@latest",
      "libmysqlclient@latest"
    ],
    "shell": {
      "init_hook": [
        "echo 'Welcome to devbox!' > /dev/null",
        ". $VENV_DIR/bin/activate",
        "python -m pip install -r requirements.txt --use-pep517"
      ],
      "scripts": {
        "test": [
          "echo 'Run tests here'"
          ]
        }
    }
  }
  "#;

    dag()
        .pkgx()?
        .with_exec(vec![&format!(
            r#"[ -f devbox.json ] || echo -e "{}" > devbox.json"#,
            devbox_json.replace("\"", "\\\"")
        )])?
        .stdout()?;
    Ok(())
}
