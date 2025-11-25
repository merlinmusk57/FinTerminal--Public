
export enum BankName {
  HSBC_HK = 'HSBC Hong Kong',
  SC_HK = 'Standard Chartered HK',
  BOC_HK = 'BOC Hong Kong',
  HANG_SENG = 'Hang Seng Bank',
}

export enum Frequency {
  QUARTERLY = 'Quarterly',
  SEMI_ANNUAL = 'Semi-Annual',
  ANNUAL = 'Annual',
}

export enum Currency {
  HKD = 'HKD',
  USD = 'USD',
  GBP = 'GBP',
}

export enum StandardizedSegment {
  GROUP = 'Group (Total)',
  RETAIL = 'Retail & Wealth',
  CORPORATE = 'Corporate & Commercial',
  MARKETS = 'Global Markets / Treasury'
}

export interface NormalizationStep {
  id: string;
  stepName: string;
  description: string;
  rawInput?: string;
  transformedOutput?: string;
  status: 'success' | 'warning';
}

export interface FinancialDataPoint {
  id: string;
  metric: string;
  value: number;
  unit: string; // e.g., 'm', 'bn', '%'
  currency: Currency;
  period: string; // e.g., '2023 1H'
  year: number;
  frequency: Frequency;
  bank: BankName;
  sourceDoc: string;
  pageNumber: number;
  normalized: boolean;
  originalSegment?: string;
  standardizedSegment: StandardizedSegment;
  rawExtractSnippet?: string; // The actual text from the PDF
  normalizationTrace?: NormalizationStep[]; // The audit log of changes
}

export interface IngestedDocument {
  id: string;
  name: string;
  type: 'PDF' | 'EXCEL' | 'AUDIO' | 'IMAGE';
  size: string;
  uploadDate: string;
  status: 'processing' | 'ready' | 'error';
  bank: BankName;
}

export type ChatMessage = {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
};