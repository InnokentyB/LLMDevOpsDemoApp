# ВайбХостинг Demo App

A deliberately small stateless HTTP application that serves the ВайбХостинг
early-access landing page and demonstrates the universal Docker deployment
flow. It uses only built-in Node.js APIs: there are no package dependencies,
secrets, databases, volumes, or external services.

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

## Подключение MCP для участников

Нужен Node.js 24. Скачайте публичный файл
`/downloads/vibehosting-mcp.mjs` с адреса этого лендинга и сохраните локально.
Ссылка работает после публикации версии, содержащей этот файл. Runtime-репозиторий
для подключения не нужен: SDK уже включён в скачиваемый модуль, установка npm-пакетов
не требуется. В файле нет приглашений, токенов или серверных ключей; лицензии
включённых зависимостей находятся в его начале.

В MCP-клиенте добавьте локальный stdio-сервер, указав реальные абсолютные пути:

```json
{
  "mcpServers": {
    "vibehosting": {
      "command": "/absolute/path/to/node",
      "args": ["/absolute/path/to/vibehosting-mcp.mjs"]
    }
  }
}
```

Перезапустите подключение. Попросите агента вызвать `create_account` с одноразовым
приглашением ведущего и вашим именем. Мост сохраняет credential в локальном файле
`~/.config/vibehosting/client-account.json` с правами только владельца, сам подключает
аккаунт и обновляет список инструментов. Токен не возвращается агенту. На этом же
подключении доступны `get_account`, `register_project`, `plan_deployment`,
`deploy_project` и `deployment_status` — отдельная регистрация на сайте не нужна.

Не публикуйте файл credential и приглашение. При ошибке после регистрации сначала
перезапустите MCP-подключение, не расходуйте новое приглашение вслепую. В этой версии
локальный мост не разрешает ротацию/отзыв токена. Пилот — по приглашениям: один
stateless HTTP-проект, готовый публичный GHCR-образ по digest, до 0,5 CPU и 256 МБ,
без баз, томов и секретов. Сервис пока не собирает код из Git автоматически.

## LLMDevOps manifest

`llmdevops.yaml` follows the bounded universal v1 contract: one root
`Dockerfile`, one HTTP port, one health path, environment variable names only,
and bounded resources.

The checked-in manifest names the repository and branch. LLMDevOps resolves and
records the exact immutable Git commit in the deployment profile and plan; a
manifest cannot truthfully contain the SHA of the commit that contains itself.
