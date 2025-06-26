import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Loader2 } from "lucide-react";
import * as api from "../api/api";
import { Character } from "../interfaces/Character";
import { Tool } from "../interfaces/Tool";
import Card from "./ui/Card";
import StatDisplay from "./StatDisplay";
import ToolManagement from "./ToolManagement";

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

    const isLoading = isLoadingCharacter || isLoadingTools;

    if (isLoading) {
        return (
            <Card className="p-10 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <Loader2 className="w-12 h-12 text-slate-500 mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-white">Loading Character Details...</h3>
            </Card>
        );
    }

    if (!character) return null;

    const effectiveStats = calculateEffectiveStats(character, assignedTools);

    return (
        <div className="space-y-8">
            <Card className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <User /> {character.name}'s Stats
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <StatDisplay title="Base Stats" stats={character} />
                    <StatDisplay title="Effective Stats (with Tools)" stats={effectiveStats} />
                </div>
            </Card>

            <ToolManagement characterId={characterId} />

            <Card className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Challenge Management</h2>
                <p className="text-slate-400">
                    test
                </p>
            </Card>
        </div>
    );
}

export default memo(CharacterDashboard);
