import { useState, useEffect, ChangeEvent } from "react";
import * as api from "../api/api";
import axios from "axios";
import { Character } from "../interfaces/Character";
import { Challenge } from "../interfaces/Challenge";
import { ManagementDetails } from "../interfaces/Management";
import { Tool } from "../interfaces/Tool";
import CharacterSelector from "../components/CharacterSelector";
import ChallengeSelector from "../components/ChallengeSelector";
import {
    CHALLENGE_STATES,
    getStateText,
    getStateId,
    TRAITS,
} from "../constants/traits";

type AssignmentType = "available" | "assigned";

function ManagementPage() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [effectiveSelectedCharacter, setEffectiveSelectedCharacter] = useState<Character | null>(null);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [managementDetails, setManagementDetails] =
        useState<ManagementDetails | null>(null);
    const [assignmentType, setAssignmentType] =
        useState<AssignmentType>("available");

    const [detailsText, setDetailsText] = useState("");
    const [selectedStateId, setSelectedStateId] = useState<number>(1);

    const [isLoadingChars, setIsLoadingChars] = useState(false);
    const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    useEffect(() => {
        const loadCharacters = async () => {
            setIsLoadingChars(true);
            setError(null);
            try {
                const data = await api.getCharacters();
                setCharacters(data);
            } catch (err) {
                setError("Failed to load characters.");
                console.error(err);
            } finally {
                setIsLoadingChars(false);
            }
        };
        loadCharacters();
    }, []);

    useEffect(() => {
        setChallenges([]);
        setSelectedChallenge(null);
        setManagementDetails(null);
        setDetailsText("");
        setSelectedStateId(1);
        setError(null);
        setEffectiveSelectedCharacter(selectedCharacter);

        if (!selectedCharacter) {
            return;
        }
        const loadCharacterWithToolsForDisplay = async () => {
            if (!selectedCharacter) {
                setEffectiveSelectedCharacter(null);
                return;
            }
            try {
                const baseChar = await api.getCharacterById(selectedCharacter.id);
                const assignedTools = await api.getAssignedToolsForCharacter(selectedCharacter.id);
                let tempEffectiveChar = { ...baseChar };
                assignedTools.forEach(tool => {
                    TRAITS.forEach(trait => {
                        const bonusKey = `${trait.property}Bonus` as keyof Tool;
                        const statKey = trait.property as keyof Character;
                        if (tool[bonusKey] != null) {
                            (tempEffectiveChar[statKey] as number) += (tool[bonusKey] as number);
                        }
                    });
                });
                setEffectiveSelectedCharacter(tempEffectiveChar);
            } catch (err) {
                console.error("Failed to load effective character stats for display:", err);
                setEffectiveSelectedCharacter(selectedCharacter);
            }
        };
        loadCharacterWithToolsForDisplay();


        const loadChallenges = async () => {
            setIsLoadingChallenge(true);
            try {
                let data: Challenge[];
                if (assignmentType === "available") {
                    data = await api.getAvailableChallengesForCharacter(
                        selectedCharacter.id,
                    );
                } else {
                    data = await api.getAssignedChallengesForCharacter(
                        selectedCharacter.id,
                    );
                }
                setChallenges(data);
            } catch (err) {
                setError(`Failed to load ${assignmentType} challenges.`);
                console.error(err);
            } finally {
                setIsLoadingChallenge(false);
            }
        };

        loadChallenges();
    }, [selectedCharacter, assignmentType]);

    useEffect(() => {
        if (
            !selectedCharacter ||
            !selectedChallenge ||
            assignmentType !== "assigned"
        ) {
            setManagementDetails(null);
            setDetailsText("");
            setSelectedStateId(1);
            return;
        }

        const loadDetails = async () => {
            setIsLoadingDetails(true);
            setError(null);
            try {
                const data = await api.getManagementDetails(
                    selectedCharacter.id,
                    selectedChallenge.id,
                );
                setManagementDetails(data);
                setDetailsText(data.details || "");
                setSelectedStateId(getStateId(data.state));
            } catch (err) {
                if (selectedCharacter && selectedChallenge && assignmentType === "assigned") {
                    setError("Failed to load management details.");
                    console.error("Error in loadDetails:", err);
                }
                setManagementDetails(null);
                setDetailsText("");
                setSelectedStateId(1);
            } finally {
                setIsLoadingDetails(false);
            }
        };

        loadDetails();
    }, [selectedCharacter, selectedChallenge, assignmentType]);

    const handleAssignmentTypeChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        setAssignmentType(event.target.value as AssignmentType);
    };

    const handleCharacterSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const charId = Number(event.target.value);
        const character = characters.find((c) => c.id === charId) || null;
        setSelectedCharacter(character);
    };

    const handleChallengeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const challengeId = Number(event.target.value);
        const newSelectedChallenge = challenges.find((c) => c.id === challengeId) || null;
        setSelectedChallenge(newSelectedChallenge);
        if (assignmentType === "available" || !newSelectedChallenge) {
            setManagementDetails(null);
            setDetailsText("");
            setSelectedStateId(1);
        }
    };

    const checkStatSufficiency = (characterForCheck: Character): string[] => {
        const insufficient: string[] = [];
        if (!characterForCheck || !selectedChallenge) return insufficient;

        TRAITS.forEach((trait) => {
            const reqProp = `required${capitalize(trait.property)}` as keyof Challenge;
            const charStat = characterForCheck[
                trait.property as keyof Character
                ] as number;
            const requiredStat = selectedChallenge[reqProp] as
                | number
                | null
                | undefined;

            if (requiredStat != null && charStat < requiredStat) {
                insufficient.push(trait.title.toLowerCase());
            }
        });
        return insufficient;
    };

    const handleAssign = async () => {
        if (!selectedCharacter || !selectedChallenge) return;

        setIsSaving(true);
        setError(null);

        try {
            const freshBaseCharacter = await api.getCharacterById(selectedCharacter.id);
            const assignedTools = await api.getAssignedToolsForCharacter(selectedCharacter.id);

            let characterWithBonuses = { ...freshBaseCharacter };
            assignedTools.forEach(tool => {
                TRAITS.forEach(trait => {
                    const bonusKey = `${trait.property}Bonus` as keyof Tool;
                    const statKey = trait.property as keyof Character;
                    if (tool[bonusKey] != null) {
                        (characterWithBonuses[statKey] as number) += (tool[bonusKey] as number);
                    }
                });
            });

            setEffectiveSelectedCharacter(characterWithBonuses);

            const insufficientStats = checkStatSufficiency(characterWithBonuses);
            if (insufficientStats.length > 0) {
                setError(
                    `Insufficient stats (after considering tools): ${insufficientStats.join(", ")}. Cannot assign challenge.`,
                );
                setIsSaving(false);
                return;
            }

            await api.assignChallenge({
                characterId: selectedCharacter.id,
                challengeId: selectedChallenge.id,
                stateId: selectedStateId,
                details: detailsText || null,
            });
            alert("Challenge assigned successfully!");
            setAssignmentType("assigned");
        } catch (err: any) {
            console.error("Assign Error:", err);
            let specificError = "Failed to assign challenge.";
            if (axios.isAxiosError(err) && err.response) {
                if (
                    typeof err.response.data === "string" &&
                    err.response.data.length > 0
                ) {
                    specificError = err.response.data;
                } else if (
                    err.response.data &&
                    typeof err.response.data.message === "string"
                ) {
                    specificError = err.response.data.message;
                }
            } else if (err instanceof Error) {
                specificError = err.message;
            }
            setError(specificError);
        } finally {
            setIsSaving(false);
        }
    };
    const handleUpdate = async () => {
        if (!selectedCharacter || !selectedChallenge) return;
        setIsSaving(true);
        setError(null);
        try {
            await api.updateManagement(selectedCharacter.id, selectedChallenge.id, {
                stateId: selectedStateId,
                details: detailsText || null,
            });
            setManagementDetails((prev) =>
                prev
                    ? {
                        ...prev,
                        state: getStateText(selectedStateId),
                        details: detailsText || null,
                    }
                    : null,
            );
            alert("Management details updated!");
        } catch (err) {
            setError("Failed to update details.");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = async () => {
        if (!selectedCharacter || !selectedChallenge) return;

        if (selectedStateId !== 3) {
            setError(
                'Challenge must be in "Completed" state to close and gain stats.',
            );
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            const updatedCharDataFromClose = await api.closeChallenge(
                selectedCharacter.id,
                selectedChallenge.id,
            );
            alert("Challenge closed and stats updated!");

            setSelectedCharacter(updatedCharDataFromClose);

            setCharacters((prev) =>
                prev.map((c) => (c.id === updatedCharDataFromClose.id ? updatedCharDataFromClose : c)),
            );
        } catch (err: any) {
            console.error("Close Error:", err);
            let specificError = "Failed to close challenge.";
            if (axios.isAxiosError(err) && err.response) {
                if (
                    typeof err.response.data === "string" &&
                    err.response.data.length > 0
                ) {
                    specificError = err.response.data;
                } else if (
                    err.response.data &&
                    typeof err.response.data.message === "string"
                ) {
                    specificError = err.response.data.message;
                }
            } else if (err instanceof Error) {
                specificError = err.message;
            }
            setError(specificError);
        } finally {
            setIsSaving(false);
        }
    };

    const getActionButton = () => {
        if (!selectedCharacter || !selectedChallenge) return null;

        if (assignmentType === "available") {
            return (
                <button onClick={handleAssign} disabled={isSaving}>
                    Kihívás felvétele
                </button>
            );
        } else if (managementDetails && !managementDetails.isClosed) {
            return (
                <>
                    <button
                        onClick={handleUpdate}
                        disabled={isSaving || isLoadingDetails}
                    >
                        Frissítés
                    </button>

                    {selectedStateId === 3 && (
                        <button
                            onClick={handleClose}
                            disabled={isSaving || isLoadingDetails}
                        >
                            Lezárás
                        </button>
                    )}
                </>
            );
        } else if (managementDetails && managementDetails.isClosed) {
            return (
                <p>
                    <i>Kihívás lezárva.</i>
                </p>
            );
        }
        return null;
    };

    const charToDisplay = effectiveSelectedCharacter || selectedCharacter;


    return (
        <div className="page-container management-page">
            <h1>Vezetés/Fejlesztés</h1>

            {isLoadingChars && <p>Loading characters...</p>}
            {error && <p className="error-message">Error: {error}</p>}

            <div className="selectors-row">
                <div className="assignment-type-selector evo-margin">
                    <label>Válassz egy opciót:</label>
                    <select
                        className="evo-dropdown"
                        value={assignmentType}
                        onChange={handleAssignmentTypeChange}
                        disabled={isSaving || isLoadingChars || isLoadingChallenge}
                    >
                        <option value="available">Új kihívás felvétele</option>
                        <option value="assigned">Kihívások kezelése</option>
                    </select>
                </div>

                <CharacterSelector
                    characters={characters}
                    selectedId={selectedCharacter?.id ?? null}
                    onChange={handleCharacterSelect}
                    disabled={isLoadingChars || isSaving}
                />

                {selectedCharacter && (
                    <ChallengeSelector
                        challenges={challenges}
                        selectedId={selectedChallenge?.id ?? null}
                        onChange={handleChallengeSelect}
                        label={
                            assignmentType === "available"
                                ? "Felvehető kihivások:"
                                : "Felvett kihívások:"
                        }
                        disabled={isLoadingChallenge || !selectedCharacter || isSaving}
                    />
                )}
                {isLoadingChallenge && selectedCharacter && <p>Loading challenges...</p>}
            </div>

            {charToDisplay && selectedChallenge && (
                <div className="details-action-row">
                    {isLoadingDetails && <p>Loading details...</p>}

                    <div className="character-summary">
                        <h4>{charToDisplay.name}
                            {effectiveSelectedCharacter && selectedCharacter && effectiveSelectedCharacter !== selectedCharacter && " (eszközökkel)"}
                        </h4>
                        {TRAITS.map((trait) => (
                            <p key={trait.property}>
                                {trait.title}:{" "}
                                {charToDisplay[trait.property as keyof Character]}
                            </p>
                        ))}
                    </div>

                    <div className="challenge-summary">
                        <h4>
                            {selectedChallenge.title}
                            {assignmentType === "available"
                                ? " követelményei"
                                : " szerezhető értékei"}
                        </h4>
                        {TRAITS.map((trait) => {
                            let valueToShow: number | null | undefined;
                            const capProperty = capitalize(trait.property);

                            if (assignmentType === "available") {
                                const requiredPropName =
                                    `required${capProperty}` as keyof Challenge;
                                valueToShow = selectedChallenge[requiredPropName] as
                                    | number
                                    | null
                                    | undefined;
                            } else {
                                const gainablePropName =
                                    `gainable${capProperty}` as keyof Challenge;
                                valueToShow = selectedChallenge[gainablePropName] as
                                    | number
                                    | null
                                    | undefined;
                            }

                            if (valueToShow != null && valueToShow > 0) {
                                return (
                                    <p key={trait.property}>
                                        {trait.title}: {valueToShow}
                                    </p>
                                );
                            } else {
                                return (
                                    <p key={trait.property} style={{ opacity: 0.5 }}>
                                        {trait.title}: {valueToShow ?? 0}
                                    </p>
                                );
                            }
                        })}
                    </div>

                    <div className="management-form">
                        <h4>Részletek</h4>
                        <label htmlFor="state">Állapot:</label>
                        <select
                            className="evo-dropdown"
                            id="state"
                            value={selectedStateId}
                            onChange={(e) => setSelectedStateId(Number(e.target.value))}
                            disabled={
                                isSaving ||
                                isLoadingDetails ||
                                (managementDetails?.isClosed ?? false) ||
                                (assignmentType === "available" && !(charToDisplay && selectedChallenge))
                            }
                        >
                            {Object.entries(CHALLENGE_STATES).map(([id, text]) => (
                                <option key={id} value={id}>
                                    {text}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="details">Megjegyzések:</label>
                        <textarea
                            className="management-details-container management-details"
                            id="details"
                            rows={4}
                            value={detailsText}
                            onChange={(e) => setDetailsText(e.target.value)}
                            placeholder="Enter details..."
                            disabled={
                                isSaving ||
                                isLoadingDetails ||
                                (managementDetails?.isClosed ?? false)
                            }
                        />
                        <div className="action-buttons">
                            {getActionButton()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManagementPage;