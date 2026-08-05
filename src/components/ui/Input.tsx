import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import clsx from "clsx";
import {
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      type = "text",
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
      type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}

            {required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={clsx(
              "w-full rounded-lg border px-3 py-2",
              "outline-none transition",
              "focus:ring-2 focus:ring-blue-300",
              error
                ? "border-red-500"
                : "border-gray-300",
              className
            )}
            {...props}
          />

          {type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
          )}
        </div>

        {helperText && !error && (
          <p className="text-sm text-gray-500">
            {helperText}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;