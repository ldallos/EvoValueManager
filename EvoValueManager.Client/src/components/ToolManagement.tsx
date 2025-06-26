import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { PlusCircle, MinusCircle, Loader2 } from "lucide-react";
import * as api from "../api/api";
import { Tool } from "../interfaces/Tool";
import Card from "./ui/Card";
import { useTranslation } from "react-i18next";

interface ToolManagementProps {
    characterId: number;
}

function ToolManagement({ characterId }: ToolManagementProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

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

    if (isLoading) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-slate-300 mb-3">Equipped</h3>
                    <div className="space-y-2">
                        {assignedTools.length > 0 ? (
                            assignedTools.map((tool) => (
                                <div
                                    key={tool.id}
                                    className="bg-slate-700 p-2 rounded-lg flex items-center justify-between text-sm"
                                >
                                    <span>{tool.name}</span>
                                    <button
                                        onClick={() =>
                                            toolMutation.mutate({
                                                toolId: tool.id,
                                                action: "unassign",
                                            })
                                        }
                                        disabled={toolMutation.isPending}
                                        className="text-red-400 hover:text-red-300 disabled:opacity-50"
                                    >
                                        <MinusCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-sm italic">None</p>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-300 mb-3">Available</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {availableTools.length > 0 ? (
                            availableTools.map((tool) => (
                                <div
                                    key={tool.id}
                                    className="bg-slate-700 p-2 rounded-lg flex items-center justify-between text-sm"
                                >
                                    <span>{tool.name}</span>
                                    <button
                                        onClick={() =>
                                            toolMutation.mutate({
                                                toolId: tool.id,
                                                action: "assign",
                                            })
                                        }
                                        disabled={toolMutation.isPending}
                                        className="text-green-400 hover:text-green-300 disabled:opacity-50"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-sm italic">None</p>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default ToolManagement;
