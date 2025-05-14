import { cn } from "@/lib/utils"

type StatusType = "pending" | "approved" | "rejected" | "completed" | "inprogress"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    },
    approved: {
      label: "Approved",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    },
    completed: {
      label: "Completed",
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    },
    inprogress: {
      label: "In Progress",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    },
  }

  const { label, className: statusClassName } = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        statusClassName,
        className,
      )}
    >
      {label}
    </span>
  )
}
