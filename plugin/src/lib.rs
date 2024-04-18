use extism_pdk::*;
use fluentci_pdk::dag;

use crate::helpers::setup_devbox;

pub mod helpers;

#[plugin_fn]
pub fn test(args: String) -> FnResult<String> {
    setup_devbox()?;

    let stdout = dag()
        .pipeline("test")?
        .devbox()?
        .with_exec(vec!["devbox run test", &args])?
        .stdout()?;
    Ok(stdout)
}
