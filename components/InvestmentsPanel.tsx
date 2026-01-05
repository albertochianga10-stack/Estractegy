
import React, { useState } from 'react';
import { Investment } from '../types';
import { TrendingUp, TrendingDown, Layers, Plus, Edit2, Trash2, X, Save } from 'lucide-react';

interface Props {
  investments: Investment[];
  onAddInvestment: (entry: Investment) => void;
  onUpdateInvestment: (entry: Investment) => void;
  onRemoveInvestment: (id: string) => void;
}

const formatKz = (value: number) => {
  return value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz');
};

const InvestmentsPanel: React.FC<Props> = ({ 
  investments, 
  onAddInvestment, 
  onUpdateInvestment, 
  onRemoveInvestment 
}) => {
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Stock' as Investment['type'],
    amount: '',
    currentValue: '',
    performance: ''
  });

  const handleOpenAdd = () => {
    setIsAdding(true);
    setFormData({ name: '', type: 'Stock', amount: '', currentValue: '', performance: '0' });
  };

  const handleOpenEdit = (inv: Investment) => {
    setEditingInvestment(inv);
    setFormData({
      name: inv.name,
      type: inv.type,
      amount: inv.amount.toString(),
      currentValue: inv.currentValue.toString(),
      performance: inv.performance.toString()
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invData: Investment = {
      id: editingInvestment?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      type: formData.type,
      amount: parseFloat(formData.amount),
      currentValue: parseFloat(formData.currentValue),
      performance: parseFloat(formData.performance)
    };

    if (editingInvestment) {
      onUpdateInvestment(invData);
    } else {
      onAddInvestment(invData);
    }
    
    setEditingInvestment(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Portfólio de Ativos</h2>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus size={16} /> Novo Ativo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {investments.map((inv) => (
          <div key={inv.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 group hover:shadow-md transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Layers size={20} />
              </div>
              <div className="flex items-center gap-2">
                 <button 
                  onClick={() => handleOpenEdit(inv)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => { if(confirm('Eliminar este ativo?')) onRemoveInvestment(inv.id); }}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
                <span className={`flex items-center gap-1 text-sm font-bold ${inv.performance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {inv.performance >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {inv.performance}%
                </span>
              </div>
            </div>
            
            <h4 className="text-lg font-bold text-slate-900 truncate">{inv.name}</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 bg-slate-100 inline-block px-2 py-0.5 rounded-full">{inv.type}</p>
            
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

      {/* Modal Overlay */}
      {(editingInvestment || isAdding) && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">
                {editingInvestment ? 'Editar Ativo' : 'Adicionar Novo Ativo'}
              </h3>
              <button onClick={() => { setEditingInvestment(null); setIsAdding(false); }} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Ativo</label>
                <input 
                  required
                  type="text"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                  <select 
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as Investment['type']})}
                  >
                    <option value="Stock">Ações (BODIVA)</option>
                    <option value="Bond">Obrigações/Tesouro</option>
                    <option value="Real Estate">Imobiliário</option>
                    <option value="Cash">Liquidez/Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Performance (%)</label>
                  <input 
                    type="number" step="0.1"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                    value={formData.performance}
                    onChange={(e) => setFormData({...formData, performance: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Capital Inicial (Kz)</label>
                <input 
                  required
                  type="number"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valor Atual (Kz)</label>
                <input 
                  required
                  type="number"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => { setEditingInvestment(null); setIsAdding(false); }}
                  className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} /> {editingInvestment ? 'Guardar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentsPanel;
