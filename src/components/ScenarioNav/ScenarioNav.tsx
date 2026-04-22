import * as React from 'react';
import { Nav, INavLinkGroup } from '@fluentui/react/lib/Nav';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Icon } from '@fluentui/react/lib/Icon';
import { IconButton } from '@fluentui/react/lib/Button';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { FlowStep } from '../../types/models';

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: {
      width: 240,
      borderRight: `1px solid ${theme.palette.neutralLight}`,
      backgroundColor: theme.palette.white,
      overflowY: 'auto' as const,
      flexShrink: 0,
      transition: 'width 200ms ease',
    },
    collapsed: {
      width: 0,
      overflow: 'hidden' as const,
      borderRight: 'none',
    },
    header: {
      padding: '12px 16px',
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
    },
    headerIcon: {
      backgroundColor: theme.palette.themePrimary,
      color: theme.palette.white,
      width: 28,
      height: 28,
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    collapseBtn: {
      position: 'absolute' as const,
      right: -16,
      top: 8,
      zIndex: 1,
      width: 24,
      height: 24,
      borderRadius: '50%',
      backgroundColor: theme.palette.white,
      border: `1px solid ${theme.palette.neutralLight}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    },
  })
);

export interface IScenarioNavProps {
  activeStep: FlowStep;
  onStepChange: (step: FlowStep) => void;
}

export const ScenarioNav: React.FC<IScenarioNavProps> = ({ activeStep, onStepChange }) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const navLinkGroups: INavLinkGroup[] = [
    {
      name: 'Initiate',
      links: [
        { name: 'Scenario Setup', url: '', key: 'scenarioSetup', icon: 'Settings' },
        { name: 'Contacts', url: '', key: 'contacts', icon: 'People' },
        { name: 'Price Settings', url: '', key: 'priceSettings', icon: 'Money' },
      ],
    },
    {
      name: 'Configure',
      links: [
        { name: 'Products', url: '', key: 'configProducts', icon: 'ProductList' },
        { name: 'Future Products', url: '', key: 'products', icon: 'ProductVariant' },
        { name: 'SA Credits', url: '', key: 'saCredits', icon: 'Certificate' },
        { name: 'Notes and T&Cs', url: '', key: 'notes', icon: 'EditNote' },
      ],
    },
    {
      name: 'Manage',
      links: [
        { name: 'Justifications', url: '', key: 'justifications', icon: 'TextDocument' },
        { name: 'Errors & Warnings', url: '', key: 'errorsWarnings', icon: 'Warning' },
        { name: 'Exceptions & concessions', url: '', key: 'exceptions', icon: 'EntitlementRedemption' },
        { name: 'Amendments', url: '', key: 'amendments', icon: 'PageEdit' },
      ],
    },
    {
      links: [
        { name: 'CPS & Amendment', url: '', key: 'cpsAmendment', icon: 'DocumentSet' },
        { name: 'Generate', url: '', key: 'generate', icon: 'Generate' },
        { name: 'Documents', url: '', key: 'documents', icon: 'DocumentApproval' },
      ],
    },
    {
      name: 'Workflows (0)',
      links: [
        { name: 'All Workflows', url: '', key: 'allWorkflows', icon: 'Flow' },
      ],
    },
  ];

  const stepKeyMap: Record<string, FlowStep> = {
    products: 'products',
    amendments: 'amendments',
    errorsWarnings: 'errorsWarnings',
    generate: 'generate',
    documents: 'documents',
  };

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <IconButton
        iconProps={{ iconName: isCollapsed ? 'ChevronRight' : 'ChevronLeft' }}
        title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        onClick={() => setIsCollapsed(!isCollapsed)}
        styles={{
          root: {
            position: 'absolute',
            right: isCollapsed ? -28 : -14,
            top: 8,
            zIndex: 10,
            width: 24,
            height: 24,
            minWidth: 24,
            minHeight: 24,
            borderRadius: '50%',
            backgroundColor: theme.palette.white,
            border: `1px solid ${theme.palette.neutralLight}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          },
          icon: { fontSize: 10 },
        }}
      />
      <Stack className={`${classNames.root} ${isCollapsed ? classNames.collapsed : ''}`}>
        <Stack horizontal verticalAlign="center" className={classNames.header} tokens={{ childrenGap: 8 }}>
          <div className={classNames.headerIcon}>
            <Icon iconName="ClipboardList" styles={{ root: { fontSize: 14, color: theme.palette.white } }} />
          </div>
          <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>Scenario Detail</Text>
        </Stack>
        <Nav
          groups={navLinkGroups}
          selectedKey={activeStep}
          onLinkClick={(ev, item) => {
            ev?.preventDefault();
            if (item?.key && stepKeyMap[item.key]) {
              onStepChange(stepKeyMap[item.key]);
            }
          }}
          styles={{
            root: { width: '100%' },
            groupContent: { marginBottom: 0 },
            link: { paddingLeft: 16, height: 36, lineHeight: '36px' },
            navItem: { marginBottom: 0 },
          }}
        />
      </Stack>
    </div>
  );
};
