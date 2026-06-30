import { useState } from "react";
import { IssueTicketInterface } from "../interfaces/IssueTicketInterface";

interface GroupSidebarProps {
  groupedTickets: Record<string, IssueTicketInterface[]>;
  selectedGroup: string | null;
  onSelect: (groupName: string) => void;
}

const formatTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return "";
  }
};

const GroupSidebar = ({ groupedTickets, selectedGroup, onSelect }: GroupSidebarProps) => {
  const [search, setSearch] = useState("");

  const sortedGroups = Object.keys(groupedTickets)
    .sort((a, b) => {
      const openA = groupedTickets[a].filter(t => t.issueStatus === "OPEN").length;
      const openB = groupedTickets[b].filter(t => t.issueStatus === "OPEN").length;
      if (openB !== openA) return openB - openA;
      const latestA = Math.max(...groupedTickets[a].map(t => new Date(t.createdAt).getTime()));
      const latestB = Math.max(...groupedTickets[b].map(t => new Date(t.createdAt).getTime()));
      return latestB - latestA;
    })
    .filter(g => g.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200" style={{ width: "300px", minWidth: "260px" }}>

      {/* ── Header ── */}
      <div className="bg-[#075E54] px-4 py-3 flex-shrink-0">
        <h1 className="text-white font-bold text-[15px] tracking-wide">Primesys Team</h1>
        <p className="text-emerald-300 text-[11px] mt-0.5">{Object.keys(groupedTickets).length} groups</p>
      </div>

      {/* ── Search ── */}
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center bg-white rounded-lg px-3 py-1.5 gap-2 border border-gray-200">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search groups…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-xs outline-none text-gray-700 bg-transparent placeholder-gray-400"
          />
        </div>
      </div>

      {/* ── Group list ── */}
      <div className="flex-1 overflow-y-auto">
        {sortedGroups.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-xs">No groups found</div>
        ) : (
          sortedGroups.map(groupName => {
            const tickets  = groupedTickets[groupName];
            const latest   = tickets.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b);
            const initial  = groupName.charAt(0).toUpperCase();
            const openCount = tickets.filter(t => t.issueStatus === "OPEN").length;
            const isSelected = selectedGroup === groupName;

            return (
              <div
                key={groupName}
                onClick={() => onSelect(groupName)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b border-gray-100 transition-colors relative ${
                  isSelected
                    ? "bg-emerald-50 border-l-[3px] border-l-[#075E54]"
                    : "hover:bg-gray-50 border-l-[3px] border-l-transparent"
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white font-bold text-sm">{initial}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-sm truncate font-semibold ${isSelected ? "text-[#075E54]" : "text-gray-800"}`}>
                      {groupName}
                    </span>
                    <span className="text-[11px] text-gray-400 flex-shrink-0 tabular-nums">
                      {formatTime(latest.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5 gap-1">
                    <p className="text-xs text-gray-500 truncate flex-1 leading-snug">
                      {latest.message || latest.summary || ""}
                    </p>
                    {openCount > 0 && (
                      <span className="bg-emerald-500 text-white text-[11px] rounded-full px-1.5 py-0.5 flex-shrink-0 font-bold min-w-[20px] text-center">
                        {openCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GroupSidebar;


