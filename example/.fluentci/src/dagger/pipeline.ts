import * as jobs from "./jobs.ts";

const { djangoTests, runnableJobs, exclude } = jobs;

export default async function pipeline(src = ".", args: string[] = []) {
  if (args.length > 0) {
    await runSpecificJobs(args as jobs.Job[]);
    return;
  }

  await djangoTests(src);
}

async function runSpecificJobs(args: jobs.Job[]) {
  for (const name of args) {
    const job = runnableJobs[name];
    if (!job) {
      throw new Error(`Job ${name} not found`);
    }
    await job();
  }
}
