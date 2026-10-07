# LLMDevOps Demo App

A deliberately small stateless HTTP application for demonstrating the
LLMDevOps universal Docker deployment flow. It uses only built-in Node.js APIs:
there are no package dependencies, secrets, databases, volumes, or external
services.

## Run locally

Node.js 22–24 is supported.

```sh
npm test
RELEASE_VERSION=local-demo npm start
```

Open <http://localhost:8080>. The health endpoint is
<http://localhost:8080/health> and returns `{"status":"ok"}`.

`RELEASE_VERSION` is a public display label, not a secret. It accepts at most 64
ASCII letters, digits, dots, underscores, and hyphens. Missing or unsafe values
are shown as `local`. `PORT` defaults to `8080`.

## Run with Docker

```sh
docker build -t llmdevops-demo:local .
docker run --rm -p 8080:8080 -e RELEASE_VERSION=local-docker llmdevops-demo:local
```

The image runs as the unprivileged `node` user.

## LLMDevOps manifest

`llmdevops.yaml` follows the bounded universal v1 contract: one root
`Dockerfile`, one HTTP port, one health path, environment variable names only,
and bounded resources.

The checked-in source block is intentionally a placeholder while this repository
is local. **Do not deploy or publish from the manifest until the repository URL
and all-zero commit are replaced with the real public repository and exact
immutable Git commit.** No GitHub repository is created by this project setup.
