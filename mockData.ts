
import { BankName, Currency, FinancialDataPoint, Frequency, IngestedDocument, NormalizationStep, StandardizedSegment } from './types';

// Helper to generate IDs
const uid = () => Math.random().toString(36).substr(2, 9);

export const MOCK_DOCUMENTS: IngestedDocument[] = [
  { id: uid(), name: 'HSBC Holdings plc Interim Report 2025.pdf', type: 'PDF', size: '18.5 MB', uploadDate: '2025-07-30', status: 'ready', bank: BankName.HSBC_HK },
  { id: uid(), name: 'HSBC Holdings plc Data Pack 2Q 2025.pdf', type: 'PDF', size: '2.4 MB', uploadDate: '2025-07-30', status: 'ready', bank: BankName.HSBC_HK },
  { id: uid(), name: 'Standard Chartered PLC Half Year Report 2025.pdf', type: 'PDF', size: '12.4 MB', uploadDate: '2025-07-31', status: 'ready', bank: BankName.SC_HK },
  { id: uid(), name: 'BOC HONG KONG (HOLDINGS) LIMITED Data Pack 1H2025.pdf', type: 'PDF', size: '4.1 MB', uploadDate: '2025-08-01', status: 'ready', bank: BankName.BOC_HK },
  { id: uid(), name: 'Hang Seng Bank 2025 Interim Report.pdf', type: 'PDF', size: '8.9 MB', uploadDate: '2025-07-31', status: 'ready', bank: BankName.HANG_SENG },
];

const createTrace = (bank: BankName, segment: StandardizedSegment, originalCurrency: string): NormalizationStep[] => {
  const segmentMapDescription = 
    segment === StandardizedSegment.RETAIL ? 'Mapped "Wealth & Personal Banking" to "Retail & Wealth".' :
    segment === StandardizedSegment.CORPORATE ? 'Mapped "Commercial Banking" to "Corporate & Commercial".' :
    segment === StandardizedSegment.MARKETS ? 'Mapped "Global Banking & Markets" to "Global Markets / Treasury".' :
    'Aggregated Group level data.';

  return [
    { 
      id: uid(), 
      stepName: 'Extraction', 
      description: `Extracted value from table 'Segment Performance' on page ${Math.floor(Math.random() * 50) + 10}.`, 
      status: 'success' 
    },
    { 
      id: uid(), 
      stepName: 'Segment Normalization', 
      description: segmentMapDescription, 
      status: 'success' 
    },
    { 
      id: uid(), 
      stepName: 'Geographical Filtering', 
      description: bank === BankName.HSBC_HK ? 'Filtered for "Hong Kong" geo-code within Asia Pacific segment.' : 'Verified HK entity reporting scope.', 
      status: 'success' 
    },
    { 
      id: uid(), 
      stepName: 'Currency Normalization', 
      description: originalCurrency === 'USD' ? 'Converted USD to HKD at spot rate 7.82.' : 'Verified reporting currency is HKD.', 
      rawInput: originalCurrency,
      transformedOutput: 'HKD',
      status: 'success' 
    }
  ];
};

// Define realistic baseline profiles for HK Banks based on 1H 2025 Reports (Figures in HKD Millions)
const getBankProfile = (bank: BankName) => {
    switch (bank) {
        case BankName.HSBC_HK:
            // Based on HSBC Data Pack 2Q 2025, Page 36 (Hong Kong business)
            // Converted USD to HKD approx (x 7.8)
            // Rev: 7,848m USD -> ~61,214m HKD
            // Opex: (2,310)m USD -> ~18,018m HKD
            // ECL: (864)m USD -> ~6,739m HKD
            return {
                NII: 45825, // Derived from Banking NII ($5,875m)
                NonNII: 15389, // Derived from Fee ($1,973m)
                Opex: -18018,
                Provisions: -6739,
                Loans: 1795084, // $230,139m * 7.8
                Deposits: 4035766, // $517,406m * 7.8
                NPL: 1.6,
                CET1: 16.2
            };
        case BankName.BOC_HK:
            // Based on Data Pack 1H2025
            return {
                NII: 25063,
                NonNII: 14959,
                Opex: -8310,
                Provisions: -3318,
                Loans: 1710380,
                Deposits: 2875521,
                NPL: 1.02,
                CET1: 23.69
            };
        case BankName.SC_HK:
             // Standard Chartered HK Business (Approximate from 1H25 Report)
            return {
                NII: 14500,
                NonNII: 9500,
                Opex: -11000,
                Provisions: -1200,
                Loans: 950000,
                Deposits: 1250000,
                NPL: 1.5,
                CET1: 14.3
            };
        case BankName.HANG_SENG:
            // Based on 2025 Interim Report
            return {
                NII: 14339,
                NonNII: 6636,
                Opex: -7565,
                Provisions: -4861,
                Loans: 803356,
                Deposits: 1299986,
                NPL: 2.85,
                CET1: 21.3
            };
        default:
            return { NII: 0, NonNII: 0, Opex: 0, Provisions: 0, Loans: 0, Deposits: 0, NPL: 0, CET1: 0 };
    }
};

