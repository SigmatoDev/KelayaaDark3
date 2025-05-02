import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles = {
  pending: "bg-purple-100 text-purple-800 border-purple-200",
  processing: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusStyle = statusStyles[status as keyof typeof statusStyles] || statusStyles.default;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyle,
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
