import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, TrendingDown } from "lucide-react";
import {
  BudgetDataBlinkitReturn,
  BudgetDataZeptoReturn,
} from "@/pages/BudgetAllocation";
import { formatNumber } from "@/utils/numberFormatter";

interface DataPreviewProps {
  data: BudgetDataZeptoReturn[] | BudgetDataBlinkitReturn[];
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
const mappedData = data.map((item) => ({
  ...item,
  roi1:
    item["Total Spend - Period 1"] > 0
      ? item["Total Sales - Period 1"] / item["Total Spend - Period 1"]
      : 0,
  roi2:
    item["Total Spend - Period 2"] > 0
      ? item["Total Sales - Period 2"] / item["Total Spend - Period 2"]
      : 0,
}));

const ganiersData = mappedData
  .filter((item) => item.roi2 > item.roi1)
  .sort((a, b) => (b.roi2 - b.roi1) - (a.roi2 - a.roi1))
  .slice(0, 5);

const drainersData = mappedData
  .filter((item) => item.roi1 > item.roi2)
  .sort((a, b) => (a.roi2 - a.roi1) - (b.roi2 - b.roi1))
  .slice(0, 5);

  const stats = {
    totalCampaigns: data.length,
    totalSalesP2: data.reduce((sum, p) => sum + p["Total Sales - Period 2"], 0),
    totalSpendP2: data.reduce((sum, p) => sum + p["Total Spend - Period 2"], 0),
    positiveTrend: mappedData.filter(
      (p) => p["roi2"] > p["roi1"]
    ).length,
    negativeTrend: mappedData.filter(
      (p) => p["roi1"] > p["roi2"]
    ).length,
  };

  return (
    <>
    
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-purple-500" />
          Data Preview
        </CardTitle>
        <CardDescription>Overview of your uploaded budget data</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalCampaigns}
            </div>
            <div className="text-sm text-blue-700">Total Campaigns</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ₹{formatNumber(stats.totalSalesP2)}
            </div>
            <div className="text-sm text-green-700">Total Sales P2</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              ₹{formatNumber(stats.totalSpendP2)}
            </div>
            <div className="text-sm text-purple-700">Total Spend P2</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {stats.positiveTrend}
            </div>
            <div className="text-sm text-orange-700">Gaining Campaigns</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {stats.negativeTrend}
            </div>
            <div className="text-sm text-red-700">Draining Campaigns</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="mt-4 pt-4">
        <CardContent>
           <div className="overflow-x-auto">
          <CardTitle className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Top 5 Gainers
          </CardTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Campaign</TableHead>
                <TableHead className="text-right">Sales P1</TableHead>
                <TableHead className="text-right">Sales P2</TableHead>
                <TableHead className="text-right">Spend P1</TableHead>
                <TableHead className="text-right">Spend P2</TableHead>
                <TableHead className="text-right">ROI P1</TableHead>
                <TableHead className="text-right">ROI P2</TableHead>
                <TableHead>ROI Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ganiersData.map((product, index) => {
                const roiChange =
                  product["roi2"] -
                  product["roi1"];
                const isGrowing = roiChange > 0;

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {product["Campaign Name"]}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product["Targeting Value"]}
                        </div>
                      </div>
                    </TableCell>
                     <TableCell className="text-right">
                      ₹{formatNumber(product["Total Sales - Period 1"])}
                    </TableCell>
                    <TableCell className="text-right">
                        ₹{formatNumber(product["Total Sales - Period 2"])}
                    </TableCell>
                    <TableCell className="text-right">
                       ₹{formatNumber(product["Total Spend - Period 1"])}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{formatNumber(product["Total Spend - Period 2"])}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        product["Total Sales - Period 1"] /
                        product["Total Spend - Period 1"]
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        product["Total Sales - Period 2"] /
                        product["Total Spend - Period 2"]
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isGrowing ? "default" : "secondary"}
                        className="flex items-center gap-1 w-fit"
                      >
                        {isGrowing ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {isGrowing ? "+" : ""}
                        {roiChange.toFixed(2)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        </CardContent>
    </Card>


    <Card className="mt-4 pt-4">
        <CardContent>
           <div className="overflow-x-auto">
          <CardTitle className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-green-500" />
            Top 5 Drainers
          </CardTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Campaign</TableHead>
                <TableHead className="text-right">Sales P1</TableHead>
                <TableHead className="text-right">Sales P2</TableHead>
                <TableHead className="text-right">Spend P1</TableHead>
                <TableHead className="text-right">Spend P2</TableHead>
                <TableHead className="text-right">ROI P1</TableHead>
                <TableHead className="text-right">ROI P2</TableHead>
                <TableHead>ROI Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drainersData.map((product, index) => {
                const roiChange =
                  product["roi2"] -
                  product["roi1"];
                const isGrowing = roiChange > 0;

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {product["Campaign Name"]}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product["Targeting Value"]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{formatNumber(product["Total Sales - Period 1"])}
                    </TableCell>
                    <TableCell className="text-right">
                        ₹{formatNumber(product["Total Sales - Period 2"])}
                    </TableCell>
                    <TableCell className="text-right">
                       ₹{formatNumber(product["Total Spend - Period 1"])}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{formatNumber(product["Total Spend - Period 2"])}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        product["Total Sales - Period 1"] /
                        product["Total Spend - Period 1"]
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        product["Total Sales - Period 2"] /
                        product["Total Spend - Period 2"]
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isGrowing ? "default" : "secondary"}
                        className="flex items-center gap-1 w-fit"
                      >
                        {isGrowing ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {isGrowing ? "+" : ""}
                        {roiChange.toFixed(2)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        </CardContent>
    </Card>
    </>
  );
};
