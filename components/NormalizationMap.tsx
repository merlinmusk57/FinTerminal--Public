
import React, { useState } from 'react';
import { ArrowRight, FileText, Filter, CheckCircle, Database, Map as MapIcon, GitBranch, BookOpen, Shield, AlertTriangle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { FinancialDataPoint } from '../types';

export const NormalizationMap: React.FC = () => {
  const { financialData } = useData();
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'audit' | 'rules'>('map');

  // Get selected data point
  const selectedPoint = financialData.find(d => d.id === selectedPointId);

  // Get a list of recent items for the sidebar
  const recentItems = [...financialData].reverse().slice(0, 20);

  const LogicMap = () => (
    <div className="p-8 h-full overflow-y-auto">
        <div className="mb-8">
             <h2 className="text-2xl font-mono text-white mb-2">DATA NORMALIZATION LOGIC MAP</h2>
             <p className="text-gray-400 text-sm max-w-3xl">
                Visualizing how diverse bank reporting structures are harmonized into the "Standardized HK Framework".
             </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 relative">
            {/* Column 1: Sources */}
            <div className="space-y-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">1. Diverse Sources</div>
                
                {['HSBC Annual Report', 'SCB Interim Results', 'BOC Earnings Call', 'Hang Seng Data Pack'].map((src, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 p-4 rounded-lg relative">
                        <div className="flex items-center gap-2 mb-2">
                             <FileText size={16} className="text-gray-400" />
                             <span className="text-sm font-bold text-gray-300">{src}</span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                             Formats: PDF, XLSX, Audio<br/>
                             Currencies: USD, HKD, RMB
                        </div>
                        {/* Connector Line */}
                        <div className="hidden xl:block absolute -right-6 top-1/2 w-6 h-px bg-gray-800"></div>
                    </div>
                ))}
            </div>

            {/* Column 2: Segment Mapping */}
            <div className="space-y-4">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-widest border-b border-gray-800 pb-2">2. Segment Mapping</div>
                
                {/* Logic Box */}
                <div className="bg-amber-950/10 border border-amber-900/50 p-4 rounded-lg h-full flex flex-col justify-center">
                    <div className="space-y-6">
                         <div className="bg-black/40 p-3 rounded border border-amber-900/30">
                            <div className="text-[10px] text-amber-500 uppercase mb-1">Taxonomy Rule #1</div>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <span>Wealth & Personal Banking</span> 
                                <ArrowRight size={10} /> 
                                <span className="font-bold text-white">Retail & Wealth</span>
                            </div>
                         </div>
                         <div className="bg-black/40 p-3 rounded border border-amber-900/30">
                            <div className="text-[10px] text-amber-500 uppercase mb-1">Taxonomy Rule #2</div>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <span>Comm. Banking / CMB</span> 
                                <ArrowRight size={10} /> 
                                <span className="font-bold text-white">Corp. & Commercial</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Column 3: Geo Filtering */}
            <div className="space-y-4">
                <div className="text-xs font-bold text-blue-500 uppercase tracking-widest border-b border-gray-800 pb-2">3. Geo Filtering</div>
                
                <div className="bg-blue-950/10 border border-blue-900/50 p-4 rounded-lg h-full relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 bg-slate-950 px-2 text-blue-500">
                        {/* <Globe size={20} /> */}
                    </div>
                    <div className="h-full flex flex-col justify-center gap-4 text-center">
                        <div className="text-sm text-gray-300">
                            Extract specific <span className="text-white font-bold">HK Operations</span> data from:
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                             <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded border border-blue-800">Asia Pacific Segment</span>
                             <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded border border-blue-800">Greater China</span>
                             <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded border border-blue-800">Note 32 (Geo)</span>
                        </div>
                        <div className="h-px bg-gray-800 w-full my-2"></div>
                        <div className="text-xs text-gray-400">Currency Conversion: USD/RMB -> HKD (Spot Rate)</div>
                    </div>
                </div>
            </div>

            {/* Column 4: Output */}
            <div className="space-y-4">
                 <div className="text-xs font-bold text-green-500 uppercase tracking-widest border-b border-gray-800 pb-2">4. Standardized Output</div>
                 <div className="bg-gray-900 border-2 border-green-900 p-6 rounded-lg h-full flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(22,163,74,0.1)]">
                      <Database size={48} className="text-green-500 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Vector Database</h3>
                      <p className="text-xs text-gray-400">
                          Structured, comparable data points ready for Peer Analysis & Pivot Queries.
                      </p>
                 </div>
            </div>
        </div>
    </div>
  );

  const RulesView = () => (
    <div className="p-8 h-full overflow-y-auto bg-slate-950">
        <div className="mb-8">
             <h2 className="text-2xl font-mono text-white mb-2">STANDARDIZATION RULES & ALGORITHMS</h2>
             <p className="text-gray-400 text-sm max-w-4xl">
                This section details the exact logic used to map disparate bank reporting segments into our comparable "Apple-to-Apple" framework. 
                All data is rebasing to <b>HKD</b> and filtered for <b>Hong Kong geographical operations</b> unless otherwise stated.
             </p>
        </div>

        <div className="overflow-hidden border border-gray-800 rounded-lg">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-900 border-b border-gray-800">
                        <th className="p-4 text-xs font-bold text-amber-500 uppercase w-1/5">Target Segment</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase w-1/5">HSBC (HK Entity)</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase w-1/5">Standard Chartered (HK)</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase w-1/5">BOC Hong Kong</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase w-1/5">Specific Inclusions/Rules</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm">
                    <tr className="bg-slate-900/50 hover:bg-slate-900 transition-colors">
                        <td className="p-4 font-bold text-white border-r border-gray-800">
                            Retail & Wealth
                        </td>
                        <td className="p-4 text-gray-300 border-r border-gray-800">
                            Wealth & Personal Banking (WPB)
                        </td>
                        <td className="p-4 text-gray-300 border-r border-gray-800">
                            Consumer, Private & Business Banking (CPBB)
                        </td>
                        <td className="p-4 text-gray-300 border-r border-gray-800">
                            Personal Banking
                        </td>
                        <td className="p-4 text-xs text-gray-400 bg-slate-950/30">
                            <ul className="list-disc pl-4 space-y-1">
                                <li><b>Private Banking:</b> Included in this segment for all banks to ensure comparability with HSBC's WPB structure.</li>
                                <li><b>SMEs:</b> SCB includes Small Business in CPBB; HSBC includes in CMB. <span className="text-amber-500">Note: Slight variance in SME classification remains.</span></li>
                            </ul>
                        </td>
                    </tr>

                    <tr className="bg-slate-900/50 hover:bg-slate-900 transition-colors">
                        <td className="p-4 font-bold text-white border-r border-gray-800">
                            Corporate & Commercial
                        </td>
                        <td className="p-4 text-gray-300 border-r border-gray-800">
                            Commercial Banking (CMB)
                        </td>
                        <td className="p-4 text-gray-300 border-r border-gray-800">
                            Corporate, Commercial & Institutional Banking (CCIB) - <i>Commercial Portion</i>
                        </td>
                        <td className="p-4 text-gray-300 border-r border-gray-800">
                            Corporate Banking
                        </td>
                        <td className="p-4 text-xs text-gray-400 bg-slate-950/30">
                            <ul className="list-disc pl-4 space-y-1">
                                <li><b>Trade Finance:</b> Fully included.</li>
                                <li><b>Cash Management:</b> Fully included.</li>
                                <li>For SCB, we separate CCIB based on client turnover >$500m (mapped to Markets) vs &lt;$500m (mapped here) where breakdown available.</li>
                            </ul>
                        </td>
                    </tr>

                    <tr className="bg-slate-900/50 hover:bg-slate-900 transition-colors">
                        <td className="p-4 font-bold text-white border-r border-gray-800">
                            Global Markets / Treasury
                        </td>
                        <td className="p-4 text-gray-300 border-r border-gray-800">
                            Global Banking & Markets (GBM)
                        </td>
                        <td className="p-4 text-gray-300 border-r border-gray-800">
                            Financial Markets / Treasury
                        </td>
                        <td className="p-4 text-gray-300 border-r border-gray-800">
                            Treasury
                        </td>
                        <td className="p-4 text-xs text-gray-400 bg-slate-950/30">
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Includes proprietary trading, balance sheet management, and investment portfolios.</li>
                                <li>Inter-segment eliminations are generally excluded from this line to show gross performance.</li>
                            </ul>
                        </td>
                    </tr>
                    <tr className="bg-slate-900/50 hover:bg-slate-900 transition-colors">
                        <td className="p-4 font-bold text-white border-r border-gray-800">
                            Group (Total)
                        </td>
                        <td className="p-4 text-gray-300 border-r border-gray-800">
                            HK Operations (Geo Segment)
                        </td>
                        <td className="p-4 text-gray-300 border-r border-gray-800">
                            Hong Kong (Geo Segment)
                        </td>
                        <td className="p-4 text-gray-300 border-r border-gray-800">
                            Consolidated Entity
                        </td>
                        <td className="p-4 text-xs text-gray-400 bg-slate-950/30">
                            <ul className="list-disc pl-4 space-y-1">
                                <li><b>Currency:</b> All non-HKD reporting converted at period-end spot rates for BS and average rates for P&L.</li>
                                <li><b>Scope:</b> Strictly Hong Kong geographical booking where disclosed; otherwise Greater China with adjustment.</li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-5 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-3 text-amber-500">
                    <Shield size={18} />
                    <h3 className="font-bold text-sm uppercase">Data Integrity Checks</h3>
                </div>
                <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex gap-2"><CheckCircle size={14} className="text-green-500"/> <span>Verify sum of segments equals Group Total within 2% margin.</span></li>
                    <li className="flex gap-2"><CheckCircle size={14} className="text-green-500"/> <span>Cross-reference P&L extracts with Balance Sheet movement.</span></li>
                    <li className="flex gap-2"><CheckCircle size={14} className="text-green-500"/> <span>Detect and flag currency restatements in prior periods.</span></li>
                </ul>
            </div>
            <div className="bg-gray-900 p-5 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-3 text-blue-500">
                    <AlertTriangle size={18} />
                    <h3 className="font-bold text-sm uppercase">Known Limitations</h3>
                </div>
                <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex gap-2"><span className="text-blue-500">•</span> <span>HSBC Global vs HK Entity: We use the specific "Hong Kong" geo slice from the Data Pack, not the global numbers.</span></li>
                    <li className="flex gap-2"><span className="text-blue-500">•</span> <span>SCB Private Banking: Explicitly mapped to Retail to match HSBC's WPB structure, despite internal separation.</span></li>
                </ul>
            </div>
        </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Top Navigation for Map View */}
      <div className="bg-slate-900 border-b border-gray-800 px-6 py-3 flex gap-4">
          <button 
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${viewMode === 'map' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
              <MapIcon size={14} /> Logic Map
          </button>
          <button 
            onClick={() => setViewMode('rules')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${viewMode === 'rules' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
              <BookOpen size={14} /> Rules & Logic
          </button>
          <button 
            onClick={() => setViewMode('audit')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${viewMode === 'audit' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
              <GitBranch size={14} /> Detailed Audit Trace
          </button>
      </div>

      <div className="flex-1 overflow-hidden">
      {viewMode === 'map' && <LogicMap />}
      {viewMode === 'rules' && <RulesView />}
      {viewMode === 'audit' && (
          <div className="h-full flex">
            {/* Left Sidebar: Audit Log */}
            <div className="w-80 border-r border-gray-800 bg-slate-900 flex flex-col">
                <div className="p-4 border-b border-gray-800">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Normalization Audit Log</h3>
                <p className="text-[10px] text-gray-500">Select an entry to view transformation lineage.</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {recentItems.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => setSelectedPointId(item.id)}
                            className={`p-3 border-b border-gray-800 cursor-pointer transition-colors ${
                                selectedPointId === item.id ? 'bg-amber-900/20 border-l-4 border-l-amber-500' : 'hover:bg-gray-800 border-l-4 border-l-transparent'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-gray-300">{item.bank}</span>
                                <span className="text-[9px] text-gray-500 font-mono">{item.period}</span>
                            </div>
                            <div className="text-sm text-amber-500 font-mono mb-1">{item.metric}</div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 truncate w-32">{item.sourceDoc}</span>
                                {item.normalized && <span className="text-[9px] bg-green-900/30 text-green-500 px-1 rounded border border-green-900">NORMALIZED</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content: Visualization */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
                {!selectedPoint ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                        <Filter size={48} className="mb-4 opacity-20" />
                        <p className="font-mono text-sm">Select a data point to trace its lineage.</p>
                    </div>
                ) : (
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="mb-8 flex justify-between items-end border-b border-gray-800 pb-4">
                            <div>
                                <div className="text-xs font-mono text-amber-500 mb-2">TRACEABILITY ID: {selectedPoint.id}</div>
                                <h2 className="text-2xl font-bold text-white">{selectedPoint.metric}</h2>
                                <div className="text-sm text-gray-400 mt-1">{selectedPoint.bank} • {selectedPoint.period}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 font-mono uppercase">Final Value</div>
                                <div className="text-2xl font-mono text-white">
                                    {selectedPoint.value.toLocaleString()} <span className="text-sm text-gray-500">{selectedPoint.unit} {selectedPoint.currency}</span>
                                </div>
                            </div>
                        </div>

                        {/* VISUALIZATION FLOW */}
                        <div className="flex flex-col gap-8 max-w-4xl mx-auto relative">
                            {/* Vertical Line */}
                            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-800 z-0"></div>

                            {/* Step 1: Source Document */}
                            <div className="relative z-10 pl-20">
                                <div className="absolute left-0 top-0 w-16 h-16 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center text-gray-400">
                                    <FileText size={24} />
                                </div>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-5 shadow-lg">
                                    <div className="flex justify-between mb-3">
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Source Artifact</h4>
                                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700">{selectedPoint.sourceDoc}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-3">
                                        <div>Page Number: <span className="text-gray-200">{selectedPoint.pageNumber}</span></div>
                                        <div>Original Segment: <span className="text-gray-200">{selectedPoint.originalSegment}</span></div>
                                    </div>
                                    <div className="bg-black/50 p-3 rounded border border-gray-800 font-mono text-[10px] text-gray-300 italic">
                                        "Raw Extract: {selectedPoint.rawExtractSnippet || 'N/A'}"
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Normalization Logic */}
                            <div className="relative z-10 pl-20">
                                <div className="absolute left-0 top-0 w-16 h-16 bg-gray-900 border border-amber-600 rounded-full flex items-center justify-center text-amber-500">
                                    <Filter size={24} />
                                </div>
                                <div className="bg-amber-950/20 border border-amber-600/30 rounded-lg p-5 shadow-lg">
                                    <h4 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-4">Normalization Engine</h4>
                                    
                                    <div className="space-y-3">
                                        {(selectedPoint.normalizationTrace || []).map((step, idx) => (
                                            <div key={idx} className="flex gap-3 items-start p-2 bg-black/20 rounded border border-amber-900/30">
                                                <div className="mt-0.5">
                                                    <CheckCircle size={14} className="text-green-500" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-200">{step.stepName}</div>
                                                    <div className="text-[10px] text-gray-400 mt-1">{step.description}</div>
                                                    {step.rawInput && step.transformedOutput && (
                                                        <div className="flex items-center gap-2 mt-2 text-[9px] font-mono bg-black/40 p-1 rounded inline-flex">
                                                            <span className="text-gray-500">{step.rawInput}</span>
                                                            <ArrowRight size={10} className="text-gray-600"/>
                                                            <span className="text-amber-500">{step.transformedOutput}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Database */}
                            <div className="relative z-10 pl-20">
                                <div className="absolute left-0 top-0 w-16 h-16 bg-gray-900 border border-green-600 rounded-full flex items-center justify-center text-green-500">
                                    <Database size={24} />
                                </div>
                                <div className="bg-gray-900 border border-green-900 rounded-lg p-5 shadow-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="text-sm font-bold text-green-500 uppercase tracking-wider">Trusted Record</h4>
                                        <div className="text-xs text-gray-500 mt-1">Ready for Peer Analysis</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-mono text-white">{selectedPoint.value.toLocaleString()}</div>
                                        <div className="text-[10px] text-gray-500 uppercase">Normalized: {selectedPoint.standardizedSegment}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
          </div>
      )}
      </div>
    </div>
  );
};
