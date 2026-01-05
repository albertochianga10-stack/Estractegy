
export enum Department {
  SALES = 'Sales',
  MARKETING = 'Marketing',
  ENGINEERING = 'Engineering',
  OPERATIONS = 'Operations',
  HR = 'Human Resources',
  FINANCE = 'Finance'
}

export interface BudgetEntry {
  id: string;
  department: Department;
  amount: number;
  period: string; // YYYY-MM
  category: 'Revenue' | 'Expense';
}

export interface Investment {
  id: string;
  name: string;
  type: 'Stock' | 'Bond' | 'Real Estate' | 'Cash';
  amount: number;
  currentValue: number;
  performance: number;
}

export interface RiskAnalysis {
  riskScore: number;
  criticalIssues: string[];
  recommendations: string[];
  marketOutlook: string;
}

export interface ProjectionData {
  month: string;
  projectedRevenue: number;
  projectedExpense: number;
  confidence: number;
}
