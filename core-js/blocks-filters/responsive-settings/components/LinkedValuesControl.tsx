import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { link, linkOff } from '@wordpress/icons';

export type LinkMode = 'linked' | 'unlinked';

interface LinkedValuesControlProps {
  mode: LinkMode;
  onModeChange: (mode: LinkMode) => void;
  onReset?: () => void;
  resetDisabled?: boolean;
}

/**
 * Toggle button for linking/unlinking spacing sides.
 * Linked = horizontal+vertical pairs synced; Unlinked = all 4 independent.
 */
export const LinkedValuesControl = ({
  mode,
  onModeChange,
  onReset,
  resetDisabled = false,
}: LinkedValuesControlProps) => {
  const isLinked = mode === 'linked';

  return (
    <div className="wbtr:flex wbtr:grow-1 wbtr:items-center wbtr:justify-between">
      <Button
        icon={isLinked ? linkOff : link}
        isPressed={isLinked}
        onClick={() => onModeChange(isLinked ? 'unlinked' : 'linked')}
        label={
          isLinked
            ? __('Unlink sides', 'webentor')
            : __('Link sides', 'webentor')
        }
        showTooltip
        size="small"
      />

      {onReset && (
        <Button
          variant="tertiary"
          onClick={onReset}
          disabled={resetDisabled}
          label={__('Reset to defaults', 'webentor')}
          showTooltip
          size="small"
        >
          {__('Reset', 'webentor')}
        </Button>
      )}
    </div>
  );
};
