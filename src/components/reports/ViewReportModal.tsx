import { Button, Modal } from "../../components/ui";
import { type Report } from "../../types/report";
import ReportStatusBadge from "./ReportStatusBadge";

interface ViewReportModalProps {
  open: boolean;
  report: Report | null;
  onClose: () => void;
}

export default function ViewReportModal({ open, report, onClose }: ViewReportModalProps) {
  if (!report) return null;

  return (
    <Modal open={open} onClose={onClose} title="Report Details">
      <div className="space-y-6">
        <div className="rounded-xl bg-gray-50 p-5">
          <p className="text-sm text-gray-500">Report</p>
          <h3 className="mt-1 text-xl font-bold text-gray-900">{report.title}</h3>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div><p className="text-sm text-gray-500">Report ID</p><p className="font-semibold">#{report.id}</p></div>
          <div><p className="text-sm text-gray-500">Category</p><p className="font-semibold">{report.category}</p></div>
          <div><p className="text-sm text-gray-500">Total Records</p><p className="font-semibold">{report.totalRecords}</p></div>
          <div><p className="text-sm text-gray-500">Last Updated</p><p className="font-semibold">{report.lastUpdated}</p></div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <div className="mt-1"><ReportStatusBadge status={report.status} /></div>
          </div>
        </div>

        <div className="flex justify-end border-t pt-5">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
