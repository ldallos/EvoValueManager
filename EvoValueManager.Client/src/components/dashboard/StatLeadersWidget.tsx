import { useMemo } from "react";
import { Character } from "@/interfaces/Character.ts";
import Card from "./../ui/Card";
import StatIcon from "@/components/shared/StatIcon.tsx";
import { STAT_NAMES, StatName } from "@/components/shared/stat-types.ts";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StatLeadersWidgetProps {
    characters: Character[];
    isLoading: boolean;
}

const findLeader = (
    characters: Character[],
    stat: StatName
): Character | null => {
    if (characters.length === 0) return null;
    return characters.reduce((leader, current) => {
        return current[stat] > leader[stat] ? current : leader;
    });
};

type StatLeaders = Record<StatName, Character | null>;

export default function StatLeadersWidget({
    characters,
    isLoading,
}: StatLeadersWidgetProps) {
    const { t } = useTranslation();

    const leaders = useMemo(() => {
        if (isLoading || characters.length === 0) {
            const emptyLeaders: StatLeaders = {
                bravery: null,
                trust: null,
                presence: null,
                growth: null,
                care: null,
            };
            return emptyLeaders;
        }

        return STAT_NAMES.reduce((acc: StatLeaders, stat) => {
            acc[stat] = findLeader(characters, stat);
            return acc;
        }, {} as StatLeaders);
    }, [characters, isLoading]);

    return (
        <Card className="p-6">
            <h3 className="font-semibold text-white mb-4">
                {t("leaders.title")}
            </h3>
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : characters.length > 0 ? (
                <ul className="space-y-4">
                    {STAT_NAMES.map((stat) => {
                        const leader = leaders[stat];
                        return (
                            <li
                                key={stat}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <StatIcon
                                        stat={stat}
                                        className="w-5 h-5"
                                    />
                                    <span className="capitalize font-medium text-slate-300">
                                        {t(stat)}
                                    </span>
                                </div>
                                {leader ? (
                                    <div className="text-right">
                                        <p className="font-semibold text-white">
                                            {leader.name}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            {t("leaders.scoreLabel")}:{" "}
                                            {leader[stat]}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        {t("common.notAvailable")}
                                    </p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-sm text-slate-400 text-center py-10">
                    {t("leaders.noData")}
                </p>
            )}
        </Card>
    );
}
