import * as React from 'react';
import { DetailsList, IColumn, SelectionMode, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link } from '@fluentui/react/lib/Link';
import { ActionButton, IconButton, PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { IAmendment, EMPOWERMENT_OPTIONS } from '../../types/models';

type PanelMode = 'edit' | 'preview';

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: { padding: '16px 24px', flex: 1 },
    sectionHeader: {
      backgroundColor: theme.palette.neutralLighterAlt,
      padding: '10px 16px',
      fontWeight: 600,
      fontSize: 14,
    },
    digitisedBadge: {
      backgroundColor: '#107C10',
      color: theme.palette.white,
      borderRadius: 4,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 600,
    },
    scenarioSection: {
      backgroundColor: theme.palette.neutralLighterAlt,
      padding: '12px 16px',
      marginTop: 16,
    },
    editPanelBody: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden' as const,
      height: '100%',
    },
    docPreview: {
      flex: 55,
      backgroundColor: '#f3f2f1',
      overflow: 'auto' as const,
      padding: 16,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    docPreviewFull: {
      flex: 1,
      backgroundColor: '#f3f2f1',
      overflow: 'auto' as const,
      padding: 16,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    previewToolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      marginBottom: 12,
      flexShrink: 0,
    },
    docPage: {
      backgroundColor: theme.palette.white,
      padding: '32px 40px',
      flex: 1,
      boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
      overflow: 'auto' as const,
    },
    editSidebar: {
      flex: 45,
      borderLeft: `1px solid ${theme.palette.neutralLight}`,
      overflow: 'auto' as const,
      padding: '0 24px',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    readOnlyTable: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: 12,
    },
    readOnlyTh: {
      padding: '8px 8px',
      textAlign: 'left' as const,
      fontWeight: 600,
      fontSize: 11,
      color: theme.palette.neutralPrimary,
      backgroundColor: theme.palette.neutralLighterAlt,
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
    },
    readOnlyTd: {
      padding: '6px 8px',
      borderBottom: `1px solid ${theme.palette.neutralLighter}`,
      fontSize: 12,
      color: theme.palette.neutralPrimary,
    },
    fieldsLabel: {
      fontWeight: 600,
      fontSize: 14,
      color: theme.palette.neutralPrimary,
      padding: '12px 0 8px',
    },
    tableCollapseHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer',
      padding: '8px 0',
    },
    editableField: {
      padding: '8px 0',
      borderBottom: `1px solid ${theme.palette.neutralLighter}`,
    },
  })
);

export interface IAmendmentsViewProps {
  amendments: IAmendment[];
}

