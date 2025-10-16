import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { PlusCircle, Loader2, Edit, Trash2, Search } from "lucide-react";
import * as api from "@/api/api";
import { Tool } from "@/interfaces/Tool.ts";
import Card from "@/components/ui/Card.tsx";
import Button from "@/components/ui/Button.tsx";
import ConfirmationModal from "@/components/ui/ConfirmationModal.tsx";
import ToolForm from "@/components/tool/ToolForm.tsx";
import Modal from "@/components/ui/Modal.tsx";
import CompactStatList from "@/components/shared/CompactStatList.tsx";
import { useDebounce } from "@/hooks/useDebounce.ts";
import { useSort } from "@/hooks/useSort.ts";
import SortableHeader from "@/components/ui/SortableHeader.tsx";
import { useTranslation } from "react-i18next";

export default function ToolsTab() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const {
        data: tools = [],
        isLoading,
        error,
    } = useQuery<Tool[], Error>({
        queryKey: ["tools"],
        queryFn: api.getTools,
        staleTime: 1000 * 60 * 5,
    });

    const filteredTools = useMemo(() => {
        if (!tools) return [];
        return tools.filter(
            (tool) =>
                tool.name
                    .toLowerCase()
                    .includes(debouncedSearchTerm.toLowerCase()) ||
                tool.description
                    ?.toLowerCase()
                    .includes(debouncedSearchTerm.toLowerCase())
        );
    }, [tools, debouncedSearchTerm]);

    const {
        items: sortedAndFilteredTools,
        requestSort,
        sortConfig,
    } = useSort(filteredTools, {
        key: "name",
        direction: "ascending",
    });

    const mutation = useMutation<Tool, Error, Tool | Omit<Tool, "id">>({
        mutationFn: (toolData) => {
            if ("id" in toolData && toolData.id) {
                return api.updateTool(toolData.id, toolData);
            }
            return api.createTool(toolData as Omit<Tool, "id">);
        },
        onSuccess: (_, variables) => {
            const isUpdate = "id" in variables;
            toast.success(
                isUpdate ? t("toast.toolUpdated") : t("toast.toolCreated")
            );
            queryClient.invalidateQueries({
                queryKey: ["tools"],
            });
            setModalOpen(false);
        },
        onError: () => toast.error(t("toast.saveToolFailed")),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.deleteTool(id),
        onSuccess: () => {
            toast.success(t("toast.toolDeleted"));
            queryClient.invalidateQueries({
                queryKey: ["tools"],
            });
            setDeleteModalOpen(false);
            setSelectedTool(null);
        },
        onError: () => toast.error(t("toast.deleteToolFailed")),
    });

    const handleAddNew = () => {
        setSelectedTool(null);
        setModalOpen(true);
    };

    const handleEdit = (tool: Tool) => {
        setSelectedTool(tool);
        setModalOpen(true);
    };

    const handleDelete = (tool: Tool) => {
        setSelectedTool(tool);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedTool) {
            deleteMutation.mutate(selectedTool.id);
        }
    };

    if (error)
        return (
            <div className="text-red-400">
                {t("library.errorLoadingTools", { error: error.message })}
            </div>
        );

    return (
        <>
            <Card>
                <div className="p-4 border-b border-slate-700 flex flex-wrap gap-4 justify-between items-center">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t("library.filterByNameOrDesc")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 bg-slate-700 border border-slate-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                        />
                    </div>
                    <Button
                        variant="primary"
                        onClick={handleAddNew}
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        {t("library.addNewTool")}
                    </Button>
                </div>
                {isLoading ? (
                    <div className="p-10 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-300 uppercase bg-slate-800/50">
                                <tr>
                                    <SortableHeader
                                        label={t("library.headerName")}
                                        sortKey="name"
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
                                        className="min-w-[200px] w-[calc(45%)]"
                                    />
                                    <th
                                        scope="col"
                                        className="px-6 py-3"
                                    >
                                        {t("library.headerBonuses")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right"
                                    >
                                        {t("library.headerActions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedAndFilteredTools.length > 0 ? (
                                    sortedAndFilteredTools.map((tool) => (
                                        <tr
                                            key={tool.id}
                                            className="border-b border-slate-700 hover:bg-slate-800/40"
                                        >
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-white whitespace-nowrap"
                                            >
                                                {t(tool.name)}
                                            </th>
                                            <td className="px-6 py-4">
                                                <CompactStatList
                                                    type="gain"
                                                    stats={{
                                                        bravery:
                                                            tool.braveryBonus,
                                                        trust: tool.trustBonus,
                                                        presence:
                                                            tool.presenceBonus,
                                                        growth: tool.growthBonus,
                                                        care: tool.careBonus,
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-start gap-4">
                                                    <Button
                                                        variant="ghost"
                                                        className="p-1 h-auto"
                                                        onClick={() =>
                                                            handleEdit(tool)
                                                        }
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="p-1 h-auto text-red-500 hover:text-red-400"
                                                        onClick={() =>
                                                            handleDelete(tool)
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="text-center py-10 text-slate-500"
                                        >
                                            {t("library.noToolsMatch")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={
                    selectedTool
                        ? t("modal.editToolTitle")
                        : t("modal.addToolTitle")
                }
            >
                <ToolForm
                    key={selectedTool?.id ?? "new-tool"}
                    initialData={selectedTool}
                    onSubmit={(data) => mutation.mutate(data)}
                    onCancel={() => setModalOpen(false)}
                    isSaving={mutation.isPending}
                />
            </Modal>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={t("modal.deleteToolTitle")}
                message={t("modal.deleteToolMessage", {
                    name: selectedTool?.name,
                })}
                isConfirming={deleteMutation.isPending}
            />
        </>
    );
}
