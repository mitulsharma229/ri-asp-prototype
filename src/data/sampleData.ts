import { ICatalogProduct, IAmendment, IGeneratedDocument, ISupportingDocument } from '../types/models';

export const sampleCatalogProducts: ICatalogProduct[] = [
  { id: 'p1', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US East', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 100.00, partNumber: 'AAA-10782', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid' },
  { id: 'p2', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - US West', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 100.00, partNumber: 'AAA-10783', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid' },
  { id: 'p3', productDetails: 'Fabric Capacity Reservation - Fabric Capacity - EU West', productFamily: 'System Center Endpoint Protection', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 120.00, partNumber: 'AAA-10784', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid' },
  { id: 'p4', productDetails: 'SQL Database Reserved Capacity - General Purpose - US West', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'B', listPriceNetUSD: 150.00, partNumber: 'BBB-20101', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid' },
  { id: 'p5', productDetails: 'SQL Database Reserved Capacity - General Purpose - US East', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'B', listPriceNetUSD: 150.00, partNumber: 'BBB-20102', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid' },
  { id: 'p6', productDetails: 'SQL Database Reserved Capacity - Business Critical - EU North', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'C', listPriceNetUSD: 350.00, partNumber: 'BBB-20201', amendmentCode: 'M920', offering: 'Enterprise', status: 'Invalid', invalidReason: 'Product not available in selected price list' },
  { id: 'p7', productDetails: 'Cosmos DB Reserved Capacity - 100 RU/s - US West', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 80.00, partNumber: 'CCC-30101', amendmentCode: 'M1012', offering: 'Enterprise', status: 'Valid' },
  { id: 'p8', productDetails: 'Cosmos DB Reserved Capacity - 100 RU/s - Asia Pacific', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 95.00, partNumber: 'CCC-30102', amendmentCode: 'M1012', offering: 'Enterprise', status: 'Valid' },
  { id: 'p9', productDetails: 'Cosmos DB Reserved Capacity - 400 RU/s - EU West', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'B', listPriceNetUSD: 320.00, partNumber: 'CCC-30201', amendmentCode: 'M1012', offering: 'Enterprise', status: 'Valid' },
  { id: 'p10', productDetails: 'Azure Synapse Analytics Reserved - Compute Optimized - US West', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 500.00, partNumber: 'DDD-40101', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid' },
  { id: 'p11', productDetails: 'Azure Synapse Analytics Reserved - Compute Optimized - US East', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 500.00, partNumber: 'DDD-40102', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid' },
  { id: 'p12', productDetails: 'Azure Cache for Redis Reserved - Standard - US West', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 120.00, partNumber: 'EEE-50101', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid' },
  { id: 'p13', productDetails: 'Azure Cache for Redis Reserved - Premium - EU West', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'B', listPriceNetUSD: 280.00, partNumber: 'EEE-50201', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid' },
  { id: 'p14', productDetails: 'Azure App Service Reserved - P1v3 - US East', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 175.00, partNumber: 'FFF-60101', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid' },
  { id: 'p15', productDetails: 'Azure App Service Reserved - P2v3 - Asia Pacific', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'B', listPriceNetUSD: 350.00, partNumber: 'FFF-60201', amendmentCode: 'M919', offering: 'Enterprise', status: 'Invalid', invalidReason: 'SKU retired' },
  { id: 'p16', productDetails: 'Azure Databricks Reserved - Premium - US West', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Per DBU-Hour', priceLevel: 'A', listPriceNetUSD: 410.00, partNumber: 'GGG-70101', amendmentCode: 'M1012', offering: 'Enterprise', status: 'Valid' },
  { id: 'p17', productDetails: 'Azure Databricks Reserved - Standard - EU North', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Per DBU-Hour', priceLevel: 'A', listPriceNetUSD: 260.00, partNumber: 'GGG-70102', amendmentCode: 'M1012', offering: 'Enterprise', status: 'Valid' },
  { id: 'p18', productDetails: 'Azure Storage Reserved - Blob Hot - US East', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Per TB/Month', priceLevel: 'A', listPriceNetUSD: 55.00, partNumber: 'HHH-80101', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid' },
  { id: 'p19', productDetails: 'Azure Storage Reserved - Blob Cool - Japan', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Per TB/Month', priceLevel: 'A', listPriceNetUSD: 35.00, partNumber: 'HHH-80102', amendmentCode: 'M920', offering: 'Enterprise', status: 'Valid' },
  { id: 'p20', productDetails: 'Azure Virtual Machines Reserved - D4s v5 - US West', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 190.00, partNumber: 'III-90101', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid' },
  { id: 'p21', productDetails: 'Azure Virtual Machines Reserved - E8s v5 - Australia', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'B', listPriceNetUSD: 440.00, partNumber: 'III-90201', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid' },
  { id: 'p22', productDetails: 'Azure Virtual Machines Reserved - M64ms - EU West', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'C', listPriceNetUSD: 1200.00, partNumber: 'III-90301', amendmentCode: 'M919', offering: 'Enterprise', status: 'Valid' },
  { id: 'p23', productDetails: 'Azure Kubernetes Service Reserved - Standard - US East', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'A', listPriceNetUSD: 160.00, partNumber: 'JJJ-10201', amendmentCode: 'M1012', offering: 'Enterprise', status: 'Valid' },
  { id: 'p24', productDetails: 'Azure Kubernetes Service Reserved - Premium - Asia Pacific', productFamily: 'Azure Reserved Instances', productList: 'Other Enterprise Products', pricingUnit: 'Monthly', priceLevel: 'B', listPriceNetUSD: 300.00, partNumber: 'JJJ-10301', amendmentCode: 'M1012', offering: 'Enterprise', status: 'Valid' },
];

export const sampleAmendments: IAmendment[] = [
  {
    id: 'amd1',
    code: 'M1174',
    title: 'M1174: Azure Reservations Discounting - F...',
    language: 'English',
    concessionId: '3275',
    empowermentLevel: 'Blue',
    modifiedBy: 'Anand Hinge',
    modifiedOn: '12 Sep 2022',
    isDigitised: true,
    status: 'Auto-added',
    linkedProducts: ['p1', 'p2', 'p3', 'p10', 'p11', 'p14', 'p20', 'p21', 'p22'],
  },
  {
    id: 'amd2',
    code: 'M1174',
    title: 'M1174: Azure Reservations Discounting - F...',
    language: 'English',
    concessionId: '3275',
    empowermentLevel: 'Blue',
    modifiedBy: 'Anand Hinge',
    modifiedOn: '12 Sep 2022',
    isDigitised: true,
    status: 'Auto-added',
    linkedProducts: ['p4', 'p5', 'p12', 'p13', 'p18', 'p19'],
  },
];

export const sampleGeneratedDocuments: IGeneratedDocument[] = [
  { id: 'doc1', fileName: 'English CPS Gov1_Hansin Expressway Company_FinalCPS_20190702_en-US_CPS_...', type: 'CPS', language: 'English', generatedBy: 'Sangram Maharana', generatedOn: 'Nov 14, 2023 12:10 AM' },
];

export const sampleSupportingDocuments: ISupportingDocument[] = [
  { id: 'sdoc1', fileName: 'Business reports FY19.xlsx', uploadedBy: 'Sangram Maharana', uploadedOn: 'Nov 14, 2023 12:10 AM' },
];
