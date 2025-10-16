import { useMemo } from "react";
import { Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import { Character } from "@/interfaces/Character.ts";
import { Challenge } from "@/interfaces/Challenge.ts";
import { STAT_NAMES } from "@/components/shared/stat-types.ts";
import { useTranslation } from "react-i18next";

interface ChallengeSuggestionsProps {
    character: Character;
    availableChallenges: Challenge[];
    onSelectSuggestion: (challengeId: number) => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ChallengeSuggestions({
    character,
    availableChallenges,
    onSelectSuggestion,
}: ChallengeSuggestionsProps) {
    const { t } = useTranslation();

    const suggestions = useMemo(() => {
        if (!character || availableChallenges.length === 0) {
            return [];
        }

        const sortedStats = STAT_NAMES.map((stat) => ({
            name: stat,
            value: character[stat],
        })).sort((a, b) => a.value - b.value);

        const lowestStatNames = sortedStats.slice(0, 2).map((s) => s.name);

        const relevantChallenges = availableChallenges
            .map((challenge) => {
                const boostsLowStat = lowestStatNames.some(
                    (stat) =>
                        ((challenge[
                            `gainable${capitalize(stat)}` as keyof Challenge
                        ] as number) || 0) > 0
                );

                if (!boostsLowStat) {
                    return null;
                }

                const canAttempt = STAT_NAMES.every((stat) => {
                    const required =
                        (challenge[
                            `required${capitalize(stat)}` as keyof Challenge
                        ] as number) || 0;
                    return character[stat] >= required;
                });

                const boostedStat = lowestStatNames.find(
                    (stat) =>
                        ((challenge[
                            `gainable${capitalize(stat)}` as keyof Challenge
                        ] as number) || 0) > 0
                );

                return {
                    ...challenge,
                    canAttempt,
                    boostedStat,
                };
            })
            .filter(Boolean)
            .sort((a, b) => (b?.canAttempt ? 1 : 0) - (a?.canAttempt ? 1 : 0));

        return relevantChallenges.slice(0, 3);
    }, [character, availableChallenges]);

    if (suggestions.length === 0) {
        return (
            <div className="text-center py-10 px-4 bg-slate-800/50 rounded-lg">
                <Lightbulb className="w-10 h-10 mx-auto text-slate-500 mb-3" />
                <h4 className="font-semibold text-white">
                    {t("suggestions.noSuggestionsTitle")}
                </h4>
                <p className="text-sm text-slate-400">
                    {t("suggestions.noSuggestionsDescription")}
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="flex items-center gap-2 font-semibold text-white mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                {t("suggestions.title", { characterName: character.name })}
            </h4>
            <div className="space-y-2">
                {suggestions.map(
                    (chal) =>
                        chal && (
                            <button
                                key={chal.id}
                                onClick={() => onSelectSuggestion(chal.id)}
                                className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600/80 rounded-lg transition-colors flex justify-between items-center group focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent hover:border-indigo-500/50"
                            >
                                <div>
                                    <p className="font-medium text-white group-hover:text-indigo-300">
                                        {t(chal.title)}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {t("suggestions.boosts")}{" "}
                                        <span className="font-bold capitalize">
                                            {chal.boostedStat
                                                ? Array.isArray(
                                                      chal.boostedStat
                                                  )
                                                    ? chal.boostedStat
                                                          .map((stat) =>
                                                              t(stat)
                                                          )
                                                          .join(", ")
                                                    : t(chal.boostedStat)
                                                : ""}
                                        </span>
                                    </p>
                                </div>
                                {chal.canAttempt ? (
                                    <div className="flex items-center gap-2 text-green-400">
                                        <span className="text-xs hidden sm:block font-medium">
                                            {t("suggestions.ready")}
                                        </span>
                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-400">
                                        <span className="text-xs hidden sm:block font-medium">
                                            {t("suggestions.lowStats")}
                                        </span>
                                        <XCircle className="w-5 h-5 flex-shrink-0" />
                                    </div>
                                )}
                            </button>
                        )
                )}
            </div>
        </div>
    );
}
