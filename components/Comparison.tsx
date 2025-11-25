
import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { BankName, StandardizedSegment, FinancialDataPoint } from '../types';
import { Info, Download, Check, ChevronDown, X, FileText, Search } from 'lucide-react';

// --- Document Viewer Component ---
interface DocumentViewerProps {
  dataPoint: FinancialDataPoint;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ dataPoint, onClose }) => {
  // Simulate page content by generating text around the snippet
  const generateMockPageContent = () => {
    const lines = [];
    const snippet = dataPoint.rawExtractSnippet || "";
    
    lines.push(`   ${dataPoint.bank.toUpperCase()} - INTERIM REPORT ${dataPoint.year}   `);
    lines.push("   FINANCIAL HIGHLIGHTS AND METRICS   ");
    lines.push("");
    lines.push("   Consolidated Income Statement (Unaudited)");
    lines.push("   For the period ended 30 June");
    lines.push("");
    lines.push("   -------------------------------------------------------------");
    
    // Insert snippet in the middle
    lines.push("   ... (previous items) ...");
    lines.push(`   ${snippet}`); 
    lines.push("   ... (subsequent items) ...");
    lines.push("");
    lines.push("   NOTES TO THE FINANCIAL STATEMENTS");
    lines.push("   1. Basis of preparation...");
    lines.push("   The financial statements have been prepared in accordance with...");
    
    return lines;
  };

  const contentLines = generateMockPageContent();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8">
      <div className="bg-slate-900 w-full max-w-4xl h-[85vh] rounded-xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded text-red-500">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{dataPoint.sourceDoc}</h3>
              <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mt-0.5">
                 <span>Page {dataPoint.pageNumber}</span>
                 <span>•</span>
                 <span>{dataPoint.bank}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-mono border border-amber-500/20">
                Value Found: {dataPoint.rawExtractSnippet?.split('...').pop()?.trim()}
             </div>
             <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
               <X size={20} />
             </button>
          </div>
        </div>

        {/* Document View Area */}
        <div className="flex-1 bg-white overflow-y-auto p-12 relative">
           <div className="max-w-3xl mx-auto shadow-lg bg-white min-h-[1000px] p-12 text-gray-800 font-serif text-sm leading-relaxed relative">
              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-gray-100 font-bold rotate-[-45deg] pointer-events-none">
                  {dataPoint.bank}
              </div>

              {/* Page Content Simulation */}
              {contentLines.map((line, idx) => {
                  if (line.includes(dataPoint.rawExtractSnippet || '-----')) {
                      return (
                          <div key={idx} className="font-mono bg-yellow-200/50 border-l-4 border-yellow-500 pl-4 py-2 my-4 text-gray-900 font-bold relative group">
                              {line}
                              <div className="absolute -right-32 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                                  Extracted Source
                              </div>
                          </div>
                      );
                  }
                  return <div key={idx} className="whitespace-pre-wrap min-h-[1.5em]">{line}</div>;
              })}
              
              <div className="absolute bottom-8 right-12 text-xs text-gray-400 font-sans">
                  Page {dataPoint.pageNumber}
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-900 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500 font-mono">
            <div>Source ID: {dataPoint.id}</div>
            <div>Match Confidence: 98.5%</div>
        </div>
      </div>
    </div>
  );
};

// --- Main Comparison Component ---

interface CitationCellProps {
  metric: string;
  bank: BankName;
  selectedPeriod: string;
  selectedSegment: StandardizedSegment;
  selectedCurrency: string;
  dataPoints: any[];
  onViewSource: (data: FinancialDataPoint) => void;
}

