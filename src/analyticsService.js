import { supabase } from './supabaseClient.js';
import { AIService } from './aiService.js';

export class AnalyticsService {
  constructor(apiKey, provider = "groq") {
    this.provider = provider;
    this.ai = new AIService(apiKey, provider);
  }

  // 1. Backend Calculations for Analytics
  async calculateAnalytics() {
    try {
      const { data: assets } = await supabase.from('assets').select('*');
      const { data: stock } = await supabase.from('warehouse_items').select('*');
      
      const totalCost = assets.reduce((s, a) => s + (Number(a.cost) || 0), 0);
      
      // Calculate missing data (Anomalies)
      const missingCustody = assets.filter(a => !a.custody).length;
      const missingLocation = assets.filter(a => !a.location).length;
      const dataQualityScore = Math.max(0, 100 - ((missingCustody + missingLocation) / (assets.length || 1) * 100));

      // Calculate Stock Movements
      const deadStock = stock.filter(s => (s.quantity > 0 && s.status === 'تالف') || s.quantity > (s.min_quantity * 5)).length;
      const fastMovingStock = stock.filter(s => s.quantity <= s.min_quantity && s.quantity > 0).length;
      const outOfStock = stock.filter(s => s.quantity === 0).length;

      // Depreciation & Value
      // Dummy calculation for Net Book Value (assuming straight line for 5 years if not specified)
      let totalAccumulatedDepreciation = 0;
      let totalNetBookValue = 0;
      
      const currentYear = new Date().getFullYear();
      assets.forEach(a => {
        if (!a.purchase_date || !a.cost) {
          totalNetBookValue += (Number(a.cost) || 0);
          return;
        }
        const pYear = new Date(a.purchase_date).getFullYear();
        const age = currentYear - pYear;
        const life = Number(a.useful_life) || 5;
        const cost = Number(a.cost);
        const salvage = Number(a.salvage_value) || 0;
        
        let yearlyDep = (cost - salvage) / life;
        let accDep = Math.min(yearlyDep * age, cost - salvage);
        if (age < 0) accDep = 0;
        
        totalAccumulatedDepreciation += accDep;
        totalNetBookValue += (cost - accDep);
      });

      return {
        totalAssetsCount: assets.length,
        totalCost,
        totalAccumulatedDepreciation,
        totalNetBookValue,
        missingCustody,
        missingLocation,
        dataQualityScore,
        stockCount: stock.length,
        deadStock,
        fastMovingStock,
        outOfStock
      };
    } catch (e) {
      console.error("Analytics Calculation Error:", e);
      return null;
    }
  }

  // 2. Predictive Models (Backend logic)
  async calculatePredictions() {
    try {
      const { data: stock } = await supabase.from('warehouse_items').select('sku, name, quantity, min_quantity');
      const { data: assets } = await supabase.from('assets').select('asset_no, name, purchase_date, useful_life, status');
      
      const currentYear = new Date().getFullYear();

      // Stock Runout Predictions (Naive velocity assumption)
      const stockRunout = stock.filter(s => s.quantity <= s.min_quantity * 1.5 && s.quantity > 0).map(s => ({
        item: s.name,
        risk: 'عالي',
        estimated_days_left: Math.floor(Math.random() * 14) + 1 // Mocking velocity
      }));

      // Asset Replacement Priority
      const replacementPriority = assets.filter(a => {
        if (!a.purchase_date) return false;
        const age = currentYear - new Date(a.purchase_date).getFullYear();
        return age >= (Number(a.useful_life) || 5);
      }).map(a => ({
        asset: a.name,
        asset_no: a.asset_no,
        priority: 'حرجة',
        reason: 'تجاوز العمر الافتراضي'
      }));

      // Maintenance Risk (Randomized for demo since we lack maintenance history table currently)
      const maintenanceRisk = assets.slice(0, 2).map(a => ({
        asset: a.name,
        risk_level: 'متوسط',
        recommendation: 'فحص وقائي خلال 30 يوم'
      }));

      return {
        stockRunout,
        replacementPriority,
        maintenanceRisk,
        estimatedBudgetNeeded: stockRunout.length * 5000 + replacementPriority.length * 20000
      };
    } catch (e) {
      console.error("Prediction Error:", e);
      return null;
    }
  }

  // 3. AI Executive Summary based on computed analytics
  async generateAIExecutiveSummary() {
    const analytics = await this.calculateAnalytics();
    const predictions = await this.calculatePredictions();

    if (!analytics || !predictions) throw new Error("فشل في حساب البيانات الأساسية");

    const prompt = `
أنت مستشار مالي ومحلل بيانات خبير. تم إمدادك بالبيانات الحية المجمعة التالية من نظام إدارة الأصول والمستودعات.
المطلوب منك كتابة "ملخص تنفيذي ذكي" باللغة العربية بناءً على هذه الأرقام فقط.
يجب أن يحتوي الملخص على:
1. نظرة عامة على صحة الأصول والمخزون.
2. التنبؤات الاستباقية (مع ذكر أن هذه التوقعات تعتمد على الخوارزميات وليست حقائق مطلقة).
3. توصيات فورية للإدارة.

[بيانات التحليلات]:
- إجمالي عدد الأصول: ${analytics.totalAssetsCount}
- التكلفة التاريخية الإجمالية: ${analytics.totalCost} ريال
- مجمع الإهلاك التقديري: ${analytics.totalAccumulatedDepreciation} ريال
- القيمة الدفترية الصافية: ${analytics.totalNetBookValue} ريال
- درجة جودة البيانات: ${analytics.dataQualityScore.toFixed(2)}%
- الأصول بلا عهدة: ${analytics.missingCustody}
- الأصناف سريعة الحركة: ${analytics.fastMovingStock}
- الأصناف النافدة تماماً: ${analytics.outOfStock}
- المخزون الراكد/التالف: ${analytics.deadStock}

[بيانات التنبؤات والمخاطر]:
- أصناف مهددة بالنفاد قريباً: ${predictions.stockRunout.map(s => s.item).join('، ')}
- أصول ذات أولوية استبدال حرجة: ${predictions.replacementPriority.map(s => s.asset).join('، ')}
- الميزانية التقديرية المطلوبة للربع القادم: ${predictions.estimatedBudgetNeeded} ريال

لا تستخدم الـ Tool Calling هنا، فقط أجب بالملخص النصي المنظم بأسلوب احترافي وجذاب (استخدم Markdown).
`;

    // Disable tools for summary generation
    const response = await this.ai.sendChat([{ role: 'user', content: prompt }], false);
    return {
      report: response.content,
      rawAnalytics: analytics,
      rawPredictions: predictions
    };
  }
}
