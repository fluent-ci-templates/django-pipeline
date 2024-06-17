# Django Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fdjango_pipeline&query=%24.version)](https://pkg.fluentci.io/django_pipeline)
[![deno module](https://shield.deno.dev/x/django_pipeline)](https://deno.land/x/django_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.42)
[![](https://jsr.io/badges/@fluentci/django)](https://jsr.io/@fluentci/django)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/django-pipeline)](https://codecov.io/gh/fluent-ci-templates/django-pipeline)

A ready-to-use CI/CD Pipeline for your Django projects.

## 🚀 Usage

Run the following command:

```bash
fluentci run django_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t django
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

## Dagger Module

Use as a [Dagger](https://dagger.io) module:

```bash
dagger install github.com/fluent-ci-templates/django-pipeline@main
```

## Jobs

| Job         | Description      |
| ----------- | ---------------- |
| djangoTests | Run your tests   |

```typescript
djangoTests(
  src: Directory | string | undefined = "."
): Promise<string>
```

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { djangoTests } from "jsr:@fluentci/django";

await djangoTests();

```
