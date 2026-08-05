import clsx from "clsx";
import type { HTMLAttributes } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "info" | "warning" | "danger";
  title?: string;
}

export default function Alert({
  variant = "info",
  title,
  children,
  className,
  ...props
}: AlertProps) {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };

  const icons = {
    success: <CheckCircleIcon className="h-6 w-6" />,
    info: <InformationCircleIcon className="h-6 w-6" />,
    warning: <ExclamationTriangleIcon className="h-6 w-6" />,
    danger: <XCircleIcon className="h-6 w-6" />,
  };

  return (
    <div
      className={clsx(
        "flex gap-3 rounded-lg border p-4",
        styles[variant],
        className
      )}
      {...props}
    >
      <div>{icons[variant]}</div>

      <div>
        {title && (
          <h4 className="font-semibold mb-1">
            {title}
          </h4>
        )}

        <div className="text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}