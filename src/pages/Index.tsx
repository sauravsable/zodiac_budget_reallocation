import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Calculator, BarChart3, Download, AlertCircle, CheckCircle, TrendingUp, DollarSign, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BudgetUpload } from '@/components/BudgetUpload';
import { AnalysisResults } from '@/components/AnalysisResults';
import { DataPreview } from '@/components/DataPreview';
import { ExecutiveSummary } from '@/components/ExecutiveSummary';
import { processCSVData, mergeBudgetData } from '@/utils/budgetAnalysis';

export interface BudgetDataZepto {
  'ProductID': string;
  'Campaign_id': string;
  'Product Name': string;
  'Revenue': number;
  'Spend': number;
  'Roas': number;
}

export interface AnalysisResult extends BudgetDataZepto {
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
}

const Index = () => {
  const [csvData, setCsvData] = useState<BudgetDataZepto[]>([]);
  const [csvData2, setCsvData2] = useState<BudgetDataZepto[]>([]);
  const [isFirstFileUploaded, setIsFirstFileUploaded] = useState(false);

  const [totalBudget, setTotalBudget] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState('upload');

  const handleDataUpload = useCallback((data: BudgetDataZepto[]) => {
    setCsvData(data);
    setError('');
    setIsFirstFileUploaded(true);
  }, []);

  const handleDataUpload2 = useCallback((data: BudgetDataZepto[]) => {
    setCsvData2(data);
    setError('');
    if(isFirstFileUploaded){
      setActiveTab('configure');
    }
  }, [isFirstFileUploaded]);

  const runAnalysis = async () => {
    if (!csvData.length || !totalBudget) {
      setError('Please upload data and set budget amount');
      return;
    }

    const budget = parseFloat(totalBudget);
    if (isNaN(budget) || budget <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setError('');

    try {
      // Simulate progress for better UX
      const progressSteps = [
        { step: 20, message: 'Calculating incremental metrics...' },
        { step: 40, message: 'Computing efficiency scores...' },
        { step: 60, message: 'Ranking products...' },
        { step: 80, message: 'Allocating budget...' },
        { step: 100, message: 'Generating projections...' }
      ];

      for (const { step } of progressSteps) {
        setProgress(step);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const mergedresult = mergeBudgetData(csvData, csvData2);

      const results = processCSVData(mergedresult,budget);

      console.log("results", results);
      

      setAnalysisResults(results);
      setActiveTab('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const exportResults = () => {
    if (!analysisResults.length) return;

    const csv = [
      Object.keys(analysisResults[0]).join(','),
      ...analysisResults.map(row => 
        Object.values(row).map(val => 
          typeof val === 'string' ? `"${val}"` : val
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = analysisResults.length > 0 ? {
    totalProducts: analysisResults.length,
    fundedProducts: analysisResults.filter(p => p.New_Budget_Allocation > 0).length,
    efficiencyWinners: analysisResults.filter(p => p.isEfficiencyWinner).length,
    totalAllocated: analysisResults.reduce((sum, p) => sum + p.New_Budget_Allocation, 0),
    expectedIncrease: analysisResults.reduce((sum, p) => sum + p.Projected_Sales_Increase, 0)
  } : null;


  console.log("csvdata2", csvData2);
  

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                Advanced Quick-Commerce Product Budget Reallocation
              </h1>
              <p className="text-muted-foreground mt-1">Advanced budget reallocation analysis with efficiency optimization</p>
            </div>
            
            {stats && (
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.fundedProducts}</div>
                  <div className="text-muted-foreground">Products Funded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.efficiencyWinners}</div>
                  <div className="text-muted-foreground">Efficiency Winners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">₹{(stats.totalAllocated).toFixed(0)}</div>
                  <div className="text-muted-foreground">Total Allocated</div>
                </div>
              </div>
            )}
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
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="configure" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Configure
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Results
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Summary
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upload" className="mt-6">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl space-y-6">
                <BudgetUpload id="file-upload-1" onDataUpload={handleDataUpload} />
                <BudgetUpload id="file-upload-2" onDataUpload={handleDataUpload2} />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      Key Features
                    </CardTitle>
                    <CardDescription>
                      Advanced budget optimization capabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Efficiency Detection</h4>
                        <p className="text-sm text-muted-foreground">Identifies products with increased sales and reduced spend</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Smart Ranking</h4>
                        <p className="text-sm text-muted-foreground">Advanced scoring combining efficiency and incremental performance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Dynamic Allocation</h4>
                        <p className="text-sm text-muted-foreground">Up to 3x budget multiplier for top efficiency winners</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium">ROI Projections</h4>
                        <p className="text-sm text-muted-foreground">Forecasts sales increases and portfolio returns</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {csvData.length > 0 && (
              <div className="mt-6">
                <DataPreview data={csvData} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="configure" className="mt-6">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-400" />
                        Budget Configuration
                      </CardTitle>
                      <CardDescription>
                        Set your total budget for reallocation analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="budget">Total Budget (in Lakhs)</Label>
                        <Input
                          id="budget"
                          type="number"
                          placeholder="e.g., 10.5"
                          value={totalBudget}
                          onChange={(e) => setTotalBudget(e.target.value)}
                          className="mt-1"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter the total budget available for allocation (₹{totalBudget ? (parseFloat(totalBudget) * 100).toFixed(0) : '0'}K)
                        </p>
                      </div>

                      {csvData.length > 0 && (
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Data Summary</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Products:</span>
                              <span className="ml-2 font-medium">{csvData.length}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Current Total Sales:</span>
                              <span className="ml-2 font-medium">
                                ₹{(csvData.reduce((sum, p) => sum + Number(p['Revenue']), 0)).toFixed(0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button 
                        onClick={runAnalysis}
                        disabled={!csvData.length || !totalBudget || isAnalyzing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Run Budget Analysis'}
                        <Calculator className="ml-2 h-4 w-4" />
                      </Button>

                      {isAnalyzing && (
                        <div className="space-y-2">
                          <Progress value={progress} className="w-full" />
                          <p className="text-sm text-muted-foreground text-center">
                            Processing budget allocation algorithm...
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Analysis Methodology</CardTitle>
                      <CardDescription>
                        How the advanced algorithm works
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="border-l-4 border-blue-500 pl-3">
                          <h4 className="font-medium">1. Efficiency Scoring</h4>
                          <p className="text-sm text-muted-foreground">Products with increased sales and reduced spend get bonus points</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-3">
                          <h4 className="font-medium">2. Weighted Ranking</h4>
                          <p className="text-sm text-muted-foreground">30% efficiency + 70% incremental performance</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-3">
                          <h4 className="font-medium">3. Smart Allocation</h4>
                          <p className="text-sm text-muted-foreground">Up to 3x budget for efficiency winners, 2.5x for top performers</p>
                        </div>
                        <div className="border-l-4 border-orange-500 pl-3">
                          <h4 className="font-medium">4. ROI Projection</h4>
                          <p className="text-sm text-muted-foreground">Forecasts sales increases based on allocation multipliers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <div className="flex justify-center">
              <div className="w-full max-w-6xl">
                {analysisResults.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Analysis Results</h2>
                      <Button onClick={exportResults} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                    <AnalysisResults results={analysisResults} totalBudget={parseFloat(totalBudget)} />
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No analysis results yet. Please configure and run the analysis first.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="mt-6">
            <div className="flex justify-center">
              <div className="w-full max-w-6xl">
                {analysisResults.length > 0 ? (
                  <ExecutiveSummary results={analysisResults} totalBudget={parseFloat(totalBudget)} />
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Executive summary will appear here after running the analysis.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
