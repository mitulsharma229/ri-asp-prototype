import * as React from 'react';
import {
  DetailsList,
  IColumn,
  SelectionMode,
  CheckboxVisibility,
  DetailsListLayoutMode,
  IGroup,
} from '@fluentui/react/lib/DetailsList';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { PrimaryButton, DefaultButton, ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { Icon } from '@fluentui/react/lib/Icon';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { IAddedProduct, REGION_OPTIONS, COMMITMENT_OPTIONS } from '../../types/models';

type GridMode = 'default' | 'selected' | 'editing';

const PAGE_SIZE = 15;

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: {
      padding: '0 16px',
      flexShrink: 0,
    },
    toolbar: {
      padding: '4px 0',
    },
    gridAndDetailsWrapper: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden' as const,
    },
    gridArea: {
      flex: 1,
      overflowX: 'auto' as const,
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden' as const,
    },
    tableWrapper: {
      flex: 1,
      overflow: 'auto' as const,
    },
    paginationBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 12,
      padding: '8px 16px',
      borderTop: `1px solid ${theme.palette.neutralLight}`,
      backgroundColor: theme.palette.white,
      flexShrink: 0,
    },
    detailsPanel: {
      borderLeft: `1px solid ${theme.palette.neutralLight}`,
      width: 380,
      flexShrink: 0,
      backgroundColor: theme.palette.white,
      overflowY: 'auto' as const,
      padding: 0,
    },
    detailsPanelHeader: {
      padding: '20px 24px 0',
    },
    detailsPanelBody: {
      padding: '0 24px 24px',
    },
    detailsSectionHeader: {
      fontWeight: 600,
      fontSize: 14,
      padding: '16px 0 8px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      color: theme.palette.neutralPrimary,
    },
    detailsFieldGroup: {
      padding: '8px 0',
    },
    detailsFieldLabel: {
      fontWeight: 400,
      fontSize: 12,
      color: theme.palette.neutralSecondary,
      marginBottom: 2,
    },
    detailsFieldValue: {
      fontWeight: 600,
      fontSize: 13,
      color: theme.palette.neutralPrimary,
    },
    emptyDetails: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 24,
      textAlign: 'center' as const,
      color: theme.palette.neutralSecondary,
    },
    summaryTab: {
      fontWeight: 600,
      fontSize: 13,
      borderBottom: `2px solid ${theme.palette.themePrimary}`,
      paddingBottom: 8,
      marginTop: 12,
    },
  })
);

export interface IBulkEditValues {
  region?: string;
  commitment?: string;
  discountPercent?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface IProductGridProps {
  products: IAddedProduct[];
  onUpdateProduct: (id: string, field: keyof IAddedProduct, value: unknown) => void;
  onDeleteProducts: (ids: string[]) => void;
  onBulkEditApply: (ids: string[], values: IBulkEditValues) => void;
  onSave: () => void;
  onAddProducts: () => void;
  hasUnsavedChanges: boolean;
}

export const ProductGrid: React.FC<IProductGridProps> = ({
  products,
  onUpdateProduct,
  onDeleteProducts,
  onBulkEditApply,
  onSave,
  onAddProducts,
}) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [checkedIds, setCheckedIds] = React.useState<Set<string>>(new Set());
  const [mode, setMode] = React.useState<GridMode>('default');
  const [deleteDialogHidden, setDeleteDialogHidden] = React.useState(true);
  const [isBulkEditOpen, setIsBulkEditOpen] = React.useState(false);
  const [bulkEditValues, setBulkEditValues] = React.useState<IBulkEditValues>({});
  const [isColumnsCalloutOpen, setIsColumnsCalloutOpen] = React.useState(false);
  const [isFilterCalloutOpen, setIsFilterCalloutOpen] = React.useState(false);
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<string>>(new Set());
  const [filterField, setFilterField] = React.useState<string>('');
  const [filterValue, setFilterValue] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [showDetailsPanel, setShowDetailsPanel] = React.useState(false);
  const [localEdits, setLocalEdits] = React.useState<Map<string, Partial<IAddedProduct>>>(new Map());

  // Collapsed sections in details panel
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(new Set());