export const AmendmentsView: React.FC<IAmendmentsViewProps> = ({ amendments }) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const [editAmendment, setEditAmendment] = React.useState<IAmendment | null>(null);
  const [panelMode, setPanelMode] = React.useState<PanelMode>('edit');
  const [isTableCollapsed, setIsTableCollapsed] = React.useState(false);
  const [isFieldsCollapsed, setIsFieldsCollapsed] = React.useState(false);

  const openEdit = React.useCallback((item: IAmendment) => {
    setEditAmendment(item);
    setPanelMode('edit');
    setIsTableCollapsed(false);
    setIsFieldsCollapsed(false);
  }, []);

  const openPreview = React.useCallback((item: IAmendment) => {
    setEditAmendment(item);
    setPanelMode('preview');
  }, []);

  const columns: IColumn[] = React.useMemo(
    () => [
      {
        key: 'drag', name: '', minWidth: 24, maxWidth: 24,
        onRender: () => <Icon iconName="GripperDotsVertical" styles={{ root: { color: theme.palette.neutralTertiary, cursor: 'grab' } }} />,
      },
      {
        key: 'code', name: 'Code', minWidth: 120, maxWidth: 160, isResizable: true,
        onRender: (item: IAmendment) => (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
            <Link onClick={() => openEdit(item)}>{item.code}</Link>
            {item.isDigitised && <Text className={classNames.digitisedBadge}>Digitised</Text>}
          </Stack>
        ),
      },
      {
        key: 'title', name: 'Title', minWidth: 200, maxWidth: 300, isResizable: true,
        onRender: (item: IAmendment) => <Link onClick={() => openEdit(item)}>{item.title}</Link>,
      },
      { key: 'language', name: 'Language', fieldName: 'language', minWidth: 80, maxWidth: 100 },
      {
        key: 'concessionId', name: 'Concession ID', minWidth: 100, maxWidth: 120,
        onRender: (item: IAmendment) => (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
            <Link>{item.concessionId}</Link>
            <Icon iconName="OpenInNewWindow" styles={{ root: { fontSize: 12, color: theme.palette.themePrimary } }} />
          </Stack>
        ),
      },
      {
        key: 'empowermentLevel', name: 'Empowerment level', minWidth: 120, maxWidth: 150,
        onRender: (item: IAmendment) => (
          <Dropdown
            selectedKey={item.empowermentLevel}
            options={EMPOWERMENT_OPTIONS as IDropdownOption[]}
            styles={{ dropdown: { minWidth: 100 } }}
            onRenderTitle={(options) => {
              const opt = options?.[0];
              if (!opt) return null;
              return (
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    backgroundColor: opt.key === 'Blue' ? '#0078d4' : opt.key === 'Green' ? '#107C10' : opt.key === 'Yellow' ? '#FFB900' : '#D13438',
                  }} />
                  <span>{opt.text}</span>
                </Stack>
              );
            }}
          />
        ),
      },
      { key: 'modifiedBy', name: 'Modified by', fieldName: 'modifiedBy', minWidth: 100, maxWidth: 140 },
      { key: 'modifiedOn', name: 'Modified on', fieldName: 'modifiedOn', minWidth: 100, maxWidth: 130 },
      {
        key: 'actions', name: 'Actions', minWidth: 40, maxWidth: 40,
        onRender: (item: IAmendment) => (
          <IconButton
            iconProps={{ iconName: 'MoreVertical' }} title="Options"
            menuProps={{
              items: [
                { key: 'edit', text: 'Edit amendment', iconProps: { iconName: 'Edit' }, onClick: () => openEdit(item) },
                { key: 'preview', text: 'Preview', iconProps: { iconName: 'View' }, onClick: () => openPreview(item) },
                { key: 'delete', text: 'Delete', iconProps: { iconName: 'Delete' } },
              ],
            }}
            styles={{ root: { color: theme.palette.neutralSecondary } }}
          />
        ),
      },
    ],
    [theme, classNames, openEdit, openPreview]
  );

  const tableRows = React.useMemo(() =>
    Array.from({ length: 14 }).map((_, i) => ({
      product: `Fabric Capacity Reservation${i < 4 ? '' : ` - F${(i + 1) * 2}`}`,
      commitment: '1',
      discount: '3',
      region: 'US West',
      startDate: 'Nov 21, 2026',
      endDate: 'Nov 21, 2027',
    })),
  []);

  const renderDocumentPreview = () => (
    <div className={classNames.docPage}>
      <Stack horizontal horizontalAlign="space-between" styles={{ root: { marginBottom: 16 } }}>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <div style={{ width: 20, height: 20, backgroundColor: '#0078d4', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon iconName="WindowsLogo" styles={{ root: { color: 'white', fontSize: 12 } }} />
          </div>
          <Text styles={{ root: { fontWeight: 600, fontSize: 13, color: '#0078d4' } }}>Microsoft</Text>
        </Stack>
        <Text styles={{ root: { fontSize: 11, color: theme.palette.neutralSecondary } }}>Volume Licensing</Text>
      </Stack>
      <Text styles={{ root: { fontSize: 11, color: theme.palette.neutralSecondary, marginBottom: 4 } }}>&lt;Choose Enrollment&gt;</Text>
      <Text styles={{ root: { fontWeight: 600, fontSize: 13, marginBottom: 2 } }}>
        Azure Reservations Discounting - Fabric Capacity Reservation
      </Text>
      <Text styles={{ root: { fontSize: 11, marginBottom: 12 } }}>Amendment ID {editAmendment?.code}</Text>
      <Text styles={{ root: { fontSize: 9, color: theme.palette.neutralSecondary, marginBottom: 12, lineHeight: '14px' } }}>
        Azure Commitment Discount is not applicable to Microsoft Azure Reserved Instances (&quot;RIs&quot;). Microsoft agrees to discount the following RIs as outlined in the table below. The discount will be a fixed percentage based on the list price at the time the Enrolled Affiliate completes the purchase in the Azure portal. The discounted price will apply for the duration of the reservation commitment. Discounts cannot be applied retroactively.
      </Text>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, marginTop: 8 }}>
        <thead>
          <tr style={{ backgroundColor: '#0078d4', color: 'white' }}>
            <th style={{ padding: '3px 5px', textAlign: 'left', fontWeight: 600 }}>Reserved Instance</th>
            <th style={{ padding: '3px 5px', textAlign: 'left', fontWeight: 600 }}>Commitment Duration</th>
            <th style={{ padding: '3px 5px', textAlign: 'left', fontWeight: 600 }}>Discount Percentage</th>
            <th style={{ padding: '3px 5px', textAlign: 'left', fontWeight: 600 }}>Region</th>
            <th style={{ padding: '3px 5px', textAlign: 'left', fontWeight: 600 }}>Discount Start Date</th>
            <th style={{ padding: '3px 5px', textAlign: 'left', fontWeight: 600 }}>Discount End Date</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e1dfdd' }}>
              <td style={{ padding: '2px 5px' }}>Fabric Capacity Reservation</td>
              <td style={{ padding: '2px 5px' }}>1</td>
              <td style={{ padding: '2px 5px' }}>3</td>
              <td style={{ padding: '2px 5px' }}>US West</td>
              <td style={{ padding: '2px 5px' }}>November 21, 2026</td>
              <td style={{ padding: '2px 5px' }}>November 21, 2027</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Stack horizontal horizontalAlign="space-between" styles={{ root: { marginTop: 16, paddingTop: 8, borderTop: `1px solid ${theme.palette.neutralLighter}` } }}>
        <Text styles={{ root: { fontSize: 8, color: theme.palette.neutralTertiary } }}>
          Enrollment(ID)/ID(Cust(ID)) &nbsp;&nbsp; Special Pricing for Microsoft 365 {editAmendment?.code}
        </Text>
        <Text styles={{ root: { fontSize: 8, color: theme.palette.neutralTertiary } }}>Page 1 of 1</Text>
      </Stack>
    </div>
  );

  const renderPreviewToolbar = () => (
    <div className={classNames.previewToolbar}>
      <IconButton iconProps={{ iconName: 'ChevronLeft' }} title="Previous page" disabled styles={{ root: { width: 28, height: 28 } }} />
      <IconButton iconProps={{ iconName: 'ChevronRight' }} title="Next page" disabled styles={{ root: { width: 28, height: 28 } }} />
      <Text styles={{ root: { fontSize: 12, margin: '0 8px' } }}>1 / 1</Text>
      <IconButton iconProps={{ iconName: 'ZoomOut' }} title="Zoom out" styles={{ root: { width: 28, height: 28 } }} />
      <IconButton iconProps={{ iconName: 'ZoomIn' }} title="Zoom in" styles={{ root: { width: 28, height: 28 } }} />
      <Text styles={{ root: { fontSize: 12, margin: '0 4px' } }}>80%</Text>
      <IconButton iconProps={{ iconName: 'FullScreen' }} title="Full screen" styles={{ root: { width: 28, height: 28 } }} />
      <div style={{ flex: 1 }} />
      {panelMode === 'edit' && (
        <ActionButton iconProps={{ iconName: 'View' }} text="Collapse Preview" onClick={() => setPanelMode('preview')} />
      )}
      {panelMode === 'preview' && (
        <ActionButton iconProps={{ iconName: 'Edit' }} text="Show Edit Panel" onClick={() => setPanelMode('edit')} />
      )}
    </div>
  );

  const renderEditPanel = () => {
    if (!editAmendment) return null;

    const isPreviewOnly = panelMode === 'preview';
    const panelTitle = isPreviewOnly ? `Preview: ${editAmendment.code}` : 'Edit amendment';

    return (
      <Panel
        isOpen={!!editAmendment}
        onDismiss={() => setEditAmendment(null)}
        type={PanelType.custom}
        customWidth="80vw"
        headerText={panelTitle}
        isFooterAtBottom
        onRenderFooterContent={() => (
          <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { padding: '8px 0' } }}>
            {!isPreviewOnly && <PrimaryButton text="Save and Preview" onClick={() => setEditAmendment(null)} />}
            <DefaultButton text="Close" onClick={() => setEditAmendment(null)} />
          </Stack>
        )}
        styles={{
          main: { padding: 0 },
          content: { padding: 0, display: 'flex', flexDirection: 'column', flex: 1 },
          scrollableContent: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
          footer: {
            borderTop: `1px solid ${theme.palette.neutralLight}`,
            backgroundColor: theme.palette.white,
            padding: '0 24px',
          },
        }}
      >
        <div className={classNames.editPanelBody}>
          {/* Document Preview Area */}
          <div className={isPreviewOnly ? classNames.docPreviewFull : classNames.docPreview}>
            {renderPreviewToolbar()}
            {renderDocumentPreview()}
          </div>

          {/* Edit Sidebar — only shown in edit mode */}
          {!isPreviewOnly && (
            <div className={classNames.editSidebar}>
              <Pivot styles={{ root: { borderBottom: `1px solid ${theme.palette.neutralLight}` } }}>
                <PivotItem headerText="Edit Fields and tables" itemKey="fieldsAndTables">
                  <Stack tokens={{ childrenGap: 8 }} styles={{ root: { paddingTop: 16 } }}>
                    {/* Number & date format */}
                    <Stack tokens={{ childrenGap: 4 }}>
                      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                        <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>
                          Number &amp; date format <span style={{ color: '#A80000' }}>*</span>
                        </Text>
                        <Icon iconName="Info" styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }} />
                      </Stack>
                      <Dropdown
                        selectedKey="en-us"
                        options={[{ key: 'en-us', text: 'English (United States)' }, { key: 'en-gb', text: 'English (United Kingdom)' }, { key: 'de-de', text: 'German (Germany)' }, { key: 'fr-fr', text: 'French (France)' }]}
                      />
                    </Stack>

                    {/* Fields section */}
                    <div
                      className={classNames.tableCollapseHeader}
                      onClick={() => setIsFieldsCollapsed((prev) => !prev)}
                      style={{ borderBottom: `1px solid ${theme.palette.neutralLight}`, paddingBottom: 8 }}
                    >
                      <Icon iconName={isFieldsCollapsed ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 10 } }} />
                      <Text className={classNames.fieldsLabel} styles={{ root: { padding: 0 } }}>Fields</Text>
                    </div>

                    {!isFieldsCollapsed && (
                      <Stack tokens={{ childrenGap: 8 }} styles={{ root: { paddingLeft: 4 } }}>
                        <div className={classNames.editableField}>
                          <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary, marginBottom: 4, display: 'block' } }}>Amendment Title</Text>
                          <TextField defaultValue={editAmendment.title} styles={{ root: { width: '100%' } }} />
                        </div>
                        <div className={classNames.editableField}>
                          <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary, marginBottom: 4, display: 'block' } }}>Language</Text>
                          <Dropdown
                            selectedKey="English"
                            options={[{ key: 'English', text: 'English' }, { key: 'French', text: 'French' }, { key: 'German', text: 'German' }, { key: 'Spanish', text: 'Spanish' }]}
                          />
                        </div>
                        <div className={classNames.editableField}>
                          <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary, marginBottom: 4, display: 'block' } }}>Concession ID</Text>
                          <Text styles={{ root: { fontSize: 13, fontWeight: 600 } }}>{editAmendment.concessionId}</Text>
                        </div>
                      </Stack>
                    )}

                    {/* Tables section */}
                    <Text className={classNames.fieldsLabel}>Tables</Text>

                    <div
                      className={classNames.tableCollapseHeader}
                      onClick={() => setIsTableCollapsed((prev) => !prev)}
                    >
                      <Icon iconName={isTableCollapsed ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 10 } }} />
                      <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Table 1</Text>
                    </div>

                    {!isTableCollapsed && (
                      <div style={{ overflowX: 'auto' }}>
                        <table className={classNames.readOnlyTable}>
                          <thead>
                            <tr>
                              <th className={classNames.readOnlyTh}>Product SKU Name</th>
                              <th className={classNames.readOnlyTh}>Commitment</th>
                              <th className={classNames.readOnlyTh}>Discount %</th>
                              <th className={classNames.readOnlyTh}>Region</th>
                              <th className={classNames.readOnlyTh}>Start Date</th>
                              <th className={classNames.readOnlyTh}>End Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableRows.map((row, i) => (
                              <tr key={i}>
                                <td className={classNames.readOnlyTd}>{row.product}...</td>
                                <td className={classNames.readOnlyTd}>{row.commitment}</td>
                                <td className={classNames.readOnlyTd}>{row.discount}</td>
                                <td className={classNames.readOnlyTd}>{row.region}</td>
                                <td className={classNames.readOnlyTd}>{row.startDate}</td>
                                <td className={classNames.readOnlyTd}>{row.endDate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Stack>
                </PivotItem>

                <PivotItem headerText="Edit Content" itemKey="content">
                  <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 16 } }}>
                    <Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary } }}>
                      Content editing allows you to modify the amendment text directly.
                    </Text>
                    <TextField
                      multiline rows={12}
                      defaultValue="Azure Commitment Discount is not applicable to Microsoft Azure Reserved Instances (&quot;RIs&quot;). Microsoft agrees to discount the following RIs as outlined in the table below. The discount will be a fixed percentage based on the list price at the time the Enrolled Affiliate completes the purchase in the Azure portal. The discounted price will apply for the duration of the reservation commitment. Discounts cannot be applied retroactively."
                      styles={{ root: { width: '100%' } }}
                    />
                  </Stack>
                </PivotItem>
              </Pivot>
            </div>
          )}
        </div>
      </Panel>
    );
  };

  return (
    <Stack className={classNames.root} tokens={{ childrenGap: 0 }}>
      <Stack horizontal verticalAlign="center" className={classNames.sectionHeader} tokens={{ childrenGap: 8 }}>
        <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>
          Added amendments ({amendments.length})
        </Text>
        <ActionButton iconProps={{ iconName: 'Add' }} text="Add" />
      </Stack>

      <MessageBar messageBarType={MessageBarType.info} isMultiline={false} styles={{ root: { marginTop: 8 } }}>
        Make sure the first row in the amendments list below is in the language you want for the final documents. You can rearrange the rows using the icons on the left.
      </MessageBar>

      <Text variant="small" styles={{ root: { color: theme.semanticColors.bodySubtext, padding: '8px 0 4px' } }}>
        Showing {amendments.length} amendment(s)
      </Text>

      <DetailsList
        items={amendments}
        columns={columns}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        getKey={(item) => (item as IAmendment).id}
        compact
      />

      <Stack className={classNames.scenarioSection} tokens={{ childrenGap: 12 }}>
        <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>Amendment scenario details</Text>
        <Stack horizontal tokens={{ childrenGap: 24 }}>
          <Stack tokens={{ childrenGap: 4 }} styles={{ root: { minWidth: 200 } }}>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
              <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>
                Scenario name <span style={{ color: '#A80000' }}>*</span>
              </Text>
              <Icon iconName="Edit" styles={{ root: { fontSize: 12, color: theme.palette.themePrimary, cursor: 'pointer' } }} />
              <Text styles={{ root: { fontSize: 12, color: theme.palette.themePrimary, cursor: 'pointer' } }}>Edit</Text>
            </Stack>
            <TextField defaultValue="Amendment_name" styles={{ root: { width: 200 } }} />
          </Stack>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Agreement type</Text>
            <Dropdown
              selectedKey="enrollment"
              options={[{ key: 'enrollment', text: 'Enrollment' }, { key: 'agreement', text: 'Agreement' }]}
              styles={{ dropdown: { minWidth: 200 } }}
            />
          </Stack>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Enrollment number</Text>
            <TextField placeholder="Enter" styles={{ root: { width: 200 } }} />
          </Stack>
        </Stack>
      </Stack>

      {renderEditPanel()}
    </Stack>
  );
};
