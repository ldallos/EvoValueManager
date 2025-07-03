import React from "react";
import { FieldError } from "react-hook-form";
import { cn } from "../../utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: FieldError;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, name, error, className, ...props }, ref) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-400">
                {label}
            </label>
            <div className="mt-1">
                <input
                    id={name}
                    name={name}
                    ref={ref}
                    className={cn(
                        `block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm
                        bg-slate-800 border-slate-600 text-white placeholder-slate-500
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`,
                        error && "border-red-500 text-red-400",
                        className
                    )}
                    {...props}
                />
            </div>
            {error?.message && <p className="mt-2 text-sm text-red-400">{error.message}</p>}
        </div>
    )
);

export default Input;