import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { PlusCircle, MinusCircle, Loader2, ArrowRight } from "lucide-react";
import * as api from "../api/api";
import { Tool } from "../interfaces/Tool";
import Card from "./ui/Card";
import StatIcon, { STAT_NAMES, StatName } from './StatIcon'; // <-- IMPORT StatName
import { useTranslation } from "react-i18next";

interface ToolManagementProps {
    characterId: number;
}

const BonusStat = ({ label, value }: { label: StatName, value: number | null | undefined }) => {
    if (!value || value === 0) return null;
    const isPositive = value > 0;
    return (
        <div className={`flex items-center text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <StatIcon stat={label} className="w-3 h-3 mr-1" />
            {isPositive ? '+' : ''}{value}
        </div>
    );
}

function ToolManagement({ characterId }: ToolManagementProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [hoveredToolId, setHoveredToolId] = useState<number | null>(null);

    const { data: character } = useQuery({
        queryKey: ["character", characterId],
        queryFn: () => api.getCharacterById(characterId),
    });

    const { data: assignedTools = [], isLoading: isLoadingAssigned } = useQuery<Tool[]>({
        queryKey: ["assignedTools", characterId],
        queryFn: () => api.getAssignedToolsForCharacter(characterId),
    });

    const { data: availableTools = [], isLoading: isLoadingAvailable } = useQuery<Tool[]>({
        queryKey: ["availableTools", characterId],
        queryFn: () => api.getAvailableToolsForCharacter(characterId),
    });

    const toolMutation = useMutation({
        mutationFn: ({ toolId, action }: { toolId: number; action: "assign" | "unassign" }) => {
            return action === "assign"
                ? api.assignToolToCharacter(characterId, toolId)
                : api.unassignToolFromCharacter(characterId, toolId);
        },
        onSuccess: (_, { action }) => {
            queryClient.invalidateQueries({ queryKey: ["assignedTools", characterId] });
            queryClient.invalidateQueries({ queryKey: ["availableTools", characterId] });
            queryClient.invalidateQueries({ queryKey: ["character", characterId] });
            toast.success(
                action === "assign" ? t("toolAssignedSuccess") : t("toolUnassignedSuccess")
            );
        },
        onError: (err: AxiosError<{ message: string }>, { action }) => {
            const defaultMessage =
                action === "assign" ? t("failedToAssignToolError") : t("failedToUnassignToolError");
            toast.error(err.response?.data?.message || defaultMessage);
        },
    });

    const isLoading = isLoadingAssigned || isLoadingAvailable;
    const hoveredTool = availableTools.find(t => t.id === hoveredToolId);

    if (isLoading || !character) {
        return (
            <Card className="p-6 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin mr-2 text-slate-400" />
                <span className="text-slate-400">Loading Tool Data...</span>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Tool Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">

                <div>
                    <h3 className="font-semibold text-slate-300 mb-3">Equipped</h3>
                    <div className="space-y-2">
                        {assignedTools.length > 0 ? (
                            assignedTools.map((tool) => (
                                <div key={tool.id} className="bg-slate-700/80 p-3 rounded-lg flex items-center justify-between">
                                    <div className="flex-grow">
                                        <p className="font-medium text-white">{tool.name}</p>
                                        <div className="flex space-x-2 mt-1">
                                            <BonusStat label="bravery" value={tool.braveryBonus} />
                                            <BonusStat label="trust" value={tool.trustBonus} />
                                            <BonusStat label="presence" value={tool.presenceBonus} />
                                            <BonusStat label="growth" value={tool.growthBonus} />
                                            <BonusStat label="care" value={tool.careBonus} />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toolMutation.mutate({ toolId: tool.id, action: "unassign" })}
                                        disabled={toolMutation.isPending}
                                        className="text-red-400 hover:text-red-300 disabled:opacity-50 ml-4"
                                    >
                                        <MinusCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        ) : (<p className="text-slate-500 text-sm italic">None</p>)}
                    </div>
                </div>

                {/* AVAILABLE TOOLS & "WHAT IF" PANEL */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <h3 className="font-semibold text-slate-300 mb-3">Available</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2  no-scrollbar">
                            {availableTools.length > 0 ? (
                                availableTools.map((tool) => (
                                    <div
                                        key={tool.id}
                                        onMouseEnter={() => setHoveredToolId(tool.id)}
                                        onMouseLeave={() => setHoveredToolId(null)}
                                        className="bg-slate-700/80 p-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-700"
                                    >
                                        <span className="font-medium text-white">{tool.name}</span>
                                        <button
                                            onClick={() => toolMutation.mutate({ toolId: tool.id, action: "assign" })}
                                            disabled={toolMutation.isPending}
                                            className="text-green-400 hover:text-green-300 disabled:opacity-50"
                                        >
                                            <PlusCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            ) : (<p className="text-slate-500 text-sm italic">None</p>)}
                        </div>
                    </div>
                    {/* "WHAT IF" PANEL */}
                    <div className="col-span-1 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 h-fit">
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 text-center">Stat Preview</h4>
                        {hoveredTool ? (
                            <div className="space-y-2">
                                {STAT_NAMES.map(stat => {
                                    const baseValue = character[stat];
                                    const bonus = hoveredTool[`${stat}Bonus` as keyof Tool] as number || 0;
                                    const newValue = baseValue + bonus;
                                    return (
                                        <div key={stat} className="flex items-center justify-between text-sm">
                                            <span className="capitalize text-slate-300">{stat}</span>
                                            <div className="flex items-center gap-2 font-mono">
                                                <span>{baseValue}</span>
                                                <ArrowRight className="w-3 h-3 text-slate-500" />
                                                <span className={`font-bold ${bonus > 0 ? 'text-green-400' : 'text-slate-300'}`}>{newValue}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-xs text-slate-500 pt-8">Hover over an available tool to see its effect.</p>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default ToolManagement;