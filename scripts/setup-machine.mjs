import { spawnSync } from 'node:child_process';
import {
  existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync,
  realpathSync, renameSync, symlinkSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = fileURLToPath(new URL('..', import.meta.url));
const marketplace = 'personal-agents';

export function setupMachine({
  repoRoot = repository, homeDir = homedir(),
  claudeDir = process.env.CLAUDE_CONFIG_DIR || join(homeDir, '.claude'),
  run, log = console.log,
} = {}) {
  run ??= (app, args) => {
    const result = spawnSync(app, args, { cwd: repoRoot, encoding: 'utf8' });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${app} ${args.join(' ')} failed:\n${result.stderr || result.stdout}`);
    return result.stdout;
  };

  let backupRoot;
  let linked = 0;
  for (const name of readdirSync(join(repoRoot, 'skills')).sort()) {
    const source = join(repoRoot, 'skills', name);
    if (!existsSync(join(source, 'SKILL.md'))) continue;
    for (const agent of ['.agents', '.claude']) {
      const target = join(agent === '.claude' ? claudeDir : join(homeDir, agent), 'skills', name);
      let occupied = false;
      try {
        lstatSync(target);
        occupied = true;
        if (realpathSync(target) === realpathSync(source)) continue;
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }

      let backup;
      if (occupied) {
        const backups = join(homeDir, '.agents', '.machine-backups');
        mkdirSync(backups, { recursive: true });
        backupRoot ??= mkdtempSync(join(backups, 'setup-'));
        backup = join(backupRoot, agent, name);
        mkdirSync(dirname(backup), { recursive: true });
        renameSync(target, backup);
      }
      mkdirSync(dirname(target), { recursive: true });
      try {
        symlinkSync(source, target, 'junction');
      } catch (error) {
        if (backup && !existsSync(target)) renameSync(backup, target);
        throw error;
      }
      linked++;
    }
  }
  log(`Linked ${linked} skill folders for Codex and Claude Code.`);
  if (backupRoot) log(`Previous folders saved in ${backupRoot}`);

  const skipped = [];
  for (const app of ['codex', 'claude']) {
    let help;
    try {
      help = run(app, ['plugin', '--help']);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    if (!help || !/Usage:\s+\S+\s+plugins?\b/i.test(help)) {
      log(`${app}: install or update the CLI for plugin support, then rerun node scripts/setup-machine.mjs.`);
      skipped.push(app);
      continue;
    }

    const listing = JSON.parse(run(app, ['plugin', 'list', '--json']));
    const installed = app === 'codex' ? listing.installed : listing;
    if (!Array.isArray(installed)) throw new Error(`${app}: unexpected plugin list format.`);
    log(run(app, ['plugin', 'marketplace', 'add', repoRoot]).trim());
    const active = installed.find((plugin) => {
      const id = plugin.pluginId ?? plugin.id ?? '';
      return id.startsWith('ponytail@') && plugin.enabled === true
        && (app === 'codex' || ['user', 'managed'].includes(plugin.scope));
    });
    if (active) {
      log(`${app}: keeping active ${active.pluginId ?? active.id}.`);
      continue;
    }
    const args = app === 'codex'
      ? ['plugin', 'add', `ponytail@${marketplace}`]
      : ['plugin', 'install', `ponytail@${marketplace}`, '--scope', 'user'];
    log(run(app, args).trim());
  }
  log('Restart your agents. Review and trust Ponytail hooks in Codex when prompted.');
  return { backupRoot, linked, skipped };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { skipped } = setupMachine();
    if (skipped.length) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
