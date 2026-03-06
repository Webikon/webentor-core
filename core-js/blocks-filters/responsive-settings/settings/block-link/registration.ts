/**
 * Block link module registration.
 *
 * Block link is non-responsive and doesn't generate Tailwind classes.
 * Uses its own panelGroup 'blockLink' with a standalone panel wrapper
 * (panels/BlockLinkPanel.tsx) that renders without breakpoint tabs.
 */
import { registry } from '../../registry';
import { ClassGenContext } from '../../types';
import { BlockLinkPanel } from './panel';

registry.register({
  name: 'blockLink',
  panelGroup: 'blockLink',
  order: 100,
  attributeKey: 'blockLink',
  supportKey: 'blockLink',
  attributeSchema: {
    blockLink: { type: 'object', default: {} },
  },
  SettingsComponent: BlockLinkPanel,
  generateClasses: (
    _attributes: Record<string, any>,
    _breakpoint: string,
    _context: ClassGenContext,
  ): string[] => {
    return [];
  },
  hasActiveSettings: (
    attributes: Record<string, any>,
    _breakpoint: string,
  ): boolean => {
    return !!attributes?.blockLink?.url;
  },
});
