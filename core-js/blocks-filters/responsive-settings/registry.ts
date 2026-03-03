import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { BlockPanelProps, SelectOption } from './types';

export interface PropertyDefinition {
  label: string;
  name: string;
  help?: string;
  values: SelectOption[];
}

/**
 * Context object passed to class generators so they can inspect
 * parent block state and slider status without calling hooks.
 */
export interface ClassGenContext {
  blockName: string;
  supports: Record<string, any>;
  parentBlockAttributes?: Record<string, any>;
}

export interface SettingDefinition {
  name: string;
  panelTitle: string;
  panelPriority: number;
  /** Block attribute key, e.g. 'spacing', 'display', 'border' */
  attributeKey: string;
  /** webentor.* support flag checked against block supports */
  supportKey: string | string[];
  /** Attribute schema merged into blocks.registerBlockType filter */
  attributeSchema: Record<string, any>;
  /** Optional: custom attribute initialiser (for display defaults etc.) */
  initAttributes?: (
    settings: Record<string, any>,
    name: string,
  ) => Record<string, any>;
  /** React component rendered inside InspectorControls */
  PanelComponent: React.FC<BlockPanelProps>;
  /**
   * Generates Tailwind class array for a given breakpoint.
   * Called from generateClassNames in utils.ts.
   */
  generateClasses: (
    attributes: Record<string, any>,
    breakpoint: string,
    context: ClassGenContext,
  ) => string[];
  /** Returns true when at least one value is set for the breakpoint (tab indicator) */
  hasActiveSettings: (
    attributes: Record<string, any>,
    breakpoint: string,
    context?: ClassGenContext,
  ) => boolean;
}

class SettingsRegistry {
  private settings = new Map<string, SettingDefinition>();

  register(def: SettingDefinition): void {
    this.settings.set(def.name, def);
  }

  getAll(): SettingDefinition[] {
    return Array.from(this.settings.values()).sort(
      (a, b) => a.panelPriority - b.panelPriority,
    );
  }

  getByName(name: string): SettingDefinition | undefined {
    return this.settings.get(name);
  }

  /** Returns all attribute schemas merged into a single object */
  getAllAttributeSchemas(): Record<string, any> {
    const schemas: Record<string, any> = {};
    for (const def of this.settings.values()) {
      Object.assign(schemas, def.attributeSchema);
    }
    return schemas;
  }

  /** Check if a block supports a setting by checking its supportKey against block supports */
  isSupported(
    supports: Record<string, any> | undefined,
    def: SettingDefinition,
  ): boolean {
    const keys = Array.isArray(def.supportKey)
      ? def.supportKey
      : [def.supportKey];
    return keys.some((key) => !!supports?.webentor?.[key]);
  }
}

export const registry = new SettingsRegistry();
