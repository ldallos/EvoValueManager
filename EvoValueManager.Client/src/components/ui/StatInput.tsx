import React from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/utils/cn.ts";
import StatIcon from "@/components/shared/StatIcon.tsx";
import { StatName } from "@/components/shared/stat-types.ts";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    statName: StatName;
    label: string;
    error?: FieldError;
};

const StatInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ statName, label, name, error, className, ...props }, ref) => (
        <div>
            <div
                className={cn(
                    "flex items-center gap-3 rounded-lg border bg-slate-800/50 p-3 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/50",
                    error ? "border-red-500" : "border-slate-700",
                    className
                )}
            >
                <StatIcon
                    stat={statName}
                    className="w-5 h-5 flex-shrink-0"
                />
                <label
                    htmlFor={name}
                    className="flex-grow text-sm font-medium text-slate-300"
                >
                    {label}
                </label>
                <input
                    id={name}
                    name={name}
                    ref={ref}
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-20 bg-transparent text-right text-lg font-semibold text-white focus:outline-none"
                    {...props}
                />
            </div>
            {error?.message && (
                <p className="mt-1 text-xs text-red-400">{error.message}</p>
            )}
        </div>
    )
);

export default StatInput;
