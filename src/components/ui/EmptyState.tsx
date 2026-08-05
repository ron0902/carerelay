import { InboxIcon } from "@heroicons/react/24/outline";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white py-16 px-8 text-center">
      <InboxIcon className="mb-4 h-16 w-16 text-gray-400" />

      <h2 className="text-xl font-semibold text-gray-800">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-gray-500">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}