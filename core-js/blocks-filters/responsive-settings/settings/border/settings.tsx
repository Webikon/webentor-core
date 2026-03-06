/**
 * BorderAndRadiusSettings — Combined inline settings component
 * for both border and border-radius controls.
 *
 * This is the SettingsComponent for the border module, rendered
 * inside the BorderPanel by the registry pattern.
 */
import { SettingsComponentProps } from '../../types';
import { BorderRadiusSettings } from './border-radius/settings';
import { BorderSettings } from './border/settings';

export const BorderAndRadiusSettings = (props: SettingsComponentProps) => {
  if (!props.attributes?.border) return null;

  return (
    <>
      <BorderSettings {...props} />
      <BorderRadiusSettings {...props} />
    </>
  );
};
