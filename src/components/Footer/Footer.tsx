import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: {
      borderTop: `1px solid ${theme.palette.neutralLight}`,
      padding: '8px 16px',
      backgroundColor: theme.palette.white,
      position: 'sticky' as const,
      bottom: 0,
      zIndex: 10,
      boxShadow: '0 -1px 4px rgba(0,0,0,0.08)',
      flexShrink: 0,
    },
    expandBtn: {
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: 'transparent',
      color: theme.palette.neutralSecondary,
      ':hover': {
        backgroundColor: theme.palette.neutralLighter,
      },
    },
  })
);

export interface IFooterProps {
  onNext?: () => void;
  onCancel?: () => void;
  onPrev?: () => void;
  nextLabel?: string;
  showPrev?: boolean;
  nextDisabled?: boolean;
}

export const Footer: React.FC<IFooterProps> = ({
  onNext,
  onCancel,
  onPrev,
  nextLabel = 'Next',
  showPrev = false,
  nextDisabled = false,
}) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);

  return (
    <Stack horizontal verticalAlign="center" className={classNames.root} tokens={{ childrenGap: 8 }}>
      <button className={classNames.expandBtn} title="Expand">
        <Icon iconName="DoubleChevronDown" styles={{ root: { fontSize: 12 } }} />
      </button>
      {showPrev && onPrev && (
        <DefaultButton text="Prev" onClick={onPrev} />
      )}
      {onNext && (
        <PrimaryButton text={nextLabel} onClick={onNext} disabled={nextDisabled} />
      )}
      {onCancel && (
        <DefaultButton text="Cancel" onClick={onCancel} />
      )}
    </Stack>
  );
};
