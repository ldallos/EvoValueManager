import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: React.ElementType;
    variant?: "primary" | "secondary" | "danger" | "ghost";
    isLoading?: boolean;
    loadingText?: string;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            as: Component = 'button',
            variant = "secondary",
            isLoading = false,
            loadingText = "Saving...",
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            "inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

        const variantStyles = {
            primary: "bg-indigo-600 text-white border-transparent hover:bg-indigo-700 focus:ring-indigo-500",
            secondary: "bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600 focus:ring-indigo-500",
            danger: "bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500",
            ghost: "bg-transparent text-slate-300 border-transparent hover:bg-slate-700",
        };
        
        return (
            <Component
                ref={ref}
                className={cn(baseStyles, variantStyles[variant], className)}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? loadingText : children}
            </Component>
        );
    }
);

export default Button;