import { __ } from '@wordpress/i18n';

export const DisabledSliderInfo = () => (
  <div style={{ marginTop: '16px', marginBottom: '16px', fontSize: '12px' }}>
    {__(
      'When Slider is enabled for this breakpoint, these settings are ignored.',
      'webentor',
    )}
  </div>
);
