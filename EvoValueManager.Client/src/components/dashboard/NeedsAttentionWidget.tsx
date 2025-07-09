import { Link } from "react-router-dom";
import { Loader2, TrendingUp, AlertOctagon } from "lucide-react";
import { Character } from "@/interfaces/Character.ts";
import Card from "@/components/ui/Card.tsx";
import StatIcon from "@/components/shared/StatIcon.tsx";
import { STAT_NAMES, StatName } from "@/components/shared/stat-types.ts";
import { useTranslation } from "react-i18next";
import Tooltip from "../ui/Tooltip.tsx";

interface NeedsAttentionWidgetProps {
    characters: Character[];
    isLoading: boolean;
}

const ATTENTION_THRESHOLD = 15;

const getLowStats = (character: Character): StatName[] => {
    return STAT_NAMES.filter((stat) => character[stat] < ATTENTION_THRESHOLD);
};

export default function NeedsAttentionWidget({
    characters,
    isLoading,
}: NeedsAttentionWidgetProps) {
    const { t } = useTranslation();

    const attentionNeeded = characters
        .map((char) => ({
            ...char,
            lowStats: getLowStats(char),
        }))
        .filter((char) => char.lowStats.length > 0)
        .slice(0, 5);

    return (
        <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-amber-400" />
                    {t("attention.title")}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                    {t("attention.thresholdLabel")} {"<"} {ATTENTION_THRESHOLD}
                </span>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
            ) : attentionNeeded.length > 0 ? (
                <ul className="space-y-3">
                    {attentionNeeded.map((char) => (
                        <li
                            key={char.id}
                            className="bg-slate-700/50 p-3 rounded-lg transition-all hover:bg-slate-700/80 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-slate-200">
                                    {char.name}
                                </p>
                                <Link
                                    to={`/team?characterId=${char.id}`}
                                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                                >
                                    {t("attention.viewProfileLink")}
                                </Link>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-slate-400">
                                    {t("attention.lowValuesLabel")}
                                </span>
                                <div className="flex items-center gap-2">
                                    {char.lowStats.map((stat) => (
                                        <Tooltip
                                            key={stat}
                                            content={t(stat)}
                                        >
                                            <div className="flex items-center gap-1 text-amber-300 cursor-help">
                                                <StatIcon
                                                    stat={stat}
                                                    className="w-4 h-4"
                                                />
                                                <span className="font-mono text-sm">
                                                    {char[stat]}
                                                </span>
                                            </div>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-10 px-4 bg-slate-800/50 rounded-lg">
                    <TrendingUp className="w-10 h-10 mx-auto text-green-500 mb-3" />
                    <h4 className="font-semibold text-white">
                        {t("attention.allGoodTitle")}
                    </h4>
                    <p className="text-sm text-slate-400">
                        {t("attention.allGoodDescription")}
                    </p>
                </div>
            )}
        </Card>
    );
}
