const command = new Deno.Command(Deno.execPath(), {
  args: [
    "run",
    "-A",
    "--import-map=https://deno.land/x/django_pipeline/import_map.json",
    "https://deno.land/x/django_pipeline/src/dagger/runner.ts",
  ],
});

const { stdout } = await command.output();

console.log(new TextDecoder().decode(stdout));
