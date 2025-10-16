import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Mkcert from "vite-plugin-mkcert";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), Mkcert(), tailwindcss()],
    server: {
        port: 7090,
        proxy: {
            "/api": {
                target: "http://localhost:5163",
                changeOrigin: true,
                secure: false,
            },
        },
    },

    build: {
        outDir: "dist",
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("recharts")) {
                            return "vendor-recharts";
                        }
                        if (id.includes("@tanstack/react-query")) {
                            return "vendor-tanstack-query";
                        }
                        if (
                            id.includes("react-router-dom") ||
                            id.includes("react-router")
                        ) {
                            return "vendor-react-router";
                        }
                        if (id.includes("react") || id.includes("react-dom")) {
                            return "vendor-react";
                        }

                        return "vendor";
                    }
                },
            },
        },
    },

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
