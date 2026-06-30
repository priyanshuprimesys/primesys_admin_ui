import { IssueTicketPriority, IssueTicketStatus, PriorityColorMap, StatusColorMap } from "../interfaces/IssueTicketInterface";

interface StatusBadgeProps {
  status: IssueTicketStatus;
}

interface PriorityBadgeProps {
  priority: IssueTicketPriority;
}

export const TicketStatusBadge = ({ status }: StatusBadgeProps) => (
  <span
    className="px-2 py-1 rounded-md text-xs font-semibold text-white whitespace-nowrap"
    style={{ backgroundColor: StatusColorMap[status] ?? "#6b7280" }}
  >
    {status?.replace("_", " ") ?? "—"}
  </span>
);

export const TicketPriorityBadge = ({ priority }: PriorityBadgeProps) => (
  <span
    className="px-2 py-1 rounded-md text-xs font-semibold text-white whitespace-nowrap"
    style={{ backgroundColor: PriorityColorMap[priority] ?? "#6b7280" }}
  >
    {priority ?? "—"}
  </span>
);
