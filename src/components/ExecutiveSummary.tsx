
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Currency, Target, Zap, Trophy, AlertTriangle, CheckCircle } from 'lucide-react';
import { AnalysisResult } from '@/pages/BudgetAllocation';
import { formatNumber } from '@/utils/numberFormatter';
import { GoogleGenAI } from "@google/genai";

interface ExecutiveSummaryProps {
  results: AnalysisResult[];
  totalBudget: number;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ results, totalBudget }) => {
  const [aiResponse, setaiResponse] = useState('')
  console.log(results, "ExecutiveSummary component rendered with results:");

  const fundedProducts = results.filter(r => r.New_Budget_Allocation > 0).sort((a, b) => b.New_Budget_Allocation - a.New_Budget_Allocation);
  const efficiencyWinners = results.filter(r => r.isEfficiencyWinner);
  const topPerformers = fundedProducts.slice(0, 5);
  const lowPerformers = results.filter(r => r.New_Budget_Allocation === 0)
  console.log(" Low Performers:", lowPerformers);

  const ai = new GoogleGenAI({
    apiKey: 'AIzaSyDfeOBCjaDIBPydErtjn2lshSeggot6ju4',
  });


  React.useEffect(() => {
    async function main(results: AnalysisResult[]) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a quick commerce ads specialist.

Review the following campaign performance data. Provide insights into the effectiveness of the current approach, highlight any inefficiencies or missed opportunities, and suggest strategic refinements.

--- Strategic Overview ---

Efficiency Winners:
No campaigns have demonstrated improved sales with reduced or stable spend. Despite this, budget has been allocated to maximize ROI through high-performing areas.

Performance-Based Focus:
A majority of campaigns have been selected for funding based on key performance metrics. The strategy is to concentrate investment where potential is highest.

Portfolio Flexibility:
A significant portion of the budget remains unallocated, intended for emergency deployment or scaling of high performers as trends emerge.

Current Plan:
The team plans to execute budget allocation immediately, track campaign performance weekly, review underfunded or unfunded campaigns mid-cycle, and hold back the remaining budget as a contingency.

--- Campaign Data ---

Use the following data to evaluate strategic alignment:

• Identify any signs of emerging efficiency (e.g., increased sales with stable or reduced spend).
• Evaluate whether the funded campaigns are truly aligned with performance potential.
• Recommend how to optimize the remaining budget based on observed patterns.
• Suggest adjustments or enhancements to the current plan if needed.
	
Give 1-2 pointers for strategyAlignment, budgetOpportunities, efficiencyInsights, refinedRecommendations.

Campaign Results:
${JSON.stringify(results, null, 2)}

--- Expected Output Format (in json) —
{
  "efficiencyInsights": "Brief insight about any efficiency winners or lack thereof.",
  "strategyAlignment": "Assessment of whether selected campaigns align with performance.",
  "budgetOpportunities": "Suggestions for using the unallocated budget.",
  "refinedRecommendations": [
    "Suggested strategic changes or reinforcements, based on data.",
    "Can include monitoring, reallocation, pausing campaigns, etc."
  ]
}
`
              }
            ]
          }
        ]
      });
      console.log(response.text);
      if (response.text) {
        setaiResponse(response.text);
      }
    }
    if (results.length > 0) {
      main(results);
    }
  }, [results]);








  const metrics = {
    fundedCount: fundedProducts.length,
    fundingRate: (fundedProducts.length / results.length) * 100,
    efficiencyWinnersCount: efficiencyWinners.length,
    efficiencyWinnersFunded: efficiencyWinners.filter(r => r.New_Budget_Allocation > 0).length,
    totalAllocated: fundedProducts.reduce((sum, r) => sum + r.New_Budget_Allocation, 0),
    budgetUtilization: (fundedProducts.reduce((sum, r) => sum + r.New_Budget_Allocation, 0) / totalBudget) * 100,
    expectedIncrease: fundedProducts.reduce((sum, r) => sum + r.Projected_Sales_Increase, 0),
    portfolioROI: (fundedProducts.reduce((sum, r) => sum + r['Total Sales - Period 2'], 0) /
      fundedProducts.reduce((sum, r) => sum + r['Total Spend - Period 2'], 0)) / (fundedProducts.reduce((sum, r) => sum + r['Total Sales - Period 1'], 0) /
        fundedProducts.reduce((sum, r) => sum + r['Total Spend - Period 1'], 0)),
    avgMultiplier: fundedProducts.reduce((sum, r) => sum + r.Budget_Multiplier, 0) / fundedProducts.length
  };

  const recommendations = []
  if (aiResponse) {
    try {
      const jsonStart = aiResponse.indexOf('{');
      const jsonEnd = aiResponse.lastIndexOf('}');
      const jsonString = aiResponse.substring(jsonStart, jsonEnd + 1);
      const parsedResponse = JSON.parse(jsonString);

      recommendations.push(
        { title: "Efficiency Insights", description: parsedResponse.efficiencyInsights, icon: Zap, type: 'info' },
        { title: "Strategy Alignment", description: parsedResponse.strategyAlignment, icon: Target, type: 'info' },
        { title: "Budget Opportunities", description: parsedResponse.budgetOpportunities, icon: Currency, type: 'info' },
      );
    } catch (error) {
      console.error("Error parsing AI response:", error);
    }
  }

  const nextSteps = [];
  if (aiResponse) {
    try {
      const jsonStart = aiResponse.indexOf('{');
      const jsonEnd = aiResponse.lastIndexOf('}');
      const jsonString = aiResponse.substring(jsonStart, jsonEnd + 1);
      const parsedResponse = JSON.parse(jsonString);

      if (Array.isArray(parsedResponse.refinedRecommendations)) {
        parsedResponse.refinedRecommendations.forEach(rec => {
          // 🔐 Force to string in case rec is an object
          nextSteps.push({
            title: typeof rec === "string" ? rec : JSON.stringify(rec),
            description: "",
            icon: CheckCircle,
            type: 'success'
          });
        });
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
    }
  }






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
            Strategic budget reallocation analysis for {results.length} Campaigns
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
                <div className="text-sm text-green-700">Campaigns Funded</div>
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
                <div className="text-2xl font-bold text-blue-600">₹{formatNumber(metrics.totalAllocated)}</div>
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
              <div className="text-3xl font-bold text-green-600 mb-2">₹{formatNumber(metrics.expectedIncrease)}</div>
              <div className="text-sm text-green-700 font-medium">Expected Sales Increase</div>
              <div className="text-xs text-green-600 mt-1">From optimized allocation</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{metrics.avgMultiplier.toFixed(1)}x</div>
              <div className="text-sm text-blue-700 font-medium">Average Budget Multiplier</div>
              <div className="text-xs text-blue-600 mt-1">Across funded products</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">₹{formatNumber((totalBudget - metrics.totalAllocated))}</div>
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
          <CardDescription>Highest-ranking campaigns receiving budget allocation</CardDescription>
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
                      {product['Campaign Name']}
                      {product.isEfficiencyWinner && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Zap className="h-3 w-3 mr-1" />
                          Efficiency Winner
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Ranking Score: {product.Ranking_Score.toFixed(3)} |
                      Sales Change: {product.Incremental_Sales > 0 ? '+' : ''}{formatNumber(product.Incremental_Sales)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">₹{formatNumber(product.New_Budget_Allocation)}</div>
                  <div className="text-sm text-gray-500">{product.Budget_Multiplier.toFixed(1)}x multiplier</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Low 5 Investment Priorities</CardTitle>
          <CardDescription>Highest-ranking campaigns receiving budget allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lowPerformers.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {product['Campaign Name']}
                      {product.isEfficiencyWinner && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Zap className="h-3 w-3 mr-1" />
                          Efficiency Winner
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Ranking Score: {product.Ranking_Score.toFixed(3)} |
                      Sales Change: {product.Incremental_Sales > 0 ? '+' : ''}{formatNumber(product.Incremental_Sales)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">₹{formatNumber(product.New_Budget_Allocation)}</div>
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
            {
              recommendations.length === 0 && !aiResponse ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                </div>
              ) :
                recommendations.map((rec, index) => {
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
      <Card className="bg-gradient-to-r mb-10 from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>

          <div className="space-y-3">

            {//add skeleton loading if no next steps
              nextSteps.length === 0 && !aiResponse ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                </div>
              ) :
                nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm font-medium">
                      {typeof step.title === 'string' ? step.title : '[Invalid title]'}
                    </span>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};


