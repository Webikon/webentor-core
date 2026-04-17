<?php

namespace Webentor\Core\View\Directives;

class SliderContentBladeDirective
{
    public function __invoke($expression)
    {
        // Remove unnecessary whitespace and line breaks
        $expression = preg_replace('/\s+/', ' ', $expression);

        return "<?php
            \$dom = new \\DOMDocument('1.0', 'utf-8');
            libxml_use_internal_errors(true); // Suppress errors
            \$dom->loadHTML(
                '<div>' . mb_convert_encoding($expression, 'HTML-ENTITIES', 'UTF-8') . '</div>',
                LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
            );
            libxml_clear_errors(); // Clear errors

            \$xpath = new \\DOMXPath(\$dom);
            \$nodes = \$xpath->query('/div/*');

            \$output = '';
            foreach (\$nodes as \$node) {
                \$wrapper = \$dom->createElement('div');
                \$wrapper->setAttribute('class', 'h-auto');

                \$wrapper->appendChild(\$node->cloneNode(true));

                \$output .= \$dom->saveHTML(\$wrapper);
            }

            echo \$output;
        ?>";
    }
}
