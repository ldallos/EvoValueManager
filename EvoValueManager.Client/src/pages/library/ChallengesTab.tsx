import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { PlusCircle, Loader2, Edit, Trash2, Search } from "lucide-react";
import * as api from "@/api/api";
import { Challenge } from "@/interfaces/Challenge.ts";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import ChallengeForm from "@/components/challenge/ChallengeForm.tsx";
import Modal from "@/components/ui/Modal";
import CompactStatList from "@/components/shared/CompactStatList.tsx";
import { useDebounce } from "@/hooks/useDebounce.ts";
import { useSort } from "@/hooks/useSort.ts";
import SortableHeader from "@/components/ui/SortableHeader";
import { useTranslation } from "react-i18next";

export default function ChallengesTab() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedChallenge, setSelectedChallenge] =
        useState<Challenge | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const {
        data: challenges = [],
        isLoading,
        error,
    } = useQuery<Challenge[], Error>({
        queryKey: ["challenges"],
        queryFn: api.getChallenges,
    });

    const filteredChallenges = useMemo(() => {
        if (!challenges) return [];
        return challenges.filter((chal) =>
            chal.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [challenges, debouncedSearchTerm]);

    const {
        items: sortedAndFilteredChallenges,
        requestSort,
        sortConfig,
    } = useSort(filteredChallenges, {
        key: "title",
        direction: "ascending",
    });

    const mutation = useMutation<
        Challenge,
        Error,
        Challenge | Omit<Challenge, "id">
    >({
        mutationFn: (challengeData) => {
            if ("id" in challengeData && challengeData.id) {
                return api.updateChallenge(challengeData.id, challengeData);
            }
            return api.createChallenge(challengeData as Omit<Challenge, "id">);
        },
        onSuccess: (_, variables) => {
            const isUpdate = "id" in variables;
            toast.success(
                isUpdate
                    ? t("toast.challengeUpdated")
                    : t("toast.challengeCreated")
            );
            queryClient.invalidateQueries({
                queryKey: ["challenges"],
            });
            setModalOpen(false);
        },
        onError: () => toast.error(t("toast.saveChallengeFailed")),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.deleteChallenge(id),
        onSuccess: () => {
            toast.success(t("toast.challengeDeleted"));
            queryClient.invalidateQueries({
                queryKey: ["challenges"],
            });
            setDeleteModalOpen(false);
            setSelectedChallenge(null);
        },
        onError: () => toast.error(t("toast.deleteChallengeFailed")),
    });

    const handleAddNew = () => {
        setSelectedChallenge(null);
        setModalOpen(true);
    };

    const handleEdit = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setModalOpen(true);
    };

    const handleDelete = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedChallenge) {
            deleteMutation.mutate(selectedChallenge.id);
        }
    };

    if (error)
        return (
            <div className="text-red-400">
                {t("library.errorLoadingChallenges", { error: error.message })}
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
                            placeholder={t("library.filterByTitle")}
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
                        {t("library.addNewChallenge")}
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
                                        label={t("library.headerTitle")}
                                        sortKey="title"
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
                                        className="min-w-[200px] w-[calc(30%)]"
                                    />
                                    <th
                                        scope="col"
                                        className="px-6 py-3 w-[calc(30%)]"
                                    >
                                        {t("library.headerRequirements")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 w-[calc(30%)]"
                                    >
                                        {t("library.headerGains")}
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
                                {sortedAndFilteredChallenges.length > 0 ? (
                                    sortedAndFilteredChallenges.map((chal) => (
                                        <tr
                                            key={chal.id}
                                            className="border-b border-slate-700 hover:bg-slate-800/40"
                                        >
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-white whitespace-nowrap"
                                            >
                                                {t(chal.title)}
                                            </th>
                                            <td className="px-6 py-4">
                                                <CompactStatList
                                                    type="requirement"
                                                    stats={{
                                                        bravery:
                                                            chal.requiredBravery,
                                                        trust: chal.requiredTrust,
                                                        presence:
                                                            chal.requiredPresence,
                                                        growth: chal.requiredGrowth,
                                                        care: chal.requiredCare,
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <CompactStatList
                                                    type="gain"
                                                    stats={{
                                                        bravery:
                                                            chal.gainableBravery,
                                                        trust: chal.gainableTrust,
                                                        presence:
                                                            chal.gainablePresence,
                                                        growth: chal.gainableGrowth,
                                                        care: chal.gainableCare,
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-4">
                                                    <Button
                                                        variant="ghost"
                                                        className="p-1 h-auto"
                                                        onClick={() =>
                                                            handleEdit(chal)
                                                        }
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="p-1 h-auto text-red-500 hover:text-red-400"
                                                        onClick={() =>
                                                            handleDelete(chal)
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
                                            colSpan={4}
                                            className="text-center py-10 text-slate-500"
                                        >
                                            {t("library.noChallengesMatch")}
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
                    selectedChallenge
                        ? t("modal.editChallengeTitle")
                        : t("modal.addChallengeTitle")
                }
            >
                <ChallengeForm
                    key={selectedChallenge?.id ?? "new-challenge"}
                    initialData={selectedChallenge}
                    onSubmit={(data) => mutation.mutate(data)}
                    onCancel={() => setModalOpen(false)}
                    isSaving={mutation.isPending}
                />
            </Modal>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={t("modal.deleteChallengeTitle")}
                message={t("modal.deleteChallengeMessage", {
                    name: selectedChallenge?.title,
                })}
                isConfirming={deleteMutation.isPending}
            />
        </>
    );
}
