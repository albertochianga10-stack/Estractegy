
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PieChart as ChartIcon, ShieldAlert, Briefcase, Database, Menu, X, ChevronRight } from 'lucide-react';
import { Department, BudgetEntry, Investment } from './types';
import Dashboard from './components/Dashboard';
import Planning from './components/Planning';
import RiskAnalysisPanel from './components/RiskAnalysisPanel';
import InvestmentsPanel from './components/InvestmentsPanel';

const INITIAL_BUDGETS: BudgetEntry[] = [
  { id: '1', department: Department.SALES, amount: 15000000, period: '2025-01', category: 'Revenue' },
  { id: '2', department: Department.MARKETING, amount: 4500000, period: '2025-01', category: 'Expense' },
  { id: '3', department: Department.ENGINEERING, amount: 8000000, period: '2025-01', category: 'Expense' },
  { id: '4', department: Department.OPERATIONS, amount: 2500000, period: '2025-01', category: 'Expense' },
  { id: '5', department: Department.SALES, amount: 18000000, period: '2025-02', category: 'Revenue' },
];

const INITIAL_INVESTMENTS: Investment[] = [
  { id: '1', name: 'Tesouro Nacional Angola', type: 'Bond', amount: 50000000, currentValue: 54000000, performance: 8 },
  { id: '2', name: 'Bolsa de Valores (BODIVA)', type: 'Stock', amount: 20000000, currentValue: 22500000, performance: 12.5 },
  { id: '3', name: 'Imobiliário Luanda Sul', type: 'Real Estate', amount: 120000000, currentValue: 135000000, performance: 12.5 },
];

type View = 'dashboard' | 'planning' | 'risk' | 'investments' | 'erp';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [budgets, setBudgets] = useState<BudgetEntry[]>(() => {
    const saved = localStorage.getItem('applemar_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem('applemar_investments');
    return saved ? JSON.parse(saved) : INITIAL_INVESTMENTS;
  });

  useEffect(() => {
    localStorage.setItem('applemar_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('applemar_investments', JSON.stringify(investments));
  }, [investments]);

  const handleAddBudget = (entry: BudgetEntry) => {
    setBudgets([entry, ...budgets]);
  };

  const handleUpdateBudget = (updated: BudgetEntry) => {
    setBudgets(budgets.map(b => b.id === updated.id ? updated : b));
  };

  const handleRemoveBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  const handleAddInvestment = (entry: Investment) => {
    setInvestments([entry, ...investments]);
  };

  const handleUpdateInvestment = (updated: Investment) => {
    setInvestments(investments.map(i => i.id === updated.id ? updated : i));
  };

  const handleRemoveInvestment = (id: string) => {
    setInvestments(investments.filter(i => i.id !== id));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard budgets={budgets} investments={investments} />;
      case 'planning': return (
        <Planning 
          budgets={budgets} 
          onAddBudget={handleAddBudget} 
          onUpdateBudget={handleUpdateBudget}
          onRemoveBudget={handleRemoveBudget} 
        />
      );
      case 'risk': return <RiskAnalysisPanel budgets={budgets} investments={investments} />;
      case 'investments': return (
        <InvestmentsPanel 
          investments={investments} 
          onAddInvestment={handleAddInvestment}
          onUpdateInvestment={handleUpdateInvestment}
          onRemoveInvestment={handleRemoveInvestment}
        />
      );
      case 'erp': return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center space-y-4">
          <Database size={64} className="mx-auto text-blue-500" />
          <h2 className="text-2xl font-bold">Módulo de Integração ERP</h2>
          <p className="text-slate-500 max-w-md mx-auto">Sincronize o seu planeamento estratégico com PHC, SAP ou Sage X3. Ligado ao serviço Applemar Cloud Angola.</p>
          <div className="flex justify-center gap-4 mt-8">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Sincronizar Agora</button>
            <button 
              onClick={() => {
                if(confirm('Deseja resetar todos os dados para os valores padrão?')) {
                  setBudgets(INITIAL_BUDGETS);
                  setInvestments(INITIAL_INVESTMENTS);
                }
              }}
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
            >
              Resetar Dados
            </button>
          </div>
        </div>
      );
      default: return <Dashboard budgets={budgets} investments={investments} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Painel Principal', icon: LayoutDashboard },
    { id: 'planning', label: 'Planeamento Financeiro', icon: ChartIcon },
    { id: 'risk', label: 'Análise de Risco AI', icon: ShieldAlert },
    { id: 'investments', label: 'Portfólio de Ativos', icon: Briefcase },
    { id: 'erp', label: 'Integração ERP', icon: Database },
  ];

  return (
    <div className="min-h-screen flex text-slate-900 overflow-hidden bg-slate-50">
      <aside className={`bg-slate-950 text-white flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} z-50`}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-10 overflow-hidden whitespace-nowrap">
            {isSidebarOpen ? (
              <span className="text-2xl font-light tracking-[0.2em] px-2 text-rose-200">APPLEMAR</span>
            ) : (
              <span className="text-2xl font-light text-rose-200 mx-auto">A</span>
            )}
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as View)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  activeView === item.id 
                    ? 'bg-white/10 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} className="shrink-0" />
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center mt-auto"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>Gestão Estratégica Angola</span>
            <ChevronRight size={14} />
            <span className="font-semibold text-slate-900 capitalize">{activeView.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <img key={i} src={`https://picsum.photos/32/32?random=${i}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="user" />
              ))}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
