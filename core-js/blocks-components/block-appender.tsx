import { Inserter } from '@wordpress/block-editor';
import { Button, IconType } from '@wordpress/components';

type WebentorBlockAppenderProps = {
  rootClientId: string | null;
  text: string;
  icon?: IconType;
  variant?: 'primary' | 'secondary' | 'tertiary';
};

/**
 * Block appender component with customizable button.
 */
export const WebentorBlockAppender: React.FC<WebentorBlockAppenderProps> = ({
  rootClientId,
  text,
  icon,
  variant,
}) => {
  return (
    <Inserter
      rootClientId={rootClientId}
      renderToggle={({ onToggle }) => (
        <Button
          className="webentor-block-appender"
          onClick={onToggle}
          // disabled={disabled}
          icon={icon ?? 'plus'}
          text={text}
          variant={variant ?? 'secondary'}
        />
      )}
      isAppender
    />
  );
};
