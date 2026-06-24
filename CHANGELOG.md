# Webentor Core Changelog

## 0.15.2

- **Preserve text alignment on core blocks under WordPress 7.0.** WP 7.0 moved Paragraph's "Align text" control into `supports.typography.textAlign`, which the `disableTypography` filter was wiping by nulling the whole typography object. The filter now keeps `textAlign` and strips only the rest, so Paragraph/Heading keep alignment while native typography stays hidden. No consumer migration needed.

## 0.15.1

- **Fix focal-point cropping in responsive `<source srcset>`.** `get_resized_image_object()` re-derived its `src` via `bis_get_attachment_image_src()` without the `$crop` flag, so Better Image Sizes never read the attachment's `focal_point` meta for the srcset — the `<picture>` `<source>` entries (1x/2x) loaded the center-fit file while only the fallback `<img>` honored the focal point. It now passes `$crop` through, matching `get_resized_image_url()`, so focal-point crops apply at every breakpoint. Also stops generating the redundant crop-less duplicate file. No API change for consumers.

## 0.15.0

- **Vite 8 / Rolldown build toolchain.** Migrate the package build from Vite 7 to Vite 8 (Rolldown). Editor, app, and slider bundles are rebuilt under Rolldown; the manifest contract is unchanged, so consumers consume assets exactly as before.
- **Shared WordPress externals interop.** The `@wordpress/*` → `wp.*` / React externalization now comes from `@webikon/webentor-configs/vite` (`wordpressExternals(command)`, requires `@webikon/webentor-configs` `^1.1.0`). It's **hybrid per command**: roots `wordpressPlugin()` + interop shims for `build`, kucrut `wp_scripts()` for the dev server (`serve`).
- **Editor interop fixes for Rolldown.** Rolldown otherwise broke the block editor two ways — it preserved a CJS `require()` of the `@wordpress/*` externals, and mis-bound the ESM `import * as React`. Fixed with a `generateBundle` require-shim for `@wordpress` and by aliasing `react`/`react-dom`/`jsx-runtime` to the `window.*` CJS shims. The editor works fully on Vite 8.
- Dev-tooling bumps: `vite` 8, `@roots/vite-plugin` 2.2.0, `@vitejs/plugin-react` 6 (devDependencies; no runtime/API change for consumers).
- **Consumer migration**: the dependency bumps, the `resources/scripts/app.ts` static-asset `import.meta.glob` change, and the `vite.config.js` externals rewrite apply to consumer theme code. Run `pnpm dlx @webikon/webentor-codemods run 0.15.0` (dry-run), then `--apply`; the `vite.config.js` change is a documented manual step. See `@webikon/webentor-codemods`.

## 0.14.1

- Republish of 0.14.0 with the Vite 7 toolchain. 0.14.0 inadvertently shipped an in-progress Vite 8 / Rolldown migration (devDependency bumps + Rolldown-built assets). There is no runtime or API change for consumers — devDependencies are not installed by consumers and the bundle output is equivalent — but 0.14.1 restores a consistent Vite 7 build. Prefer 0.14.1 over 0.14.0.

## 0.14.0

- Make `l-section` background settings extensible, mirroring the button extension pattern.
  - **New overlay feature (first-class)**: enable an overlay with opacity + color from the block's "Background Image Settings" panel. Renders a `.w-section-overlay` element with a `w-section--has-overlay` class on the `<section>`. Color/opacity are piped through the `--w-section-overlay-color` / `--w-section-overlay-opacity` CSS custom properties, so consumers can override the variables or the whole `.w-section-overlay` rule in CSS. Fixes a latent issue where the editor drew a fixed `bg-black opacity-20` overlay that never rendered on the frontend — the preview now reflects the actual setting.
  - **New editor (JS) filters** for injecting custom controls into the background panel: `webentor.core.l-section.bgSettingsBefore` and `webentor.core.l-section.bgSettingsAfter` (signature `(node, props)`; return a React node). Controls store data on the free-form `bgSettings` block attribute via `setAttributes`.
  - **New frontend (PHP) filters**: `webentor/l-section/section_classes` (append classes to the `<section>`, e.g. for variants), `webentor/l-section/overlay` (override the overlay markup), and `webentor/l-section/inner_start` (inject markup at the start of the section). Each receives `($value, $attributes, $block)`.
  - See the docs guide "Extend Section Background" (`docs/src/guides/extend-l-section.md`) for a consumer variant-dropdown example.
