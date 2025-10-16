// Heavily inspired by Tailwind config
// https://github.com/tailwindlabs/tailwindcss/blob/v3.4.17/types/config.d.ts

// Helpers
type KeyValuePair<K extends keyof any = string, V = string> = Record<K, V>;
interface RecursiveKeyValuePair<K extends keyof any = string, V = string> {
  [key: string]: V | RecursiveKeyValuePair<K, V>;
}
export type ResolvableTo<T> = T | ((utils: PluginUtils) => T);

interface PluginUtils {
  theme(path: string, defaultValue?: unknown): any;
}

type Screen =
  | { raw: string }
  | { min: string }
  | { max: string }
  | { min: string; max: string };
type ScreensConfig =
  | string[]
  | KeyValuePair<string, string | Screen | Screen[]>;

// Theme related config
export interface ThemeConfig {
  // Responsiveness
  screens: ResolvableTo<ScreensConfig>;

  // Reusable base configs
  colors: ResolvableTo<RecursiveKeyValuePair>;
  spacing: ResolvableTo<KeyValuePair>;

  // Utilities
  // accentColor: ThemeConfig['colors'];
  // animation: ResolvableTo<KeyValuePair>;
  aspectRatio: ResolvableTo<KeyValuePair>;
  // backdropBlur: ThemeConfig['blur'];
  // backdropBrightness: ThemeConfig['brightness'];
  // backdropContrast: ThemeConfig['contrast'];
  // backdropGrayscale: ThemeConfig['grayscale'];
  // backdropHueRotate: ThemeConfig['hueRotate'];
  // backdropInvert: ThemeConfig['invert'];
  // backdropOpacity: ThemeConfig['opacity'];
  // backdropSaturate: ThemeConfig['saturate'];
  // backdropSepia: ThemeConfig['sepia'];
  // backgroundColor: ThemeConfig['colors'];
  // backgroundImage: ResolvableTo<KeyValuePair>;
  // backgroundOpacity: ThemeConfig['opacity'];
  // backgroundPosition: ResolvableTo<KeyValuePair>;
  // backgroundSize: ResolvableTo<KeyValuePair>;
  // blur: ResolvableTo<KeyValuePair>;
  // borderColor: ThemeConfig['colors'];
  // borderOpacity: ThemeConfig['opacity'];
  borderRadius: ResolvableTo<KeyValuePair>;
  // borderSpacing: ThemeConfig['spacing'];
  borderStyle: ResolvableTo<KeyValuePair>;
  borderWidth: ResolvableTo<KeyValuePair>;
  // boxShadow: ResolvableTo<KeyValuePair<string, string | string[]>>;
  // boxShadowColor: ThemeConfig['colors'];
  // brightness: ResolvableTo<KeyValuePair>;
  // caretColor: ThemeConfig['colors'];
  // columns: ResolvableTo<KeyValuePair>;
  // content: ResolvableTo<KeyValuePair>;
  // contrast: ResolvableTo<KeyValuePair>;
  // cursor: ResolvableTo<KeyValuePair>;
  // divideColor: ThemeConfig['borderColor'];
  // divideOpacity: ThemeConfig['borderOpacity'];
  // divideWidth: ThemeConfig['borderWidth'];
  // dropShadow: ResolvableTo<KeyValuePair<string, string | string[]>>;
  // fill: ThemeConfig['colors'];
  // flex: ResolvableTo<KeyValuePair>;
  flexBasis: ThemeConfig['spacing'];
  // flexGrow: ResolvableTo<KeyValuePair>;
  // flexShrink: ResolvableTo<KeyValuePair>;
  fontFamily: ResolvableTo<
    KeyValuePair<
      string,
      | string
      | string[]
      | [
          fontFamily: string | string[],
          configuration: Partial<{
            fontFeatureSettings: string;
            fontVariationSettings: string;
          }>,
        ]
    >
  >;
  fontSize: ResolvableTo<
    KeyValuePair<
      string,
      | string
      | [fontSize: string, lineHeight: string]
      | [
          fontSize: string,
          configuration: Partial<{
            lineHeight: string;
            letterSpacing: string;
            fontWeight: string | number;
          }>,
        ]
    >
  >;
  fontWeight: ResolvableTo<KeyValuePair>;
  gap: ThemeConfig['spacing'];
  // gradientColorStops: ThemeConfig['colors'];
  // grayscale: ResolvableTo<KeyValuePair>;
  // gridAutoColumns: ResolvableTo<KeyValuePair>;
  // gridAutoRows: ResolvableTo<KeyValuePair>;
  gridColumn: ResolvableTo<KeyValuePair>;
  // gridColumnEnd: ResolvableTo<KeyValuePair>;
  // gridColumnStart: ResolvableTo<KeyValuePair>;
  gridRow: ResolvableTo<KeyValuePair>;
  // gridRowEnd: ResolvableTo<KeyValuePair>;
  // gridRowStart: ResolvableTo<KeyValuePair>;
  gridTemplateColumns: ResolvableTo<KeyValuePair>;
  gridTemplateRows: ResolvableTo<KeyValuePair>;
  height: ThemeConfig['spacing'];
  // hueRotate: ResolvableTo<KeyValuePair>;
  // inset: ThemeConfig['spacing'];
  // invert: ResolvableTo<KeyValuePair>;
  // keyframes: ResolvableTo<KeyValuePair<string, KeyValuePair<string, KeyValuePair>>>;
  // letterSpacing: ResolvableTo<KeyValuePair>;
  // lineHeight: ResolvableTo<KeyValuePair>;
  // listStyleType: ResolvableTo<KeyValuePair>;
  margin: ThemeConfig['spacing'];
  // maxHeight: ThemeConfig['spacing'];
  // maxWidth: ResolvableTo<KeyValuePair>;
  // minHeight: ResolvableTo<KeyValuePair>;
  // minWidth: ResolvableTo<KeyValuePair>;
  objectPosition: ResolvableTo<KeyValuePair>;
  // opacity: ResolvableTo<KeyValuePair>;
  order: ResolvableTo<KeyValuePair>;
  // outlineColor: ThemeConfig['colors'];
  // outlineOffset: ResolvableTo<KeyValuePair>;
  // outlineWidth: ResolvableTo<KeyValuePair>;
  padding: ThemeConfig['spacing'];
  // placeholderColor: ThemeConfig['colors'];
  // placeholderOpacity: ThemeConfig['opacity'];
  // ringColor: ThemeConfig['colors'];
  // ringOffsetColor: ThemeConfig['colors'];
  // ringOffsetWidth: ResolvableTo<KeyValuePair>;
  // ringOpacity: ThemeConfig['opacity'];
  // ringWidth: ResolvableTo<KeyValuePair>;
  // rotate: ResolvableTo<KeyValuePair>;
  // saturate: ResolvableTo<KeyValuePair>;
  // scale: ResolvableTo<KeyValuePair>;
  // scrollMargin: ThemeConfig['spacing'];
  // scrollPadding: ThemeConfig['spacing'];
  // sepia: ResolvableTo<KeyValuePair>;
  // skew: ResolvableTo<KeyValuePair>;
  // space: ThemeConfig['spacing'];
  // stroke: ThemeConfig['colors'];
  // strokeWidth: ResolvableTo<KeyValuePair>;
  // textColor: ThemeConfig['colors'];
  // textDecorationColor: ThemeConfig['colors'];
  // textDecorationThickness: ResolvableTo<KeyValuePair>;
  // textIndent: ThemeConfig['spacing'];
  // textOpacity: ThemeConfig['opacity'];
  // textUnderlineOffset: ResolvableTo<KeyValuePair>;
  // transformOrigin: ResolvableTo<KeyValuePair>;
  // transitionDelay: ResolvableTo<KeyValuePair>;
  // transitionDuration: ResolvableTo<KeyValuePair>;
  // transitionProperty: ResolvableTo<KeyValuePair>;
  // transitionTimingFunction: ResolvableTo<KeyValuePair>;
  // translate: ThemeConfig['spacing'];
  // width: ThemeConfig['spacing'];
  // willChange: ResolvableTo<KeyValuePair>;
  // zIndex: ResolvableTo<KeyValuePair>;
}

interface CustomThemeConfig extends ThemeConfig {
  [key: string]: any;
}

interface OptionalConfig {
  theme: Partial<CustomThemeConfig & { extend: Partial<CustomThemeConfig> }>;
  // Custom
  [key: string]: any;
}

export type WebentorConfig = OptionalConfig;
