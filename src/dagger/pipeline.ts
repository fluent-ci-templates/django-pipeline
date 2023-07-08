import Client, { connect } from "@dagger.io/dagger";
import { djangoTests, install, migrations } from "./jobs.ts";

export default function pipeline(src = ".") {
  connect(async (client: Client) => {
    await install(client, src);
    await migrations(client, src);
    await djangoTests(client, src);
  });
}
