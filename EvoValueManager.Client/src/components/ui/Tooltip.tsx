import React from "react";

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export default function Tooltip({
    content,
    children,
    className,
}: TooltipProps) {
    return (
        <div className={`relative flex items-center group z-10 ${className}`}>
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-sm bg-slate-900 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 border border-slate-700">
                {content}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
            </div>
        </div>
    );
}
