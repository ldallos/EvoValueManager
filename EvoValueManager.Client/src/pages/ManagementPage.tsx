import { useState, useEffect, ChangeEvent, useCallback } from "react";
import * as api from "../api/api";
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
import { useTranslation } from "react-i18next";

type AssignmentType = "available" | "assigned";

function ManagementPage() {
    const { t } = useTranslation();
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

    const [isLoadingChars, setIsLoadingChars] = useState(true);
    const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    
    useEffect(() => {
        let isMounted = true;
        const loadInitialCharacters = async () => {
            setIsLoadingChars(true);
            setError(null);
            try {
                const data = await api.getCharacters();
                if (isMounted) setCharacters(data);
            } catch (err) {
                if (isMounted) setError(t("failedToLoadCharactersError"));
            } finally {
                if (isMounted) setIsLoadingChars(false);
            }
        };
        loadInitialCharacters();
        return () => { isMounted = false; };
    }, [t]);
    
    useEffect(() => {
        if (!selectedCharacter) {
            setChallenges([]);
            setEffectiveSelectedCharacter(null);
            return;
        }

        let isMounted = true;
        const loadDependencies = async () => {
            setIsLoadingDependencies(true);
            setError(null);
            try {
                const [baseChar, tools, characterChallenges] = await Promise.all([
                    api.getCharacterById(selectedCharacter.id),
                    api.getAssignedToolsForCharacter(selectedCharacter.id),
                    assignmentType === 'available'
                        ? api.getAvailableChallengesForCharacter(selectedCharacter.id)
                        : api.getAssignedChallengesForCharacter(selectedCharacter.id),
                ]);

                if (!isMounted) return;

                let effectiveChar = { ...baseChar };
                tools.forEach(tool => {
                    TRAITS.forEach(trait => {
                        const bonusKey = `${trait.property}Bonus` as keyof Tool;
                        const statKey = trait.property as keyof Character;
                        if (tool[bonusKey] != null) {
                            (effectiveChar[statKey] as number) += (tool[bonusKey] as number);
                        }
                    });
                });

                setEffectiveSelectedCharacter(effectiveChar);
                setChallenges(characterChallenges);

            } catch (err) {
                if (isMounted) setError(t("failedToLoadCharacterDataError"));
            } finally {
                if (isMounted) setIsLoadingDependencies(false);
            }
        };

        loadDependencies();
        return () => { isMounted = false; };
    }, [selectedCharacter, assignmentType, t]);
    
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

        let isMounted = true;
        const loadDetails = async () => {
            setIsLoadingDetails(true);
            try {
                const data = await api.getManagementDetails(selectedCharacter.id, selectedChallenge.id);
                if (isMounted) {
                    setManagementDetails(data);
                    setDetailsText(data.details || "");
                    setSelectedStateId(getStateId(data.state));
                    setError(null);
                }
            } catch (err: any) {
                if (isMounted) {
                    if (err.response?.status === 404) {
                        console.log("Management details not found for this combo, which is expected during transition.");
                    } else {
                        setError(t("failedToLoadManagementDetailsError"));
                    }
                    setManagementDetails(null);
                    setDetailsText("");
                    setSelectedStateId(1);
                }
            } finally {
                if (isMounted) setIsLoadingDetails(false);
            }
        };

        loadDetails();
        return () => { isMounted = false; };
    }, [selectedChallenge, selectedCharacter, assignmentType, t]);


    const handleCharacterSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedChallenge(null);
        setManagementDetails(null);
        setError(null);
        const charId = Number(event.target.value);
        setSelectedCharacter(characters.find((c) => c.id === charId) || null);
    };

    const handleAssignmentTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedChallenge(null);
        setManagementDetails(null);
        setError(null);
        setAssignmentType(event.target.value as AssignmentType);
    };

    const handleChallengeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const challengeId = Number(event.target.value);
        setSelectedChallenge(challenges.find((c) => c.id === challengeId) || null);
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
                insufficient.push(t(trait.property).toLowerCase());
            }
        });
        return insufficient;
    };

    const handleAssign = useCallback(async () => {
        if (!selectedCharacter || !selectedChallenge) return;
        setIsSaving(true);
        setError(null);
        try {
            const characterForCheck = effectiveSelectedCharacter || selectedCharacter;
            const insufficientStats = checkStatSufficiency(characterForCheck);
            if (insufficientStats.length > 0) {
                setError(t("insufficientStatsError", 
                    { stats : insufficientStats.join(", ") })
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
            alert(t("challengeAssignedSuccess"));
            setAssignmentType("assigned");
        } catch (err: any) {
            const message = err.response?.data?.message || err.response?.data || t("failedToAssignChallengeError");
            setError(message);
        } finally {
            setIsSaving(false);
        }
    }, [effectiveSelectedCharacter, selectedCharacter, selectedChallenge, selectedStateId, detailsText, t]);

    const handleUpdate = async () => {
        if (!selectedCharacter || !selectedChallenge) return;
        setIsSaving(true);
        setError(null);
        try {
            await api.updateManagement(selectedCharacter.id, selectedChallenge.id, {
                stateId: selectedStateId,
                details: detailsText || null,
            });
            setManagementDetails((prev) => prev ? { ...prev,
                state: getStateText(selectedStateId),
                details: detailsText || null } : null);
            alert(t("managementUpdatedSuccess"));
        } catch (err) {
            setError(t("failedToUpdateDetailsError"));
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = async () => {
        if (!selectedCharacter || !selectedChallenge) return;
        if (selectedStateId !== 3) {
            setError(t("challengeMustBeCompletedError"));
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            const updatedCharDataFromClose = await api.closeChallenge(selectedCharacter.id, selectedChallenge.id);
            alert(t("challengeClosedSuccess"));
            setCharacters((prev) => prev.map((c) => (c.id === updatedCharDataFromClose.id ? updatedCharDataFromClose : c)));
            setSelectedCharacter(updatedCharDataFromClose);
        } catch (err: any) {
            const message = err.response?.data?.message || err.response?.data || t("failedToCloseChallengeError");
            setError(message);
        } finally {
            setIsSaving(false);
        }
    };

    const getActionButton = () => {
        if (!selectedCharacter || !selectedChallenge) return null;
        if (assignmentType === "available") {
            return <button onClick={handleAssign} disabled={isSaving || isLoadingDependencies}>{t('assignChallenge')}</button>;
        } else if (managementDetails && !managementDetails.isClosed) {
            return (
                <>
                    <button
                        onClick={handleUpdate}
                        disabled={isSaving || isLoadingDetails}>{t('update')}</button>
                    
                    {selectedStateId === 3 && (
                        <button
                            onClick={handleClose}
                            disabled={isSaving || isLoadingDetails}>{t('close')}</button>)}
                </>
            );
        } else if (managementDetails && managementDetails.isClosed) {
            return (
            <p>
                <i>{t('challengeIsClosed')}</i>
            </p>
            );
        }
        return null;
    };

    const charToDisplay = effectiveSelectedCharacter || selectedCharacter;
    const isLoading = isLoadingChars || isLoadingDependencies;

    return (
        <div className="page-container management-page">
            <h1>{t('managementTitle')}</h1>
            {error && <p className="error-message">Error: {error}</p>}

            <div className="selectors-row">
                <div className="assignment-type-selector evo-margin">
                    <label htmlFor="assignmentTypeSelector">{t('selectAnOption')}:</label>
                    <select
                        id="assignmentTypeSelector"
                        name="assignmentTypeSelector"
                        className="evo-dropdown"
                        value={assignmentType}
                        onChange={handleAssignmentTypeChange}
                        disabled={isLoading || isSaving}
                    >
                        <option value="available">{t('assignNewChallenge')}</option>
                        <option value="assigned">{t('manageChallenges')}</option>
                    </select>
                </div>
                
                <CharacterSelector
                    characters={characters}
                    selectedId={selectedCharacter?.id ?? null}
                    onChange={handleCharacterSelect}
                    disabled={isLoadingChars || isSaving}
                />

                {selectedCharacter && (
                    <>
                        {isLoadingDependencies ? <p>{t('loading')}...</p> : (
                            <ChallengeSelector
                                challenges={challenges}
                                selectedId={selectedChallenge?.id ?? null}
                                onChange={handleChallengeSelect}
                                label={
                                assignmentType === "available" 
                                    ? t('availableChallengesLabel') 
                                    : t('assignedChallengesLabel')
                            }
                                disabled={
                                !selectedCharacter || isSaving}
                            />
                        )}
                    </>
                )}
            </div>

            {charToDisplay && selectedChallenge && (
                <div className="details-action-row">
                    {isLoadingDetails ? <p>{t('loadingDetails')}</p> : (
                        <>
                            <div className="character-summary">
                                <h4>{charToDisplay.name}
                                    {effectiveSelectedCharacter && selectedCharacter && effectiveSelectedCharacter.id === selectedCharacter.id &&
                                        TRAITS.some(trait => 
                                            (effectiveSelectedCharacter[trait.property as keyof Character] as number) 
                                            !== (selectedCharacter[trait.property as keyof Character] as number)) 
                                        && " (eszközökkel)"}
                                </h4>
                                {TRAITS.map((trait) => (
                                    <p key={trait.property}>{t(trait.property)}: {charToDisplay[trait.property as keyof Character]}
                                    </p>
                                ))}
                            </div>
                            <div className="challenge-summary">
                                <h4>
                                    {selectedChallenge.title}
                                    {assignmentType === "available" ? ` ${t('requirements')}` : ` ${t('gainableValues')}`}
                                </h4>
                                {TRAITS.map((trait) => {
                                    let valueToShow: number | null | undefined;
                                    const capProperty = capitalize(trait.property);
                                    
                                    if (assignmentType === "available") {
                                        valueToShow = selectedChallenge[`required${capProperty}` as keyof Challenge
                                            ] as
                                            number
                                            | null
                                            | undefined;
                                    } else {
                                        valueToShow = selectedChallenge[`gainable${capProperty}` as keyof Challenge
                                            ] as
                                            number
                                            | null
                                            | undefined;
                                    }
                                    if (valueToShow != null && valueToShow > 0) {
                                        return (
                                        <p key={trait.property}>{t(trait.property)}: {valueToShow}
                                        </p>
                                    );
                                    } else {
                                        return (
                                        <p key={trait.property} style={{ opacity: 0.5 }}>{t(trait.property)}: {valueToShow ?? 0}
                                        </p>
                                    );
                                    }
                                })}
                            </div>
                            <div className="management-form">
                                <h4>{t('details')}</h4>
                                <label htmlFor="state">{t('state')}:</label>
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
                                }>
                                    {Object.entries(CHALLENGE_STATES).map(([id, text]) => (
                                        <option key={id} value={id}>
                                            {text}
                                        </option>
                                    ))}
                                </select>
                                
                                <label htmlFor="details">{t('notes')}:</label>
                                <textarea
                                    className="management-details-container management-details"
                                          id="details"
                                          rows={4}
                                          value={detailsText}
                                          onChange={(e) => setDetailsText(e.target.value)}
                                          placeholder={t('enterDetailsPlaceholder')} disabled={
                                    isSaving ||
                                    isLoadingDetails ||
                                    (managementDetails?.isClosed ?? false)
                                }
                                />
                                <div className="action-buttons">
                                    {getActionButton()}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default ManagementPage;