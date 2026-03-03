import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { link, linkOff } from '@wordpress/icons';

export type LinkMode = 'all' | 'horizontal' | 'vertical' | 'individual';

interface LinkedValuesControlProps {
  isLinked: boolean;
  onToggle: () => void;
  onReset?: () => void;
  resetDisabled?: boolean;
  /** Label shown when linked */
  linkLabel?: string;
  /** Label shown when unlinked */
  unlinkLabel?: string;
}

/**
 * Generic link/unlink toggle with optional reset button.
 * Extracted from the border/border-radius pattern for reuse in spacing, border, etc.
 */
export const LinkedValuesControl = ({
  isLinked,
  onToggle,
  onReset,
  resetDisabled = false,
  linkLabel,
  unlinkLabel,
}: LinkedValuesControlProps) => {
  return (
    <div className="wbtr:flex wbtr:justify-between">
      <Button
        icon={isLinked ? link : linkOff}
        onClick={onToggle}
        label={
          isLinked
            ? (unlinkLabel ?? __('Unlink sides', 'webentor'))
            : (linkLabel ?? __('Link sides', 'webentor'))
        }
      />

      {onReset && (
        <Button
          variant="tertiary"
          onClick={onReset}
          disabled={resetDisabled}
          label={__('Reset to defaults', 'webentor')}
          showTooltip
        >
          {__('Reset', 'webentor')}
        </Button>
      )}
    </div>
  );
};
