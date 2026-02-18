import type { WebentorConfig } from '@webentorCore/types/_webentor-config';

// Inspired by Tailwind BlockConfiguration
// See: https://github.com/tailwindlabs/tailwindcss/blob/v3.4.17/stubs/config.full.js

// Basic spacing, also used for padding and margin
export const spacing = {
  0: '0px', // 0px
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  15: '3.75rem', // 60px
  16: '4rem', //64px
  20: '5rem', // 80px
};

const config: WebentorConfig = {
  theme: {
    aspectRatio: {
      auto: 'auto',
      square: '1 / 1',
      video: '16 / 9',
    },
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      '2xl': '16px',
      '3xl': '24px',
      full: '9999px',
    },
    borderWidth: {
      0: 'none',
      1: '1px',
      2: '2px',
      4: '4px',
      6: '6px',
    },
    borderStyle: {
      none: 'none',
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      double: 'double',
    },
    colors: {
      // Default grey colors
      'grey-50': 'var(--color-grey-50)',
      'grey-100': 'var(--color-grey-100)',
      'grey-200': 'var(--color-grey-200)',
      'grey-300': 'var(--color-grey-300)',
      'grey-400': 'var(--color-grey-400)',
      'grey-500': 'var(--color-grey-500)',
      'grey-600': 'var(--color-grey-600)',
      'grey-700': 'var(--color-grey-700)',
      'grey-800': 'var(--color-grey-800)',
      'grey-900': 'var(--color-grey-900)',
      'grey-950': 'var(--color-grey-950)',

      // Webentor colors
      white: 'var(--color-white)',
      black: 'var(--color-black)',
      transparent: 'transparent',
      current: 'currentColor',

      // Admin colors
      'editor-border': '#ddd', // Border color used in editor
    },
    flexBasis: {
      auto: 'auto',
      0: '0px', // 0px
      1: '0.25rem', // 4px
      2: '0.5rem', // 8px
      3: '0.75rem', // 12px
      4: '1rem', // 16px
      5: '1.25rem', // 20px
      6: '1.5rem', // 24px
      8: '2rem', // 32px
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      '1/12': '8.333333%',
      '2/12': '16.666667%',
      '3/12': '25%',
      '4/12': '33.333333%',
      '5/12': '41.666667%',
      '6/12': '50%',
      '7/12': '58.333333%',
      '8/12': '66.666667%',
      '9/12': '75%',
      '10/12': '83.333333%',
      '11/12': '91.666667%',
      full: '100%',
    },
    fontFamily: {
      primary: ['Heebo', 'Arial'],
      secondary: ['Heebo', 'Arial'],
      heading: ['GT Sectra', 'Arial'],
    },
    fontSize: {
      10: '0.625rem',
      12: '0.75rem',
      14: '0.875rem',
      16: '1rem',
      18: '1.125rem',
      20: '1.25rem',
      22: '1.375rem',
      24: '1.5rem',
      26: '1.625rem',
      28: '1.75rem',
      30: '1.875rem',
      32: '2rem',
      34: '2.125rem',
      36: '2.25rem',
      38: '2.375rem',
      40: '2.5rem',
      44: '2.75rem',
      48: '3rem',
      50: '3.125rem',
      56: '3.5rem',
      60: '3.75rem',
      80: '5rem',
    },
    fontWeight: {
      300: '300',
      400: '400',
      normal: '400',
      500: '500',
      medium: '500',
      600: '600',
      semibold: '600',
      700: '700',
      bold: '700',
      900: '900',
      black: '900',
    },
    gap: {
      ...spacing,
    },
    gridColumn: {
      auto: 'auto',
      'span-1': 'span 1 / span 1',
      'span-2': 'span 2 / span 2',
      'span-3': 'span 3 / span 3',
      'span-4': 'span 4 / span 4',
      'span-5': 'span 5 / span 5',
      'span-6': 'span 6 / span 6',
      'span-7': 'span 7 / span 7',
      'span-8': 'span 8 / span 8',
      'span-9': 'span 9 / span 9',
      'span-10': 'span 10 / span 10',
      'span-11': 'span 11 / span 11',
      'span-12': 'span 12 / span 12',
      'span-full': '1 / -1',
    },
    gridRow: {
      auto: 'auto',
      'span-1': 'span 1 / span 1',
      'span-2': 'span 2 / span 2',
      'span-3': 'span 3 / span 3',
      'span-4': 'span 4 / span 4',
      'span-5': 'span 5 / span 5',
      'span-6': 'span 6 / span 6',
      'span-7': 'span 7 / span 7',
      'span-8': 'span 8 / span 8',
      'span-9': 'span 9 / span 9',
      'span-10': 'span 10 / span 10',
      'span-11': 'span 11 / span 11',
      'span-12': 'span 12 / span 12',
      'span-full': '1 / -1',
    },
    gridTemplateColumns: {
      none: 'none',
      subgrid: 'subgrid',
      1: 'repeat(1, minmax(0, 1fr))',
      2: 'repeat(2, minmax(0, 1fr))',
      3: 'repeat(3, minmax(0, 1fr))',
      4: 'repeat(4, minmax(0, 1fr))',
      5: 'repeat(5, minmax(0, 1fr))',
      6: 'repeat(6, minmax(0, 1fr))',
      7: 'repeat(7, minmax(0, 1fr))',
      8: 'repeat(8, minmax(0, 1fr))',
      9: 'repeat(9, minmax(0, 1fr))',
      10: 'repeat(10, minmax(0, 1fr))',
      11: 'repeat(11, minmax(0, 1fr))',
      12: 'repeat(12, minmax(0, 1fr))',
    },
    gridTemplateRows: {
      none: 'none',
      subgrid: 'subgrid',
      1: 'repeat(1, minmax(0, 1fr))',
      2: 'repeat(2, minmax(0, 1fr))',
      3: 'repeat(3, minmax(0, 1fr))',
      4: 'repeat(4, minmax(0, 1fr))',
      5: 'repeat(5, minmax(0, 1fr))',
      6: 'repeat(6, minmax(0, 1fr))',
      7: 'repeat(7, minmax(0, 1fr))',
      8: 'repeat(8, minmax(0, 1fr))',
      9: 'repeat(9, minmax(0, 1fr))',
      10: 'repeat(10, minmax(0, 1fr))',
      11: 'repeat(11, minmax(0, 1fr))',
      12: 'repeat(12, minmax(0, 1fr))',
    },
    height: {
      auto: 'auto',
      ...spacing,
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      full: '100%',
      screen: '100vh',
      svh: '100svh',
      lvh: '100lvh',
      dvh: '100dvh',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
    },
    margin: {
      auto: 'auto',
      ...spacing,
    },
    maxHeight: {
      ...spacing,
      none: 'none',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      full: '100%',
      screen: '100vh',
      svh: '100svh',
      lvh: '100lvh',
      dvh: '100dvh',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
    },
    maxWidth: {
      ...spacing,
      none: 'none',
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      '1/12': '8.333333%',
      '2/12': '16.666667%',
      '3/12': '25%',
      '4/12': '33.333333%',
      '5/12': '41.666667%',
      '6/12': '50%',
      '7/12': '58.333333%',
      '8/12': '66.666667%',
      '9/12': '75%',
      '10/12': '83.333333%',
      '11/12': '91.666667%',
      full: '100%',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
      prose: '65ch',
    },
    minHeight: {
      ...spacing,
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      full: '100%',
      screen: '100vh',
      svh: '100svh',
      lvh: '100lvh',
      dvh: '100dvh',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
    },
    minWidth: {
      ...spacing,
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      '1/12': '8.333333%',
      '2/12': '16.666667%',
      '3/12': '25%',
      '4/12': '33.333333%',
      '5/12': '41.666667%',
      '6/12': '50%',
      '7/12': '58.333333%',
      '8/12': '66.666667%',
      '9/12': '75%',
      '10/12': '83.333333%',
      '11/12': '91.666667%',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
    },
    objectPosition: {
      bottom: 'bottom',
      center: 'center',
      left: 'left',
      'left-bottom': 'left bottom',
      'left-top': 'left top',
      right: 'right',
      'right-bottom': 'right bottom',
      'right-top': 'right top',
      top: 'top',
    },
    order: {
      first: '-9999',
      last: '9999',
      none: '0',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      '-1': '-1',
      '-2': '-2',
      '-3': '-3',
      '-4': '-4',
      '-5': '-5',
    },
    padding: {
      ...spacing,
    },
    screens: {
      sm: '480px', // => @media (min-width: 480px) { ... }
      md: '768px', // => @media (min-width: 768px) { ... }
      lg: '1024px', // => @media (min-width: 1024px) { ... }
      xl: '1200px', // => @media (min-width: 1200px) { ... }
      '2xl': '1600px', // => @media (min-width: 1600px) { ... }
    },
    spacing: spacing,
    width: {
      auto: 'auto',
      ...spacing,
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      '1/12': '8.333333%',
      '2/12': '16.666667%',
      '3/12': '25%',
      '4/12': '33.333333%',
      '5/12': '41.666667%',
      '6/12': '50%',
      '7/12': '58.333333%',
      '8/12': '66.666667%',
      '9/12': '75%',
      '10/12': '83.333333%',
      '11/12': '91.666667%',
      full: '100%',
      screen: '100vw',
      svw: '100svw',
      lvw: '100lvw',
      dvw: '100dvw',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
    },
  },
};

