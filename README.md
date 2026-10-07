# vibe-lib

My collection of skills and plugins managed with `apm` not to loose them even if original repo is dead.

Everything is configured in `apm.yml`.
Because of a bug apm needs to have a script to globally install skills.

1. `brew install apm`
2. `git clone https://github.com/ColtHands/vibe-lib.git`
3. `cd vibe-lib`
4. `apm install --frozen` - installs devDependencies for local work
5. `apm run install-global` - to install all skills to `~` folder for all harnesses
