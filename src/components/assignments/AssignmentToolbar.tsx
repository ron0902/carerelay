interface AssignmentToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export default function AssignmentToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: AssignmentToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <input
        type="text"
        placeholder="Search patient or caregiver..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none md:w-80"
      />

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
      >
        <option value="All">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

    </div>
  );
}