import { useState, useEffect, ChangeEvent } from "react";
import * as api from "../api/api";
import { Challenge } from "../interfaces/Challenge";
import ChallengeSelector from "../components/ChallengeSelector";
import ChallengeForm from "../components/ChallengeForm";
import { useTranslation } from "react-i18next";

function ChallengePage() {
    const { t } = useTranslation();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [selectedChallenge, setSelectedChallenge] =
        useState<Challenge | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const loadChallenges = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await api.getChallenges();
                setChallenges(data);
            } catch (err) {
                setError(t("failedToLoadChallengesError"));
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadChallenges();
    }, [t]);

    const handleSelectChallenge = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(event.target.value);
        const chal = challenges.find((c) => c.id === selectedId) || null;
        setSelectedChallenge(chal);
        setShowAddForm(false);
    };

    const toggleAddChallengeForm = () => {
        setShowAddForm((prev) => !prev);
        setSelectedChallenge(null);
    };

    const handleFormSubmit = async (
        challengeData: Omit<Challenge, "id"> | Challenge) => {
        setIsSaving(true);
        setError(null);
        try {
            if ("id" in challengeData && challengeData.id) {
                const updated = challengeData as Challenge;
                await api.updateChallenge(updated.id, updated);
                setChallenges((prev) =>
                    prev.map((c) => (c.id === updated.id ? updated : c))
                );
                setSelectedChallenge(updated);
                alert(t("challengeUpdatedAlert"));
            } else {
                const newChallenge = await api.createChallenge(challengeData);
                setChallenges((prev) => [...prev, newChallenge]);
                setShowAddForm(false);
                setSelectedChallenge(newChallenge);
                alert(t("challengeAddedAlert"));
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.response?.data || t("failedToSaveChangesError");
            setError(message);
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <p>{t("loadingChallenges")}</p>;

    return (
        <div className="page-container">
            <h1>{t("challengesTitle")}</h1>
            {error && !isSaving && (
                <p className="error-message">{t("errorLoadingPage")}: {error}</p>
            )}

            <ChallengeSelector
                challenges={challenges}
                selectedId={selectedChallenge?.id ?? null}
                onChange={handleSelectChallenge}
                label={t("selectChallengeLabel")}
                disabled={isLoading || isSaving}
            />

            <button
                onClick={toggleAddChallengeForm}
                disabled={isLoading || isSaving}
                className="evo-margin btn"
            >
                {showAddForm ? t("back") : t("addNewChallengeButton")}
            </button>

            {error && isSaving && <p className="error-message">{t("errorSavingForm")}: {error}</p>}

            {(showAddForm || (selectedChallenge && !showAddForm)) && (
                <ChallengeForm
                    key={selectedChallenge?.id ?? "new-challenge-form"}
                    initialData={showAddForm ? null : selectedChallenge}
                    onSubmit={handleFormSubmit}
                    onCancel={showAddForm ? toggleAddChallengeForm : () => setSelectedChallenge(null)}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
}

export default ChallengePage;
