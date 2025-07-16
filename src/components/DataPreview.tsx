
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { BudgetDataBlinkitReturn, BudgetDataZeptoReturn } from '@/pages/Index';
import { usePlatformStore } from '@/utils/zusStore';


interface DataPreviewProps {
  data: BudgetDataZeptoReturn[] | BudgetDataBlinkitReturn[];
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  console.log(data, "DataPreview component rendered with data:");
  
  const previewData = data.slice(0, 5); // Show first 5 rows
  const platform = usePlatformStore((state) => state.platform);


  const stats = {
    totalProducts: data.length,
    totalSalesP2: data.reduce((sum, p) => sum + p['Total Sales - Period 2'], 0),
    totalSpendP2: data.reduce((sum, p) => sum + p['Total Spend - Period 2'], 0),
    positiveTrend: data.filter(p =>
      p['Total Sales - Period 2'] > p['Total Sales - Period 1']
    ).length
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-purple-500" />
          Data Preview
        </CardTitle>
        <CardDescription>
          Overview of your uploaded budget data (showing first 5 products)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
            <div className="text-sm text-blue-700">Total Products</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">₹{(stats.totalSalesP2).toFixed(0)}</div>
            <div className="text-sm text-green-700">Total Sales P2</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">₹{(stats.totalSpendP2).toFixed(0)}</div>
            <div className="text-sm text-purple-700">Total Spend P2</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.positiveTrend}</div>
            <div className="text-sm text-orange-700">Growing Products</div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{`${platform === "Blinkit" ? 'Campaign' : 'Product'}`}</TableHead>
                <TableHead className="text-right">Sales P1</TableHead>
                <TableHead className="text-right">Sales P2</TableHead>
                <TableHead className="text-right">Spend P2</TableHead>
                <TableHead className="text-right">ROI P2</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((product, index) => {
                const salesChange = product['Total Sales - Period 2'] - product['Total Sales - Period 1'];
                const isGrowing = salesChange > 0;

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product['ProductName'] || product['Campaign Name']}</div>
                        <div className="text-sm text-gray-500">{product['ProductID'] || product['Targeting Value']}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">₹{(product['Total Sales - Period 1'])}</TableCell>
                    <TableCell className="text-right">₹{(product['Total Sales - Period 2'])}</TableCell>
                    <TableCell className="text-right">₹{(product['Total Spend - Period 2'])}</TableCell>
                    <TableCell className="text-right">{product['ROI - Period 2'].toFixed(0)}x</TableCell>
                    <TableCell>
                      <Badge variant={isGrowing ? "default" : "secondary"} className="flex items-center gap-1 w-fit">
                        {isGrowing ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {isGrowing ? '+' : ''}{(salesChange).toFixed(0)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {data.length > 5 && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            ... and {data.length - 5} more products
          </p>
        )}
      </CardContent>
    </Card>
  );
};
