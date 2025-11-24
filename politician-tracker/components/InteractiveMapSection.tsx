'use client';

import React, { useState } from 'react';
import GlobeWrapper from './GlobeWrapper';
import { StateAnalysis } from '@/lib/gemini';

export default function InteractiveMapSection() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<{
    analysis: StateAnalysis;
    politicians: any[];
    topTickers: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStateSelect = (stateName: string, data: any) => {
    setSelectedState(stateName);

    // Initial call from globe: data is null → start loading state
    if (data === null || typeof data === 'undefined') {
      setIsLoading(true);
      setError(null);
      return;
    }

    setIsLoading(false);

    // If API responded with an error payload
    if (data.error) {
      setError(data.error || 'Failed to load state data');
      setAnalysisData({
        analysis: {
          stateName,
          summary: "Unable to retrieve analysis data at this time.",
          topSectors: [],
          tradingActivityLevel: "LOW",
          keyInsight: "Data unavailable."
        },
        politicians: [],
        topTickers: []
      });
      return;
    }

    setError(null);

    // Ensure analysis object exists with all required fields
    const safeAnalysis: StateAnalysis = {
      stateName: data.analysis?.stateName || stateName,
      summary: data.analysis?.summary || "Analysis unavailable.",
      topSectors: data.analysis?.topSectors || [],
      tradingActivityLevel: data.analysis?.tradingActivityLevel || "LOW",
      keyInsight: data.analysis?.keyInsight || "No data available."
    };

    setAnalysisData({
      analysis: safeAnalysis,
      politicians: data.politicians || [],
      topTickers: data.topTickers || []
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Global Surveillance Map</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time monitoring of political trading activities across regions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/30 border border-cyan-900/50 rounded-full">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-cyan-400">LIVE FEED</span>
          </div>
          <span className="text-xs font-mono text-slate-600">GEMINI AI CONNECTED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlobeWrapper onStateSelect={handleStateSelect} />
        </div>

        {/* Analysis Panel */}
        <div className="lg:col-span-1 bg-slate-950 rounded-xl p-6 border border-slate-800 shadow-2xl overflow-y-auto max-h-[600px] relative group">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/30 rounded-br-lg"></div>

          {!selectedState ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <div className="relative">
                <div className="w-20 h-20 border-2 border-dashed border-cyan-900 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-0 w-14 h-14 m-auto border border-cyan-500/30 rounded-full animate-[ping_3s_ease-in-out_infinite]"></div>
              </div>
              <div className="space-y-2">
                <p className="font-mono text-cyan-400 text-sm tracking-widest">AWAITING TARGET SELECTION</p>
                <p className="text-xs text-slate-500 max-w-[200px] mx-auto">Select a jurisdiction on the map to initiate deep-scan analysis.</p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="space-y-2">
                <p className="font-mono text-cyan-400 text-sm tracking-widest">SCANNING...</p>
                <p className="text-xs text-slate-500">Analyzing {selectedState} data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-red-500 text-4xl mb-2">⚠</div>
              <p className="font-mono text-red-400 text-sm">{error}</p>
              <p className="text-xs text-slate-500">Please try selecting another state.</p>
            </div>
          ) : analysisData && analysisData.analysis ? (
            <div className="space-y-6 opacity-100 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-3xl font-bold text-white tracking-tight">{selectedState}</h3>
                  <span className="text-[10px] font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded">ID: {selectedState.substring(0, 3).toUpperCase()}_001</span>
                </div>

                <div className="flex gap-2 mt-3">
                  <div className="flex flex-col bg-cyan-950/20 px-3 py-2 rounded border border-cyan-900/30 flex-1">
                    <span className="text-[10px] text-cyan-500 font-mono uppercase">Activity Level</span>
                    <span className="text-cyan-100 font-bold text-sm">{analysisData.analysis.tradingActivityLevel || 'LOW'}</span>
                  </div>
                  <div className="flex flex-col bg-purple-950/20 px-3 py-2 rounded border border-purple-900/30 flex-1">
                    <span className="text-[10px] text-purple-500 font-mono uppercase">Active Agents</span>
                    <span className="text-purple-100 font-bold text-sm">{(analysisData.politicians?.length || 0)} DETECTED</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-cyan-500 rounded-full"></div>
                  <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">AI Tactical Insight</h4>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded border border-slate-800/50">
                  {analysisData.analysis.summary || 'No summary available.'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                  <h4 className="text-xs font-mono text-purple-400 uppercase tracking-wider">Key Anomaly</h4>
                </div>
                <div className="bg-purple-900/10 p-4 rounded border border-purple-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 opacity-20">
                    <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-sm italic text-purple-200 relative z-10">"{analysisData.analysis.keyInsight || 'No insight available.'}"</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider border-b border-slate-800 pb-1">Sector Distribution</h4>
                <div className="flex flex-wrap gap-2">
                  {(analysisData.analysis.topSectors || []).length > 0 ? (
                    analysisData.analysis.topSectors.map((sector, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 transition-colors rounded text-slate-300 border border-slate-700">
                        {sector}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No sector data available</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider border-b border-slate-800 pb-1">High Volume Assets</h4>
                <div className="space-y-1">
                  {(analysisData.topTickers || []).length > 0 ? (
                    analysisData.topTickers.map((t: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm items-center bg-slate-900/50 hover:bg-slate-800/50 transition-colors p-2 rounded border border-slate-800/50 group/item">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                          <span className="font-bold text-white group-hover/item:text-cyan-400 transition-colors">{t.ticker}</span>
                        </div>
                        <span className="text-slate-500 text-xs font-mono">{t.count} TRADES</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic p-2">No ticker data available</div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

