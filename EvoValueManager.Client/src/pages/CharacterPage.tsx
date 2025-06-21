import {useState, useEffect, ChangeEvent, useCallback} from "react";
import * as api from "../api/api";
import {Character} from "../interfaces/Character";
import {Tool} from "../interfaces/Tool.ts";
import CharacterSelector from "../components/CharacterSelector";
import CharacterForm from "../components/CharacterForm";
import {TRAITS} from "../constants/traits.ts";
import {useTranslation} from "react-i18next";

function CharacterPage() {
    const { t } = useTranslation();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [assignedTools, setAssignedTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingTools, setIsLoadingTools] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const loadCharacters = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await api.getCharacters();
                setCharacters(data);
            } catch (err) {
                setError(t("failedToLoadCharactersError"));
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadCharacters();
    }, [t]);

    useEffect(() => {
        if (!selectedCharacter) {
            setAssignedTools([]);
            return;
        }

        const loadAssignedToolsForCharacter = async () => {
            setIsLoadingTools(true);
            try {
                const toolsData = await api.getAssignedToolsForCharacter(selectedCharacter.id);
                setAssignedTools(toolsData);
            } catch (err) {
                console.error("Failed to load assigned tools for character:", err);
                setError(prev => prev || t("failedToLoadAssignedToolsError"));
                setAssignedTools([]);
            } finally {
                setIsLoadingTools(false);
            }
        };

        loadAssignedToolsForCharacter();
    }, [selectedCharacter, t]);

    const handleSelectCharacter = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(event.target.value);
        const char = characters.find((c) => c.id === selectedId) || null;
        setSelectedCharacter(char);
        setShowAddForm(false);
        setError(null);
    };

    const toggleAddCharacterForm = () => {
        setShowAddForm((prev) => !prev);
        setSelectedCharacter(null);
        setError(null);
    };

    const handleFormSubmit = useCallback(async (
        characterPayload: Omit<Character, "id"> | Character,
    ) => {
        setIsSaving(true);
        setError(null);
        try {
            if ("id" in characterPayload && characterPayload.id) {
                const charToUpdate = characterPayload as Character;
                await api.updateCharacter(charToUpdate.id, charToUpdate);
                const updatedList = characters.map((c) => (c.id === charToUpdate.id ? charToUpdate : c));
                setCharacters(updatedList);
                setSelectedCharacter(charToUpdate);
                alert(t("characterUpdatedAlert"));
            } else {
                const newCharacter = await api.createCharacter(characterPayload as Omit<Character, "id">);
                setCharacters((prev) => [...prev, newCharacter]);
                setShowAddForm(false);
                setSelectedCharacter(newCharacter);
                alert(t("characterAddedAlert"));
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.response?.data || t("failedToSaveChangesError");
            setError(message);
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    }, [t, characters]);

    const calculateTotalBonus = (traitProperty: keyof Tool): number => {
        return assignedTools.reduce((sum, tool) => {
            const bonus = tool[traitProperty];
            return sum + (typeof bonus === 'number' ? bonus : 0);
        }, 0);
    }

    if (isLoading) return <p>{t("loadingCharacters")}</p>;

    return (
        <div className="page-container">
            <h1>{t("charactersTitle")}</h1>
            {error && !isSaving && <p className="error-message">{t("errorLoadingPage")}: {error}</p>}

            <CharacterSelector
                characters={characters}
                selectedId={selectedCharacter?.id ?? null}
                onChange={handleSelectCharacter}
                label={t("selectCharacterLabel")}
                disabled={isLoading || isSaving}
            />

            <button onClick={toggleAddCharacterForm} disabled={isLoading || isSaving} className="evo-margin btn">
                {showAddForm ? t("back") : t("addNewCharacterButton")}
            </button>

            {error && isSaving && <p className="error-message">{t("errorSavingForm")}: {error}</p>}

            {showAddForm && (
                <CharacterForm
                    key={"new-character-form"}
                    initialData={null}
                    onSubmit={handleFormSubmit}
                    onCancel={toggleAddCharacterForm}
                    isSaving={isSaving}
                />
            )}

            {!showAddForm && selectedCharacter && (
                <>
                    <CharacterForm
                        key={selectedCharacter.id}
                        initialData={selectedCharacter}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setSelectedCharacter(null)}
                        isSaving={isSaving}
                    />
                    {isLoadingTools ? <p>{t("loadingToolsForCharacter")}</p> : (
                        <div className="character-details evo-details-margin">
                            <h3>{t("statsTitleEffective")}</h3>
                            {TRAITS.map(trait => {
                                const baseStat = selectedCharacter[trait.property as keyof Character] as number;
                                const bonus = calculateTotalBonus((`${trait.property}Bonus`) as keyof Tool);
                                const effectiveStat = baseStat + bonus;
                                return (
                                    <p key={trait.property}>
                                        {t(trait.property)}: {baseStat}
                                        {bonus !== 0 && ` (${bonus > 0 ? '+' : ''}${bonus} = ${effectiveStat})`}
                                    </p>
                                );
                            })}
                            <div className="assigned-tools-section evo-margin">
                                <h4>{t("assignedToolsTitle")}:</h4>
                                {assignedTools.length > 0 ? (
                                    <ul>
                                        {assignedTools.map(tool => <li key={tool.id}>{tool.name}</li>)}
                                    </ul>
                                ) : (
                                    <p>{t("noToolsAssignedToCharacter")}</p>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default CharacterPage;