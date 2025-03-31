import { React, useState, useEffect } from 'react';


interface Trait {
    title: string;
    property: keyof Character;
    imageSmall: string;
    description: string;
}

interface Character {
    id: number;
    name: string;
    bravery: number;
    trust: number;
    presence: number;
    growth: number;
    care: number;
}

const traits: Trait[] = [
    { title: "Fejlődés", property: "growth", imageSmall: "/Content/Images/fejlodes_small.png", description: "Hiszünk abban, hogy sikereink kulcsa tudásunk, mérnöki megoldásaink és adott szavunk megbízhatósága." },
    { title: "Gondoskodás", property: "care", imageSmall: "/Content/Images/gondoskodas_small.png", description: "Az élet minden területén jelen vagyunk, hatással vagyunk arra, hogy a jövőnk gördülékenyebb és élhetőbb legyen." },
    { title: "Jelenlét", property: "presence", imageSmall: "/Content/Images/jelenlet_small.png", description: "Tudjuk, hogy minden helyzetben ott a szakmai fejlődés lehetősége, amihez te behozhatod saját személyiséged és érdeklődési köröd színességét is." },
    { title: "Megbízhatóság", property: "trust", imageSmall: "/Content/Images/megbizhatosag_small.png", description: "Az evosoftban otthon vagyunk, törődünk egymással. A munkán kívül is színes közösséget alkotunk." },
    { title: "Merészség", property: "bravery", imageSmall: "/Content/Images/mereszseg_small.png", description: "Folyamatosan a jobbító szándék vezérel minket. Merünk megkérdőjelezni és tenni." }
];

const Character = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    useEffect(() => {
        fetchCharacters(); // az oldal betöltödésekor 1x lefut az adatok betöltése
    }, []);

    const fetchCharacters = async () => {
        try {
            const response = await fetch('/api/characters');
            if (!response.ok) throw new Error('Failed to fetch characters');
            const data = await response.json();
            setCharacters(data);
        } catch (error) {
            console.error('Failed to fetch characters:', error);
        }
    };
    

    const handleDropdownOpen = () => { // csak akkor tölti be az adatokat mikor megyitjuk a menüt
        fetchCharacters(); 
    };

    

    const handleCharacterSelection = (event: React.FormEvent) => {
        event.preventDefault();
        const fetchCharactersByID = async (id: number) => {
                try {
                    console.log("Lekérdezés karakter ID alapján:", id);
                    const response = await fetch(`/api/characters/asd?id=${id}`);
                    if (!response.ok) throw new Error('Failed to fetch characters');
                    const data = await response.json();
                    setSelectedCharacter(data);
                } catch (error) {
                    console.error('Failed to fetch characters:', error);
                }
        };
       fetchCharactersByID(selectedCharacterId);
    };

    return (
        <>
        <h2>Csapattag kezelő</h2>
        <div className="evo-flex">
            <form onSubmit={handleCharacterSelection}>
                <select
                    value={selectedCharacterId || ''}
                    onChange={(e) => setSelectedCharacterId(Number(e.target.value))}
                        className="form-control evo-margin evo-dropdown evo-dropdown-select"
                        onFocus={handleDropdownOpen}
                >
                    <option value="" disabled>Válassz egy csapattagot</option>
                    {characters.length > 0 ? (
                        characters.map((character) => (
                            <option key={character.id} value={character.id}>{character.name}</option>
                        ))
                    ) : (
                        <option value="" disabled>Nem található karakter</option>
                    )}
                </select>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }} disabled={!selectedCharacterId}>
                    Kiválasztás
                </button>
            </form>
        </div>
            {/* Selected character details */}
            {selectedCharacter && (
                <div className="evo-details-margin">
                    <table>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: "center" }}><strong>Név:</strong></td>
                                <td className="evo-table-values">{selectedCharacter.name}</td>
                            </tr>
                            {traits.map((trait) => (
                                <tr key={trait.property}>
                                    <td>
                                        <div className="evo-traits-image-small">
                                            <img src={trait.imageSmall} alt={trait.title} title={trait.title} />
                                        </div>
                                    </td>
                                    <td className="evo-table-values">{selectedCharacter[trait.property]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default Character;
