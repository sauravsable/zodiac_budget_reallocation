
import React, { useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BudgetData } from '@/pages/Index';

interface BudgetUploadProps {
  onDataUpload: (data: BudgetData[]) => void;
}

export const BudgetUpload: React.FC<BudgetUploadProps> = ({ onDataUpload }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);

  const requiredColumns = [
    'Product Code',
    'Product Name', 
    'Total Sales in Lakhs - Period 1',
    'Total Sales in Lakhs - Period 2',
    'Total Spend - Period 1',
    'Total Spend - Period 2',
    'ROI - Period 1',
    'ROI - Period 2'
  ];

  const parseCSV = useCallback((csvText: string): BudgetData[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Check for required columns
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    const data: BudgetData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length !== headers.length) {
        console.warn(`Row ${i + 1} has ${values.length} values but expected ${headers.length}, skipping...`);
        continue;
      }

      const row: any = {};
      headers.forEach((header, index) => {
        const value = values[index];
        
        // Convert numeric columns
        if (header.includes('Sales') || header.includes('Spend') || header.includes('ROI')) {
          const numValue = parseFloat(value);
          if (isNaN(numValue)) {
            throw new Error(`Invalid numeric value "${value}" in column "${header}" at row ${i + 1}`);
          }
          row[header] = numValue;
        } else {
          row[header] = value;
        }
      });

      data.push(row as BudgetData);
    }

    if (data.length === 0) {
      throw new Error('No valid data rows found in CSV file');
    }

    return data;
  }, [requiredColumns]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const text = await file.text();
      const data = parseCSV(text);
      onDataUpload(data);
      console.log(`Successfully loaded ${data.length} products from CSV`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setLoading(false);
    }
  }, [parseCSV, onDataUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  }, [handleFileUpload]);

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-red-400 bg-red-950/20">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center">
        <div
          className={`border-2 border-dashed rounded-lg p-4 transition-colors flex items-center gap-3 ${
            dragActive 
              ? 'border-blue-400 bg-blue-950/20' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className={`h-5 w-5 ${dragActive ? 'text-blue-400' : 'text-gray-400'}`} />
          
          {loading ? (
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-300">Processing...</p>
              <div className="w-16 h-1 bg-gray-700 rounded-full">
                <div className="h-1 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-200">
                  Drop CSV file or 
                </p>
                <p className="text-xs text-gray-400">
                  Up to 10MB
                </p>
              </div>
              
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline" size="sm" className="border-gray-600 hover:border-gray-500 text-gray-200 hover:text-gray-100">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center">
        <span className="font-medium">Required columns:</span> Product Code, Product Name, Sales & ROI data for both periods
      </div>
    </div>
  );
};
