# Webentor Core Changelog

## DEV

- Fix husky install
- Add missing `wbtr:` prefixes in blocks edit
- Fix rendering in REST API request
- NEW: Add flexbox, grid and background image settings to **Section block**
- NEW: Add hooks `webentor/skip_render_block_blade` and `webentor/slider/view/swiper_params`
- NEW: Add `loop` and `slider_id` settings to **Slider block**
- NEW: Add flex/grid item order settings
- NEW: Add JS events `e_tabs_nav_initialized`, `e_tabs_nav_item_clicked`, `e_accordion_btn_clicked`
- NEW: Add components BEM classes
- **BREAKING:**: Change view paths for Blade `blocks` and `core-components`. Now these folder names doesn't need to be included in the path when including views from them.
  - Replace `core-components.button.button` and `core-components.slider.slider` with `button.button` and `slider.slider`
  - If you included blocks as `blocks.blockName.view`, remove `blocks.` and leave just `blockName.view`

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
