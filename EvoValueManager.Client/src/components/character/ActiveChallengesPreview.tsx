import { useQuery } from "@tanstack/react-query";
import * as api from "@/api/api";
import { Loader2, Swords } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ActiveChallengesPreviewProps {
    characterId: number;
}

export default function ActiveChallengesPreview({
    characterId,
}: ActiveChallengesPreviewProps) {
    const { t } = useTranslation();
    const { data: challenges = [], isLoading } = useQuery({
        queryKey: ["assignedChallenges", characterId],
        queryFn: () => api.getAssignedChallengesForCharacter(characterId),
    });

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-3">
                {t("challenge.assignedTitle")}
            </h3>
            {isLoading ? (
                <div className="flex items-center text-slate-400">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>{t("challenge.loading")}</span>
                </div>
            ) : challenges.length > 0 ? (
                <ul className="space-y-2">
                    {challenges.map((challenge) => (
                        <li
                            key={challenge.id}
                            className="flex items-center gap-3 bg-slate-700/50 p-2 rounded-md border border-slate-600/50"
                        >
                            <Swords className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm font-medium text-slate-200">
                                {t(challenge.title)}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-slate-500 italic">
                    {t("challenge.noAssigned")}
                </p>
            )}
        </div>
    );
}
