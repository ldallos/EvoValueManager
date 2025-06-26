import React from "react";
import { FieldError } from "react-hook-form";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    error?: FieldError;
    children: React.ReactNode;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, name, error, children, ...props }, ref) => (
        <div className="w-full sm:max-w-xs">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1">
                <select
                    id={name}
                    name={name}
                    ref={ref}
                    className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-evogreen focus:border-evogreen sm:text-sm rounded-md ${
                        error ? "border-red-500" : "border-gray-300"
                    }`}
                    {...props}
                >
                    {children}
                </select>
            </div>
            {error?.message && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
        </div>
    )
);

export default Select;
