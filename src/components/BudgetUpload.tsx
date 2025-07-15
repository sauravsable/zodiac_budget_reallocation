import React, { useCallback } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BudgetDataZepto } from "@/pages/Index";

interface BudgetUploadProps {
  onDataUpload: (data: BudgetDataZepto[]) => void;
  id: string;
}

export const BudgetUpload: React.FC<BudgetUploadProps> = ({ onDataUpload, id }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  //  const requiredColumns = [
  //   'ProductID',
  //   'ProductName',
  //    'Campaign_id',
  //   'Revenue',
  //   'Spend',
  //   'Roas',
  // ];

  const parseCSV = useCallback((csvText: string): BudgetDataZepto[] => {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) {
      throw new Error("CSV file must contain at least a header row and one data row");
    }

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

    // Check for required columns
    // const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    // if (missingColumns.length > 0) {
    //   throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    // }

    const data: BudgetDataZepto[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));

      if (values.length !== headers.length) {
        console.warn(`Row ${i + 1} has ${values.length} values but expected ${headers.length}, skipping...`);
        continue;
      }

      const row: any = {};
      headers.forEach((header, index) => {
        const value = values[index];

        // Convert numeric columns
        if (header.includes("Sales") || header.includes("Spend") || header.includes("ROI")) {
          const numValue = parseFloat(value);
          if (isNaN(numValue)) {
            throw new Error(`Invalid numeric value "${value}" in column "${header}" at row ${i + 1}`);
          }
          row[header] = numValue;
        } else {
          row[header] = value;
        }
      });

      data.push(row as BudgetDataZepto);
    }

    if (data.length === 0) {
      throw new Error("No valid data rows found in CSV file");
    }

    return data;
  }, []);

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setError("Please upload a CSV file");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const text = await file.text();
        const data = parseCSV(text);
        onDataUpload(data);
        console.log(`Successfully loaded ${data.length} products from CSV`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse CSV file");
      } finally {
        setLoading(false);
      }
    },
    [parseCSV, onDataUpload]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFileUpload(e.target.files[0]);
      }
    },
    [handleFileUpload]
  );

  return (
    <Card
      className={`border border-gray-300 bg-white transition-colors shadow-sm ${
        dragActive ? "border-blue-300 bg-blue-50" : "hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      <CardContent className="space-y-4 py-6 px-4">
        {error && (
          <Alert className="border-red-300 bg-red-100 text-red-800">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="">
          <div
            className="w-full p-6 rounded-xl transition-all duration-200 ease-in-out flex flex-col items-center justify-center gap-3 border-gray-300"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className={`w-6 h-6 ${dragActive ? "text-blue-500" : "text-gray-500"}`} />

            {loading ? (
              <div className="w-full">
                <p className="text-sm text-gray-600 text-center mb-2">Processing file...</p>
                <div className="w-full h-1 bg-gray-200 rounded-full">
                  <div className="h-1 w-1/2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700">Drag & drop your CSV here</p>
                <p className="text-xs text-gray-500">or click below to browse (max 10MB)</p>

                <input type="file" accept=".csv" id={id} onChange={handleFileInputChange} className="hidden" />
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-2 border-gray-400 text-gray-800 hover:bg-gray-100"
                >
                  <label htmlFor={id} className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
