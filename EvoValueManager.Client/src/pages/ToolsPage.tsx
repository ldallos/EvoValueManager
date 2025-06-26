import { useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import * as api from "../api/api";
import { Tool } from "../interfaces/Tool";
import ToolSelector from "../components/ToolSelector";
import ToolForm from "../components/ToolForm";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";

function ToolsPage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedToolId, setSelectedToolId] = useState<number | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const {
        data: tools = [],
        isLoading,
        error,
    } = useQuery<Tool[], Error>({
        queryKey: ["tools"],
        queryFn: api.getTools,
    });

    const toolMutation = useMutation<Tool, AxiosError, Tool | Omit<Tool, "id">>({
        mutationFn: async (toolData) => {
            if ("id" in toolData && toolData.id) {
                await api.updateTool(toolData.id, toolData as Tool);
                return toolData as Tool;
            }
            return api.createTool(toolData as Omit<Tool, "id">);
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["tools"] });

            const isUpdate = "id" in variables;
            toast.success(isUpdate ? t("toolUpdatedAlert") : t("toolAddedAlert"));

            setSelectedToolId(data.id);
            setShowAddForm(false);
        },
        onError: (err) => {
            let message = t("failedToSaveToolError");

            if (err.response && err.response.data && typeof err.response.data === "object") {
                const responseData = err.response.data as { message?: string };
                if (responseData.message) {
                    message = responseData.message;
                }
            }

            toast.error(message);
        },
    });

    const handleSelectTool = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedToolId(Number(event.target.value));
        setShowAddForm(false);
    };

    const toggleAddToolForm = () => {
        setShowAddForm((prev) => !prev);
        setSelectedToolId(null);
    };

    const selectedTool = tools.find((t) => t.id === selectedToolId) || null;

    if (isLoading) return <div className="text-center p-10">{t("loadingTools")}...</div>;
    if (error)
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                {t("errorLoadingPage")}: {error.message}
            </div>
        );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t("toolsTitle")}</h1>

            <div className="bg-white p-4 rounded-lg shadow flex flex-wrap items-center gap-4">
                <ToolSelector
                    tools={tools}
                    selectedId={selectedToolId}
                    onChange={handleSelectTool}
                    label={t("selectToolLabel")}
                    disabled={toolMutation.isPending}
                />
                <Button onClick={toggleAddToolForm} disabled={toolMutation.isPending}>
                    {showAddForm ? t("back") : t("addNewToolButton")}
                </Button>
            </div>

            {(showAddForm || selectedTool) && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <ToolForm
                        key={selectedTool?.id ?? "new-tool-form"}
                        initialData={showAddForm ? null : selectedTool}
                        onSubmit={(data) => toolMutation.mutate(data)}
                        onCancel={() => {
                            setShowAddForm(false);
                            setSelectedToolId(null);
                        }}
                        isSaving={toolMutation.isPending}
                    />
                </div>
            )}
        </div>
    );
}

export default ToolsPage;
