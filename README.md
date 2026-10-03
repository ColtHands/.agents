# Personal agent skills and plugins


1. `brew install apm`
2. `git clone https://github.com/ColtHands/.agents.git ~/.agents`
3. `cd ~/.agents`
4. `apm install --frozen`
5. `apm install --global "$PWD" --target codex,claude,copilot --force`


APM keeps user-scope installation state under `~/.apm/`. That is a consumer of this repository, just like any other project. Rerun the global command after editing personal skills or changing dependencies. `--global` supports different components for different agents; check [APM's target matrix](https://microsoft.github.io/apm/reference/targets-matrix/).

When migrating from the Vercel skills CLI, existing `~/.claude/skills/<name>` symlinks may conflict with APM: APM rejects symlink destinations. Preserve those links in a backup before replacing them. The existing global skill copies and links were left intact during this repository migration.

## Install into another repository

From that repository, install the local collection using native APM commands:

```sh
apm install "$HOME/.agents" --target codex,claude
```

After this setup is committed and pushed, it can also be installed directly from Git:

```sh
apm install ColtHands/.agents --target codex,claude
```

APM adds the collection to the consuming project's manifest and creates its lockfile. Commit both. Later restores use `apm install --frozen`. Pin the collection itself with `ColtHands/.agents#<commit>` when you also want to fix the version of personal skills. Upstream dependencies are already pinned in this collection's manifest because consumers resolve its dependency declarations rather than inheriting its lockfile.

## Maintain dependencies and personal skills

Add a dependency with APM; prefer an immutable commit or release ref:

```sh
apm install owner/repo/path/to/skill#<commit-or-tag>
apm install owner/plugin-repo#<commit-or-tag>
```

To upgrade a commit-pinned dependency, change its ref in `apm.yml`, then run `apm install`. `apm update` cannot move an immutable commit pin. For packages deliberately following a tag, branch, or version range, use `apm update`. Review and commit the manifest and generated lockfile together. `apm lock` resolves dependencies without deploying files.

Create or edit personal skills at `.apm/skills/<name>/SKILL.md`, with any `agents/`, `references/`, or `scripts/` alongside it. Run `apm install` to deploy them, then reinstall the collection in any other consumer that needs the changes. Edit these source files rather than installed copies under `skills/` or `.agents/skills/`.

Verify an installed checkout with:

```sh
apm install --frozen
apm audit --ci --no-policy
```

## Native plugins

APM installs the portable skills and supported components from plugin packages. A native host's plugin registration, UI settings, and service authentication have their own lifecycle. For Ponytail's native plugin, the catalogs in this repo pin the same commit as `apm.yml`; keep those pins aligned when upgrading it.

Register the catalog through the host CLI:

```sh
codex plugin marketplace add "$HOME/.agents"
claude plugin marketplace add "$HOME/.agents"
```

Then select `ponytail@personal-agents` in the host's plugin browser. On a CLI that supports direct native installation, use `codex plugin add ponytail@personal-agents` or `claude plugin install ponytail@personal-agents --scope user`. Keep one active native Ponytail installation per host when switching from its upstream marketplace. Restart the host after catalog or plugin changes.

Store personal plugins under `plugins/<name>/` and add them to the appropriate native catalog. An APM-compatible local plugin can also be declared with `apm install ./plugins/<name>`; its files stay in Git.

Plugins and skills bundled with Codex are supplied by Codex. Connector account access and authentication are not portable Git dependencies.

APM 0.32.0 reports Cursor hook event casing warnings for Ponytail 4.10.1. Skill installation and lockfile integrity pass; Cursor hook execution has not been validated.

## Backup snapshots

`vendor/` preserves the pre-migration third-party skill copies and the Ponytail plugin source. It is a recovery archive, not an additional active dependency declaration, and APM does not update it automatically. Current dependency versions come from `apm.yml` and `apm.lock.yaml`.

If an upstream disappears, replace that dependency entry with its local backup path, then run `apm install`. Skill backups have `SKILL.md`; the Ponytail backup contains its package manifest and plugin sources. Preserve upstream licenses and attribution when distributing these snapshots.

References: [APM dependency and lockfile workflow](https://microsoft.github.io/apm/consumer/manage-dependencies/), [Codex skill locations](https://learn.chatgpt.com/docs/build-skills), [OpenAI native plugin marketplaces](https://developers.openai.com/plugins/build/plugins).
