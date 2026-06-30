import { useContext, useEffect, useMemo, useRef } from "react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import IssueLLMDashboard from "./components/IssueLLMDashboard";
import IssueLLM from "./index";
import TeamAnalyticsDashboard from "./components/TeamAnalyticsDashboard";
import SkippedMessagesView from "./components/SkippedMessagesView";
import OverdueTicketsView from "./components/OverdueTicketsView";
import MemberActivityView from "./components/MemberActivityView";
import { useGetAllIssueTickets } from "./hooks/GetAllTicketsHook";
import { IssueTicketInterface } from "./interfaces/IssueTicketInterface";
import { fmtWorkingTime } from "./hooks/useActivityTracker";
import { UserDetailContext } from "../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { ActivityContext } from "../../../contexts/AppLayout/ActivityContext/ActivityContext";

const resolveFlat = (raw: unknown): IssueTicketInterface[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as IssueTicketInterface[];
  if (typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  for (const key of ["result", "content", "data", "tickets", "items", "records"])
    if (Array.isArray(obj[key])) return obj[key] as IssueTicketInterface[];
  const first = Object.values(obj)[0];
  if (Array.isArray(first) && (first[0] as IssueTicketInterface)?.ticketId)
    return Object.values(obj).flat() as IssueTicketInterface[];
  return [];
};

export default function IssueLLMTab() {
  const { userDetail } = useContext(UserDetailContext);
  const roleId  = userDetail.data.result.roleId;
  const isRole20 = roleId === 20;

  /* ── activity tracking (mounted app-wide in AppLayout; read shared state) ── */
  const { isActive, workingMs } = useContext(ActivityContext);

  const { data } = useGetAllIssueTickets();

  const allTickets = useMemo(() => {
    const inner = (data?.data as { data?: unknown } | undefined)?.data;
    return resolveFlat(inner);
  }, [data]);

  const openUnassigned = useMemo(
    () => allTickets.filter(t => t.issueStatus === "OPEN" && !t.assignee).length,
    [allTickets]
  );

  const overdueCount = useMemo(
    () => allTickets.filter(t => {
      const isDone = t.issueStatus === "CLOSED" || t.issueStatus === "RESOLVED";
      if (isDone) return false;
      if (t.issueStatus === "OPEN" && !t.assignee) {
        return (Date.now() - new Date(t.createdAt).getTime()) > 4 * 3_600_000;
      }
      if (t.assignee) {
        const e = t.statusHistory?.find(h => h.status === "IN_PROGRESS");
        const ms = e?.changedAt
          ? (String(e.changedAt).length > 10 ? e.changedAt : e.changedAt * 1000)
          : (t.postTime ? (String(t.postTime).length > 10 ? t.postTime : t.postTime * 1000) : null);
        return !!ms && (Date.now() - ms) > 3_600_000;
      }
      return false;
    }).length,
    [allTickets]
  );

  /* desktop notification when new unassigned tickets arrive */
  const prevOpenRef = useRef(0);
  useEffect(() => {
    if (openUnassigned > prevOpenRef.current && prevOpenRef.current > 0) {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("New Issue Tickets", {
            body: `${openUnassigned} unassigned open ticket${openUnassigned !== 1 ? "s" : ""} waiting`,
          });
        } else if (Notification.permission === "default") {
          Notification.requestPermission();
        }
      }
    }
    prevOpenRef.current = openUnassigned;
  }, [openUnassigned]);

  const Badge = ({ n, color }: { n: number; color: string }) =>
    n > 0 ? (
      <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${color}`}>
        {n > 99 ? "99+" : n}
      </span>
    ) : null;

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
      <Tabs variant="soft-rounded" colorScheme="blue" display="flex" flexDirection="column" height="100%" overflow="hidden">
        <TabList px={3} pt={2} flexShrink={0} display="flex" alignItems="center">
          <Tab className="font-bold">Issue Dashboard</Tab>
          <Tab className="font-bold">
            Issue Tickets
            <Badge n={openUnassigned} color="bg-emerald-500 text-white" />
          </Tab>
          <Tab className="font-bold">All Issues</Tab>
          <Tab className="font-bold">Team Analytics</Tab>
          <Tab className="font-bold">
            Overdue
            <Badge n={overdueCount} color="bg-red-500 text-white" />
          </Tab>
          <Tab className="font-bold">Skipped Messages</Tab>
          {isRole20 && <Tab className="font-bold">Team Activity</Tab>}

          {/* ── Working time chip ── */}
          {isActive && (
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 ring-1 ring-emerald-300 text-emerald-700 text-xs font-semibold flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              Working: {fmtWorkingTime(workingMs)}
            </div>
          )}
        </TabList>

        <TabPanels flex={1} overflow="hidden">
          <TabPanel p={0} height="100%">
            <IssueLLMDashboard filterByUser={true} />
          </TabPanel>
          <TabPanel p={0} height="100%" width="100%">
            <IssueLLM />
          </TabPanel>
          <TabPanel p={0} height="100%">
            <IssueLLMDashboard filterByUser={false} />
          </TabPanel>
          <TabPanel p={0} height="100%">
            <TeamAnalyticsDashboard />
          </TabPanel>
          <TabPanel p={0} height="100%">
            <OverdueTicketsView />
          </TabPanel>
          <TabPanel p={0} height="100%" width="100%">
            <SkippedMessagesView />
          </TabPanel>
          {isRole20 && (
            <TabPanel p={0} height="100%">
              <MemberActivityView />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </div>
  );
}
