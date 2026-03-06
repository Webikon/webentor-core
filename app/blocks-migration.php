<?php

namespace Webentor\Core;

/**
 * Global Block Attribute Migrator.
 *
 * Provides a Settings > Webentor Migration admin page with three actions:
 * 1. Scan — count posts/blocks that still use v1 attribute keys
 * 2. Migrate — transform v1 attributes to v2 (mirrors JS migrateV1toV2)
 * 3. Cleanup — remove old v1 keys from already-migrated blocks
 *
 * Migration is processed in batches via AJAX to avoid PHP timeouts.
 * wp_update_post creates revisions automatically, so rollback is possible.
 */

// ── Constants ────────────────────────────────────────────────────────

const SIZING_PROPERTIES = ['height', 'min-height', 'max-height', 'width', 'min-width', 'max-width'];
const LAYOUT_PROPERTIES = ['display'];
const MIGRATION_BATCH_SIZE = 20;

// ── Admin page registration ──────────────────────────────────────────

\add_action('admin_menu', function () {
    add_options_page(
        'Webentor Migration',
        'Webentor Migration',
        'manage_options',
        'webentor-migration',
        __NAMESPACE__ . '\render_migration_page'
    );
});

\add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'settings_page_webentor-migration') {
        return;
    }
    wp_enqueue_style('webentor-migration', false);
    wp_add_inline_style('webentor-migration', get_migration_page_styles());
});

// ── Attribute transformation functions ───────────────────────────────

/**
 * Migrate a single block's attributes from v1 to v2.
 * Mirrors JS migrateV1toV2() in migration.ts.
 *
 * @return array{attrs: array, changed: bool}
 */
function migrate_block_attributes_v1_to_v2(array $attrs): array
{
    $version = $attrs['_responsiveSettingsVersion'] ?? 0;
    if ($version >= 2) {
        return ['attrs' => $attrs, 'changed' => false];
    }

    $changed = false;

    // display.{LAYOUT_PROPERTIES} → layout.*
    // display.{SIZING_PROPERTIES} → sizing.*
    if (!empty($attrs['display']) && is_array($attrs['display'])) {
        $display_data = $attrs['display'];

        $layout_data = [];
        foreach (LAYOUT_PROPERTIES as $prop) {
            if (!empty($display_data[$prop])) {
                $layout_data[$prop] = $display_data[$prop];
            }
        }

        $sizing_data = [];
        foreach (SIZING_PROPERTIES as $prop) {
            if (!empty($display_data[$prop])) {
                $sizing_data[$prop] = $display_data[$prop];
            }
        }

        if (!empty($layout_data)) {
            $attrs['layout'] = array_merge($attrs['layout'] ?? [], $layout_data);
            $changed = true;
        }

        if (!empty($sizing_data)) {
            $attrs['sizing'] = array_merge($attrs['sizing'] ?? [], $sizing_data);
            $changed = true;
        }
        // Old display key kept for backward compat (cleaned up separately)
    }

    // flexboxItem → flexItem
    if (!empty($attrs['flexboxItem'])) {
        $attrs['flexItem'] = $attrs['flexboxItem'];
        $changed = true;
    }

    if ($changed || !empty($attrs['display']) || !empty($attrs['flexboxItem'])) {
        $attrs['_responsiveSettingsVersion'] = 2;
        $changed = true;
    }

    return ['attrs' => $attrs, 'changed' => $changed];
}

/**
 * Remove v1 keys from block attributes.
 * Runs migration first (no-op if already v2) to guarantee v2 keys
 * are populated before the old ones are stripped.
 *
 * This makes cleanup self-contained — it works regardless of whether
 * the separate migration step was run beforehand.
 *
 * @return array{attrs: array, changed: bool}
 */
