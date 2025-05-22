# Webentor Core

Core functionality and useful utilities for Webentor Stack.

This package adds bunch of Gutenberg blocks, extensions, basic styling, etc.

## Requirements

- Sage 10 or 11
- PHP 8.2>=

## Documentation

To use both PHP and JS functionality, library needs to be installed both with Composer and NPM.

### Install as composer package

In Sage theme, add to composer.json:

```
"repositories": [
  {
    "type": "github",
    "url": "https://github.com/webikon/webentor-core.git"
  }
],
```

Then run `composer require webikon/webentor-core:dev-main`

**Important info:**

- Autoloader is not working right now, so this package needs to be included manually

### Install as node package

In Sage theme, run `yarn add -D webikon/webentor-core`

**Important info:**

- Package is not bundled yet, so theme has to have Typescript aliases configured for import to work properly

### How to develop

Run `composer install` and `yarn` to download dependencies.
Run `yarn build`.
Run `yarn dev` to start DEV server.

### Hooks

TODO

Made with <3 by [Webikon](https://webikon.sk)
