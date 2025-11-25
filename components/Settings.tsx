
import React, { useState, useEffect } from 'react';
import { Key, Save, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export const Settings: React.FC = () => {
  const { apiKey, setApiKey } = useData();
  const [inputKey, setInputKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    if (apiKey) setInputKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    setApiKey(inputKey);
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-mono text-white mb-2">SYSTEM CONFIGURATION</h2>
        <p className="text-gray-400 text-sm">
           Configure external services for Analyst Chat.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Key size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-200">AI Service Credentials</h3>
            <p className="text-xs text-gray-500">Google Gemini API Key required for intelligent analysis.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">API Key</label>
            <input 
              type="password" 
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-gray-950 border border-gray-700 rounded px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none font-mono placeholder-gray-600"
            />
          </div>

          <div className="bg-blue-900/10 border border-blue-900/30 rounded p-4 flex gap-3 items-start">
            <ShieldCheck size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
                <h4 className="text-xs font-bold text-blue-300 mb-1">Secure Local Storage</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                Your key is stored securely in your browser's <code>localStorage</code>. It is never transmitted to any server other than Google's official API endpoints directly from your browser.
                </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2 rounded text-sm font-bold transition-all transform active:scale-95 ${
                  status === 'saved' 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {status === 'saved' ? <CheckCircle size={16} /> : <Save size={16} />}
              {status === 'saved' ? 'Saved Successfully' : 'Save Key'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
