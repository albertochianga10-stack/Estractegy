
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, RefreshCcw, ShieldCheck, Zap } from 'lucide-react';
import { analyzeFinancialRisk } from '../services/geminiService';
import { BudgetEntry, Investment, RiskAnalysis } from '../types';

interface RiskProps {
  budgets: BudgetEntry[];
  investments: Investment[];
}

const RiskAnalysisPanel: React.FC<RiskProps> = ({ budgets, investments }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);

  const performAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeFinancialRisk(budgets, investments);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <RefreshCcw className="animate-spin text-slate-400" size={48} />
        <p className="text-slate-500 font-medium">Applemar AI is analyzing financial exposure...</p>
      </div>
    );
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-emerald-500';
    if (score < 70) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Strategic Risk Assessment</h2>
        <button 
          onClick={performAnalysis}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
        >
          <RefreshCcw size={16} /> Re-analyze
        </button>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className={`text-6xl font-bold mb-2 ${getRiskColor(analysis.riskScore)}`}>
              {analysis.riskScore}
            </div>
            <p className="text-slate-500 font-medium uppercase tracking-wider text-sm">Risk Score Index</p>
            <div className="mt-6 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${analysis.riskScore > 70 ? 'bg-red-500' : analysis.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                style={{ width: `${analysis.riskScore}%` }}
              ></div>
            </div>
            <p className="mt-6 text-slate-600 text-sm italic">
              "Based on current departmental budgets and investment volatility."
            </p>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
                <AlertTriangle className="text-amber-500" size={20} /> Critical Issues
              </h3>
              <ul className="space-y-3">
                {analysis.criticalIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg text-red-800 text-sm">
                    <span className="mt-0.5">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
                <ShieldCheck className="text-emerald-500" size={20} /> Strategic Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg text-emerald-800 text-sm">
                    <Zap size={14} className="shrink-0" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
                <Info className="text-blue-500" size={20} /> Market Outlook
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed bg-blue-50 p-4 rounded-lg">
                {analysis.marketOutlook}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAnalysisPanel;
