import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";
import "./i18n";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <Toaster
                position="top-right"
                toastOptions={{
                    className: "font-medium",
                    success: {
                        style: {
                            border: "1px solid #619621",
                            color: "#1e40af",
                        },
                    },
                    error: {
                        style: {
                            border: "1px solid #dc2626",
                            color: "#991b1b",
                        },
                    },
                }}
            />
        </QueryClientProvider>
    </StrictMode>
);