const CitationCell: React.FC<CitationCellProps> = ({ metric, bank, selectedPeriod, selectedSegment, selectedCurrency, dataPoints, onViewSource }) => {
  const data = dataPoints.find(d => 
    d.metric === metric && 
    d.bank === bank && 
    d.period === selectedPeriod &&
    d.standardizedSegment === selectedSegment
  );
  
  const [showPopover, setShowPopover] = useState(false);

  // Currency conversion rate
  const rate = selectedCurrency === 'USD' ? 0.128 : 1;
  const currencySymbol = selectedCurrency === 'USD' ? '$' : '';

  const formatValue = (val: number | undefined, unit: string) => {
    if (val === undefined) return '-';
    // Handle % units differently - DO NOT CONVERT
    if (unit === '%') return `${val.toFixed(2)}%`;
    
    // Convert Value
    const convertedVal = val * rate;
    return `${currencySymbol}${convertedVal.toLocaleString(undefined, { maximumFractionDigits: 1 })}${unit}`;
  };

  const handleClick = () => {
    if (data) onViewSource(data);
  };

  return (
    <td className="p-3 text-right font-mono border-l border-gray-800 relative group cursor-pointer hover:bg-gray-800 transition-colors"
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
        onClick={handleClick}
    >
      <div className="flex items-center justify-end gap-2">
        {/* Highlight value slightly on hover to indicate clickability */}
        <span className={`${data && data.value < 0 ? 'text-red-400' : 'text-gray-200'} group-hover:text-amber-400 group-hover:underline decoration-dotted underline-offset-4`}>
            {formatValue(data?.value, data?.unit || '')}
        </span>
        {data && <Search size={10} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
      </div>

      {data?.normalized && <span className="absolute top-2 right-1 text-[9px] text-amber-500/50">*</span>}
      
      {/* Hover Popover (Quick Glance) */}
      {showPopover && data && (
        <div className="absolute z-40 bottom-full right-0 mb-2 w-64 bg-slate-900/95 backdrop-blur border border-gray-700 rounded shadow-2xl p-3 text-left pointer-events-none">
          <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
            <div className="text-[10px] text-amber-500 font-bold uppercase">Click to View Source</div>
          </div>
          <div className="text-[10px] text-gray-400 font-mono mb-1 truncate">{data.sourceDoc}</div>
          <div className="text-[10px] text-gray-500">Page {data.pageNumber}</div>
        </div>
      )}
    </td>
  );
};

export const Comparison: React.FC = () => {
  const { financialData } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('2025 1H'); // Default updated
  const [selectedSegment, setSelectedSegment] = useState<StandardizedSegment>(StandardizedSegment.GROUP);
  const [selectedCurrency, setSelectedCurrency] = useState('HKD');
  const [selectedBanks, setSelectedBanks] = useState<BankName[]>([
    BankName.HSBC_HK, 
    BankName.SC_HK, 
    BankName.BOC_HK,
    BankName.HANG_SENG
  ]);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<FinancialDataPoint | null>(null);
  const bankDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(event.target as Node)) {
        setIsBankDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const periods = Array.from(new Set(financialData.map(d => d.period))).sort().reverse();
  const allBanks = Object.values(BankName);
  const segments = Object.values(StandardizedSegment);

  const toggleBank = (bank: BankName) => {
    setSelectedBanks(prev => {
      if (prev.includes(bank)) {
        if (prev.length === 1) return prev;
        return prev.filter(b => b !== bank);
      } else {
        return [...prev, bank];
      }
    });
  };

  const ComparisonRow = ({ label, indent = 0 }: { label: string, indent?: number }) => (
    <tr className="hover:bg-gray-800/30 border-b border-gray-800 last:border-0 transition-colors">
      <td className={`p-3 text-sm text-gray-300 ${indent ? 'pl-8 text-gray-400' : 'font-medium'}`}>
        {label}
      </td>
      {selectedBanks.map(bank => (
        <CitationCell 
            key={bank} 
            metric={label} 
            bank={bank} 
            selectedPeriod={selectedPeriod}
            selectedSegment={selectedSegment}
            selectedCurrency={selectedCurrency}
            dataPoints={financialData}
            onViewSource={setViewingDoc}
        />
      ))}
    </tr>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <tr className="bg-gray-800/50">
      <td colSpan={selectedBanks.length + 1} className="p-2 pl-3 text-xs font-bold text-amber-500 uppercase tracking-widest">
        {title}
      </td>
    </tr>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="p-4 border-b border-gray-800 bg-slate-900 flex flex-wrap items-center gap-4">
        
        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase font-mono">Period:</span>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-2 py-1 outline-none focus:border-amber-500"
          >
            {periods.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        
        {/* Currency Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase font-mono">Currency:</span>
          <select 
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-2 py-1 outline-none focus:border-amber-500"
          >
            <option value="HKD">HKD (Reported)</option>
            <option value="USD">USD (Converted)</option>
          </select>
        </div>

        {/* Bank Multi-Select */}
        <div className="relative" ref={bankDropdownRef}>
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase font-mono">Banks:</span>
                <button 
                    onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                    className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-white text-sm rounded px-3 py-1 hover:border-amber-500 transition-colors"
                >
                    {selectedBanks.length} Selected <ChevronDown size={12} />
                </button>
            </div>
            
            {isBankDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-gray-900 border border-gray-700 rounded shadow-xl z-50 p-1">
                    {allBanks.map(bank => (
                        <div 
                            key={bank}
                            onClick={() => toggleBank(bank)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-800 cursor-pointer rounded text-sm text-gray-300"
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedBanks.includes(bank) ? 'bg-amber-600 border-amber-600' : 'border-gray-600'}`}>
                                {selectedBanks.includes(bank) && <Check size={10} className="text-white" />}
                            </div>
                            {bank}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Segment Selector */}
        <div className="flex items-center gap-2 pl-4 border-l border-gray-700">
          <span className="text-xs text-amber-500 uppercase font-mono font-bold">Scope:</span>
          <select 
            value={selectedSegment} 
            onChange={(e) => setSelectedSegment(e.target.value as StandardizedSegment)}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-2 py-1 outline-none focus:border-amber-500 w-48"
          >
            {segments.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex-1"></div>

        <button className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded uppercase tracking-wider transition-colors">
          <Download size={14} /> Export XLS
        </button>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto bg-slate-950 p-4">
        <div className="border border-gray-800 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Line Item</th>
                {selectedBanks.map(bank => (
                  <th key={bank} className="p-4 text-right text-xs font-bold text-white uppercase tracking-wider border-l border-gray-800 min-w-[140px]">
                    {bank}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-slate-900/50">
              <SectionHeader title="Profit & Loss" />
              <ComparisonRow label="Net Interest Income" />
              <ComparisonRow label="Non-Interest Income" />
              <ComparisonRow label="Other Income" />
              <ComparisonRow label="Operating Expenses" />
              <ComparisonRow label="Operating Profit" />
              <ComparisonRow label="Provisions" />
              <ComparisonRow label="Pretax Earnings" />
              
              {selectedSegment === StandardizedSegment.GROUP && (
                  <>
                    <SectionHeader title="Balance Sheet" />
                    <ComparisonRow label="Total Loans" />
                    <ComparisonRow label="Total Deposits" />
                    
                    <SectionHeader title="Key Ratios" />
                    <ComparisonRow label="NPL Ratio" />
                    <ComparisonRow label="Common Equity Tier 1" />
                  </>
              )}
               {selectedSegment !== StandardizedSegment.GROUP && (
                  <>
                     <SectionHeader title="Balance Sheet (Segment Allocated)" />
                     <ComparisonRow label="Total Loans" />
                     <ComparisonRow label="Total Deposits" />
                  </>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex flex-col gap-1 text-[10px] text-gray-500 font-mono">
            <div className="flex items-center gap-1">
                <span className="text-amber-500">*</span> Indicates normalized value based on geographical mapping logic
            </div>
            <div className="flex items-center gap-1">
                <Info size={12} /> Click on any cell to verify the source document and raw extract
            </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <DocumentViewer 
            dataPoint={viewingDoc} 
            onClose={() => setViewingDoc(null)} 
        />
      )}
    </div>
  );
};
