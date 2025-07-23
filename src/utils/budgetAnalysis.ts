
import { BudgetDataZepto, BudgetDataZeptoReturn, AnalysisResultZepto, BudgetDataBlinkit, BudgetDataBlinkitReturn, AnalysisResultBlinkit } from '@/pages/BudgetAllocation';

export function mergeBudgetDataZepto(
  data1: BudgetDataZepto[],
  data2: BudgetDataZepto[]
): BudgetDataZeptoReturn[] {

  // 1. Aggregate data1
  const aggregatedData1 = new Map<string, { sales: number; spend: number }>();
  data1.forEach(item => {
    const key = item['CampaignName'];
    const sales = Number(item['Revenue']);
    const spend = Number(item['Spend']) || 0;

    if (aggregatedData1.has(key)) {
      const existing = aggregatedData1.get(key)!;
      existing.sales += sales;
      existing.spend += spend;
    } else {
      aggregatedData1.set(key, { sales, spend });
    }
  });

  const aggregatedData2 = new Map<string, { sales: number; spend: number }>();
  data2.forEach(item => {
    const key = item['CampaignName'];
    const sales = Number(item['Revenue']);
    const spend = Number(item['Spend']) || 0;

    if (aggregatedData2.has(key)) {
      const existing = aggregatedData2.get(key)!;
      existing.sales += sales;
      existing.spend += spend;
    } else {
      aggregatedData2.set(key, { sales, spend });
    }
  });

  const result: BudgetDataZeptoReturn[] = [];
  aggregatedData2.forEach((value1, key) => {
    if (aggregatedData1.has(key)) {
      const value2 = aggregatedData1.get(key)!;
      result.push({
        'Campaign Name': key,
        'Total Sales - Period 1': value2.sales,
        'Total Spend - Period 1': value2.spend,
        'Total Sales - Period 2': value1.sales,
        'Total Spend - Period 2': value1.spend,
      });
    }
  });

  return result;
}

export function mergeBudgetDataBlinkit(
  data1: BudgetDataBlinkit[],
  data2: BudgetDataBlinkit[]
): BudgetDataBlinkitReturn[] {
  const sum = (...values: (number | undefined)[]) =>
    values.reduce((acc, val) => acc + (Number(val) || 0), 0);

  // 1. Aggregate data1
  const aggregatedData1 = new Map<string, { sales: number; spend: number }>();
  data1.forEach(item => {
    const key = item['Campaign Name'];
    const sales = sum(item['Direct Sales'], item['Indirect Sales']);
    const spend = Number(item['Estimated Budget Consumed']) || 0;

    if (aggregatedData1.has(key)) {
      const existing = aggregatedData1.get(key)!;
      existing.sales += sales;
      existing.spend += spend;
    } else {
      aggregatedData1.set(key, { sales, spend });
    }
  });

  const aggregatedData2 = new Map<string, { sales: number; spend: number }>();
  data2.forEach(item => {
    const key = item['Campaign Name'];
    const sales = sum(item['Direct Sales'], item['Indirect Sales']);
    const spend = Number(item['Estimated Budget Consumed']) || 0;

    if (aggregatedData2.has(key)) {
      const existing = aggregatedData2.get(key)!;
      existing.sales += sales;
      existing.spend += spend;
    } else {
      aggregatedData2.set(key, { sales, spend });
    }
  });

  const result: BudgetDataBlinkitReturn[] = [];
  aggregatedData2.forEach((value1, key) => {
    if (aggregatedData1.has(key)) {
      const value2 = aggregatedData1.get(key)!;
      result.push({
        'Campaign Name': key,
        'Total Sales - Period 1': value2.sales,
        'Total Spend - Period 1': value2.spend,
        'Total Sales - Period 2': value1.sales,
        'Total Spend - Period 2': value1.spend,
      });
    }
  });

  return result;
}



