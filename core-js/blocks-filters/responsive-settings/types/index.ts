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

export interface BorderValue {
  top: {
    width: string;
    color: string;
    style: string;
  };
  right: {
    width: string;
    color: string;
    style: string;
  };
  bottom: {
    width: string;
    color: string;
    style: string;
  };
  left: {
    width: string;
    color: string;
    style: string;
  };
}

export interface ResponsiveBorderValue {
  value: {
    [key: string]: BorderValue;
  };
}

export interface BlockAttributes {
  blockLink?: any;
  spacing?: ResponsiveAttribute;
  display?: ResponsiveAttribute;
  grid?: ResponsiveAttribute;
  gridItem?: ResponsiveAttribute;
  flexbox?: ResponsiveAttribute;
  flexboxItem?: ResponsiveAttribute;
  border?: ResponsiveBorderValue;
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
