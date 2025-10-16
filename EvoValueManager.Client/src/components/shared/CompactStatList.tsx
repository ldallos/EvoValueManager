import StatIcon from "@/components/shared/StatIcon.tsx";
import { STAT_NAMES, StatName } from "@/components/shared/stat-types.ts";
import React from "react";

interface CompactStatListProps {
    stats: Record<StatName, number | null | undefined>;
    type: "requirement" | "gain";
}

const Tooltip = ({
    content,
    children,
}: {
    content: string;
    children: React.ReactNode;
}) => (
    <div className="relative group">
        {children}
        <div className="absolute bottom-full mb-2 w-max px-2 py-1 text-xs bg-slate-900 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-slate-700 capitalize">
            {content}
        </div>
    </div>
);

export default function CompactStatList({ stats, type }: CompactStatListProps) {
    const relevantStats = STAT_NAMES.map((stat) => ({
        name: stat,
        value: stats[stat],
    })).filter((stat) => stat.value && stat.value > 0);

    if (relevantStats.length === 0) {
        return <span className="text-slate-500">—</span>;
    }

    const colorClass = type === "gain" ? "text-green-400" : "text-slate-300";
    const sign = type === "gain" ? "+" : "";

    return (
        <div className="flex items-center gap-3">
            {relevantStats.map(({ name, value }) => (
                <Tooltip
                    key={name}
                    content={`${name}: ${sign}${value}`}
                >
                    <div
                        className={`flex items-center gap-1 font-mono text-sm ${colorClass}`}
                    >
                        <StatIcon
                            stat={name}
                            className="w-4 h-4"
                        />
                        <span>{value}</span>
                    </div>
                </Tooltip>
            ))}
        </div>
    );
}
