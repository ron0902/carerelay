import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import Spinner from "./Spinner";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "outline";

  size?: "sm" | "md" | "lg";

  fullWidth?: boolean;

  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          "rounded-lg font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2",
          "disabled:opacity-60 disabled:cursor-not-allowed",

          {
            "px-3 py-2 text-sm": size === "sm",
            "px-4 py-2 text-base": size === "md",
            "px-6 py-3 text-lg": size === "lg",

            "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300":
              variant === "primary",

            "bg-gray-200 text-gray-900 hover:bg-gray-300":
              variant === "secondary",

            "bg-green-600 text-white hover:bg-green-700":
              variant === "success",

            "bg-yellow-500 text-white hover:bg-yellow-600":
              variant === "warning",

            "bg-red-600 text-white hover:bg-red-700":
              variant === "danger",

            "border border-blue-600 text-blue-600 hover:bg-blue-50":
              variant === "outline",

            "w-full": fullWidth,
          },

          className
        )}
        {...props}
      >
        {loading ? (
        <div className="flex items-center justify-center gap-2">
          <Spinner size="sm" color="white" />
          Loading...
        </div>
      ) : (
        children
      )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;