import React from "react";
import { cn } from "../../utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
);

export default Card;
