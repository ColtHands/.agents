# Repository ownership

- Use APM for dependencies. Edit `apm.yml` and regenerate `apm.lock.yaml` with native APM commands; never hand-edit the lockfile.
- Personal skills and local forks live in `.apm/skills/`. Preserve supporting files when editing or moving a skill.
- Installed skill folders, agent configuration, and `apm_modules/` are generated output. Keep them out of Git.
- `vendor/` holds backup snapshots, not active dependencies. Preserve their original contents and provenance.
- Keep Ponytail's native marketplace commit pins aligned with its `apm.yml` dependency.
- Verify dependency changes with `apm install --frozen` and `apm audit --ci --no-policy`.
- Prefer native package-manager and host commands over custom setup scripts.