function cleanup_v1_keys(array $attrs): array
{
    if (!isset($attrs['display']) && !isset($attrs['flexboxItem'])) {
        return ['attrs' => $attrs, 'changed' => false];
    }

    // Ensure v2 keys exist before we strip v1 keys
    $migrate_result = migrate_block_attributes_v1_to_v2($attrs);
    $attrs = $migrate_result['attrs'];
    $changed = $migrate_result['changed'];

    if (isset($attrs['display'])) {
        unset($attrs['display']);
        $changed = true;
    }

    if (isset($attrs['flexboxItem'])) {
        unset($attrs['flexboxItem']);
        $changed = true;
    }

    return ['attrs' => $attrs, 'changed' => $changed];
}

// ── Block tree walker ────────────────────────────────────────────────

/**
 * Recursively walk a parsed block tree and apply a transform callback
 * to each block's attrs. Returns the modified tree and a count of changed blocks.
 *
 * @param array    $blocks    Output of parse_blocks()
 * @param callable $transform fn(array $attrs): array{attrs: array, changed: bool}
 * @return array{blocks: array, changed_count: int}
 */
function walk_blocks_and_transform(array $blocks, callable $transform): array
{
    $changed_count = 0;

    foreach ($blocks as &$block) {
        if (empty($block['blockName'])) {
            continue;
        }

        if (!empty($block['attrs'])) {
            $result = $transform($block['attrs']);
            if ($result['changed']) {
                $block['attrs'] = $result['attrs'];
                $changed_count++;
            }
        }

        if (!empty($block['innerBlocks'])) {
            $inner_result = walk_blocks_and_transform($block['innerBlocks'], $transform);
            $block['innerBlocks'] = $inner_result['blocks'];
            $changed_count += $inner_result['changed_count'];
        }
    }
    unset($block);

    return ['blocks' => $blocks, 'changed_count' => $changed_count];
}

// ── Post query helpers ───────────────────────────────────────────────

/**
 * Get all block-editor-capable post types.
 */
function get_block_post_types(): array
{
    $types = ['post', 'page', 'wp_block', 'wp_template', 'wp_template_part'];

    $custom = get_post_types(['show_in_rest' => true, '_builtin' => false], 'names');
    foreach ($custom as $cpt) {
        if (!in_array($cpt, $types, true) && post_type_supports($cpt, 'editor')) {
            $types[] = $cpt;
        }
    }

    return $types;
}

/**
 * Count total posts across all block-capable post types.
 */
function count_all_block_posts(): int
{
    global $wpdb;

    $types = get_block_post_types();
    $placeholders = implode(',', array_fill(0, count($types), '%s'));

    // phpcs:ignore WordPress.DB.PreparedSQLPlaceholders
    return (int) $wpdb->get_var(
        $wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->posts}
             WHERE post_type IN ($placeholders)
             AND post_status IN ('publish','draft','pending','private','future')",
            ...$types
        )
    );
}

/**
 * Get a batch of post IDs for processing.
 */
function get_post_batch(int $offset, int $limit): array
{
    global $wpdb;

    $types = get_block_post_types();
    $placeholders = implode(',', array_fill(0, count($types), '%s'));

    // phpcs:ignore WordPress.DB.PreparedSQLPlaceholders
    return $wpdb->get_col(
        $wpdb->prepare(
            "SELECT ID FROM {$wpdb->posts}
             WHERE post_type IN ($placeholders)
             AND post_status IN ('publish','draft','pending','private','future')
             ORDER BY ID ASC
             LIMIT %d OFFSET %d",
            ...array_merge($types, [$limit, $offset])
        )
    );
}

// ── Core processing function ─────────────────────────────────────────

/**
 * Process a batch of posts with the given transform callback.
 *
 * @param callable $transform fn(array $attrs): array{attrs: array, changed: bool}
 * @return array{processed: int, modified: int, blocks_changed: int, errors: array, done: bool, total: int}
 */
