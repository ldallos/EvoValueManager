import { cn } from "@/utils/cn.ts";
import StatIcon from "@/components/shared/StatIcon.tsx";
import { STAT_NAMES } from "@/components/shared/stat-types.ts";
import { useTranslation } from "react-i18next";
import { Character } from "@/interfaces/Character.ts";
import { Challenge } from "@/interfaces/Challenge.ts";

type CharacterStats = Omit<Character, "id" | "name">;
type ChallengeStats = Partial<
    Pick<
        Challenge,
        | "requiredBravery"
        | "requiredTrust"
        | "requiredPresence"
        | "requiredGrowth"
        | "requiredCare"
    >
>;

interface StatDisplayProps {
    title: string;
    stats: CharacterStats;
    requirements?: ChallengeStats;
    isCompact?: boolean;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function StatDisplay({
    title,
    stats,
    requirements,
    isCompact = false,
}: StatDisplayProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 h-full">
            <h3
                className={`font-semibold text-slate-300 mb-3 ${isCompact ? "text-base" : "text-lg"}`}
            >
                {title}
            </h3>
            <div className="space-y-2">
                {STAT_NAMES.map((statName) => {
                    const reqKey =
                        `required${capitalize(statName)}` as keyof ChallengeStats;
                    const requiredValue = requirements
                        ? requirements[reqKey]
                        : undefined;
                    const hasRequirement =
                        requiredValue !== undefined &&
                        requiredValue !== null &&
                        requiredValue > 0;
                    const currentValue = stats[statName];
                    const isSufficient =
                        hasRequirement && currentValue >= requiredValue;

                    return (
                        <div
                            key={statName}
                            className={cn(
                                "p-2 rounded-lg flex items-center justify-between text-sm transition-all",
                                hasRequirement
                                    ? isSufficient
                                        ? "bg-green-800/50"
                                        : "bg-red-800/50"
                                    : "bg-slate-700/50"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <StatIcon stat={statName} />
                                <span className="capitalize text-slate-400">
                                    {t(statName)}
                                </span>
                            </div>
                            <span className="font-bold text-slate-100">
                                {currentValue}
                                {hasRequirement && ` / ${requiredValue}`}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default StatDisplay;
