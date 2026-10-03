# vibe-lib

My editable skills and pinned skill, plugin, and agent dependencies. `apm.yml` is the installation list; `apm.lock.yaml` records resolved versions and content hashes.

## Install this checkout

Clone this repository to `~/vibe-lib`, outside the global `~/.agents` installation directory:

```sh
brew install apm
cd ~/vibe-lib
apm install --frozen
```

Root `skills/` contains editable source files. APM installs dependencies and personal skills into the selected agents' project directories. Generated directories such as `.agents/skills/`, `.claude/`, `.codex/`, and `apm_modules/` are ignored by Git.

To install the collection globally, run from this checkout:

```sh
apm install --global "$PWD" --target codex,claude,copilot
```

APM keeps global installation metadata under `~/.apm/`. Rerun the global command after editing skills or dependencies. Existing symlink destinations from another installer must be backed up and replaced before APM can use them.

## Install into another repository

From the consuming repository:

```sh
apm install "$HOME/vibe-lib" --target codex,claude
```

After committing and pushing, install a pinned revision from the current GitHub origin:

```sh
apm install ColtHands/.agents#<commit> --target codex,claude
```

The GitHub repository still uses its original name. Change this reference to `ColtHands/vibe-lib#<commit>` after renaming the upstream repository.

Commit the consuming project's manifest and lockfile, then restore with `apm install --frozen`. The collection's manifest pins upstream commits because consumers resolve its dependency declarations rather than inheriting its lockfile.

## Edit personal skills

Create or edit `skills/<name>/SKILL.md`, keeping its `agents/`, `references/`, `scripts/`, and other supporting files alongside it. Match the folder name to the skill's `name` field. Preserve all supporting files when editing or moving a skill.

Register a new source skill for installation in this checkout:

```sh
apm install --dev ./skills/my-skill
```

These local `devDependencies` deploy authored skills when working in this repository. Consumers discover the root `skills/` collection directly, without inheriting the authoring dependencies. After editing, run `apm install` and reinstall the collection in any consumer that needs the changes. Commit source files and any manifest or lockfile changes. Edit source skills rather than generated copies.

## Manage dependencies

Add third-party skills or plugins with immutable refs:

```sh
apm install owner/repo/path/to/skill#<commit>
apm install owner/plugin-repo#<commit>
```

To upgrade a commit pin, change its ref in `apm.yml`, then run `apm install`. `apm update` applies to dependencies following mutable refs. Review and commit the manifest and generated lockfile together; never hand-edit the lockfile.

Verify changes with:

```sh
apm install --frozen
apm audit --ci --no-policy
```

APM deploys portable skills and supported plugin components. Native plugin registration and service authentication are managed separately by each host. Store personal plugins under `plugins/<name>/` and declare them with `apm install ./plugins/<name>`. Keep any native marketplace pins aligned with the corresponding APM dependency.

## Backup snapshots

`vendor/` preserves earlier third-party skill copies and the Ponytail plugin source, including their provenance. It is a recovery archive; active dependencies come from the manifest and lockfile. Preserve its contents, licenses, and attribution.

If an upstream disappears, replace its dependency entry with the local backup path and run `apm install`.

References: [APM dependency workflow](https://microsoft.github.io/apm/consumer/manage-dependencies/), [APM package layouts](https://microsoft.github.io/apm/reference/package-types/).
