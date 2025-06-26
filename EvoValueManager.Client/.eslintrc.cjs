module.exports = {
    root: true,
    env: { browser: true, es2021: true },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs", "node_modules"],
    parser: "@typescript-eslint/parser",
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        "react/prop-types": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
    },
    overrides: [
        {
            files: ["src/**/*.ts", "src/**/*.tsx"],
            extends: ["plugin:@typescript-eslint/recommended-type-checked"],
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: ["./tsconfig.app.json"],
                tsconfigRootDir: __dirname,
            },
        },
        {
            files: ["vite.config.ts", "tailwind.config.js", "postcss.config.js"],
            extends: ["plugin:@typescript-eslint/recommended-type-checked"],
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: ["./tsconfig.node.json"],
                tsconfigRootDir: __dirname,
            },
        },
    ],
};