function process_batch(int $offset, callable $transform): array
{
    $total = count_all_block_posts();
    $post_ids = get_post_batch($offset, MIGRATION_BATCH_SIZE);

    $modified = 0;
    $blocks_changed = 0;
    $errors = [];

    foreach ($post_ids as $post_id) {
        $post = get_post($post_id);
        if (!$post || empty($post->post_content)) {
            continue;
        }

        $blocks = parse_blocks($post->post_content);
        $result = walk_blocks_and_transform($blocks, $transform);

        if ($result['changed_count'] > 0) {
            $new_content = serialize_blocks($result['blocks']);

            $update_result = wp_update_post([
                'ID' => $post->ID,
                'post_content' => $new_content,
            ], true);

            if (is_wp_error($update_result)) {
                $errors[] = [
                    'post_id' => $post->ID,
                    'title' => $post->post_title,
                    'error' => $update_result->get_error_message(),
                ];
            } else {
                $modified++;
                $blocks_changed += $result['changed_count'];
            }
        }
    }

    $new_offset = $offset + MIGRATION_BATCH_SIZE;

    return [
        'processed' => $new_offset,
        'modified' => $modified,
        'blocks_changed' => $blocks_changed,
        'errors' => $errors,
        'done' => $new_offset >= $total,
        'total' => $total,
    ];
}

// ── AJAX endpoints ───────────────────────────────────────────────────

add_action('wp_ajax_webentor_migration_scan', function () {
    check_ajax_referer('webentor_migration', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('Insufficient permissions', 403);
    }

    $total = count_all_block_posts();
    $v1_posts = 0;
    $v1_blocks = 0;
    $v1_cleanup_posts = 0;
    $v1_cleanup_blocks = 0;

    $offset = 0;
    while (true) {
        $post_ids = get_post_batch($offset, 100);
        if (empty($post_ids)) break;

        foreach ($post_ids as $post_id) {
            $post = get_post($post_id);
            if (!$post || empty($post->post_content)) continue;

            $blocks = parse_blocks($post->post_content);

            // Count v1 blocks needing migration
            $migrate_result = walk_blocks_and_transform($blocks, function ($attrs) {
                $version = $attrs['_responsiveSettingsVersion'] ?? 0;
                $has_v1 = $version < 2 && (!empty($attrs['display']) || !empty($attrs['flexboxItem']));
                return ['attrs' => $attrs, 'changed' => $has_v1];
            });
            if ($migrate_result['changed_count'] > 0) {
                $v1_posts++;
                $v1_blocks += $migrate_result['changed_count'];
            }

            // Count blocks with leftover v1 keys (for cleanup)
            $cleanup_result = walk_blocks_and_transform($blocks, function ($attrs) {
                $has_old_keys = isset($attrs['display']) || isset($attrs['flexboxItem']);
                return ['attrs' => $attrs, 'changed' => $has_old_keys];
            });
            if ($cleanup_result['changed_count'] > 0) {
                $v1_cleanup_posts++;
                $v1_cleanup_blocks += $cleanup_result['changed_count'];
            }
        }

        $offset += 100;
    }

    wp_send_json_success([
        'total_posts' => $total,
        'v1_posts' => $v1_posts,
        'v1_blocks' => $v1_blocks,
        'cleanup_posts' => $v1_cleanup_posts,
        'cleanup_blocks' => $v1_cleanup_blocks,
    ]);
});

add_action('wp_ajax_webentor_migration_run', function () {
    check_ajax_referer('webentor_migration', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('Insufficient permissions', 403);
    }

    $offset = (int) ($_POST['offset'] ?? 0);
    $result = process_batch($offset, __NAMESPACE__ . '\migrate_block_attributes_v1_to_v2');

    wp_send_json_success($result);
});

add_action('wp_ajax_webentor_migration_cleanup', function () {
    check_ajax_referer('webentor_migration', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('Insufficient permissions', 403);
    }

    $offset = (int) ($_POST['offset'] ?? 0);
    $result = process_batch($offset, __NAMESPACE__ . '\cleanup_v1_keys');

    wp_send_json_success($result);
});

// ── Admin page rendering ─────────────────────────────────────────────

