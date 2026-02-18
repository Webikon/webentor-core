import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import { setImmutably } from '@webentorCore/_utils';
import { BlockPanelProps } from '@webentorCore/block-filters/responsive-settings/types';

export const BlockLinkPanel = ({
  attributes,
  setAttributes,
}: BlockPanelProps) => {
  if (attributes?.blockLink === undefined) {
    return null;
  }

  return (
    <div className="w-link-settings" style={{ marginBottom: '16px' }}>
      <h3 style={{ padding: '16px', paddingBottom: '0px' }}>
        {__('Block Link', 'webentor')}
      </h3>
      <div style={{ padding: '16px', paddingTop: '0px', fontSize: '12px' }}>
        {__('This whole block can act like a link', 'webentor')}
      </div>
      <LinkControl
        value={attributes?.blockLink}
        settings={[
          {
            id: 'open_in_new_tab',
            title: __('New tab?', 'webentor'),
          },
        ]}
        onChange={(inputValue) =>
          setAttributes(setImmutably(attributes, ['blockLink'], inputValue))
        }
        onRemove={() =>
          setAttributes(setImmutably(attributes, ['blockLink'], null))
        }
        withCreateSuggestion={true}
        createSuggestion={(inputValue) =>
          setAttributes(setImmutably(attributes, ['blockLink'], inputValue))
        }
        createSuggestionButtonText={(newValue) =>
          `${__('New:', 'webentor')} ${newValue}`
        }
      />
    </div>
  );
};
