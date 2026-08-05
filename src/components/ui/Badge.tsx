import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info";

  size?: "sm" | "md" | "lg";

  rounded?: boolean;
}

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  rounded = true,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium transition-colors",

        {
          "rounded-full": rounded,
          "rounded-md": !rounded,

          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "md",
          "px-4 py-1.5 text-base": size === "lg",

          "bg-blue-100 text-blue-700": variant === "primary",
          "bg-gray-100 text-gray-700": variant === "secondary",
          "bg-green-100 text-green-700": variant === "success",
          "bg-yellow-100 text-yellow-700": variant === "warning",
          "bg-red-100 text-red-700": variant === "danger",
          "bg-cyan-100 text-cyan-700": variant === "info",
        },

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}