import Client, { connect } from "@dagger.io/dagger";
import { djangoTests } from "./jobs.ts";

export default function pipeline(src = ".") {
  connect(async (client: Client) => {
    await djangoTests(client, src);
  });
}