export function processCSVData(data: BudgetDataZeptoReturn[], totalBudgetLakhs: number): AnalysisResultZepto[] {
  // Calculate incremental metrics
  const processedData = data.map(product => {
    const incrementalSales = product['Total Sales - Period 2'] - product['Total Sales - Period 1'];
    const incrementalSpend = product['Total Spend - Period 2'] - product['Total Spend - Period 1'];

    // Improved incremental ROI calculation
    const incrementalROIScore = calculateIncrementalROIScore(incrementalSales, incrementalSpend);

    // Original incremental ROI for reference
    const originalIncrementalROI = incrementalSpend !== 0 ? incrementalSales / incrementalSpend : 0;

    // Current ROI calculation
    const currentROI = product['Total Spend - Period 2'] > 0 ?
      product['Total Sales - Period 2'] / product['Total Spend - Period 2'] : 0;

    // Combined efficiency score
    const efficiencyScore = (0.4 * currentROI) + (0.6 * incrementalROIScore);

    return {
      ...product,
      Incremental_Sales: incrementalSales,
      Incremental_Spend: incrementalSpend,
      Original_Incremental_ROI: Number(originalIncrementalROI.toFixed(2)),
      Incremental_ROI_Score: Number(incrementalROIScore.toFixed(2)),
      Current_ROI: Number(currentROI.toFixed(2)),
      Efficiency_Score: Number(efficiencyScore.toFixed(2)),
      isEfficiencyWinner: incrementalSales > 0 && incrementalSpend <= 0
    };
  });

  // Normalize scores for ranking
  const maxEfficiency = Math.max(...processedData.map(p => p.Efficiency_Score));
  const maxIncrementalROI = Math.max(...processedData.map(p => p.Incremental_ROI_Score));

  const rankedData = processedData.map(product => {
    const normEfficiency = maxEfficiency > 0 ? product.Efficiency_Score / maxEfficiency : 0;
    const normIncrementalROI = maxIncrementalROI > 0 ? product.Incremental_ROI_Score / maxIncrementalROI : 0;

    // Final ranking score with improvement bonus
    let rankingScore = (0.3 * normEfficiency) + (0.7 * normIncrementalROI);

    // Add bonus for efficiency winners
    if (product.isEfficiencyWinner) {
      rankingScore += 0.1; // 10% bonus
    }

    return {
      ...product,
      Ranking_Score: Number(rankingScore.toFixed(2)),
      New_Budget_Allocation: 0,
      Budget_Multiplier: 1.0,
      Projected_Sales_Increase: 0,
      Projected_New_Sales: product['Total Sales - Period 2'],
      Projected_ROI: 0
    };
  });

  // Sort by ranking score
  const sortedData = rankedData.sort((a, b) => {
    if (b.Ranking_Score !== a.Ranking_Score) {
      return b.Ranking_Score - a.Ranking_Score;
    }
    if (b.Incremental_Sales !== a.Incremental_Sales) {
      return b.Incremental_Sales - a.Incremental_Sales;
    }
    return b.Current_ROI - a.Current_ROI;
  });

  // Allocate budget
  let remainingBudget = totalBudgetLakhs;
  const results: AnalysisResultZepto[] = sortedData.map(product => {
    if (remainingBudget <= 0) {
      return product as AnalysisResultZepto;
    }

    const currentSpend = product['Total Spend - Period 2'];
    let maxAllocation: number;

    // Determine allocation strategy based on performance
    if (product.isEfficiencyWinner) {
      maxAllocation = Math.min(currentSpend * 3, remainingBudget);
    } else if (product.Ranking_Score > 0.8) {
      maxAllocation = Math.min(currentSpend * 2.5, remainingBudget);
    } else if (product.Ranking_Score > 0.5) {
      maxAllocation = Math.min(currentSpend * 2, remainingBudget);
    } else {
      maxAllocation = Math.min(currentSpend * 1.5, remainingBudget);
    }

    if (currentSpend === 0) {
      maxAllocation = Math.min(0.05, remainingBudget); // Small allocation for new products
    }

    const budgetMultiplier = maxAllocation / Math.max(currentSpend, 0.01);
    const projectedSalesIncrease = budgetMultiplier > 1 && product.Incremental_Sales > 0 ?
      product.Incremental_Sales * (budgetMultiplier - 1) : 0;
    const projectedNewSales = product['Total Sales - Period 2'] + projectedSalesIncrease;
    const projectedROI = maxAllocation > 0 ? projectedNewSales / maxAllocation : 0;

    remainingBudget -= maxAllocation;

    return {
      ...product,
      New_Budget_Allocation: maxAllocation,
      Budget_Multiplier: Number(budgetMultiplier.toFixed(2)),
      Projected_Sales_Increase: Number(projectedSalesIncrease.toFixed(2)),
      Projected_New_Sales: Number(projectedNewSales.toFixed(2)),
      Projected_ROI: Number(projectedROI.toFixed(2))
    } as AnalysisResultZepto;
  });

  console.log(`Budget allocation complete. Remaining: ₹${remainingBudget.toFixed(2)} Lakhs`);

  return results;
}
export function processCSVDataBlinkit(data: BudgetDataBlinkitReturn[], totalBudgetLakhs: number): AnalysisResultBlinkit[] {

  // Calculate incremental metrics
  const processedData = data.map(product => {
    const incrementalSales = product['Total Sales - Period 2'] - product['Total Sales - Period 1'];
    const incrementalSpend = product['Total Spend - Period 2'] - product['Total Spend - Period 1'];

    // Improved incremental ROI calculation
    const incrementalROIScore = calculateIncrementalROIScore(incrementalSales, incrementalSpend);

    // Original incremental ROI for reference
    const originalIncrementalROI = incrementalSpend !== 0 ? incrementalSales / incrementalSpend : 0;

    // Current ROI calculation
    const currentROI = product['Total Spend - Period 2'] > 0 ?
      product['Total Sales - Period 2'] / product['Total Spend - Period 2'] : 0;

    // Combined efficiency score
    const efficiencyScore = (0.4 * currentROI) + (0.6 * incrementalROIScore);

    return {
      ...product,
      Incremental_Sales: incrementalSales,
      Incremental_Spend: incrementalSpend,
      Original_Incremental_ROI: Number(originalIncrementalROI.toFixed(2)),
      Incremental_ROI_Score: Number(incrementalROIScore.toFixed(2)),
      Current_ROI: Number(currentROI.toFixed(2)),
      Efficiency_Score: Number(efficiencyScore.toFixed(2)),
      isEfficiencyWinner: incrementalSales > 0 && incrementalSpend <= 0
    };
  });

  // Normalize scores for ranking
  const maxEfficiency = Math.max(...processedData.map(p => p.Efficiency_Score));
  const maxIncrementalROI = Math.max(...processedData.map(p => p.Incremental_ROI_Score));

  const rankedData = processedData.map(product => {
    const normEfficiency = maxEfficiency > 0 ? product.Efficiency_Score / maxEfficiency : 0;
    const normIncrementalROI = maxIncrementalROI > 0 ? product.Incremental_ROI_Score / maxIncrementalROI : 0;

    // Final ranking score with improvement bonus
    let rankingScore = (0.3 * normEfficiency) + (0.7 * normIncrementalROI);

    // Add bonus for efficiency winners
    if (product.isEfficiencyWinner) {
      rankingScore += 0.1; // 10% bonus
    }

    return {
      ...product,
      Ranking_Score: Number(rankingScore.toFixed(2)),
      New_Budget_Allocation: 0,
      Budget_Multiplier: 1.0,
      Projected_Sales_Increase: 0,
      Projected_New_Sales: product['Total Sales - Period 2'],
      Projected_ROI: 0
    };
  });

  // Sort by ranking score
  const sortedData = rankedData.sort((a, b) => {
    // if (b.Ranking_Score !== a.Ranking_Score) {
    //   return b.Ranking_Score - a.Ranking_Score;
    // }
    // if (b.Incremental_Sales !== a.Incremental_Sales) {
    //   return b.Incremental_Sales - a.Incremental_Sales;
    // }
    return b.Ranking_Score - a.Ranking_Score;
  });

  // Allocate budget
  let remainingBudget = totalBudgetLakhs;
  const results: AnalysisResultBlinkit[] = sortedData.map(product => {
    if (remainingBudget <= 0) {
      return product as AnalysisResultBlinkit;
    }

    const currentSpend = product['Total Spend - Period 2'];
    let maxAllocation: number;

    // Determine allocation strategy based on performance
    if (product.isEfficiencyWinner) {
      maxAllocation = Math.min(currentSpend * 3, remainingBudget);
    } else if (product.Ranking_Score > 0.8) {
      maxAllocation = Math.min(currentSpend * 2.5, remainingBudget);
    } else if (product.Ranking_Score > 0.5) {
      maxAllocation = Math.min(currentSpend * 2, remainingBudget);
    } else {
      maxAllocation = Math.min(currentSpend * 1.5, remainingBudget);
    }

    if (currentSpend === 0) {
      maxAllocation = Math.min(0.05, remainingBudget); // Small allocation for new products
    }

    const budgetMultiplier = maxAllocation / Math.max(currentSpend, 0.01);
    const projectedSalesIncrease = budgetMultiplier > 1 && product.Incremental_Sales > 0 ?
      product.Incremental_Sales * (budgetMultiplier - 1) : 0;
    const projectedNewSales = product['Total Sales - Period 2'] + projectedSalesIncrease;
    const projectedROI = maxAllocation > 0 ? projectedNewSales / maxAllocation : 0;

    remainingBudget -= maxAllocation;

    return {
      ...product,
      New_Budget_Allocation: maxAllocation,
      Budget_Multiplier: Number(budgetMultiplier.toFixed(2)),
      Projected_Sales_Increase: Number(projectedSalesIncrease.toFixed(2)),
      Projected_New_Sales: Number(projectedNewSales.toFixed(2)),
      Projected_ROI: Number(projectedROI.toFixed(2))
    } as AnalysisResultBlinkit;
  });

  return results;
}

function calculateIncrementalROIScore(incSales: number, incSpend: number): number {
  if (incSales > 0) {
    if (incSpend > 0) {
      return incSales / incSpend; // Normal ROI
    } else if (incSpend < 0) {
      return (incSales / Math.abs(incSpend)) + 10; // Bonus for reducing spend while growing
    } else {
      return incSales * 100; // High score for free growth
    }
  } else if (incSales === 0) {
    return incSpend <= 0 ? 0.1 : 0; // Neutral or poor
  } else {
    return incSpend < 0 ? 0.1 : 0; // Sales decreased
  }
}
