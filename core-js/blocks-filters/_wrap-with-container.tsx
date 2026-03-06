import {
  BlockControls,
  store as blockEditorStore,
} from '@wordpress/block-editor';
import { cloneBlock, createBlock } from '@wordpress/blocks';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { select as dataSelect, useDispatch, useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { group as groupIcon } from '@wordpress/icons';

const withWrapContainerButton = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    const { clientId, name } = props;

    // Allow themes to exclude specific blocks via filter
    const excludedBlocks: string[] = applyFilters(
      'webentor.core.wrapWithContainer.excludedBlocks',
      ['webentor/l-section'],
    );

    if (excludedBlocks.includes(name)) {
      return <BlockEdit {...props} />;
    }

    const { replaceBlocks } = useDispatch(blockEditorStore);

    const { isMultiSelected, isFirstInMultiSelection } = useSelect(
      (select) => {
        const store = select(blockEditorStore);
        const multiIds = store.getMultiSelectedBlockClientIds();
        const isMulti = multiIds.length > 0;

        return {
          isMultiSelected: isMulti,
          isFirstInMultiSelection: isMulti && multiIds[0] === clientId,
        };
      },
      [clientId],
    );

    // During multi-selection, only render the button on the first selected block
    if (isMultiSelected && !isFirstInMultiSelection) {
      return <BlockEdit {...props} />;
    }

    const handleWrap = () => {
      const store = dataSelect(blockEditorStore);
      const allSelectedClientIds = store.getMultiSelectedBlockClientIds();

      // Build the selected block list on demand so useSelect only returns stable values.
      const allSelectedBlocks = allSelectedClientIds
        .map((selectedClientId) => store.getBlock(selectedClientId))
        .filter(Boolean);

      if (allSelectedBlocks.length > 0) {
        const clonedBlocks = allSelectedBlocks.map((b) => cloneBlock(b));
        const containerBlock = createBlock(
          'webentor/l-flexible-container',
          {},
          clonedBlocks,
        );
        replaceBlocks(allSelectedClientIds, [containerBlock]);
      } else {
        const currentBlock = store.getBlock(clientId);

        if (!currentBlock) return;

        const clonedBlock = cloneBlock(currentBlock);
        const containerBlock = createBlock(
          'webentor/l-flexible-container',
          {},
          [clonedBlock],
        );
        replaceBlocks(clientId, [containerBlock]);
      }
    };

    return (
      <Fragment>
        <BlockControls group="other">
          <ToolbarGroup>
            <ToolbarButton
              icon={groupIcon}
              label={__('Wrap with Flexible Container', 'webentor')}
              onClick={handleWrap}
            />
          </ToolbarGroup>
        </BlockControls>

        <BlockEdit {...props} />
      </Fragment>
    );
  };
}, 'withWrapContainerButton');

// Self-register -- imported from core editor.ts, no manual init needed
addFilter(
  'editor.BlockEdit',
  'webentor/blockEdit/wrapWithContainer',
  withWrapContainerButton,
);
