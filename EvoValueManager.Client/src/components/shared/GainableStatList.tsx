import { Challenge } from "@/interfaces/Challenge.ts";
import StatIcon from "@/components/shared/StatIcon.tsx";
import { STAT_NAMES, StatName } from "@/components/shared/stat-types.ts";
import { useTranslation } from "react-i18next";

interface GainableStatListProps {
    title: string;
    challenge: Challenge;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function GainableStatList({
    title,
    challenge,
}: GainableStatListProps) {
    const { t } = useTranslation();

    const gainableStats = STAT_NAMES.map((statName) => {
        const gainKey = `gainable${capitalize(statName)}` as keyof Challenge;
        const value = challenge[gainKey] as number | null | undefined;
        return { name: statName, value: value || 0 };
    }).filter((stat) => stat.value > 0);

    if (gainableStats.length === 0) {
        return (
            <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-3">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 italic">
                    {t("challenge.noStatsGainable")}
                </p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-3">
                {title}
            </h3>
            <div className="space-y-2">
                {gainableStats.map(({ name, value }) => (
                    <div
                        key={name}
                        className="bg-slate-700/50 p-2 rounded-lg flex items-center justify-between text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <StatIcon stat={name as StatName} />
                            <span className="capitalize text-slate-400">
                                {t(name)}
                            </span>
                        </div>
                        <span className="font-bold text-green-400">
                            +{value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
