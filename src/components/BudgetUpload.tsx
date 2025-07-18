import React, { useCallback, useMemo } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BudgetDataZepto } from "@/pages/BudgetAllocation";
import { usePlatformStore } from "@/utils/zusStore";
import { parseCSV, parseXLSX } from "../utils/dataParse";
interface BudgetUploadProps {
  onDataUpload: (data: BudgetDataZepto[]) => void;
  id: string;
}

export const BudgetUpload: React.FC<BudgetUploadProps> = ({
  onDataUpload,
  id,
}) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFileName, setSelectedFileName] = React.useState("");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const platform = usePlatformStore((state) => state.platform);

  const { requiredColumns } = useMemo(() => {
    if (platform === "Blinkit") {
      return {
        requiredColumns: [
          "Campaign Name",
          "Targeting Value",
          "Targeting Type",
          "Direct Sales",
          "Indirect Sales",
          "Estimated Budget Consumed",
        ],
      };
    } else if (platform === "Zepto") {
      return {
        requiredColumns: ["CampaignName", "Revenue", "Spend"],
      };
    } else {
      return {
        requiredColumns: [],
      };
    }
  }, [platform]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      const isCSV = file.type === "text/csv" || file.name.endsWith(".csv");
      const isXLSX =
        file.name.endsWith(".xlsx") ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (!isCSV && !isXLSX) {
        setError("Please upload a CSV or XLSX file");
        return;
      }

      setLoading(true);
      setError("");

      try {
        let data: any[] = [];
        if (isCSV) {
          const text = await file.text();
          data = parseCSV(text, requiredColumns);
        } else if (isXLSX) {
          data = await parseXLSX(file, requiredColumns);
        }
        onDataUpload(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse file");
      } finally {
        setLoading(false);
      }
    },
    [onDataUpload, requiredColumns]
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
        setSelectedFileName(e.target.files[0]?.name || "");
      }
    },
    [handleFileUpload]
  );

  return (
    <Card
      className={`border border-gray-300 bg-white transition-colors shadow-sm ${
        dragActive
          ? "border-blue-300 bg-blue-50"
          : "hover:border-gray-400 hover:bg-gray-50"
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
            <Upload
              className={`w-6 h-6 ${
                dragActive ? "text-blue-500" : "text-gray-500"
              }`}
            />

            {loading ? (
              <div className="w-full">
                <p className="text-sm text-gray-600 text-center mb-2">
                  Processing file...
                </p>
                <div className="w-full h-1 bg-gray-200 rounded-full">
                  <div className="h-1 w-1/2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700">
                  Drag & drop your CSV here
                </p>
                <p className="text-xs text-gray-500">
                  or click below to browse (max 10MB)
                </p>

                <input
                  type="file"
                  id={id}
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {selectedFileName && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected:{" "}
                    <span className="font-medium">{selectedFileName}</span>
                  </p>
                )}
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
