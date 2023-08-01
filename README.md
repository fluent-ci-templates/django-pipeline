# Django Pipeline

[![deno module](https://shield.deno.dev/x/django_pipeline)](https://deno.land/x/django_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/django-pipeline)](https://codecov.io/gh/fluent-ci-templates/django-pipeline)

A ready-to-use CI/CD Pipeline for your Django projects.

## 🚀 Usage

Run the following command:

```bash
dagger run fluentci django_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t django
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
dagger run fluentci .
```

## Jobs

| Job         | Description      |
| ----------- | ---------------- |
| djangoTests | Run your tests   |

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import Client, { connect } from "@dagger.io/dagger";
import { Dagger } from "https://deno.land/x/django_pipeline/mod.ts";

const { djangoTests } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await djangoTests(client, src);
  });
}

pipeline();
```
