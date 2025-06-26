import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
    isLoading?: boolean;
    loadingText?: string;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "secondary",
            isLoading = false,
            loadingText = "Saving...",
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150";

        const variantStyles = {
            primary: "bg-evogreen text-white hover:bg-evogreen-dark focus:ring-evogreen",
            secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500",
            danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${isLoading ? "cursor-not-allowed opacity-75" : ""} ${className}`}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? loadingText : children}
            </button>
        );
    }
);

export default Button;
