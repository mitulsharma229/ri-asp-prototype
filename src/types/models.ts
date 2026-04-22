export interface ICatalogProduct {
  id: string;
  productDetails: string;
  productFamily: string;
  productList: string;
  pricingUnit: string;
  priceLevel: string;
  listPriceNetUSD: number;
  partNumber: string;
  amendmentCode: string;
  offering: string;
  status: 'Valid' | 'Invalid';
  invalidReason?: string;
}

export interface IAddedProduct {
  id: string;
  productDetails: string;
  productFamily: string;
  amendmentCode: string;
  region: string;
  commitment: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  priceNetUSD: number;
  basePriceNetUSD: number;
  partNumber: string;
  offering: string;
  regionApplicable: boolean;
  groupName: string;
}

export interface IAmendment {
  id: string;
  code: string;
  title: string;
  language: string;
  concessionId: string;
  empowermentLevel: string;
  modifiedBy: string;
  modifiedOn: string;
  isDigitised: boolean;
  status: 'Auto-added' | 'Manual';
  linkedProducts: string[];
}

export interface IGeneratedDocument {
  id: string;
  fileName: string;
  type: 'CPS' | 'Amendment';
  language: string;
  generatedBy: string;
  generatedOn: string;
}

export interface ISupportingDocument {
  id: string;
  fileName: string;
  uploadedBy: string;
  uploadedOn: string;
}

export type FlowStep = 'products' | 'amendments' | 'errorsWarnings' | 'generate' | 'documents';

export type PivotTab = 'futureProducts' | 'optionalFutureProducts' | 'riaspFutureProducts';

export const REGION_OPTIONS = [
  { key: '', text: 'Select' },
  { key: 'US West', text: 'US West' },
  { key: 'US East', text: 'US East' },
  { key: 'EU West', text: 'EU West' },
  { key: 'EU North', text: 'EU North' },
  { key: 'Asia Pacific', text: 'Asia Pacific' },
  { key: 'Japan', text: 'Japan' },
  { key: 'Australia', text: 'Australia' },
];

export const COMMITMENT_OPTIONS = [
  { key: '', text: 'Select' },
  { key: '1 Year', text: '1 Year' },
  { key: '3 years', text: '3 years' },
  { key: '5 years', text: '5 years' },
];

export const EMPOWERMENT_OPTIONS = [
  { key: 'Blue', text: 'Blue' },
  { key: 'Green', text: 'Green' },
  { key: 'Yellow', text: 'Yellow' },
  { key: 'Red', text: 'Red' },
];

export const PROFILE_OPTIONS = [
  { key: 'enterprise', text: 'Enterprise' },
  { key: 'government', text: 'Government' },
  { key: 'academic', text: 'Academic' },
  { key: 'isv', text: 'ISV' },
  { key: 'non-profit', text: 'Non-Profit' },
  { key: 'csp', text: 'CSP' },
  { key: 'healthcare', text: 'Healthcare' },
  { key: 'education', text: 'Education' },
];

export const TENANT_OPTIONS = [
  { key: 'contoso-main', text: 'Contoso Main Tenant' },
  { key: 'contoso-finance', text: 'Contoso Finance AU' },
  { key: 'contoso-emea', text: 'Contoso EMEA' },
  { key: 'contoso-it', text: 'Contoso IT Services' },
  { key: 'contoso-healthcare', text: 'Contoso Healthcare' },
  { key: 'contoso-apac', text: 'Contoso APAC' },
  { key: 'contoso-latam', text: 'Contoso LATAM' },
  { key: 'contoso-education', text: 'Contoso Education' },
  { key: 'contoso-gov', text: 'Contoso Government' },
];
