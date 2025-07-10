import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { PlusCircle, MinusCircle, Loader2, ArrowRight } from "lucide-react";
import * as api from "@/api/api";
import { Tool } from "@/interfaces/Tool.ts";
import { Character } from "@/interfaces/Character.ts";
import Card from "@/components/ui/Card.tsx";
import StatIcon from "@/components/shared/StatIcon.tsx";
import { STAT_NAMES, StatName } from "@/components/shared/stat-types.ts";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn.ts";
import { useCharacterData } from "@/hooks/useCharacterData";

const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;

interface ToolManagementProps {
    characterId: number;
}

const BonusStat = ({
    label,
    value,
}: {
    label: StatName;
    value: number | null | undefined;
}) => {
    if (!value || value === 0) return null;
    const isPositive = value > 0;
    return (
        <div
            className={`flex items-center text-xs ${isPositive ? "text-green-400" : "text-red-400"}`}
        >
            <StatIcon
                stat={label}
                className="w-3 h-3 mr-1"
            />
            {isPositive ? "+" : ""}
            {value}
        </div>
    );
};

function ToolManagement({ characterId }: ToolManagementProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [hoveredToolId, setHoveredToolId] = useState<number | null>(null);

    const { baseCharacters, isLoading: isLoadingCharacters } =
        useCharacterData();

    const baseCharacter = useMemo(
        () => baseCharacters.find((c) => c.id === characterId),
        [baseCharacters, characterId]
    );

    const { data: assignedTools = [], isLoading: isLoadingAssigned } = useQuery<
        Tool[]
    >({
        queryKey: ["assignedTools", characterId],
        queryFn: () => api.getAssignedToolsForCharacter(characterId),
        staleTime: FIVE_MINUTES_IN_MS,
    });

    const { data: availableTools = [], isLoading: isLoadingAvailable } =
        useQuery<Tool[]>({
            queryKey: ["availableTools", characterId],
            queryFn: () => api.getAvailableToolsForCharacter(characterId),
            staleTime: FIVE_MINUTES_IN_MS,
        });

    const toolMutation = useMutation({
        mutationFn: ({
            toolId,
            action,
        }: {
            toolId: number;
            action: "assign" | "unassign";
        }) => {
            return action === "assign"
                ? api.assignToolToCharacter(characterId, toolId)
                : api.unassignToolFromCharacter(characterId, toolId);
        },
        onSuccess: (_, { action }) => {
            toast.success(
                action === "assign"
                    ? t("toast.toolAssigned")
                    : t("toast.toolUnassigned")
            );
            queryClient.invalidateQueries({
                queryKey: ["assignedTools", characterId],
            });
            queryClient.invalidateQueries({
                queryKey: ["availableTools", characterId],
            });
            queryClient.invalidateQueries({ queryKey: ["characters"] });
        },
        onError: (err: AxiosError<{ message: string }>, { action }) => {
            const defaultMessage =
                action === "assign"
                    ? t("toast.assignToolFailed")
                    : t("toast.unassignToolFailed");
            toast.error(err.response?.data?.message || defaultMessage);
        },
    });

    const currentCharacterStats = useMemo(() => {
        if (!baseCharacter) {
            const emptyStats: Character = {
                id: 0,
                name: "",
                hasAvatar: false,
                bravery: 0,
                trust: 0,
                presence: 0,
                growth: 0,
                care: 0,
                achievements: [],
                appliedTools: [],
            };
            STAT_NAMES.forEach((statName) => {
                emptyStats[statName] = 0;
            });
            return emptyStats;
        }
        const stats: Character = { ...baseCharacter };
        assignedTools.forEach((tool) => {
            STAT_NAMES.forEach((statName) => {
                const bonus =
                    (tool[`${statName}Bonus` as keyof Tool] as number) || 0;
                stats[statName] = (stats[statName] || 0) + bonus;
            });
        });
        return stats;
    }, [baseCharacter, assignedTools]);

    const isLoading =
        isLoadingAssigned || isLoadingAvailable || isLoadingCharacters;
    const hoveredTool = availableTools.find((t) => t.id === hoveredToolId);

    if (isLoading || !baseCharacter) {
        return (
            <Card className="p-6 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin mr-2 text-slate-400" />
                <span className="text-slate-400">{t("tool.loading")}</span>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
            <div>
                <h3 className="font-semibold text-slate-300 mb-3">
                    {t("tool.equippedTitle")}
                </h3>
                <div className="space-y-2">
                    {assignedTools.length > 0 ? (
                        assignedTools.map((tool) => {
                            const isMutatingThisTool =
                                toolMutation.isPending &&
                                toolMutation.variables?.toolId === tool.id;
                            return (
                                <button
                                    key={tool.id}
                                    onClick={() =>
                                        toolMutation.mutate({
                                            toolId: tool.id,
                                            action: "unassign",
                                        })
                                    }
                                    disabled={isMutatingThisTool}
                                    className="w-full text-left bg-slate-700/80 p-3 rounded-lg flex items-center justify-between transition-colors hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex-grow">
                                        <p className="font-medium text-white">
                                            {t(tool.name)}
                                        </p>
                                        <div className="flex space-x-2 mt-1">
                                            <BonusStat
                                                label="bravery"
                                                value={tool.braveryBonus}
                                            />
                                            <BonusStat
                                                label="trust"
                                                value={tool.trustBonus}
                                            />
                                            <BonusStat
                                                label="presence"
                                                value={tool.presenceBonus}
                                            />
                                            <BonusStat
                                                label="growth"
                                                value={tool.growthBonus}
                                            />
                                            <BonusStat
                                                label="care"
                                                value={tool.careBonus}
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-4 text-red-400">
                                        {isMutatingThisTool ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <MinusCircle className="w-5 h-5" />
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <p className="text-slate-500 text-sm italic">
                            {t("common.none")}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <h3 className="font-semibold text-slate-300 mb-3">
                        {t("tool.availableTitle")}
                    </h3>
                    <div className="relative h-100">
                        <div className="absolute inset-0 overflow-y-auto pr-2 no-scrollbar">
                            <div className="space-y-2">
                                {availableTools.length > 0 ? (
                                    availableTools.map((tool) => {
                                        const isMutatingThisTool =
                                            toolMutation.isPending &&
                                            toolMutation.variables?.toolId ===
                                                tool.id;
                                        return (
                                            <button
                                                key={tool.id}
                                                onMouseEnter={() =>
                                                    setHoveredToolId(tool.id)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredToolId(null)
                                                }
                                                onClick={() =>
                                                    toolMutation.mutate({
                                                        toolId: tool.id,
                                                        action: "assign",
                                                    })
                                                }
                                                disabled={isMutatingThisTool}
                                                className="w-full text-left bg-slate-700/80 p-3 rounded-lg flex items-center justify-between transition-colors hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="font-medium text-white">
                                                    {t(tool.name)}
                                                </span>
                                                <div className="text-green-400">
                                                    {isMutatingThisTool ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <PlusCircle className="w-5 h-5" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <p className="text-slate-500 text-sm italic">
                                        {t("common.none")}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-800 to-transparent pointer-events-none" />
                    </div>
                </div>
                <div className="col-span-1 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 h-fit">
                    <h4 className="text-sm font-semibold text-slate-400 mb-3 text-center">
                        {t("tool.statPreviewTitle")}
                    </h4>
                    {hoveredTool ? (
                        <div className="space-y-2">
                            {STAT_NAMES.map((stat) => {
                                const baseValue = currentCharacterStats[stat];
                                const bonus =
                                    (hoveredTool[
                                        `${stat}Bonus` as keyof Tool
                                    ] as number) || 0;
                                const newValue = baseValue + bonus;
                                return (
                                    <div
                                        key={stat}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span className="text-slate-300">
                                            {t(stat)}
                                        </span>
                                        <div className="flex items-center gap-2 font-mono">
                                            <span>{baseValue}</span>
                                            <ArrowRight className="w-3 h-3 text-slate-500" />
                                            <span
                                                className={cn(
                                                    "font-bold",
                                                    bonus > 0
                                                        ? "text-green-400"
                                                        : "text-slate-300"
                                                )}
                                            >
                                                {newValue}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-xs text-slate-500 pt-8">
                            {t("tool.statPreviewPlaceholder")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ToolManagement;
