import type { ReactNode } from "react";
import { Button } from "../ui";
import { FileSpreadsheet, FileText } from "lucide-react";

interface ReportCardProps {
  title: string;
  description: string;
  total: number;
  updated?: string;
  icon: ReactNode;
  onPDF?: () => void;
  onExcel?: () => void;
}

export default function ReportCard({
  title,
  description,
  total,
  updated = "Today",
  icon,
  onPDF,
  onExcel,
}: ReportCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
          {icon}
        </div>

        <div>
          <h3 className="text-lg font-semibold">
            {title}
          </h3>

          <p className="text-sm text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-4xl font-bold text-blue-600">
          {total}
        </p>

        <p className="text-sm text-gray-500">
          Records
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">
            Last Updated
          </p>

          <p className="text-sm font-medium">
            {updated}
          </p>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={onPDF}>
            <FileText size={16} />
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={onExcel}
          >
            <FileSpreadsheet size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}