import { CheckSquare, Inbox } from "lucide-react";
import { Challenge } from "@/interfaces/Challenge.ts";
import ChallengeSelector from "./ChallengeSelector";
import { useTranslation } from "react-i18next";

interface AssignedChallengesProps {
    challenges: Challenge[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    isProcessing: boolean;
}

export default function AssignedChallenges({
    challenges,
    selectedId,
    onSelect,
    isProcessing,
}: AssignedChallengesProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-slate-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckSquare className="text-green-400 w-5 h-5" />
                {t("challenge.assignedTitle")}
            </h3>
            {challenges.length > 0 ? (
                <ChallengeSelector
                    challenges={challenges}
                    selectedId={selectedId}
                    onChange={(e) => onSelect(Number(e.target.value))}
                    label={t("challenge.selectToManageLabel")}
                    disabled={isProcessing}
                />
            ) : (
                <div className="text-center py-6 border-2 border-dashed border-slate-700 rounded-lg">
                    <Inbox className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                    <p className="text-slate-400 font-medium">
                        {t("challenge.noAssigned")}
                    </p>
                </div>
            )}
        </div>
    );
}
