import { Button } from "../../components/ui";
import { FileSpreadsheet, FileText, Printer } from "lucide-react";

interface ExportButtonsProps {
  onPDF?: () => void;
  onExcel?: () => void;
  onPrint?: () => void;
}

export default function ExportButtons({
  onPDF,
  onExcel,
  onPrint,
}: ExportButtonsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <Button onClick={onPDF}>
        <FileText size={18} />
        <span className="ml-2">Export PDF</span>
      </Button>

      <Button variant="secondary" onClick={onExcel}>
        <FileSpreadsheet size={18} />
        <span className="ml-2">Export Excel</span>
      </Button>

      <Button variant="secondary" onClick={onPrint}>
        <Printer size={18} />
        <span className="ml-2">Print</span>
      </Button>
    </div>
  );
}