import { CustomSelectControl } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

type TypographyOption = {
  key: string;
  name: string;
  value: string;
};

type WebentorTypographyPickerSelectProps = {
  __next40pxDefaultSize?: boolean;
  onChange: (value: string) => void;
  options: TypographyOption[];
  value?: string;
};

export const WebentorTypographyPickerSelect = (
  props: WebentorTypographyPickerSelectProps,
) => {
  const { __next40pxDefaultSize, value, onChange, options } = props;

  const selectedOption = value
    ? options.find((option) => option.value === value)
    : null;

  return (
    <div className="wbtr:w-full">
      <CustomSelectControl
        __next40pxDefaultSize={__next40pxDefaultSize}
        className="components-typography-picker__select"
        label={__('Custom Typography')}
        describedBy={sprintf(
          // translators: %s: Currently selected typography.
          __('Currently selected typography: %s'),
          selectedOption?.name,
        )}
        options={options}
        value={selectedOption}
        showSelectedHint
        onChange={({ selectedItem }) => {
          onChange(selectedItem.value);
        }}
      />
    </div>
  );
};
