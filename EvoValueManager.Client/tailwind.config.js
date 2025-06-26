/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                evogreen: "#619621",
                "evogreen-dark": "#517a1a",
                slate: {
                    900: "#0f172a",
                    800: "#1e293b",
                    700: "#334155",
                    600: "#475569",
                },
                indigo: {
                    600: "#4f46e5",
                    500: "#6366f1",
                },
            },
            keyframes: {
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "fade-in-up": "fade-in-up 0.3s ease-out forwards",
            },
        },
    },
    plugins: [],
};
