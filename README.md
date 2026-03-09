# webentor-core

Reusable Webentor core functionality for PHP and JS runtimes.

## Packages

- Composer: `webikon/webentor-core`
- npm: `@webikon/webentor-core`

## Requirements

- PHP >= 8.2
- Node >= 20
- pnpm >= 10

## Development

```bash
composer install
pnpm install
pnpm build
```

## WP-CLI

Use the responsive attributes migration command on an existing project when you
want to scan or migrate block content without opening the WordPress admin.

```bash
wp webentor migrate-responsive-attributes
wp webentor migrate-responsive-attributes --migrate
wp webentor migrate-responsive-attributes --cleanup
wp webentor migrate-responsive-attributes --site-id=7 --cleanup
```

By default the command only scans and reports how many posts and blocks still
need migration or cleanup. `--migrate` writes v2 attributes while keeping legacy
keys, and `--cleanup` removes the legacy keys after backfilling the v2 shape.
On multisite, `--site-id=<id>` runs the command against a specific site.

## Linting

Core consumes shared presets from `@webikon/webentor-configs` to keep lint behavior aligned across repositories.
