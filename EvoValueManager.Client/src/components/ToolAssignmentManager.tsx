import { useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import * as api from "../api/api";
import { Tool } from "../interfaces/Tool";
import ToolSelector from "./ToolSelector";
import Button from "./ui/Button";
import { useTranslation } from "react-i18next";

interface ToolAssignmentManagerProps {
    characterId: number;
}

function ToolAssignmentManager({ characterId }: ToolAssignmentManagerProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [toolToAssignId, setToolToAssignId] = useState<number | null>(null);

    const assignedToolsQuery = useQuery<Tool[], Error>({
        queryKey: ["assignedTools", characterId],
        queryFn: () => api.getAssignedToolsForCharacter(characterId),
    });

    const availableToolsQuery = useQuery<Tool[], Error>({
        queryKey: ["availableTools", characterId],
        queryFn: () => api.getAvailableToolsForCharacter(characterId),
    });

    const assignmentMutation = useMutation<
        unknown,
        AxiosError,
        { toolId: number; action: "assign" | "unassign" }
    >({
        mutationFn: ({ toolId, action }) => {
            if (action === "assign") {
                return api.assignToolToCharacter(characterId, toolId);
            }
            return api.unassignToolFromCharacter(characterId, toolId);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["assignedTools", characterId] });
            queryClient.invalidateQueries({ queryKey: ["availableTools", characterId] });

            const message =
                variables.action === "assign"
                    ? t("toolAssignedSuccess")
                    : t("toolUnassignedSuccess");
            toast.success(message);

            if (variables.action === "assign") {
                setToolToAssignId(null);
            }
        },
        onError: (err, variables) => {
            const defaultMessage =
                variables.action === "assign"
                    ? t("failedToAssignToolError")
                    : t("failedToUnassignToolError");
            const message = (err.response?.data as { message: string })?.message || defaultMessage;
            toast.error(message);
        },
    });

    const handleAssignTool = () => {
        if (!toolToAssignId) return;
        assignmentMutation.mutate({ toolId: toolToAssignId, action: "assign" });
    };

    const handleUnassignTool = (toolId: number) => {
        assignmentMutation.mutate({ toolId, action: "unassign" });
    };

    const handleToolToAssignSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        setToolToAssignId(Number(event.target.value));
    };

    const isLoading = assignedToolsQuery.isLoading || availableToolsQuery.isLoading;
    const isProcessing = assignmentMutation.isPending;

    if (isLoading) {
        return <p className="text-gray-500">{t("loadingToolData")}</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">{t("assignNewTool")}</h4>
                <ToolSelector
                    tools={availableToolsQuery.data || []}
                    selectedId={toolToAssignId}
                    onChange={handleToolToAssignSelect}
                    label={t("availableToolsLabel")}
                    disabled={isProcessing || (availableToolsQuery.data || []).length === 0}
                />
                <Button
                    variant="primary"
                    onClick={handleAssignTool}
                    disabled={!toolToAssignId || isProcessing}
                    isLoading={isProcessing && assignmentMutation.variables?.action === "assign"}
                    loadingText={t("assigning")}
                >
                    {t("assignSelectedTool")}
                </Button>
                {(availableToolsQuery.data || []).length === 0 && (
                    <p className="text-sm text-gray-500 pt-2">{t("noAvailableToolsToAssign")}</p>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">{t("assignedToolsTitle")}</h4>
                {(assignedToolsQuery.data || []).length > 0 ? (
                    <ul className="space-y-2">
                        {(assignedToolsQuery.data || []).map((tool) => (
                            <li
                                key={tool.id}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                            >
                                <span className="text-sm font-medium text-gray-700">
                                    {tool.name}
                                </span>
                                <Button
                                    variant="danger"
                                    onClick={() => handleUnassignTool(tool.id)}
                                    disabled={isProcessing}
                                    isLoading={
                                        isProcessing &&
                                        assignmentMutation.variables?.toolId === tool.id &&
                                        assignmentMutation.variables?.action === "unassign"
                                    }
                                    loadingText="..."
                                    className="px-2 py-1 text-xs"
                                >
                                    {t("unassign")}
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">{t("noToolsAssigned")}</p>
                )}
            </div>
        </div>
    );
}

export default ToolAssignmentManager;
