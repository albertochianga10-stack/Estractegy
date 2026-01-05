
import React from 'react';
import { Investment } from '../types';
import { TrendingUp, TrendingDown, Layers, Plus } from 'lucide-react';

interface Props {
  investments: Investment[];
}

const formatKz = (value: number) => {
  return value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz');
};

const InvestmentsPanel: React.FC<Props> = ({ investments }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Carteira de Investimentos Corporativos</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
          <Plus size={16} /> Novo Ativo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {investments.map((inv) => (
          <div key={inv.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Layers size={20} />
              </div>
              <span className={`flex items-center gap-1 text-sm font-bold ${inv.performance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {inv.performance >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {inv.performance}%
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">{inv.name}</h4>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter mb-4">{inv.type}</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Capital Inicial</span>
                <span className="font-semibold text-slate-900">{formatKz(inv.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Valor Atual</span>
                <span className="font-bold text-blue-600">{formatKz(inv.currentValue)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentsPanel;
