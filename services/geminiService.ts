
import { GoogleGenAI, Type } from "@google/genai";
import { Department, BudgetEntry, RiskAnalysis, ProjectionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeFinancialRisk = async (
  budgets: BudgetEntry[],
  investments: any[]
): Promise<RiskAnalysis> => {
  const prompt = `Analise o risco financeiro para a empresa Applemar baseada nestes dados no contexto do mercado de Angola (Moeda: Kwanza - AOA/Kz):
  Orçamentos: ${JSON.stringify(budgets)}
  Investimentos: ${JSON.stringify(investments)}
  
  Considere a volatilidade do Kwanza e o cenário macroeconómico angolano. Forneça uma avaliação JSON incluindo riskScore (0-100), criticalIssues (em português), recommendations (em português), e marketOutlook (panorama do mercado angolano em português).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          criticalIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          marketOutlook: { type: Type.STRING }
        },
        required: ['riskScore', 'criticalIssues', 'recommendations', 'marketOutlook']
      }
    }
  });

  return JSON.parse(response.text);
};

export const getFinancialProjections = async (
  historicalData: BudgetEntry[]
): Promise<ProjectionData[]> => {
  const prompt = `Com base nos dados financeiros históricos: ${JSON.stringify(historicalData)}, projete os próximos 12 meses de receitas e despesas em Kwanzas (Kz). Retorne um array de objetos com month, projectedRevenue, projectedExpense, e confidence (0-1).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            month: { type: Type.STRING },
            projectedRevenue: { type: Type.NUMBER },
            projectedExpense: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER }
          },
          required: ['month', 'projectedRevenue', 'projectedExpense', 'confidence']
        }
      }
    }
  });

  return JSON.parse(response.text);
};
