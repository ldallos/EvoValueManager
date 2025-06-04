import {useState, useEffect, ChangeEvent} from "react";
import * as api from "../api/api";
import {Character} from "../interfaces/Character";
import {Tool} from "../interfaces/Tool.ts";
import CharacterSelector from "../components/CharacterSelector";
import CharacterForm from "../components/CharacterForm";
import {TRAITS} from "../constants/traits.ts";

function CharacterPage() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [assignedTools, setAssignedTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(false);
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
                setError("Failed to load characters.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadCharacters();
    }, []);

    useEffect(() => {
        if (selectedCharacter) {
            const loadAssignedTools = async () => {
                try {
                    const toolsData = await api.getAssignedToolsForCharacter(selectedCharacter.id);
                    setAssignedTools(toolsData);
                } catch (err) {
                    console.error("Failed to load assigned tools for character:", err);
                    setAssignedTools([]);
                }
            };
            loadAssignedTools();
        } else {
            setAssignedTools([]);
        }
    }, [selectedCharacter]);


    const handleSelectCharacter = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(event.target.value);
        const char = characters.find((c) => c.id === selectedId) || null;
        setSelectedCharacter(char);
        setShowAddForm(false);
    };

    const toggleAddCharacterForm = () => {
        setShowAddForm((prev) => !prev);
        setSelectedCharacter(null);
    };

    const handleFormSubmit = async (
        characterData: Omit<Character, "id"> | Character,
    ) => {
        setIsSaving(true);
        setError(null);
        try {
            if ("id" in characterData) {
                await api.updateCharacter(characterData.id, characterData);
                const updatedCharacter = {...selectedCharacter, ...characterData};
                setCharacters((prev) =>
                    prev.map((c) => (c.id === updatedCharacter.id ? updatedCharacter : c)),
                );
                setSelectedCharacter(updatedCharacter);
                alert("Character updated!");
            } else {
                const newCharacter = await api.createCharacter(characterData);
                setCharacters((prev) => [...prev, newCharacter]);
                setShowAddForm(false);
                alert("Character added!");
            }
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to save character.";
            setError(message);
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const calculateTotalBonus = (traitProperty: keyof Tool): number => {
        return assignedTools.reduce((sum, tool) => sum + (Number(tool[traitProperty]) || 0), 0);
    }

    if (isLoading && !selectedCharacter) return <p>Loading characters...</p>;

    return (
        <div className="page-container">
            <h1>Csapattagok</h1>
            {error && !isSaving && (
                <p className="error-message">Error loading page: {error}</p>
            )}

            <CharacterSelector
                characters={characters}
                selectedId={selectedCharacter?.id ?? null}
                onChange={handleSelectCharacter}
                disabled={isLoading || isSaving}
            />

            <button
                onClick={toggleAddCharacterForm}
                disabled={isLoading || isSaving}
                className="evo-margin btn"
            >
                {showAddForm ? "Vissza" : "Új csapattag felvétele"}
            </button>

            {error && isSaving && <p className="error-message">{error}</p>}

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
                        isSaving={isSaving}
                    />
                    <div className="character-details evo-details-margin">
                        <h3>Statisztikák (Alapérték + Eszközbónusz = Effektív)</h3>
                        {TRAITS.map(trait => {
                            const baseStat = selectedCharacter[trait.property as keyof Character] as number;
                            const bonus = calculateTotalBonus((`${trait.property}Bonus`) as keyof Tool);
                            const effectiveStat = baseStat + bonus;
                            return (
                                <p key={trait.property}>
                                    {trait.title}: {baseStat}
                                    {bonus > 0 && ` (+${bonus} = ${effectiveStat})`}
                                    {bonus < 0 && ` (${bonus} = ${effectiveStat})`} {/* For potential negative bonuses if allowed later */}
                                </p>
                            );
                        })}

                        {assignedTools.length > 0 && (
                            <div className="assigned-tools-section evo-margin">
                                <h4>Hozzárendelt eszközök:</h4>
                                <ul>
                                    {assignedTools.map(tool => (
                                        <li key={tool.id}>{tool.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default CharacterPage;