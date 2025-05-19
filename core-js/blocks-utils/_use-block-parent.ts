import {
  store as blockEditorStore,
  useBlockEditContext,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/*
 * Allows you to easily interface with the direct
 * parent of the current block
 */
export const useBlockParent = () => {
  const { clientId } = useBlockEditContext();
  const parentBlocks = useSelect(
    // @ts-expect-error - The type definitions for the core store are incomplete.
    (select) => select(blockEditorStore).getBlockParents(clientId),
    [clientId],
  );
  const parentBlockClientId = parentBlocks[parentBlocks.length - 1];

  const parentBlock = useSelect(
    // @ts-expect-error - The type definitions for the core store are incomplete.
    (select) => select(blockEditorStore).getBlock(parentBlockClientId),
    [parentBlockClientId],
  );

  return parentBlock;
};
