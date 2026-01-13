
import React from 'react';
import { AIAnalysisResult, ReworkTicket } from '../types';

interface AIAnalysisModalProps {
  ticket: ReworkTicket;
  analysis: AIAnalysisResult | null;
  loading: boolean;
  onClose: () => void;
}

const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({ ticket, analysis, loading, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/><path d="m9.01 10.5 2.5 2.5"/><path d="m15 15 .5.5"/></svg>
              </span>
              AI Root Cause Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-1">Ticket: {ticket.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600 animate-pulse">Gemini is analyzing rework patterns...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Identified Category</p>
                  <p className="text-slate-800 font-semibold">{analysis.category}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Level</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    analysis.estimatedRisk.toLowerCase().includes('high') ? 'bg-red-100 text-red-700' :
                    analysis.estimatedRisk.toLowerCase().includes('medium') ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {analysis.estimatedRisk}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-md font-bold text-slate-800 mb-2">Gemini's Suggestion</h3>
                <p className="text-slate-600 bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/50 leading-relaxed italic">
                  "{analysis.suggestion}"
                </p>
              </div>

              <div>
                <h3 className="text-md font-bold text-slate-800 mb-2">Preventive Measures</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {analysis.preventiveMeasures.map((measure, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-indigo-600 mt-1 font-bold">✓</span>
                      {measure}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              Failed to load AI analysis. Please try again.
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium shadow-sm"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisModal;
