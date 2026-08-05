import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportPDF(
  title: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 20);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 30,
  });

  doc.save(`${title}.pdf`);
}