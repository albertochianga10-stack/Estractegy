
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Briefcase, Landmark } from 'lucide-react';
import { BudgetEntry, Investment } from '../types';

interface DashboardProps {
  budgets: BudgetEntry[];
  investments: Investment[];
}

const formatKz = (value: number) => {
  return value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz');
};

const Dashboard: React.FC<DashboardProps> = ({ budgets, investments }) => {
  const totalRevenue = budgets.filter(b => b.category === 'Revenue').reduce((acc, b) => acc + b.amount, 0);
  const totalExpense = budgets.filter(b => b.category === 'Expense').reduce((acc, b) => acc + b.amount, 0);
  const netIncome = totalRevenue - totalExpense;

  const deptData = Object.values(budgets.reduce((acc: any, b) => {
    if (!acc[b.department]) acc[b.department] = { name: b.department, expense: 0, revenue: 0 };
    if (b.category === 'Expense') acc[b.department].expense += b.amount;
    else acc[b.department].revenue += b.amount;
    return acc;
  }, {}));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Receita Anual</p>
              <h3 className="text-2xl font-bold text-slate-900">{formatKz(totalRevenue)}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Landmark size={24} />
            </div>
          </div>
          <p className="mt-4 text-sm text-green-600 font-medium">↑ 12.5% vs Ano Anterior</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Lucro Líquido</p>
              <h3 className="text-2xl font-bold text-slate-900">{formatKz(netIncome)}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="mt-4 text-sm text-green-600 font-medium">Margem: {((netIncome / totalRevenue) * 100).toFixed(1)}%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Valoração de Ativos</p>
              <h3 className="text-2xl font-bold text-slate-900">{formatKz(investments.reduce((acc, i) => acc + i.currentValue, 0))}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Briefcase size={24} />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 font-medium">{investments.length} Posições Ativas</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Burn Rate Mensal</p>
              <h3 className="text-2xl font-bold text-slate-900">{formatKz(totalExpense / 12)}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <Wallet size={24} />
            </div>
          </div>
          <p className="mt-4 text-sm text-red-600 font-medium">Eficiência: Estável</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-semibold text-slate-800 mb-6">Performance por Departamento</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatKz(value)} />
                <Legend />
                <Bar name="Receita" dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar name="Despesa" dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-semibold text-slate-800 mb-6">Alocação de Investimentos</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={investments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="currentValue"
                >
                  {investments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatKz(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
