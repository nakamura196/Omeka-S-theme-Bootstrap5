# Contributing to Omeka-S-theme-Bootstrap5

Thank you for your interest in this theme! Bug reports, feature ideas, translations and pull requests are all welcome.

Issues, pull requests and commit messages are written in English so that everyone can follow them. If English is difficult for you, you may write in Japanese (日本語でも構いません).

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Reporting bugs

Open an issue with the **Bug report** template. Please include:

- The theme version, the Omeka S version and the PHP version
- A public page where the problem can be seen, if there is one
- What you expected and what happened instead
- Errors from the Omeka S log or the browser console, and the modules enabled on the site

Questions about Omeka S itself are better asked on the [Omeka forums](https://forum.omeka.org/).

## Suggesting features

Open an issue with the **Feature request** template. Describe the use case first (what kind of site, what visitors or editors should be able to do), then the feature you have in mind.

## Reporting security issues

Please do not open a public issue. See [SECURITY.md](SECURITY.md).

## Development

Requirements: [DDEV](https://ddev.com/) with Docker, and python3 with `requests` and `playwright`.

```bash
git clone https://github.com/nakamura196/Omeka-S-theme-Bootstrap5.git
cd Omeka-S-theme-Bootstrap5
zsh scripts/dev/setup.zsh
```

The script starts Omeka S 4.2.1 under `.dev/`, links this repository in as a theme (edits show up at once), and copies a few public items from a live site through its read-only API. See the comments at the top of the script.

If you change a template copied from Omeka S core, keep the change small and close to the core template, so that later core updates can be merged. The first commit of the version 3 history holds the core templates as they are; `git log -p -- view/<path>` shows what the theme changed.

Before opening a pull request, check that the templates have no PHP syntax errors and that the translation compiles. CI runs the same checks:

```bash
find view -name '*.phtml' -print0 | xargs -0 -n1 php -l
msgfmt --check -o language/ja.mo language/ja.po
```

## Translations

User-visible text goes through `$this->translate()`. When you add or change such text, add the Japanese to `language/ja.po` and compile `language/ja.mo` with the `msgfmt` command above. If you cannot write Japanese, say so in the pull request and the maintainer will add it.

New translations (other languages) are welcome as `language/<locale>.po` and `.mo`.

## Pull requests

1. Fork the repository and create a branch from `main` (for example `fix/breadcrumb-item-set` or `feat/citation-style`).
2. Keep each pull request focused on one change.
3. Write the title and description in English. Explain what changes for site visitors or admins, then how it is implemented.
4. If you add a setting to `config/theme.ini`, give it a default so that existing sites keep working.
5. Add an entry to `CHANGELOG.md` under "Unreleased".

## Commit messages

Use a short English summary in the imperative mood on the first line (for example `Fix breadcrumbs on media pages`), followed by a blank line and details if needed. Reference issues as `#123`.

## License

By contributing, you agree that your contributions will be licensed under the [GPLv3](LICENSE).
