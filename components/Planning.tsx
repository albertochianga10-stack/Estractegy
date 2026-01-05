
import React, { useState } from 'react';
import { Department, BudgetEntry } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface PlanningProps {
  budgets: BudgetEntry[];
  onAddBudget: (entry: BudgetEntry) => void;
  onRemoveBudget: (id: string) => void;
}

const formatKz = (value: number) => {
  return value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz');
};

const Planning: React.FC<PlanningProps> = ({ budgets, onAddBudget, onRemoveBudget }) => {
  const [formData, setFormData] = useState({
    department: Department.SALES,
    category: 'Revenue' as 'Revenue' | 'Expense',
    amount: '',
    period: '2025-01'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;
    
    onAddBudget({
      id: Math.random().toString(36).substr(2, 9),
      department: formData.department,
      category: formData.category,
      amount: parseFloat(formData.amount),
      period: formData.period
    });
    
    setFormData({ ...formData, amount: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Nova Alocação Orçamental</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Departamento</label>
            <select 
              className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value as Department})}
            >
              {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
            <select 
              className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as 'Revenue' | 'Expense'})}
            >
              <option value="Revenue">Receita</option>
              <option value="Expense">Despesa</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Valor (Kz)</label>
            <input 
              type="number"
              className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              placeholder="Ex: 500000"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-slate-900 text-white p-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Adicionar
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Alocações Atuais</h3>
          <div className="text-sm text-slate-500">Registos: {budgets.length}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <th className="px-6 py-3">Departamento</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Período</th>
                <th className="px-6 py-3 text-right">Valor</th>
                <th className="px-6 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {budgets.map((budget) => (
                <tr key={budget.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{budget.department}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      budget.category === 'Revenue' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {budget.category === 'Revenue' ? 'RECEITA' : 'DESPESA'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{budget.period}</td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatKz(budget.amount)}</td>
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button 
                      onClick={() => onRemoveBudget(budget.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Planning;
