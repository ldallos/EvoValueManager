import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const queryClient = useQueryClient();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);

        queryClient.invalidateQueries();
    };

    const currentLanguage = i18n.language.split("-")[0];

    return (
        <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-slate-400" />
            <button
                onClick={() => changeLanguage("en")}
                className={`px-2 py-1 text-sm font-medium rounded ${
                    currentLanguage === "en"
                        ? "text-white bg-indigo-600"
                        : "text-slate-300 hover:bg-slate-700"
                }`}
            >
                EN
            </button>
            <button
                onClick={() => changeLanguage("hu")}
                className={`px-2 py-1 text-sm font-medium rounded ${
                    currentLanguage === "hu"
                        ? "text-white bg-indigo-600"
                        : "text-slate-300 hover:bg-slate-700"
                }`}
            >
                HU
            </button>
        </div>
    );
}
