import { ClassGenContext, registry } from '../../registry';
import { BlockLinkPanel } from './panel';

/**
 * Block link is non-responsive and doesn't generate Tailwind classes.
 * It's registered for attribute schema and panel rendering consistency.
 */
registry.register({
  name: 'blockLink',
  panelTitle: 'Block Link',
  panelPriority: 40,
  attributeKey: 'blockLink',
  supportKey: 'blockLink',
  attributeSchema: {
    blockLink: { type: 'object', default: {} },
  },
  PanelComponent: BlockLinkPanel,
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
