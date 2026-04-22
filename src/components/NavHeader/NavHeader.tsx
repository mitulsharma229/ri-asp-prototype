import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { IconButton } from '@fluentui/react/lib/Button';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { Icon } from '@fluentui/react/lib/Icon';

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: {
      backgroundColor: '#323130',
      height: 48,
      paddingLeft: 12,
      paddingRight: 12,
    },
    appName: {
      color: theme.palette.white,
      fontWeight: 600,
      fontSize: 14,
      marginLeft: 8,
      whiteSpace: 'nowrap' as const,
    },
    headerBtn: {
      color: theme.palette.white,
    },
    notifBadge: {
      position: 'relative' as const,
    },
    badge: {
      position: 'absolute' as const,
      top: 4,
      right: 4,
      width: 14,
      height: 14,
      borderRadius: '50%',
      backgroundColor: '#D13438',
      color: 'white',
      fontSize: 9,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
    },
  })
);

const headerBtnStyles = {
  root: { color: 'white', width: 40, height: 40 },
  rootHovered: { color: 'white', backgroundColor: 'rgba(255,255,255,0.15)' },
  icon: { color: 'white' },
};

export const NavHeader: React.FC = () => {
  const theme = useTheme();
  const classNames = getClassNames(theme);

  return (
    <Stack horizontal verticalAlign="center" className={classNames.root} tokens={{ childrenGap: 0 }}>
      <IconButton iconProps={{ iconName: 'GlobalNavButton' }} ariaLabel="Menu" styles={headerBtnStyles} />
      <Text className={classNames.appName}>Microsoft Volume Licensing Central</Text>
      <Stack.Item grow={1}><span /></Stack.Item>
      <SearchBox
        placeholder="Search"
        underlined
        styles={{
          root: { width: 260, backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'transparent', borderRadius: 4 },
          field: { color: theme.palette.white, '::placeholder': { color: 'rgba(255,255,255,0.7)' } },
          icon: { color: 'rgba(255,255,255,0.8)' },
        }}
      />
      <IconButton iconProps={{ iconName: 'Waffle' }} ariaLabel="Apps" styles={headerBtnStyles} />
      <IconButton iconProps={{ iconName: 'TVMonitor' }} ariaLabel="Desktop" styles={headerBtnStyles} />
      <div className={classNames.notifBadge}>
        <IconButton iconProps={{ iconName: 'Ringer' }} ariaLabel="Notifications" styles={headerBtnStyles} />
        <div className={classNames.badge}>1</div>
      </div>
      <IconButton iconProps={{ iconName: 'Help' }} ariaLabel="Help" styles={headerBtnStyles} />
      <IconButton iconProps={{ iconName: 'Permissions' }} ariaLabel="Permissions" styles={headerBtnStyles} />
      <IconButton iconProps={{ iconName: 'Settings' }} ariaLabel="Settings" styles={headerBtnStyles} />
      <Persona
        text="SM"
        size={PersonaSize.size32}
        hidePersonaDetails
        styles={{ root: { cursor: 'pointer', marginLeft: 4 } }}
      />
    </Stack>
  );
};
