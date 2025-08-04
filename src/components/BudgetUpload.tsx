import React, { useCallback, useMemo } from "react";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BudgetDataZepto } from "@/pages/BudgetAllocation";
import { usePlatformStore } from "@/utils/zusStore";
import { parseCSV, parseXLSX } from "../utils/dataParse";
import { motion, AnimatePresence } from "framer-motion";

interface BudgetUploadProps {
  onDataUpload: (data: BudgetDataZepto[]) => void;
  id: string;
}

const requiredSheets = ["PRODUCT_LISTING", "PRODUCT_RECOMMENDATION"];
const numericColumns = ["Spend", "Revenue", "TOTAL_GMV", "Direct Sales", "Indirect Sales", "Estimated Budget Consumed"];

export const BudgetUpload: React.FC<BudgetUploadProps> = ({ onDataUpload, id }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFileName, setSelectedFileName] = React.useState("");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const platform = usePlatformStore((state) => state.platform);

  const { requiredColumns } = useMemo(() => {
    if (platform === "Blinkit") {
      return { requiredColumns: ["Campaign Name", "Direct Sales", "Indirect Sales", "Estimated Budget Consumed"] };
    } else if (platform === "Zepto") {
      return { requiredColumns: ["CampaignName", "Revenue", "Spend"] };
    } else if (platform === "Instamart") {
      return { requiredColumns: ["CAMPAIGN_NAME", "TOTAL_GMV", "TOTAL_BUDGET_BURNT"] };
    } else {
      return { requiredColumns: [] };
    }
  }, [platform]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      const isCSV = file.type === "text/csv" || file.name.endsWith(".csv");
      const isXLSX =
        file.name.endsWith(".xlsx") ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (!isCSV && !isXLSX) {
        setError("Please upload a CSV or XLSX file");
        return;
      }

      setLoading(true);
      setError("");
      setSuccess(false);

      try {
        let data: any[] = [];
        if (isCSV) {
          const content = await file.text();
          data = parseCSV([{ filename: file.name, content }], requiredColumns, requiredSheets, numericColumns);
        } else if (isXLSX) {
          data = await parseXLSX(file, requiredColumns, requiredSheets, numericColumns);
        }
        onDataUpload(data);
        setSuccess(true);
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
        setSelectedFileName(e.dataTransfer.files[0].name || "");
      }
    },
    [handleFileUpload]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFileUpload(e.target.files[0]);
        setSelectedFileName(e.target.files[0].name || "");
      }
    },
    [handleFileUpload]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card
        className={`relative border-2 transition-all duration-500 rounded-3xl shadow-2xl overflow-hidden ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-gradient-to-br from-white to-gray-100"
        }`}
      >
        <CardContent className="py-14 px-10 flex flex-col items-center justify-center gap-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <Alert className="border-red-300 bg-red-100 text-red-800 shadow-md">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex items-center gap-2 text-green-600 text-md font-semibold"
              >
                <CheckCircle2 className="h-5 w-5" /> File Uploaded Successfully
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className={`w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              dragActive ? "border-blue-400 bg-blue-100 animate-pulse" : "border-gray-300 bg-white hover:shadow-2xl"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className={`w-14 h-14 mb-3 ${dragActive ? "text-blue-500" : "text-gray-400"}`} />

            {loading ? (
              <div className="w-full">
                <p className="text-md text-gray-600 text-center mb-2">Processing file...</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-2 bg-blue-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="text-xl text-gray-700 font-semibold">Drag & Drop your CSV/XLSX here</p>
                <p className="text-sm text-gray-500 mb-4">or click below to browse (Max 10MB)</p>

                <input type="file" id={id} onChange={handleFileInputChange} className="hidden" />

                {selectedFileName && (
                  <p className="mt-2 text-md text-green-600 font-medium">Selected: {selectedFileName}</p>
                )}

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="mt-4 border-gray-300 text-gray-800 hover:bg-gray-100 rounded-xl px-8 py-2 shadow-md hover:shadow-xl"
                >
                  <label
                    htmlFor={id}
                    className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Choose File
                  </label>
                </Button>
              </>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
