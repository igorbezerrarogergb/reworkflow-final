
import React, { useState, useEffect, useCallback } from 'react';
import { ReworkTicket, Status, AIAnalysisResult } from './types';
import { Icons } from './constants';
import Dashboard from './components/Dashboard';
import ReworkList from './components/ReworkList';
import ReworkForm from './components/ReworkForm';
import AIAnalysisModal from './components/AIAnalysisModal';
import { analyzeRework, getAggregatedInsights } from './services/geminiService';

const STORAGE_KEY = 'reworkflow_tickets';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<ReworkTicket[]>([]);
  const [view, setView] = useState<'dashboard' | 'list'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<{ ticket: ReworkTicket; result: AIAnalysisResult | null; loading: boolean } | null>(null);
  const [globalInsights, setGlobalInsights] = useState<string | null>(null);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTickets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse stored tickets");
      }
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  const handleAddTicket = (ticketData: Omit<ReworkTicket, 'id' | 'createdAt'>) => {
    const newTicket: ReworkTicket = {
      ...ticketData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTickets([newTicket, ...tickets]);
  };

  const handleDeleteTicket = (id: string) => {
    if (window.confirm('Delete this record?')) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };

  const handleStatusChange = (id: string, status: Status) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleAnalyze = async (ticket: ReworkTicket) => {
    setActiveAnalysis({ ticket, result: null, loading: true });
    try {
      const result = await analyzeRework(ticket);
      setActiveAnalysis({ ticket, result, loading: false });
    } catch (error) {
      alert("Failed to reach AI server. Please check your API Key.");
      setActiveAnalysis(null);
    }
  };

  const generateGlobalInsights = async () => {
    if (tickets.length < 2) {
      alert("Please add at least 2 tickets to identify patterns.");
      return;
    }
    setIsInsightsLoading(true);
    try {
      const insight = await getAggregatedInsights(tickets);
      setGlobalInsights(insight);
    } catch (error) {
      alert("Error generating insights.");
    } finally {
      setIsInsightsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold italic">R</div>
          <h1 className="text-xl font-bold tracking-tight text-white">ReworkFlow</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Icons.Dashboard /> Dashboard
          </button>
          <button
            onClick={() => setView('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Icons.History /> All Tickets
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">AI Insights</h4>
            <button 
              onClick={generateGlobalInsights}
              disabled={isInsightsLoading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {isInsightsLoading ? 'Thinking...' : 'Analyze Patterns'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{view === 'dashboard' ? 'Operational Overview' : 'Rework Records'}</h2>
            <p className="text-slate-500">Track and manage process inefficiencies efficiently.</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Icons.Plus /> New Rework
          </button>
        </header>

        {globalInsights && (
          <div className="mb-8 p-6 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-2xl shadow-xl animate-in slide-in-from-top duration-500 relative">
            <button onClick={() => setGlobalInsights(null)} className="absolute top-4 right-4 text-white/60 hover:text-white">✕</button>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                <Icons.Analysis />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Global Process Insight</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">{globalInsights}</p>
              </div>
            </div>
          </div>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {view === 'dashboard' ? (
            <Dashboard tickets={tickets} />
          ) : (
            <ReworkList 
              tickets={tickets} 
              onDelete={handleDeleteTicket} 
              onStatusChange={handleStatusChange} 
              onAnalyze={handleAnalyze}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {isFormOpen && <ReworkForm onSubmit={handleAddTicket} onClose={() => setIsFormOpen(false)} />}
      {activeAnalysis && (
        <AIAnalysisModal 
          ticket={activeAnalysis.ticket}
          analysis={activeAnalysis.result}
          loading={activeAnalysis.loading}
          onClose={() => setActiveAnalysis(null)}
        />
      )}
    </div>
  );
};

export default App;