// These will be used to generate options for Gutenberg typography select
// MUST BE defined in theme webentor-config.ts as its project specific
export const customTypographyKeys = [];

export const buildSafelist = (config: WebentorConfig) => {
  const breakpointsPrefixes = Object.keys(config.theme.screens).map((key) => {
    return `${key}:`;
  });
  breakpointsPrefixes.unshift('');

  return [
    'bg-white',
    'bg-black',

    // Custom typography classes
    ...customTypographyKeys.flatMap((item) => {
      return [`${item.key}`];
    }),

    // WP classes
    ...Object.keys(config.theme.colors).flatMap((color) => {
      if (typeof config.theme.colors[color] === 'string') {
        return [`has-${color}-color`, `has-${color}-background-color`];
      } else {
        return Object.keys(config.theme.colors[color]).flatMap((subColor) => {
          return [
            `has-${color}-${subColor}-color`,
            `has-${color}-${subColor}-background-color`,
          ];
        });
      }
    }),
    ...Object.keys(config.theme.fontSize).flatMap((size) => {
      return [`has-${size}-font-size`];
    }),
    ...Object.keys(config.theme.fontFamily).flatMap((family) => {
      return [`has-${family}-font-family`];
    }),

    /**
     * IMPORTANT: We are adding responsive settings for Gutenberg which would dynamically generate TW classes.
     * That's why we need to add all of them to safelist.
     */

    // Padding
    ...Object.keys(config.theme.padding).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [
        `${bp}pt-${i}`,
        `${bp}pr-${i}`,
        `${bp}pb-${i}`,
        `${bp}pl-${i}`,
      ]);
    }),

    // Margin
    ...Object.keys(config.theme.margin).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [
        `${bp}mt-${i}`,
        `${bp}mr-${i}`,
        `${bp}mb-${i}`,
        `${bp}ml-${i}`,
      ]);
    }),

    // Object fit
    ...[
      'object-contain',
      'object-cover',
      'object-fill',
      'object-none',
      'object-scale-down',
    ].flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}${i}`]);
    }),

    // Object position
    ...Object.keys(config.theme.objectPosition).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}object-${i}`]);
    }),

    // Display
    ...['block', 'hidden', 'flex', 'grid', 'inline-block', 'inline'].flatMap(
      (i) => {
        return breakpointsPrefixes.flatMap((bp) => [`${bp}${i}`]);
      },
    ),

    // Height
    ...Object.keys(config.theme.height).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}h-${i}`]);
    }),

    // Min height
    ...Object.keys(config.theme.minHeight).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}min-h-${i}`]);
    }),

    // Max height
    ...Object.keys(config.theme.maxHeight).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}max-h-${i}`]);
    }),

    // Width
    ...Object.keys(config.theme.width).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}w-${i}`]);
    }),

    // Min width
    ...Object.keys(config.theme.minWidth).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}min-w-${i}`]);
    }),

    // Max width
    ...Object.keys(config.theme.maxWidth).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}max-w-${i}`]);
    }),

    // Flex flow
    ...[
      'flex-row',
      'flex-row-reverse',
      'flex-col',
      'flex-col-reverse',
      'flex-wrap',
      'flex-wrap-reverse',
      'flex-nowrap',
    ].flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}${i}`]);
    }),

    // Justify content
    ...[
      'justify-normal',
      'justify-start',
      'justify-end',
      'justify-center',
      'justify-between',
      'justify-around',
      'justify-evenly',
      'justify-stretch',
    ].flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}${i}`]);
    }),

    // Align items
    ...[
      'items-start',
      'items-end',
      'items-center',
      'items-baseline',
      'items-stretch',
    ].flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}${i}`]);
    }),

    // Align content
    ...[
      'content-normal',
      'content-start',
      'content-end',
      'content-center',
      'content-between',
      'content-around',
      'content-evenly',
      'content-baseline',
      'content-stretch',
    ].flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}${i}`]);
    }),

    // Flex grow/shrink
    ...['grow', 'grow-0', 'shrink', 'shrink-0'].flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}${i}`]);
    }),

    // Flex basis
    ...Object.keys(config.theme.flexBasis).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}basis-${i}`]);
    }),

    // Gap
    ...Object.keys(config.theme.gap).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [
        `${bp}gap-${i}`,
        `${bp}gap-x-${i}`,
        `${bp}gap-y-${i}`,
      ]);
    }),

    // Grid
    ...Object.keys(config.theme.gridTemplateColumns).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}grid-cols-${i}`]);
    }),
    ...Object.keys(config.theme.gridTemplateRows).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}grid-rows-${i}`]);
    }),
    ...Object.keys(config.theme.gridColumn).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}col-${i}`]);
    }),
    ...Object.keys(config.theme.gridRow).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}row-${i}`]);
    }),

    // Borders
    ...['t', 'r', 'b', 'l'].flatMap((side) => {
      return [
        ...Object.keys(config.theme.colors).flatMap((i) => {
          return breakpointsPrefixes.flatMap((bp) => [
            `${bp}border-${side}-${i}`,
          ]);
        }),
        ...Object.keys(config.theme.borderWidth).flatMap((i) => {
          return breakpointsPrefixes.flatMap((bp) => [
            `${bp}border-${side}-${i}`,
          ]);
        }),
        ...Object.keys(config.theme.borderStyle).flatMap((i) => {
          return breakpointsPrefixes.flatMap((bp) => [
            `${bp}border-${side}-${i}`,
          ]);
        }),
      ];
    }),

    // Border radius
    ...['tr', 'tl', 'br', 'bl'].flatMap((corner) => {
      return [
        ...Object.keys(config.theme.borderRadius).flatMap((i) => {
          return breakpointsPrefixes.flatMap((bp) => [
            `${bp}rounded-${corner}-${i}`,
          ]);
        }),
      ];
    }),

    // Opacity for hidden block
    ...breakpointsPrefixes.flatMap((bp) => [`${bp}opacity-30`]),

    // Orders
    ...Object.keys(config.theme.order).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}order-${i}`]);
    }),

    // Aspect ratio
    ...Object.keys(config.theme.aspectRatio).flatMap((i) => {
      return breakpointsPrefixes.flatMap((bp) => [`${bp}aspect-${i}`]);
    }),
  ];
};

// Build safelist
config.safelist = ['bg-white', 'bg-black', ...buildSafelist(config)];

export default config;
