/**
 * SettingsRegistry — Central registry for responsive setting modules.
 *
 * Each setting module (layout, sizing, flexbox, etc.) self-registers via
 * its registration.ts side-effect import. The registry provides lookup
 * by name and by panelGroup for panel components to query.
 *
 * Architecture: Setting modules declare a panelGroup ('spacing' | 'displayLayout' | 'border')
 * which determines which panel wrapper renders them. The panel wrapper
 * queries getByPanelGroup() and renders each module's SettingsComponent
 * in order.
 */

import { ClassGenContext, PanelGroup, SettingDefinition } from './types';

export type { ClassGenContext, PanelGroup, SettingDefinition };

// Re-export PropertyDefinition for backward compat with existing imports
export type { PropertyDefinition } from './types';

class SettingsRegistry {
  private settings = new Map<string, SettingDefinition>();

  /**
   * Register a setting module. Called as a side-effect in each module's
   * registration.ts file. Duplicate names will overwrite (useful for
   * theme/plugin overrides).
   */
  register(def: SettingDefinition): void {
    this.settings.set(def.name, def);
  }

  /** All registered settings sorted by panelGroup priority then order */
  getAll(): SettingDefinition[] {
    return Array.from(this.settings.values()).sort((a, b) => a.order - b.order);
  }

  /** Get a specific setting by name */
  getByName(name: string): SettingDefinition | undefined {
    return this.settings.get(name);
  }

  /**
   * Get all settings for a given panel group, sorted by order.
   * Panel components use this to discover which modules to render.
   */
  getByPanelGroup(group: PanelGroup): SettingDefinition[] {
    return this.getAll().filter((def) => def.panelGroup === group);
  }

  /** Merge all attribute schemas into a single object */
  getAllAttributeSchemas(): Record<string, any> {
    const schemas: Record<string, any> = {};
    for (const def of this.settings.values()) {
      Object.assign(schemas, def.attributeSchema);
    }
    return schemas;
  }

  /**
   * Check if a block supports a setting by matching its supportKey
   * against the block's supports.webentor config.
   */
  isSupported(
    supports: Record<string, any> | undefined,
    def: SettingDefinition,
  ): boolean {
    const keys = Array.isArray(def.supportKey)
      ? def.supportKey
      : [def.supportKey];
    return keys.some((key) => !!supports?.webentor?.[key]);
  }

  /**
   * Get unique panel groups that have at least one registered setting.
   * Useful for determining which panels to render.
   */
  getActivePanelGroups(): PanelGroup[] {
    const groups = new Set<PanelGroup>();
    for (const def of this.settings.values()) {
      groups.add(def.panelGroup);
    }
    return Array.from(groups);
  }
}

/** Singleton registry instance shared across all modules */
export const registry = new SettingsRegistry();
