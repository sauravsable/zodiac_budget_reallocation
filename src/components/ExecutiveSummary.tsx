
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Currency, Target, Zap, Trophy, AlertTriangle, CheckCircle } from 'lucide-react';
import { AnalysisResult } from '@/pages/BudgetAllocation';

interface ExecutiveSummaryProps {
  results: AnalysisResult[];
  totalBudget: number;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ results, totalBudget }) => {
  const fundedProducts = results.filter(r => r.New_Budget_Allocation > 0);
  const efficiencyWinners = results.filter(r => r.isEfficiencyWinner);
  const topPerformers = fundedProducts.slice(0, 5);

  const metrics = {
    totalProducts: results.length,
    fundedCount: fundedProducts.length,
    fundingRate: (fundedProducts.length / results.length) * 100,
    efficiencyWinnersCount: efficiencyWinners.length,
    efficiencyWinnersFunded: efficiencyWinners.filter(r => r.New_Budget_Allocation > 0).length,
    totalAllocated: fundedProducts.reduce((sum, r) => sum + r.New_Budget_Allocation, 0),
    budgetUtilization: (fundedProducts.reduce((sum, r) => sum + r.New_Budget_Allocation, 0) / totalBudget) * 100,
    expectedIncrease: fundedProducts.reduce((sum, r) => sum + r.Projected_Sales_Increase, 0),
    portfolioROI: fundedProducts.reduce((sum, r) => sum + r.Projected_Sales_Increase, 0) / 
                  fundedProducts.reduce((sum, r) => sum + r.New_Budget_Allocation, 0),
    avgMultiplier: fundedProducts.reduce((sum, r) => sum + r.Budget_Multiplier, 0) / fundedProducts.length
  };

  const recommendations = [
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Efficiency Winners Identified',
      description: `${metrics.efficiencyWinnersCount} products show improved sales with reduced/maintained spend`,
      action: 'Priority funding allocated to maximize ROI'
    },
    {
      type: 'info',
      icon: Target,
      title: 'Strategic Focus',
      description: `${metrics.fundingRate.toFixed(1)}% of products selected for funding based on performance metrics`,
      action: 'Concentrate resources on high-potential products'
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Portfolio Diversification',
      description: `${(100 - metrics.budgetUtilization).toFixed(1)}% budget remaining for emergency allocation`,
      action: 'Consider expanding top performer budgets if needed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Executive Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            Executive Summary
          </CardTitle>
          <CardDescription className="text-lg">
            Strategic budget reallocation analysis for {metrics.totalProducts} products
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{metrics.fundedCount}</div>
                <div className="text-sm text-green-700">Products Funded</div>
                <div className="text-xs text-green-600">{metrics.fundingRate.toFixed(1)}% selection rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{metrics.efficiencyWinnersFunded}</div>
                <div className="text-sm text-orange-700">Efficiency Winners</div>
                <div className="text-xs text-orange-600">Top priority allocation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Currency className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">₹{(metrics.totalAllocated).toFixed(0)}</div>
                <div className="text-sm text-blue-700">Budget Allocated</div>
                <div className="text-xs text-blue-600">{metrics.budgetUtilization.toFixed(1)}% utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{metrics.portfolioROI.toFixed(1)}x</div>
                <div className="text-sm text-purple-700">Portfolio ROI</div>
                <div className="text-xs text-purple-600">Expected return</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Impact Projection</CardTitle>
          <CardDescription>Expected outcomes from budget reallocation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">₹{(metrics.expectedIncrease).toFixed(0)}</div>
              <div className="text-sm text-green-700 font-medium">Expected Sales Increase</div>
              <div className="text-xs text-green-600 mt-1">From optimized allocation</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{metrics.avgMultiplier.toFixed(1)}x</div>
              <div className="text-sm text-blue-700 font-medium">Average Budget Multiplier</div>
              <div className="text-xs text-blue-600 mt-1">Across funded products</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">₹{((totalBudget - metrics.totalAllocated)).toFixed(0)}</div>
              <div className="text-sm text-purple-700 font-medium">Remaining Budget</div>
              <div className="text-xs text-purple-600 mt-1">Available for adjustment</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Investment Priorities</CardTitle>
          <CardDescription>Highest-ranking products receiving budget allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {product['Product Name']}
                      {product.isEfficiencyWinner && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Zap className="h-3 w-3 mr-1" />
                          Efficiency Winner
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Ranking Score: {product.Ranking_Score.toFixed(3)} | 
                      Sales Change: {product.Incremental_Sales > 0 ? '+' : ''}₹{(product.Incremental_Sales).toFixed(0)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">₹{(product.New_Budget_Allocation).toFixed(0)}</div>
                  <div className="text-sm text-gray-500">{product.Budget_Multiplier.toFixed(1)}x multiplier</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Recommendations</CardTitle>
          <CardDescription>Key insights and actionable next steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              const colorClass = rec.type === 'success' ? 'text-green-600 bg-green-50' : 
                                rec.type === 'warning' ? 'text-orange-600 bg-orange-50' : 
                                'text-blue-600 bg-blue-50';
              
              return (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <p className="text-sm font-medium text-blue-600 mt-2">{rec.action}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-sm">Implement budget allocation for top {metrics.efficiencyWinnersFunded} efficiency winners immediately</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-sm">Monitor performance of funded products weekly for first month</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-sm">Review unfunded products for potential mid-cycle additions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-sm">Prepare contingency plan for remaining ₹{((totalBudget - metrics.totalAllocated)).toFixed(0)} budget</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
