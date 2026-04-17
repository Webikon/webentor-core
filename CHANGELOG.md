# Webentor Core Changelog

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
