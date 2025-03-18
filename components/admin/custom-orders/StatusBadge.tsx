import { Badge } from "@/components/ui/badge";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300"
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800 border-blue-300"
  },
  in_progress: {
    label: "In Progress",
    className: "bg-purple-100 text-purple-800 border-purple-300"
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-300"
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-300"
  }
};

export function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status];
  
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
} 