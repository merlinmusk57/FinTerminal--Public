import React from 'react';
import { LayoutDashboard, FileText, Database, GitGraph, MessageSquareText, Settings, PieChart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SidebarItem = ({ icon: Icon, label, id, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center p-3 mb-1 transition-colors duration-200 ${
      active 
        ? 'text-amber-500 bg-gray-800 border-l-4 border-amber-500' 
        : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }`}
  >
    <Icon size={18} className="mr-3" />
    <span className="text-sm font-mono tracking-tighter uppercase">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex h-screen bg-slate-950 text-gray-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-gray-800 flex flex-col flex-shrink-0 z-20">
        <div className="p-4 border-b border-gray-800 mb-4">
          <h1 className="text-xl font-bold text-white tracking-widest flex items-center">
            <span className="text-amber-500 mr-2">◈</span>
            FIN<span className="text-amber-500">TERM</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-mono">HK BANKING PEERS</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarItem id="ingestion" label="Data Ingestion" icon={FileText} active={activeTab === 'ingestion'} onClick={setActiveTab} />
          <SidebarItem id="query" label="Data Query" icon={Database} active={activeTab === 'query'} onClick={setActiveTab} />
          <SidebarItem id="mapping" label="Normalization" icon={GitGraph} active={activeTab === 'mapping'} onClick={setActiveTab} />
          <SidebarItem id="comparison" label="Peer Analysis" icon={PieChart} active={activeTab === 'comparison'} onClick={setActiveTab} />
          <SidebarItem id="analyst" label="Analyst Chat" icon={MessageSquareText} active={activeTab === 'analyst'} onClick={setActiveTab} />
        </div>

        <div className="p-4 border-t border-gray-800">
           <SidebarItem id="settings" label="Settings" icon={Settings} active={activeTab === 'settings'} onClick={setActiveTab} />
           <div className="mt-4 text-[10px] text-gray-600 font-mono text-center">
              SYSTEM STATUS: ONLINE<br/>
              LATENCY: 24ms
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 relative">
        {/* Top Header */}
        <header className="h-12 bg-slate-900 border-b border-gray-800 flex items-center justify-between px-6 shadow-md z-10">
          <div className="text-xs font-mono text-amber-500">
            MARKET: HONG KONG &gt; BANKING &gt; PEER GROUP
          </div>
          <div className="text-xs font-mono text-gray-400">
            {new Date().toISOString().split('T')[0]} | HKD/USD 7.82
          </div>
        </header>

        <main className="flex-1 overflow-auto p-0 relative">
          {children}
        </main>
      </div>
    </div>
  );
};