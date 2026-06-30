import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
    "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899",
    "#14b8a6", "#6366f1", "#f97316", "#10b981",
    "#ef4444", "#84cc16",
];

interface DistEntry {
    name: string;
    count: number;
}

interface Props {
    distribution: DistEntry[];
    title?: string;
}

const DeviceTypeDistribution = ({ distribution, title = "Device Type Distribution" }: Props) => {
    const total = distribution.reduce((s, d) => s + d.count, 0);
    if (total === 0) return null;

    const sorted = [...distribution].sort((a, b) => b.count - a.count);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">{title}</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* donut */}
                <div className="w-40 h-40 flex-shrink-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={sorted} dataKey="count" nameKey="name" cx="50%" cy="50%"
                                innerRadius={45} outerRadius={70} paddingAngle={2}>
                                {sorted.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(v: any, n: any) => [`${v} (${Math.round((v / total) * 100)}%)`, n]} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-gray-800">{total}</span>
                        <span className="text-[10px] text-gray-400 font-medium">devices</span>
                    </div>
                </div>

                {/* legend */}
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1.5 w-full">
                    {sorted.map((d, i) => {
                        const pct = Math.round((d.count / total) * 100);
                        return (
                            <div key={d.name} className="flex items-center gap-2 text-xs">
                                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                                <span className="text-gray-600 truncate flex-1">{d.name}</span>
                                <span className="font-bold text-gray-800">{d.count}</span>
                                <span className="text-gray-400 w-9 text-right">{pct}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DeviceTypeDistribution;
