<?php

namespace Webentor\Core\View\Directives;

use function Roots\bundle;

class EnqueueScriptsBladeDirective
{
    public function __invoke($expression)
    {
        $function_name = 'enqueue' . ucfirst($this->strip($expression));
        if (!function_exists($function_name)) {
            $function = function () use ($expression) {
                add_action('wp_head', function () use ($expression) {
                    bundle($this->strip($expression))->enqueue();
                });
            };
            $function();
        }

        return;
    }

    /**
    * Strip single quotes from the expression.
    */
    public function strip(?string $expression = '', array $characters = ["'", '"']): string
    {
        return str_replace($characters, '', $expression ?? '');
    }
}