  const columnsBtnRef = React.useRef<HTMLDivElement>(null);
  const filterBtnRef = React.useRef<HTMLDivElement>(null);

  const hasChecked = checkedIds.size > 0;

  const toggleCheck = React.useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const selectedDetailItem = React.useMemo(() => {
    if (checkedIds.size === 0) return null;
    const firstId = Array.from(checkedIds)[0];
    return products.find((p) => p.id === firstId) || null;
  }, [checkedIds, products]);

  const displayProducts = React.useMemo(() => {
    if (mode !== 'editing' || localEdits.size === 0) return products;
    return products.map((p) => {
      const edits = localEdits.get(p.id);
      if (!edits) return p;
      const merged = { ...p, ...edits };
      if (edits.discountPercent !== undefined) {
        merged.priceNetUSD = merged.basePriceNetUSD * (1 - merged.discountPercent / 100);
      }
      return merged;
    });
  }, [products, localEdits, mode]);

  const filteredProducts = React.useMemo(() => {
    let result = displayProducts;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.productDetails.toLowerCase().includes(q) ||
          p.amendmentCode.toLowerCase().includes(q) ||
          p.partNumber.toLowerCase().includes(q)
      );
    }
    if (filterField && filterValue) {
      const fv = filterValue.toLowerCase();
      result = result.filter((p) => {
        const val = String((p as unknown as Record<string, unknown>)[filterField] || '').toLowerCase();
        return val.includes(fv);
      });
    }
    return result;
  }, [displayProducts, searchQuery, filterField, filterValue]);

  const toggleSelectAll = React.useCallback(() => {
    setCheckedIds((prev) => {
      if (prev.size === filteredProducts.length) return new Set();
      return new Set(filteredProducts.map((p) => p.id));
    });
  }, [filteredProducts]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pageStart = currentPage * PAGE_SIZE;
  const pagedProducts = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE);

  React.useEffect(() => { setCurrentPage(0); }, [searchQuery, filterField, filterValue]);

  const { sortedItems, groups } = React.useMemo(() => {
    const groupMap = new Map<string, IAddedProduct[]>();
    for (const p of pagedProducts) {
      const gName = p.groupName || 'Other';
      if (!groupMap.has(gName)) groupMap.set(gName, []);
      groupMap.get(gName)!.push(p);
    }
    const sorted: IAddedProduct[] = [];
    const grps: IGroup[] = [];
    let startIdx = 0;
    for (const [name, items] of groupMap) {
      grps.push({ key: name, name, startIndex: startIdx, count: items.length, isCollapsed: false });
      sorted.push(...items);
      startIdx += items.length;
    }
    return { sortedItems: sorted, groups: grps };
  }, [pagedProducts]);

  const handleLocalEdit = React.useCallback((id: string, field: keyof IAddedProduct, value: unknown) => {
    setLocalEdits((prev) => {
      const next = new Map(prev);
      const existing = next.get(id) || {};
      next.set(id, { ...existing, [field]: value });
      return next;
    });
  }, []);

  const handleEnterEditMode = React.useCallback(() => {
    if (checkedIds.size > 0) {
      setLocalEdits(new Map());
      setMode('editing');
    }
  }, [checkedIds.size]);

  const handleDiscardChanges = React.useCallback(() => {
    setLocalEdits(new Map());
    setMode('default');
    setCheckedIds(new Set());
  }, []);

  const handleSaveAndExit = React.useCallback(() => {
    localEdits.forEach((edits, id) => {
      Object.entries(edits).forEach(([field, value]) => {
        onUpdateProduct(id, field as keyof IAddedProduct, value);
      });
    });
    localEdits.forEach((edits, id) => {
      if (edits.discountPercent !== undefined) {
        const product = products.find((p) => p.id === id);
        if (product) {
          const newPrice = product.basePriceNetUSD * (1 - (edits.discountPercent as number) / 100);
          onUpdateProduct(id, 'priceNetUSD', newPrice);
        }
      }
    });
    onSave();
    setLocalEdits(new Map());
    setMode('default');
    setCheckedIds(new Set());
  }, [localEdits, onUpdateProduct, onSave, products]);

  const handleDelete = React.useCallback(() => {
    onDeleteProducts(Array.from(checkedIds));
    setDeleteDialogHidden(true);
    setCheckedIds(new Set());
    setLocalEdits(new Map());
    setMode('default');
  }, [checkedIds, onDeleteProducts]);

  const handleBulkEditApply = React.useCallback(() => {
    onBulkEditApply(Array.from(checkedIds), bulkEditValues);
    setIsBulkEditOpen(false);
    setBulkEditValues({});
    setCheckedIds(new Set());
    setMode('default');
  }, [checkedIds, bulkEditValues, onBulkEditApply]);

  const calcPriceNet = (item: IAddedProduct): number => {
    return item.basePriceNetUSD * (1 - item.discountPercent / 100);
  };

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section); else next.add(section);
      return next;
    });
  };

  const cellStyle: React.CSSProperties = { height: 36, display: 'flex', alignItems: 'center' };
  const editDropdownStyles = { root: { width: '100%' }, dropdown: { minWidth: 0, height: 32 } };
  const editTextFieldStyles = { root: { width: '100%' }, fieldGroup: { height: 32 } };
  const editDatePickerStyles = { root: { width: '100%' }, textField: { fieldGroup: { height: 32 } } };

  const columns: IColumn[] = React.useMemo(() => {
    const allChecked = filteredProducts.length > 0 && filteredProducts.every((p) => checkedIds.has(p.id));
    return [
      {
        key: 'checkbox', name: '', minWidth: 32, maxWidth: 32,
        onRenderHeader: () => <Checkbox checked={allChecked} onChange={toggleSelectAll} styles={{ root: { marginLeft: 4 } }} />,
        onRender: (item: IAddedProduct) => <Checkbox checked={checkedIds.has(item.id)} onChange={() => toggleCheck(item.id)} />,
      },
      {
        key: 'productDetails', name: 'Product description', minWidth: 240, maxWidth: 340, isResizable: true,
        onRender: (item: IAddedProduct) => <div style={cellStyle}><Text styles={{ root: { fontSize: 13 } }}>{item.productDetails}</Text></div>,
      },
      {
        key: 'amendmentCode', name: 'Amendment Code', minWidth: 120, maxWidth: 130, isResizable: true,
        onRender: (item: IAddedProduct) => <div style={cellStyle}><Text styles={{ root: { fontSize: 13 } }}>{item.amendmentCode}</Text></div>,
      },
      {
        key: 'region', name: 'Region', minWidth: 130, maxWidth: 150, isResizable: true,
        onRender: (item: IAddedProduct) => {
          if (mode === 'editing' && checkedIds.has(item.id)) {
            return <div style={cellStyle}><Dropdown selectedKey={item.region} options={REGION_OPTIONS as IDropdownOption[]} onChange={(_, opt) => handleLocalEdit(item.id, 'region', opt?.key || '')} styles={editDropdownStyles} placeholder="Select" /></div>;
          }
          return <div style={cellStyle}><Text styles={{ root: { fontSize: 13 } }}>{item.region || ''}</Text></div>;
        },
      },
      {
        key: 'commitment', name: 'Commitment', minWidth: 120, maxWidth: 140, isResizable: true,
        onRender: (item: IAddedProduct) => {
          if (mode === 'editing' && checkedIds.has(item.id)) {
            return <div style={cellStyle}><Dropdown selectedKey={item.commitment} options={COMMITMENT_OPTIONS as IDropdownOption[]} onChange={(_, opt) => handleLocalEdit(item.id, 'commitment', opt?.key || '')} styles={editDropdownStyles} placeholder="Select" /></div>;
          }
          return <div style={cellStyle}><Text styles={{ root: { fontSize: 13 } }}>{item.commitment || ''}</Text></div>;
        },
      },
      {
        key: 'discountPercent', name: 'Discount (%)', minWidth: 100, maxWidth: 120, isResizable: true,
        onRender: (item: IAddedProduct) => {
          if (mode === 'editing' && checkedIds.has(item.id)) {
            return <div style={cellStyle}><TextField value={String(item.discountPercent)} onChange={(_, val) => { const num = parseFloat(val || '0'); if (!isNaN(num) && num >= 0 && num <= 100) handleLocalEdit(item.id, 'discountPercent', num); }} placeholder="Discount %" styles={editTextFieldStyles} /></div>;
          }
          return <div style={cellStyle}><Text styles={{ root: { fontSize: 13 } }}>{item.discountPercent}%</Text></div>;
        },
      },
      {
        key: 'startDate', name: 'Start date', minWidth: 140, maxWidth: 160, isResizable: true,
        onRender: (item: IAddedProduct) => {
          if (mode === 'editing' && checkedIds.has(item.id)) {
            return <div style={cellStyle}><DatePicker value={item.startDate ? new Date(item.startDate) : undefined} onSelectDate={(date) => handleLocalEdit(item.id, 'startDate', date ? date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '')} placeholder="Start date" styles={editDatePickerStyles} /></div>;
          }
          return <div style={cellStyle}><Text styles={{ root: { fontSize: 13 } }}>{item.startDate}</Text></div>;
        },
      },
      {
        key: 'endDate', name: 'End date', minWidth: 140, maxWidth: 160, isResizable: true,
        onRender: (item: IAddedProduct) => {
          if (mode === 'editing' && checkedIds.has(item.id)) {
            return <div style={cellStyle}><DatePicker value={item.endDate ? new Date(item.endDate) : undefined} onSelectDate={(date) => handleLocalEdit(item.id, 'endDate', date ? date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '')} placeholder="End date" styles={editDatePickerStyles} /></div>;
          }
          return <div style={cellStyle}><Text styles={{ root: { fontSize: 13 } }}>{item.endDate}</Text></div>;
        },
      },
      {
        key: 'priceNetUSD', name: 'Price Net (USD)', minWidth: 110, maxWidth: 130, isResizable: true,
        onRender: (item: IAddedProduct) => <div style={cellStyle}><Text styles={{ root: { fontSize: 13 } }}>${calcPriceNet(item).toFixed(2)}</Text></div>,
      },
    ];
  }, [checkedIds, filteredProducts, mode, handleLocalEdit, toggleCheck, toggleSelectAll]);

  const visibleColumns = React.useMemo(
    () => columns.filter((c) => c.key === 'checkbox' || !hiddenColumns.has(c.key)),
    [columns, hiddenColumns]
  );

  const allColumnKeys = ['productDetails', 'amendmentCode', 'region', 'commitment', 'discountPercent', 'startDate', 'endDate', 'priceNetUSD'];
  const columnLabels: Record<string, string> = {
    productDetails: 'Product description', amendmentCode: 'Amendment Code', region: 'Region',
    commitment: 'Commitment', discountPercent: 'Discount (%)', startDate: 'Start date',
    endDate: 'End date', priceNetUSD: 'Price Net (USD)',
  };

  const filterFieldOptions: IDropdownOption[] = [
    { key: '', text: 'None' },
    ...allColumnKeys.map((k) => ({ key: k, text: columnLabels[k] })),
  ];

  const renderToolbar = () => {
    if (mode === 'editing') {
      return (
        <Stack horizontal verticalAlign="center" className={classNames.toolbar} tokens={{ childrenGap: 8 }}>
          <PrimaryButton iconProps={{ iconName: 'Save' }} text="Save" onClick={handleSaveAndExit} />
          <ActionButton iconProps={{ iconName: 'Cancel' }} text="Discard changes" onClick={handleDiscardChanges} />
          <ActionButton iconProps={{ iconName: 'Delete' }} text="Delete" onClick={() => setDeleteDialogHidden(false)} />
          <Stack.Item grow={1}><span /></Stack.Item>
          <div ref={columnsBtnRef}>
            <ActionButton iconProps={{ iconName: 'ColumnOptions' }} text="Columns" onClick={() => setIsColumnsCalloutOpen(true)} />
          </div>
          <div ref={filterBtnRef}>
            <ActionButton iconProps={{ iconName: 'Filter' }} text={filterField ? 'Filter (1)' : 'Filter'} onClick={() => setIsFilterCalloutOpen(true)} />
          </div>
          <SearchBox placeholder="Search" onChange={(_, val) => setSearchQuery(val || '')} onClear={() => setSearchQuery('')} styles={{ root: { width: 200 } }} />
        </Stack>
      );
    }
    return (
      <Stack horizontal verticalAlign="center" className={classNames.toolbar} tokens={{ childrenGap: 4 }}>
        <ActionButton iconProps={{ iconName: 'Add' }} text="Add RI/ASP Products" onClick={onAddProducts} />
        <ActionButton iconProps={{ iconName: 'Edit' }} text="Edit" disabled={!hasChecked} onClick={handleEnterEditMode} />
        <ActionButton iconProps={{ iconName: 'BulkUpload' }} text="Bulk Edit" disabled={!hasChecked} onClick={() => setIsBulkEditOpen(true)} />
        <ActionButton iconProps={{ iconName: 'Delete' }} text="Delete" disabled={!hasChecked} onClick={() => setDeleteDialogHidden(false)} />
        <Stack.Item grow={1}><span /></Stack.Item>
        <div ref={columnsBtnRef}>
          <ActionButton iconProps={{ iconName: 'ColumnOptions' }} text="Columns" onClick={() => setIsColumnsCalloutOpen(true)} />
        </div>
        <div ref={filterBtnRef}>
          <ActionButton iconProps={{ iconName: 'Filter' }} text={filterField ? 'Filter (1)' : 'Filter'} onClick={() => setIsFilterCalloutOpen(true)} />
        </div>
        <SearchBox placeholder="Search" onChange={(_, val) => setSearchQuery(val || '')} onClear={() => setSearchQuery('')} styles={{ root: { width: 200 } }} />
      </Stack>
    );
  };

  const renderDetailField = (label: string, value: string) => (
    <div className={classNames.detailsFieldGroup}>
      <div className={classNames.detailsFieldLabel}>{label}</div>
      <div className={classNames.detailsFieldValue}>{value}</div>
    </div>
  );

  const renderDetailsPane = () => {
    if (!showDetailsPanel) return null;

    if (!selectedDetailItem) {
      return (
        <div className={classNames.detailsPanel}>
          <div className={classNames.emptyDetails}>
            <Stack tokens={{ childrenGap: 8 }} horizontalAlign="center">
              <Icon iconName="Info" styles={{ root: { fontSize: 32, color: theme.palette.neutralTertiary } }} />
              <Text styles={{ root: { color: theme.palette.neutralSecondary, fontSize: 13 } }}>
                Please select a product to view its details
              </Text>
            </Stack>
          </div>
        </div>
      );
    }

    return (
      <div className={classNames.detailsPanel}>
        <div className={classNames.detailsPanelHeader}>
          <Text styles={{ root: { fontWeight: 700, fontSize: 16, display: 'block' } }}>
            {selectedDetailItem.partNumber}
          </Text>
          <Text styles={{ root: { fontSize: 13, color: theme.palette.neutralSecondary, display: 'block', marginTop: 4 } }}>
            {selectedDetailItem.productDetails}
          </Text>
          <div className={classNames.summaryTab}>Summary</div>
        </div>

        <div className={classNames.detailsPanelBody}>
          {/* Product Information */}
          <div className={classNames.detailsSectionHeader} onClick={() => toggleSection('productInfo')}>
            <Icon iconName={collapsedSections.has('productInfo') ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 12 } }} />
            <span>Product information</span>
          </div>
          {!collapsedSections.has('productInfo') && (
            <>
              {renderDetailField('Product Family name', selectedDetailItem.productFamily || 'O365 E3')}
              {renderDetailField('Division Name', 'O365 Core - Non M365')}
              {renderDetailField('Product Type', 'MSU')}
              {renderDetailField('Lead Status', '-')}
              {renderDetailField('Price Level', 'A')}
            </>
          )}

          {/* Scenario Configuration */}
          <div className={classNames.detailsSectionHeader} onClick={() => toggleSection('scenarioConfig')}>
            <Icon iconName={collapsedSections.has('scenarioConfig') ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 12 } }} />
            <span>Scenario Configuration</span>
          </div>
          {!collapsedSections.has('scenarioConfig') && (
            <>
              {renderDetailField('Offering', selectedDetailItem.offering || 'CUS')}
              {renderDetailField('Profile', 'Enterprise')}
            </>
          )}

          {/* NET Information */}
          <div className={classNames.detailsSectionHeader} onClick={() => toggleSection('netInfo')}>
            <Icon iconName={collapsedSections.has('netInfo') ? 'ChevronRight' : 'ChevronDown'} styles={{ root: { fontSize: 12 } }} />
            <span>NET Information</span>
          </div>
          {!collapsedSections.has('netInfo') && (
            <>
              <div className={classNames.detailsFieldGroup}>
                <div className={classNames.detailsFieldLabel}>List Price (Before discount)</div>
                <div className={classNames.detailsFieldValue}>Year 1: {selectedDetailItem.basePriceNetUSD.toFixed(1)}</div>
              </div>
              {renderDetailField('Discount', `${selectedDetailItem.discountPercent}%`)}
              {renderDetailField('Net Price (USD)', `$${calcPriceNet(selectedDetailItem).toFixed(2)}`)}
            </>
          )}

          <DefaultButton text="Close" onClick={() => setShowDetailsPanel(false)} styles={{ root: { marginTop: 20 } }} />
        </div>
      </div>
    );
  };

  return (
    <Stack tokens={{ childrenGap: 0 }} styles={{ root: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}>
      {/* Sticky toolbar area */}
      <Stack className={classNames.root} tokens={{ childrenGap: 4 }}>
        {renderToolbar()}

        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Text variant="small" styles={{ root: { color: theme.semanticColors.bodySubtext, padding: '4px 0' } }}>
            {mode === 'editing'
              ? `Editing ${checkedIds.size} of ${filteredProducts.length} items`
              : `Showing ${Math.min(pageStart + PAGE_SIZE, filteredProducts.length)} of ${filteredProducts.length} items`}
          </Text>
          <IconButton
            iconProps={{ iconName: 'Info' }}
            title="View product details"
            onClick={() => setShowDetailsPanel((prev) => !prev)}
            styles={{
              root: {
                color: showDetailsPanel ? theme.palette.themePrimary : theme.palette.neutralSecondary,
              },
            }}
          />
        </Stack>
      </Stack>

      {/* Grid + Details pane — this is the scrollable area */}
      <div className={classNames.gridAndDetailsWrapper}>
        <div className={classNames.gridArea}>
          <div className={classNames.tableWrapper}>
            <DetailsList
              items={sortedItems}
              columns={visibleColumns}
              groups={groups.length > 1 ? groups : undefined}
              selectionMode={SelectionMode.none}
              checkboxVisibility={CheckboxVisibility.hidden}
              layoutMode={DetailsListLayoutMode.fixedColumns}
              getKey={(item) => (item as IAddedProduct).id}
              compact
              styles={{
                root: { minWidth: 900 },
                headerWrapper: {
                  position: 'sticky',
                  top: 0,
                  zIndex: 2,
                },
              }}
              groupProps={{ showEmptyGroups: true }}
            />
          </div>
        </div>
        {renderDetailsPane()}
      </div>

      {/* Pagination — fixed at bottom */}
      <div className={classNames.paginationBar}>
        <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }}>
          Page {currentPage + 1} of {totalPages}
        </Text>
        <Stack horizontal tokens={{ childrenGap: 4 }}>
          <DefaultButton text="Previous" disabled={currentPage === 0} onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} styles={{ root: { minWidth: 80 } }} />
          <DefaultButton text="Next" disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))} styles={{ root: { minWidth: 80 } }} />
        </Stack>
      </div>

      {/* Bulk Edit Panel */}
      <Panel
        isOpen={isBulkEditOpen}
        onDismiss={() => { setIsBulkEditOpen(false); setBulkEditValues({}); }}
        type={PanelType.smallFixedFar}
        headerText="Bulk edit values"
        isFooterAtBottom
        onRenderFooterContent={() => (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton text="Apply" onClick={handleBulkEditApply} />
            <DefaultButton text="Reset" onClick={() => setBulkEditValues({})} />
          </Stack>
        )}
      >
        <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 8 } }}>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Region</Text>
            <Dropdown placeholder="Select region" selectedKey={bulkEditValues.region || ''} options={REGION_OPTIONS as IDropdownOption[]} onChange={(_, opt) => setBulkEditValues((v) => ({ ...v, region: opt?.key as string }))} />
          </Stack>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Commitment</Text>
            <Dropdown placeholder="Select commitment" selectedKey={bulkEditValues.commitment || ''} options={COMMITMENT_OPTIONS as IDropdownOption[]} onChange={(_, opt) => setBulkEditValues((v) => ({ ...v, commitment: opt?.key as string }))} />
          </Stack>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Discount %</Text>
            <TextField placeholder="Enter value in %" value={bulkEditValues.discountPercent !== undefined ? String(bulkEditValues.discountPercent) : ''} onChange={(_, val) => { const num = parseFloat(val || ''); setBulkEditValues((v) => ({ ...v, discountPercent: isNaN(num) ? undefined : num })); }} />
          </Stack>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>Start Date</Text>
            <DatePicker placeholder="Select date" value={bulkEditValues.startDate} onSelectDate={(date) => setBulkEditValues((v) => ({ ...v, startDate: date || undefined }))} />
          </Stack>
          <Stack tokens={{ childrenGap: 4 }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 13 } }}>End Date</Text>
            <DatePicker placeholder="Select date" value={bulkEditValues.endDate} onSelectDate={(date) => setBulkEditValues((v) => ({ ...v, endDate: date || undefined }))} />
          </Stack>
          <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary, marginTop: 8 } }}>
            The input values apply only to the selected row item(s). If you do not wish to add a value in a field in bulk, you can skip it
          </Text>
        </Stack>
      </Panel>

      {/* Delete dialog */}
      <Dialog hidden={deleteDialogHidden} onDismiss={() => setDeleteDialogHidden(true)} dialogContentProps={{ type: DialogType.normal, title: 'Delete Products', subText: `Are you sure you want to delete ${checkedIds.size} selected product(s)?` }}>
        <DialogFooter>
          <PrimaryButton text="Delete" onClick={handleDelete} />
          <DefaultButton text="Cancel" onClick={() => setDeleteDialogHidden(true)} />
        </DialogFooter>
      </Dialog>

      {/* Columns Callout */}
      {isColumnsCalloutOpen && columnsBtnRef.current && (
        <Callout target={columnsBtnRef.current} onDismiss={() => setIsColumnsCalloutOpen(false)} directionalHint={DirectionalHint.bottomLeftEdge} isBeakVisible={false}>
          <Stack tokens={{ childrenGap: 8 }} styles={{ root: { padding: 16, width: 220 } }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>Show/Hide Columns</Text>
            {allColumnKeys.map((colKey) => (
              <Checkbox key={colKey} label={columnLabels[colKey]} checked={!hiddenColumns.has(colKey)} onChange={(_, checked) => { setHiddenColumns((prev) => { const next = new Set(prev); if (checked) next.delete(colKey); else next.add(colKey); return next; }); }} />
            ))}
          </Stack>
        </Callout>
      )}

      {/* Filter Callout */}
      {isFilterCalloutOpen && filterBtnRef.current && (
        <Callout target={filterBtnRef.current} onDismiss={() => setIsFilterCalloutOpen(false)} directionalHint={DirectionalHint.bottomLeftEdge} isBeakVisible={false}>
          <Stack tokens={{ childrenGap: 12 }} styles={{ root: { padding: 16, width: 260 } }}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>Filter</Text>
            <Dropdown label="Column" placeholder="Select column" selectedKey={filterField} options={filterFieldOptions} onChange={(_, opt) => { setFilterField((opt?.key as string) || ''); if (!opt?.key) setFilterValue(''); }} />
            {filterField && <TextField label="Contains" placeholder="Enter filter value" value={filterValue} onChange={(_, val) => setFilterValue(val || '')} />}
            <Stack horizontal tokens={{ childrenGap: 8 }}>
              <DefaultButton text="Clear" onClick={() => { setFilterField(''); setFilterValue(''); setIsFilterCalloutOpen(false); }} />
              <PrimaryButton text="Apply" onClick={() => setIsFilterCalloutOpen(false)} />
            </Stack>
          </Stack>
        </Callout>
      )}
    </Stack>
  );
};
