import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export default function DataTable<T extends object>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.accessor)}
                className="border-b px-4 py-3 text-left text-sm font-semibold"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-gray-500"
              >
                No data available.
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.accessor)}
                    className="border-b px-4 py-3"
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.accessor])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}