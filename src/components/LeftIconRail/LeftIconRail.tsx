import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { FlowStep } from '../../types/models';

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: {
      width: 40,
      backgroundColor: theme.palette.white,
      borderRight: `1px solid ${theme.palette.neutralLight}`,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      paddingTop: 8,
      gap: 2,
    },
    iconBtn: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      borderRadius: 4,
      border: 'none',
      backgroundColor: 'transparent',
      color: theme.palette.neutralSecondary,
      ':hover': {
        backgroundColor: theme.palette.neutralLighter,
      },
    },
    iconBtnActive: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      borderRadius: 4,
      border: 'none',
      backgroundColor: theme.palette.themeLighterAlt,
      color: theme.palette.themePrimary,
      borderLeft: `3px solid ${theme.palette.themePrimary}`,
    },
    separator: {
      height: 1,
      width: 28,
      backgroundColor: theme.palette.neutralLight,
      margin: '4px 0',
    },
  })
);

interface IIconItem {
  key: string;
  iconName: string;
  label: string;
  flowStep?: FlowStep;
  badge?: string;
}

const topIcons: IIconItem[] = [
  { key: 'grid', iconName: 'GridViewSmall', label: 'Overview' },
  { key: 'products', iconName: 'ProductList', label: 'Products', flowStep: 'products' },
  { key: 'people', iconName: 'People', label: 'Contacts' },
  { key: 'group', iconName: 'Group', label: 'Groups' },
  { key: 'shield', iconName: 'Shield', label: 'Compliance' },
  { key: 'lock', iconName: 'Lock', label: 'Security' },
];

const middleIcons: IIconItem[] = [
  { key: 'calendar', iconName: 'Calendar', label: 'Schedule' },
  { key: 'cube', iconName: 'CubeShape', label: 'Resources' },
  { key: 'doc', iconName: 'TextDocument', label: 'Notes', flowStep: 'documents' },
  { key: 'warning', iconName: 'Warning', label: 'Errors', flowStep: 'errorsWarnings' },
];

const bottomIcons: IIconItem[] = [
  { key: 'file', iconName: 'PageEdit', label: 'CPS', flowStep: 'amendments' },
  { key: 'filecheck', iconName: 'DocumentApproval', label: 'Documents', flowStep: 'documents' },
  { key: 'generate', iconName: 'Generate', label: 'Generate', flowStep: 'generate' },
];

export interface ILeftIconRailProps {
  activeStep: FlowStep;
  onStepChange: (step: FlowStep) => void;
}

export const LeftIconRail: React.FC<ILeftIconRailProps> = ({ activeStep, onStepChange }) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);

  const renderIcon = (item: IIconItem) => {
    const isActive = item.flowStep === activeStep;
    return (
      <button
        key={item.key}
        className={isActive ? classNames.iconBtnActive : classNames.iconBtn}
        onClick={() => item.flowStep && onStepChange(item.flowStep)}
        title={item.label}
        aria-label={item.label}
      >
        <Icon iconName={item.iconName} styles={{ root: { fontSize: 16 } }} />
      </button>
    );
  };

  return (
    <Stack className={classNames.root}>
      {topIcons.map(renderIcon)}
      <div className={classNames.separator} />
      {middleIcons.map(renderIcon)}
      <div className={classNames.separator} />
      {bottomIcons.map(renderIcon)}
    </Stack>
  );
};
