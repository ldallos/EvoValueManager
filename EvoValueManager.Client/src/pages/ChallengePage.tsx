import { useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import * as api from "../api/api";
import { Challenge } from "../interfaces/Challenge";
import ChallengeSelector from "../components/ChallengeSelector";
import ChallengeForm from "../components/ChallengeForm";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";

function ChallengePage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    
    const {
        data: challenges = [],
        isLoading,
        error,
    } = useQuery<Challenge[], Error>({
        queryKey: ["challenges"],
        queryFn: api.getChallenges,
    });
    
    const challengeMutation = useMutation<Challenge, AxiosError, Challenge | Omit<Challenge, "id">>(
        {
            mutationFn: async (challengeData) => {
                if ("id" in challengeData && challengeData.id) {
                    await api.updateChallenge(challengeData.id, challengeData as Challenge);
                    return challengeData as Challenge;
                }
                return api.createChallenge(challengeData as Omit<Challenge, "id">);
            },
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ["challenges"] });
                toast.success(data.id ? t("challengeUpdatedAlert") : t("challengeAddedAlert"));

                setSelectedChallengeId(data.id);
                setShowAddForm(false);
            },
            onError: (err) => {
                const message =
                    (err.response?.data as { message: string })?.message ||
                    t("failedToSaveChangesError");
                toast.error(message);
            },
        }
    );

    const handleSelectChallenge = (event: ChangeEvent<HTMLSelectElement>) => {
        const id = event.target.value ? Number(event.target.value) : null;
        setSelectedChallengeId(id);
        setShowAddForm(false);
    };

    const toggleAddChallengeForm = () => {
        setShowAddForm((prev) => !prev);
        setSelectedChallengeId(null);
    };

    const handleCancelForm = () => {
        setShowAddForm(false);
    };

    const selectedChallenge = challenges.find((c) => c.id === selectedChallengeId) || null;

    if (isLoading) return <div className="text-center p-10">{t("loadingChallenges")}...</div>;
    if (error)
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                {t("errorLoadingPage")}: {error.message}
            </div>
        );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {t("challengesTitle")}
            </h1>

            <div className="bg-white p-4 rounded-lg shadow flex flex-wrap items-center gap-4">
                <ChallengeSelector
                    challenges={challenges}
                    selectedId={selectedChallengeId}
                    onChange={handleSelectChallenge}
                    label={t("selectChallengeLabel")}
                    disabled={challengeMutation.isPending}
                />
                <Button onClick={toggleAddChallengeForm} disabled={challengeMutation.isPending}>
                    {showAddForm ? t("backToList") : t("addNewChallengeButton")}
                </Button>
            </div>
            
            {(showAddForm || selectedChallenge) && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <ChallengeForm
                        key={selectedChallenge?.id ?? "new"}
                        initialData={showAddForm ? null : selectedChallenge}
                        onSubmit={(data) => challengeMutation.mutate(data)}
                        onCancel={handleCancelForm}
                        isSaving={challengeMutation.isPending}
                    />
                </div>
            )}
        </div>
    );
}

export default ChallengePage;
