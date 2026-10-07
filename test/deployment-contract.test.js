import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the application has no runtime or development package dependencies', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

  assert.deepEqual(manifest.dependencies ?? {}, {});
  assert.deepEqual(manifest.devDependencies ?? {}, {});
});

test('the container listens on 8080 and drops root privileges', async () => {
  const dockerfile = await readFile(new URL('../Dockerfile', import.meta.url), 'utf8');

  assert.match(dockerfile, /^EXPOSE 8080$/m);
  assert.match(dockerfile, /^USER node$/m);
  assert.match(dockerfile, /^FROM node:24-alpine@sha256:[a-f0-9]{64}$/m);
  assert.doesNotMatch(dockerfile, /npm (?:ci|install)/);
});

test('llmdevops manifest declares the bounded stateless HTTP v1 contract', async () => {
  const manifest = await readFile(new URL('../llmdevops.yaml', import.meta.url), 'utf8');

  assert.match(manifest, /^version: 1$/m);
  assert.match(manifest, /^kind: stateless-http$/m);
  assert.match(manifest, /^  dockerfile: Dockerfile$/m);
  assert.match(manifest, /^  port: 8080$/m);
  assert.match(manifest, /^  healthPath: \/health$/m);
  assert.match(manifest, /^  - RELEASE_VERSION$/m);
  assert.match(manifest, /SOURCE PLACEHOLDER/i);
});

test('CI publishes a commit-addressed image without a mutable latest tag', async () => {
  const workflow = await readFile(new URL('../.github/workflows/publish-image.yml', import.meta.url), 'utf8');

  assert.match(workflow, /packages: write/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /ghcr\.io\/innokentyb\/llmdevops-demo-app:sha-\$\{\{ github\.sha \}\}/);
  assert.doesNotMatch(workflow, /:latest/);
});
