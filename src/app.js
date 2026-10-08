import http from 'node:http';
import { readFileSync } from 'node:fs';

const DEFAULT_PORT = 8080;
const DEFAULT_RELEASE_VERSION = 'local';
const SAFE_RELEASE_VERSION = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const DISPLAY_FONT = readFileSync(new URL('../assets/Unbounded-Variable.ttf', import.meta.url));
const MCP_BRIDGE = readFileSync(new URL('../assets/downloads/vibehosting-mcp.mjs', import.meta.url));
const EARLY_ACCESS_CLIENT=readFileSync(new URL('./early-access-client.js',import.meta.url));

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
    if(request.method==='GET' && pathname==='/assets/early-access.js'){
      send(response,200,'application/javascript; charset=utf-8',EARLY_ACCESS_CLIENT);return;
    }

    if (request.method === 'GET' && pathname === '/health') {
      send(response, 200, 'application/json; charset=utf-8', JSON.stringify({ status: 'ok' }));
      return;
    }

    if (request.method === 'GET' && pathname === '/assets/unbounded.ttf') {
      send(response, 200, 'font/ttf', DISPLAY_FONT);
      return;
    }

    if (request.method === 'GET' && pathname === '/downloads/vibehosting-mcp.mjs') {
      send(response, 200, 'application/javascript; charset=utf-8', MCP_BRIDGE);
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
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="description" content="ВайбХостинг публикует приложение из AI-агента: понятный план, явное подтверждение, проверенный адрес и откат.">
    <title>ВайбХостинг — написал, подтвердил, опубликовал</title>
    <style>
      @font-face { font-family: "Unbounded"; src: url("/assets/unbounded.ttf") format("truetype"); font-style: normal; font-weight: 200 900; font-display: swap; }
      :root {
        --paper: #f3ead6;
        --ink: #171717;
        --red: #ef4d36;
        --blue: #2355f4;
        --violet: #382c65;
        --muted: #625d52;
        --rule: rgba(23, 23, 23, .28);
        --space: clamp(20px, 4vw, 58px);
        font-family: "Avenir Next", Avenir, "Gill Sans", sans-serif;
        color: var(--ink);
        background: var(--paper);
        scroll-behavior: smooth;
      }
      * { box-sizing: border-box; }
      ::selection { color: var(--paper); background: var(--blue); }
      html { min-width: 320px; }
      body { margin: 0; overflow-x: hidden; background: var(--paper); }
      a { color: inherit; text-decoration-thickness: 2px; text-underline-offset: 4px; }
      a:focus-visible, button:focus-visible { outline: 4px solid var(--blue); outline-offset: 4px; }
      .sheet { width: min(1440px, 100%); margin: 0 auto; overflow: hidden; }
      .topline { display: flex; justify-content: space-between; align-items: center; min-height: 72px; padding: 0 var(--space); border-bottom: 1px solid var(--ink); font-weight: 800; }
      .brand { font-size: 19px; letter-spacing: -.02em; text-decoration: none; }
      .brand, h1, h2, h3, .action { font-family: "Unbounded", sans-serif; }
      .topline nav { display: flex; gap: 24px; align-items: center; font-size: 14px; }
      .topline nav a { text-decoration: none; }
      .status { display: inline-flex; gap: 8px; align-items: center; font-variant-numeric: tabular-nums; }
      .status::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: #258a4b; }
      .hero { position: relative; min-height: 790px; padding: clamp(58px, 8vw, 118px) var(--space) 70px; border-bottom: 1px solid var(--ink); isolation: isolate; }
      .hero::before { content: ""; position: absolute; z-index: -2; inset: 0 0 auto auto; width: 44%; height: 68%; background-color: var(--red); background-image: radial-gradient(rgba(23,23,23,.3) 1px, transparent 1.5px); background-size: 8px 8px; clip-path: polygon(16% 0, 100% 0, 100% 100%, 0 78%); }
      .hero::after { content: ""; position: absolute; z-index: -1; width: 46%; aspect-ratio: 1.45; right: 5%; top: 28%; background: var(--blue); mix-blend-mode: multiply; transform: rotate(-7deg); }
      h1 { max-width: 1180px; margin: 0; font-size: clamp(60px, 9vw, 132px); line-height: .84; letter-spacing: -.04em; font-weight: 900; text-wrap: balance; }
      h1 span { display: table; margin-left: clamp(0px, 8vw, 120px); padding: .08em .08em .16em; color: var(--blue); background: var(--paper); }
      .hero-copy { position: relative; z-index: 2; width: min(640px, 70%); margin: 74px 0 0 clamp(0px, 25vw, 380px); padding: 26px 28px 30px; background: var(--paper); border-top: 3px solid var(--ink); border-bottom: 1px solid var(--ink); }
      .hero-copy p { margin: 0 0 26px; font-size: clamp(20px, 2.3vw, 32px); line-height: 1.22; letter-spacing: -.02em; }
      .action { display: inline-flex; align-items: center; min-height: 52px; padding: 0 20px; border: 2px solid var(--ink); background: var(--ink); color: var(--paper); text-decoration: none; font-weight: 850; transition: transform .18s ease-out, background .18s ease-out, color .18s ease-out; }
      .action:hover { transform: translateY(-3px); background: var(--blue); }
      .proof-marks { position: absolute; left: var(--space); bottom: 24px; display: flex; gap: 18px; align-items: center; font: 700 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; }
      .crosshair { width: 22px; height: 22px; border: 1px solid var(--ink); border-radius: 50%; position: relative; }
      .crosshair::before, .crosshair::after { content: ""; position: absolute; background: var(--ink); }
      .crosshair::before { left: 10px; top: -5px; width: 1px; height: 30px; }
      .crosshair::after { left: -5px; top: 10px; width: 30px; height: 1px; }
      .mechanism { display: grid; grid-template-columns: .72fr 1.28fr; min-height: 720px; border-bottom: 1px solid var(--ink); }
      .section-copy { padding: 78px var(--space); border-right: 1px solid var(--ink); }
      h2 { max-width: 780px; margin: 0 0 28px; font-size: clamp(46px, 7vw, 96px); line-height: .92; letter-spacing: -.04em; }
      .section-copy > p { max-width: 52ch; margin: 0; color: var(--muted); font-size: 19px; line-height: 1.55; }
      .conversation { display: flex; flex-direction: column; justify-content: center; gap: 0; padding: 58px var(--space); background: var(--ink); color: var(--paper); }
      .turn { display: grid; grid-template-columns: 110px 1fr; gap: 22px; padding: 24px 0; border-top: 1px solid rgba(243,234,214,.3); }
      .turn:last-child { border-bottom: 1px solid rgba(243,234,214,.3); }
      .speaker { color: #ff9c86; font: 700 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: .08em; }
      .turn:nth-child(even) .speaker { color: #9ab0ff; }
      .turn p { margin: 0; font-size: clamp(17px, 2vw, 25px); line-height: 1.35; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .88em; }
      .confirm { display: inline-block; margin-top: 12px; padding: 8px 10px; color: var(--ink); background: #ffb9a9; font-weight: 800; }
      .path { padding: 88px var(--space) 104px; border-bottom: 1px solid var(--ink); }
      .steps { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 58px; border-top: 1px solid var(--ink); }
      .step { min-height: 280px; padding: 28px 30px 34px 0; border-bottom: 1px solid var(--ink); }
      .step + .step { padding-left: 30px; border-left: 1px solid var(--ink); }
      .step strong { display: block; margin-bottom: 54px; color: var(--blue); font: 800 15px/1 ui-monospace, SFMono-Regular, Menlo, monospace; }
      .step h3 { margin: 0 0 16px; font-size: 28px; letter-spacing: -.025em; }
      .step p { max-width: 34ch; margin: 0; color: var(--muted); line-height: 1.55; }
      .boundary { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--ink); }
      .boundary > div { padding: 82px var(--space); }
      .boundary > div:first-child { background: var(--blue); color: white; }
      .boundary > div:last-child { background: var(--red); }
      .boundary h2 { font-size: clamp(42px, 5.8vw, 78px); }
      .boundary ul { margin: 44px 0 0; padding: 0; list-style: none; border-top: 1px solid currentColor; }
      .boundary li { display: flex; justify-content: space-between; gap: 18px; padding: 15px 0; border-bottom: 1px solid currentColor; font-weight: 760; }
      .boundary li::after { content: "✓"; }
      .boundary .later li::after { content: "—"; }
      .early { display: grid; grid-template-columns: 1.2fr .8fr; min-height: 540px; }
      .early-main { padding: 90px var(--space); }
      .early h2 { margin-bottom: 34px; }
      .early-main p { max-width: 56ch; color: var(--muted); font-size: 19px; line-height: 1.55; }
      .early-side { display: flex; flex-direction: column; justify-content: space-between; padding: 40px var(--space); border-left: 1px solid var(--ink); background-color: rgba(239,77,54,.08); background-image: radial-gradient(rgba(23,23,23,.32) 1px, transparent 1.5px); background-size: 10px 10px; }
      .early-side .action { align-self: flex-start; font-size: 18px; }
      .early-side { background-image: none; }
      .request-form { display: grid; gap: 20px; margin-top: 24px; }
      .request-form[hidden] { display: none; }
      .request-form label { display: grid; gap: 8px; font-weight: 700; }
      .request-form input:not([type="checkbox"]), .request-form textarea { width: 100%; border: 1px solid var(--ink); border-radius: 0; padding: 14px; background: var(--paper); color: var(--ink); font: inherit; font-size: 18px; caret-color: var(--blue); }
      .request-form textarea { min-height: 120px; resize: vertical; }
      .request-form input:focus-visible, .request-form textarea:focus-visible { outline: 3px solid var(--blue); outline-offset: 3px; }
      .request-form .consent { display: flex; align-items: flex-start; gap: 10px; font-size: 15px; font-weight: 500; line-height: 1.45; }
      .consent input { width: 20px; height: 20px; flex: 0 0 auto; accent-color: var(--blue); }
      .request-form button { cursor: pointer; font-size: 15px; justify-content: center; }
      .request-form button:disabled { opacity: .65; cursor: wait; transform: none; }
      .honeypot { display: none !important; }
      .request-status { font-size: 18px; line-height: 1.5; margin: 18px 0 0; }
      .request-status[data-state="error"] { color: #8b2418; }
      .request-status[data-state="success"] { border-top: 2px solid var(--ink); padding-top: 20px; }
      .release { font: 700 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: .06em; }
      footer { display: flex; justify-content: space-between; gap: 28px; padding: 24px var(--space); border-top: 1px solid var(--ink); font-size: 13px; }
      @media (max-width: 820px) {
        .topline nav a:not(.status) { display: none; }
        .hero { min-height: 720px; }
        .hero::before { width: 62%; height: 48%; }
        .hero::after { width: 62%; top: 33%; right: -12%; }
        h1 { font-size: clamp(54px, 13vw, 92px); }
        h1 span { margin-left: 0; }
        .hero-copy { width: min(590px, 94%); margin: 210px 0 0; }
        .mechanism, .boundary, .early { grid-template-columns: 1fr; }
        .section-copy { border-right: 0; border-bottom: 1px solid var(--ink); }
        .steps { grid-template-columns: 1fr; }
        .step + .step { padding-left: 0; border-left: 0; }
        .early-side { min-height: 320px; border-left: 0; border-top: 1px solid var(--ink); }
      }
      @media (max-width: 520px) {
        .topline { min-height: 60px; }
        .topline nav { gap: 10px; }
        .status { font-size: 0; }
        .hero { min-height: 680px; padding-top: 54px; }
        h1 { max-width: 100%; font-size: 9.5vw; line-height: .88; }
        .hero-copy { width: 100%; margin-top: 190px; padding: 20px 0 24px; }
        .proof-marks { display: none; }
        .turn { grid-template-columns: 1fr; gap: 8px; }
        .section-copy, .conversation, .path, .boundary > div, .early-main { padding-top: 60px; padding-bottom: 64px; }
        footer { flex-direction: column; }
      }
      @media (prefers-reduced-motion: reduce) {
        :root { scroll-behavior: auto; }
        *, *::before, *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
      }
    </style>
  </head>
  <body>
    <div class="sheet">
      <header class="topline">
        <a class="brand" href="#top">ВайбХостинг</a>
        <nav aria-label="Основная навигация">
          <a href="#how">Как работает</a>
          <a href="#scope">Что умеет</a>
          <a class="status" href="#early-access">ранний доступ</a>
        </nav>
      </header>
      <main id="top">
        <section class="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">Написал.<span>Опубликовал.</span></h1>
          <div class="hero-copy">
            <p>Подключаете MCP к AI-агенту. Получаете понятный план. Подтверждаете — и забираете работающий публичный адрес.</p>
            <a class="action" href="#early-access">Получить ранний доступ</a>
          </div>
          <div class="proof-marks" aria-hidden="true"><span class="crosshair"></span><span>Написал. Подтвердил. Опубликовал.</span><span>proof / 001</span></div>
        </section>

        <section class="mechanism" id="how" aria-labelledby="mechanism-title">
          <div class="section-copy">
            <h2 id="mechanism-title">Деплой становится разговором.</h2>
            <p>Не панель с сотней настроек и не набор команд из чужого README. Агент видит проект, объясняет границы и действует только после точного подтверждения.</p>
          </div>
          <div class="conversation" aria-label="Пример публикации через MCP">
            <div class="turn"><span class="speaker">Вы</span><p>Опубликуй этот проект.</p></div>
            <div class="turn"><span class="speaker">ВайбХостинг</span><p>Нашёл stateless HTTP-приложение: корневой <code>Dockerfile</code>, порт 8080, <code>/health</code>. Подготовил изолированный релиз.</p></div>
            <div class="turn"><span class="speaker">План</span><p>Загрузить готовый образ по неизменяемому digest → запустить контейнер → проверить health check и HTTPS → сохранить предыдущую версию для отката.</p></div>
            <div class="turn"><span class="speaker">Подтверждение</span><p>Выполнить только этот план.<br><span class="confirm">DEPLOY plan_0123456789abcdef</span></p></div>
            <div class="turn"><span class="speaker">Результат</span><p>Готово. Приложение отвечает по публичному адресу, проверка прошла.</p></div>
          </div>
        </section>

        <section class="path" aria-labelledby="path-title">
          <h2 id="path-title">Три шага вместо новой профессии.</h2>
          <div class="steps">
            <article class="step"><strong>INPUT</strong><h3>Подключите проект</h3><p>Передайте манифест и готовый публичный образ в GHCR. Сборку агент готовит отдельно: сервис пока не собирает код из Git.</p></article>
            <article class="step"><strong>CONFIRM</strong><h3>Увидьте точный план</h3><p>Что будет запущено, как проверится новая версия и что останется для отката — до первого изменения.</p></article>
            <article class="step"><strong>LIVE</strong><h3>Получите адрес</h3><p>Успехом считается не завершившийся скрипт, а живой HTTPS-адрес с прошедшим health check.</p></article>
          </div>
        </section>

        <section class="boundary" id="scope" aria-label="Границы первой версии">
          <div>
            <h2>Что уже входит.</h2>
            <ul><li>Stateless HTTP</li><li>Готовый образ по digest</li><li>Один публичный порт</li><li>Health check</li><li>Регистрация через MCP</li></ul>
          </div>
          <div class="later">
            <h2>Что пока оставляем людям.</h2>
            <ul><li>Базы и миграции</li><li>Persistent volumes</li><li>Собственные домены</li><li>Секреты приложения</li><li>Автооткат временно недоступен: обновляем раннер</li></ul>
          </div>
        </section>

        <section class="early" id="early-access" aria-labelledby="early-title">
          <div class="early-main">
            <h2 id="early-title">Получить ранний доступ.</h2>
            <p>Оставьте заявку — напишем вам и обсудим, как развернуть ваш проект. Открываем доступ небольшими группами и сначала проверяем сервис вместе с авторами приложений.</p>
            <p>Для первой попытки понадобится одноразовое приглашение, публичный Git-репозиторий, готовый публичный образ в GHCR и health endpoint. Регистрация — через MCP, без сайта. Пилот: один проект, 256 МБ памяти и 0,5 CPU на аккаунт; доступ на семь дней.</p>
            <p><a href="/downloads/vibehosting-mcp.mjs" download>Скачать MCP-клиент</a> · Нужен Node.js 24. <a href="https://github.com/InnokentyB/LLMDevOpsDemoApp#подключение-mcp-для-участников">Инструкция подключения</a></p>
          </div>
          <div class="early-side">
            <span class="release">release ${releaseVersion}<br>вайбхостинг.рф</span>
            <form id="early-access-form" class="request-form">
              <label for="request-name">Как вас зовут<input id="request-name" name="name" autocomplete="name" maxlength="120" required></label>
              <label for="request-email">Email для ответа<input id="request-email" name="email" type="email" autocomplete="email" maxlength="254" required></label>
              <label for="request-message">Что хотите развернуть? <small>Необязательно. Не указывайте пароли и ключи.</small><textarea id="request-message" name="message" maxlength="2000"></textarea></label>
              <label class="honeypot" aria-hidden="true">Ваш сайт<input name="website" tabindex="-1" autocomplete="off"></label>
              <label class="consent"><input name="consent" type="checkbox" required>Разрешаю передать имя, email и описание проекта в CRM команды ВайбХостинга для ответа по этой заявке. Без подписки на рассылку.</label>
              <button class="action" type="submit">Отправить заявку</button>
            </form>
            <p id="request-status" class="request-status" role="status" aria-live="polite" tabindex="-1"></p>
            <noscript>Для отправки заявки включите JavaScript в браузере.</noscript>
          </div>
        </section>
      </main>
      <footer><span>ВайбХостинг — MCP-native публикация приложений.</span><span>Написал. Подтвердил. Опубликовал.</span></footer>
    </div>
    <script src="/assets/early-access.js" defer></script>
  </body>
</html>`;
}
