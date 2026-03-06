/**
 * InheritedIndicator — shows when a setting section is visible due to
 * breakpoint cascading (min-width inheritance) rather than an explicit
 * value at the current breakpoint.
 *
 * Displays e.g. "Inherited from basic" so the user understands why
 * flexbox/grid controls appear even though no display value is explicitly
 * set at the active breakpoint.
 */
import { __, sprintf } from '@wordpress/i18n';

interface InheritedIndicatorProps {
  /** The breakpoint name the value cascades from (e.g. 'basic', 'sm') */
  fromBreakpoint: string;
}

const INDICATOR_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: '#757575',
  fontStyle: 'italic',
  marginBottom: '8px',
};

export const InheritedIndicator = ({
  fromBreakpoint,
}: InheritedIndicatorProps) => {
  return (
    <div style={INDICATOR_STYLE}>
      {sprintf(__('Inherited from %s', 'webentor'), fromBreakpoint)}
    </div>
  );
};
