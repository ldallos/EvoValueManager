import { cn } from "../utils/cn";
import StatIcon, { STAT_NAMES } from "./StatIcon";
import { useTranslation } from "react-i18next";
import { Character } from "../interfaces/Character";
import { Challenge } from "../interfaces/Challenge";

type CharacterStats = Omit<Character, "id" | "name">;
type ChallengeStats = Partial<
    Pick<
        Challenge,
        "requiredBravery" | "requiredTrust" | "requiredPresence" | "requiredGrowth" | "requiredCare"
    >
>;

interface StatDisplayProps {
    title: string;
    stats: CharacterStats;
    requirements?: ChallengeStats;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function StatDisplay({ title, stats, requirements }: StatDisplayProps) {
    const { t } = useTranslation();

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-3">{title}</h3>
            <div className="space-y-2">
                {STAT_NAMES.map((statName) => {
                    const reqKey = `required${capitalize(statName)}` as keyof ChallengeStats;
                    const requiredValue = requirements ? requirements[reqKey] : undefined;
                    const hasRequirement =
                        requiredValue !== undefined && requiredValue !== null && requiredValue > 0;
                    const currentValue = stats[statName];
                    const isSufficient = hasRequirement && currentValue >= requiredValue;

                    return (
                        <div
                            key={statName}
                            className={cn(
                                "p-2 rounded-lg flex items-center justify-between text-sm transition-all",
                                hasRequirement
                                    ? isSufficient
                                        ? "bg-green-800/50 ring-1 ring-green-600/50"
                                        : "bg-red-800/50 ring-1 ring-red-600/50"
                                    : "bg-slate-700/50"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <StatIcon stat={statName} />
                                <span className="capitalize text-slate-400">{t(statName)}</span>
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
