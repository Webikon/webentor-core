/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-recommended'],
  rules: {
    'no-descending-specificity': null,
    'no-invalid-position-at-import-rule': null,
    'media-query-no-invalid': [
      true,
      {
        ignoreFunctions: ['theme'],
      },
    ],
    'no-empty-source': null,

    // Tailwind v4 rules
    'import-notation': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          /** tailwindcss v4 */
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'plugin',
          'apply',
          'reference',
        ],
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme'],
      },
    ],
    'at-rule-no-deprecated': [
      true,
      {
        ignoreAtRules: ['apply'],
      },
    ],
  },
};
