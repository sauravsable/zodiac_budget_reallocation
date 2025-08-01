import React, { useState, useCallback } from "react";
import {
  Calculator,
  BarChart3,
  Download,
  AlertCircle,
  CheckCircle,
  Currency,
  Target,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BudgetUpload } from "@/components/BudgetUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { DataPreview } from "@/components/DataPreview";
import { ExecutiveSummary } from "@/components/ExecutiveSummary";
import { processCSVData, mergeBudgetData } from "@/utils/budgetAnalysis";
import PlatformSwitch from "@/components/PlatformSwitch";
import { usePlatformStore } from "@/utils/zusStore";
import { formatNumber } from "@/utils/numberFormatter";

export type BudgetDataZepto = {
  CampaignName: string;
  Revenue: number;
  Spend: number;
};

export type BudgetDataBlinkit = {
  "Campaign Name": string;
  "Direct Sales": number;
  "Indirect Sales": number;
  "Estimated Budget Consumed": number;
};

export type BudgetDataInstamart = {
  Campaign_Name: string;
  TOTAL_GMV: number;
  TOTAL_BUDGET_BURNT: number;
};

export type BudgetDataReturn = {
  "Campaign Name": string;
  "Total Sales - Period 1": number;
  "Total Spend - Period 1": number;
  "Total Sales - Period 2": number;
  "Total Spend - Period 2": number;
};

type AnalysisResultBase = {
  Incremental_Sales: number;
  Incremental_Spend: number;
  Original_Incremental_ROI: number;
  Incremental_ROI_Score: number;
  Current_ROI: number;
  Efficiency_Score: number;
  Ranking_Score: number;
  New_Budget_Allocation: number;
  Budget_Multiplier: number;
  Projected_Sales_Increase: number;
  Projected_New_Sales: number;
  Projected_ROI: number;
  isEfficiencyWinner: boolean;
};

export type AnalysisResult = BudgetDataReturn & AnalysisResultBase;

