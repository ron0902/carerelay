import clsx from "clsx";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy";
}

export default function Avatar({
  src,
  alt,
  name = "User",
  size = "md",
  status,
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  const statusColor = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt ?? name}
          className={clsx(
            "rounded-full object-cover border border-gray-200",
            sizes[size]
          )}
        />
      ) : (
        <div
          className={clsx(
            "rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold border border-gray-200",
            sizes[size]
          )}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
            statusColor[status]
          )}
        />
      )}
    </div>
  );
}