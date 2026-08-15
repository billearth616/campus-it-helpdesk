import type { TicketPriority, TicketStatus } from "@/lib/types";
import {
  CircleDotIcon,
  ClockIcon,
  CheckCircleIcon,
  ArchiveIcon,
  FlagIcon,
  WarningIcon,
} from "@/components/icons";

const statusConfig: Record<
  TicketStatus,
  { label: string; classes: string; Icon: typeof CircleDotIcon }
> = {
  open: {
    label: "Open",
    classes: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
    Icon: CircleDotIcon,
  },
  in_progress: {
    label: "In progress",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    Icon: ClockIcon,
  },
  resolved: {
    label: "Resolved",
    classes: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
    Icon: CheckCircleIcon,
  },
  closed: {
    label: "Closed",
    classes: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/15",
    Icon: ArchiveIcon,
  },
};

const priorityConfig: Record<TicketPriority, { label: string; classes: string }> = {
  low: { label: "Low", classes: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/15" },
  medium: { label: "Medium", classes: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20" },
  high: { label: "High", classes: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20" },
  urgent: { label: "Urgent", classes: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20" },
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, classes, Icon } = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const { label, classes } = priorityConfig[priority];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>
      {priority === "urgent" ? <WarningIcon className="h-3.5 w-3.5" /> : <FlagIcon className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}
