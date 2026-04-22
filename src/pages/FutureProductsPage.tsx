import * as React from 'react';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { Stack } from '@fluentui/react/lib/Stack';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';

import { NavHeader } from '../components/NavHeader/NavHeader';
import { BreadcrumbBar } from '../components/BreadcrumbBar/BreadcrumbBar';
import { EmptyState } from '../components/EmptyState/EmptyState';

import { ScenarioNav } from '../components/ScenarioNav/ScenarioNav';
import { ProductSearchPanel } from '../components/ProductSearchPanel/ProductSearchPanel';
import { ProductGrid, IBulkEditValues } from '../components/ProductGrid/ProductGrid';
import { AmendmentsView } from '../components/AmendmentsView/AmendmentsView';
import { ErrorsWarningsView } from '../components/ErrorsWarningsView/ErrorsWarningsView';
import { GenerateDocuments } from '../components/GenerateDocuments/GenerateDocuments';
import { DocumentsPage } from '../components/DocumentsPage/DocumentsPage';
import { Footer } from '../components/Footer/Footer';

import { sampleCatalogProducts, sampleAmendments, sampleGeneratedDocuments, sampleSupportingDocuments } from '../data/sampleData';
import { IAddedProduct, ICatalogProduct, FlowStep, PivotTab } from '../types/models';

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: {
      backgroundColor: theme.semanticColors.bodyBackground,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden' as const,
    },
    body: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden' as const,
    },
    mainArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden' as const,
    },
    pageContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden' as const,
    },
    pivotContainer: {
      padding: '0 16px',
      flexShrink: 0,
    },
    commandBarArea: {
      padding: '0 16px',
      flexShrink: 0,
    },
    scenarioHeader: {
      padding: '8px 24px',
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
      backgroundColor: theme.palette.white,
    },
    scenarioContent: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden' as const,
    },
    infoBar: {
      display: 'flex',
      gap: 24,
      padding: '8px 24px',
      backgroundColor: theme.palette.white,
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
      fontSize: 12,
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 2,
    },
    infoLabel: {
      color: theme.palette.neutralSecondary,
      fontSize: 11,
    },
    infoValue: {
      fontSize: 12,
      fontWeight: 600,
    },
  })
);

const convertCatalogToAdded = (catalog: ICatalogProduct): IAddedProduct => {
  const regionFromDetails = catalog.productDetails.match(/- ([A-Z][a-z]+ ?[A-Za-z]*)$/)?.[1] || '';
  const basePrice = catalog.listPriceNetUSD || 500.00;
  return {
    id: catalog.id,
    productDetails: catalog.productDetails,
    productFamily: catalog.productFamily,
    amendmentCode: catalog.amendmentCode,
    region: regionFromDetails || 'US West',
    commitment: '3 years',
    discountPercent: 0,
    startDate: 'Mar 21, 2026',
    endDate: 'Mar 21, 2029',
    basePriceNetUSD: basePrice,
    priceNetUSD: basePrice,
    partNumber: catalog.partNumber,
    offering: catalog.offering,
    regionApplicable: !!regionFromDetails,
    groupName: catalog.amendmentCode === 'M919'
      ? 'Placeholder grouping text'
      : catalog.amendmentCode === 'M920'
      ? 'Placeholder grouping text'
      : 'Placeholder grouping text',
  };
};

