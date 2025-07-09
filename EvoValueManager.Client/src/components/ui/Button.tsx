import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn.ts";
import { Link, type LinkProps } from "react-router-dom";

type ButtonOwnProps = {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    isLoading?: boolean;
    loadingText?: string;
};

type ButtonProps = ButtonOwnProps &
    (
        | ({ to: LinkProps["to"] } & Omit<LinkProps, "to">)
        | ({ to?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
    );

const Button = React.forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    ButtonProps
>(
    (
        {
            variant = "secondary",
            isLoading = false,
            loadingText = "Saving...",
            className,
            children,
            to,
            ...rest
        },
        ref
    ) => {
        const baseStyles =
            "inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

        const variantStyles = {
            primary:
                "bg-indigo-600 text-white border-transparent hover:bg-indigo-700 focus:ring-indigo-500",
            secondary:
                "bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600 focus:ring-indigo-500",
            danger: "bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500",
            ghost: "bg-transparent text-slate-300 border-transparent hover:bg-slate-700",
        };

        const combinedClassName = cn(
            baseStyles,
            variantStyles[variant],
            className
        );

        if (to) {
            return (
                <Link
                    ref={ref as React.ForwardedRef<HTMLAnchorElement>}
                    to={to}
                    className={cn(combinedClassName, {
                        "pointer-events-none": isLoading,
                    })}
                    {...(rest as Omit<LinkProps, "to">)}
                >
                    {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? loadingText : children}
                </Link>
            );
        }

        return (
            <button
                ref={ref as React.ForwardedRef<HTMLButtonElement>}
                className={combinedClassName}
                disabled={
                    isLoading ||
                    (rest as React.ButtonHTMLAttributes<HTMLButtonElement>)
                        .disabled
                }
                {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? loadingText : children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
