import { useState } from "react";
import { type Report } from "../../types/report";
import { Button, EmptyState } from "../ui";
import ReportStatusBadge from "./ReportStatusBadge";
import { Eye, FileText, FileSpreadsheet } from "lucide-react";

interface ReportTableProps {
  reports: Report[];
  onView: (report: Report) => void;
}

export default function ReportTable({ reports, onView }: ReportTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  if (reports.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          title="No reports found"
          description="Try another search or category."
        />
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(reports.length / reportsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedReports = reports.slice(
    (safeCurrentPage - 1) * reportsPerPage,
    safeCurrentPage * reportsPerPage
  );

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">

          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-3 text-left">Report</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Total Records</th>
              <th className="px-4 py-3 text-left">Last Updated</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedReports.map((report) => (
              <tr key={report.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{report.title}</td>
                <td className="px-4 py-3">{report.category}</td>
                <td className="px-4 py-3">{report.totalRecords}</td>
                <td className="px-4 py-3">{report.lastUpdated}</td>

                <td className="p-4">
                  <ReportStatusBadge status={report.status} />
                </td>

                <td className="p-4">
                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={() => onView(report)}
                      title="View report"
                      className="rounded bg-gray-500 p-2 text-white hover:bg-gray-600"
                    >
                      <Eye size={16} />
                    </button>

                    <button className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600">
                      <FileText size={16} />
                    </button>

                    <button className="rounded bg-green-500 p-2 text-white hover:bg-green-600">
                      <FileSpreadsheet size={16} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="secondary"
          disabled={safeCurrentPage === 1}
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
        >
          Previous
        </Button>

        <span className="text-sm text-gray-600">
          Page {safeCurrentPage} of {totalPages}
        </span>

        <Button
          variant="secondary"
          disabled={safeCurrentPage === totalPages}
          onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}