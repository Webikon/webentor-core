/**
 * SizingSettings — width, height, min/max dimension controls.
 *
 * Rendered inside the DisplayLayoutPanel at order: 20.
 */
import { getBlockSupport } from '@wordpress/blocks';
import { Fragment, useMemo } from '@wordpress/element';

import { camelize } from '../../../../_utils';
import { DisabledSliderInfo } from '../../components/DisabledSliderInfo';
import { ResponsiveSelectGroup } from '../../components/ResponsiveSelectGroup';
import {
  PropertyDefinition,
  SelectOptionGroup,
  SettingsComponentProps,
} from '../../types';
import { isSliderEnabledForBreakpoint } from '../../utils';
import { createGroupedTwThemeValues } from '../shared/tw-values';
import { getSizingProperties } from './properties';

export const SizingSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  breakpoints,
  twTheme,
}: SettingsComponentProps) => {
  if (!attributes?.sizing) {
    return null;
  }

  const isSliderEnabled = isSliderEnabledForBreakpoint(
    name,
    attributes,
    breakpoint,
  );
  const sizingProperties = getSizingProperties(twTheme);

  /** Property name → [themeKey, prefix] for grouped value generation */
  const themeKeyMap: Record<string, [string, string]> = {
    height: ['height', 'h'],
    'min-height': ['minHeight', 'min-h'],
    'max-height': ['maxHeight', 'max-h'],
    width: ['width', 'w'],
    'min-width': ['minWidth', 'min-w'],
    'max-width': ['maxWidth', 'max-w'],
  };

  const valueGroups = useMemo(() => {
    const groups: Record<string, SelectOptionGroup[]> = {};
    for (const prop of sizingProperties) {
      if (!prop.groupedValues) continue;
      const mapping = themeKeyMap[prop.name];
      if (mapping) {
        groups[prop.name] = createGroupedTwThemeValues(
          twTheme,
          mapping[0],
          mapping[1],
        );
      }
    }
    return groups;
  }, [twTheme]);

  const webentorSupports = getBlockSupport(name, 'webentor') as
    | Record<string, any>
    | undefined;
  const supports = webentorSupports?.sizing;

  const isPropertyVisible = (property: PropertyDefinition) => {
    if (supports === true) return true;
    return supports?.[camelize(property.name)] === true;
  };

  const attributeKey = 'sizing';

  return (
    <Fragment>
      <div style={{ marginTop: '16px' }}>
        {isSliderEnabled && <DisabledSliderInfo />}
        <ResponsiveSelectGroup
          attributeKey={attributeKey}
          properties={sizingProperties}
          attributes={attributes}
          setAttributes={setAttributes}
          breakpoint={breakpoint}
          breakpoints={breakpoints}
          disabled={isSliderEnabled}
          isPropertyVisible={isPropertyVisible}
          valueGroups={valueGroups}
        />
      </div>
    </Fragment>
  );
};
