import { WebentorConfig } from '@webentorCore/types/_webentor-config';

export interface SelectOption {
  label: string;
  value: string;
}

export interface ResponsiveValue {
  value: {
    [key: string]: string;
  };
}

export interface ResponsiveAttribute {
  [key: string]: ResponsiveValue;
}

export interface BlockAttributes {
  blockLink?: any;
  spacing?: ResponsiveAttribute;
  display?: ResponsiveAttribute;
  grid?: ResponsiveAttribute;
  gridItem?: ResponsiveAttribute;
  flexbox?: ResponsiveAttribute;
  flexboxItem?: ResponsiveAttribute;
  slider?: {
    enabled?: ResponsiveValue;
  };
}

export interface BlockPanelProps {
  attributes: BlockAttributes;
  setAttributes: (attributes: BlockAttributes) => void;
  name: string;
  clientId: string;
  breakpoints: string[];
  twTheme: WebentorConfig['theme'];
}
