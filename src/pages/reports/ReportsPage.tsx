import { useState } from "react";
import { Card } from "../../components/ui";
import ReportToolbar from "../../components/reports/ReportToolbar";
import ReportTable from "../../components/reports/ReportTable";
import ReportCard from "../../components/reports/ReportCard";
import { type Report } from "../../types/report";
import ExportButtons from "../../components/reports/ExportButtons";
import ViewReportModal from "../../components/reports/ViewReportModal";
import { exportPDF } from "../../utils/exportPDF";
import { exportExcel } from "../../utils/exportExcel";
import {
  Users,
  UserCog,
  ClipboardList,
  CalendarDays,
} from "lucide-react";


export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewReport, setViewReport] = useState<Report | null>(null);

 const reports: Report[] = [
  {
    id: 1,
    title: "Patient Report",
    category: "Patients",
    totalRecords: 152,
    lastUpdated: "July 27, 2026",
    status: "Ready",
  },
  {
    id: 2,
    title: "Caregiver Report",
    category: "Caregivers",
    totalRecords: 34,
    lastUpdated: "July 27, 2026",
    status: "Ready",
  },
  {
    id: 3,
    title: "Assignment Report",
    category: "Assignments",
    totalRecords: 48,
    lastUpdated: "July 27, 2026",
    status: "Generating",
  },
  {
    id: 4,
    title: "Appointment Report",
    category: "Appointments",
    totalRecords: 96,
    lastUpdated: "July 27, 2026",
    status: "Archived",
  },
];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || report.category === category;

    return matchesSearch && matchesCategory;
  });

  const headers = [
    "Report",
    "Category",
    "Total Records",
    "Last Updated",
  ];

  const rows = filteredReports.map((report) => [
    report.title,
    report.category,
    report.totalRecords,
    report.lastUpdated,
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Reports
          </h1>

          <p className="text-gray-500">
            Generate, print, and export healthcare reports.
          </p>
        </div>

        <div className="flex gap-3">
          <ExportButtons
            onPDF={() =>
              exportPDF("CareRelay Reports", headers, rows)
            }
            onExcel={() =>
              exportExcel("CareRelay Reports", filteredReports)
            }
            onPrint={() => window.print()}
          />
        </div>
      </div>

      {/* Summary Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <ReportCard
          title="Patients"
          description="Registered Patients"
          total={152}
          updated="Today"
          icon={<Users size={28} />}
          onPDF={() => console.log("Patient PDF")}
          onExcel={() => console.log("Patient Excel")}
        />

        <ReportCard
          title="Caregivers"
          description="Registered Caregivers"
          total={34}
          updated="Today"
          icon={<UserCog size={28} />}
          onPDF={() => console.log("Caregiver PDF")}
          onExcel={() => console.log("Caregiver Excel")}
        />

        <ReportCard
          title="Assignments"
          description="Care Assignments"
          total={48}
          updated="Today"
          icon={<ClipboardList size={28} />}
          onPDF={() => console.log("Assignment PDF")}
          onExcel={() => console.log("Assignment Excel")}
        />

        <ReportCard
          title="Appointments"
          description="Scheduled Appointments"
          total={96}
          updated="Today"
          icon={<CalendarDays size={28} />}
          onPDF={() => console.log("Appointment PDF")}
          onExcel={() => console.log("Appointment Excel")}
        />

      </div>

      <Card>

        <ReportToolbar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
        />

        <ReportTable
          reports={filteredReports}
          onView={setViewReport}
        />

      </Card>

      <ViewReportModal
        open={viewReport !== null}
        report={viewReport}
        onClose={() => setViewReport(null)}
      />
    </div>
  );
}