const BudgetAllocation = () => {
  const [csvData, setCsvData] = useState([]);
  const [csvData2, setCsvData2] = useState([]);
  const [isUpload, setisUpload] = useState(false);
  const [totalBudget, setTotalBudget] = useState<string>("");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState("upload");
  const platform = usePlatformStore((state) => state.platform);

  const handleDataUpload = useCallback((data: BudgetDataZepto[]) => {
    setCsvData(data);
    setError("");
  }, []);

  const handleDataUpload2 = useCallback((data: BudgetDataZepto[]) => {
    setCsvData2(data);
    setisUpload(true);
    setError("");
  }, []);

  const runAnalysis = async () => {
    if (!csvData.length || !totalBudget) {
      setError("Please upload data and set budget amount");
      return;
    }

    const budget = parseFloat(totalBudget);
    if (isNaN(budget) || budget <= 0) {
      setError("Please enter a valid budget amount");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setError("");

    try {
      // Simulate progress for better UX
      const progressSteps = [
        { step: 20, message: "Calculating incremental metrics..." },
        { step: 40, message: "Computing efficiency scores..." },
        { step: 60, message: "Ranking products..." },
        { step: 80, message: "Allocating budget..." },
        { step: 100, message: "Generating projections..." },
      ];

      for (const { step } of progressSteps) {
        setProgress(step);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      let mergedresult;
      if (platform === "Blinkit") {
        mergedresult = mergeBudgetData(csvData, csvData2, {
          campaignField: "Campaign Name",
          salesField: ["Direct Sales", "Indirect Sales"],
          spendField: "Estimated Budget Consumed",
        });
      }
      if (platform === "Zepto") {
        mergedresult = mergeBudgetData(csvData, csvData2, {
          campaignField: "CampaignName",
          salesField: "Revenue",
          spendField: "Spend",
        });
      }
      if (platform === "Instamart") {
        mergedresult = mergeBudgetData(csvData, csvData2, {
          campaignField: "CAMPAIGN_NAME",
          salesField: "TOTAL_GMV",
          spendField: "TOTAL_BUDGET_BURNT",
        });
      }
      const results = processCSVData(mergedresult, budget);
      setAnalysisResults(results);
      setActiveTab("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };
  
  const exportResults = () => {
    if (!analysisResults.length) return;

    const csv = [
      Object.keys(analysisResults[0]).join(","),
      ...analysisResults.map((row) =>
        Object.values(row)
          .map((val) => (typeof val === "string" ? `"${val}"` : val))
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget_analysis_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-gray-700 flex">
      <div className="h-screen">
        {/* Header */}
        <div className=" border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="w-full py-2 ">
                <h1 className="text-3xl font-bold text-foreground text-center gap-3 w-full">
                  Budget Allocation
                </h1>
                <p className="text-muted-foreground mt-1 w-full text-center">
                  Comprehensive Budget Allocation Analysis with Optimized
                  Efficiency Gains
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <Alert className="mb-6 border-destructive/50 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {activeTab === "upload" && (
              <div className="flex justify-center mb-6">
                <PlatformSwitch />
              </div>
            )}

            <TabsContent value="upload" className="mt-6">
              <div className="flex justify-center">
                <div className="w-full  space-y-6">
                  <div className="w-1/2 mx-auto">
                    <BudgetUpload
                      id="file-upload-2"
                      onDataUpload={handleDataUpload2}
                    />
                  </div>

                  <div className="text-xs text-gray-400 text-center">
                    <span className="font-medium">Requirement:</span> Upload a
                    sheet.
                  </div>

                  <Card className="relative mx-auto w-5/6  overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-md border border-gray-200">
                    <div className="absolute left-0 top-0 h-full w-1 bg-yellow-400 rounded-l-xl" />

                    <CardHeader className="p-6 pb-4">
                      <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                        <Zap className="h-6 w-6 text-yellow-400" />
                        Key Features
                      </CardTitle>
                      <CardDescription className="mt-2 text-base text-gray-600">
                        Supercharge your campaigns with AI-driven performance
                        tools
                      </CardDescription>
                    </CardHeader>

                    <CardContent className=" flex flex-row flex-wrap items-start justify-evenly px-6 pb-6">
                      {[
                        {
                          title: "Opportunity Finder",
                          description:
                            "Identifies hidden growth areas across low-visibility campaigns.",
                        },
                        {
                          title: "Auto Scaling",
                          description:
                            "Allocates more budget to top-performers — instantly and intelligently.",
                        },
                        {
                          title: "Performance Index",
                          description:
                            "Combines spend, ROI, and growth potential into a single score.",
                        },
                        {
                          title: "Predictive Insights",
                          description:
                            "Forecasts success and suggests optimizations with AI modeling.",
                        },
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex w-1/2 items-start gap-2 rounded-lg p-4 bg-white hover:bg-gray-50 transition"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="w-5/6 mx-auto shadow-md border border-gray-200">
                    <CardHeader>
                      <CardTitle>Analysis Methodology</CardTitle>
                      <CardDescription>
                        How the advanced algorithm works
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 flex flex-row item-center justify-between flex-wrap">
                        <div className="border-l-4 border-blue-500 pl-3 w-1/2">
                          <h4 className="font-medium">1. Efficiency Scoring</h4>
                          <p className="text-sm text-muted-foreground">
                            Products with increased sales and reduced spend get
                            bonus points
                          </p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-3 w-1/2">
                          <h4 className="font-medium">2. Weighted Ranking</h4>
                          <p className="text-sm text-muted-foreground">
                            30% efficiency + 70% incremental performance
                          </p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-3 w-1/2">
                          <h4 className="font-medium">3. Smart Allocation</h4>
                          <p className="text-sm text-muted-foreground">
                            Up to 3x budget for efficiency winners, 2.5x for top
                            performers
                          </p>
                        </div>
                        <div className="border-l-4 border-orange-500 pl-3 w-1/2">
                          <h4 className="font-medium">4. ROI Projection</h4>
                          <p className="text-sm text-muted-foreground">
                            Forecasts sales increases based on allocation
                            multipliers
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {isUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative animate-fade-in">
                    {/* Close Button (optional) */}
                    <button
                      onClick={() => setisUpload(!isUpload)}
                      className="absolute top-1 right-2 text-lg text-gray-400 hover:text-gray-600 transition"
                    >
                      <span className="sr-only">Close</span>
                      &times;
                    </button>

                    {/* Upload Component */}
                    <div className="mb-6">
                      <BudgetUpload
                        id="file-upload-1"
                        onDataUpload={handleDataUpload}
                      />
                    </div>

                    <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-2 space-y-4">
                      {/* Header */}
                      <div>
                        <div className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                          <Currency className="h-6 w-6 text-green-500" />
                          Budget Configuration
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Set your total budget for reallocation analysis
                        </p>
                      </div>

                      {/* Budget Input */}
                      <div className="space-y-1">
                        <Label
                          htmlFor="budget"
                          className="text-sm font-medium text-gray-700"
                        >
                          Total Budget
                        </Label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            ₹
                          </span>
                          <Input
                            id="budget"
                            type="number"
                            placeholder="e.g., 10 Lakhs"
                            value={totalBudget}
                            onChange={(e) => setTotalBudget(e.target.value)}
                            className="pl-6"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          You entered: ₹
                          {totalBudget
                            ? formatNumber(Number(totalBudget))
                            : "0.00"}
                        </p>
                      </div>

                      {/* CSV Summary */}
                      {csvData2.length > 0 && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h4 className="text-base font-semibold text-gray-800 mb-3">
                            Data Summary
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                              <span className="text-gray-500">
                                Total Campaigns:{" "}
                              </span>
                              <span className="ml-2 font-medium">
                                {
                                  new Set(
                                    csvData2.map(
                                      (p) =>
                                        p["Campaign Name"] ||
                                        p["CampaignName"] ||
                                        p["CAMPAIGN_NAME"]
                                    )
                                  ).size
                                }
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Current Total Sales:
                              </span>
                              <span className="ml-2 font-medium">
                                ₹
                                {formatNumber(
                                  csvData2.reduce((sum, p) => {
                                    const revenueRaw =
                                      p["Revenue"] ??
                                      p["TOTAL_GMV"] ??
                                      Number(p["Direct Sales"] || 0) +
                                        Number(p["Indirect Sales"] || 0);

                                    const revenue = Number(revenueRaw);
                                    return sum + revenue;
                                  }, 0)
                                )}{" "}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Run Button */}
                      <Button
                        onClick={runAnalysis}
                        disabled={
                          !csvData.length || !totalBudget || isAnalyzing
                        }
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold py-2.5"
                        size="lg"
                      >
                        {isAnalyzing ? "Analyzing..." : "Run Budget Analysis"}
                        <Calculator className="ml-2 h-4 w-4" />
                      </Button>

                      {/* Progress Bar */}
                      {isAnalyzing && (
                        <div className="space-y-2">
                          <Progress value={progress} className="w-full" />
                          <p className="text-sm text-center text-gray-500">
                            Processing budget allocation algorithm...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="results" className="mt-6">
              <div className="flex justify-center">
                <div className="w-full max-w-6xl">
                  {analysisResults.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Analysis Results</h2>
                        <div className="flex items-center space-x-4">
                          <Button onClick={exportResults} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                          </Button>
                          <div className="text-md font-semibold rounded-md px-3 py-2 bg-blue-100 text-blue-500">
                            Platform: {platform}
                          </div>
                        </div>
                      </div>
                      <AnalysisResults
                        results={analysisResults}
                        totalBudget={parseFloat(totalBudget)}
                      />
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No analysis results yet. Please configure and run the
                          analysis first.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              {csvData.length > 0 && (
                <div className="flex justify-center mt-5">
                  <div className="w-full max-w-6xl">
                    <DataPreview
                      data={
                        platform === "Blinkit"
                          ? mergeBudgetData(csvData, csvData2, {campaignField: "Campaign Name",salesField: ["Direct Sales", "Indirect Sales"],spendField: "Estimated Budget Consumed"})
                          : platform === "Zepto"
                          ? mergeBudgetData(csvData, csvData2, { campaignField: "CampaignName", salesField: "Revenue", spendField: "Spend"})
                          : platform === "Instamart"
                          ? mergeBudgetData(csvData, csvData2, { campaignField: "CAMPAIGN_NAME",salesField: "TOTAL_GMV",spendField: "TOTAL_BUDGET_BURNT",})
                          : []
                      }
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-center mt-10">
                <div className="w-full max-w-6xl">
                  {analysisResults.length > 0 ? (
                    <ExecutiveSummary
                      results={analysisResults}
                      totalBudget={parseFloat(totalBudget)}
                    />
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Executive summary will appear here after running the
                          analysis.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BudgetAllocation;
