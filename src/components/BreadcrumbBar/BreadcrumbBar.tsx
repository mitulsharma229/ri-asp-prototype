import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Link } from '@fluentui/react/lib/Link';
import { Icon } from '@fluentui/react/lib/Icon';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: {
      padding: '8px 16px 0',
    },
    breadcrumb: {
      fontSize: 13,
    },
    chevron: {
      fontSize: 10,
      color: theme.palette.neutralSecondary,
      padding: '0 6px',
    },
    title: {
      fontSize: 20,
      fontWeight: 700,
      color: '#323130',
      padding: '4px 0',
    },
    separator: {
      margin: '0 8px',
      color: '#323130',
      fontWeight: 300,
    },
    lastModified: {
      fontSize: 12,
      color: theme.palette.neutralSecondary,
    },
  })
);

export interface IBreadcrumbBarProps {
  quoteName: string;
  quoteId: string;
  currentPage: string;
}

export const BreadcrumbBar: React.FC<IBreadcrumbBarProps> = ({ quoteName, quoteId, currentPage }) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);

  return (
    <Stack className={classNames.root}>
      <Stack horizontal verticalAlign="center" className={classNames.breadcrumb}>
        <Link styles={{ root: { fontSize: 13 } }}>Home</Link>
        <Icon iconName="ChevronRight" className={classNames.chevron} />
        <Link styles={{ root: { fontSize: 13 } }}>Deal Management</Link>
        <Icon iconName="ChevronRight" className={classNames.chevron} />
      </Stack>
      <Stack horizontal verticalAlign="baseline">
        <Text className={classNames.title}>
          {quoteName}: {quoteId}
        </Text>
        <Text className={classNames.separator}>|</Text>
        <Text className={classNames.title}>{currentPage}</Text>
        <Text className={classNames.lastModified} styles={{ root: { marginLeft: 12, alignSelf: 'center' } }}>
          Last Modified: Just now
        </Text>
      </Stack>
    </Stack>
  );
};
