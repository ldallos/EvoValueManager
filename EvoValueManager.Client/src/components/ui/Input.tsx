import React from "react";
import { FieldError } from "react-hook-form";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: FieldError;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, name, error, ...props }, ref) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1">
                <input
                    id={name}
                    name={name}
                    ref={ref}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-evogreen focus:border-evogreen sm:text-sm ${
                        error
                            ? "border-red-500 text-red-900 placeholder-red-300"
                            : "border-gray-300"
                    }`}
                    {...props}
                />
            </div>
            {error?.message && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
        </div>
    )
);

export default Input;
