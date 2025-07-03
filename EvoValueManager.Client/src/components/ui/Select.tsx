import React from "react";
import { FieldError } from "react-hook-form";
import { cn } from "../../utils/cn";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    error?: FieldError;
    children: React.ReactNode;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, name, error, children, className, ...props }, ref) => (
        <div className="w-full">
            <label htmlFor={name} className="block text-sm font-medium text-slate-400">
                {label}
            </label>
            <div className="mt-1">
                <select
                    id={name}
                    name={name}
                    ref={ref}
                    className={cn(
                        `block w-full pl-3 pr-10 py-2 text-base rounded-md focus:outline-none sm:text-sm
                        bg-slate-800 border-slate-600 text-white
                        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`,
                        error ? "border-red-500" : "border-gray-300",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
            </div>
            {error?.message && <p className="mt-2 text-sm text-red-400">{error.message}</p>}
        </div>
    )
);

export default Select;