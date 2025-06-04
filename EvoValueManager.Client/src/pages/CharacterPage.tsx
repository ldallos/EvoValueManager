import { useState, useEffect, ChangeEvent } from "react";
import * as api from "../api/api";
import { Character } from "../interfaces/Character";
import CharacterSelector from "../components/CharacterSelector";
import CharacterForm from "../components/CharacterForm";
//import { useTranslation } from "react-i18next";

function CharacterPage() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] =
        useState<Character | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
   // const { t } = useTranslation();

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
                setCharacters((prev) =>
                    prev.map((c) =>
                        c.id === characterData.id ? characterData : c,
                    ),
                );
                setSelectedCharacter(characterData);
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

    if (isLoading) return <p>Loading characters...</p>;

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
                className="evo-margin"
            >
                {showAddForm ? "Vissza" : "Új csapattag felvétele"}
            </button>

            {error && isSaving && <p className="error-message">{error}</p>}

            {(showAddForm || (selectedCharacter && !showAddForm)) && (
                <CharacterForm
                    key={selectedCharacter?.id ?? "new"}
                    initialData={showAddForm ? null : selectedCharacter}
                    onSubmit={handleFormSubmit}
                    onCancel={showAddForm ? toggleAddCharacterForm : undefined}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
}

export default CharacterPage;
