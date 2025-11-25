import React, { createContext, useContext, useState, useEffect } from 'react';
import { FinancialDataPoint, IngestedDocument, BankName } from '../types';
import { MOCK_DOCUMENTS, generateInitialData, generateDataForNewFile } from '../mockData';

interface DataContextType {
  documents: IngestedDocument[];
  financialData: FinancialDataPoint[];
  apiKey: string;
  setApiKey: (key: string) => void;
  ingestDocument: (file: File) => Promise<void>;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<IngestedDocument[]>(MOCK_DOCUMENTS);
  const [financialData, setFinancialData] = useState<FinancialDataPoint[]>([]);
  const [apiKey, setApiKeyState] = useState('');

  // Initialize Data
  useEffect(() => {
    setFinancialData(generateInitialData());
    
    // Load API Key from local storage
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKeyState(storedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const ingestDocument = async (file: File) => {
    // 1. Determine metadata from filename (simulation)
    const lowerName = file.name.toLowerCase();
    let bank = BankName.HSBC_HK; // Default fallback

    if (lowerName.includes('sc') || lowerName.includes('standard chartered')) {
      bank = BankName.SC_HK;
    } else if (lowerName.includes('boc') || lowerName.includes('bank of china')) {
      bank = BankName.BOC_HK;
    } else if (lowerName.includes('hang seng') || lowerName.includes('hase') || (lowerName.includes('hsb') && !lowerName.includes('hsbc'))) {
      bank = BankName.HANG_SENG;
    } else if (lowerName.includes('hsbc')) {
      bank = BankName.HSBC_HK;
    }

    const newDoc: IngestedDocument = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.name.endsWith('pdf') ? 'PDF' : 'EXCEL',
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'processing',
      bank
    };

    setDocuments(prev => [newDoc, ...prev]);

    // 2. Simulate Async Processing time
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 3. Mark as ready and generate data
    setDocuments(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'ready' } : d));
    
    // 4. Inject new data into the system
    const newData = generateDataForNewFile(file.name, bank);
    
    // Remove old data for this bank/period if it exists to avoid duplicates, then add new
    setFinancialData(prev => {
      const filtered = prev.filter(p => !(p.bank === bank && p.period === newData[0].period));
      return [...filtered, ...newData];
    });
  };

  const resetData = () => {
    setFinancialData(generateInitialData());
    setDocuments(MOCK_DOCUMENTS);
  };

  return (
    <DataContext.Provider value={{ documents, financialData, apiKey, setApiKey, ingestDocument, resetData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};