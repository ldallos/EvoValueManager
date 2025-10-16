import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { SortConfig } from "@/hooks/useSort";
import React from "react";
import { cn } from "@/utils/cn";

interface SortableHeaderProps<T> {
    icon?: React.ReactNode;
    label: string;
    sortKey: keyof T;
    sortConfig: SortConfig<T>;
    requestSort: (key: keyof T) => void;
    className?: string;
    align?: "left" | "center";
}

export default function SortableHeader<T>({
    icon,
    label,
    sortKey,
    sortConfig,
    requestSort,
    className = "",
    align = "left",
}: SortableHeaderProps<T>) {
    const isSorted = sortConfig?.key === sortKey;
    const isAscending = sortConfig?.direction === "ascending";

    const Icon = isSorted ? (isAscending ? ArrowUp : ArrowDown) : ArrowUpDown;

    return (
        <th
            scope="col"
            className={`px-6 py-3 ${className}`}
        >
            <button
                onClick={() => requestSort(sortKey)}
                className={cn(
                    "flex items-center gap-2 hover:text-white transition-colors",
                    align === "center" && "mx-auto"
                )}
            >
                {icon && <span className="flex-shrink-0">{icon}</span>}
                <span>{label}</span>
                <Icon
                    className={`w-4 h-4 ${isSorted ? "text-indigo-400" : "text-slate-500"}`}
                />
            </button>
        </th>
    );
}
