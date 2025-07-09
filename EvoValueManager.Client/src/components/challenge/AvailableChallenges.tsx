import { CheckSquare, Inbox } from "lucide-react";
import { Challenge } from "@/interfaces/Challenge.ts";
import { Character } from "@/interfaces/Character.ts";
import ChallengeSelector from "./ChallengeSelector";
import ChallengeSuggestions from "./ChallengeSuggestions";
import { useTranslation } from "react-i18next";

interface AvailableChallengesProps {
    character: Character;
    challenges: Challenge[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    isProcessing: boolean;
}

export default function AvailableChallenges({
    character,
    challenges,
    selectedId,
    onSelect,
    isProcessing,
}: AvailableChallengesProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-slate-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckSquare className="text-indigo-400 w-5 h-5" />
                {t("challenge.availableTitle")}
            </h3>
            {challenges.length > 0 ? (
                <>
                    <ChallengeSelector
                        challenges={challenges}
                        selectedId={selectedId}
                        onChange={(e) => onSelect(Number(e.target.value))}
                        label={t("challenge.selectToAssignLabel")}
                        disabled={isProcessing}
                    />
                    {!selectedId && (
                        <div className="mt-4">
                            <ChallengeSuggestions
                                character={character}
                                availableChallenges={challenges}
                                onSelectSuggestion={onSelect}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-6 border-2 border-dashed border-slate-700 rounded-lg">
                    <Inbox className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                    <p className="text-slate-400 font-medium">
                        {t("challenge.noAvailable")}
                    </p>
                </div>
            )}
        </div>
    );
}