function get_migration_page_styles(): string
{
    return <<<'CSS'
.webentor-migration-wrap { max-width: 720px; }
.webentor-migration-section {
    background: #fff;
    border: 1px solid #c3c4c7;
    padding: 20px 24px;
    margin-bottom: 20px;
}
.webentor-migration-section h2 { margin-top: 0; }
.webentor-migration-progress {
    width: 100%;
    height: 24px;
    background: #f0f0f1;
    border-radius: 3px;
    margin: 12px 0;
    display: none;
    overflow: hidden;
}
.webentor-migration-progress-bar {
    height: 100%;
    background: #2271b1;
    border-radius: 3px;
    transition: width 0.3s ease;
    min-width: 0;
}
.webentor-migration-log {
    max-height: 200px;
    overflow-y: auto;
    background: #f6f7f7;
    padding: 8px 12px;
    margin-top: 12px;
    font-family: monospace;
    font-size: 12px;
    display: none;
    border: 1px solid #dcdcde;
}
.webentor-migration-log .error { color: #d63638; }
.webentor-migration-log .success { color: #00a32a; }
.webentor-scan-results {
    margin: 12px 0;
    padding: 12px 16px;
    background: #f0f6fc;
    border-left: 4px solid #2271b1;
    display: none;
}
.webentor-scan-results.has-results { display: block; }
CSS;
}

function render_migration_page(): void
{
    $nonce = wp_create_nonce('webentor_migration');
    ?>
    <div class="wrap webentor-migration-wrap">
        <h1>Webentor Block Migration</h1>
        <p>Migrate responsive settings block attributes from v1 to v2 format across all posts on this site.</p>

        <!-- Scan -->
        <div class="webentor-migration-section">
            <h2>1. Scan</h2>
            <p>Count how many posts and blocks still use the v1 attribute format.</p>
            <button type="button" class="button" id="webentor-scan-btn">Scan Site</button>
            <span id="webentor-scan-spinner" class="spinner" style="float:none;"></span>
            <div class="webentor-scan-results" id="webentor-scan-results"></div>
        </div>

        <!-- Migrate -->
        <div class="webentor-migration-section">
            <h2>2. Migrate v1 &rarr; v2</h2>
            <p>
                Transform attribute keys: <code>display</code> &rarr; <code>layout</code> + <code>sizing</code>,
                <code>flexboxItem</code> &rarr; <code>flexItem</code>.
                Old keys are preserved alongside new ones for backward compatibility.
                WordPress creates a revision for each modified post.
            </p>
            <button type="button" class="button button-primary" id="webentor-migrate-btn">Run Migration</button>
            <div class="webentor-migration-progress" id="webentor-migrate-progress">
                <div class="webentor-migration-progress-bar" id="webentor-migrate-bar"></div>
            </div>
            <div class="webentor-migration-log" id="webentor-migrate-log"></div>
        </div>

        <!-- Cleanup -->
        <div class="webentor-migration-section">
            <h2>3. Remove v1 Keys</h2>
            <p>
                Remove old <code>display</code> and <code>flexboxItem</code> attributes from blocks
                that have already been migrated to v2. Only run this after confirming migration works correctly.
            </p>
            <button type="button" class="button" id="webentor-cleanup-btn">Remove v1 Keys</button>
            <div class="webentor-migration-progress" id="webentor-cleanup-progress">
                <div class="webentor-migration-progress-bar" id="webentor-cleanup-bar"></div>
            </div>
            <div class="webentor-migration-log" id="webentor-cleanup-log"></div>
        </div>
    </div>

    <script>
    (function() {
        var nonce = <?php echo wp_json_encode($nonce); ?>;
        var ajaxUrl = <?php echo wp_json_encode(admin_url('admin-ajax.php')); ?>;

        function log(targetId, message, type) {
            var el = document.getElementById(targetId);
            el.style.display = 'block';
            var line = document.createElement('div');
            if (type) line.className = type;
            line.textContent = message;
            el.appendChild(line);
            el.scrollTop = el.scrollHeight;
        }

        // Scan
        document.getElementById('webentor-scan-btn').addEventListener('click', function() {
            var btn = this;
            var spinner = document.getElementById('webentor-scan-spinner');
            btn.disabled = true;
            spinner.classList.add('is-active');

            var data = new FormData();
            data.append('action', 'webentor_migration_scan');
            data.append('nonce', nonce);

            fetch(ajaxUrl, { method: 'POST', body: data })
                .then(function(r) { return r.json(); })
                .then(function(resp) {
                    spinner.classList.remove('is-active');
                    btn.disabled = false;

                    var el = document.getElementById('webentor-scan-results');
                    if (resp.success) {
                        var d = resp.data;
                        el.innerHTML =
                            '<strong>Total posts scanned:</strong> ' + d.total_posts + '<br>' +
                            '<strong>Posts needing migration:</strong> ' + d.v1_posts +
                            ' (' + d.v1_blocks + ' blocks)<br>' +
                            '<strong>Posts with v1 keys to clean up:</strong> ' + d.cleanup_posts +
                            ' (' + d.cleanup_blocks + ' blocks)';
                    } else {
                        el.innerHTML = '<span style="color:#d63638">Scan failed: ' + (resp.data || 'Unknown error') + '</span>';
                    }
                    el.classList.add('has-results');
                })
                .catch(function(err) {
                    spinner.classList.remove('is-active');
                    btn.disabled = false;
                    alert('Scan request failed: ' + err.message);
                });
        });

        // Batch runner used by both migrate and cleanup
        function runBatch(action, btnId, progressId, barId, logId) {
            var btn = document.getElementById(btnId);
            var progress = document.getElementById(progressId);
            var bar = document.getElementById(barId);
            var logTarget = logId;

            btn.disabled = true;
            progress.style.display = 'block';
            bar.style.width = '0%';

            var totals = { modified: 0, blocks_changed: 0, errors: [] };

            function next(offset) {
                var data = new FormData();
                data.append('action', action);
                data.append('nonce', nonce);
                data.append('offset', offset);

                fetch(ajaxUrl, { method: 'POST', body: data })
                    .then(function(r) { return r.json(); })
                    .then(function(resp) {
                        if (!resp.success) {
                            log(logTarget, 'Error: ' + (resp.data || 'Unknown'), 'error');
                            btn.disabled = false;
                            return;
                        }

                        var d = resp.data;
                        totals.modified += d.modified;
                        totals.blocks_changed += d.blocks_changed;
                        totals.errors = totals.errors.concat(d.errors || []);

                        var pct = Math.min(100, Math.round((d.processed / d.total) * 100));
                        bar.style.width = pct + '%';
                        log(logTarget, 'Processed ' + Math.min(d.processed, d.total) + '/' + d.total +
                            ' posts (' + d.modified + ' modified in this batch)', '');

                        if (d.errors && d.errors.length) {
                            d.errors.forEach(function(e) {
                                log(logTarget, 'Error on post #' + e.post_id + ' (' + e.title + '): ' + e.error, 'error');
                            });
                        }

                        if (d.done) {
                            log(logTarget, 'Done! ' + totals.modified + ' posts modified, ' +
                                totals.blocks_changed + ' blocks changed, ' +
                                totals.errors.length + ' errors.', 'success');
                            btn.disabled = false;
                        } else {
                            next(d.processed);
                        }
                    })
                    .catch(function(err) {
                        log(logTarget, 'Request failed: ' + err.message, 'error');
                        btn.disabled = false;
                    });
            }

            log(logTarget, 'Starting...', '');
            next(0);
        }

        document.getElementById('webentor-migrate-btn').addEventListener('click', function() {
            if (!confirm('This will modify post content across all posts. WordPress will create revisions. Continue?')) return;
            runBatch('webentor_migration_run', 'webentor-migrate-btn', 'webentor-migrate-progress', 'webentor-migrate-bar', 'webentor-migrate-log');
        });

        document.getElementById('webentor-cleanup-btn').addEventListener('click', function() {
            if (!confirm('This will permanently remove v1 attribute keys (display, flexboxItem) from migrated blocks. Make sure migration has completed successfully first. Continue?')) return;
            runBatch('webentor_migration_cleanup', 'webentor-cleanup-btn', 'webentor-cleanup-progress', 'webentor-cleanup-bar', 'webentor-cleanup-log');
        });
    })();
    </script>
    <?php
}
