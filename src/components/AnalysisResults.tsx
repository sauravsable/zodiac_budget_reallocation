
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, DollarSign, Target, Crown } from 'lucide-react';
import { AnalysisResult } from '@/pages/Index';

interface AnalysisResultsProps {
  results: AnalysisResult[];
  totalBudget: number;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, totalBudget }) => {
  const fundedProducts = results.filter(p => p.New_Budget_Allocation > 0);
  const efficiencyWinners = results.filter(p => p.isEfficiencyWinner);
  
  const totalAllocated = fundedProducts.reduce((sum, p) => sum + p.New_Budget_Allocation, 0);
  const expectedIncrease = fundedProducts.reduce((sum, p) => sum + p.Projected_Sales_Increase, 0);
  
  const utilizationPercentage = (totalAllocated / totalBudget) * 100;
  
  // Chart data
  const topProductsChart = results.slice(0, 10).map(p => ({
    name: p['ProductName']?.length > 15 ? p['ProductName'].substring(0, 15) + '...' : p['ProductName'],
    allocation: p.New_Budget_Allocation * 100,
    multiplier: p.Budget_Multiplier,
    isEfficiency: p.isEfficiencyWinner
  }));

  const efficiencyChart = results.map(p => ({
    efficiency: p.Efficiency_Score,
    incremental: p.Incremental_ROI_Score,
    allocation: p.New_Budget_Allocation * 100,
    name: p['ProductName']
  }));

  const budgetDistribution = [
    { name: 'Allocated', value: totalAllocated, color: '#8884d8' },
    { name: 'Remaining', value: (totalBudget - totalAllocated), color: '#82ca9d' }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{fundedProducts.length}</div>
                <div className="text-sm text-gray-600">Products Funded</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{efficiencyWinners.length}</div>
                <div className="text-sm text-gray-600">Efficiency Winners</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">₹{(totalAllocated).toFixed(0)}</div>
                <div className="text-sm text-gray-600">Total Allocated</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-purple-600">₹{(expectedIncrease).toFixed(0)}</div>
                <div className="text-sm text-gray-600">Expected Increase</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Utilization</CardTitle>
          <CardDescription>
            {utilizationPercentage.toFixed(1)}% of total budget allocated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={utilizationPercentage} className="w-full h-3" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>₹0</span>
            <span>₹{(totalBudget).toFixed(0)} Total Budget</span>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Budget Allocations</CardTitle>
            <CardDescription>Products receiving the highest budget allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [
                    `₹${typeof value === 'number' ? value.toFixed(0) : value}K`,
                    'Budget Allocation'
                  ]}
                  labelFormatter={(label) => `Product: ${label}`}
                />
                <Bar 
                  dataKey="allocation" 
                  fill="#8884d8"
                  name="Budget Allocation (₹K)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Distribution</CardTitle>
            <CardDescription>Allocated vs remaining budget</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {budgetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${typeof value === 'number' ? value.toFixed(0) : value}K`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency vs Performance Scatter */}
      <Card>
        <CardHeader>
          <CardTitle>Efficiency vs Performance Analysis</CardTitle>
          <CardDescription>
            Products positioned by efficiency score and incremental ROI performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={efficiencyChart}>
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="efficiency" 
                name="Efficiency Score"
                domain={[0, 'dataMax']}
              />
              <YAxis 
                type="number" 
                dataKey="incremental" 
                name="Incremental ROI Score"
                domain={[0, 'dataMax']}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value) => [typeof value === 'number' ? value.toFixed(2) : value]}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return `Product: ${payload[0]?.payload?.name}`;
                  }
                  return '';
                }}
              />
              <Scatter 
                dataKey="allocation" 
                fill="#8884d8"
                name="Budget Allocation (₹K)"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis Results</CardTitle>
          <CardDescription>
            Complete breakdown of all products with rankings and allocations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Current Sales</TableHead>
                  <TableHead className="text-right">Sales Change</TableHead>
                  <TableHead className="text-right">Spend Change</TableHead>
                  <TableHead className="text-right">Efficiency Score</TableHead>
                  <TableHead className="text-right">Budget Allocated</TableHead>
                  <TableHead className="text-right">Multiplier</TableHead>
                  <TableHead className="text-right">Expected Increase</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.slice(0, 20).map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product['ProductName']}</div>
                        <div className="text-sm text-gray-500">{product['ProductID']}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">₹{(product['Total Sales in Lakhs - Period 2'])}</TableCell>
                    <TableCell className="text-right">
                      <span className={product.Incremental_Sales > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.Incremental_Sales > 0 ? '+' : ''}₹{(product.Incremental_Sales)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={product.Incremental_Spend < 0 ? 'text-green-600' : 'text-red-600'}>
                        ₹{(product.Incremental_Spend)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{product.Efficiency_Score.toFixed(3)}</TableCell>
                    <TableCell className="text-right">
                      {product.New_Budget_Allocation > 0 ? `₹${(product.New_Budget_Allocation)}` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.Budget_Multiplier > 1 ? `${product.Budget_Multiplier}x` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.Projected_Sales_Increase > 0 ? `₹${(product.Projected_Sales_Increase)}` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.isEfficiencyWinner && (
                          <Badge variant="default" className="bg-yellow-500">
                            <Award className="h-3 w-3 mr-1" />
                            Efficiency
                          </Badge>
                        )}
                        {product.New_Budget_Allocation > 0 && (
                          <Badge variant="secondary">Funded</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {results.length > 20 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Showing top 20 products of {results.length} total products analyzed
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