export const FutureProductsPage: React.FC = () => {
  const theme = useTheme();
  const classNames = getClassNames(theme);

  const [activeTab, setActiveTab] = React.useState<PivotTab>('riaspFutureProducts');
  const [flowStep, setFlowStep] = React.useState<FlowStep>('products');
  const [products, setProducts] = React.useState<IAddedProduct[]>([]);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');

  const handleAddProducts = React.useCallback(() => {
    setIsSearchPanelOpen(true);
  }, []);

  const handleConfirmSelection = React.useCallback((selectedProducts: ICatalogProduct[]) => {
    const newProducts = selectedProducts.map(convertCatalogToAdded);
    setProducts((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const unique = newProducts.filter((p) => !existingIds.has(p.id));
      return [...prev, ...unique];
    });
    setIsSearchPanelOpen(false);
    setSuccessMessage(`${selectedProducts.length} products added successfully!`);
    setHasUnsavedChanges(true);
    setTimeout(() => setSuccessMessage(''), 5000);
  }, []);

  const handleUpdateProduct = React.useCallback((id: string, field: keyof IAddedProduct, value: unknown) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    setHasUnsavedChanges(true);
  }, []);

  const handleDeleteProducts = React.useCallback((ids: string[]) => {
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    setHasUnsavedChanges(true);
  }, []);

  const handleBulkEditApply = React.useCallback((ids: string[], values: IBulkEditValues) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (!ids.includes(p.id)) return p;
        const updated = { ...p };
        if (values.region) updated.region = values.region;
        if (values.commitment) updated.commitment = values.commitment;
        if (values.discountPercent !== undefined) {
          updated.discountPercent = values.discountPercent;
          updated.priceNetUSD = updated.basePriceNetUSD * (1 - values.discountPercent / 100);
        }
        if (values.startDate) updated.startDate = values.startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        if (values.endDate) updated.endDate = values.endDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        return updated;
      })
    );
    setHasUnsavedChanges(true);
    setSuccessMessage('Changes saved successfully!');
    setTimeout(() => setSuccessMessage(''), 5000);
  }, []);

  const handleSave = React.useCallback(() => {
    setHasUnsavedChanges(false);
    setSuccessMessage('Changes saved successfully!');
    setTimeout(() => setSuccessMessage(''), 5000);
  }, []);

  const handleNext = React.useCallback(() => {
    const steps: FlowStep[] = ['products', 'amendments', 'errorsWarnings', 'generate', 'documents'];
    const idx = steps.indexOf(flowStep);
    if (idx < steps.length - 1) {
      setFlowStep(steps[idx + 1]);
    }
  }, [flowStep]);

  const handlePrev = React.useCallback(() => {
    const steps: FlowStep[] = ['products', 'amendments', 'errorsWarnings', 'generate', 'documents'];
    const idx = steps.indexOf(flowStep);
    if (idx > 0) {
      setFlowStep(steps[idx - 1]);
    }
  }, [flowStep]);

  // CommandBar items for the products tab
  const mainCommandBarItems: ICommandBarItemProps[] = React.useMemo(
    () => [
      { key: 'edit', text: 'Edit', iconProps: { iconName: 'Edit' }, onClick: () => {} },
      { key: 'showHide', text: 'Show/Hide from CPS', iconProps: { iconName: 'View' }, onClick: () => {} },
      { key: 'bulkRamp', text: 'Bulk / Ramp discount', iconProps: { iconName: 'CalculatorPercentage' }, onClick: () => {} },
      { key: 'viewPrices', text: 'View Prices : Net', iconProps: { iconName: 'Money' }, onClick: () => {} },
      { key: 'export', text: 'Export to Excel', iconProps: { iconName: 'ExcelDocument' }, onClick: () => {} },
      { key: 'groupSettings', text: 'Group settings', iconProps: { iconName: 'GroupObject' }, onClick: () => {} },
    ],
    []
  );

  const mainCommandBarFarItems: ICommandBarItemProps[] = React.useMemo(
    () => [
      { key: 'showHideColumns', text: 'Show//Hide Columns', iconProps: { iconName: 'ColumnOptions' }, onClick: () => {} },
      { key: 'filter', text: 'Filter (1)', iconProps: { iconName: 'Filter' }, onClick: () => {} },
      {
        key: 'search',
        onRender: () => (
          <SearchBox
            placeholder="Search"
            styles={{ root: { width: 180, alignSelf: 'center' } }}
          />
        ),
      },
    ],
    []
  );

  const renderProductsView = () => {
    if (products.length === 0) {
      return <EmptyState onAddProducts={handleAddProducts} />;
    }

    return (
      <Stack tokens={{ childrenGap: 0 }} styles={{ root: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}>
        {successMessage && (
          <MessageBar
            messageBarType={MessageBarType.success}
            onDismiss={() => setSuccessMessage('')}
            dismissButtonAriaLabel="Close"
            styles={{ root: { margin: '0 16px', flexShrink: 0 } }}
          >
            {successMessage}
          </MessageBar>
        )}
        <ProductGrid
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProducts={handleDeleteProducts}
          onBulkEditApply={handleBulkEditApply}
          onSave={handleSave}
          onAddProducts={handleAddProducts}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </Stack>
    );
  };

  const renderScenarioContent = () => {
    switch (flowStep) {
      case 'amendments':
        return <AmendmentsView amendments={sampleAmendments} />;
      case 'errorsWarnings':
        return <ErrorsWarningsView onNavigate={setFlowStep} />;
      case 'generate':
        return (
          <GenerateDocuments
            onComplete={() => setFlowStep('documents')}
            hasErrors={true}
          />
        );
      case 'documents':
        return (
          <DocumentsPage
            generatedDocuments={sampleGeneratedDocuments}
            supportingDocuments={sampleSupportingDocuments}
            onGoToProposal={() => setSuccessMessage('Redirecting to proposal...')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack className={classNames.root}>
      <NavHeader />
      <BreadcrumbBar
        quoteName="ParleG Basic"
        quoteId="P1103281.001"
        currentPage="Future Products"
      />

      <div className={classNames.body}>
        <ScenarioNav activeStep={flowStep} onStepChange={setFlowStep} />

        <div className={classNames.mainArea}>
          {flowStep === 'products' ? (
            /* Products tab view */
            <div className={classNames.pageContent}>
              <div className={classNames.pivotContainer}>
                <Pivot
                  selectedKey={activeTab}
                  onLinkClick={(item) => {
                    if (item?.props.itemKey) {
                      setActiveTab(item.props.itemKey as PivotTab);
                    }
                  }}
                >
                  <PivotItem headerText="Future Products" itemKey="futureProducts" />
                  <PivotItem headerText="Optional Future Products" itemKey="optionalFutureProducts" />
                  <PivotItem headerText="RI/ASP Future Products" itemKey="riaspFutureProducts" />
                </Pivot>
              </div>

              {activeTab === 'futureProducts' && (
                <>
                  <div className={classNames.commandBarArea}>
                    <CommandBar items={mainCommandBarItems} farItems={mainCommandBarFarItems} />
                  </div>
                  <EmptyState onAddProducts={() => setActiveTab('riaspFutureProducts')} />
                </>
              )}

              {activeTab === 'optionalFutureProducts' && (
                <>
                  <div className={classNames.commandBarArea}>
                    <CommandBar items={mainCommandBarItems} farItems={mainCommandBarFarItems} />
                  </div>
                  <EmptyState onAddProducts={() => setActiveTab('riaspFutureProducts')} />
                </>
              )}

              {activeTab === 'riaspFutureProducts' && renderProductsView()}
            </div>
          ) : (
            /* Scenario detail view */
            <Stack styles={{ root: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}>
              {/* Scenario info bar */}
              <div className={classNames.infoBar}>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Status</span>
                  <span className={classNames.infoValue}>In progress</span>
                </div>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Scenario ID</span>
                  <span className={classNames.infoValue}>AMD7838217.001</span>
                </div>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Opportunity</span>
                  <span className={classNames.infoValue}>7-W0DDM6SK</span>
                </div>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Program</span>
                  <span className={classNames.infoValue}>Enterprise</span>
                </div>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Customer</span>
                  <span className={classNames.infoValue}>Starbucks Corporation India...</span>
                </div>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Customer country</span>
                  <span className={classNames.infoValue}>United States</span>
                </div>
                <div className={classNames.infoItem}>
                  <span className={classNames.infoLabel}>Pricing country</span>
                  <span className={classNames.infoValue}>United States</span>
                </div>
              </div>
              <div style={{ flex: 1, overflow: 'auto' }}>
                {renderScenarioContent()}
              </div>
            </Stack>
          )}
        </div>
      </div>

      <Footer
        onNext={handleNext}
        onCancel={() => {
          if (flowStep !== 'products') {
            setFlowStep('products');
          }
        }}
        onPrev={flowStep !== 'products' ? handlePrev : undefined}
        showPrev={flowStep !== 'products'}
        nextLabel={flowStep === 'generate' ? 'Generate final documents & Send for approval' : 'Next'}
        nextDisabled={products.length === 0}
      />

      <ProductSearchPanel
        isOpen={isSearchPanelOpen}
        onDismiss={() => setIsSearchPanelOpen(false)}
        catalogProducts={sampleCatalogProducts}
        onConfirmSelection={handleConfirmSelection}
      />
    </Stack>
  );
};