- Fix `l-section` "Hidden" responsive display: because the section splits classes between the `<section>` wrapper and the inner container, a `display:none` value previously landed on the inner container and only hid the content — the background image, overlay, and spacing still rendered. Hide tokens (`hidden` / `{bp}:hidden`) now apply to the `<section>` wrapper so the whole section is hidden; other display values (flex/grid/block) stay on the inner container. The editor preview dims the whole section when hidden.
- Consolidate all `l-section` z-index into the block's `style.css` (keyed by `.w-section-img`, `.w-section-overlay`, `.w-section--has-overlay .w-section-inner`) instead of scattered `wbtr:z-[*]` utilities in the editor component and Blade view.

## 0.13.0

- WordPress 7.0 / PHP 8.4 compatibility: resolve block-editor deprecation notices surfaced by the iframed editor and the newer `@wordpress/*` runtime.
  - Add `apiVersion: 3` to `l-nav-menu`, `l-mobile-nav`, and `l-site-logo` blocks (they use `useBlockProps`, which requires API v2+; fixes the "API version 1 / iframe editor" warnings).
  - Enqueue core editor styles on `enqueue_block_assets` (guarded by `is_admin()`) instead of `enqueue_block_editor_assets`, so WordPress routes them into the editor iframe correctly (fixes "added to the iframe incorrectly"). Styles still stay off the public frontend.
  - Refactor the `e-gallery` block toolbar to use `ToolbarButton` (via `MediaUpload`'s render prop) instead of custom components wrapped in `ToolbarItem` (deprecated since 5.6).
- Update dependencies to latest stable: `@wordpress/*` (block-editor/blocks 15.21, components 35, block-library 9.48, i18n 6.21, icons 14, dependency-extraction 6.48), `@10up/block-components` 1.22.2 (resolves the `getMedia` deprecation), `swiper` 12.2, `alpinejs`/`@alpinejs/collapse` 3.15.12.
- Update dev tooling, including majors: `stylelint` 17 + `stylelint-config-recommended` 18, `@types/wordpress__block-editor` 15, `prettier-plugin-tailwindcss` 0.8, plus `typescript-eslint` 8.61, `prettier` 3.8, `postcss` 8.5, `tailwindcss` 4.3. (ESLint 10, React 19, Vite 8, TypeScript 6 and lint-staged 17 are intentionally held — incompatible peers / runtime constraints.)
- **Consumer migration**: the editor-asset enqueue change applies to consumer theme code too (`app/setup.php`), as do the dependency bumps. Run the codemod from your project root: `pnpm dlx @webikon/webentor-codemods run 0.13.0` (dry-run), then `--apply`. See `@webikon/webentor-codemods`.

## 0.12.0

- **BREAKING**: Remove `init.php` entry point. Bootstrap logic (constant defines, optional vendor autoload, core app file requires) moved into `WebentorCoreServiceProvider`. Acorn auto-discovery handles loading — consumer themes must no longer manually `require_once WEBENTOR_CORE_PHP_PATH . '/init.php'` from `functions.php`.
  - Migration: delete the `require_once WEBENTOR_CORE_PHP_PATH . '/init.php'` line from your theme's `functions.php`. Keep the `WEBENTOR_CORE_PHP_PATH` define — it's still consumed by `config/view.php` to register core view paths. Then run `composer update webikon/webentor-core && wp acorn optimize:clear`.

## 0.11.0

- Add responsive spacing settings for WP Core blocks (`core/paragraph`, `core/heading`) — spacing panel appears automatically, classes rendered on frontend via `WP_HTML_Tag_Processor`
  - Filterable block list: JS `webentor.core.wpCoreBlocksWithSpacing`, PHP `webentor/wp_core_blocks_with_spacing`
  - Native WP spacing controls disabled on affected blocks to avoid duplication
- Fix React hooks warning ("Do not call Hooks inside useEffect") caused by `generateClassNames` being called outside React component context via `blocks.getSaveContent.extraProps`
- Fix WP Core blocks breaking after save/refresh — `classNameGenerator` no longer injects responsive classes into saved markup, preventing block validation failures on static blocks
- Fix `l-section` responsive settings not splitting classes between wrapper and inner container in editor (layout/flexbox/grid classes now correctly apply to the inner container, matching frontend behavior)
- Add `WebentorCoreServiceProvider` — Acorn auto-discovered service provider for webentor-core
  - Blade directives (`@sliderContent`, `@enqueueScripts`, `@xdebugBreak`) moved from theme to core
  - View Components (`Button`, `Slider`) moved from theme to core — themes can override by extending `Webentor\Core\View\Components\Button` etc.
  - Core block `data.php` files now loaded by the service provider instead of `ThemeServiceProvider`

## 0.10.1

- Fix `l-section` inner z-index

## 0.10.0

- Refactor responsive settings and improve UX
  - **BREAKING**: Run keys migrator from `Settings -> Webentor Migrator`
  - **BREAKING**: Attributes keys changed, so supports in `block.json` and other usage in theme needs to be checked and renamed:
    - `flexboxItem` -> `flexItem`
    - `display` -> `layout` (for `display`) and `sizing` (for `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`)
  - Added reset buttons for breakpoints
  - Better values grouping
  - Better cascade breakpoints conditioning
  - Spacing linking
- Add `webentor/block_wrapper_class_properties` filter to exclude generated class groups such as `backgroundColor` and `textColor` from filtered `classes_by_property` and wrapper output, while keeping the raw generated map available for `block_custom_classes`
- Add Wrap with Flexible container
- Add applied classes viewer to see which responsive classes are applied
- Add Quick layout presets, customizable with filter `webentor.core.responsiveSettings.layoutPresets`
- Fix PHP path in `init.php`
- Add package module exports, you can now use `@webikon/webentor-core` instead of `@webentorCore` when importing in the theme
- Add `webentor.core.l-section.output` filter to customize the section editor preview markup


## 0.9.14

- Fix Button link display
- Disable auto sizes styles for images

## 0.9.13

- Fix CSS formatting (quote style normalization, multiline transitions, selector indentation)

## 0.9.12

- Add `webentor.core.button.output` filter
- Allow picking up multiple post types in Query Loop block
- Add e-button HTML Element setting
- Fix webentorConfig safelist
- Fix image object-fit defaults
- Fix useParentBlock hook to get proper parent block
- Adjust responsive settings to be conditioned by parent block
- Fix Table block cell colspan
- Fix button url escaping & show conditional
- Fix Vite blocks build on Windows Herd
- **BREAKING**: Fix accordion collapse animation - if you customized accordion blade view, adjust its content wrapper
- Fix l-404 block button
- Fix $anchor passed variable in inner blocks

## 0.9.11

- Fix husky install
- Add missing `wbtr:` prefixes in blocks edit
- Fix rendering in REST API request
- Refactor custom size settings into separate React component
- Improve block classes rendering conditions
- Improve block assets registering, so they can be overriden in the theme
- Allow picking up multiple post types in Picker Query Loop block
- NEW: Add basic `webentor-config`, which can be included in the theme, export `spacing`
- NEW: Add flexbox, grid and background image settings to **Section block**
- NEW: Add `webentor/e-gallery` block
- NEW: Add hooks `webentor/skip_render_block_blade` and `webentor/slider/view/swiper_params`
- NEW: Add `loop` and `slider_id` settings to **Slider block**
- NEW: Add flex/grid item order settings
- NEW: Add JS events `e_tabs_nav_initialized`, `e_tabs_nav_item_clicked`, `e_accordion_btn_clicked`
- NEW: Add components BEM classes
- NEW: Add `aspect-ratio` settings to `e-image` block.
  - **BREAKING**: Add `aspect-ratio` config to `webentor-config.ts`
- **BREAKING:**: Change view paths for Blade `blocks` and `core-components`. Now these folder names doesn't need to be included in the path when including views from them.
  - Replace `core-components.button.button` and `core-components.slider.slider` with `button.button` and `slider.slider`
  - If you included blocks as `blocks.blockName.view`, remove `blocks.` and leave just `blockName.view`
- Fix slider pagination styles
- Update deps
- Fix publicDir Vite error
- Remove Button asPill parameter

## 0.9.10

- Add ability to select icon in Button Block
- Fix condition to render flex/grid item classes depending on parent display setting

## 0.9.9

- **BREAKING:** Move slider styles to `@layer components`
- Add more slider view classes
- Remove empty styles folders
- Add opacity to hidden FC blocks instead of hiding them entirely

## 0.9.8

- Add `pnpm`
- Update node deps
- **BREAKING:** Rename npm package to `@webikon/webentor-core`
- **BREAKING:** Include `build/` assets

## 0.9.7

- Fix empty content in WP REST API response

## 0.9.6

- Add Icon Picker block
- Update deps

## 0.9.5

- Add new border & border radius responsive settings, applied to Flexible Content, Section and Image
- Add Picker Query Loop block
- (BREAKING) Remove old Image block border and rounded setting which are replaced by border responsive settings

## 0.9.4

- Bundle `core-js` package
- Add Button component extension hooks
- Add Vite build plugin
- Update deps
