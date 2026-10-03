import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setupMachine } from './setup-machine.mjs';

const temporary = realpathSync(mkdtempSync(join(tmpdir(), 'agents-setup-test-')));
try {
  const homeDir = join(temporary, 'home');
  const repoRoot = join(homeDir, '.agents');
  const source = join(repoRoot, 'skills', 'example');
  mkdirSync(source, { recursive: true });
  writeFileSync(join(source, 'SKILL.md'), '---\nname: example\n---\nCurrent skill');
  mkdirSync(join(repoRoot, 'skills', 'not-a-skill'));
  const old = join(homeDir, '.claude', 'skills', 'example');
  mkdirSync(old, { recursive: true });
  writeFileSync(join(old, 'SKILL.md'), 'Previous skill');
  const unrelated = join(homeDir, '.claude', 'skills', 'unrelated');
  mkdirSync(unrelated);
  writeFileSync(join(unrelated, 'SKILL.md'), 'Keep me');
  writeFileSync(join(homeDir, '.claude', 'settings.json'), '{"existing":true}');
  const installed = { codex: [], claude: [] };
  const calls = [];
  const run = (app, args) => {
    calls.push([app, ...args]);
    if (args[1] === '--help') return `Usage: ${app} plugin [options] <command>`;
    if (args[1] === 'list') return JSON.stringify(app === 'codex' ? { installed: installed.codex } : installed.claude);
    if (args[1] === 'marketplace') return 'Marketplace added';
    assert.equal(args[2], 'ponytail@personal-agents');
    if (app === 'codex') installed.codex.push({ pluginId: args[2], enabled: true });
    else {
      assert.deepEqual(args.slice(3), ['--scope', 'user']);
      installed.claude.push({ id: args[2], enabled: true, scope: 'user' });
    }
    return 'Plugin installed';
  };
  const options = { repoRoot, homeDir, run, log() {} };
  const first = setupMachine(options);
  assert.equal(first.linked, 1); // Codex already reads the source at ~/.agents/skills.
  assert.equal(realpathSync(old), source);
  assert.equal(readFileSync(join(first.backupRoot, '.claude', 'example', 'SKILL.md'), 'utf8'), 'Previous skill');
  assert.equal(readFileSync(join(unrelated, 'SKILL.md'), 'utf8'), 'Keep me');
  assert.equal(readFileSync(join(homeDir, '.claude', 'settings.json'), 'utf8'), '{"existing":true}');
  assert.deepEqual(first.skipped, []);
  assert.deepEqual(setupMachine(options), { linked: 0, backupRoot: undefined, skipped: [] });
  assert.equal(calls.filter((call) => ['add', 'install'].includes(call[2])).length, 2);
  assert.equal(calls.filter((call) => call[2] === 'marketplace').length, 4);

  // A clone outside ~/.agents also gets global Codex links; dangling links are backed up.
  const otherHome = join(temporary, 'other home');
  mkdirSync(join(otherHome, '.agents', 'skills'), { recursive: true });
  symlinkSync(join(temporary, 'missing'), join(otherHome, '.agents', 'skills', 'example'), 'junction');
  const unsupported = setupMachine({ ...options, homeDir: otherHome, run(app) {
    if (app === 'codex') throw Object.assign(new Error('Missing executable'), { code: 'ENOENT' });
    return 'Usage: claude [options] [prompt]'; // Older Claude treats "plugin" as a prompt.
  } });
  assert.equal(unsupported.linked, 2);
  assert.equal(realpathSync(join(otherHome, '.agents', 'skills', 'example')), source);
  assert.equal(realpathSync(join(otherHome, '.claude', 'skills', 'example')), source);
  assert.deepEqual(unsupported.skipped, ['codex', 'claude']);
  assert.equal(readdirSync(join(unsupported.backupRoot, '.agents')).length, 1);
  assert.throws(() => setupMachine({ ...options, run() { throw new Error('Permission denied'); } }), /Permission denied/);

  const repository = fileURLToPath(new URL('..', import.meta.url));
  let pinnedSource;
  for (const manifest of ['.claude-plugin/marketplace.json', '.agents/plugins/marketplace.json']) {
    const market = JSON.parse(readFileSync(join(repository, manifest), 'utf8'));
    assert.equal(market.name, 'personal-agents');
    const plugin = market.plugins.find((entry) => entry.name === 'ponytail');
    assert.equal(plugin.source.source, 'url');
    assert.equal(plugin.source.url, 'https://github.com/DietrichGebert/ponytail.git');
    assert.match(plugin.source.sha, /^[a-f0-9]{40}$/);
    pinnedSource ??= plugin.source;
    assert.deepEqual(plugin.source, pinnedSource);
  }
  console.log('Machine setup check passed: backups, reruns, CLI registration, missing apps, pinned plugin sources.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
