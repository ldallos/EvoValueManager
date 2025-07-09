import { useQuery } from "@tanstack/react-query";
import * as api from "@/api/api";
import { Loader2, Wrench } from "lucide-react";
import Tooltip from "@/components/ui/Tooltip.tsx";
import { useTranslation } from "react-i18next";
import { STAT_NAMES } from "@/components/shared/stat-types";
import { Tool } from "@/interfaces/Tool";

interface EquippedToolsPreviewProps {
    characterId: number;
}

const BonusDisplay = ({ tool }: { tool: Tool }) => {
    const { t } = useTranslation();
    const bonuses = STAT_NAMES.map((stat) => ({
        name: stat,
        value: tool[`${stat}Bonus` as keyof Tool] as number | undefined,
    })).filter((b) => b.value && b.value > 0);

    if (bonuses.length === 0) return null;

    return (
        <ul className="text-xs list-disc list-inside">
            {bonuses.map((bonus) => (
                <li key={bonus.name}>
                    {t(bonus.name)}: +{bonus.value}
                </li>
            ))}
        </ul>
    );
};

export default function EquippedToolsPreview({
    characterId,
}: EquippedToolsPreviewProps) {
    const { t } = useTranslation();
    const { data: tools = [], isLoading } = useQuery({
        queryKey: ["assignedTools", characterId],
        queryFn: () => api.getAssignedToolsForCharacter(characterId),
    });

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-3">
                {t("tool.equippedTitle")}
            </h3>
            {isLoading ? (
                <div className="flex items-center text-slate-400">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>{t("tool.loading")}</span>
                </div>
            ) : tools.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {tools.map((tool) => (
                        <Tooltip
                            key={tool.id}
                            content={
                                <div className="text-left">
                                    <p className="font-bold mb-1">
                                        {t(tool.name)}
                                    </p>
                                    <p className="text-xs text-slate-300 mb-2 max-w-xs">
                                        {t(tool.description || "")}
                                    </p>
                                    <BonusDisplay tool={tool} />
                                </div>
                            }
                        >
                            <div className="flex items-center gap-2 bg-slate-700/50 p-2 rounded-md border border-slate-600/50 cursor-default">
                                <Wrench className="w-4 h-4 text-sky-400" />
                                <span className="text-sm font-medium text-slate-200">
                                    {t(tool.name)}
                                </span>
                            </div>
                        </Tooltip>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-slate-500 italic">
                    {t("common.none")}
                </p>
            )}
        </div>
    );
}
