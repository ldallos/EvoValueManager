import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import * as api from "../api/api";
import { Character } from "../interfaces/Character";
import { Tool } from "../interfaces/Tool";
import { Achievement } from "../interfaces/Achievement.ts";
import Card from "./ui/Card";
import StatDisplay from "./StatDisplay";
import ToolManagement from "./ToolManagement";
import ManagementDashboard from "./ManagementDashboard";
import AvatarUploader from "./AvatarUploader.tsx";
import AchievementBadge from "./AchievementBadge.tsx"; // <-- IMPORTED
import AnimatedDiv from "./ui/AnimatedDiv.tsx";

interface CharacterDashboardProps {
    characterId: number;
}

const calculateEffectiveStats = (
    baseStats: Character,
    tools: Tool[]
): Omit<Character, "id" | "name"> => {
    const effective = { ...baseStats };

    tools.forEach((tool) => {
        if (tool.braveryBonus) effective.bravery += tool.braveryBonus;
        if (tool.trustBonus) effective.trust += tool.trustBonus;
        if (tool.presenceBonus) effective.presence += tool.presenceBonus;
        if (tool.growthBonus) effective.growth += tool.growthBonus;
        if (tool.careBonus) effective.care += tool.careBonus;
    });

    return effective;
};

function CharacterDashboard({ characterId }: CharacterDashboardProps) {
    const { data: character, isLoading: isLoadingCharacter } = useQuery<Character>({
        queryKey: ["character", characterId],
        queryFn: () => api.getCharacterById(characterId),
    });

    const { data: assignedTools = [], isLoading: isLoadingTools } = useQuery<Tool[]>({
        queryKey: ["assignedTools", characterId],
        queryFn: () => api.getAssignedToolsForCharacter(characterId),
    });

    const { data: achievements = [], isLoading: isLoadingAchievements } = useQuery<Achievement[]>({
        queryKey: ["character", characterId, "achievements"],
        queryFn: () => api.getCharacterAchievements(characterId),
        enabled: !!characterId,
    });

    const isLoading = isLoadingCharacter || isLoadingTools || isLoadingAchievements;

    if (isLoading) {
        return (
            <Card className="p-10 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <Loader2 className="w-12 h-12 text-slate-500 mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-white">Loading Profile...</h3>
            </Card>
        );
    }

    if (!character) return null;

    const effectiveStats = calculateEffectiveStats(character, assignedTools);

    return (
        <div className="space-y-8">
            <AnimatedDiv delay={0}>
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div className="md:col-span-1 flex flex-col items-center text-center gap-4">
                            <AvatarUploader character={character} />
                            <div>
                                <h2 className="text-2xl font-bold text-white">{character.name}</h2>
                                <p className="text-indigo-300">{character.title || 'Team Member'}</p>
                            </div>
                            <div className="w-full max-w-[200px] mx-auto mt-2">
                            </div>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 gap-6">
                            <StatDisplay title="Effective Stats (with Tools)" stats={effectiveStats} />
                            {achievements.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-300 mb-3">Achievements</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {achievements.map(ach => (
                                            <AchievementBadge key={ach.id} achievement={ach} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </AnimatedDiv>

            <AnimatedDiv delay={2}>
                <ToolManagement characterId={characterId} />
            </AnimatedDiv>

            <AnimatedDiv delay={3}>
                <Card className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Challenge Management</h2>
                    <ManagementDashboard characterId={characterId} />
                </Card>
            </AnimatedDiv>
        </div>
    );
}

export default memo(CharacterDashboard);