import { useState, useEffect, ChangeEvent } from "react";
import * as api from "../api/api";
import { Challenge } from "../interfaces/Challenge";
import ChallengeSelector from "../components/ChallengeSelector";
import ChallengeForm from "../components/ChallengeForm";
//import { useTranslation } from "react-i18next";

function ChallengePage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [selectedChallenge, setSelectedChallenge] =
        useState<Challenge | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    //const { t } = useTranslation();

    useEffect(() => {
        const loadChallenges = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await api.getChallenges();
                setChallenges(data);
            } catch (err) {
                setError("Failed to load challenges.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadChallenges();
    }, []);

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
        challengeData: Omit<Challenge, "id"> | Challenge,
    ) => {
        setIsSaving(true);
        setError(null);
        try {
            if ("id" in challengeData) {
                await api.updateChallenge(challengeData.id, challengeData);
                setChallenges((prev) =>
                    prev.map((c) =>
                        c.id === challengeData.id ? challengeData : c,
                    ),
                );
                setSelectedChallenge(challengeData);
                alert("Challenge updated!");
            } else {
                const newChallenge = await api.createChallenge(challengeData);
                setChallenges((prev) => [...prev, newChallenge]);
                setShowAddForm(false);
                alert("Challenge added!");
            }
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to save challenge.";
            setError(message);
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <p>Loading challenges...</p>;

    return (
        <div className="page-container">
            <h1>Kihívások</h1>
            {error && !isSaving && (
                <p className="error-message">Error loading page: {error}</p>
            )}

            <ChallengeSelector
                challenges={challenges}
                selectedId={selectedChallenge?.id ?? null}
                onChange={handleSelectChallenge}
                disabled={isLoading || isSaving}
            />

            <button
                onClick={toggleAddChallengeForm}
                disabled={isLoading || isSaving}
                className="evo-margin"
            >
                {showAddForm ? "Vissza" : "Új kihívás felvétele"}
            </button>

            {error && isSaving && <p className="error-message">{error}</p>}

            {(showAddForm || (selectedChallenge && !showAddForm)) && (
                <ChallengeForm
                    key={selectedChallenge?.id ?? "new"}
                    initialData={showAddForm ? null : selectedChallenge}
                    onSubmit={handleFormSubmit}
                    onCancel={showAddForm ? toggleAddChallengeForm : undefined}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
}

export default ChallengePage;