export const generateInitialData = (): FinancialDataPoint[] => {
  const data: FinancialDataPoint[] = [];
  // Strictly defined periods to ensure tabs match
  const periods = ['2024 1H', '2024 2H', '2025 1H'];
  const banks = [BankName.HSBC_HK, BankName.SC_HK, BankName.BOC_HK, BankName.HANG_SENG];
  const segments = [StandardizedSegment.GROUP, StandardizedSegment.RETAIL, StandardizedSegment.CORPORATE, StandardizedSegment.MARKETS];

  banks.forEach(bank => {
    const profile = getBankProfile(bank);
    
    let sourceDocName = '';
    if (bank === BankName.HSBC_HK) sourceDocName = 'HSBC Holdings plc Data Pack 2Q 2025.pdf';
    else if (bank === BankName.SC_HK) sourceDocName = 'Standard Chartered PLC Half Year Report 2025.pdf';
    else if (bank === BankName.BOC_HK) sourceDocName = 'BOC HONG KONG (HOLDINGS) LIMITED Data Pack 1H2025.pdf';
    else if (bank === BankName.HANG_SENG) sourceDocName = 'Hang Seng Bank 2025 Interim Report.pdf';

    periods.forEach(period => {
      const is2025 = period.includes('2025');
      // Consistent growth factor for history
      const timeVar = is2025 ? 1.0 : (period === '2024 2H' ? 0.96 : 0.92);

      segments.forEach(segment => {
        let segWeight = 1.0; 
        if (segment === StandardizedSegment.RETAIL) segWeight = 0.45;
        if (segment === StandardizedSegment.CORPORATE) segWeight = 0.35;
        if (segment === StandardizedSegment.MARKETS) segWeight = 0.20;
        if (segment === StandardizedSegment.GROUP) segWeight = 1.0;

        const apply = (val: number) => Math.round(val * timeVar * segWeight);

        // Base metrics for P&L
        const metrics: { name: string; val: number; unit?: string }[] = [
          { name: 'Net Interest Income', val: apply(profile.NII) },
          { name: 'Non-Interest Income', val: apply(profile.NonNII) },
          { name: 'Operating Expenses', val: apply(profile.Opex) },
          { name: 'Provisions', val: apply(profile.Provisions) },
          { name: 'Other Income', val: apply(profile.NonNII * 0.1) },
        ];
        
        // Derived P&L
        const totalIncome = metrics[0].val + metrics[1].val + metrics[4].val;
        const opProfit = totalIncome + metrics[2].val; // Opex is negative
        const pbt = opProfit + metrics[3].val; // Provisions is negative

        metrics.push({ name: 'Operating Profit', val: opProfit });
        metrics.push({ name: 'Pretax Earnings', val: pbt });

        // Balance Sheet logic - Only generate for Group for simplicity, or allocate if needed.
        // For this mock, we allocate roughly to show data in all segments.
        metrics.push({ name: 'Total Loans', val: apply(profile.Loans) });
        metrics.push({ name: 'Total Deposits', val: apply(profile.Deposits) });

        // Ratios - Only meaningful at Group level in this mock context
        if (segment === StandardizedSegment.GROUP) {
             metrics.push({ name: 'NPL Ratio', val: profile.NPL, unit: '%' });
             metrics.push({ name: 'Common Equity Tier 1', val: profile.CET1, unit: '%' });
        }

        metrics.forEach(m => {
          const displayVal = m.unit === '%' ? m.val.toFixed(2) + '%' : (bank === BankName.HSBC_HK ? (m.val/7.8).toLocaleString('en-US', {maximumFractionDigits: 0}) : m.val.toLocaleString());
          
          data.push({
            id: uid(), 
            metric: m.name, 
            value: m.val, 
            unit: m.unit || 'm', 
            currency: Currency.HKD,
            period, 
            year: parseInt(period.slice(0, 4)), 
            frequency: Frequency.SEMI_ANNUAL, 
            bank,
            sourceDoc: sourceDocName, 
            pageNumber: Math.floor(Math.random() * 40) + 5, 
            normalized: true, 
            originalSegment: segment === StandardizedSegment.GROUP ? 'Group' : `${segment.split(' ')[0]} Division`,
            standardizedSegment: segment,
            rawExtractSnippet: `${m.name} .................... ${displayVal}`,
            normalizationTrace: createTrace(bank, segment, bank === BankName.HSBC_HK ? 'USD' : 'HKD')
          });
        });
      });
    });
  });

  return data;
};

export const generateDataForNewFile = (filename: string, bank: BankName): FinancialDataPoint[] => {
    const data = generateInitialData().filter(d => d.bank === bank && d.period === '2025 1H');
    return data.map(d => ({...d, sourceDoc: filename, id: uid()}));
}
