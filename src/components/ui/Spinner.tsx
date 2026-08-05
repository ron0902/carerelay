import clsx from "clsx";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white";
}

export default function Spinner({
  size = "md",
  color = "primary",
}: SpinnerProps) {
  return (
    <div
      className={clsx(
        "animate-spin rounded-full border-4 border-solid border-t-transparent",
        {
          "w-4 h-4": size === "sm",
          "w-6 h-6": size === "md",
          "w-10 h-10": size === "lg",

          "border-blue-600": color === "primary",
          "border-white": color === "white",
        }
      )}
    />
  );
}