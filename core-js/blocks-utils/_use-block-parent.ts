import {
  store as blockEditorStore,
  useBlockProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/*
 * Allows you to easily interface with the direct
 * parent of the current block
 */
export const useBlockParent = () => {
  // Get the client id from the block props, because the useBlockEditContext is for some reason not returning correct client id in various cases
  const { id } = useBlockProps();
  const clientId = id.replace('block-', '');

  const parentClientId = useSelect(
    (select) => select(blockEditorStore).getBlockRootClientId(clientId),
    [clientId],
  );

  const parentBlock = useSelect(
    (select) => select(blockEditorStore).getBlock(parentClientId),
    [parentClientId],
  );

  return parentBlock;
};
