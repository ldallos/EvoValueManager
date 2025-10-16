import { memo, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Wrench, Swords } from "lucide-react";
import * as api from "../../api/api";
import { Character } from "@/interfaces/Character.ts";
import { Achievement } from "@/interfaces/Achievement.ts";
import Card from "./../ui/Card";
import StatDisplay from "../shared/StatDisplay";
import AvatarUploader from "./AvatarUploader.tsx";
import AchievementBadge from "../shared/AchievementBadge.tsx";
import { useCharacterData } from "@/hooks/useCharacterData.ts";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button.tsx";
import EquippedToolsPreview from "./EquippedToolsPreview.tsx";
import ActiveChallengesPreview from "./ActiveChallengesPreview.tsx";

interface CharacterDashboardProps {
    characterId: number;
    initialBaseCharacter: Character;
    onOpenToolModal: () => void;
    onOpenChallengeModal: () => void;
}

function CharacterDashboard({
    characterId,
    initialBaseCharacter,
    onOpenToolModal,
    onOpenChallengeModal,
}: CharacterDashboardProps) {
    const { effectiveCharacters, isLoading: isLoadingAllCharacters } =
        useCharacterData();

    const character = useMemo(() => {
        return (
            effectiveCharacters as (Character & {
                achievements?: Achievement[];
            })[]
        ).find((c) => c.id === characterId);
    }, [effectiveCharacters, characterId]);

    const baseCharacter = initialBaseCharacter;

    const { data: achievements = [], isLoading: isLoadingAchievements } =
        useQuery<Achievement[]>({
            queryKey: ["achievements", characterId],
            queryFn: () => api.getCharacterAchievements(characterId),
            enabled: !!characterId,
        });

    const isLoading = isLoadingAllCharacters || isLoadingAchievements;
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <Card className="p-10 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <Loader2 className="w-12 h-12 text-slate-500 mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-white">
                    {t("characterDashboard.loading")}
                </h3>
            </Card>
        );
    }

    if (!character || !baseCharacter) return null;

    return (
        <Card className="flex flex-col h-full">
            <div className="p-6 flex-grow space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="md:col-span-1 flex flex-col items-center text-center gap-4">
                        <AvatarUploader character={baseCharacter} />
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {character.name}
                            </h2>
                            <p className="text-indigo-300">
                                {character.title && t(character.title)}
                            </p>
                        </div>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 gap-6">
                        <StatDisplay
                            title={t("characterDashboard.effectiveStatsTitle")}
                            stats={character}
                        />
                        {achievements.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-slate-300 mb-3">
                                    {t("characterDashboard.achievementsTitle")}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {achievements.map((ach) => (
                                        <AchievementBadge
                                            key={ach.id}
                                            achievement={ach}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EquippedToolsPreview characterId={characterId} />
                    <ActiveChallengesPreview characterId={characterId} />
                </div>
            </div>

            <div className="border-t border-slate-700 p-4 flex justify-end gap-4 mt-auto">
                <Button onClick={onOpenToolModal}>
                    <Wrench className="w-4 h-4 mr-2" />
                    {t("tool.managementTitle")}
                </Button>
                <Button
                    variant="primary"
                    onClick={onOpenChallengeModal}
                >
                    <Swords className="w-4 h-4 mr-2" />
                    {t("characterDashboard.challengeManagementTitle")}
                </Button>
            </div>
        </Card>
    );
}

export default memo(CharacterDashboard);
