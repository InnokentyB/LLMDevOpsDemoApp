import assert from 'node:assert/strict';
import test from 'node:test';

import { createDemoServer, readPort, readReleaseVersion } from '../src/app.js';

async function request(server, path) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`);
    return {
      status: response.status,
      contentType: response.headers.get('content-type'),
      body: await response.text(),
    };
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test('GET / renders the LLMDevOps demo and its release version', async () => {
  const response = await request(createDemoServer({ RELEASE_VERSION: 'workshop-2026.10.10' }), '/');

  assert.equal(response.status, 200);
  assert.match(response.contentType, /^text\/html; charset=utf-8$/);
  assert.match(response.body, /LLMDevOps Demo/);
  assert.match(response.body, /workshop-2026\.10\.10/);
});

test('GET /health returns a small healthy JSON response', async () => {
  const response = await request(createDemoServer({}), '/health');

  assert.equal(response.status, 200);
  assert.match(response.contentType, /^application\/json; charset=utf-8$/);
  assert.deepEqual(JSON.parse(response.body), { status: 'ok' });
});

test('unknown paths return JSON 404 without exposing internals', async () => {
  const response = await request(createDemoServer({}), '/missing');

  assert.equal(response.status, 404);
  assert.deepEqual(JSON.parse(response.body), { error: 'not_found' });
});

test('release version accepts a bounded public identifier and rejects unsafe input', () => {
  assert.equal(readReleaseVersion({ RELEASE_VERSION: 'release-1.2.3_rc1' }), 'release-1.2.3_rc1');
  assert.equal(readReleaseVersion({ RELEASE_VERSION: '<script>alert(1)</script>' }), 'local');
  assert.equal(readReleaseVersion({ RELEASE_VERSION: 'x'.repeat(65) }), 'local');
  assert.equal(readReleaseVersion({}), 'local');
});

test('port defaults to 8080 and accepts only an unprivileged TCP port', () => {
  assert.equal(readPort({}), 8080);
  assert.equal(readPort({ PORT: '9090' }), 9090);
  assert.throws(() => readPort({ PORT: '80' }), /PORT/);
  assert.throws(() => readPort({ PORT: 'not-a-port' }), /PORT/);
});
