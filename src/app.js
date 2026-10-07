import http from 'node:http';

const DEFAULT_PORT = 8080;
const DEFAULT_RELEASE_VERSION = 'local';
const SAFE_RELEASE_VERSION = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

export function readReleaseVersion(env = process.env) {
  const candidate = env.RELEASE_VERSION?.trim();
  return candidate && SAFE_RELEASE_VERSION.test(candidate) ? candidate : DEFAULT_RELEASE_VERSION;
}

export function readPort(env = process.env) {
  const candidate = env.PORT ?? String(DEFAULT_PORT);
  if (!/^\d+$/.test(candidate)) {
    throw new Error('PORT must be an integer between 1024 and 65535.');
  }

  const port = Number(candidate);
  if (!Number.isSafeInteger(port) || port < 1024 || port > 65535) {
    throw new Error('PORT must be an integer between 1024 and 65535.');
  }
  return port;
}

export function createDemoServer(env = process.env) {
  const releaseVersion = readReleaseVersion(env);

  return http.createServer((request, response) => {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;

    if (request.method === 'GET' && pathname === '/') {
      send(response, 200, 'text/html; charset=utf-8', renderHomePage(releaseVersion));
      return;
    }

    if (request.method === 'GET' && pathname === '/health') {
      send(response, 200, 'application/json; charset=utf-8', JSON.stringify({ status: 'ok' }));
      return;
    }

    send(response, 404, 'application/json; charset=utf-8', JSON.stringify({ error: 'not_found' }));
  });
}

function send(response, statusCode, contentType, body) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(body);
}

function renderHomePage(releaseVersion) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark">
    <title>LLMDevOps Demo</title>
    <style>
      :root { font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #f8fafc; background: #070b16; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; overflow: hidden; }
      body::before { content: ""; position: fixed; inset: -30%; background: radial-gradient(circle at 30% 30%, #155e75 0, transparent 32%), radial-gradient(circle at 70% 65%, #4c1d95 0, transparent 34%); filter: blur(36px); opacity: .75; }
      main { position: relative; width: min(720px, 100%); padding: clamp(32px, 7vw, 72px); border: 1px solid rgba(148,163,184,.24); border-radius: 28px; background: rgba(15,23,42,.78); box-shadow: 0 32px 100px rgba(0,0,0,.45); backdrop-filter: blur(18px); }
      .eyebrow { margin: 0 0 18px; color: #67e8f9; font-size: 13px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
      h1 { margin: 0; font-size: clamp(44px, 9vw, 86px); line-height: .95; letter-spacing: -.055em; }
      .lead { max-width: 520px; margin: 26px 0 38px; color: #cbd5e1; font-size: clamp(17px, 2.6vw, 21px); line-height: 1.55; }
      .release { display: inline-flex; gap: 12px; align-items: center; padding: 12px 16px; border: 1px solid rgba(103,232,249,.28); border-radius: 999px; background: rgba(8,145,178,.12); color: #cffafe; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 14px; }
      .dot { width: 9px; height: 9px; border-radius: 50%; background: #34d399; box-shadow: 0 0 18px #34d399; }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">Published with an AI deployment agent</p>
      <h1>LLMDevOps<br>Demo</h1>
      <p class="lead">A tiny stateless application deployed from an exact Git revision, checked for health, and ready to roll back.</p>
      <div class="release"><span class="dot" aria-hidden="true"></span>release ${releaseVersion}</div>
    </main>
  </body>
</html>`;
}
