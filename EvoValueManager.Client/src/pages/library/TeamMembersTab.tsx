import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { PlusCircle, Loader2, Edit, Trash2, Search } from "lucide-react";
import * as api from "@/api/api";
import { Character } from "@/interfaces/Character.ts";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import CharacterModal from "@/components/character/CharacterModal.tsx";
import { useDebounce } from "@/hooks/useDebounce.ts";
import { useSort } from "@/hooks/useSort.ts";
import SortableHeader from "@/components/ui/SortableHeader";
import StatIcon from "@/components/shared/StatIcon.tsx";
import { useTranslation } from "react-i18next";
import { RichCharacter } from "@/interfaces/RichCharacter.ts";

export default function TeamMembersTab() {
    const queryClient = useQueryClient();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCharacter, setSelectedCharacter] =
        useState<Character | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { t } = useTranslation();

    const {
        data: richCharacters = [],
        isLoading,
        error,
    } = useQuery<RichCharacter[], Error>({
        queryKey: ["characters"],
        queryFn: api.getCharacters,
    });

    const baseCharacters = useMemo<Character[]>(() => {
        return richCharacters.map((rc) => ({
            id: rc.id,
            name: rc.name,
            title: rc.title,
            hasAvatar: rc.hasAvatar,
            bravery: rc.bravery.base,
            trust: rc.trust.base,
            presence: rc.presence.base,
            growth: rc.growth.base,
            care: rc.care.base,
            achievements: [],
            appliedTools: [],
        }));
    }, [richCharacters]);

    const filteredCharacters = useMemo(() => {
        if (!baseCharacters) return [];
        return baseCharacters.filter(
            (char) =>
                char.name
                    .toLowerCase()
                    .includes(debouncedSearchTerm.toLowerCase()) ||
                char.title
                    ?.toLowerCase()
                    .includes(debouncedSearchTerm.toLowerCase())
        );
    }, [baseCharacters, debouncedSearchTerm]);

    const {
        items: sortedAndFilteredCharacters,
        requestSort,
        sortConfig,
    } = useSort(filteredCharacters, {
        key: "name",
        direction: "ascending",
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.deleteCharacter(id),
        onSuccess: () => {
            toast.success(t("toast.teamMemberDeleted"));
            queryClient.invalidateQueries({ queryKey: ["baseCharacters"] });
            queryClient.invalidateQueries({ queryKey: ["characters"] });
            setDeleteModalOpen(false);
            setSelectedCharacter(null);
        },
        onError: () => toast.error(t("toast.deleteTeamMemberFailed")),
    });

    const handleAddNew = () => {
        setSelectedCharacter(null);
        setModalOpen(true);
    };

    const handleEdit = (character: Character) => {
        setSelectedCharacter(character);
        setModalOpen(true);
    };

    const handleDelete = (character: Character) => {
        setSelectedCharacter(character);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedCharacter) {
            deleteMutation.mutate(selectedCharacter.id);
        }
    };

    if (error)
        return (
            <div className="text-red-400">
                {t("library.errorLoadingTeamMembers", { error: error.message })}
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
                            placeholder={t("library.filterByNameOrTitle")}
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
                        {t("library.addNewMember")}
                    </Button>
                </div>
                {isLoading ? (
                    <div className="p-10 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400 table-fixed">
                            <thead className="text-xs text-slate-300 uppercase bg-slate-800/50">
                                <tr>
                                    <SortableHeader
                                        label={t("library.headerName")}
                                        sortKey="name"
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
                                        className="w-1/7"
                                    />
                                    <SortableHeader
                                        label={t("library.headerTitle")}
                                        sortKey="title"
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
                                        className="w-1/7"
                                    />
                                    <SortableHeader
                                        icon={
                                            <StatIcon
                                                stat="growth"
                                                className="w-4 h-4"
                                            />
                                        }
                                        label={t("growth")}
                                        sortKey="growth"
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
                                        className="w-[calc(60%/5)]"
                                        align="center"
                                    />
                                    <SortableHeader
                                        icon={
                                            <StatIcon
                                                stat="care"
                                                className="w-4 h-4"
                                            />
                                        }
                                        label={t("care")}
                                        sortKey="care"
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
                                        className="w-[calc(60%/5)]"
                                        align="center"
                                    />
                                    <SortableHeader
                                        icon={
                                            <StatIcon
                                                stat="presence"
                                                className="w-4 h-4"
                                            />
                                        }
                                        label={t("presence")}
                                        sortKey="presence"
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
                                        className="w-[calc(60%/5)]"
                                        align="center"
                                    />
                                    <SortableHeader
                                        icon={
                                            <StatIcon
                                                stat="trust"
                                                className="w-4 h-4"
                                            />
                                        }
                                        label={t("trust")}
                                        sortKey="trust"
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
                                        className="w-[calc(60%/5)]"
                                        align="center"
                                    />
                                    <SortableHeader
                                        icon={
                                            <StatIcon
                                                stat="bravery"
                                                className="w-4 h-4"
                                            />
                                        }
                                        label={t("bravery")}
                                        sortKey="bravery"
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
                                        className="w-[calc(60%/5)]"
                                        align="center"
                                    />
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right"
                                    >
                                        {t("library.headerActions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedAndFilteredCharacters.length > 0 ? (
                                    sortedAndFilteredCharacters.map((char) => (
                                        <tr
                                            key={char.id}
                                            className="border-b border-slate-700 hover:bg-slate-800/40"
                                        >
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-white whitespace-nowrap"
                                            >
                                                {char.name}
                                            </th>
                                            <td className="px-6 py-4">
                                                {char.title || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {char.growth}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {char.care}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {char.presence}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {char.trust}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {char.bravery}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-4">
                                                    <Button
                                                        variant="ghost"
                                                        className="p-1 h-auto"
                                                        onClick={() =>
                                                            handleEdit(char)
                                                        }
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="p-1 h-auto text-red-500 hover:text-red-400"
                                                        onClick={() =>
                                                            handleDelete(char)
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
                                            colSpan={8}
                                            className="text-center py-10 text-slate-500"
                                        >
                                            {t("library.noMembersMatch")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <CharacterModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                character={selectedCharacter}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={t("modal.deleteTeamMemberTitle")}
                message={t("modal.deleteTeamMemberMessage", {
                    name: selectedCharacter?.name,
                })}
                isConfirming={deleteMutation.isPending}
            />
        </>
    );
}
