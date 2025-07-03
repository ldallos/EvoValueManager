import { useMemo } from "react";
import { Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import { Character } from "../interfaces/Character";
import { Challenge } from "../interfaces/Challenge";
import { STAT_NAMES } from "./StatIcon";

interface ChallengeSuggestionsProps {
    character: Character;
    availableChallenges: Challenge[];
    onSelectSuggestion: (challengeId: number) => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ChallengeSuggestions({ character, availableChallenges, onSelectSuggestion }: ChallengeSuggestionsProps) {
    const suggestions = useMemo(() => {
        if (!character || availableChallenges.length === 0) {
            return [];
        }

        const sortedStats = STAT_NAMES.map(stat => ({ name: stat, value: character[stat] }))
            .sort((a, b) => a.value - b.value);

        const lowestStatNames = sortedStats.slice(0, 2).map(s => s.name);

        const relevantChallenges = availableChallenges.map(challenge => {
            const boostsLowStat = lowestStatNames.some(stat => (challenge[`gainable${capitalize(stat)}` as keyof Challenge] as number || 0) > 0);

            if (!boostsLowStat) {
                return null;
            }

            const canAttempt = STAT_NAMES.every(stat => {
                const required = challenge[`required${capitalize(stat)}` as keyof Challenge] as number || 0;
                return character[stat] >= required;
            });

            const boostedStat = lowestStatNames.find(stat => (challenge[`gainable${capitalize(stat)}` as keyof Challenge] as number || 0) > 0);

            return { ...challenge, canAttempt, boostsStat: boostedStat };
        })
            .filter(Boolean)
            .sort((a, b) => (b?.canAttempt ? 1 : 0) - (a?.canAttempt ? 1 : 0));

        return relevantChallenges.slice(0, 3);

    }, [character, availableChallenges]);

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="flex items-center gap-2 font-semibold text-white mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Suggested for {character.name}
            </h4>
            <div className="space-y-3">
                {suggestions.map(chal => chal && (
                    <button
                        key={chal.id}
                        onClick={() => onSelectSuggestion(chal.id)}
                        className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors flex justify-between items-center group focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <div>
                            <p className="font-medium text-white group-hover:text-indigo-300">{chal.title}</p>
                            <p className="text-xs text-slate-400">
                                Recommended for improving <span className="font-bold capitalize">{chal.boostsStat}</span>
                            </p>
                        </div>
                        {chal.canAttempt ? (
                            <div className="flex items-center gap-2 text-green-400">
                                <span className="text-xs hidden sm:block">Ready</span>
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-400">
                                <span className="text-xs hidden sm:block">Low Stats</span>
                                <XCircle className="w-5 h-5 flex-shrink-0" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}