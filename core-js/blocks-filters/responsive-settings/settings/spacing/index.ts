export { SpacingPanel } from './panel';
export { SpacingSettings } from './settings';
export {
  getSpacingProperties,
  getMarginSides,
  getPaddingSides,
  hasSpacingSettingsForBreakpoint,
} from './properties';

// Side-effect: registers with SettingsRegistry
import './registration';
